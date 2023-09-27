export default {
  props: {
    message: String,
    delay: Number,
    containerClass: String,
  },
  data() {
    return {
      showTip: false,
      tipDisplayed: false,
    };
  },
  methods: {
    /**
     * Sets the position for the tooltip.
     *
     * Calculates and returns the positioning style for the tooltip based on the trigger element.
     * Uses the bottom of the trigger and the half-width of the trigger for positioning.
     *
     * @returns {string} - The style string for tooltip positioning.
     * @since 3.2.13
     */
    setPosition() {
      if (!this.$el) return;

      const content = this.$refs.tiptrigger;
      if (!content) return;

      const triggerBounds = content.getBoundingClientRect();
      const bottomOfTrigger = triggerBounds.bottom;
      const triggerHalfWidth = triggerBounds.width / 2;

      const POStop = bottomOfTrigger + 10;
      const POSLeft = this.$el.getBoundingClientRect().left;

      return `top:${POStop}px;left:${POSLeft + triggerHalfWidth}px;transform:translateX(-50%);`;
    },

    /**
     * Displays the tooltip with a delay.
     *
     * Sets the tooltip to be visible and after a delay, if the tooltip is still visible, marks it as displayed.
     *
     * @since 3.2.13
     */
    justTheTip() {
      this.showTip = true;

      setTimeout(() => {
        if (!this.showTip) {
          this.tipDisplayed = false;
          return;
        }
        this.tipDisplayed = true;
      }, this.delay);
    },

    /**
     * Hides the tooltip immediately.
     *
     * Sets the tooltip and its displayed state to be invisible.
     *
     * @since 3.2.13
     */
    hideTip() {
      this.showTip = false;
      this.tipDisplayed = false;
    },
  },
  template: `
  
          <div :class="containerClass" @mouseover="justTheTip()" @mouseleave="hideTip()" ref="tiptrigger">
      
		    <slot></slot>
        
            <template v-if="message && message != ''">
		          <div v-if="tipDisplayed" :style="setPosition()" class="uip-tooltip" ref="dynamictip">
              {{message}}
              </div>
            </template>
            
	      </div>
        
        `,
};
