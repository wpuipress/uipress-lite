import { defineAsyncComponent, nextTick } from "../../libs/vue-esm.js";
const { __, _x, _n, _nx } = wp.i18n;
export default {
  components: {
    BlockSettings: defineAsyncComponent(() => import("./block-settings.min.js?ver=3.3.1")),
    Confirm: defineAsyncComponent(() => import("../v3.5/utility/confirm.min.js?ver=3.3.1")),
  },
  inject: ["uiTemplate"],
  data() {
    return {
      ai: false,
      block: false,
      list: false,
      wrapVisible: false,
      hoverWrapVisible: false,
      hoverBlock: false,
      aiLoading: false,
      node: false,
      hovernode: false,
      strings: {
        loremIpsum: __("Gnerate lorem ipsum", "uipress-lite"),
        aiFill: __("Create with AI", "uipress-lite"),
      },
      wrapPos: {
        top: null,
        left: null,
        width: null,
        height: null,
      },
      hoverWrapPos: {
        top: null,
        left: null,
        width: null,
        height: null,
      },
      // Resizer params
      resizer: {
        startX: 0,
        startY: 0,
        width: 0,
        height: 0,
        resizing: false,
        wrap: false,
        uid: false,
        block: false,
        blockWidth: 0,
        blockHeight: 0,
        previewBlockWidth: 0,
        previewBlockHeight: 0,
      },
    };
  },
  watch: {
    /**
     * Watches for scroll and hides wrap
     * no args
     * @since 3.2.13
     */
    "uipApp.scrolling": {
      handler(newVal, oldVal) {
        if (!newVal) {
          this.setWrapPosition();

          // If it was a micro scroll we may still be hovering on a block but the position has changed
          if (this.hoverBlock) {
            this.setHoverWrapPosition();
          }
        }
      },
      deep: true,
    },
    /**
     * Watches for changes to the block and updates wraps
     *
     * @since 3.2.13
     */
    block: {
      async handler(newValue, oldValue) {
        if (!this.block) return;
        // Wait for changes to take effect before rescaling wrap
        await nextTick();
        this.setWrapPosition();
      },
      deep: true,
    },

    /**
     * Watches for changes in template
     *
     * @since 0.0.1
     */
    "uiTemplate.content": {
      immediate: true,
      async handler() {
        if (!this.block) return;
        // Wait for changes to take effect before rescaling wrap
        await nextTick();
        this.setWrapPosition();
      },
      deep: true,
    },
  },
  /**
   * Checks if a block exists, if not closes
   * no args
   * @since 3.2.13
   */
  created() {
    this.uipApp.blockControl = this;
  },
  mounted() {
    document.addEventListener("keydown", this.watchBlockShortcuts);
  },
  /**
   * Removes watchers on destroy
   * no args
   * @since 3.2.13
   */
  beforeUnmount() {
    document.removeEventListener("keydown", this.watchBlockShortcuts);
  },
  computed: {
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
     * Returns whether we should show the wraps
     *
     * @since 3.2.13
     */
    dontDisplayWraps() {
      const isScrolling = this.uipApp.scrolling;
      const isProduction = this.isProduction;
      return isScrolling || isProduction;
    },
    /**
     * Returns wrap style
     * no args
     * @since 3.2.13
     */
    returnWrapStyle() {
      let color = "#0080ffff";

      this.wrapPos.border = `1px solid ${color}`;
      return this.wrapPos;
    },
    /**
     * Returns hover wrap style
     * no args
     * @since 3.2.13
     */
    returnHoverWrapStyle() {
      let color = "#0080ffff";

      this.hoverWrapPos.border = `1px solid ${color}`;
      return this.hoverWrapPos;
    },
    /**
     * Returns the currently hovered blocks uid
     *
     * @since 3.2.13
     */
    returnHoveredBlockUID() {
      if (this.hoverBlock) {
        return this.hoverBlock.uid;
      }
    },
  },
  methods: {
    /**
     * Watches for shortcuts pressed on active block
     * e (event)
     * @since 3.2.13
     */
    watchBlockShortcuts(e) {
      // Return if no block or list
      if (!this.block || !this.wrapVisible || !this.list) return;
      // Bail on input
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      // Logic for Cmd + D
      if (e.key.toLowerCase() === "d" && e.metaKey && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        this.duplicateBlock();
      }

      //  logic for Cmd + Backspace/Delete
      if (e.keyCode === 8 && e.metaKey && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        this.deleteBlock();
      }
    },

    /**
     * Traverse through block to create unique ids
     * input (Array)
     * @since 3.2.13
     */
    uniqueIds(block) {
      if (!block) return [];
      if (!Array.isArray(block)) return [];
      const self = this;

      // A recursive function to handle the nested structure
      function traverse(arr) {
        for (let item of arr) {
          // Update the id
          item.uid = self.createUID();

          // If the item has children, recursively traverse them
          if (item.content && item.content.length > 0) {
            traverse(item.content);
          }
        }
      }

      // Start the traversal from the top-level array
      traverse(block);

      return block;
    },

    /**
     * Syncs patterns across all templates
     *
     * @since 3.2.13
     */
    async syncBlockPattern() {
      // Confirm user decision
      const confirm = await this.$refs.confirm.show({
        title: __("Sync patern", "uipress-lite"),
        message: __("This will update the pattern template and will sync this pattern's changes accross all templates using the same pattern?", "uipress-lite"),
        okButton: __("Sync patern", "uipress-lite"),
      });

      // Bail if they bailed
      if (!confirm) return;

      // Start notification
      const notificationID = this.uipApp.notifications.create({
        title: __("Syncing patterns", "uipress-lite"),
        status: "success",
        message: "",
        dismissable: false,
        loader: true,
      });
      // Get current index
      const pattern = this.prepareJSON(this.block);
      const templateID = this.$route.params.templateID;

      let formData = new FormData();
      formData.append("action", "uip_sync_ui_pattern");
      formData.append("security", uip_ajax.security);
      formData.append("pattern", pattern);
      formData.append("patternID", this.block.patternID);
      formData.append("templateID", templateID);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "uipress-lite", "", "error", true);
        return;
      }

      if (response.success) {
        // Update pattern ID
        if (response.newPattern) {
          this.block.patternID = response.newPattern;
        }

        // Update template
        if (response.newTemplate) {
          this.uiTemplate.content = response.newTemplate;
        }

        // Update patterns
        this.uiTemplate.patterns = response.patterns;
      }

      // Remove loading notification
      this.uipApp.notifications.remove(notificationID);

      // Update new notification
      this.uipApp.notifications.create({
        title: __("Patterns synced succesfully", "uipress-lite"),
        status: "success",
        message: "",
        dismissable: true,
        loader: false,
      });
    },

    /**
     * Duplicates block
     * e (event)
     * @since 3.2.13
     */
    duplicateBlock() {
      // Get current index
      const index = this.list.findIndex((obj) => {
        return obj.uid == this.block.uid;
      });
      // Block does not exist so exit
      if (index < 0) return;

      // Create the new block
      let newBlock = JSON.parse(JSON.stringify(this.block));
      newBlock.uid = this.createUID();
      if (newBlock.content && newBlock.content.length > 0) {
        newBlock.content = this.uniqueIds(newBlock.content);
      }
      this.list.splice(index, 0, newBlock);
    },

    /**
     * Deletes block
     * e (event)
     * @since 3.2.13
     */
    deleteBlock() {
      // Get current index
      const index = this.list.findIndex((obj) => {
        return obj.uid == this.block.uid;
      });
      // Block does not exist so exit
      if (index < 0) return;

      // Remove block
      this.list.splice(index, 1);
      this.removeActive();
    },

    /**
     * Resets block positions on change
     * no args
     * @since 3.2.13
     */
    resetpositions() {
      this.setHoverWrapPosition();
      this.setWrapPosition();
    },

    /**
     * Sets a block as active
     * no args
     * @since 3.2.13
     */
    setActive(block, list, evt, supressSettings) {
      this.node = null;
      if (evt) {
        if (evt.currentTarget) {
          this.node = evt.currentTarget;
        }
      }
      this.block = block;
      this.list = list;

      this.$router.push({ query: { ...this.$route.query, block: this.block.uid } });

      if (!supressSettings) this.uipApp.blockSettings.show(this.block);

      this.setWrapPosition();
      this.maybeCloseSiteSettings();
    },

    /**
     * Checks if we are on site settings and if so exit
     *
     * @since 3.2.13
     */
    maybeCloseSiteSettings() {
      const ID = this.$route.params.templateID;

      if (this.$route.name != "templateSettings") return;

      this.$router.push({
        path: `/uibuilder/${ID}/`,
        query: { ...this.$route.query },
      });
    },

    /**
     * Removes active state from block
     * no args
     * @since 3.2.13
     */
    removeActive() {
      this.node = null;
      this.block = null;
      this.list = null;
      this.wrapVisible = false;

      this.$router.push({ query: { ...this.$route.query, block: null } });
      this.uipApp.blockSettings.close();
    },
    /**
     * Sets a hover border over a block
     * no args
     * @since 3.2.13
     */
    setHover(evt, block) {
      this.hoverBlock = block;
      this.hovernode = evt.currentTarget;
      this.setHoverWrapPosition();
    },
    /**
     * Removes hover on block
     *
     * @since 3.2.13
     */
    removeHover(evt, block) {
      this.hoverBlock = false;
      this.hovernode = false;
      this.hoverWrapVisible = false;
    },
    /**
     * Sets a position for the hover wrap as active
     * no args
     * @since 3.2.13
     */
    setHoverWrapPosition() {
      if (!this.hoverBlock) return (this.hoverWrapVisible = false);

      let domBlock = !this.hovernode ? document.querySelector(`[block-uid="${this.hoverBlock.uid}"]`) : this.hovernode;
      if (!domBlock) return (this.hoverWrapVisible = false);

      // Get domBlock position
      let rect = domBlock.getBoundingClientRect();
      this.hoverWrapPos = {
        top: rect.top + "px",
        left: rect.left + "px",
        width: rect.width + "px",
        height: rect.height + "px",
      };

      requestAnimationFrame(() => {
        this.hoverWrapVisible = true;
      });
    },
    /**
     * Sets a block as active
     * no args
     * @since 3.2.13
     */
    setWrapPosition() {
      if (!this.block) return (this.wrapVisible = false);
      if (!this.block.uid) return (this.wrapVisible = false);

      // Get block from canvas
      let domBlock;
      if (!this.node) {
        domBlock = document.querySelector(`[block-uid="${this.block.uid}"]`);
      } else {
        domBlock = this.node;
      }

      if (!domBlock) return (this.wrapVisible = false);

      // Get domBlock position
      let rect = domBlock.getBoundingClientRect();
      this.wrapPos = {
        top: rect.top + "px",
        left: rect.left + "px",
        width: rect.width + "px",
        height: rect.height + "px",
      };

      requestAnimationFrame(() => {
        this.wrapVisible = true;
      });
    },
  },

  template: `
  
  		<!-- Hover wrap -->
		<div v-if="hoverWrapVisible && !dontDisplayWraps"
		class="uip-border uip-position-fixed uip-fade-in uip-no-select"
		:style="returnHoverWrapStyle"></div>
		
		
  	  	<!-- Selected wrap -->
		<div v-if="wrapVisible && !dontDisplayWraps"
		class="uip-border uip-position-fixed uip-fade-in uip-no-select"
		:style="returnWrapStyle">
			
		  
		</div>
		
        <KeepAlive>
		    <BlockSettings/>
        </KeepAlive>
        
        <Confirm ref="confirm"/>
	
		`,
};
