import { nextTick } from "../../libs/vue-esm.js";
export default {
  props: {
    pos: {
      type: String,
      default: "bottom left",
    },
    onOpen: Function,
    offsetX: { type: Number, default: 8 },
    offsetY: { type: Number, default: 8 },
    snapX: Array, // Optional selector to snap X axis to
    snapY: Array, // Optional selector to snap Y axis to
    shortCut: [Boolean, String, Array],
    hover: Boolean,
    disableTeleport: Boolean,
  },
  data() {
    return {
      modelOpen: false,
      currentHeight: 0,
      hoverTimeout: false,
      pressedKeys: null,
      position: {
        left: "auto",
        right: "auto",
        top: "auto",
        bottom: "auto",
        opacity: 0,
      },
    };
  },

  /**
   * Removes scroll listener on unmount / destroy
   *
   * @since 0.0.1
   */
  beforeUnmount() {
    this.removeShortCuts();
  },

  mounted() {
    this.mountShortcut();
  },

  methods: {
    /**
     * Removes components shortcuts
     *
     * @since 3.2.13
     */
    removeShortCuts() {
      document.removeEventListener("scroll", this.handleScroll, true);
      document.body.removeEventListener("click", this.onClickOutside);
      window.removeEventListener("keydown", this.handleKeyDown);
      window.removeEventListener("keyup", this.handleKeyUp);
    },
    /**
     * Binds a keyboard shortcut to open a component.
     *
     * When the keys corresponding to the shortcut are pressed, the component is opened.
     * The shortcut is defined in the `shortCut` property of the instance.
     *
     * @since 3.2.13
     */
    mountShortcut() {
      // Return early if shortcut is not defined
      if (!this.shortCut) return;

      // Initialize pressedKeys set
      this.pressedKeys = new Set();

      // Clone the shortcut for immutability
      this.shortcut = [...this.shortCut];

      // Add event listeners
      window.addEventListener("keydown", this.handleKeyDown);
      window.addEventListener("keyup", this.handleKeyUp);
    },

    /**
     * Handles the 'keydown' event.
     *
     * Adds the pressed key to the `pressedKeys` set and checks if the
     * shortcut keys are pressed to show the component.
     *
     * @param {KeyboardEvent} event - The 'keydown' event.
     * @since 3.2.13
     */
    handleKeyDown(event) {
      this.pressedKeys.add(event.key);

      // Check if all keys in the shortcut are pressed
      const shortcutPressed = this.shortcut.every((key) => this.pressedKeys.has(key));

      if (shortcutPressed) {
        this.show();
      }
    },

    /**
     * Handles the 'keyup' event.
     *
     * Clears the `pressedKeys` set.
     *
     * @since 3.2.13
     */
    handleKeyUp() {
      this.pressedKeys.clear();
    },

    /**
     * Resets the dropdown position values to their default state.
     *
     * @since 0.0.1
     */
    resetPosition() {
      this.position = {
        left: "auto",
        right: "auto",
        top: "auto",
        bottom: "auto",
        opacity: 0,
      };
    },
    /**
     * Adjusts the dropdown's position in response to a scroll event.
     *
     * @since 0.0.1
     */
    handleScroll() {
      this.setPosition();
    },

    /**
     * Checks if a click occurred outside the dropdown or its trigger.
     * If it did, the dropdown is closed.
     *
     * @param {Event} event - The click event object.
     * @since 0.0.1
     */
    onClickOutside(event) {
      if (!this.$refs.uipdrop) return this.close();
      if (this.$refs.droptrigger.contains(event.target) || this.$refs.uipdrop.contains(event.target)) {
        return;
      }
      this.close();
    },

    /**
     * Shows the dropdown, sets its position, and adds necessary event listeners.
     * If the dropdown is already open, it's closed.
     *
     * @since 0.0.1
     */
    show() {
      if (this.modelOpen && !this.hover) return this.close();

      this.modelOpen = true;

      // Listen to scroll event to adjust the dropdown's position.
      document.addEventListener("scroll", this.handleScroll, true);

      // If an onOpen function was provided, call it.
      if (this.onOpen) this.onOpen();

      // After a slight delay, set the dropdown's initial position.
      setTimeout(() => {
        this.setPosition();

        // Listen for a click outside the dropdown to close it.
        document.body.addEventListener("click", this.onClickOutside);
      }, 100);
    },
    /**
     * Closes the dropdown and removes attached event listeners.
     *
     * @since 0.0.1
     */
    close() {
      this.modelOpen = false;
      this.position.opacity = 0;
      this.removeShortCuts();
    },
    /**
     * Turns a domrect into a regular object
     *
     * @param {domRect} domRect - the domrect to convert
     * @since 3.2.13
     */
    domRectToObject(domRect) {
      return {
        top: domRect.top,
        right: domRect.right,
        bottom: domRect.bottom,
        left: domRect.left,
        width: domRect.width,
        height: domRect.height,
        x: domRect.x,
        y: domRect.y,
      };
    },

    /**
     * Sets the drop position
     *
     * @since 0.0.1
     */
    setPosition() {
      const drop = this.$refs.uipdrop;
      const trigger = this.$refs.droptrigger;

      if (!drop || !trigger) return;

      // Rests position to default
      this.resetPosition();

      let triggerRect = this.domRectToObject(trigger.getBoundingClientRect());
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;

      // Loop through snaps and update the trigger position
      if (this.snapX && Array.isArray(this.snapX)) {
        for (let selector of this.snapX) {
          let snap = document.querySelector(selector);
          if (!snap) continue;
          let temprect = snap.getBoundingClientRect();
          triggerRect.left = temprect.left;
          triggerRect.right = temprect.right;
          break;
        }
      }

      let posParts = this.pos.split(" ");
      let anchor = posParts[0];
      let align = posParts[1];

      // Set anchor positions
      if (anchor == "bottom") this.position.top = `${triggerRect.bottom + this.offsetY}px`;
      if (anchor == "top") this.position.bottom = `${windowHeight - triggerRect.top + this.offsetY}px`;
      if (anchor == "left") this.position.right = `${windowWidth - triggerRect.left + this.offsetX}px`;
      if (anchor == "right") this.position.left = `${triggerRect.right + this.offsetX}px`;

      // Set align options
      if (align == "left") this.position.left = `${triggerRect.left}px`;
      if (align == "right") this.position.right = `${windowWidth - triggerRect.right}px`;
      if (align == "top") this.position.top = `${triggerRect.top}px`;
      if (align == "bottom") this.position.bottom = `${windowHeight - triggerRect.bottom}px`;

      // Set centering is different depending on anchor);
      if (align == "center" && (anchor == "left" || anchor == "right")) this.position.top = `${triggerRect.top - drop.offsetHeight / 2}px`;
      if (align == "center" && (anchor == "top" || anchor == "bottom")) this.position.left = `${triggerRect.left - (drop.offsetWidth - trigger.offsetWidth) / 2}px`;

      // Adjust for offscreen dropdown
      nextTick(() => {
        let dropRect = drop.getBoundingClientRect();
        if (dropRect.top < 0) this.position.top = `${triggerRect.top}px`;
        if (dropRect.bottom > windowHeight) this.position.top = `${dropRect.top - (dropRect.bottom - windowHeight) - 16}px`;
        if (dropRect.left < 0) {
          this.position.left = "auto";
          this.position.right = `${windowWidth - drop.offsetWidth * 2}px`;
        }
        if (dropRect.right > windowWidth) this.position.left = `${windowWidth - drop.offsetWidth}px`;

        this.position.opacity = 1;
      });
    },

    /**
     * If hover to open is set then opens the dropdown
     *
     * @since 3.2.13
     */
    maybeOpen() {
      // Exit if hover isn't set
      if (!this.hover) return;
      clearTimeout(this.hoverTimeout);
      this.show();
    },

    /**
     * If hover to open is set then closes the dropdown
     *
     * @since 3.2.13
     */
    maybeClose() {
      // Exit if hover isn't set
      if (!this.hover) return;
      this.hoverTimeout = setTimeout(this.close, 400);
    },

    /**
     * Clears cose timeout
     *
     * @since 3.2.13
     */
    clearCloseTimeout() {
      clearTimeout(this.hoverTimeout);
    },
  },
  template: `
      <div ref="droptrigger"
      @mouseenter="maybeOpen"
      @mouseover="clearCloseTimeout()"
      @mouseleave="maybeClose"
      @click="show($event)">
      
        <slot name="trigger"/>
        
        <teleport to="body" :disabled="disableTeleport">
          <div v-if="modelOpen && $slots.content" @mouseleave="maybeClose" @mouseover="clearCloseTimeout()"
          @click.stop
          ref="uipdrop" class="uip-z-index-9 uip-position-fixed uip-shadow uip-background-default uip-border-rounder uip-body-font uip-dropdown-container" 
          style="border-radius:calc(var(--uip-border-radius-large) + var(--uip-padding-xxs));" :style="position">
        
          <slot name="content"/>
            
          </div>
        </teleport>
        
      </div>`,
};
