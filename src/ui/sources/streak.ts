import type { Moment } from "moment";
import type { TFile } from "obsidian";
import type { ICalendarSource, IDayMetadata } from "../../types";
import { getDailyNote } from "obsidian-daily-notes-interface";
import { get } from "svelte/store";

import { dailyNotes } from "../stores";
import { classList } from "../utils";

const getStreakClasses = (file: TFile): string[] => {
  return classList({
    "has-note": !!file,
  });
};

export const streakSource: ICalendarSource = {
  getDailyMetadata: async (date: Moment): Promise<IDayMetadata> => {
    const file = getDailyNote(date, get(dailyNotes));
    return {
      classes: getStreakClasses(file),
      dots: [],
    };
  },

};
