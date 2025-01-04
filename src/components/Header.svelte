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
        padding: 0.25rem 0.6rem;
        border-radius: 15%;
        font-size: 1.0em;
        font-weight: 200;
        cursor: pointer;
        border: 1px solid transparent;
        transition: all 0.05s ease;
        background: var(--background-secondary);
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    }

    .today-button.active {
        background: var(--interactive-normal);
        border-color: var(--color-base-50);
    }

    .today-button:hover {
        background-color: var(--interactive-hover);
        transition: all 0.2s ease;
    }


</style>
