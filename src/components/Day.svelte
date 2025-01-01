<svelte:options immutable />

<script lang="ts">
  import type { Moment } from "moment";
  import { getDateUID } from "obsidian-daily-notes-interface";

  import MetadataResolver from "./MetadataResolver.svelte";
  import type { IDayMetadata } from "../types";
  import { isMetaPressed } from "../utils";
  import { onMount } from 'svelte';

  // Properties
  export let date: Moment;
  export let metadata: Promise<IDayMetadata> | null;
  export let onHover: (
    date: Moment,
    targetEl: EventTarget,
    isMetaPressed: boolean
  ) => boolean;
  export let onClick: (date: Moment, isMetaPressed: boolean) => boolean;
  export let onContextMenu: (date: Moment, event: MouseEvent) => boolean;

  // Global state
  export let today: Moment;
  export let displayedMonth: Moment = null;
  export let selectedId: string = null;

</script>

<td>
  <MetadataResolver metadata="{metadata}" let:metadata>
    <div
      class="{`day ${metadata.classes.join(' ')}`}"
      class:active="{selectedId === getDateUID(date, 'day')}"
      class:inactive-month="{!date.isSame(displayedMonth, 'month')}"
      class:today="{date.isSame(today, 'day')}"
      on:click="{onClick && ((e) => onClick(date, isMetaPressed(e)))}"
      on:contextmenu="{onContextMenu && ((e) => onContextMenu(date, e))}"
      on:pointerover="{onHover &&
        ((e) => onHover(date, e.target, isMetaPressed(e)))}"
      {...metadata.dataAttributes || {}}
    >
      {date.format("D")}
    </div>
  </MetadataResolver>
</td>

<style>
    .day {
        background-color: var(--color-background-day);
        border-radius: 4px;
        color: var(--color-text-day);
        cursor: pointer;
        font-size: 0.8em;
        height: 100%;
        padding: 4px;
        position: relative;
        text-align: center;
        transition: background-color 0.1s ease-in, color 0.1s ease-in;
        vertical-align: baseline;
        border: 2px solid transparent;
    }


    .day:hover {
        background-color: var(--color-background-day-hover);
        color: var(--color-text-day-hover);
    }

    .day.has-note,
    .day.active {
        background-color: var(--color-background-day-note);
        color: var(--color-text-day-note);
    }

    .day.has-note:hover,
    .day.active:hover {
        background-color: var(--color-background-day-note-hover);
        color: var(--color-text-day-note-hover);
    }

    /* Active adds border */
    .day.active {
        border: 2px solid var(--color-border-day-active);
    }

    /* Today state - different text color */
    .day.today {
        /*color: var(--color-text-day-today);*/
        border: 2px solid white;
        /*outline-offset: -3px;*/
        /*border-radius: 25%;*/
        font-weight: bold;
    }
    .day.today.active {
        /*color: var(--color-text-day-today-note);*/
        border: 2px solid var(--color-border-day-active);
    }

    .day.today:hover {
        color: var(--color-text-day-today-hover);
    }


    .inactive-month {
        opacity: 0;
        pointer-events: none;
        cursor: default;
    }

</style>
