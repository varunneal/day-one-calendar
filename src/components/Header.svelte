<script lang="ts">
  export let scrollToToday: () => void;
  export let visibleYear; // the bound variable from the parent
</script>

<div class="calendar-header">
  <button class="today-button" on:click={scrollToToday}>
    Today
  </button>
  <div class="year-display">{visibleYear}</div>
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
        font-size: 1.8em; /* Slightly reduced font size */
        font-weight: 500;
    }
    .today-button {
        padding: 0.25rem 0.6rem; /* Reduced padding */
        border-radius: 4px;
        font-size: 0.85em; /* Slightly reduced font size */
        border: 1px solid var(--background-modifier-border);
        color: var(--text-on-accent);
        cursor: pointer;
    }
    .today-button:hover {
        background-color: var(--interactive-hover);
    }
</style>
