<svelte:options immutable />
<script lang="ts">
  import type { Moment } from "moment";
  import ScrollingCalendar from "../components/ScrollingCalendar.svelte";
  import Header from "../components/Header.svelte";
  import OnThisDay from "../components/OnThisDay.svelte";
  import { ICalendarSource } from "../types";

  // Props to be passed from View
  export let calendarProps: {
    sources: ICalendarSource[];
    onHoverDay: (date: Moment, targetEl: EventTarget) => boolean;
    onHoverWeek: (date: Moment, targetEl: EventTarget) => boolean;
    onClickDay: (date: Moment, isMetaPressed: boolean) => boolean;
    onClickWeek: (date: Moment, isMetaPressed: boolean) => boolean;
    onContextMenuDay: (date: Moment, event: MouseEvent) => boolean;
    onContextMenuWeek: (date: Moment, event: MouseEvent) => boolean;
  };

  export let onInit: (calendar: ScrollingCalendar) => void;

  let selectedDate: Moment;
  let calendarComponent: ScrollingCalendar;
  let visibleYear: number | null = null;
  let scrollToToday: () => void;

  $: if (calendarComponent) {
    onInit(calendarComponent);
  }
</script>

<div class="main-view">
  <Header {scrollToToday} {visibleYear}/>
  <div class="calendar-section">
    <ScrollingCalendar
      bind:this={calendarComponent}
      bind:visibleYear={visibleYear}
      bind:scrollToToday={scrollToToday}
      {...calendarProps}
    />
  </div>

<!--TODO: "on this day section"-->
</div>
