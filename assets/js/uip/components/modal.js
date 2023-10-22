export default {
  props: {
    title: String,
    removePadding: Boolean,
    removeMaxHeight: Boolean,
    shortCut: [Boolean, String, Array],
  },
  data() {
    return {
      open: false,
      pressedKeys: null,
    };
  },
  mounted() {
    this.mountShortcut();
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  },
  methods: {
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
     * Opens modal
     *
     * @returns {Promise}
     * @since 3.2.13
     */
    async show() {
      this.open = true;
    },

    /**
     * Closes component
     *
     * @since 3.2.13
     */
    close() {
      this.open = false; // whatever codes which close your component
    },
  },
  template: `
	
	  <div class="uip-position-relative">
    
		  <div @click="show()">
			  <slot name="trigger"></slot>
		  </div>
		  
		  <div ref="modalOuter" 
          v-if="open" 
          @click="close"
          class="uip-position-fixed uip-top-0 uip-left-0 uip-h-viewport uip-w-vw uip-background-black-wash uip-flex uip-flex-center uip-flex-middle uip-fade-in uip-z-index-9999">
          
			  <div ref="uipmodal" @click.prevent.stop
              class="uip-background-default uip-border-rounder uip-border uip-flex uip-flex-column uip-scale-in uip-min-w-350 uip-min-w-200 uip-max-w-100p uip-text-normal uip-position-relative uip-modal-body"
              :class="{'uip-padding-s' : !removePadding}">
              
				  <div v-if="title" class="uip-flex uip-flex-between uip-modal-title uip-margin-bottom-s">
					  <div class="uip-text-bold uip-text-l">{{title}}</div>
					  <div @click="close()" class="hover:uip-background-grey uip-padding-xxs uip-border-round uip-cursor-pointer">
						  <div class="uip-icon uip-text-l">close</div>
					  </div>
				  </div>
          
                  <div v-else class="uip-flex uip-flex-between uip-modal-title uip-position-relative">
                    <div class="uip-position-absolute uip-right-0 uip-top-0 uip-padding-xs">
                      <div @click="close()" class="hover:uip-background-grey uip-padding-xxs uip-border-round uip-cursor-pointer">
                        <div class="uip-icon uip-text-l">close</div>
                      </div>
                    </div>
                  </div>
                  
				  <div :class="{'uip-max-h-600' : !removeMaxHeight}">
					  <slot name="content"></slot>
				  </div>
          
			  </div>
        
		  </div>
      
      </div>
	
	
	`,
};
