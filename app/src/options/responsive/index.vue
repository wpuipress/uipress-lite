<script>
const { __ } = wp.i18n;
export default {
  props: {
    returnData: Function,
    value: Object,
  },
  data() {
    return {
      option: {
        mobile: false,
        tablet: false,
        desktop: false,
      },
      updating: false,
      strings: {
        mobile: __("Mobile", "uipress-lite"),
        tablet: __("Tablet", "uipress-lite"),
        desktop: __("Desktop", "uipress-lite"),
      },
      options: {
        false: {
          value: false,
          label: __("Show", "uipress-lite"),
        },
        true: {
          value: true,
          label: __("Hide", "uipress-lite"),
        },
      },
    };
  },
  watch: {
    /**
     * Watches changes to the responsive object and returns
     *
     * @since 3.2.13
     */
    value: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.formatValue();
      },
      deep: true,
      immediate: true,
    },
    /**
     * Watches changes to the responsive object and returns
     *
     * @since 3.2.13
     */
    option: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.updateOptions();
      },
      deep: true,
    },
  },
  computed: {
    /**
     * Returns default value
     *
     * @since 3.3.09
     */
    returnDefault() {
      return {
        mobile: false,
        tablet: false,
        desktop: false,
      };
    },
  },
  methods: {
    /**
     * Injects prop value if valid
     *
     * @since 3.2.13
     */
    async formatValue() {
      this.updating = true;
      this.option = this.isObject(this.value) ? { ...this.returnDefault, ...this.value } : { ...this.returnDefault };
      await this.$nextTick();
      this.updating = false;
    },

    /**
     * Returns data to caller
     *
     * @since 3.2.13
     */
    updateOptions() {
      let responsiveSet = { ...this.option };
      this.returnData(responsiveSet);
    },
  },
};
</script>

<template>
  <div class="grid grid-cols-3 gap-2">
    <!--Mobile-->
    <div class="flex flex-row gap-1 items-center text-zinc-400 text-sm">
      <div class="">{{ strings.mobile }}</div>
    </div>

    <toggle-switch :options="options" :activeValue="option.mobile" :returnValue="(data) => (option.mobile = data)" class="col-span-2" />

    <!--Tablet-->
    <div class="flex flex-row gap-1 items-center text-zinc-400 text-sm">
      <div class="">{{ strings.tablet }}</div>
    </div>

    <toggle-switch :options="options" :activeValue="option.tablet" :returnValue="(data) => (option.tablet = data)" class="col-span-2" />

    <!--Desktop-->
    <div class="flex flex-row gap-1 items-center text-zinc-400 text-sm">
      <div class="">{{ strings.desktop }}</div>
    </div>

    <toggle-switch :options="options" :activeValue="option.desktop" :returnValue="(data) => (option.desktop = data)" class="col-span-2" />
  </div>
</template>
