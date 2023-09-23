export const core = {
  props: {
    selected: Array,
    placeHolder: String,
    searchPlaceHolder: String,
    single: Boolean,
    updateSelected: Function,
    availableOptions: Array,
  },
  data() {
    return {
      thisSearchInput: '',
      options: this.availableOptions,
      loading: false,
      selectedOptions: this.selected,
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
    /**
     * Returns options
     *
     * @since 3.1.0
     */
    formattedOptions() {
      return this.options;
    },
    /**
     * Returns loading status
     *
     * @since 3.1.0
     */
    returnLoading() {
      return this.loading;
    },
  },
  methods: {
    stopLoading() {
      this.loading = false;
    },
    /**
     * Adds selected item
     *
     * @param {Mixed} selectedoption
     * @since 3.1.0
     */
    addSelected(selectedoption) {
      //if selected then remove it
      if (this.ifSelected(selectedoption)) {
        this.removeSelected(selectedoption);
        return;
      }
      if (this.single == true) {
        this.selectedOptions[0] = selectedoption;
      } else {
        this.selectedOptions.push(selectedoption);
      }
    },
    /**
     * Removes selected option
     *
     * @param {Mixed} option
     * @since 3.1.0
     */
    removeSelected(option) {
      let index = this.selectedOptions.indexOf(option);
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
    },

    /**
     * Checks if item is in selected options already
     *
     * @param {Mixed} option
     * @since 3.2.0
     */
    ifSelected(option) {
      let index = this.selectedOptions.indexOf(option);
      if (index > -1) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * Check if item is in search
     *
     * @param {Mixed} option
     * @since 3.1.0
     */
    ifInSearch(option) {
      let item = option.toLowerCase();
      let string = this.thisSearchInput.toLowerCase();

      if (item.includes(string)) {
        return true;
      } else {
        return false;
      }
    },
  },
  template: `
      
        <div class="uip-flex uip-flex-column uip-row-gap-s">
                
          <div class="uip-flex uip-background-muted uip-border-rounder uip-flex-center uip-padding-xxs uip-gap-xs">
            <span class="uip-icon uip-text-muted">search</span>
            <input class="uip-blank-input uip-flex-grow uip-text-s" type="search"  
            :placeholder="searchPlaceHolder" v-model="thisSearchInput" autofocus>
          </div>
          
          
          <div v-if="returnLoading" class="uip-w-100p uip-flex uip-flex-center uip-flex-middle uip-h-200" :key="returnLoading">
            <loading-chart></loading-chart>
          </div>
          
          <div v-else class="uip-max-h-280 uip-flex uip-flex-column uip-row-gap-xxs" style="overflow:auto">
            <template v-for="option in formattedOptions">
            
              <div class="uip-background-default uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-flex uip-flex-row uip-flex-center" 
              @click="addSelected(option.name, selectedOptions)" 
              v-if="ifInSearch(option.name)" 
              style="cursor: pointer">
              
                  <div class="uip-flex uip-flex-center uip-flex-middle uip-margin-right-xs">
                    <input type="checkbox" :name="option.name" :value="option.name" class="uip-checkbox uip-margin-remove" 
                    :checked="ifSelected(option.name, selectedOptions)">
                  </div>
                  
                  <div class="uip-flex-grow uip-text-s uip-flex uip-gap-xxs">
                    <div class="uip-text-bold uip-text-emphasis">{{option.label}}</div>
                    <div class="uip-text-muted">{{option.name}}</div>
                  </div>
                
              </div>
              
            </template>
          </div>
        </div>
    `,
};

export const preview = {
  components: {
    PostTypeSelect: core,
  },
  props: {
    selected: Array,
    placeHolder: String,
    searchPlaceHolder: String,
    single: Boolean,
    updateSelected: Function,
  },
  data: function () {
    return {
      thisSearchInput: '',
      options: [],
      loading: false,
      selectedOptions: this.selected,
      strings: {
        postTypeSelect: __('Post type select', 'uipress-lite'),
      },
    };
  },
  methods: {
    /**
     * Removes from the selected options by index
     *
     * @param {Number} index - the index of the item to remove
     */
    removeByIndex(index) {
      this.selectedOptions.splice(index, 1);
    },
  },
  template: `
  
      
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
                  <a @click.prevent.stop="removeByIndex(index)" class="uip-link-muted uip-no-underline uip-icon">close</a>
                </div>
              </template>
            </div>
          
            <span class="uip-icon uip-text-muted">add</span>
        
          </div>
        </div>
    
  `,
};

export default {
  components: {
    PostTypeSelect: core,
    PostTypePreview: preview,
  },
  props: {
    selected: Array,
    placeHolder: String,
    searchPlaceHolder: String,
    single: Boolean,
    updateSelected: Function,
    availableOptions: Array,
  },
  data() {
    return {};
  },
  template: `
  
    <dropdown pos="left center" class="uip-w-100p" ref="postselect"
    :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']">
      
      <template #trigger>
      
       <PostTypePreview :selected="selected" :placeHolder="placeHolder" :searchPlaceHolder="searchPlaceHolder" :single="single" :updateSelected="updateSelected"/>
        
      </template>
      
      
      <template #content>
      
        <div class="uip-padding-s uip-w-260 uip-flex uip-flex-column uip-row-gap-s">
        
          <div class="uip-flex uip-flex-between uip-flex-center">
          
            <div class="uip-text-emphasis uip-text-bold uip-text-s">{{ placeHolder }}</div>
            <div @click="$refs.postselect.close()"
            class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
              <span class="uip-icon">close</span>
            </div>
            
          </div>
        
          <PostTypeSelect :availableOptions="availableOptions" :selected="selected" :placeHolder="placeHolder" :searchPlaceHolder="searchPlaceHolder" :single="single" :updateSelected="updateSelected"/>
        
        
        </div>
      
      </template>
    
    </dropdown>
    
  `,
};
