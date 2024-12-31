<svelte:options immutable />
<script lang="ts">
  import type { Moment } from "moment";
  import ScrollingCalendar from "../components/ScrollingCalendar.svelte";
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

  $: if (calendarComponent) {
    console.log("calendar component init..");
    onInit(calendarComponent);
  }
</script>

<div class="main-view">
  <div class="calendar-section">
    <ScrollingCalendar
      bind:this={calendarComponent}
      {...calendarProps}
    />
  </div>

<!--  <div class="history-section">-->
<!--    <OnThisDay-->
<!--      date={selectedDate}-->
<!--      sources={calendarProps.sources}-->
<!--    />-->
<!--  </div>-->
</div>
