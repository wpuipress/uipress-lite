/**
 * Mixin to detect browser's support for passive event listeners.
 */
const passiveSupportMixin = {
  methods: {
    /**
     * Checks if the current browser supports passive event listeners.
     * @returns {boolean} - Returns true if passive is supported, otherwise false.
     */
    doesBrowserSupportPassiveScroll() {
      let passiveSupported = false;
      try {
        const options = {
          get passive() {
            passiveSupported = true;
            return false;
          },
        };
        window.addEventListener("test", null, options);
        window.removeEventListener("test", null, options);
      } catch (err) {
        passiveSupported = false;
      }
      return passiveSupported;
    },
  },
};

export default {
  mixins: [passiveSupportMixin],

  props: {
    /**
     * List of all items to display using virtual scrolling.
     */
    allItems: {
      type: Array,
      required: true,
    },
    containerClass: {
      type: String,
      required: false,
    },
    // Height of the root container.
    rootHeight: {
      type: Number,
      required: false,
      default: 300,
    },
    // Height of each row.
    startRowHeight: {
      type: Number,
      required: false,
      default: 10,
    },
    perRow: {
      type: Number,
      required: false,
      default: 1,
    },
  },

  data() {
    return {
      // Current scroll position.
      scrollTop: 0,
      // Padding for smooth scrolling.
      nodePadding: 20,
      rowHeight: this.startRowHeight,
    };
  },

  computed: {
    /**
     * Calculates total viewport height.
     * @returns {number} - Total viewport height in pixels.
     */
    viewportHeight() {
      return this.itemCount * this.rowHeight;
    },

    /**
     * Calculates the starting index for visible items.
     * @returns {number} - Start index.
     */
    startIndex() {
      let startNode = Math.floor(this.scrollTop / this.rowHeight) - this.nodePadding;
      return Math.max(0, startNode);
    },

    /**
     * Determines the count of nodes that are currently visible.
     * @returns {number} - Number of visible nodes.
     */
    visibleNodeCount() {
      let count = Math.ceil(this.rootHeight / this.rowHeight) + 2 * this.nodePadding;
      return Math.min(this.itemCount - this.startIndex, count);
    },
    /**
     * Returns the items that are currently visible in the viewport.
     * @returns {Array} - Subset of visible items.
     */
    visibleItems() {
      return this.allItems.slice(this.startIndex * this.perRow, (this.startIndex + this.visibleNodeCount) * this.perRow);
    },

    /**
     * Returns the total count of items.
     * @returns {number} - Total item count.
     */
    itemCount() {
      return Math.ceil(this.allItems.length / this.perRow);
    },

    /**
     * Computes the offset for translateY transformation.
     * @returns {number} - Offset in pixels.
     */
    offsetY() {
      return this.startIndex * this.rowHeight;
    },

    /**
     * Style for the spacer to simulate total height of the virtual list.
     * @returns {Object} - CSS style object.
     */
    spacerStyle() {
      return {
        transform: `translateY(${this.offsetY}px)`,
      };
    },

    /**
     * Style for the viewport.
     * @returns {Object} - CSS style object.
     */
    viewportStyle() {
      return {
        overflow: "hidden",
        height: `${this.viewportHeight}px`,
        position: "relative",
      };
    },

    /**
     * Style for the root container.
     * @returns {Object} - CSS style object.
     */
    rootStyle() {
      return {
        height: `${this.rootHeight}px`,
        overflow: "auto",
      };
    },
  },

  methods: {
    /**
     * Event handler for the scroll event.
     * Updates the scrollTop value on scroll.
     * @param {Event} event - The scroll event.
     */
    handleScroll(event) {
      this.scrollTop = this.$refs.root.scrollTop;
    },

    /**
     * Calculates the initial height for rows by checking all children's height.
     * @returns {number} - The largest height among children.
     */
    calculateInitialRowHeight() {
      const children = this.$refs.spacer.children;
      if (!children || !children.length) return this.startRowHeight;
      const firstChild = children[0];
      const height = firstChild.getBoundingClientRect().height;
      console.log(height);
      return height;
    },
  },

  /**
   * Lifecycle hook when the component is mounted.
   * Calculates the initial row height and adds a scroll event listener.
   */
  async mounted() {
    await this.$nextTick();
    const largestHeight = this.calculateInitialRowHeight();
    this.rowHeight = largestHeight || this.startRowHeight; // Use the logical OR as a simpler alternative

    // Add scroll event listener
    const scrollOptions = this.doesBrowserSupportPassiveScroll() ? { passive: true } : false;
    this.$refs.root.addEventListener("scroll", this.handleScroll, scrollOptions);
  },

  /**
   * Lifecycle hook before the component is destroyed.
   * Removes the scroll event listener.
   */
  beforeUnmount() {
    // Remove scroll event listener
    this.$refs.root.removeEventListener("scroll", this.handleScroll);
  },

  template: `
	<div @scroll="handleScroll" class="root" ref="root" :style="rootStyle">
	  <div ref="viewport" :style="viewportStyle">
	  
		  <div :class="containerClass" ref="spacer" :style="spacerStyle" class="tester">
		    <template v-for="item in visibleItems">
			    <slot name="item" :item="item"></slot>
		    </template>
		  </div>
		  
	  </div>
	</div>
  `,
};
