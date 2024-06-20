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
      return this.open ? "expand_more" : "chevron_left";
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
  <div class="flex flex-col gap-2">
    <!-- Title -->
    <div class="flex gap-2 items-center place-content-between cursor-pointer w-full" @click="toggleVisibility()">
      <span class="font-semibold text-zinc-900">{{ title }}</span>
      <AppIcon :icon="returnVisibilityIcon" class="text-zinc-400" />
    </div>

    <slot v-if="open"></slot>
  </div>
</template>
