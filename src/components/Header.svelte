<script lang="ts">
  import type { Moment } from "moment";

  export let scrollToToday: () => void;
  export let visibleMonth: Moment = window.moment();
  export let active: boolean = false;

  let year;
  $: year = visibleMonth.year();
</script>

<div class="calendar-header">
  <button class="today-button" class:active on:click={scrollToToday}>
    Today
  </button>
  <div class="year-display">{year}</div>
</div>


<style>
    .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.25rem 0.75rem; /* Reduced padding */
        border-bottom: 1px solid var(--background-modifier-border);
        /*background-color: var(--background-secondary);;*/
    }
    .year-display {
        font-size: 1.8em;
        font-weight: 600;
    }

    .today-button {
        padding: 0.25rem 0.6rem; /* Reduced padding */
        border-radius: 15%;
        font-size: 1.0em;
        font-weight: 200;
        /*border: 1px solid orange;*/
        /*color: var(--text-on-accent);*/
        border: 2px solid transparent;
        cursor: pointer;
        /*background-color: var(--background-secondary);*/
    }
    .today-button.active {
        /*background-color: var(--interactive-accent);*/
        background: var(--interactive-normal);
        border: 2px solid white;
        opacity: 0.8;  /* Maintains some of that glassy feel */
        font-weight: 300;  /* Slightly bolder than normal state */
    }
    .today-button:hover {
        background-color: var(--interactive-hover);
    }
</style>
