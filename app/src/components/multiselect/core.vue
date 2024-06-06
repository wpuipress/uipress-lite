<script>
export default {
  props: {
    selected: Array,
    placeHolder: String,
    searchPlaceHolder: String,
    single: Boolean,
    updateSelected: Function,
    availableOptions: Array,
  },
  data() {
    return {
      thisSearchInput: "",
      options: this.availableOptions,
      loading: false,
      selectedOptions: this.selected,
    };
  },
  watch: {
    selected: {
      handler(newValue, oldValue) {
        this.injectValue();
      },
      deep: true,
      immediate: true,
    },
    selectedOptions: {
      handler(newValue, oldValue) {
        this.updateSelected(this.selectedOptions);
      },
      deep: true,
    },
  },
  computed: {
    /**
     * Returns options
     *
     * @since 3.1.0
     */
    formattedOptions() {
      return this.options;
    },
    /**
     * Returns loading status
     *
     * @since 3.1.0
     */
    returnLoading() {
      return this.loading;
    },
  },
  methods: {
    /**
     * Updates selected from value
     *
     * @since 3.2.13
     */
    injectValue() {
      if (Array.isArray(this.selected)) {
        this.selectedOptions = this.selected;
      }
    },
    /**
     * Adds selected item
     *
     * @param {Mixed} selectedoption
     * @since 3.1.0
     */
    addSelected(selectedoption) {
      //if selected then remove it
      if (this.ifSelected(selectedoption)) {
        this.removeSelected(selectedoption);
        return;
      }
      if (this.single == true) {
        this.selectedOptions[0] = selectedoption;
      } else {
        this.selectedOptions.push(selectedoption);
      }
    },
    /**
     * Removes selected option
     *
     * @param {Mixed} option
     * @since 3.1.0
     */
    removeSelected(option) {
      let index = this.selectedOptions.indexOf(option);
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
    },

    /**
     * Checks if item is in selected options already
     *
     * @param {Mixed} option
     * @since 3.2.0
     */
    ifSelected(option) {
      let index = this.selectedOptions.indexOf(option);
      if (index > -1) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * Check if item is in search
     *
     * @param {Mixed} option
     * @since 3.1.0
     */
    ifInSearch(option) {
      let item = option.toLowerCase();
      let string = this.thisSearchInput.toLowerCase();

      if (item.includes(string)) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<template>
  <div class="uip-flex uip-flex-column uip-row-gap-s">
    <div class="uip-flex uip-background-muted uip-border-rounder uip-flex-center uip-padding-xxs uip-gap-xs">
      <AppIcon icon="search" class="uip-icon uip-text-muted" />
      <input class="uip-blank-input uip-flex-grow uip-text-s" type="search" :placeholder="searchPlaceHolder" v-model="thisSearchInput" autofocus />
    </div>

    <div v-if="returnLoading" class="uip-w-100p uip-flex uip-flex-center uip-flex-middle uip-h-200" :key="returnLoading">
      <loading-chart></loading-chart>
    </div>

    <div v-else class="uip-max-h-280 uip-flex uip-flex-column uip-row-gap-xxs" style="overflow: auto">
      <template v-for="option in formattedOptions">
        <div
          class="uip-background-default uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-flex uip-flex-row uip-flex-center"
          @click="addSelected(option.name, selectedOptions)"
          v-if="ifInSearch(option.name)"
          style="cursor: pointer"
        >
          <div class="uip-flex uip-flex-center uip-flex-middle uip-margin-right-xs">
            <input type="checkbox" :name="option.name" :value="option.name" class="uip-checkbox uip-margin-remove" :checked="ifSelected(option.name, selectedOptions)" />
          </div>

          <div class="uip-flex-grow uip-text-s uip-flex uip-gap-xxs">
            <div class="uip-text-bold uip-text-emphasis">{{ option.label }}</div>
            <div class="uip-text-muted">{{ option.name }}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
