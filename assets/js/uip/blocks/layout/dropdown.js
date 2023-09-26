const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
    },
    data: function () {
      return {};
    },
    inject: ['uipress'],
    computed: {
      /**
       * Returns custom text for button trigger
       *
       * @since 3.2.13
       */
      returnText() {
        const item = this.uipress.get_block_option(this.block, 'block', 'buttonText', true);
        if (!item) return '';

        if (!this.uipress.isObject(item)) return item;
        if (item.string) return item.string;
        return '';
      },

      /**
       * Gets the block shortcut and returns the visual shortcut
       *
       * @since 3.2.13
       */
      getShortcut() {
        const shortcut = this.getShortcutValue;
        if (!shortcut) return;
        return this.uipress.renderKeyShortCut(shortcut.selected);
      },

      /**
       * Gets shortcut value
       *
       * @since 3.2.13
       */
      getShortcutValue() {
        const shortcut = this.uipress.get_block_option(this.block, 'block', 'keyboardShortcut');
        if (!this.uipress.isObject(shortcut)) return;

        // Shortcut is not enabled so bail
        if (!shortcut.enabled || !shortcut.display || !shortcut.selected) return false;
        // No keys set for shortcut so bail

        //No shortcut set
        if (shortcut.selected.length < 1) return;

        return shortcut.selected;
      },

      /**
       * Returns dropdown position
       *
       *  @since 3.2.13
       */
      returnDropPosition() {
        let dropPosition = this.uipress.get_block_option(this.block, 'block', 'dropDirection');
        if (this.uipress.isObject(dropPosition)) return dropPosition.value;

        if (!dropPosition) return 'bottom left';
        return dropPosition;
      },

      /**
       * Returns the reverse class if icon position is right
       *
       * @since 3.2.13
       */
      returnClasses() {
        const position = this.uipress.get_block_option(this.block, 'block', 'iconPosition');
        if (!position) return;
        if (!this.uipress.isObject(position) && position == 'right') return 'uip-flex-reverse';
        if (position.value && position.value == 'right') return 'uip-flex-reverse';
      },

      /**
       * Returns icon for button
       *
       * @since 3.2.13
       */
      returnIcon() {
        let icon = this.uipress.get_block_option(this.block, 'block', 'iconSelect');
        if (!icon) return '';
        if (!this.uipress.isObject(icon)) return icon;
        if (icon.value) return icon.value;
        return '';
      },
    },
    template: `
        <dropdown :pos="returnDropPosition" :shortCut="getShortcutValue" :disableTeleport="true">
        
          <template #trigger>
          
            <button class="uip-button uip-button-default uip-flex uip-gap-xxs uip-flex-center uip-drop-trigger"
            :class="returnClasses" >
            
              <span class="uip-icon" v-if="returnIcon">{{returnIcon}}</span>
              <span class="uip-flex-grow" v-if="returnText != ''">{{returnText}}</span>
                
              <!-- Shortcut display -->
              <div v-if="getShortcut" class="uip-flex uip-flex-row uip-padding-left-xxxs uip-padding-right-xxxs uip-border uip-border-round uip-text-s uip-flex-row uip-inline-flex uip-flex-center" v-html="getShortcut"></div>
              
            </button>
            
          </template>
          
          <template #content>
          
             <uip-content-area :content="block.content" :returnData="(data)=>{block.content = data} "/>
             
          </template>
          
        </dropdown>
        `,
  };
}
