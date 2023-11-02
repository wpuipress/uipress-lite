const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    returnData: Function,
    value: Object,
  },
  data() {
    return {
      toolbar: this.uipApp.data.toolbar,
      selected: {},
      updating: false,
      strings: {
        renameItem: __("Rename item", "uipress-lite"),
      },
    };
  },
  watch: {
    /**
     * Watches selected items and returns data to caller
     *
     * @since 3.2.13
     */
    value: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.formatInput();
      },
      deep: true,
      immediate: true,
    },
    /**
     * Watches selected items and returns data to caller
     *
     * @since 3.2.13
     */
    selected: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.returnData(this.selected);
      },
      deep: true,
    },
  },
  methods: {
    /**
     * Injects input value if object
     *
     * @since 3.2.13
     */
    async formatInput() {
      this.updating = true;

      this.selected = this.isObject(this.value) ? { ...this.value } : {};

      await this.$nextTick();
      this.updating = false;
    },

    /**
     * Returns a toolbar icon
     *
     * @param {Number} id - the id of the toolbar item
     * @since 3.2.13
     */
    returnIcon(id) {
      return this.selected[id] ? this.selected[id].icon : "";
    },

    /**
     * Sets basic data for toolbar item
     *
     * @param {Number} id - toolbar item id
     * @since 3.2.13
     */
    setItemData(id) {
      this.selected[id] = { icon: "", title: "" };
    },

    /**
     * Returns icon. If doesn't exists returns default
     *
     * @param {Number} id - the toolbar id
     * @since 3.2.13
     */
    returnIconPreview(id) {
      const icon = this.returnIcon(id);
      return icon ? icon : "favorite";
    },

    /**
     * Returns toolbar item title
     *
     * @param {Number} id - the toolbar id
     * @since 3.2.13
     */
    returnTitle(id) {
      return this.selected[id] ? this.selected[id].title : "";
    },

    /**
     * Sets item title
     *
     * @param {Number} id - the id of the toolbar item
     * @param {Object} icon - the icon object
     * @since 3.2.13
     */
    setIcon(id, icon) {
      // Sets the object
      if (!(id in this.selected)) this.setItemData(id);

      this.selected[id].icon = icon.value;
    },
  },
  template: `
    <div class="uip-flex uip-flex-column uip-row-gap-xs uip-w-100p">
    
        <template v-for="item in toolbar">
          <div class="uip-flex uip-flex-row uip-gap-xs uip-w-100p">
            
            
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
