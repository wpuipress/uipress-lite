export function moduleData() {
  return {
    props: {
      //SELECTED OPTIONS
      selected: Array,
      //Available Options [{name: 'string', label: 'String'}]
      availableOptions: Array,
      placeHolder: String,
      // SELECT PLACEHOLDER
      searchPlaceHolder: String,
      // SINGLE OR MULTIS SELECT
      single: Boolean,
      // FUNCTION TO RETURN SELECTED ON CHANGE
      updateSelected: Function,
      //Optional meta key to show underneath name of item in list
      metaKey: String,
    },
    data: function () {
      return {
        thisSearchInput: '',
        options: this.availableOptions,
        selectedOptions: this.selected,
        ui: {
          dropOpen: false,
        },
      };
    },
    mounted: function () {},
    computed: {
      formattedOptions() {
        return this.options;
      },
    },
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
          console.log('we returned');
        },
        deep: true,
      },
    },
    methods: {
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
      removeByIndex(index) {
        this.selectedOptions.splice(index, 1);
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
        requestAnimationFrame(() => {
          document.documentElement.addEventListener('click', this.onClickOutside, false);
        });
      },
      closeThisComponent() {
        this.ui.dropOpen = false; // whatever codes which close your component
        document.documentElement.removeEventListener('click', this.onClickOutside, false);
      },
    },
    template: `
      <div class="uip-position-relative uip-w-100p" @click="openThisComponent">
      
		      <div class="uip-padding-xxs uip-background-muted uip-border-rounder uip-w-100p uip-max-w-400 uip-cursor-pointer uip-border-box" :class="{'uip-active-outline' : ui.dropOpen}"> 
		        
            <div class="uip-flex uip-flex-center">
            
              <div class="uip-flex-grow uip-margin-right-s" v-if="selectedOptions.length < 1">
                <div>
                <span class="uk-text-meta">{{placeHolder}}...</span>
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
		      <div v-if="ui.dropOpen" class="uip-position-absolute uip-background-default uip-border-rounder uip-border uip-w-400 uip-max-w-100p uip-border-box uip-z-index-9 uip-margin-top-xs uip-overflow-hidden">
		        <div class="uip-flex uip-background-default uip-padding-xs uip-border-bottom">
			      <span class="uip-icon uip-text-muted uip-margin-right-xs">search</span>
			      <input class="uip-blank-input uip-flex-grow" type="search"  
			      :placeholder="searchPlaceHolder" v-model="thisSearchInput" autofocus>
		        </div>
		        <div class="uip-max-h-280 uip-overflow-auto">
			      <template v-for="option in formattedOptions">
			        <div class="uip-background-default uip-padding-xs hover:uip-background-muted" 
			        @click="addSelected(option.name, selectedOptions)" 
			        v-if="ifInSearch(option.name, thisSearchInput)" 
			        style="cursor: pointer">
				      <div class="uip-flex uip-flex-row uip-flex-center uip-gap-xs">
				        <div class="uip-flex uip-flex-center uip-flex-middle">
					        <input type="checkbox" :name="option.name" :value="option.name" class="uip-checkbox" :checked="ifSelected(option.name, selectedOptions)">
				        </div>
				        <div class="uip-flex-grow uip-flex uip-flex-column">
					        <div class="uip-text-bold uip-text-emphasis">{{option.label}}</div>
					        <div v-if="!metaKey" class="uip-text-muted">{{option.name}}</div>
                  <div v-if="metaKey != ''" class="uip-text-muted">{{option[metaKey]}}</div>
				        </div>
				      </div>
			        </div>
			      </template>
		        </div>
		      </div>
          
	  </div>`,
  };
}
