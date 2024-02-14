const { __, _x, _n, _nx } = wp.i18n;
import { renderKeyShortCut } from "../../v3.5/utility/functions.min.js";
export default {
  props: {
    display: String,
    name: String,
    block: Object,
  },
  data() {
    return {};
  },

  computed: {
    /**
     * Returns custom text for button trigger
     *
     * @since 3.2.13
     */
    returnText() {
      const item = this.get_block_option(this.block, "block", "buttonText", true);
      if (!item) return "";

      if (!this.isObject(item)) return item;
      if (item.string) return item.string;
      return "";
    },

    /**
     * Returns whether to close on page change
     *
     * @since 3.2.13
     */
    closeOnPageChange() {
      let status = this.get_block_option(this.block, "block", "closeOnPageChange");
      if (!status) return false;
      if (!this.isObject(status)) return status;
      return status.value ? true : false;
    },
    /**
     * Returns panel position. Default is 'right'
     *
     * @since 3.2.13
     */
    getPanelPos() {
      const position = this.get_block_option(this.block, "block", "panelSide");
      if (!position) return "right";
      return position.value;
    },

    /**
     * Returns panel style. Default is slide
     *
     * @since 3.2.13
     */
    getPanelStyle() {
      const style = this.get_block_option(this.block, "block", "overlayStyle");
      return this.isObject(style) ? style.value : "overlay";
    },

    /**
     * Returns icon for button
     *
     * @since 3.2.13
     */
    returnIcon() {
      let icon = this.get_block_option(this.block, "block", "iconSelect");
      if (!icon) return "";
      if (!this.isObject(icon)) return icon;
      if (icon.value) return icon.value;
      return "";
    },

    /**
     * Gets the block shortcut and returns the visual shortcut
     *
     * @since 3.2.13
     */
    getShortcut() {
      const shortcut = this.getShortcutValue;
      if (!shortcut) return;
      return renderKeyShortCut(shortcut);
    },

    /**
     * Gets shortcut value
     *
     * @since 3.2.13
     */
    getShortcutValue() {
      const shortcut = this.get_block_option(this.block, "block", "keyboardShortcut");
      if (!this.isObject(shortcut)) return;

      // Shortcut is not enabled so bail
      if (!shortcut.enabled || !shortcut.display || !shortcut.selected) return false;
      // No keys set for shortcut so bail

      //No shortcut set
      if (shortcut.selected.length < 1) return;

      return shortcut.selected;
    },

    /**
     * Returns the reverse class if icon position is right
     *
     * @since 3.2.13
     */
    returnClasses() {
      const position = this.get_block_option(this.block, "block", "iconPosition");
      if (!position) return;
      if (!this.isObject(position) && position == "right") return "uip-flex-reverse";
      if (position.value && position.value == "right") return "uip-flex-reverse";
    },
  },
  methods: {
    /**
     * Returns public methods available to the interactions API
     *
     * @since 3.3.095
     */
    returnPublicMethods() {
      return ["show", "close"];
    },

    /**
     * Show off canvas
     *
     * @since 3.3.095
     */
    show() {
      this.$refs.offcanvas.show();
    },

    /**
     * Closes off canvas
     *
     * @since 3.3.095
     */
    close() {
      this.$refs.offcanvas.close();
    },
  },
  template: `
        <uip-offcanvas ref="offcanvas" :position="getPanelPos" :shortCut="getShortcutValue" :overlayStyle="getPanelStyle" :closeOnLoad="closeOnPageChange">
        
          <template #trigger>
          
            <button class="uip-button-default uip-flex uip-gap-xxs uip-flex-center uip-panel-trigger"
            :class="returnClasses">
            
              <span class="uip-icon" v-if="returnIcon">{{returnIcon}}</span>
              <span class="uip-flex-grow" v-if="returnText != ''">{{returnText}}</span>
              
              <div v-if="getShortcut" class="uip-flex uip-flex-row uip-padding-left-xxxs uip-padding-right-xxxs uip-border uip-border-round uip-text-s uip-flex-row uip-inline-flex uip-flex-center" v-html="getShortcut"></div>
              
            </button>
            
          </template>
          
          <template #content>
          
            <uip-content-area :content="block.content" :returnData="(data)=>{block.content = data}"/>
            
          </template>
          
        </uip-offcanvas>
        `,
};
