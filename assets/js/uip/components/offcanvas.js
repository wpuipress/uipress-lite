import { nextTick } from "../../libs/vue-esm.js";
export default {
  props: {
    position: String,
    overlayStyle: String,
    style: [String, Object],
    shortCut: [Boolean, String, Array],
    closeOnLoad: [Boolean, Object],
  },
  data() {
    return {
      open: false,
    };
  },
  inject: ["uiTemplate"],
  mounted() {
    this.mountShortcut();
  },
  beforeUnmount() {
    document.removeEventListener("uipress/app/page/load/finish", this.handlePageChange, { once: false });
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
      document.addEventListener("uipress/app/page/load/finish", this.handlePageChange, { once: false });

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
     * Handles page change. If set, then closes offcanvas
     *
     * @param {Object} event - page change event
     * @since 3.2.13
     */
    handlePageChange(event) {
      if (this.open && this.closeOnLoad) {
        this.closeOffcanvas();
      }
    },

    /**
     * Closes off canvas and applies exit styles
     *
     * @since 3.2.13
     */
    closeOffcanvas() {
      let theBody;
      if (!this.uiTemplate) {
        theBody = document.body;
      } else if (this.uiTemplate.display != "prod") {
        theBody = document.getElementById("uip-template-body");
      } else {
        theBody = document.body;
      }

      if (this.overlayStyle == "push") {
        theBody.style.left = "0";
        theBody.style.right = "0";
      }

      this.$refs.offCanvasCover.classList.remove("uip-fade-in");
      this.$refs.offCanvasCover.classList.add("uip-fade-out");
      this.$refs.offCanvasBody.classList.remove("uip-slide-in-left");
      if (this.position == "left") {
        this.$refs.offCanvasBody.classList.add("uip-slide-out-left");
      } else {
        this.$refs.offCanvasBody.classList.add("uip-slide-out-right");
      }

      // Sets timeout for close
      setTimeout(() => {
        this.open = false;
      }, 200);
    },

    /**
     * Shorthand opener function
     *
     * @since 3.3.095
     */
    show() {
      this.openOffCanvas();
    },

    /**
     * Shorthand close function
     *
     * @since 3.3.095
     */
    close() {
      this.closeOffcanvas();
    },

    /**
     * Opens off canvas and applies entry styles
     *
     * @since 3.2.13
     */
    async openOffCanvas() {
      this.open = true;

      if (this.overlayStyle != "push") return;

      await nextTick();

      let width = this.$refs.offCanvasBody.getBoundingClientRect().width;

      let theBody;
      if (this.uiTemplate.display != "prod") {
        theBody = document.getElementById("uip-template-body");
      } else {
        theBody = document.body;
      }

      if (this.position == "left") {
        theBody.style.position = "relative";
        theBody.style.left = width + "px";
      } else {
        theBody.style.position = "relative";
        theBody.style.left = "-" + width + "px";
      }
    },
  },
  template: `
    <div>
    
      <div @click="openOffCanvas()">
        <slot name="trigger"></slot>
      </div>
    
      <component is="style">
        #wpadminbar{z-index:8;}
      </component>
    
      <div ref="offCanvasCover" v-if="open && overlayStyle != 'push'" class="uip-position-fixed uip-w-100p uip-top-0 uip-bottom-0 uip-text-normal uip-flex uip-fade-in" style="background:rgba(0,0,0,0.3);z-index:9;top:0;left:0;right:0;max-height:100%">
      
        <div class="uip-flex uip-w-100p uip-h-100p" :class="{'uip-flex-reverse': position == 'left'}">
        
          <div class="uip-flex-grow" @click="closeOffcanvas()"></div>
          
          <div ref="offCanvasBody" class="uip-w-30p uip-background-default uip-padding-m  uip-overflow-auto uip-border-box uip-offcanvas-panel uip-position-relative" :class="[{'uip-slide-in-right' : position == 'right'}, {'uip-slide-in-left' : position == 'left'}]" style="max-height: 100%;min-height: 100%;" :style="style">
          
            <div class="uip-position-absolute uip-top-0 uip-padding-s uip-right-0 uip-z-index-1">
              <span @click="closeOffcanvas()" class="uip-icon uip-padding-xxs uip-border-round hover:uip-background-grey uip-cursor-pointer uip-link-muted uip-text-l">
                close
              </span>
            </div>
            
            <div class="uip-position-relative uip-h-100p uip-flex uip-w-100p uip-flex uip-max-h-100p">
              <slot name="content"></slot>
            </div>
            
          </div>
          
        </div>
        
      </div>
    
    
      <!-- Offcanvas push -->
      <div ref="offCanvasCover" v-else-if="open && overlayStyle == 'push'" class="uip-position-fixed uip-w-100p uip-top-0 uip-bottom-0 uip-text-normal uip-flex" style="top:0;left:0;right:0;max-height:100%">
      
        <div class="uip-flex uip-w-100p uip-h-100p" :class="{'uip-flex-reverse': position == 'left'}">
        
          <div class="uip-flex-grow" @click="closeOffcanvas()"></div>
          
          <div ref="offCanvasBody" class="uip-w-30p uip-background-default uip-padding-m  uip-overflow-auto uip-border-box uip-offcanvas-panel uip-position-relative" :class="[{'uip-slide-in-right' : position == 'right'}, {'uip-slide-in-left' : position == 'left'}]" style="max-height: 100%;min-height: 100%;" :style="style">
          
            <div class="uip-position-absolute uip-top-0 uip-padding-s uip-right-0 uip-z-index-1">
              <span @click="closeOffcanvas()" class="uip-icon uip-padding-xxs uip-border-round hover:uip-background-grey uip-cursor-pointer uip-link-muted uip-text-l">
                close
              </span>
            </div>
            
            <div class="uip-position-relative uip-h-100p uip-flex uip-w-100p uip-flex uip-max-h-100p">
              <slot name="content"></slot>
            </div>
            
          </div>
          
        </div>
        
      </div>
    
    </div>
    
    `,
};
