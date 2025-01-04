<script lang="ts">
  import VirtualScroll from './VirtualScroll.svelte'
  import { fade } from 'svelte/transition';
  import type { Moment } from "moment";
  import moment from 'moment';
  import MonthCalendar from "./MonthCalendar.svelte";
  import { ICalendarSource } from "../types";
  import { configureGlobalMomentLocale } from "../localization";
  import { onDestroy, onMount } from "svelte";
  import type { ISettings } from "src/settings";
  import {  dailyNotes, settings } from "../ui/stores";

  export let sources: ICalendarSource[];
  export let onHoverDay: (date: Moment, targetEl: EventTarget) => boolean;
  export let onClickDay: (date: Moment, isMetaPressed: boolean) => boolean;
  export let onFileMenuDay: (date: Moment, event: MouseEvent) => boolean;

  let today: Moment;
  let displayedMonths: Moment[] = [];
  let currentMonthIndex: number;
  let virtualScroll: VirtualScroll;
  let isLoading = false;
  let visibleIndex = 0;
  export let visibleMonth;

  // Track position of the loader
  let loadingPosition: "top" | "bottom" = "top";

  $: today = getToday($settings);

  export function tick() {
    today = window.moment();
  }

  export function scrollToToday() {
    if (!virtualScroll || displayedMonths.length === 0) return;
    virtualScroll.scrollToIndex(currentMonthIndex);
  }

  function getToday(settings: ISettings) {
    configureGlobalMomentLocale(settings.localeOverride, settings.weekStart);
    dailyNotes.reindex();
    return window.moment();
  }

  function generateInitialMonths(): { months: Moment[], i: number } {
    const months: Moment[] = [];
    const currentYear = today.year();
    const currentMonth: number = today.month();
    const numYears = 1;

    for (let month = 0; month < numYears * 12; month++) {
      const year = currentYear - numYears + 1 + Math.floor(month / 12);
      months.push(moment().year(year).month(month % 12).startOf('month'));
    }

    const i = (numYears - 1) * 12 + currentMonth;
    return { months, i };
  }

  async function handleScrollTop() {
    loadingPosition = 'top';
    isLoading = true;
    await new Promise(resolve => setTimeout(resolve, 250));

    const yearsToLoad = 1;
    let currFirstYear = displayedMonths[0].year();
    const months: Moment[] = [];

    for (let month = 0; month < 12 * yearsToLoad; month++) {
      const year = currFirstYear - yearsToLoad + Math.floor(month / 12);
      months.push(moment().year(year).month(month % 12).startOf('month'));
    }

    displayedMonths = [...months, ...displayedMonths];
    currentMonthIndex += yearsToLoad * 12;

    await tick();
    virtualScroll.scrollToIndex(12, 'auto');
    isLoading = false;
  }

  async function handleScrollBottom() {
    loadingPosition = 'bottom';
    isLoading = true;
    await new Promise(resolve => setTimeout(resolve, 250));

    const yearsToLoad = 1;
    const lastMonth = displayedMonths[displayedMonths.length - 1];
    const months: Moment[] = [];

    for (let i = 1; i <= 12 * yearsToLoad; i++) {
      months.push(moment(lastMonth).add(i, 'months').startOf('month'));
    }

    displayedMonths = [...displayedMonths, ...months];
    isLoading = false;
  }

  $: monthsData = displayedMonths.map((month) => ({
    key: month.format('YYYY-MM'),
    month: month
  }));

  $: visibleMonth = displayedMonths[visibleIndex]
    ? displayedMonths[visibleIndex]
    : window.moment();

  onMount(() => {
    let { months, i } = generateInitialMonths();
    displayedMonths = months;
    currentMonthIndex = i;
    virtualScroll.scrollToIndex(currentMonthIndex);
  });

  let heartbeat = setInterval(() => {
    today = window.moment();
  }, 1000 * 60);

  onDestroy(() => {
    clearInterval(heartbeat);
  });

  export interface ScrollingCalendar {
    scrollToToday(): number;
  }
</script>


<div class="scrolling-container">
  {#if isLoading && loadingPosition === 'top'}
    <div class="loading-bar" transition:fade={{ duration: 100 }}>
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
    on:scrollbottom={handleScrollBottom}
    bind:visibleIndex={visibleIndex}
  >
    <svelte:fragment slot="item" let:item>
      <MonthCalendar
        {sources}
        {today}
        {onHoverDay}
        {onFileMenuDay}
        {onClickDay}
        displayedMonth={item.month}
        localeData={today.localeData()}
        showWeekNums={$settings.showWeeklyNote}
      />
    </svelte:fragment>
  </VirtualScroll>

  {#if isLoading && loadingPosition === 'bottom'}
    <div class="loading-bar bottom" transition:fade={{ duration: 100 }}>
      <div class="loading-bar-inner"></div>
    </div>
  {/if}
</div>
