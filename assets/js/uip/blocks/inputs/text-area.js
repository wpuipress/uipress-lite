const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    display: String,
    name: String,
    block: Object,
    contextualData: Object,
  },
  data() {
    return {
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
  },
  template: `
		  <label class="uip-flex uip-flex-column">
        <span class="uip-input-label uip-text-muted uip-margin-bottom-xxs">{{returnLabel}}</span>
		  	<textarea :name="returnName"
			  class="uip-input" rows="5" :id="block.uid" :placeholder="returnPlaceHolder" :required="returnRequired" :value="returnPopulated"></textarea>
		  </label>
      `,
};
