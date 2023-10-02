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
  data() {
    return {
      items: this.content,
      rendered: true,
      randomClass: this.createUID(),
      strings: {
        doesntExist: __("This component is missing or can't be loaded", 'uipress-lite'),
        totalItems: __('Total items', 'uipress-lite'),
        search: __('Search', 'uipress-lite'),
        proOptionUnlock: __('This is a pro option. Upgrade to unlock', 'uipress-lite'),
      },
    };
  },
  inject: ['uiTemplate'],
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
    },
  },
  computed: {
    /**
     * Returns whether we are in production or preview or builder
     *
     * @returns {boolean}  - returns true if we are in production | false if not
     * @since 3.2.13
     */
    isProduction() {
      if (this.uiTemplate.display == 'prod') return true;
      if (this.uiTemplate.isPreview) return true;
      return false;
    },

    /**
     * Returns list length
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
     * Injects blocks preset settings
     *
     * @param {Object} block
     * @since 3.2.13
     */
    inject_block_presets(block) {
      const blockModule = block.moduleName;
      const allBlocks = this.uipApp.data.blocks;

      // Find the originally registered block's enabled settings
      const masterblockIndex = allBlocks.findIndex((block) => block.moduleName === blockModule);
      // No block settings so bail
      if (masterblockIndex < 0) return;
      const masterBlock = allBlocks[masterblockIndex];

      const allBlockSettings = masterBlock.optionsEnabled;
      const blockOptionsIndex = allBlockSettings.findIndex((option) => option.name === 'block');

      // Inject preset styles
      const ignoreParts = ['block', 'advanced'];
      for (let part of allBlockSettings) {
        if (ignoreParts.includes(part.name)) continue;
        if (!'presets' in part) continue;

        const stylePresets = part.presets;
        if (!this.isObject(stylePresets)) continue;

        for (let stylePresetKey in stylePresets) {
          this.ensureNestedObject(block, 'settings', part.name, 'options', stylePresetKey, 'value');
          block.settings[part.name].options[stylePresetKey].value = { ...stylePresets[stylePresetKey] };
        }
      }

      // No settings for block so bail
      if (blockOptionsIndex < 0) return;
      const presets = allBlockSettings[blockOptionsIndex].options;

      // Ensure the nested object and inject preset values
      this.ensureNestedObject(block, 'settings', 'block', 'options');
      for (let preset of presets) {
        if (!('value' in preset)) continue;
        const key = preset.uniqueKey ? preset.uniqueKey : preset.option;
        block.settings.block.options[key] = { value: preset.value };
      }
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
          this.inject_block_presets(item, item.settings);
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
      let notiID = self.uipApp.notifications.notify(__('Importing template', 'uipress-lite'), '', 'default', false, true);

      self.sendServerRequest(template.path, formData).then((response) => {
        if (response.error) {
          self.uipApp.notifications.notify(response.message, '', 'error', true);
          self.uipApp.notifications.remove(notiID);
        }

        let parsed = JSON.parse(response);
        if (Array.isArray(parsed)) {
          parsed = parsed[0];
          parsed.uid = self.createUID();

          if (!self.isObject(parsed)) {
            self.uipApp.notifications.notify(__('Unable to import template right now', 'uipress-lite'), '', 'error', true);
            self.uipApp.notifications.remove(notiID);
          }

          let freshLayout = [];
          if ('content' in parsed) {
            for (const block of parsed.content) {
              freshLayout.push(self.cleanBlock(block));
            }
            parsed.content = freshLayout;
          }
          self.uipApp.notifications.remove(notiID);
          self.uipApp.notifications.notify(__('Template imported', 'uipress-lite'), '', 'success', true);
          self.items.splice(index, 0, parsed);
        } else {
          self.uipApp.notifications.notify(__('Unable to import template right now', 'uipress-lite'), '', 'error', true);
          self.uipApp.notifications.remove(notiID);
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
      //item.uid = this.createUID();
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
        //item.uid = this.createUID();
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
      if (this.hasNestedPath(evt, ['added', 'element', 'remote'])) return;

      // ADD A UID TO ADDED OPTION
      let newElement = evt.added.element;
      // New block, add uid
      if (!('uid' in newElement)) {
        newElement.uid = this.createUID();
      }

      // New block so let's add settings
      if (Object.keys(newElement.settings).length === 0) {
        this.inject_block_presets(newElement, newElement.settings);
      }

      //Open block
      await this.forceReload();
      this.uipApp.blockControl.setActive(newElement, this.items);
      this.returnData(this.items);
    },
  },
  template: `
    
      
      
                 
      <uip-draggable v-if="rendered && !isProduction"
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
      
      <!-- Production template-->
      <div class="uip-flex uip-w-100p" v-else-if="rendered" :class="randomClass">
        <template v-for="(element, index) in returnItems">
          
          <BlockRender :block="element" :list="items" :index="index" :contextualData="contextualData"/>
          
        </template>
      </div>
      
		`,
};
