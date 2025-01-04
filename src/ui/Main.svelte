<svelte:options immutable />
<script lang="ts">
  import type { Moment } from "moment";
  import ScrollingCalendar from "../components/ScrollingCalendar.svelte";
  import Header from "../components/Header.svelte";
  import OnThisDay from "../components/OnThisDay.svelte";
  import { ICalendarSource } from "../types";
  import ContextPanel from "../components/ContextPanel.svelte";
  import type { TFile } from "obsidian";


  // Props to be passed from View
  export let calendarActions: {
    sources: ICalendarSource[];
    onHoverDay: (date: Moment, targetEl: EventTarget) => boolean;
    onClickDay: (date: Moment, isMetaPressed: boolean) => boolean;
    onFileMenuDay: (date: Moment, event: MouseEvent) => boolean;
  };

  export let openOrCreateNote: (date: Moment, isMetaPressed: boolean) => boolean;
  export let loadNoteContent: (note: TFile | null) => Promise<string>;

  export let onInit: (calendar: ScrollingCalendar) => void;


  let calendarComponent: ScrollingCalendar;

  export let visibleMonth: Moment = window.moment();


  let scrollToToday: () => void;

  $: if (calendarComponent) {
    onInit(calendarComponent);
  }

  $: isActiveMonth = (() => {
    if (!visibleMonth) return false;
    const thisMonth = window.moment().day(0);

    const diffInDays = visibleMonth.diff(thisMonth, 'months');
    return diffInDays >= 1 || diffInDays < -0;
  })();


</script>

<div class="main-view">
  <Header
    {scrollToToday}
    {visibleMonth}
    active={isActiveMonth}
  />
  <div class="calendar-section">
    <ScrollingCalendar
      bind:this={calendarComponent}
      bind:visibleMonth={visibleMonth}
      bind:scrollToToday={scrollToToday}
      {...calendarActions}
    />
  </div>
  <ContextPanel
    {openOrCreateNote}
    {loadNoteContent}
  />

</div>
