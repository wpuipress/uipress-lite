const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
    },
    data: function () {
      return {
        loading: true,
        dynamics: this.uipData.dynamicOptions,
        open: false,
      };
    },
    inject: ['uipData', 'uipress', 'uiTemplate'],
    watch: {},
    mounted: function () {},
    computed: {
      returnText() {
        let item = this.uipress.get_block_option(this.block, 'block', 'buttonText', true);
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
      closeOnPageChange() {
        let status = this.uipress.get_block_option(this.block, 'block', 'closeOnPageChange');
        if (!status) {
          return false;
        }
        if ('value' in status) {
          return status.value;
        }
        return status;
      },
      getPanelPos() {
        let pos = this.uipress.get_block_option(this.block, 'block', 'panelSide');

        if (!pos) {
          return 'right';
        } else {
          return pos.value;
        }
      },
      getPanelStyle() {
        let pos = this.uipress.get_block_option(this.block, 'block', 'overlayStyle');

        if (!pos) {
          return 'slide';
        } else {
          return pos.value;
        }
      },

      getIcon() {
        let icon = this.uipress.get_block_option(this.block, 'block', 'iconSelect');
        if (!icon) {
          return '';
        }
        if ('value' in icon) {
          return icon.value;
        }
        return icon;
      },

      getShortcut() {
        let shortcut = this.uipress.get_block_option(this.block, 'block', 'keyboardShortcut');

        if (!shortcut) {
          return false;
        }
        if ('enabled' in shortcut) {
          if (!shortcut.enabled) {
            return false;
          }
        } else {
          return false;
        }

        if (!('selected' in shortcut)) {
          return;
        }

        //No shortcut set
        if (shortcut.selected.length < 1) {
          return false;
        }

        if (!shortcut.display) {
          return false;
        }

        return this.uipress.renderKeyShortCut(shortcut.selected);
      },
      getShortcutValue() {
        let shortcut = this.uipress.get_block_option(this.block, 'block', 'keyboardShortcut');

        if (!shortcut) {
          return false;
        }
        if ('enabled' in shortcut) {
          if (!shortcut.enabled) {
            return false;
          }
        } else {
          return false;
        }

        if (!('selected' in shortcut)) {
          return;
        }

        //No shortcut set
        if (shortcut.selected.length < 1) {
          return false;
        }

        return shortcut.selected;
      },
    },
    methods: {
      returnIconPos() {
        let classes = '';

        let posis = this.uipress.get_block_option(this.block, 'block', 'iconPosition');
        if (posis) {
          if (posis.value == 'right') {
            classes += 'uip-flex-reverse';
          }
        }
        return classes;
      },
    },
    template: `
        <uip-offcanvas :position="getPanelPos" :shortCut="getShortcutValue" :overlayStyle="getPanelStyle" :closeOnLoad="closeOnPageChange">
          <template v-slot:trigger>
            <button class="uip-button-default uip-flex uip-gap-xxs uip-flex-center uip-panel-trigger"
            :class="returnIconPos()" >
              <span class="uip-icon" v-if="getIcon">{{getIcon}}</span>
              <span class="uip-flex-grow" v-if="returnText != ''">{{returnText}}</span>
              <div v-if="getShortcut" class="uip-flex uip-flex-row uip-padding-left-xxxs uip-padding-right-xxxs uip-border uip-border-round uip-text-s uip-flex-row uip-inline-flex uip-flex-center" v-html="getShortcut">
              </div>
            </button>
          </template>
          <template v-slot:content>
            <uip-content-area :content="block.content" :returnData="function(data) {block.content = data} " layout="vertical"></uip-content-area>
          </template>
        </uip-offcanvas>
        `,
  };
}
