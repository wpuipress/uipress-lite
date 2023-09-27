export default {
  props: {
    openOnTick: Boolean,
    titleClass: String,
    startOpen: Boolean,
    padding: Boolean,
  },
  data() {
    return {
      open: false,
    };
  },
  watch: {
    startOpen: {
      handler(newValue, oldValue) {
        this.open = newValue;
      },
      immediate: true,
    },
  },
  computed: {
    /**
     * Returns whether the accordion has a footer slot
     *
     * @returns {boolean}
     * @since 3.2.13
     */
    hasFooterSlot() {
      return !!this.$slots.content;
    },

    /**
     * Returns classes for title element
     *
     * @since 3.2.13
     */
    returnClasses() {
      if (this.titleClass) return this.titleClass;
      return 'uip-margin-bottom-xxs uip-text-bold uip-text-emphasis uip-link-default';
    },
  },
  methods: {
    /**
     * Toggles the open state of the accordion
     *
     * @since 3.2.13
     */
    toggleOpen() {
      this.open = !this.open;
    },
  },
  template: `
        <div>
      
          <div @click="toggleOpen()"
          class="uip-flex uip-cursor-pointer uip-flex-middle uip-flex-center uip-flex-between uip-accordion-title uip-gap-s " :class="returnClasses">
          
            <slot name="title"></slot>
            
            <div v-if="hasFooterSlot" class="uip-ratio-1-1 uip-icon uip-padding-xxxs uip-accordion-trigger uip-icon-medium uip-text-l uip-line-height-1" type="button" >
              <span v-if="!open">add</span>
              <span v-if="open">remove</span>
            </div>
            
          </div>
          
          <div v-if="open && hasFooterSlot" class="uip-padding-s uip-padding-right-remove uip-scale-in-top-right" :class="padding ? '' : 'uip-padding-left-remove'">
            <slot name="content"></slot>
          </div>
          
        </div>
      `,
};
