const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      //array of selected items
      selected: Array,
      //Placeholder
      placeHolder: String,
      //Search Placeholder
      searchPlaceHolder: String,
      //Whether it is single select or multi
      single: Boolean,
      //Function to return selected on change
      updateSelected: Function,
    },
    data: function () {
      return {
        thisSearchInput: '',
        options: [],
        selectedOptions: this.selected,
        loading: true,
        ui: {
          dropOpen: false,
        },
        strings: {
          add: __('Add', 'uipress-lite'),
          columnTitle: __('Column title', 'uipress-lite'),
        },
      };
    },
    mounted: function () {
      this.openThisComponent();
    },
    inject: ['uipress'],
    computed: {
      formattedOptions() {
        return this.options;
      },
      returnLoading() {
        return this.loading;
      },
    },
    watch: {
      selectedOptions: {
        handler(newValue, oldValue) {
          this.updateSelected(this.selectedOptions);
        },
        deep: true,
      },
    },
    methods: {
      getMetaTypes() {
        self = this;

        let formData = new FormData();
        formData.append('action', 'uip_get_post_table_columns');
        formData.append('security', uip_ajax.security);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          if (response.error) {
            self.uipress.notify(response.error, 'error');
            self.loading = false;
            return;
          }
          self.loading = false;
          self.options = response.keys;
        });
      },
      //////TITLE: ADDS A SELECTED OPTION//////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /////DESCRIPTION: ADDS A SELECTED OPTION FROM OPTIONS
      toggleSelected(option) {
        var result = this.selectedOptions.findIndex((obj) => {
          return obj.name === option.name;
        });
        if (result >= 0) {
          //Selected
          this.selectedOptions.splice(result, 1);
          return;
        }
        this.selectedOptions.push(option);
      },
      //////TITLE: REMOVES A SLECTED OPTION//////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /////DESCRIPTION: ADDS A SELECTED OPTION FROM OPTIONS
      removeSelected(option, options) {
        let index = options.indexOf(option);
        if (index > -1) {
          options = options.splice(index, 1);
        }
      },
      deleteCol(index) {
        this.selectedOptions.splice(index, 1);
      },
      //////TITLE:  CHECKS IF IN SEARCH//////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /////DESCRIPTION: CHECKS IF ITEM CONTAINS STRING
      ifInSearch(option, searchString) {
        let item = option.toLowerCase();
        let string = searchString.toLowerCase();

        if (item.includes(string)) {
          return true;
        } else {
          return false;
        }
      },
      onClickOutside(event) {
        const path = event.path || (event.composedPath ? event.composedPath() : undefined);
        // check if the MouseClick occurs inside the component
        if (path && !path.includes(this.$el) && !this.$el.contains(event.target)) {
          this.closeThisComponent(); // whatever method which close your component
        }
      },
      openThisComponent() {
        this.ui.dropOpen = true; // whatever codes which open your component
        // You can also use Vue.$nextTick or setTimeout
        this.getMetaTypes();
        requestAnimationFrame(() => {
          document.documentElement.addEventListener('click', this.onClickOutside, false);
        });
      },
      closeThisComponent() {
        this.ui.dropOpen = false; // whatever codes which close your component
        document.documentElement.removeEventListener('click', this.onClickOutside, false);
      },
      isSelected(option) {
        var result = this.selectedOptions.find((obj) => {
          return obj.name === option.name;
        });
        if (result) {
          return true;
        }
        return false;
      },
    },
    template: `
    
    <div class="uip-position-relative uip-w-100p">
        <div div class="uip-flex uip-flex-column uip-row-gap-s" >
        
          
          <dropdown pos="left center" class="uip-w-100p" triggerClass="uip-w-100p">
          
            <template v-slot:trigger>
        
              <div class="uip-button-default uip-border-rounder uip-icon uip-padding-xxs uip-link-muted uip-text-center">add</div>
            
            </template>
            
            <template v-slot:content>
            
              
              <div class="uip-flex uip-padding-xs uip-border-bottom uip-flex-center">
                <span class="uip-icon uip-text-muted uip-margin-right-xs">search</span>
                <input class="uip-blank-input uip-flex-grow" type="search"  
                :placeholder="searchPlaceHolder" v-model="thisSearchInput" autofocus>
              </div>
              
              
              <div v-if="returnLoading" class="uip-w-100p uip-flex uip-flex-center uip-flex-middle uip-h-200">
                <loading-chart></loading-chart>
              </div>
              
              <div class="uip-max-h-280 uip-overflow-auto uip-scrollbar uip-padding-xxs">
                <template v-for="option in formattedOptions">
                
                  <div class=" uip-border-rounder uip-padding-xxs hover:uip-background-muted uip-link-default" 
                  v-if="ifInSearch(option.name, thisSearchInput)" @click="toggleSelected(option)">
                    <div class="uip-flex uip-flex-row uip-flex-center uip-flex-between">
                      <div class="uip-flex-grow">
                        <div class="uip-text-emphasis uip-text-s">{{option.label}}</div>
                        <div class="uip-text-muted uip-text-s">{{option.name}}</div>
                      </div>
                      <div class="uip-icon" v-if="isSelected(option)">
                        done
                      </div>
                    </div>
                  </div>
                  
                </template>
              </div>
            
            </template>
            
          </dropdown>  
          
          
          
        
        
            
          
          <div class="" v-if="selectedOptions.length > 0">
          
            
            <uip-draggable 
            class="uip-flex uip-flex-column uip-row-gap-xs uip-w-100p"
            :group="{ name: 'columns', pull: false, put: false }" 
            :list="selectedOptions"
            animation="300"
            :sort="true"
            handle=".uip-col-drag">
            
              <template v-for="(element, index) in selectedOptions" 
              :key="element.name" :index="index">
              
                <div class="uip-flex uip-flex-center uip-gap-xs">
                  
                  <div class="uip-button-default uip-border-rounder uip-icon uip-padding-xxs uip-link-muted uip-col-drag">drag_indicator</div>
                  
                  <input type="text" v-model="element.label" :placeholder="strings.columnTitle" class="uip-input uip-input-small uip-border-left-remove uip-border-round uip-flex-grow">
                  
                  <div @click="deleteCol(index)" class="uip-button-default uip-border-rounder uip-icon uip-padding-xxs uip-link-muted">close</div>
                  
                </div>
              </template>
            </uip-draggable>
          </div>
        </div>
      </div>`,
  };
}
