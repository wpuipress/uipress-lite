<script>
export default {
  props: {
    saving: Boolean,
    saveFunction: Function,
    buttonText: String,
    size: String,
    saveArg: [Object, Array, String],
    buttonSecondary: Boolean,
  },
  data() {
    return {};
  },
  computed: {
    /**
     * Returns loading style when saving
     */
    returnLoadStyle() {
      if (this.saving) return "opacity:0;";
    },
  },
};
</script>

<template>
  <button
    class="uip-button-primary uip-flex uip-flex-center uip-flex-middle uip-position-relative"
    type="button"
    @click="saveFunction(saveArg)"
    :class="[{ 'uip-text-s uip-line-height-1': size == 'small' }, { 'uip-button-secondary': buttonSecondary }]"
  >
    <span :style="returnLoadStyle">{{ buttonText }}</span>

    <div class="uip-position-absolute uip-left-0 uip-right-0" v-if="saving">
      <span class="uip-load-spinner"></span>
    </div>
  </button>
</template>
