<script>
export default {
  data() {
    return {
      show: false,
    };
  },
};
</script>

<template>
  <div @mouseenter="show = true" @mouseleave="show = false" class="uip-position-relative uip-flex">
    <div class="uip-flex-grow">
      <slot name="trigger" />
    </div>

    <div class="uip-position-relative uip-flex-shrink">
      <div
        v-if="show"
        style="top: 64px; bottom: 0px; max-height: calc(100vh - 64px)"
        class="uip-position-fixed uip-z-index-9 uip-w-400 uip-padding-bottom-l uip-overflow-auto uip-background-default uip-border-left"
      >
        <slot name="content" />
      </div>
    </div>
  </div>
</template>
