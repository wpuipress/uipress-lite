import { defineAsyncComponent } from '../../libs/vue-esm.js';
const { __, _x, _n, _nx } = wp.i18n;

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
  watch: {
    selected: {
      handler(newValue, oldValue) {
        this.injectValue();
      },
      deep: true,
      immediate: true,
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
    /**
     * Updates selected from value
     *
     * @since 3.2.13
     */
    injectValue() {
      if (Array.isArray(this.selected)) {
        this.selectedOptions = this.selected;
      }
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
    contextmenu: defineAsyncComponent(() => import('../v3.5/utility/contextmenu.min.js?ver=3.3.1')),
  },
  props: {
    selected: Array,
    placeHolder: String,
    searchPlaceHolder: String,
    single: Boolean,
    updateSelected: Function,
  },
  data() {
    return {
      thisSearchInput: '',
      options: [],
      loading: false,
      selectedOptions: [],
      strings: {
        postTypeSelect: __('Post type select', 'uipress-lite'),
      },
    };
  },
  watch: {
    selectedOptions: {
      handler(newValue, oldValue) {
        this.updateSelected(this.selectedOptions);
        // Closes multi select contextmenu
        if (this.selectedOptions.length < 1) {
          if (!this.$refs.showList) return;
          this.$refs.showList.close();
        }
      },
      deep: true,
    },
    selected: {
      handler(newValue, oldValue) {
        this.injectValue();
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    /**
     * Returns the position of the multiselect to fix the contextmenu position
     *
     * @since 3.2.13
     */
    returnSelectPosition() {
      const rect = this.$refs.multiselect.getBoundingClientRect();
      return { clientX: rect.left, clientY: rect.bottom + 8 };
    },

    /**
     * Returns width of multiselect
     *
     * @since 3.2.13
     */
    returnDropWidth() {
      const rect = this.$refs.multiselect.getBoundingClientRect();
      return { width: rect.width + 'px' };
    },
  },
  methods: {
    /**
     * Updates selected from value
     *
     * @since 3.2.13
     */
    injectValue() {
      if (Array.isArray(this.selected)) {
        this.selectedOptions = this.selected;
      }
    },
    /**
     * Removes from the selected options by index
     *
     * @param {Number} index - the index of the item to remove
     */
    removeByIndex(index) {
      this.selectedOptions.splice(index, 1);
    },

    /**
     * Shows all selected items and clears any timeout to close
     *
     * @param {Object} evt - mouseenter event
     */
    showSelected(evt) {
      this.$refs.showList.show(evt, this.returnSelectPosition);
      clearTimeout(this.hoverTimeout);
    },

    /**
     * Starts a timeout to close after 1 second
     *
     * @since 3.1.0
     */
    dispatchClose() {
      const handleTimeout = () => {
        this.$refs.showList.close();
      };
      this.hoverTimeout = setTimeout(handleTimeout, 1000);
    },
  },
  template: `
  
      
       <div ref="multiselect"
       class="uip-padding-xxxs uip-background-muted uip-border-rounder uip-w-100p uip-max-w-400 uip-cursor-pointer uip-border-box uip-padding-right-xs"> 
       
         <div class="uip-flex uip-flex-center">
           
           <!-- Nothing selected -->
           <div v-if="selectedOptions.length < 1" class="uip-flex-grow uip-padding-xs uip-padding-top-xxxs uip-padding-bottom-xxxs uip-flex uip-gap-xxs uip-flex-center uip-link-default uip-text-s uip-border" style="border-color:transparent">
             <span class="uip-text-muted">{{placeHolder}}...</span>
           </div>
           
           <!-- One selected -->
           <div v-if="selectedOptions.length === 1" class="uip-padding-xs uip-padding-top-xxxs uip-padding-bottom-xxxs uip-background-highlight uip-border-rounder uip-border uip-flex uip-gap-xxs uip-flex-center uip-link-default uip-text-s">
             <span class="uip-text-emphasis">{{selectedOptions[0]}}</span>
             <a @click.prevent.stop="removeByIndex(0)" class="uip-link-muted uip-no-underline uip-icon">close</a>
           </div>
           
           <!-- Multiple selected -->
           <div v-if="selectedOptions.length > 1" class="uip-padding-xs uip-padding-top-xxxs uip-padding-bottom-xxxs uip-background-highlight uip-border-rounder uip-border uip-flex uip-gap-xxs uip-flex-center uip-link-default uip-text-s" 
           @mouseenter="showSelected($event)"
           @mouseleave="dispatchClose()">
             <span class="uip-text-emphasis uip-max-w-60 uip-overflow-hidden uip-no-wrap uip-text-ellipsis">{{selectedOptions[0]}}</span>
             <span class="uip-text-muted uip-text-s" v-if="selectedOptions.length < 3"> + {{ selectedOptions.length - 1 }} {{ strings.other }}</span>
             <span class="uip-text-muted uip-text-s" v-if="selectedOptions.length > 2"> + {{ selectedOptions.length - 1 }} {{ strings.others }}</span>
             <a @click.prevent.stop="selectedOptions.length = 0" class="uip-link-muted uip-no-underline uip-icon">close</a>
           </div>
           
           <div class="uip-flex-grow uip-flex uip-flex-right">
             <a class="uip-link-muted uip-no-underline uip-icon">expand_more</a>
           </div>
           
           
           
         </div>
         
         <component is="style">
           .selected-enter-active,
           .selected-leave-active {
             transition: all 0.3s ease;
           }
           .selected-enter-from,
           .selected-leave-to {
             opacity: 0;
             transform: translateX(-30px);
           }
         </component>
         
         
         <contextmenu ref="showList" :disableTeleport="true">
         
           <div class="uip-flex uip-gap-xxs uip-flex-wrap uip-padding-xs"
           :style="returnDropWidth"
           @mouseenter="showSelected($event)"
           @mouseleave="$refs.showList.close()">
             
             <TransitionGroup name="selected">
               <template v-for="(item, index) in selectedOptions" :key="item">
                 
                 <div class="uip-padding-xxs uip-padding-top-xxxs uip-padding-bottom-xxxs uip-background-muted uip-border-rounder uip-border uip-flex uip-gap-xxs uip-flex-center uip-link-default uip-text-xs">
                   <span class="uip-text-emphasis">{{item}}</span>
                   <a @click.prevent.stop="removeByIndex(index)" class="uip-link-muted uip-no-underline uip-icon">close</a>
                 </div>
               
               </template>
             </TransitionGroup>
           
           </div>
         
         </contextmenu>
         
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
