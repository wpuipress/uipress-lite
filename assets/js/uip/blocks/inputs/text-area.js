const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
      contextualData: Object,
    },
    data: function () {
      return {
        loading: true,
        strings: {
          placeholder: __('Input placeholder...', 'uipress-lite'),
        },
      };
    },
    inject: ['uipData', 'uipress', 'uiTemplate'],
    watch: {},
    mounted: function () {},
    computed: {
      returnPlaceHolder() {
        let item = this.uipress.get_block_option(this.block, 'block', 'inputPlaceHolder', true);
        if (!item) {
          return '';
        }
        if (this.uipress.isObject(item)) {
          if ('string' in item) {
            return item.string;
          } else {
            return '';
          }
        }
        return item;
      },
      returnPopulated() {
        if (typeof this.contextualData === 'undefined') {
          return;
        }
        if (!this.uipress.isObject(this.contextualData)) {
          return;
        }
        if (!('formData' in this.contextualData)) {
          return;
        }

        if (this.contextualData.formData) {
          if (this.returnName in this.contextualData.formData) {
            return this.contextualData.formData[this.returnName];
          }
        }
        return '';
      },
      returnLabel() {
        let item = this.uipress.get_block_option(this.block, 'block', 'inputLabel', true);
        if (!item) {
          return '';
        }
        if (this.uipress.isObject(item)) {
          if ('string' in item) {
            return item.string;
          } else {
            return '';
          }
        }
        return item;
      },
      returnRequired() {
        let required = this.uipress.get_block_option(this.block, 'block', 'inputRequired');
        if (this.uipress.isObject(required)) {
          if ('value' in required) {
            return required.value;
          }
        }
        return required;
      },
      returnName() {
        let required = this.uipress.get_block_option(this.block, 'block', 'inputName');
        return required;
      },
    },
    methods: {},
    template: `
		  <label class="uip-flex uip-flex-column">
        <span class="uip-input-label uip-text-muted uip-margin-bottom-xxs">{{returnLabel}}</span>
		  	<textarea :name="returnName"
			  class="uip-input" rows="5" :id="block.uid" :placeholder="returnPlaceHolder" :required="returnRequired" :value="returnPopulated"></textarea>
		  </label>
      `,
  };
}
