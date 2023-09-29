import { nextTick } from '../../libs/vue-esm-dev.js';
export default {
  props: {
    returnData: Function,
    value: [String, Array],
    placeHolder: String,
    args: Object,
    size: String,
  },
  inject: ['uipress'],
  data() {
    return {
      option: this.returnDefaultOptions,
      updating: false,
      strings: {
        newCondition: __('New condition', 'uipress-lite'),
        type: __('Type', 'uipress-lite'),
        operator: __('Operator', 'uipress-lite'),
        searchUsers: __('Search', 'uipress-lite'),
        value: __('Value', 'uipress-lite'),
        addCondition: __('Add condition', 'uipress-lite'),
      },
      newCondition: {
        type: 'userrole',
        operator: 'is',
        value: '',
      },
      conditions: {
        relations: {
          and: {
            value: 'and',
            label: __('And', 'uipress-lite'),
          },
          or: {
            value: 'or',
            label: __('Or', 'uipress-lite'),
          },
        },
        types: [
          {
            value: 'userrole',
            label: __('User role', 'uipress-lite'),
          },
          {
            value: 'userlogin',
            label: __('User login', 'uipress-lite'),
          },
          {
            value: 'userid',
            label: __('User ID', 'uipress-lite'),
          },
          {
            value: 'useremail',
            label: __('User email', 'uipress-lite'),
          },
        ],
        operators: {
          is: {
            value: 'is',
            label: __('Is', 'uipress-lite'),
          },
          isnot: {
            value: 'isnot',
            label: __('Is not', 'uipress-lite'),
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
        relation: 'and',
        conditions: [],
      };
    },
  },
  methods: {
    /**
     * Injects prop value into component
     *
     * @since 3.2.13
     */
    async injectProp() {
      this.updating = true;
      const defaultOptions = this.returnDefaultOptions;
      const newOptions = this.uipress.isObject(this.value) ? this.value : {};
      this.option = { ...defaultOptions, ...newOptions };

      await nextTick();
      this.updating = false;
    },

    /**
     * Adds a new condition
     *
     * @since 3.2.13
     */
    addCondition() {
      if (!Array.isArray(this.option.conditions)) this.option.conditions = [];
      this.option.conditions.push(JSON.parse(JSON.stringify(this.newCondition)));
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
  },
  template: `
	
	<div class="uip-flex uip-w-100p uip-flex-column uip-row-gap-xs">
		 
	  <template v-for="(element, index) in option.conditions">
	  
		<dropdown pos="left center" class="uip-w-100p" :snapX="['#uip-block-settings']">
		  <template v-slot:trigger>
			
			<div class="uip-flex uip-flex-row uip-gap-xxs">
			  <div class="uip-padding-xxs uip-border-rounder uip-text-s uip-background-muted uip-flex-grow">
				{{element.type}} {{element.operator}} {{element.value}}
			  </div>
			  
			  <button class="uip-button-default uip-border-rounder uip-icon uip-padding-xxs uip-link-muted"
			  @click="removeCondition(index)">close</button>
			</div>  
			
		  </template>
		  <template v-slot:content>
			<div class="uip-padding-s">
			
			  <div class="uip-grid-col-1-3">
			  
				  <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.type}}</span></div>
				  <div class="uip-flex uip-flex-center">
					<select class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p uip-w-100p uip-border-rounder" v-model="element.type" style="padding-top: 2px; padding-bottom: 2px; border-radius: var(--uip-border-radius-large);">
					  <template v-for="item in conditions.types">
						<option :value="item.value">{{item.label}}</option>
					  </template>
					</select>
				  </div>
				  
				  <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.operator}}</span></div>
				  <div class="uip-flex uip-flex-center">
					<toggle-switch :options="conditions.operators" :activeValue="element.operator" :returnValue="function(data){ element.operator = data;}"></toggle-switch>
				  </div>
				  
				  <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.value}}</span></div>
				  <div class="uip-flex uip-flex-center uip-gap-xxs">
					<input type="text" class="uip-input-small uip-flex-grow" style="min-width:1px" v-model="element.value">
					<user-role-search :selected="[]" :returnType="element.type" :searchPlaceHolder="strings.searchUsers" :updateSelected="function(d){element.value = d}"></user-role-search>
				  </div>
				  
			  </div>    
			  
			</div>
			
		  </template>
		</dropdown>
	  
	  </template>
	  
	  <toggle-switch v-if="hasConditions" :options="conditions.relations" :activeValue="option.relation" :dontAccentActive="true" :returnValue="function(data){ option.relation = data;}"></toggle-switch> 
	  
	  <div @click="option.conditions.push(newCondition)" class="uip-padding-xxs uip-border-rounder uip-background-muted hover:uip-background-grey uip-cursor-pointer uip-flex uip-flex-middle uip-flex-center uip-gap-xs uip-flex-grow">
		<span class="uip-icon">add</span>
	  </div>
	  
	  
	</div>`,
};
