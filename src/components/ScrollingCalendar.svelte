<script lang="ts">
  // import VirtualScroll from "../VirtualList"
  import VirtualScroll from './VirtualScroll.svelte'
  import { fade } from 'svelte/transition';

  import type { Moment } from "moment";
  import moment from 'moment';

  import MonthCalendar from "./MonthCalendar.svelte";
  import { ICalendarSource } from "../types";
  import { configureGlobalMomentLocale } from "../localization";
  import { onDestroy, onMount } from "svelte";
  import type { ISettings } from "src/settings";
  import { activeFile, dailyNotes, settings, weeklyNotes } from "../ui/stores";

  // Props
  export let sources: ICalendarSource[];
  export let onHoverDay: (date: Moment, targetEl: EventTarget) => boolean;
  export let onHoverWeek: (date: Moment, targetEl: EventTarget) => boolean;
  export let onClickDay: (date: Moment, isMetaPressed: boolean) => boolean;
  export let onClickWeek: (date: Moment, isMetaPressed: boolean) => boolean;
  export let onContextMenuDay: (date: Moment, event: MouseEvent) => boolean;
  export let onContextMenuWeek: (date: Moment, event: MouseEvent) => boolean;

  // State
  let today: Moment;
  let displayedMonths: Moment[] = [];
  let currentMonthIndex: number;
  let virtualScroll: VirtualScroll; // Reference to hold the component instance
  let isLoading = false;
  let visibleIndex = 0;
  export let visibleYear;


  $: today = getToday($settings);

  export function tick() {
    today = window.moment();
  }

  export function scrollToToday() {
    console.log("scroll function called from calendar, curr month is", currentMonthIndex);
    if (!virtualScroll || displayedMonths.length === 0) return;
    virtualScroll.scrollToIndex(currentMonthIndex);
  }


  function getToday(settings: ISettings) {
    configureGlobalMomentLocale(settings.localeOverride, settings.weekStart);
    dailyNotes.reindex();
    weeklyNotes.reindex();
    return window.moment();
  }


  function generateInitialMonths(): { months: Moment[], i: number } {
    const months: Moment[] = [];
    const currentYear = today.year();
    const currentMonth: number = today.month();
    const numYears = 2;

    let month;
    for (month = 0; month < numYears * 12; month++) {
      const year = currentYear - numYears + 1 + Math.floor(month / 12);
      months.push(moment().year(year).month(month % 12).startOf('month'));
    }

    const i = (numYears - 1) * 12 + currentMonth;
    return { months, i};
  }



  async function handleScrollTop() {
    isLoading = true;
    console.log("handle scroll top called");

    // Wait for 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));

    const yearsToLoad = 1;
    let currFirstYear = displayedMonths[0].year();
    const months: Moment[] = [];
    let month;

    for (month = 0; month < 12 * yearsToLoad; month++) {
      const year = currFirstYear - yearsToLoad + Math.floor(month / 12);
      months.push(moment().year(year).month(month % 12).startOf('month'));
    }
    displayedMonths = [...months, ...displayedMonths];
    currentMonthIndex += yearsToLoad * 12;

    isLoading = false;
  }



  // Transform months array into objects with unique keys
  $: monthsData = displayedMonths.map((month) => ({
    key: month.format('YYYY-MM'), // Unique key for each month
    month: month
  }));

  $: visibleYear = displayedMonths[visibleIndex]
    ? displayedMonths[visibleIndex].year()
    : null;



  onMount(() => {
    let {months, i} = generateInitialMonths();
    displayedMonths = months;
    currentMonthIndex = i;
    // todo
    virtualScroll.scrollToIndex(currentMonthIndex);
  });

  // 1 minute heartbeat to keep today reflecting the current day
  let heartbeat = setInterval(() => {
    today = window.moment();

    // todo: change this to yearly logic for updating display months lol
    // if (!today.isSame(displayedMonths[currentMonthIndex], 'month')) {
    //   displayedMonths = [today.clone(), ...displayedMonths];
    // }
  }, 1000 * 60);

  onDestroy(() => {
    clearInterval(heartbeat);
  });

  export interface ScrollingCalendar {
    scrollToToday(): number;
  }


</script>


<div class="scrolling-container">
  {#if isLoading}
    <div
      class="loading-bar"
      transition:fade={{ duration: 100 }}
    >
      <div class="loading-bar-inner"></div>
    </div>
  {/if}

  <VirtualScroll
    bind:this={virtualScroll}
    data={monthsData}
    key="key"
    height={250}
    keeps={18}
    start={currentMonthIndex}
    on:scrolltop={handleScrollTop}
    bind:visibleIndex={visibleIndex}
  >
    <svelte:fragment slot="item" let:item>
      <MonthCalendar
        {sources}
        {today}
        {onHoverDay}
        {onHoverWeek}
        {onContextMenuDay}
        {onContextMenuWeek}
        {onClickDay}
        {onClickWeek}
        displayedMonth={item.month}
        localeData={today.localeData()}
        selectedId={$activeFile}
        showWeekNums={$settings.showWeeklyNote}
      />
    </svelte:fragment>
  </VirtualScroll>
</div>
