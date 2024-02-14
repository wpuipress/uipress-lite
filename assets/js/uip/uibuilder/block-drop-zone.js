import { nextTick } from "../../libs/vue-esm.js";
import blockRender from "./block-render.min.js?ver=3.3.1";
const { __ } = wp.i18n;
export default {
  components: {
    BlockRender: blockRender,
  },
  props: {
    content: {
      default: [],
      type: Array,
    },
    returnData: Function,
    layout: String,
    dropAreaStyle: String,
  },
  data() {
    return {
      items: [],
      rendered: true,
      randomClass: this.createUID(),
    };
  },
  inject: ["uiTemplate"],
  watch: {
    content: {
      async handler(newValue, oldValue) {
        this.items = this.content;
        if (!this.$refs.dropzone) return;
        this.$refs.dropzone.computeIndexes();
        await nextTick();
        this.maybeImportRemote();
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    /**
     * Returns translation strings
     *
     * @since 3.3.0
     */
    strings() {
      return {
        doesntExist: __("This component is missing or can't be loaded", "uipress-lite"),
        totalItems: __("Total items", "uipress-lite"),
        search: __("Search", "uipress-lite"),
        proOptionUnlock: __("This is a pro option. Upgrade to unlock", "uipress-lite"),
      };
    },
    /**
     * Returns whether we are in production or preview or builder
     *
     * @returns {boolean}  - returns true if we are in production | false if not
     * @since 3.2.13
     */
    isProduction() {
      if (this.uiTemplate.display == "prod") return true;
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
    async returnItems() {
      return this.items;
    },

    /**
     * Returns options object for sortable
     *
     * @since 3.2.0
     */
    returnDragGroupOptions() {
      return { name: "uip-blocks", pull: true, put: true, revertClone: false };
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
      // Remove from the DOM
      this.rendered = false;
      await nextTick();
      this.rendered = true;
    },

    /**
     * Loops through items to check for remote import templates
     *
     * @since 3.2.0
     */
    maybeImportRemote() {
      for (let i = this.items.length - 1; i >= 0; i--) {
        const block = this.items[i];
        // Example: Remove the item if it's equal to 3
        if (block.remote) {
          this.items.splice(i, 1);
          this.importBlock(block, i);
          continue;
        }
      }
    },

    /**
     * Imports a block template
     *
     * @param {JSON} template - the json template
     * @param {Number} index - The index to insert it at
     * @since 3.2.1
     */
    async importBlock(template, index) {
      let formData = new FormData();
      let notiID = this.uipApp.notifications.notify(__("Importing template", "uipress-lite"), "", "default", false, true);

      const response = await this.sendServerRequest(template.path, formData);

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "", "error", true);
        this.uipApp.notifications.remove(notiID);
      }

      let parsed = JSON.parse(response);
      if (Array.isArray(parsed)) {
        parsed = parsed[0];
        parsed.uid = this.createUID();

        if (!this.isObject(parsed)) {
          this.uipApp.notifications.notify(__("Unable to import template right now", "uipress-lite"), "", "error", true);
          this.uipApp.notifications.remove(notiID);
        }

        let freshLayout = [];
        if ("content" in parsed) {
          for (const block of parsed.content) {
            freshLayout.push(this.cleanBlock(block));
          }
          parsed.content = freshLayout;
        }
        this.uipApp.notifications.remove(notiID);
        this.uipApp.notifications.notify(__("Template imported", "uipress-lite"), "", "success", true);
        this.items.splice(index, 0, parsed);
      } else {
        this.uipApp.notifications.notify(__("Unable to import template right now", "uipress-lite"), "", "error", true);
        this.uipApp.notifications.remove(notiID);
      }
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
     * Handles item added events
     *
     * @param {Object} evt - the new item event
     * @returns {Promise}
     * @since 3.2.13
     */
    async itemAdded(evt) {
      // Handle remove event
      if (evt.removed) {
        await this.forceReload();
        this.returnData(this.items);
        return;
      }

      if (!evt.added) return;

      // Set new element
      let newBlock = evt.added.element;

      // Handle remote templates dragged in from library
      if (newBlock.remote) {
        this.items.splice(evt.added.newIndex, 1);
        this.importBlock(newBlock, evt.added.newIndex);
        return;
      }

      // New block, add uid
      if (!("uid" in newBlock)) {
        newBlock.uid = this.createUID();
      }

      // Open block
      await this.forceReload();
      this.uipApp.blockControl.setActive(newBlock, this.items);
      this.returnData(this.items);
    },
  },
  template: `
    
      
      
                 
      <uip-draggable v-if="rendered && !isProduction"
      ref="dropzone"
      :class="[{'uip-border-dashed' : uiTemplate.display == 'builder'}, randomClass]" 
      class="uip-flex uip-w-100p"
      :group="returnDragGroupOptions" 
      :list="content"
      @start="uipApp.scrolling=true"
      @end="uipApp.scrolling=false"
      ghostClass="uip-canvas-ghost"
      @change="itemAdded"
      animation="300"
      :sort="true">
              
              <template v-for="(element, index) in items" 
              :key="index" :index="index">
                
                <BlockRender :block="element" :list="items" :index="index"/>
              
              </template>
              
              
      </uip-draggable>
      
      <!-- Production template-->
      <div class="uip-flex uip-w-100p" v-else-if="rendered" :class="randomClass">
        <template v-for="(element, index) in items">
          
          <BlockRender :block="element" :list="items" :index="index"/>
          
        </template>
      </div>
      
		`,
};
