const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    returnData: Function,
    value: Object,
  },
  data() {
    return {
      tabs: [],
      strings: {
        addNew: __('New tab', 'uipress-lite'),
      },
    };
  },
  watch: {
    tabs: {
      handler(newValue, oldValue) {
        this.returnData({ tabs: this.tabs });
      },
      deep: true,
    },
  },
  computed: {
    returnTabs() {
      return this.tabs;
    },
  },
  mounted() {
    this.injectValue();
  },
  methods: {
    /**
     * Injects prop value if array
     *
     * @since 3.2.13
     */
    injectValue() {
      if (!this.isObject(this.value)) return;
      if (!Array.isArray(this.value)) return;

      this.tabs = this.value.tabs;
    },

    /**
     * Deletes given tab by index
     *
     * @param {Number} index - index of item to be deleted
     * @since 3.2.13
     */
    deleteTab(index) {
      this.tabs.splice(index, 1);
    },

    /**
     * Creates a new tab
     *
     * @since 3.2.13
     */
    newTab() {
      this.tabs.push({ name: __('Tab', 'uipress-lite'), id: '' });
    },
  },
  template: `
      <div class="uip-flex uip-flex-column uip-row-gap-xs uip-w-100p">
      
          
          <uip-draggable
          v-if="tabs.length"
          class="uip-flex uip-flex-column uip-row-gap-xs uip-w-100p"
          :group="{ name: 'tabs', pull: false, put: false }" 
          :list="tabs"
          animation="300"
          itemKey="id"
          :sort="true"
          handle=".uip-cursor-drag">
            
            <template v-for="(element, index) in tabs" 
            :key="index" :index="index">
              <div class="uip-flex uip-gap-xxs uip-flex-center">
                <div class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-cursor-drag">drag_indicator</div>
                
                <input type="text" v-model="element.name" class="uip-input-small uip-flex-grow">
                
                <div @click="deleteTab(index)" class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted">close</div>
                
              </div>
            </template>
            
          </uip-draggable>
          
          <div @click="newTab()" class="uip-padding-xxs uip-border-rounder uip-background-muted hover:uip-background-grey uip-cursor-pointer uip-flex uip-flex-middle uip-flex-center uip-gap-xs">
            <span class="uip-icon">add</span>
          </div>
      </div>
      `,
};
