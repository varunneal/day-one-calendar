<svelte:options immutable />
<script lang="ts">
  import type { Moment } from "moment";
  import moment from "moment";
  import { getDailyNote } from "obsidian-daily-notes-interface";
  import { activeFile, dailyNotes, weeklyNotes } from "../ui/stores";

  export let onClickDate: (date: Moment) => boolean;

  interface HistoricalNote {
    date: Moment;
    exists: boolean;
    name: string;
  }


  function parseUUIDToMoment(uuid: string): Moment | null {
    if (!uuid) return null;
    const match = uuid.match(/day-(.+)/);
    if (!match) return null;

    const dateString = match[1];
    return moment(dateString);
  }

  $: historicalNotes = getHistoricalNotes(parseUUIDToMoment($activeFile));


  function getHistoricalNotes(date: Moment | null): HistoricalNote[] {
    if (!date) return [];

    const notes: HistoricalNote[] = [];
    const currentYear = date.year();
    const month = date.month();
    const day = date.date();

    // todo: make less derpy
    for (let year = currentYear - 60; year <= currentYear + 60; year++) {
      const historicalDate = window.moment().year(year).month(month).date(day);
      const file = getDailyNote(historicalDate, $dailyNotes);

      if (file) {
        // console.log("file contents:");
        // console.dir(file);
        notes.push({
          date: historicalDate,
          name: file.basename,
          exists: true
        });
      }
    }

    return notes;
  }
</script>

{#if historicalNotes && historicalNotes.length > 0}
  <div class="on-this-day">
    <h3 class="on-this-day-header">
      On this day ({historicalNotes.length} {historicalNotes.length === 1 ? 'entry' : 'entries'})
    </h3>
    <ul class="on-this-day-list">
      {#each historicalNotes as note}
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
