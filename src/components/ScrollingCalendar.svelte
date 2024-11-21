<svelte:options immutable />
<script lang="ts">
  import VirtualList from './VirtualList.svelte';
  import type { Moment } from "moment";
  import CalendarBase from "./MonthCalendar.svelte";
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
  const MAX_MONTHS = 120; // 10 years

  $: today = getToday($settings);

  export function tick() {
    today = window.moment();
  }

  function getToday(settings: ISettings) {
    configureGlobalMomentLocale(settings.localeOverride, settings.weekStart);
    dailyNotes.reindex();
    weeklyNotes.reindex();
    return window.moment();
  }

  function generateInitialMonths() {
    const months: Moment[] = [];
    for (let i = 0; i < MAX_MONTHS; i++) {
      months.push(today.clone().subtract(i, 'months'));
    }
    return months;
  }

  onMount(() => {
    displayedMonths = generateInitialMonths();
  });

  // 1 minute heartbeat to keep today reflecting the current day
  let heartbeat = setInterval(() => {
    tick();
    // Check if we need to add a new month at the top
    if (!today.isSame(displayedMonths[0], 'month')) {
      displayedMonths = [today.clone(), ...displayedMonths];
    }
  }, 1000 * 60);

  onDestroy(() => {
    clearInterval(heartbeat);
  });

</script>

<div class="scrolling-container">
  <VirtualList
    items="{displayedMonths}"
    itemSize="{500}"
    reverse={true}
    style="height: 100%; overflow-y: auto;"
    let:item
  >
  <div class="months-wrapper">
    <div class="month-container">
      <CalendarBase
        {sources}
        {today}
        {onHoverDay}
        {onHoverWeek}
        {onContextMenuDay}
        {onContextMenuWeek}
        {onClickDay}
        {onClickWeek}
        displayedMonth="{item}"
        localeData="{today.localeData()}"
        selectedId="{$activeFile}"
        showWeekNums="{$settings.showWeeklyNote}"
      />
    </div>
  </div>
  </VirtualList>
</div>
