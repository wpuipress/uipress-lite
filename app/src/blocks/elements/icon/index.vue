<script>
const { __ } = wp.i18n;
export default {
  props: {
    display: String,
    name: String,
    block: Object,
  },
  data() {
    return {};
  },

  computed: {
    /**
     * Returns icon for button
     *
     * @since 3.2.13
     */
    returnIcon() {
      let icon = this.get_block_option(this.block, "block", "iconSelect");
      if (!icon) return "favorite";
      if (!this.isObject(icon)) return icon;
      if (icon.value) return icon.value;
      return "favorite";
    },
  },
};
</script>

<template>
  <AppIcon :icon="returnIcon" />
</template>
