export default {
  props: {
    aboveClick: Boolean,
    disableTeleport: Boolean,
    offsetY: {
      default: 0,
      type: Number,
    },
    offsetX: {
      default: 0,
      type: Number,
    },
    snapX: Array, // Optional selector to snap X axis to
    snapY: Array, // Optional selector to snap Y axis to
    snapRight: Boolean,
  },
  data() {
    return {
      isVisible: false,
      position: {
        y: 0,
        x: 0,
      },
    };
  },
  methods: {
    /**
     * Shows the context menu
     * evt (Object)
     * @since 0.0.1
     */
    show(evt, fixedPosition) {
      // Set pos
      let pos = {
        clientX: evt.clientX,
        clientY: evt.clientY,
      };

      // Update pos if fixed position was passed
      if (fixedPosition) {
        pos = fixedPosition;
      }

      // Loop through snaps and update the trigger position
      if (this.snapX && Array.isArray(this.snapX)) {
        for (let selector of this.snapX) {
          let snap = document.querySelector(selector);
          if (!snap) continue;
          let temprect = snap.getBoundingClientRect();
          pos.clientX = temprect.left;
          break;
        }
      }

      this.position.x = pos.clientX + this.offsetX;
      this.position.y = pos.clientY + this.offsetY;
      this.isVisible = true;

      requestAnimationFrame(() => {
        if (this.isVisible) {
          this.setupClickOutside();
          this.checkForOffScreen();
        }
      });
    },
    /**
     * Checks if context menu is offscreen
     * no args
     * @since 0.0.1
     */
    checkForOffScreen() {
      let bounds = this.$refs.contextmenu.getBoundingClientRect();
      let bottom = bounds.bottom;
      let right = bounds.right;
      let left = bounds.left;

      if (bottom > window.innerHeight) {
        this.position.y = this.position.y - (bottom - window.innerHeight) - 20;
      }
      if (right > window.innerWidth) {
        this.position.x = this.position.x - (right - window.innerWidth) - 40;
      }

      if (left < 0) {
        if (this.snapRight) {
          this.position.x = 400;
        } else {
          this.position.x = 32;
        }
      }
    },
    /**
     * Closes the context menu and removes the event listener
     * no args
     * @since 0.0.1
     */
    close() {
      this.removeClickOutside();
      this.isVisible = false;
    },
    /**
     * Mounts the click listener
     * no args
     * @since 0.0.1
     */
    setupClickOutside() {
      document.addEventListener("click", this.onClickOutside);
      document.addEventListener("contextmenu", this.onClickOutside);
    },
    /**
     * Removes the click listener
     * no args
     * @since 0.0.1
     */
    removeClickOutside() {
      document.removeEventListener("click", this.onClickOutside);
      document.removeEventListener("contextmenu", this.onClickOutside);
    },
    /**
     * Watches for clicks outside the context menu
     * evt (Object)
     * @since 0.0.1
     */
    onClickOutside(event) {
      // It has already closed so remove watchers
      if (!this.$refs.contextmenu) {
        this.close();
        return;
      }
      if (!this.$refs.contextmenu.contains(event.target)) {
        this.close();
      }
    },
    /**
     * Returns the position for the context menu
     * no args
     * @since 0.0.1
     */
    returnPosition() {
      let transform = "";
      if (this.snapRight) transform = "transform:translateX(-100%)";

      if (!this.aboveClick) return `top: ${this.position.y}px; left: ${this.position.x}px;${transform}`;
      let bottom = window.innerHeight - this.position.y;
      if (this.aboveClick) return `bottom: ${bottom}px; left: ${this.position.x}px;${transform}`;
    },
  },
  template: `
  
	<teleport to="body" :disabled="disableTeleport">
	  <div v-if="isVisible" ref="contextmenu" style="border-radius:calc(var(--uip-border-radius-large) + var(--uip-padding-xs));"
	  :style="returnPosition()" @click.prevent.stop
	  class="uip-background-default uip-flex uip-flex-column uip-text-normal uip-position-fixed uip-modal-body uip-z-index-99 uip-shadow uip-fade-in uip-body-font">
		  <slot></slot>
	  </div>
	</teleport>
  
		`,
};
