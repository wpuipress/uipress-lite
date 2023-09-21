import { nextTick } from '../../libs/vue-esm-dev.js';
export default {
  props: {
    pos: {
      type: String,
      default: 'bottom left',
    },
    onOpen: Function,
    offsetX: { type: Number, default: 8 },
    offsetY: { type: Number, default: 8 },
  },
  inject: ['seqlData'],

  data() {
    return {
      modelOpen: false,
      currentHeight: 0,
      position: {
        left: 'auto',
        right: 'auto',
        top: 'auto',
        bottom: 'auto',
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
    document.removeEventListener('scroll', this.handleScroll, true);
    document.body.removeEventListener('click', this.onClickOutside);
  },

  methods: {
    /**
     * Resets the dropdown position values to their default state.
     *
     * @since 0.0.1
     */
    resetPosition() {
      this.position = {
        left: 'auto',
        right: 'auto',
        top: 'auto',
        bottom: 'auto',
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
      if (
        this.$refs.droptrigger.contains(event.target) ||
        (this.seqlData.medialibrary.$refs.confirmBody && this.seqlData.medialibrary.$refs.confirmBody.contains(event.target)) ||
        this.$refs.seqldrop.contains(event.target)
      ) {
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
      if (this.modelOpen) return this.close();

      this.modelOpen = true;

      // Listen to scroll event to adjust the dropdown's position.
      document.addEventListener('scroll', this.handleScroll, true);

      // Listen for a click outside the dropdown to close it.
      document.body.addEventListener('click', this.onClickOutside);

      // If an onOpen function was provided, call it.
      if (this.onOpen) this.onOpen();

      // After a slight delay, set the dropdown's initial position.
      setTimeout(() => {
        this.setPosition();
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
      document.body.removeEventListener('click', this.onClickOutside);
      document.removeEventListener('scroll', this.handleScroll, true);
    },

    /**
     * Sets the drop position
     *
     * @since 0.0.1
     */
    setPosition() {
      const drop = this.$refs.seqldrop;
      const trigger = this.$refs.droptrigger;

      if (!drop || !trigger) return;

      // Rests position to default
      this.resetPosition();

      const triggerRect = trigger.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;

      let posParts = this.pos.split(' ');
      let anchor = posParts[0];
      let align = posParts[1];

      // Set anchor positions
      if (anchor == 'bottom') this.position.top = `${triggerRect.bottom + this.offsetY}px`;
      if (anchor == 'top') this.position.bottom = `${windowHeight - triggerRect.top + this.offsetY}px`;
      if (anchor == 'left') this.position.right = `${windowWidth - triggerRect.left + this.offsetX}px`;
      if (anchor == 'right') this.position.left = `${triggerRect.right + this.offsetX}px`;

      // Set align options
      if (align == 'left') this.position.left = `${triggerRect.left}px`;
      if (align == 'right') this.position.right = `${windowWidth - triggerRect.right}px`;
      if (align == 'top') this.position.top = `${triggerRect.top}px`;
      if (align == 'bottom') this.position.bottom = `${windowHeight - triggerRect.bottom}px`;

      // Set centering is different depending on anchor);
      if (align == 'center' && (anchor == 'left' || anchor == 'right')) this.position.top = `${triggerRect.top - drop.offsetHeight / 2}px`;
      if (align == 'center' && (anchor == 'top' || anchor == 'bottom')) this.position.left = `${triggerRect.left - (drop.offsetWidth - trigger.offsetWidth) / 2}px`;

      // Adjust for offscreen dropdown
      nextTick(() => {
        let dropRect = drop.getBoundingClientRect();
        if (dropRect.top < 0) this.position.top = `${triggerRect.top}px`;
        if (dropRect.bottom > windowHeight) this.position.top = `${dropRect.top - (dropRect.bottom - windowHeight) - 16}px`;
        if (dropRect.left < 0) this.position.left = '0px';
        if (dropRect.right > windowWidth) this.position.left = `${windowWidth - drop.offsetWidth}px`;
        this.position.opacity = 1;
      });
    },
  },
  template: `
	  <div class="seql-position-relative">
		  
		  <div class="seql-cursor-pointer seql-w-100p" 
		  ref="droptrigger"
		  @click="show($event)">
			  <slot ref="droptrigger" @click="show($event)" name="trigger"/>
		  </div>
		  
		<teleport to="body">
			<div v-if="modelOpen && $slots.content"
		  ref="seqldrop" class="seql-z-index-9 seql-position-fixed seql-shadow seql-background-default seql-border-rounder seql-body-font" 
			style="border-radius:calc(var(--seql-border-radius-large) + var(--seql-padding-xxs));" :style="position">
  
			  <slot name="content"></slot>
				
			</div>
		</teleport>
		
	</div>`,
};
