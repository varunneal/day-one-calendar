import type { TFile } from "obsidian";
import {
  getAllDailyNotes,
} from "obsidian-daily-notes-interface";
import { writable } from "svelte/store";

import { defaultSettings, ISettings } from "src/settings";

import { getDateUIDFromFile } from "./utils";
import type { Moment } from "moment";

function createDailyNotesStore() {
  let hasError = false;
  const store = writable<Record<string, TFile>>(null);
  return {
    reindex: () => {
      try {
        const dailyNotes = getAllDailyNotes();
        store.set(dailyNotes);
        hasError = false;
      } catch (err) {
        if (!hasError) {
          // Avoid error being shown multiple times
          console.error("[Calendar] Failed to find daily notes folder", err);
        }
        store.set({});
        hasError = true;
      }
    },
    ...store,
  };
}

// function createWeeklyNotesStore() {
//   let hasError = false;
//   const store = writable<Record<string, TFile>>(null);
//   return {
//     reindex: () => {
//       try {
//         const weeklyNotes = getAllWeeklyNotes();
//         store.set(weeklyNotes);
//         hasError = false;
//       } catch (err) {
//         if (!hasError) {
//           // Avoid error being shown multiple times
//           console.error("[Calendar] Failed to find weekly notes folder", err);
//         }
//         store.set({});
//         hasError = true;
//       }
//     },
//     ...store,
//   };
// }

function createActiveFileStore() {
  const store = writable<{ uid: string | null; content: string }>({
    uid: null,
    content: "",
  });

  return {
    setFile: (file: TFile, content = "") => {
      const id = getDateUIDFromFile(file);
      store.set({uid: id, content});
    },
    setContent: (content: string) =>
      store.update((state) => ({ ...state, content })),
    ...store,
  };
}


function createSelectedDateStore() {
  const store = writable<Moment | null>(null);
  return {
    toggle: (date: Moment) => {
      store.update(current =>
        current?.isSame(date, 'day') ? null : date
      );
    },
    ...store,
  };
}




export const selectedDate = createSelectedDateStore();
export const settings = writable<ISettings>(defaultSettings);
export const dailyNotes = createDailyNotesStore();
export const activeFile = createActiveFileStore();
