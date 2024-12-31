<svelte:options immutable />

<script lang="ts">
  import type { Locale, Moment } from "moment";

  import Day from "./Day.svelte";
  import { getDailyMetadata, getWeeklyMetadata } from "../metadata";
  import type { ICalendarSource, IMonth } from "../types";
  import { getDaysOfWeek, getMonth, isWeekend } from "../utils";

  // Localization
  export let localeData: Locale;

  // Settings
  export let showWeekNums: boolean = false;

  // Event Handlers
  export let onHoverDay: (
    date: Moment,
    targetEl: EventTarget,
    isMetaPressed: boolean
  ) => boolean;
  export let onHoverWeek: (
    date: Moment,
    targetEl: EventTarget,
    isMetaPressed: boolean
  ) => boolean;
  export let onContextMenuDay: (date: Moment, event: MouseEvent) => boolean;
  export let onContextMenuWeek: (date: Moment, event: MouseEvent) => boolean;
  export let onClickDay: (date: Moment, isMetaPressed: boolean) => boolean;
  export let onClickWeek: (date: Moment, isMetaPressed: boolean) => boolean;

  // External sources (All optional)
  export let sources: ICalendarSource[] = [];
  export let selectedId: string;


  // Override-able local state
  export let today: Moment = window.moment();
  export let displayedMonth = today;

  let month: IMonth;
  let daysOfWeek: string[];

  $: month = getMonth(displayedMonth, localeData);
  $: daysOfWeek = getDaysOfWeek(today, localeData);

  // Exports
  export function incrementDisplayedMonth() {
    displayedMonth = displayedMonth.clone().add(1, "month");
  }

  export function decrementDisplayedMonth() {
    displayedMonth = displayedMonth.clone().subtract(1, "month");
  }

  export function resetDisplayedMonth() {
    displayedMonth = today.clone();
  }


</script>

<div id="calendar-container" class="month-container">
  <div class="nav">
    <h3 class="nav-title">
      <span class="nav-month-name">{displayedMonth.format('MMM')}</span>
      <span class="year"><!-- class:january={displayedMonth.format('MMM') === 'Jan'}> -->
        {displayedMonth.format('YYYY')}
    </span>
    </h3>

  </div>

  <table class="calendar">
    <colgroup>
      {#if showWeekNums}
        <col />
      {/if}
      {#each month[1].days as date}
        <col class:weekend="{isWeekend(date)}" />
      {/each}
    </colgroup>
    <thead>
      <tr>
        {#if showWeekNums}
          <th>W</th>
        {/if}
        {#each daysOfWeek as dayOfWeek}
          <th>{dayOfWeek}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each month as week (week.weekNum)}
        <tr>
          {#each week.days as day (day.format())}
            <Day
              date="{day}"
              today="{today}"
              displayedMonth="{displayedMonth}"
              onClick="{onClickDay}"
              onContextMenu="{onContextMenuDay}"
              onHover="{onHoverDay}"
              metadata="{getDailyMetadata(sources, day, today)}"
              selectedId="{selectedId}"
            />
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

