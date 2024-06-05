<script>
export default {
  props: {
    title: String,
    startOpen: Boolean,
  },
  data() {
    return {
      open: false,
    };
  },
  mounted() {
    if (this.startOpen) this.open = true;
  },
  computed: {
    /**
     * Returns the icon depending on open status
     *
     * @since 3.2.13
     */
    returnVisibilityIcon() {
      if (this.open) return "expand_more";
      if (!this.open) return "chevron_left";
    },
  },
  methods: {
    /**
     * Toggles section visibility
     *
     * @since 3.2.13
     */
    toggleVisibility() {
      this.open = !this.open;
    },
  },
};
</script>

<template>
  <div class="uip-flex uip-flex-column uip-row-gap-s">
    <!-- Title -->
    <div class="uip-flex uip-gap-s uip-flex-center uip-flex-between">
      <div class="uip-flex uip-gap-xxs uip-flex-center uip-cursor-pointer uip-flex-between uip-flex-grow" @click="toggleVisibility()">
        <span class="uip-text-bold uip-text-emphasis">{{ title }}</span>

        <AppIcon class="uip-link-muted uip-icon" :icon="returnVisibilityIcon" />
      </div>
    </div>

    <div v-if="open" class="uip-padding-left-s">
      <slot></slot>
    </div>
  </div>
</template>
