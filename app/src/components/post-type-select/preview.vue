<script>
const { __ } = wp.i18n;
import { defineAsyncComponent } from "vue";

export default {
  props: {
    selected: Array,
    placeHolder: String,
    searchPlaceHolder: String,
    single: Boolean,
    updateSelected: Function,
  },
  data() {
    return {
      thisSearchInput: "",
      options: [],
      loading: false,
      selectedOptions: [],
      strings: {
        postTypeSelect: __("Post type select", "uipress-lite"),
      },
    };
  },
  watch: {
    selectedOptions: {
      handler(newValue, oldValue) {
        this.updateSelected(this.selectedOptions);
        // Closes multi select contextmenu
        if (this.selectedOptions.length < 1) {
          if (!this.$refs.showList) return;
          this.$refs.showList.close();
        }
      },
      deep: true,
    },
    selected: {
      handler(newValue, oldValue) {
        this.injectValue();
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    /**
     * Returns the position of the multiselect to fix the contextmenu position
     *
     * @since 3.2.13
     */
    returnSelectPosition() {
      const rect = this.$refs.multiselect.getBoundingClientRect();
      return { clientX: rect.left, clientY: rect.bottom + 8 };
    },

    /**
     * Returns width of multiselect
     *
     * @since 3.2.13
     */
    returnDropWidth() {
      const rect = this.$refs.multiselect.getBoundingClientRect();
      return { width: rect.width + "px" };
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
     * Removes from the selected options by index
     *
     * @param {Number} index - the index of the item to remove
     */
    removeByIndex(index) {
      this.selectedOptions.splice(index, 1);
    },

    /**
     * Shows all selected items and clears any timeout to close
     *
     * @param {Object} evt - mouseenter event
     */
    showSelected(evt) {
      this.$refs.showList.show(evt, this.returnSelectPosition);
      clearTimeout(this.hoverTimeout);
    },
    /**
     * Starts a timeout to close after 1 second
     *
     * @since 3.1.0
     */
    dispatchClose() {
      const handleTimeout = () => {
        this.$refs.showList.close();
      };
      this.hoverTimeout = setTimeout(handleTimeout, 1000);
    },
  },
};
</script>

<template>
  <div ref="multiselect" class="uip-padding-xxxs uip-background-muted uip-border-rounder uip-w-100p uip-max-w-400 uip-cursor-pointer uip-border-box uip-padding-right-xs">
    <div class="uip-flex uip-flex-center">
      <!-- Nothing selected -->
      <div
        v-if="selectedOptions.length < 1"
        class="uip-flex-grow uip-padding-xs uip-padding-top-xxxs uip-padding-bottom-xxxs uip-flex uip-gap-xxs uip-flex-center uip-link-default uip-text-s uip-border"
        style="border-color: transparent"
      >
        <span class="uip-text-muted">{{ placeHolder }}...</span>
      </div>

      <!-- One selected -->
      <div
        v-if="selectedOptions.length === 1"
        class="uip-padding-xs uip-padding-top-xxxs uip-padding-bottom-xxxs uip-background-highlight uip-border-rounder uip-border uip-flex uip-gap-xxs uip-flex-center uip-link-default uip-text-s"
      >
        <span class="uip-text-emphasis">{{ selectedOptions[0] }}</span>
        <a @click.prevent.stop="removeByIndex(0)" class="uip-link-muted uip-no-underline uip-icon"><AppIcon icon="close" /></a>
      </div>

      <!-- Multiple selected -->
      <div
        v-if="selectedOptions.length > 1"
        class="uip-padding-xs uip-padding-top-xxxs uip-padding-bottom-xxxs uip-background-highlight uip-border-rounder uip-border uip-flex uip-gap-xxs uip-flex-center uip-link-default uip-text-s"
        @mouseenter="showSelected($event)"
        @mouseleave="dispatchClose()"
      >
        <span class="uip-text-emphasis uip-max-w-60 uip-overflow-hidden uip-no-wrap uip-text-ellipsis">{{ selectedOptions[0] }}</span>
        <span class="uip-text-muted uip-text-s" v-if="selectedOptions.length < 3"> + {{ selectedOptions.length - 1 }} {{ strings.other }}</span>
        <span class="uip-text-muted uip-text-s" v-if="selectedOptions.length > 2"> + {{ selectedOptions.length - 1 }} {{ strings.others }}</span>
        <a @click.prevent.stop="selectedOptions.length = 0" class="uip-link-muted uip-no-underline uip-icon"><AppIcon icon="close" /></a>
      </div>

      <div class="uip-flex-grow uip-flex uip-flex-right">
        <a class="uip-link-muted uip-no-underline uip-icon"><AppIcon icon="expand_more" /></a>
      </div>
    </div>

    <component is="style">
      .selected-enter-active, .selected-leave-active { transition: all 0.3s ease; } .selected-enter-from, .selected-leave-to { opacity: 0; transform: translateX(-30px); }
    </component>

    <contextmenu ref="showList" :disableTeleport="true">
      <div class="uip-flex uip-gap-xxs uip-flex-wrap uip-padding-xs" :style="returnDropWidth" @mouseenter="showSelected($event)" @mouseleave="$refs.showList.close()">
        <TransitionGroup name="selected">
          <template v-for="(item, index) in selectedOptions" :key="item">
            <div
              class="uip-padding-xxs uip-padding-top-xxxs uip-padding-bottom-xxxs uip-background-muted uip-border-rounder uip-border uip-flex uip-gap-xxs uip-flex-center uip-link-default uip-text-xs"
            >
              <span class="uip-text-emphasis">{{ item }}</span>
              <a @click.prevent.stop="removeByIndex(index)" class="uip-link-muted uip-no-underline uip-icon"><AppIcon icon="close" /></a>
            </div>
          </template>
        </TransitionGroup>
      </div>
    </contextmenu>
  </div>
</template>
