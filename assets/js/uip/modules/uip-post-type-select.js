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
        loading: false,
        selectedOptions: this.selected,
        ui: {
          dropOpen: false,
        },
      };
    },
    inject: ['uipress'],

    watch: {
      selected: {
        handler(newValue, oldValue) {
          if (JSON.stringify(this.selected) != JSON.stringify(this.selectedOptions)) {
            this.selectedOptions = this.selected;
          }
        },
        deep: true,
      },
      selectedOptions: {
        handler(newValue, oldValue) {
          this.updateSelected(this.selectedOptions);
        },
        deep: true,
      },
    },
    computed: {
      formattedOptions() {
        return this.options;
      },
      returnLoading() {
        return this.loading;
      },
    },
    methods: {
      getPostTypes() {
        self = this;

        if (this.options.length > 0) {
          console.log('saved');
          return;
        }
        self.loading = true;
        let formData = new FormData();
        formData.append('action', 'uip_get_post_types');
        formData.append('security', uip_ajax.security);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          if (response.error) {
            self.uipress.notify(response.error, 'error');
            self.stopLoading();
            return;
          }

          this.options = response.postTypes;
          this.stopLoading();
        });
      },
      stopLoading() {
        this.loading = false;
      },
      //////TITLE: ADDS A SELECTED OPTION//////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /////DESCRIPTION: ADDS A SELECTED OPTION FROM OPTIONS
      addSelected(selectedoption, options) {
        //if selected then remove it
        if (this.ifSelected(selectedoption, options)) {
          this.removeSelected(selectedoption, options);
          return;
        }
        if (this.single == true) {
          options[0] = selectedoption;
        } else {
          options.push(selectedoption);
        }
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
      removeByIndex(index) {
        this.selectedOptions.splice(index, 1);
      },
      //////TITLE:  CHECKS IF SELECTED OR NOT//////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /////DESCRIPTION: ADDS A SELECTED OPTION FROM OPTIONS
      ifSelected(option, options) {
        let index = options.indexOf(option);
        if (index > -1) {
          return true;
        } else {
          return false;
        }
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
    },
    template: `
    <dropdown pos="left center" class="uip-w-100p" triggerClass="uip-w-100p" :onOpen="getPostTypes">
      
      <template v-slot:trigger>
      
        <div class="uip-padding-xxs uip-background-muted uip-border-rounder uip-w-100p uip-w-100p uip-cursor-pointer uip-border-box"> 
          <div class="uip-flex uip-flex-center">
          
            <div class="uip-flex-grow uip-margin-right-s" v-if="selectedOptions.length < 1">
              <div>
              <span class="uip-text-muted">{{placeHolder}}...</span>
              </div>
            </div>
            
            <div v-else class="uip-flex-grow uip-flex uip-flex-row uip-row-gap-xxs uip-gap-xxs uip-margin-right-s uip-flex-wrap">
              <template v-for="(item, index) in selectedOptions">
                <div class="uip-padding-left-xxs uip-padding-right-xxs uip-background-highlight uip-border-rounder uip-border uip-flex uip-gap-xxs uip-flex-center uip-shadow-small">
                  <span class="uip-text-s">{{item}}</span>
                  <a @click="removeByIndex(index)" class="uip-link-muted uip-no-underline uip-icon">close</a>
                </div>
              </template>
            </div>
          
            <span class="uip-icon uip-text-muted">add</span>
        
          </div>
        </div>
        
      </template>
      
      <template v-slot:content >
      
        <div class="uip-flex uip-flex-column uip-row-gap-xs uip-padding-xs">
        
          <div class="uip-flex uip-background-default uip-flex-center">
            <span class="uip-icon uip-text-muted uip-margin-right-xs">search</span>
            <input class="uip-blank-input uip-flex-grow" type="search"  
            :placeholder="searchPlaceHolder" v-model="thisSearchInput" autofocus>
          </div>
          
          <div class="uip-border-top"></div>
          
          <div v-if="returnLoading" class="uip-w-100p uip-flex uip-flex-center uip-flex-middle uip-h-200" :key="returnLoading">
            <loading-chart></loading-chart>
          </div>
          
          <div v-else class="uip-max-h-280 uip-overflow-auto" :key="'list-' + returnLoading">
            <template v-for="option in formattedOptions">
            
              <div class="uip-background-default uip-padding-xxxs hover:uip-background-muted uip-border-rounder " 
              @click="addSelected(option.name, selectedOptions)" 
              v-if="ifInSearch(option.name, thisSearchInput)" 
              style="cursor: pointer">
              
                <div class="uip-flex uip-flex-row uip-flex-center">
                  <div class="uip-flex uip-flex-center uip-flex-middle uip-margin-right-xs">
                  <input type="checkbox" :name="option.name" :value="option.name" class="uip-checkbox" :checked="ifSelected(option.name, selectedOptions)">
                  </div>
                  <div class="uip-flex-grow uip-text-s">
                    <div class="uip-text-bold uip-text-emphasis">{{option.label}}</div>
                    <div class="uip-text-muted">{{option.name}}</div>
                  </div>
                </div>
                
              </div>
              
            </template>
          </div>
        </div>
    
      </template>
      
      
    </dropdown>
    `,
  };
}
