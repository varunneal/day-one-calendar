
<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  /** @type {Array} - Data array to virtualize */
  export let data = [];
  /** @type {number} - Height of each item in pixels */
  export let height = 250;
  /** @type {number} - Number of items to keep visible */
  export let keeps = 12;
  /** @type {number} - Initial index to scroll to */
  export let start = 0
  /** @type {number} - Visible index  */
  export let visibleIndex = 0;

  // Extra items to render above/below viewport
  const buffer = 2;
  const dispatch = createEventDispatcher();

  // Container reference
  let container;

  // Visible range state
  let range = {
    start: 0,
    end: keeps - 1,
    offset: 0
  };

  function handleScroll() {
    if (!container) return;

    const scrollTop = container.scrollTop;

    // Dispatch scrolltop event when scrolled to top
    if (scrollTop === 0) {
      dispatch('scrolltop');
    }

    // Calculate visible range
    let startIndex = Math.floor(scrollTop / height) - buffer;
    startIndex = Math.max(0, startIndex);

    const endIndex = Math.min(
      startIndex + keeps + 2 * buffer - 1,
      data.length - 1
    );

    range = {
      start: startIndex,
      end: endIndex,
      offset: startIndex * height
    };

    visibleIndex = range.start + buffer;
  }

  /**
   * Public method to scroll to a specific index
   * @param {number} index - Index to scroll to
   */
  export function scrollToIndex(index) {
    if (!container) return;

    container.scrollTo({
      top: index * height,
      behavior: 'smooth'
    });
  }


  export interface VirtualScrollMethods {
    visibleIndex: number;
    scrollToIndex(index: number): void;
  }

  onMount(() => {
    // Defer scroll to next frame to ensure DOM is ready
    requestAnimationFrame(() => {
      console.log("request animation frame called");
      scrollToIndex(start);
    });
  });
</script>

<!-- Scrolling container -->
<div
  bind:this={container}
  style="overflow-y: auto; height: {keeps * height}px;"
  on:scroll={handleScroll}
>
  <!-- Spacer div for scroll area -->
  <div style="position: relative; height: {data.length * height}px;">
    <!-- Render only visible items -->
    {#each data.slice(range.start, range.end + 1) as item, i}
      <div
        style="
          position: absolute;
          top: {range.offset + i * height}px;
          height: {height}px;
          width: 100%;
          box-sizing: border-box;

        "
      >
        <slot name="item" {item} />
      </div>
    {/each}
  </div>
</div>
