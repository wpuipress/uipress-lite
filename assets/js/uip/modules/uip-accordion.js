export function moduleData() {
  return {
    props: {
      openOnTick: Boolean,
      titleClass: String,
      startOpen: Boolean,
      padding: Boolean,
    },
    data: function () {
      return {
        open: this.returnOpen(),
      };
    },
    watch: {
      startOpen: {
        handler(newValue, oldValue) {
          this.open = newValue;
        },
        deep: true,
      },
    },
    mounted: function () {},
    computed: {},
    methods: {
      returnOpen() {
        return this.startOpen;
      },
      hasFooterSlot() {
        return !!this.$slots.content;
      },
      openClose() {
        return (this.open = !this.open);
      },
      returnClasses() {
        if (this.titleClass) {
          return this.titleClass;
        } else {
          return 'uip-margin-bottom-xxs uip-text-bold uip-text-emphasis uip-link-default';
        }
      },
    },
    template: `
    <div>
        <div @click="openClose()"
        class="uip-flex uip-cursor-pointer uip-flex-middle uip-flex-center uip-flex-between uip-accordion-title uip-gap-s " :class="returnClasses()">
          <slot name="title"></slot>
          <div v-if="hasFooterSlot()" class="uip-ratio-1-1 uip-icon uip-padding-xxxs uip-accordion-trigger uip-icon-medium uip-text-l uip-line-height-1" type="button" >
            <span v-if="!open">add</span>
            <span v-if="open">remove</span>
          </div>
        </div>
        <div v-if="open && hasFooterSlot()" class="uip-padding-s uip-padding-right-remove uip-scale-in-top-right" :class="padding ? '' : 'uip-padding-left-remove'">
          <slot name="content"></slot>
        </div>
      </div>
      `,
  };
}
