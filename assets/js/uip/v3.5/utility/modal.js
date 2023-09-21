export default {
  props: {
    closeFunction: Function,
    disableTeleport: Boolean,
  },
  data() {
    return {
      isVisible: false,
    };
  },
  methods: {
    open() {
      this.isVisible = true;
    },
    close() {
      this.isVisible = false;
    },
    maybe_close(evt) {
      if (!this.isVisible) return;
      if (this.$refs.modalinner.contains(evt.target)) return;
      if (this.closeFunction) return this.closeFunction();
      this.close();
    },
  },
  template: `
	
	<teleport to="body" v-if="isVisible" :disabled="disableTeleport">
	
	  <component is="style" scoped>
		.fade-enter-active,
		.fade-leave-active {
			transition: opacity 0.3s;
		}
		.fade-enter,
		.fade-leave-to {
			opacity: 0;
		}
	  </component>
	
	  <transition name="fade">
		  <div ref="modalwrapper" @click="maybe_close($event)" class="uip-position-fixed uip-top-0 uip-left-0 uip-h-viewport uip-w-vw uip-background-black-wash uip-flex uip-flex-center uip-flex-middle uip-fade-in uip-z-index-9999 uip-body-font">
			  <div ref="modalinner" style="border-radius:calc(var(--uip-border-radius-large) + var(--uip-padding-xs));"
			  class="uip-background-default uip-border uip-flex uip-flex-column uip-max-w-100p uip-text-normal uip-position-relative uip-modal-body">
				  <slot></slot>
			  </div>
		  </div>
	  </transition>
	
	</teleport>
		`,
};
