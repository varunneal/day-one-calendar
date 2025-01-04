<svelte:options immutable />
<script lang="ts">
  import type { Moment } from "moment";
  import { getDailyNote } from "obsidian-daily-notes-interface";
  import { activeFile, selectedDate, dailyNotes, settings } from "../ui/stores";
  import OnThisDay from "./OnThisDay.svelte";
  import { TFile } from "obsidian";
  import { customTagsSource } from "../ui/sources";
  import { getDateUIDFromFile } from "../ui/utils";

  export let openOrCreateNote: (date: Moment, inNewTab: boolean) => boolean;
  export let loadNoteContent: (note: TFile | null) => Promise<string>;

  $: noteKey = $selectedDate
    ? `${$selectedDate.format("YYYY-MM-DD")}-${Object.keys($dailyNotes).length}`
    : null;

  $: currentNote = noteKey ? getDailyNote($selectedDate, $dailyNotes) : null;

  let content = "";

  $: if (currentNote) {
    if ($activeFile.uid === getDateUIDFromFile(currentNote)) {
      content = $activeFile.content;
    } else {
      loadNoteContent && loadNoteContent(currentNote).then((c) => {
        content = c;
      });
    }
  } else {
    content = "";
  }

  function handleNoteClick() {
    openOrCreateNote($selectedDate, $settings.openInNewTab);
  }

  function handleOnThisDayClick(date: Moment) {
    return openOrCreateNote(date, $settings.openInNewTab);
  }
</script>

{#if $selectedDate}
  <div class="context-panel">
    <div class="current-note" on:click={handleNoteClick}>
      {#if currentNote}
        <div class="note-content">
          <div class="note-title">{currentNote.basename}</div>
          {#if content}
            <div class="note-excerpt">{content}</div>
          {/if}
        </div>
      {:else}
        <div class="no-note">No entry on this day. Click to create.</div>
      {/if}
    </div>
    <OnThisDay onClickDate={handleOnThisDayClick} />
  </div>
{/if}

<style>
    .context-panel {
        display: flex;
        flex-direction: column;
        min-height: 35%;
        padding: 0.75rem;
    }

    .current-note {
        padding: 1rem 1.25rem;
        border-radius: 6px;
        background: var(--interactive-normal);
        border: 1px solid var(--background-modifier-border);
        cursor: pointer;
        transition: all 0.15s ease;
    }

    .current-note:hover {
        background-color: var(--interactive-hover);
        /*background: var(--interactive-hover);*/
        /*border-color: var(--interactive-accent);*/
    }

    .current-note:active {
        background: var(--interactive-normal);
        border: 1px solid var(--color-base-70);
        /*background: var(--interactive-accent);*/
        /*color: var(--text-on-accent);*/
        /*transform: translateY(1px);*/
    }

    .note-content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .note-title {
        font-weight: 600;
        color: var(--text-normal);
    }

    .note-excerpt {
        color: var(--text-muted);
        font-size: 0.9em;
        line-height: 1.4;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
    }

    .no-note {
        display: flex;
        /*align-items: center;*/
        /*justify-content: center;*/
        color: var(--text-muted);
        /*font-weight: 500;*/
        font-size: 0.9em;
        /*min-height: 1rem;*/
    }

    .current-note:not(:has(.note-content)) {
        background: var(--interactive-normal);
        border: 1px solid transparent;
    }

    .current-note:not(:has(.note-content)):hover {
        background: var(--interactive-hover);
        /*border-color: var(--interactive-accent);*/

    }

    .current-note:not(:has(.note-content)):active {
        /*background: var(--interactive-accent);*/
        /*color: var(--text-on-accent);*/
        background: var(--interactive-normal);
        border: 1px solid var(--color-base-70);
    }
</style>
