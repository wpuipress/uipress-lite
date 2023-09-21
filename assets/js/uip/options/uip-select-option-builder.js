const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: Object,
    },
    data: function () {
      return {
        options: [],
        strings: {
          addNew: __('New option', 'uipress-lite'),
          label: __('Label', 'uipress-lite'),
          value: __('Value', 'uipress-lite'),
        },
        renderd: false,
      };
    },
    mounted: function () {
      if (Array.isArray(this.value.options)) {
        this.options = this.value.options;
      }
      this.$nextTick(() => {
        this.renderd = true;
      });
    },
    watch: {
      options: {
        handler(newValue, oldValue) {
          this.returnData({ options: this.options });
        },
        deep: true,
      },
    },
    computed: {
      returnTabs() {
        return this.options;
      },
    },
    methods: {
      deleteTab(index) {
        this.options.splice(index, 1);
      },
      newTab() {
        this.options.push({ label: __('Option', 'uipress-lite'), name: '' });
      },
      setdropAreaStyles() {
        let returnData = [];
        returnData.class = 'uip-flex uip-flex-column uip-row-gap-xs uip-w-100p';
        return returnData;
      },
    },
    template: `<div class="uip-flex uip-flex-column uip-row-gap-xs uip-w-100p" v-if="renderd">
    
    
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

                
                <button @click="deleteTab(index)" class="uip-button-default uip-border-rounder uip-icon uip-padding-xxs uip-link-muted">close</button>
                
              </div>
            </template>
            
        </uip-draggable >
        
        <div @click="newTab()" class="uip-padding-xxs uip-border-rounder uip-background-muted hover:uip-background-grey uip-cursor-pointer uip-flex uip-flex-middle uip-flex-center uip-gap-xs">
          <span class="uip-icon">add</span>
        </div>
        
      </div>
      
      
      `,
  };
}
