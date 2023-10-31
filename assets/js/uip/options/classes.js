const { __, _x, _n, _nx } = wp.i18n;

export default {
  props: {
    returnData: Function,
    value: String,
    placeHolder: String,
    args: Object,
    size: String,
  },
  data() {
    return {
      option: "",
      userInput: "",
      selected: [],
      rendered: false,
      search: "",
      allRules: [],
      updating: false,
      strings: {
        manualPlaceHolder: __("Classes", "uipress-lite"),
        searchClasses: __("Search classes", "uipress-lite"),
        search: __("Search", "uipress-lite"),
      },
    };
  },
  watch: {
    /**
     * Watches for changes to option and returns the data
     *
     * @since 3.2.13
     */
    value: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.parseInput();
      },
      deep: true,
      immediate: true,
    },
    /**
     * Watches for changes to option and returns the data
     *
     * @since 3.2.13
     */
    option: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.returnData(this.option);
      },
      deep: true,
    },
    /**
     * Watches changes to the user input and pushes when it detects spaces
     *
     * @since 3.2.13
     */
    userInput: {
      handler(newValue, oldValue) {
        if (!newValue || !this.rendered) return;
        if (!newValue.includes(" ")) return;
        let parts = newValue.split(" ");
        for (const userClass of parts) {
          if (userClass) {
            this.selected.push(userClass);
          }
        }
        this.userInput = "";
      },
    },
    /**
     * Watches selected and returns the selected options back as a string
     *
     * @since 3.2.13
     */
    selected: {
      handler(newValue, oldValue) {
        this.returnData(this.selected.join(" "));
      },
      deep: true,
    },
  },
  created() {
    this.getClassNames();
  },
  async mounted() {
    await this.$nextTick();
    this.rendered = true;
  },
  computed: {
    allClasses() {
      return this.allRules;
    },
  },
  methods: {
    /**
     * Parses input value
     *
     * @since 3.2.13
     */
    async parseInput() {
      this.updating = true;

      this.selected = [];
      this.option = this.value && typeof this.value !== "undefined" ? this.value : "";

      // No spaces so just a single class
      if (!this.option.includes(" ") && this.option != "") {
        this.selected.push(this.option);
        await this.$nextTick();
        this.updating = false;
        return;
      }

      const parts = this.option.split(" ");

      for (const userClass of parts) {
        if (!userClass) continue;
        this.selected.push(userClass);
      }

      await this.$nextTick();
      this.updating = false;
    },

    /**
     * Handles new class submit on return press
     *
     * @param {Object} evt - keyup event
     * @since 3.2.13
     */
    submiteNewClass(evt) {
      let newValue = this.userInput;
      if (!newValue) return;

      if (!newValue.includes(" ")) {
        this.selected.push(newValue);
        this.userInput = "";
        return;
      }

      let parts = newValue.split(" ");

      for (const userClass of parts) {
        if (!userClass) continue;
        this.selected.push(userClass);
      }
      this.userInput = "";
    },
    /**
     * Retrieves and sets unique class names from stylesheets.
     *
     * Scans all available stylesheets for class selectors. It ignores class selectors that
     * have pseudoelements, special characters or are mixed with other types of selectors.
     * Additionally, it merges these detected classes with custom classes specified in the component's data.
     * The final set of classes are stored in the `allRules` data property.
     *
     * @since 3.2.13
     */
    getClassNames() {
      const collectedClasses = [];

      // Loop through stylesheets to collect classes
      const styleSheets = Array.from(document.styleSheets);
      for (const styleSheet of styleSheets) {
        let cssRules;

        try {
          cssRules = Array.from(styleSheet.cssRules);
        } catch (err) {
          continue;
        }

        for (const cssRule of cssRules) {
          const selector = cssRule.selectorText;
          if (!this.isValidClassSelector(selector)) continue;

          const className = selector.slice(1);
          collectedClasses.push(className);
        }
      }

      // Deduplicate and sort
      collectedClasses.sort();

      const userClasses = this.uipApp.data ? this.uipApp.data.options.customClasses : [];
      if (Array.isArray(userClasses)) {
        userClasses.sort();
        collectedClasses.unshift(...userClasses);
      }

      this.allRules = [...new Set(collectedClasses)];
    },

    /**
     * Validates if a given selector is a valid and simple class selector.
     *
     * @param {string} selector - The CSS selector string.
     * @returns {boolean} - True if valid class selector, false otherwise.
     */
    isValidClassSelector(selector) {
      if (!selector) return false;

      const invalidPatterns = ["::", " ", "[", ">", ":", "~", "#"];
      const hasInvalidPattern = invalidPatterns.some((pattern) => selector.includes(pattern));

      return selector.startsWith(".") && !hasInvalidPattern && !selector.slice(1).includes(".");
    },

    /**
     * Removes selected class by index
     *
     * @param {Number} index - The index of the item to remove
     * @since 3.2.13
     */
    removeSelected(index) {
      this.selected.splice(index, 1);
    },
    /**
     * Returns whether a given item matches the search string
     *
     * @param {String} className - the class name to check
     * @since 3.2.13
     */
    inSearch(className) {
      if (!this.search) return true;

      let lc = className.toLowerCase();
      let slc = this.search.toLowerCase();

      if (lc.includes(slc)) return true;
    },
  },
  template: `
    <div class="uip-flex uip-flex-column uip-gap-xs uip-w-100p">
    
      <div class="uip-flex uip-gap-xxs uip-w-100p uip-flex-wrap uip-flex-center">
      
        <dropdown pos="left center"  :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']"
        ref="classDrop">
          <template v-slot:trigger>
            <div class="uip-button-default uip-border-rounder uip-icon uip-padding-xxs uip-link-muted">search</div>
          </template>
          
          <template v-slot:content>
          
            <div class="uip-flex uip-flex-column uip-row-gap-s uip-padding-s uip-w-240">
            
              <div class="uip-flex uip-flex-between uip-flex-center">
                <div class="uip-text-emphasis uip-text-bold uip-text-s">{{strings.searchClasses}}</div>
                <div @click.prevent.stop="$refs.classDrop.close()"
                class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
                  <span class="uip-icon">close</span>
                </div>
              </div>
              
              <div class="uip-flex uip-background-muted uip-border-rounder uip-padding-xxs uip-flex-center">
               <span class="uip-icon uip-text-muted uip-margin-right-xs">search</span>
               <input class="uip-blank-input uip-flex-grow uip-text-s" type="search"  
               :placeholder="strings.search" v-model="search" autofocus>
              </div>
            
              
              <div class="uip-flex uip-flex-column uip-max-h-400" style="overflow:auto">
              
                <template v-for="className in allClasses">
                  <div  v-if="inSearch(className)" class="uip-link-muted uip-flex-between uip-flex uip-padding-xxs uip-border-rounder hover:uip-background-muted uip-flex-center"
                  @click="selected.push(className)">
                    <div class="">{{className}}</div>
                    <div class="uip-icon">add</div>
                  </div>
                </template>
              
              </div>
              
            </div>
          
          </template>
        </dropdown>
        
        
        <input type="text" class="uip-input-small uip-flex-grow" v-model="userInput" @keyup.enter.prevent="submiteNewClass($event)" :placeholder="strings.manualPlaceHolder">
        
      </div>  
        
      <div class="uip-flex uip-gap-xxs uip-w-100p uip-flex-wrap" v-if="selected.length">  
        <template v-for="(item, index) in selected">
          <div class="uip-padding-left-xs uip-padding-right-xs uip-background-muted uip-border-rounder hover:uip-background-grey uip-flex uip-gap-xxs uip-flex-center uip-text-s">
            <span class="">{{item}}</span>
            <a class="uip-link-muted uip-no-underline uip-icon" @click="removeSelected(index)">close</a>
          </div>
        </template>
      </div>
        
      </div>
    `,
};
