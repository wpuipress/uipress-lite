const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from "../../../libs/vue-esm.js";

export default {
  components: {
    modal: defineAsyncComponent(() => import("./modal.min.js?ver=3.3.1")),
  },
  data() {
    return {
      title: undefined,
      message: undefined,
      okButton: undefined,
      cancelButton: __("Cancel", "uipress-lite"),
      icon: "report",
      resolvePromise: undefined,
      rejectPromise: undefined,
      disableTeleport: false,
    };
  },
  methods: {
    /**
     * Shows confirm dialog and sets options
     *
     * @param {Object} opts - the confirm options
     * @since 3.2.13
     */
    show(opts = {}) {
      this.title = opts.title;
      this.message = opts.message;
      this.okButton = opts.okButton;
      this.disableTeleport = opts.disableTeleport;
      if (opts.icon) {
        this.icon = opts.icon;
      }
      if (opts.cancelButton) {
        this.cancelButton = opts.cancelButton;
      }
      // Once we set our config, we tell the popup modal to open
      this.$refs.popup.open();

      nextTick(() => {
        this.$refs.confirmBody.focus();
      });
      // Return promise so the caller can get results
      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve;
        this.rejectPromise = reject;
      });
    },
    /**
     * Confirms and closes modal
     *
     * @since 3.2.13
     */
    confirm() {
      this.$refs.popup.close();
      this.resolvePromise(true);
    },
    /**
     * Cancels and closes modal
     *
     * @since 3.2.13
     */
    cancel() {
      this.$refs.popup.close();
      this.resolvePromise(false);
    },
  },
  template: `
  
	  <modal ref="popup" :disableTeleport="disableTeleport">
		<div ref="confirmBody" @keydown.escape="cancel()" @keydown.enter="confirm()" class="uip-min-w-320 uip-flex uip-flex-column uip-row-gap-s uip-padding-m" tabindex="1" autofocus>
		
		  <div class="uip-flex uip-gap-xs uip-flex-start uip-flex-no-wrap">
			
			<h2 class="uip-margin-remove uip-flex-grow">{{ title }}</h2>
			<div @click="cancel()" class="uip-padding-xxs uip-border-rounder hover:uip-background-muted uip-cursor-pointer">
			  <span class="uip-icon uip-link-muted">close</span>
			</div>
		  
		  </div>
		  
		  <div class="uip-text-muted" v-html="message"></div>
		  
		  <div class="uip-flex uip-gap-s">
		  
			  <button class="uip-button-default uip-flex uip-gap-xs uip-flex-center" @click="cancel">
				<span>{{ cancelButton }}</span>
				<div class="uip-background-grey uip-padding-left-xxs uip-padding-right-xxs uip-border-rounder uip-flex uip-flex-middle">
				  <span class="uip-text-muted uip-text-s">esc</span>
				</div>
			  </button>
			  
			  <button class="uip-button-primary uip-flex uip-gap-s uip-flex-center" @click="confirm">
				<span>{{ okButton }}</span>
				<span class="uip-icon uip-text-muted uip-dark-mode">keyboard_return</span>
			  </button>
		  </div>
		
		</div>
	</modal>
		`,
};
