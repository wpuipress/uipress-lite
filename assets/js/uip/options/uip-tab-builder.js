const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: Object,
    },
    data: function () {
      return {
        tabs: this.value.tabs,
        rendered: false,
        strings: {
          addNew: __('New tab', 'uipress-lite'),
        },
      };
    },
    mounted: function () {
      let self = this;
      setTimeout(function () {
        self.rendered = true;
      }, 400);
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
    methods: {
      deleteTab(index) {
        this.tabs.splice(index, 1);
      },
      newTab() {
        this.tabs.push({ name: __('Tab', 'uipress-lite'), id: '' });
      },
    },
    template: `
      <div class="uip-flex uip-flex-column uip-row-gap-xs uip-w-100p">
      
          
          <uip-draggable v-if="tabs.length > 0 && rendered"
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
}
