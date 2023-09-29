const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    returnData: Function,
    value: Object,
  },
  data() {
    return {
      toolbar: this.uipData.toolbar,
      selected: {},
      strings: {
        renameItem: __('Rename item', 'uipress-lite'),
      },
    };
  },
  inject: ['uipData', 'uipress'],
  watch: {
    /**
     * Watches selected items and returns data to caller
     *
     * @since 3.2.13
     */
    selected: {
      handler(newValue, oldValue) {
        this.returnData(this.selected);
      },
      deep: true,
    },
  },
  mopunted() {
    this.formatInput();
  },
  methods: {
    /**
     * Injects input value if object
     *
     * @since 3.2.13
     */
    formatInput() {
      if (!this.isObject(this.value)) return;
      this.selected = this.value;
    },

    /**
     * Returns a toolbar icon
     *
     * @param {Number} id - the id of the toolbar item
     * @since 3.2.13
     */
    returnIcon(id) {
      // Not object so create one
      if (!this.isObject(this.selected)) return '';

      /// Id exists
      if (this.selected.id) return this.selected[id].icon;

      return '';
    },

    /**
     * Sets basic data for toolbar item
     *
     * @param {Number} id - toolbar item id
     * @since 3.2.13
     */
    setItemData(id) {
      this.selected[id] = {};
      this.selected[id].icon = '';
      this.selected[id].title = '';
    },

    /**
     * Returns icon. If doesn't exists returns default
     *
     * @param {Number} id - the toolbar id
     * @since 3.2.13
     */
    returnIconPreview(id) {
      const icon = this.returnIcon();
      if (!icon) return 'favorite';
      return icon;
    },

    /**
     * Returns toolbar item title
     *
     * @param {Number} id - the toolbar id
     * @since 3.2.13
     */
    returnTitle(id) {
      // Not object so create one
      if (!this.isObject(this.selected)) return '';

      /// Id exists
      if (this.selected.id) return this.selected[id].title;

      return '';
    },

    /**
     * Sets item title
     *
     * @param {Number} id - the id of the toolbar item
     * @param {Object} icon - the icon object
     * @since 3.2.13
     */
    setIcon(id, icon) {
      if (!this.selected[id]) this.setItemData(id);
      this.selected[id].icon = icon.value;
    },
  },
  template: `
    <div class="uip-flex uip-flex-column uip-row-gap-xs uip-w-100p">
    
        <template v-for="item in toolbar">
          <div class="uip-flex uip-flex-row uip-gap-xs uip-w-100p">
            
            <div class="uip-icon uip-text-l uip-padding-xxxs uip-background-muted uip-border-rounder uip-dragger uip-cursor-drag">drag_indicator</div>
            
            <inline-icon-select :value="{value:returnIcon(item.id)}" :returnData="(data)=>{setIcon(item.id, data)}">
              <template v-slot:trigger>
                <div class="uip-icon uip-text-l uip-padding-xxxs uip-background-muted uip-border-rounder">{{returnIconPreview(item.id)}}</div>
              </template>
            </inline-icon-select>
            
            
            <uip-input :value="returnTitle(item.id)" :returnData="function (data) {selected[item.id].title = data}" :placeHolder="item.id" class="uip-flex-grow"></uip-input>
          </div>
        </template>
        
	  </div>`,
};
