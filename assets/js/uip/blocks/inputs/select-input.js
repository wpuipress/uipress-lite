const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
      contextualData: Object,
    },
    data() {
      return {
        populated: this.returnPopulated,
        strings: {
          placeholder: __('Input placeholder...', 'uipress-lite'),
        },
      };
    },
    inject: ['uipress'],
    computed: {
      /**
       * Returns placeholder for input
       *
       * @since 3.2.13
       */
      returnPlaceHolder() {
        const item = this.uipress.get_block_option(this.block, 'block', 'inputPlaceHolder', true);
        if (!item) return '';

        if (!this.isObject(item)) return item;
        if (item.string) return item.string;
        return '';
      },

      /**
       * Returns populated value
       *
       * @since 3.2.13
       */
      returnPopulated() {
        if (!this.isObject(this.contextualData)) return;
        if (!('formData' in this.contextualData)) return;

        const formData = this.contextualData.formData;
        if (!formData) return;

        // If input name exists in pre populate then return it
        if (this.returnName in formData) {
          return formData[this.returnName];
        }
      },

      /**
       * Returns label for input
       *
       * @since 3.2.13
       */
      returnLabel() {
        const item = this.uipress.get_block_option(this.block, 'block', 'inputLabel', true);
        if (!item) return '';

        if (!this.isObject(item)) return item;
        if (item.string) return item.string;
        return '';
      },

      /**
       * Returns whether the input field is required
       *
       * @since 3.2.13
       */
      returnRequired() {
        let required = this.uipress.get_block_option(this.block, 'block', 'inputRequired');
        if (!this.isObject(required)) return false;
        if (required.value) return required.value;
        return required;
      },
      /**
       * Returns the name of the input
       *
       * @since 3.2.13
       */
      returnName() {
        return this.uipress.get_block_option(this.block, 'block', 'inputName');
      },
      /**
       * Returns select options
       *
       * @since 3.2.13
       */
      returnOptions() {
        const options = this.uipress.get_block_option(this.block, 'block', 'selectOptions');
        if (Array.isArray(options.options)) return options.options;
        return [];
      },
    },
    methods: {
      /**
       * Checks if given option is selected
       *
       * @param {String} option - the item to check against
       * @since 3.2.13
       */
      checkSelected(option) {
        if (this.returnPopulated == option) return true;
        return false;
      },
    },
    template: `
		  <label class="uip-flex uip-flex-column">
      
            <span class="uip-input-label uip-text-muted uip-margin-bottom-xxs">{{returnLabel}}</span>
            
		  	<select :name="returnName"
			class="uip-input" :placeholder="returnPlaceHolder" :required="returnRequired" >
      
              <!-- Loop through options -->
              <template v-for="item in returnOptions">
                <option :value="item.name" :selected="checkSelected(item.name)">{{item.label}}</option>
              </template>
              
            </select>
            
		  </label>
      `,
  };
}
