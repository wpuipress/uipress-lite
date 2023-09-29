import { nextTick } from '../../libs/vue-esm-dev.js';
import blockRender from './block-render.min.js?ver=3.2.12';
export default {
  components: {
    BlockRender: blockRender,
  },
  props: {
    content: Array,
    returnData: Function,
    layout: String,
    dropAreaStyle: String,
    contextualData: Object,
  },
  data: function () {
    return {
      items: this.content,
      footerhideen: false,
      rendered: true,
      activeTab: 'blocks',
      windowWidth: window.innerWidth,
      drag: false,
      queries: {},
      randomClass: this.uipress.createUID(),
      strings: {
        doesntExist: __("This component is missing or can't be loaded", 'uipress-lite'),
        totalItems: __('Total items', 'uipress-lite'),
        search: __('Search', 'uipress-lite'),
        proOptionUnlock: __('This is a pro option. Upgrade to unlock', 'uipress-lite'),
      },
      switchOptions: {
        blocks: {
          value: 'blocks',
          label: __('Blocks', 'uipress-lite'),
        },
        patterns: {
          value: 'patterns',
          label: __('Patterns', 'uipress-lite'),
        },
      },
    };
  },
  inject: ['uipData', 'uiTemplate', 'uipress'],
  watch: {
    content: {
      handler(newValue, oldValue) {
        this.items = newValue;
      },
      deep: true,
    },
    itemsLength: {
      handler(newValue, oldValue) {
        if (!this.renderd) return;
        this.updateList();
      },
      deep: true,
    },
  },
  mounted() {},
  computed: {
    /**
     * Returns list lenght
     *
     * @since 3.1.0
     */
    itemsLength() {
      return this.items.length;
    },
    /**
     * Returns items
     *
     * @since 3.1.0
     */
    returnItems() {
      return this.items;
    },
  },
  methods: {
    /**
     * Forces a ui re-render
     *
     * @returns {Promise}
     * @since 3.2.13
     */
    async forceReload() {
      // Remove MyComponent from the DOM
      this.rendered = false;
      await nextTick();
      this.rendered = true;
    },

    /**
     * Updates current list of items
     *
     * @since 3.2.13
     */
    updateList() {
      this.renderd = false;
      const processItems = (item, index) => {
        if (!item) return;

        if (item.remote) {
          this.importBlock(item, index);
          this.items[index] = null; // Mark item for deletion without affecting loop
          return;
        }

        if (Object.keys(item.settings).length === 0) {
          this.uipress.inject_block_presets(item, item.settings);
        }
      };
      this.items.forEach(processItems);

      // Filter out null entries after processing
      this.items = this.items.filter((item) => item !== null);
      this.renderd = true;
    },

    /**
     * Imports a block template
     *
     * @param {JSON} template - the json template
     * @param {Number} index - The index to insert it at
     * @since 3.2.1
     */
    importBlock(template, index) {
      let self = this;

      let formData = new FormData();
      let notiID = self.uipress.notify(__('Importing template', 'uipress-lite'), '', 'default', false, true);

      self.uipress.callServer(template.path, formData).then((response) => {
        if (response.error) {
          self.uipress.notify(response.message, '', 'error', true);
          self.uipress.destroy_notification(notiID);
        }

        let parsed = JSON.parse(response);
        if (Array.isArray(parsed)) {
          parsed = parsed[0];
          parsed.uid = self.uipress.createUID();

          if (!self.isObject(parsed)) {
            self.uipress.notify(__('Unable to import template right now', 'uipress-lite'), '', 'error', true);
            self.uipress.destroy_notification(notiID);
          }

          let freshLayout = [];
          if ('content' in parsed) {
            for (const block of parsed.content) {
              freshLayout.push(self.cleanBlock(block));
            }
            parsed.content = freshLayout;
          }
          self.uipress.destroy_notification(notiID);
          self.uipress.notify(__('Template imported', 'uipress-lite'), '', 'success', true);
          self.items.splice(index, 0, parsed);
        } else {
          self.uipress.notify(__('Unable to import template right now', 'uipress-lite'), '', 'error', true);
          self.uipress.destroy_notification(notiID);
        }
      });
    },
    /**
     * Cleans a block of unnecessary params
     *
     * @param {Object} block - The block to clean
     * @since 3.2.13
     */
    cleanBlock(block) {
      let item = Object.assign({}, block);
      //item.uid = this.uipress.createUID();
      item.options = [];
      item.settings = JSON.parse(JSON.stringify(item.settings));

      if (item.content) {
        item.content = this.duplicateChildren(item.content);
      }

      return item;
    },
    /**
     * Clones children and creates new UIDs
     *
     * @param {Array} content - array of items to be cleaned
     * @since 3.1.1
     */
    duplicateChildren(content) {
      let returnChildren = [];

      for (let block of content) {
        let item = Object.assign({}, block);
        //item.uid = this.uipress.createUID();
        item.settings = JSON.parse(JSON.stringify(item.settings));

        if (item.content) {
          item.content = this.duplicateChildren(item.content);
        }

        returnChildren.push(item);
      }

      return returnChildren;
    },
    /**
     * Handles item added avents
     *
     * @param {Object} evt - the new item event
     * @returns {Promise}
     * @since 3.2.13
     */
    async itemAdded(evt) {
      let self = this;
      if (!evt.added) return;

      // Bail if it's a remote template
      if (this.uipress.checkNestedValue(evt, ['added', 'element', 'remote'])) return;

      // ADD A UID TO ADDED OPTION
      let newElement = evt.added.element;
      // New block, add uid
      if (!('uid' in newElement)) {
        newElement.uid = this.uipress.createUID();
      }

      // New block so let's add settings
      if (Object.keys(newElement.settings).length === 0) {
        this.uipress.inject_block_presets(newElement, newElement.settings);
      }

      //Open block
      await this.forceReload();
      this.uipApp.blockControl.setActive(newElement, this.items);
      this.returnData(this.items);
    },
  },
  template: `
    
      
      
                 
      <uip-draggable v-if="rendered"
      :class="[{'uip-border-dashed' : uiTemplate.display == 'builder'}, randomClass]" 
      class="uip-flex uip-w-100p uip-builder-drop-area"
      :group="{ name: 'uip-blocks', pull: true, put: true }" 
      :list="items"
      @start="uipApp.scrolling=true"
      @end="uipApp.scrolling=false"
      @change="itemAdded"
      ghostClass="uip-canvas-ghost"
      animation="300"
      :sort="true">
              
              <template v-for="(element, index) in returnItems" 
              :key="element.uid" :index="index">
                
                <BlockRender :block="element" :list="items" :index="index" :contextualData="contextualData"/>
              
              </template>
              
              
      </uip-draggable>
      
		`,
};
