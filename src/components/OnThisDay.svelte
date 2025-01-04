<svelte:options immutable />
<script lang="ts">
  import type { Moment } from "moment";
  import moment from "moment";
  import { activeFile, dailyNotes, selectedDate } from "../ui/stores";
  import {
    getDailyNote,
    getDailyNoteSettings,
    getDateFromFile,
  } from "obsidian-daily-notes-interface";

  export let onClickDate: (date: Moment) => boolean;

  interface HistoricalNote {
    date: Moment;
    exists: boolean;
    name: string;
  }

  // derived store to force reactivity
  $: noteKey = $selectedDate ?
    `${$selectedDate.format('YYYY-MM-DD')}-${Object.keys($dailyNotes).length}` :
    null;

  $: historicalNotes = noteKey ? getHistoricalNotes($selectedDate) : [];

  function getHistoricalNotes(selectedDate: Moment | null): HistoricalNote[] {
    if (!selectedDate) return [];

    const month = selectedDate.month();
    const day = selectedDate.date();

    // Get all dates from dailyNotes that match the month and day
    return Object.entries($dailyNotes)
      .map(([dateStr, file]): HistoricalNote | null => {
        const date = moment(dateStr, "YYYY-MM-DD");

        // Check if this note's month and day match our selected date
        if (date.month() === month && date.date() === day) {
          return {
            date: date,
            name: file.basename,
            exists: true
          };
        }
        return null;
      })
      .filter((note): note is HistoricalNote => note !== null)
      .sort((a, b) => a.date.valueOf() - b.date.valueOf());
  }
</script>


{#if historicalNotes && historicalNotes.length > 0}
  <div class="on-this-day">
    <h3 class="on-this-day-header">
      On this day ({historicalNotes.length} {historicalNotes.length === 1 ? 'entry' : 'entries'})
    </h3>
    <ul class="on-this-day-list">
      {#each historicalNotes as note (note.date.valueOf())}
        <li>
         <span
           class="internal-link clickable-link"
           on:click={() => onClickDate(note.date)}
         >
            {note.name}
         </span>
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
    .on-this-day {
        padding: 1rem;
        border-top: 1px solid var(--background-modifier-border);
    }

    .on-this-day-header {
        margin: 0 0 0.8rem 0;
        font-size: 1rem;
        font-weight: 600;
    }

    .on-this-day-list {
        margin: 0;
        padding-left: 1.5rem;
        list-style: disc;
    }

    .on-this-day-list li {
        margin-bottom: 0.5rem;
        color: var(--text-muted);  /* Makes the bullet point slightly muted */
    }

    .internal-link {
        color: var(--link-color);
        text-decoration: none;
        position: relative;
    }

    .clickable-link {
        cursor: pointer;
    }

    .internal-link:hover {
        text-decoration: underline;
    }

    /* Optional: Add a subtle transition effect */
    .internal-link {
        transition: color 0.15s ease-in-out;
    }

    .internal-link:hover {
        color: var(--link-color-hover, var(--link-color));
    }
</style>
