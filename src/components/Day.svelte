<svelte:options immutable />

<script lang="ts">
  import type { Moment } from "moment";
  import { getDateUID } from "obsidian-daily-notes-interface";

  import MetadataResolver from "./MetadataResolver.svelte";
  import type { IDayMetadata } from "../types";
  import { isMetaPressed } from "../utils";
  import { onMount } from 'svelte';
  import { selectedDate } from "../ui/stores";

  // Properties
  export let date: Moment;
  export let metadata: Promise<IDayMetadata> | null;
  export let onHover: (
    date: Moment,
    targetEl: EventTarget,
    isMetaPressed: boolean
  ) => boolean;
  export let onClick: (date: Moment, isMetaPressed: boolean) => boolean;
  export let onFileMenu: (date: Moment, event: MouseEvent) => boolean;

  // Global state


  export let today: Moment;

  export let displayedMonth: Moment = null;
  // Use store with $ prefix for reactivity
  $: isSelected = $selectedDate ? date.isSame($selectedDate, 'day') : false;
</script>

<td>
  <MetadataResolver {metadata} let:metadata>
    <div
      class="{`day ${metadata.classes.join(' ')}`}"
      class:selected={isSelected}
      class:inactive-month="{!date.isSame(displayedMonth, 'month')}"
      class:today="{date.isSame(today, 'day')}"
      on:click="{onClick && ((e) => onClick(date, isMetaPressed(e)))}"
      on:contextmenu="{onFileMenu && ((e) => onFileMenu(date, e))}"
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
        border: 2px solid var(--color-border-day-hover);
    }

    .day.has-note {
        background-color: var(--color-background-day-note);
        color: var(--color-text-has-note);
    }


    .day.has-note:hover {
        background-color: var(--color-background-day-note-hover);
        color: var(--color-text-has-note-hover);
    }

    .day.selected {
        border: 2px solid var(--color-border-day-active);
    }

    .day.today::after {
        content: '';
        position: absolute;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%);
        width: 3px;
        height: 3px;
        background: var(--color-text-day);
        border-radius: 50%;
    }



    .inactive-month {
        opacity: 0;
        pointer-events: none;
        cursor: default;
    }

</style>
