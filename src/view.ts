import type { Moment } from "moment";
import {
  getDailyNote,
  getDailyNoteSettings,
  getDateFromFile,
  getWeeklyNoteSettings,
} from "obsidian-daily-notes-interface";
import { FileView, TFile, ItemView, WorkspaceLeaf, MarkdownView } from "obsidian";
import { get } from "svelte/store";

import { TRIGGER_ON_OPEN, VIEW_TYPE_CALENDAR } from "src/constants";
import { tryToCreateDailyNote } from "src/io/dailyNotes";
import type { ISettings } from "src/settings";

import Main from "./ui/Main.svelte"
import type ScrollingCalendar from "./components/ScrollingCalendar.svelte";

import { showFileMenu } from "./ui/fileMenu";
import { activeFile, dailyNotes, settings, selectedDate} from "./ui/stores";
import {
  customTagsSource,
  streakSource,
  tasksSource,
  wordCountSource,
} from "./ui/sources";
import { getDateUIDFromFile } from "./ui/utils";
export default class CalendarView extends ItemView {
  private main: Main;
  private calendar: ScrollingCalendar;
  private settings: ISettings;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);


    // Group related bindings together for better readability
    // Calendar interactions
    this.onHoverDay = this.onHoverDay.bind(this);
    this.onContextMenuDay = this.onContextMenuDay.bind(this);
    this.onClickDay = this.onClickDay.bind(this);

    this.openOrCreateDailyNote = this.openOrCreateDailyNote.bind(this);
    this.loadNoteContent = this.loadNoteContent.bind(this);

    // File system events
    this.onNoteSettingsUpdate = this.onNoteSettingsUpdate.bind(this);
    this.onFileCreated = this.onFileCreated.bind(this);
    this.onFileDeleted = this.onFileDeleted.bind(this);
    this.onFileModified = this.onFileModified.bind(this);
    this.onFileOpen = this.onFileOpen.bind(this);

    // Register events
    this.registerEvents();

    // Initialize settings
    this.settings = null;
    this.initializeSettings();


  }

  private registerEvents(): void {
    this.registerEvent(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (<any>this.app.workspace).on(
        "periodic-notes:settings-updated",
        this.onNoteSettingsUpdate
      )
    );
    this.registerEvent(this.app.vault.on("create", this.onFileCreated));
    this.registerEvent(this.app.vault.on("delete", this.onFileDeleted));
    this.registerEvent(this.app.vault.on("modify", this.onFileModified));
    this.registerEvent(this.app.workspace.on("file-open", this.onFileOpen));
  }

  private initializeSettings(): void {
    settings.subscribe((val) => {
      this.settings = val;

      // Refresh the calendar if settings change
      if (this.calendar) {
        this.calendar.tick();
      }
    });
  }

  getViewType(): string {
    return VIEW_TYPE_CALENDAR;
  }

  getDisplayText(): string {
    return "Calendar";
  }

  getIcon(): string {
    return "calendar-with-checkmark";
  }

  onClose(): Promise<void> {
    if (this.main) {
      this.main.$destroy();
    }
    return Promise.resolve();
  }

  async onOpen(): Promise<void> {
    // Integration point: external plugins can listen for `calendar:open`
    // to feed in additional sources.
    const sources = [
      customTagsSource,
      streakSource,
      wordCountSource,
      tasksSource,
    ];
    this.app.workspace.trigger(TRIGGER_ON_OPEN, sources);

    this.main = new Main({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      target: (this as any).contentEl,
      props: {
        calendarActions: {
          onClickDay: this.onClickDay,
          onHoverDay: this.onHoverDay,
          onFileMenuDay: this.onContextMenuDay,
          sources,
        },
        openOrCreateNote: this.openOrCreateDailyNote,
        loadNoteContent: this.loadNoteContent,
        onInit: (calendarComponent: ScrollingCalendar) => {
          this.calendar = calendarComponent;
        },
      },
    });
  }

  onClickDay(date: Moment): void {
    selectedDate.toggle(date);
  }

  onHoverDay(
    date: Moment,
    targetEl: EventTarget,
    isMetaPressed: boolean
  ): void {
    if (!isMetaPressed) {
      return;
    }
    const { format } = getDailyNoteSettings();
    const note = getDailyNote(date, get(dailyNotes));
    this.app.workspace.trigger(
      "link-hover",
      this,
      targetEl,
      date.format(format),
      note?.path
    );
  }

  // onHoverWeek(
  //   date: Moment,
  //   targetEl: EventTarget,
  //   isMetaPressed: boolean
  // ): void {
  //   if (!isMetaPressed) {
  //     return;
  //   }
  //   const note = getWeeklyNote(date, get(weeklyNotes));
  //   const { format } = getWeeklyNoteSettings();
  //   this.app.workspace.trigger(
  //     "link-hover",
  //     this,
  //     targetEl,
  //     date.format(format),
  //     note?.path
  //   );
  // }

  private onContextMenuDay(date: Moment, event: MouseEvent): void {
    const note = getDailyNote(date, get(dailyNotes));
    if (!note) {
      // If no file exists for a given day, show nothing.
      return;
    }
    showFileMenu(this.app, note, {
      x: event.pageX,
      y: event.pageY,
    });
  }

  // private onContextMenuWeek(date: Moment, event: MouseEvent): void {
  //   const note = getWeeklyNote(date, get(weeklyNotes));
  //   if (!note) {
  //     // If no file exists for a given day, show nothing.
  //     return;
  //   }
  //   showFileMenu(this.app, note, {
  //     x: event.pageX,
  //     y: event.pageY,
  //   });
  // }

  private onNoteSettingsUpdate(): void {
    dailyNotes.reindex();
    // weeklyNotes.reindex();
    this.updateActiveFile();
  }

  private async onFileDeleted(file: TFile): Promise<void> {
    if (getDateFromFile(file, "day")) {
      dailyNotes.reindex();
      this.updateActiveFile();
    }
    // if (getDateFromFile(file, "week")) {
    //   weeklyNotes.reindex();
    //   this.updateActiveFile();
    // }
  }

  private async onFileModified(file: TFile): Promise<void> {
    const date = getDateFromFile(file, "day") || getDateFromFile(file, "week");
    if (date && this.calendar) {
      this.calendar.tick();
    }

    if (get(activeFile).uid === getDateUIDFromFile(file)) {
      const content = await this.app.vault.cachedRead(file);
      activeFile.setContent(content);
    }
  }

  private onFileCreated(file: TFile): void {
    if (this.app.workspace.layoutReady && this.calendar) {
      if (getDateFromFile(file, "day")) {
        dailyNotes.reindex();
        this.calendar.tick();
      }
      // if (getDateFromFile(file, "week")) {
      //   weeklyNotes.reindex();
      //   this.calendar.tick();
      // }
    }
  }

  public onFileOpen(_file: TFile): void {
    if (this.app.workspace.layoutReady) {
      this.updateActiveFile();
    }
  }

  private updateActiveFile(): void {
    const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
    const file = markdownView?.file || null;

    this.app.vault.cachedRead(file).then( c => activeFile.setFile(file, c));

    if (this.calendar) {
      this.calendar.tick();
    }
  }

  public revealActiveNote(): void {
    const { moment } = window;
    const fileView = this.app.workspace.getActiveViewOfType(FileView);

    if (fileView) {
      // Check daily note
      let date = getDateFromFile(fileView.file, "day");
      if (date) {
        this.calendar.$set({ displayedMonth: date });
        return;
      }

      // Check weekly note
      const { format } = getWeeklyNoteSettings();
      date = moment(fileView.file.basename, format, true);
      if (date.isValid()) {
        this.calendar.$set({ displayedMonth: date });
        return;
      }
    }
  }

  // async openOrCreateWeeklyNote(
  //   date: Moment,
  //   inNewSplit: boolean
  // ): Promise<void> {
  //   const { workspace } = this.app;
  //   const startOfWeek = date.clone().startOf("week");
  //   const existingFile = getWeeklyNote(date, get(weeklyNotes));
  //
  //   if (!existingFile) {
  //     tryToCreateWeeklyNote(startOfWeek, inNewSplit, this.settings, (file) => {
  //       activeFile.setFile(file);
  //     });
  //     return;
  //   }
  //
  //   const leaf = await workspace.getLeaf(inNewSplit);
  //   await leaf.openFile(existingFile);
  //   activeFile.setFile(existingFile);
  // }


  async loadNoteContent(note: TFile | null): Promise<string> {
    if (!note) {
      return '';
    }
    try {
      return await this.app.vault.cachedRead(note);
    } catch (error) {
      console.error('Failed to load note content:', error);
      return '';
    }
  }

  async openOrCreateDailyNote(
    date: Moment,
    inNewSplit: boolean
  ): Promise<void> {
    const { workspace } = this.app;
    const existingFile = getDailyNote(date, get(dailyNotes));
    if (!existingFile) {
      tryToCreateDailyNote(date, inNewSplit, this.settings, (dailyNote: TFile) => {
        activeFile.setFile(dailyNote);
      });
      return;
    } else if (getDateUIDFromFile(existingFile) == get(activeFile).uid) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const viewState = (this.app.vault as any).getConfig("defaultViewMode");
    const leaf = await workspace.getLeaf(inNewSplit);
    await leaf.openFile(existingFile, {
      active: true,
      state: { mode: viewState }
    });
    const content = await this.app.vault.cachedRead(existingFile);
    activeFile.setFile(existingFile, content);
  }
}
