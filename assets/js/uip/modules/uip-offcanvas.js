export function moduleData() {
  return {
    props: {
      position: String,
      overlayStyle: String,
      style: [String, Object],
      shortCut: [Boolean, String, Array],
      closeOnLoad: [Boolean, Object],
    },
    data: function () {
      return {
        open: false,
        uid: this.uipress.createUID(),
      };
    },
    inject: ['uiTemplate', 'uipress'],
    mounted: function () {
      let self = this;
      this.mountShortcut();
      document.addEventListener(
        'uip_page_change_loaded',
        (e) => {
          if (self.open && self.closeOnLoad) {
            self.closeOffcanvas();
          }
        },
        { once: false }
      );
    },
    methods: {
      closeOffcanvas() {
        let self = this;

        let theBody;
        if (!self.uiTemplate) {
          theBody = document.body;
        } else if (self.uiTemplate.display != 'prod') {
          theBody = document.getElementById('uip-template-body');
        } else {
          theBody = document.body;
        }

        if (self.overlayStyle == 'push') {
          theBody.style.left = '0';
          theBody.style.right = '0';
        }

        this.$refs.offCanvasCover.classList.remove('uip-fade-in');
        this.$refs.offCanvasCover.classList.add('uip-fade-out');
        this.$refs.offCanvasBody.classList.remove('uip-slide-in-left');
        if (this.position == 'left') {
          this.$refs.offCanvasBody.classList.add('uip-slide-out-left');
        } else {
          this.$refs.offCanvasBody.classList.add('uip-slide-out-right');
        }
        setTimeout(function () {
          self.open = false;
        }, 200);
      },
      openOffCanvas() {
        let self = this;
        self.open = true;

        if (self.overlayStyle == 'push') {
          requestAnimationFrame(() => {
            let width = self.$refs.offCanvasBody.getBoundingClientRect().width;

            let theBody;
            if (self.uiTemplate.display != 'prod') {
              theBody = document.getElementById('uip-template-body');
            } else {
              theBody = document.body;
            }

            if (this.position == 'left') {
              theBody.style.position = 'relative';
              theBody.style.left = width + 'px';
            } else {
              theBody.style.position = 'relative';
              theBody.style.left = '-' + width + 'px';
            }
          });
        }
      },
      mountShortcut() {
        if (!this.shortCut) {
          return;
        }

        let shortcut = JSON.parse(JSON.stringify(this.shortCut));
        let pressedKeys = [];

        window.addEventListener('keydown', (event) => {
          let shortcutPressed = false;

          pressedKeys.push(event.key.toString());

          shortcutPressed = true;
          for (let item of shortcut) {
            if (!pressedKeys.includes(item)) {
              shortcutPressed = false;
              break;
            }
          }

          if (shortcutPressed) {
            this.open = true;
          }
        });

        window.addEventListener('keyup', (event) => {
          pressedKeys = [];
        });
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
		  
  	  <div ref="offCanvasCover" v-if="open && overlayStyle != 'push'" class="uip-position-fixed uip-w-100p uip-top-0 uip-bottom-0 uip-text-normal uip-flex uip-fade-in" 
		    style="background:rgba(0,0,0,0.3);z-index:9;top:0;left:0;right:0;max-height:100%" >
			    <!-- MODAL GRID -->
			    <div class="uip-flex uip-w-100p uip-h-100p" :class="{'uip-flex-reverse': position == 'left'}">
	  			    <div class="uip-flex-grow" @click="closeOffcanvas()" ></div>
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
      
      
      
      <div ref="offCanvasCover" v-if="open && overlayStyle == 'push'" class="uip-position-fixed uip-w-100p uip-top-0 uip-bottom-0 uip-text-normal uip-flex" 
        style="top:0;left:0;right:0;max-height:100%" >
          <!-- MODAL GRID -->
          <div class="uip-flex uip-w-100p uip-h-100p" :class="{'uip-flex-reverse': position == 'left'}">
              <div class="uip-flex-grow" @click="closeOffcanvas()" ></div>
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
    
    </div>`,
  };
}
