import { nextTick } from "../../libs/vue-esm.js";
export default {
  props: {
    returnData: Function,
    value: [String, Array, Object],
    placeHolder: String,
    args: Object,
    size: String,
  },

  data() {
    return {
      option: this.returnDefaultOptions,
      updating: false,
      strings: {
        newCondition: __("New condition", "uipress-lite"),
        type: __("Type", "uipress-lite"),
        operator: __("Operator", "uipress-lite"),
        searchUsers: __("Search", "uipress-lite"),
        value: __("Value", "uipress-lite"),
        addCondition: __("Add condition", "uipress-lite"),
        editCondition: __("Edit condition", "uipress-lite"),
        users: __("Users", "uipress-lite"),
        dateAndTime: __("Date and time", "uipress-lite"),
        site: __("Site", "uipress-lite"),
      },
      newCondition: {
        type: "userrole",
        operator: "is",
        value: "",
      },
      conditions: {
        relations: {
          and: {
            value: "and",
            label: __("And", "uipress-lite"),
          },
          or: {
            value: "or",
            label: __("Or", "uipress-lite"),
          },
        },
        operators: {
          is: {
            value: "is",
            label: __("Is (===)", "uipress-lite"),
            shortHand: "===",
          },
          isnot: {
            value: "isnot",
            label: __("Is not (!=)", "uipress-lite"),
            shortHand: "!==",
          },
          contains: {
            value: "contains",
            label: __("Contains", "uipress-lite"),
            shortHand: "contains",
          },
        },
        numericalOperators: {
          greaterThan: {
            value: "greaterThan",
            label: __("Greater than (>)", "uipress-lite"),
            shortHand: ">",
          },
          greaterThanEqualTo: {
            value: "greaterThanEqualTo",
            label: __("Greater than or equal to (>=)", "uipress-lite"),
            shortHand: ">=",
          },
          lessThan: {
            value: "lessThan",
            label: __("Less than (<)", "uipress-lite"),
            shortHand: "<",
          },
          lessThanEqualTo: {
            value: "lessThanEqualTo",
            label: __("Less than or equal to (<=)", "uipress-lite"),
            shortHand: "<=",
          },
        },
      },
    };
  },
  watch: {
    /**
     * Watches changes to value and injects
     *
     * @since 3.2.13
     */
    value: {
      handler() {
        if (this.updating) return;
        this.injectProp();
      },
      deep: true,
      immediate: true,
    },

    /**
     * Watches changes to options and updates to caller
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
  },
  computed: {
    /**
     * Returns list of all operators
     *
     * @since 3.3.095
     */
    returnAllOperators() {
      return { ...this.conditions.operators, ...this.conditions.numericalOperators };
    },

    /**
     * Returns list of user types conditions
     *
     * @since 3.3.095
     */
    returnUserTypes() {
      return [
        {
          value: "userrole",
          label: __("User role", "uipress-lite"),
        },
        {
          value: "userlogin",
          label: __("User login", "uipress-lite"),
        },
        {
          value: "userid",
          label: __("User ID", "uipress-lite"),
        },
        {
          value: "useremail",
          label: __("User email", "uipress-lite"),
        },
      ];
    },

    /**
     * Returns list of date types conditions
     *
     * @since 3.3.095
     */
    returnDateTypes() {
      return [
        {
          value: "weekday",
          label: __("Weekday (EN)", "uipress-lite"),
        },
        {
          value: "date",
          label: __("Date (YYYY-MM-DD)", "uipress-lite"),
        },
        {
          value: "time",
          label: __("Time (HH:MM)", "uipress-lite"),
        },
      ];
    },

    /**
     * Returns list of site types conditions
     *
     * @since 3.3.095
     */
    returnSiteTypes() {
      return [
        {
          value: "siteTitle",
          label: __("Site title", "uipress-lite"),
        },
        {
          value: "siteURL",
          label: __("Site URL", "uipress-lite"),
        },
        {
          value: "adminURL",
          label: __("Admin URL", "uipress-lite"),
        },
        {
          value: "currentPageName",
          label: __("Current page name", "uipress-lite"),
        },
        {
          value: "currentURL",
          label: __("Current URL", "uipress-lite"),
        },
        {
          value: "locale",
          label: __("Language (en-US)", "uipress-lite"),
        },
        {
          value: "pluginActive",
          label: __("Plugin is active (uipress-lite)", "uipress-lite"),
        },
        {
          value: "notificationCount",
          label: __("Notification count", "uipress-lite"),
        },
        {
          value: "darkMode",
          label: __("Dark mode (true | false)", "uipress-lite"),
        },
      ];
    },

    /**
     * Returns whether there are any conditions
     *
     * @returns {boolean}
     * @since 3.2.13
     */
    hasConditions() {
      if (!this.option.conditions) return false;
      return this.option.conditions.length;
    },

    /**
     * Returns default options for conditions
     *
     * @since 3.2.13
     */
    returnDefaultOptions() {
      return {
        relation: "and",
        conditions: [],
      };
    },
  },
  methods: {
    /**
     * Returns list of operators depending on value of
     *
     * @param {String} type - the current type of comparison
     *
     * @since 3.3.095
     */
    returnOperators(type) {
      const numericalTypes = ["date", "time", "userid", "notificationCount"];

      // Numerical operators
      if (numericalTypes.includes(type)) return { ...this.conditions.operators, ...this.conditions.numericalOperators };

      // Standard operators
      return this.conditions.operators;
    },

    /**
     * Injects prop value into component
     *
     * @since 3.2.13
     */
    async injectProp() {
      this.updating = true;
      this.option = this.isObject(this.value) ? this.value : { relation: "and", conditions: [] };

      await nextTick();
      this.updating = false;
    },

    /**
     * Adds a new condition
     *
     * @since 3.2.13
     */
    async addCondition() {
      const newCondition = JSON.parse(JSON.stringify(this.newCondition));
      this.option.conditions.push(newCondition);
      await this.$nextTick();
      const opener = () => {
        const newIndex = this.option.conditions.length - 1;
        this.$refs["condition" + newIndex][0].show();
      };
      setTimeout(opener, 100);
    },

    /**
     * Removes a condition
     *
     * @param {Number} index - index of item to remove
     * @since 3.2.13
     */
    removeCondition(index) {
      this.option.conditions.splice(index, 1);
    },

    /**
     * Returns user value from user role search
     *
     * @param {String} d - the user value
     * @param {Object} condition - The condition to update
     *
     * @since 3.2.13
     */
    handleUserReturn(d, condition) {
      condition.value = d;
    },

    /**
     * Shows user search conditionally
     *
     * @param {String} type - the type of condition
     *
     * @since 3.3.095
     */
    maybeShowUserSearch(type) {
      const exists = this.returnUserTypes.find((p) => p.value === type);
      return exists ? true : false;
    },
  },
  template: `
	
	<div class="uip-flex uip-w-100p uip-flex-column uip-row-gap-xs">
  
	  <template v-for="(element, index) in option.conditions">
    
		<dropdown pos="left center" class="uip-w-100p" :snapX="['#uip-block-settings']" :ref="'condition'+index">
		  <template v-slot:trigger>
			
			<div class="uip-flex uip-flex-row uip-gap-xxs">
			  <div class="uip-padding-xxs uip-border-rounder uip-text-s uip-background-muted uip-flex-grow uip-text-ellipsis uip-no-wrap uip-overflow-hidden uip-max-w-160">
				{{element.type}} {{returnAllOperators[element.operator].shortHand}} {{element.value}}
			  </div>
			  
			  <button class="uip-button-default uip-border-rounder uip-icon uip-padding-xxs uip-link-muted"
			  @click="removeCondition(index)">close</button>
			</div>  
			
		  </template>
		  <template v-slot:content>
			<div class="uip-padding-s uip-flex uip-flex-column uip-row-gap-s">
      
              <div class="uip-flex uip-flex-between uip-flex-center">
                <div class="uip-text-emphasis uip-text-bold uip-text-s">{{strings.editCondition}}</div>
                <div @click="$refs['condition'+index][0].close()" class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
                  <span class="uip-icon">close</span>
                </div>
              </div>
			
			  <div class="uip-grid-col-1-3">
			  
				  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.type}}</span></div>
				  <div class="uip-flex uip-flex-center">
          
					<select v-model="element.type" 
                    class="uip-input uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p uip-w-100p uip-border-rounder" 
                    style="padding-top: 2px; padding-bottom: 2px; border-radius: var(--uip-border-radius-large);">
          
                      <!--Users-->
                      <optgroup :label="strings.users">
					    <template v-for="item in returnUserTypes">
						  <option :value="item.value">{{item.label}}</option>
					    </template>
                      </optgroup>
                      
                      
                      <!--Date & time-->
                      <optgroup :label="strings.dateAndTime">
                        <template v-for="item in returnDateTypes">
                        <option :value="item.value">{{item.label}}</option>
                        </template>
                      </optgroup>
                      
                      <!--Site-->
                      <optgroup :label="strings.site">
                        <template v-for="item in returnSiteTypes">
                        <option :value="item.value">{{item.label}}</option>
                        </template>
                      </optgroup>
                      
					</select>
          
				  </div>
				  
				  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.operator}}</span></div>
          
                  <select class="uip-input uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p uip-w-100p uip-border-rounder" 
                  v-model="element.operator" style="padding-top: 2px; padding-bottom: 2px; border-radius: var(--uip-border-radius-large);">
                  
                    <template v-for="item in returnOperators(element.type)">
                      <option :value="item.value">{{item.label}}</option>
                    </template>
                    
                  </select>  
          
				  
				  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.value}}</span></div>
				  <div class="uip-flex uip-flex-center uip-gap-xxs">
					<input type="text" class="uip-input-small uip-flex-grow" style="min-width:1px" v-model="element.value">
					<user-role-search 
                    v-if="maybeShowUserSearch(element.type)"
                    :selected="[]" :returnType="element.type" :searchPlaceHolder="strings.searchUsers" :updateSelected="(d)=>handleUserReturn(d, element)"></user-role-search>
				  </div>
				  
			  </div>    
			  
			</div>
			
		  </template>
		</dropdown>
	  
	  </template>
	  
	  <toggle-switch v-if="hasConditions" :options="conditions.relations" :activeValue="option.relation" :dontAccentActive="true" :returnValue="function(data){ option.relation = data;}"></toggle-switch> 
	  
	  <div @click="addCondition()" class="uip-padding-xxs uip-border-rounder uip-background-muted hover:uip-background-grey uip-cursor-pointer uip-flex uip-flex-middle uip-flex-center uip-gap-xs uip-flex-grow">
		<span class="uip-icon">add</span>
	  </div>
	  
	  
	</div>`,
};
