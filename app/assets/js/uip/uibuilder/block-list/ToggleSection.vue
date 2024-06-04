<script>
/**
 * Toggle section
 *
 * @since 3.2.13
 */
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
  created() {
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

        <a class="uip-link-muted uip-icon">{{ returnVisibilityIcon }}</a>
      </div>
    </div>

    <slot v-if="open"></slot>
  </div>
</template>
