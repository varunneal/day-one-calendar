<svelte:options immutable />

<script lang="ts">
  import type { Moment } from "moment";
  import { getDateUID } from "obsidian-daily-notes-interface";

  import Dot from "./Dot.svelte";
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

  // $: {
    // console.log({
      // today: today?.format(),
      // displayedMonth: displayedMonth?.format(),
      // selectedId,
      // myDate: getDateUID(date, 'day'),
      // isActive: selectedId === getDateUID(date, 'day')
    // });
  // }
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
<!--      <div class="dot-container">-->
<!--        {#each metadata.dots as dot}-->
<!--          <Dot {...dot} />-->
<!--        {/each}-->
<!--      </div>-->
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
    /*.day.today,*/
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
        color: var(--color-text-day-today);
    }
    .day.today.has-note {
        color: var(--color-text-day-today-note);
    }

    .day.today:hover {
        color: var(--color-text-day-today-hover);
    }


    .inactive-month {
        opacity: 0.25;
    }

    /*.dot-container {*/
    /*    display: flex;*/
    /*    flex-wrap: wrap;*/
    /*    justify-content: center;*/
    /*    line-height: 6px;*/
    /*    min-height: 6px;*/
    /*}*/
</style>
