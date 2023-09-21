const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: Array,
    },
    data: function () {
      return {
        items: this.value,
        strings: {
          addNew: __('New item', 'uipress-lite'),
        },
      };
    },
    inject: ['uipress'],
    mounted: function () {},
    watch: {
      items: {
        handler(newValue, oldValue) {
          this.returnData(this.items);
        },
        deep: true,
      },
    },
    computed: {
      returnItems() {
        return this.items;
      },
    },
    methods: {
      deleteTab(index) {
        this.items.splice(index, 1);
      },
      newTab() {
        this.items.push({ value: '', id: this.uipress.createUID() });
      },
      setdropAreaStyles() {
        let returnData = [];
        returnData.class = 'uip-flex uip-flex-column uip-row-gap-xs uip-w-100p';
        return returnData;
      },
    },
    template: `
    
    <div class="uip-flex uip-flex-column uip-row-gap-xs">
      
      <uip-draggable v-if="items.length > 0"
      :list="items" 
      class="uip-flex uip-flex-column uip-row-gap-xs uip-w-100p"
      :group="{ name: 'tabs', pull: false, put: false  }"
      animation="300"
      handle=".uip-cursor-drag"
      @start="drag=true"
      @end="drag=false"
      :sort="true"
      itemKey="id">
      
        <template v-for="(element, index) in items" :key="element.value" :index="index">
        
			    <div class="uip-flex uip-flex-row uip-gap-xs uip-flex-center">
          
				    <div @click="deleteTab(index)" class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-cursor-drag">drag_indicator</div>
            
				    <input type="text" v-model="element.value" class="uip-input-small uip-flex-grow" placeholder="/path/to/file">
  
            <div @click="deleteTab(index)" class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted">close</div>
            
          </div>  
          
			  </template>
        
		  </uip-draggable>
      
      <button @click="newTab()" class="uip-button-default uip-border-rounder uip-padding-xxs uip-w-100p"><span class="uip-icon">add</span></button>
      
	  </div>`,
  };
}
