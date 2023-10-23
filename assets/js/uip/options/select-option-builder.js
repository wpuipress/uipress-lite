const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    returnData: Function,
    value: Object,
  },
  data() {
    return {
      options: [],
      updating: false,
      strings: {
        addNew: __("New option", "uipress-lite"),
        label: __("Label", "uipress-lite"),
        value: __("Value", "uipress-lite"),
      },
    };
  },
  watch: {
    value: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.injectPropValue();
      },
      deep: true,
      immediate: true,
    },
    options: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.returnData({ options: this.options });
      },
      deep: true,
    },
  },
  methods: {
    /**
     * Injects input value from props
     *
     * @since 3.2.13
     */
    async injectPropValue() {
      this.updating = true;
      this.options = [];
      if (!this.isObject(this.value)) return;
      if (!Array.isArray(this.value.options)) return;

      this.options = this.value.options;

      await this.$nextTick();
      this.updating = false;
    },
    /**
     * Deletes options
     *
     * @param {Number} index - the index of the item to be deleted
     */
    deleteOption(index) {
      this.options.splice(index, 1);
    },

    /**
     * Adds new options
     *
     * @since 3.2.13
     */
    newOption() {
      this.options.push({ label: __("Option", "uipress-lite"), name: "" });
    },
  },
  template: `
    
    <div class="uip-flex uip-flex-column uip-row-gap-xs uip-w-100p">
    
    
        <uip-draggable 
        class="uip-flex uip-flex-column uip-row-gap-xs uip-w-100p"
        :group="{ name: 'uip-drop', pull: false, put: false }" 
        :list="options"
        animation="300"
        :sort="true"
        handle=".uip-cursor-drag">
            
            <template v-for="(element, index) in options" 
            :key="index" :index="index">
            
              <div class="uip-flex uip-gap-xxs uip-w-100p">
                
                <button class="uip-button-default uip-border-rounder uip-icon uip-padding-xxs uip-link-muted uip-cursor-drag">drag_indicator</button>
                
                <input type="text" :placeholder="strings.label" v-model="element.label" :key="index" class="uip-input-small uip-flex-shrink uip-w-70">
                <input type="text" :placeholder="strings.value" v-model="element.name" :key="index" class="uip-input-small uip-flex-grow uip-w-70">

                
                <button @click="deleteOption(index)" class="uip-button-default uip-border-rounder uip-icon uip-padding-xxs uip-link-muted">close</button>
                
              </div>
            </template>
            
        </uip-draggable >
        
        <div @click="newOption()" class="uip-padding-xxs uip-border-rounder uip-background-muted hover:uip-background-grey uip-cursor-pointer uip-flex uip-flex-middle uip-flex-center uip-gap-xs">
          <span class="uip-icon">add</span>
        </div>
        
      </div>
      
      
      `,
};
