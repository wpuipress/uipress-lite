export function moduleData() {
  return {
    props: {
      title: String,
      removePadding: Boolean,
      removeMaxHeight: Boolean,
      shortCut: [Boolean, String, Array],
    },
    data: function () {
      return {
        open: false,
      };
    },
    mounted: function () {
      this.mountShortcut();
    },
    methods: {
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
            this.openModal();
          }
        });

        window.addEventListener('keyup', (event) => {
          pressedKeys = [];
        });
      },
      openModal() {
        this.open = true;

        //this.setPosition();
        // You can also use Vue.$nextTick or setTimeout
        requestAnimationFrame(() => {
          document.documentElement.addEventListener('click', this.onClickOutside, false);
        });
      },
      onClickOutside(event) {
        if (!this.$refs.uipmodal) {
          return;
        }
        const path = event.path || (event.composedPath ? event.composedPath() : undefined);
        // check if the MouseClick occurs inside the component
        if (path && !path.includes(this.$refs.uipmodal) && !this.$refs.uipmodal.contains(event.target)) {
          this.closeThisComponent(); // whatever method which close your component
        }
      },
      closeThisComponent() {
        this.open = false; // whatever codes which close your component
        document.documentElement.removeEventListener('click', this.onClickOutside, false);
      },
    },
    template: `
	
	  <div class="uip-position-relative">
    
		  <div @click="openModal()">
			  <slot name="trigger"></slot>
		  </div>
		  
		  <div ref="modalOuter" v-if="open" class="uip-position-fixed uip-top-0 uip-left-0 uip-h-viewport uip-w-vw uip-background-black-wash uip-flex uip-flex-center uip-flex-middle uip-fade-in uip-z-index-9999">
			  <div ref="uipmodal" class="uip-background-default uip-border-rounder uip-border uip-flex uip-flex-column uip-scale-in uip-min-w-350 uip-min-w-200 uip-max-w-100p uip-text-normal uip-position-relative uip-modal-body"
        :class="{'uip-padding-s' : !removePadding}">
				  <div class="uip-flex uip-flex-between uip-modal-title uip-margin-bottom-s" v-if="title">
					  <div class="uip-text-bold uip-text-l">{{title}}</div>
					  <div @click="closeThisComponent()" class="hover:uip-background-grey uip-padding-xxs uip-border-round uip-cursor-pointer">
						  <div class="uip-icon uip-text-l">close</div>
					  </div>
				  </div>
          <div v-else class="uip-flex uip-flex-between uip-modal-title uip-position-relative">
            <div class="uip-position-absolute uip-right-0 uip-top-0 uip-padding-xs">
              <div @click="closeThisComponent()" class="hover:uip-background-grey uip-padding-xxs uip-border-round uip-cursor-pointer">
                <div class="uip-icon uip-text-l">close</div>
              </div>
            </div>
          </div>
				  <div class="uip-overflow-auto uip-scrollbar" :class="{'uip-max-h-600' : !removeMaxHeight}">
					  <slot name="content"></slot>
				  </div>
			  </div>
		  </div>
    
    </div>
	
	
	`,
  };
}
