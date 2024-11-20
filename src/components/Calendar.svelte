<svelte:options immutable />

<script lang="ts">
  import type { Locale, Moment } from "moment";

  import Day from "./Day.svelte";
  import Nav from "./Nav.svelte";
  import WeekNum from "./WeekNum.svelte";
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


  $: {
    console.log({
      selectedId
    });
    // console.log({
    // today: today?.format(),
    // displayedMonth: displayedMonth?.format(),
    // selectedId,
    // myDate: getDateUID(date, 'day'),
    // isActive: selectedId === getDateUID(date, 'day')
    // });
  }

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

<div id="calendar-container" class="container">
  <Nav
    today="{today}"
    displayedMonth="{displayedMonth}"
    incrementDisplayedMonth="{incrementDisplayedMonth}"
    decrementDisplayedMonth="{decrementDisplayedMonth}"
    resetDisplayedMonth="{resetDisplayedMonth}"
  />
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
          {#if showWeekNums}
            <WeekNum
              {...week}
              metadata="{getWeeklyMetadata(sources, week.days[0], today)}"
              onClick="{onClickWeek}"
              onContextMenu="{onContextMenuWeek}"
              onHover="{onHoverWeek}"
              selectedId="{selectedId}"
            />
          {/if}
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

