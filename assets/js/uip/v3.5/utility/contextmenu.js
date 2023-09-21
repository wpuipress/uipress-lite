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
      let pos = evt;
      if (fixedPosition) {
        pos = fixedPosition;
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

      if (bottom > window.innerHeight) {
        this.position.y = this.position.y - (bottom - window.innerHeight) - 20;
      }
      if (right > window.innerWidth) {
        this.position.x = this.position.x - (right - window.innerWidth) - 40;
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
      document.addEventListener('click', this.onClickOutside);
      document.addEventListener('contextmenu', this.onClickOutside);
    },
    /**
     * Removes the click listener
     * no args
     * @since 0.0.1
     */
    removeClickOutside() {
      document.removeEventListener('click', this.onClickOutside);
      document.removeEventListener('contextmenu', this.onClickOutside);
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
      if (!this.aboveClick) return `top: ${this.position.y}px; left: ${this.position.x}px`;
      let bottom = window.innerHeight - this.position.y;
      if (this.aboveClick) return `bottom: ${bottom}px; left: ${this.position.x}px`;
    },
  },
  template: `
  
	<teleport to="body" :disabled="disableTeleport">
	  <div v-if="isVisible" ref="contextmenu" style="border-radius:calc(var(--uip-border-radius-large) + var(--uip-padding-xs));"
	  :style="returnPosition()"
	  class="uip-background-default uip-flex uip-flex-column uip-text-normal uip-position-fixed uip-modal-body uip-z-index-99 uip-shadow uip-fade-in uip-body-font">
		  <slot></slot>
	  </div>
	</teleport>
  
		`,
};
