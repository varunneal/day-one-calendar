<script lang="ts">
  import type { Moment } from "moment";
  import type { ICalendarSource } from "../types";

  export let date: Moment;
  export let sources: ICalendarSource[];

  $: formattedDate = date?.format('MMMM D');
  $: year = date?.format('YYYY');
</script>

<div class="on-this-day">
  <h2 class="header">On this day</h2>

  {#if date}
    <div class="date-info">
      <div class="current-date">
        {formattedDate}, {year}
      </div>

      <div class="historical-entries">
        <p class="placeholder-text">You have entries on this day from:</p>
        <ul>
          <li>
            <a href="#" class="entry-link">
              {formattedDate}, 2023
            </a>
          </li>
          <li>
            <a href="#" class="entry-link">
              {formattedDate}, 2022
            </a>
          </li>
          <li>
            <a href="#" class="entry-link">
              {formattedDate}, 2021
            </a>
          </li>
        </ul>
      </div>
    </div>
  {:else}
    <p class="placeholder-text">Select a date to see historical entries</p>
  {/if}
</div>

<style>
    .on-this-day {
        padding: 0 1rem;
    }

    /*.header {*/
    /*    font-size: 1.5em;*/
    /*    margin-bottom: 1rem;*/
    /*    color: var(--text-normal);*/
    /*}*/

    /*.current-date {*/
    /*    font-size: 1.1em;*/
    /*    margin-bottom: 1rem;*/
    /*    color: var(--text-muted);*/
    /*}*/

    /*.historical-entries {*/
    /*    margin-top: 1rem;*/
    /*}*/

    /*.placeholder-text {*/
    /*    color: var(--text-muted);*/
    /*}*/

    /*ul {*/
    /*    list-style-type: none;*/
    /*    padding: 0;*/
    /*    margin: 0.5rem 0;*/
    /*}*/

    /*li {*/
    /*    margin: 0.5rem 0;*/
    /*}*/

    /*.entry-link {*/
    /*    color: var(--text-accent);*/
    /*    text-decoration: none;*/
    /*}*/

    /*.entry-link:hover {*/
    /*    text-decoration: underline;*/
    /*}*/
</style>
