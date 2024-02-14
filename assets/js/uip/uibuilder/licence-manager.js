/**
 * Builds the licence manager
 * @since 3.3.095
 */
const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from "../../libs/vue-esm.js";
export default {
  data() {
    return {
      loading: true,
      validating: false,
      userKey: "",
      activated: false,
      URL: "https://api.uipress.co/",
      menuWatcher: [],
      strings: {
        licence: __("Licence", "uipress-lite"),
        noValidKey: __("Please enter a valid licence key", "uipress-lite"),
        activate: __("Activate", "uipress-lite"),
        validatingKey: __("Validating key", "uipress-lite"),
        licenceActive: __("Licence active", "uipress-lite"),
        removeKey: __("Remove", "uipress-lite"),
        removingKey: __("Removing key", "uipress-lite"),
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    /**
     * Checkers user key
     *
     * @since 3.3.095
     */
    async validateLicenceKey() {
      // Bail if empty key
      if (!this.userKey) {
        this.uipApp.notifications.notify(this.strings.noValidKey, "", "error", true);
        return;
      }

      const notiID = this.uipApp.notifications.notify(this.strings.validatingKey, "", "default", false, true);

      this.validating = true;
      let domain = this.uipApp.data.options.domain;
      let query = "";
      query += "?k=" + this.userKey;
      query += "&d=" + domain;
      query += "&instance=";
      let url = this.URL + "validate/" + query;
      let formData = new FormData();

      const response = await this.sendServerRequest(url, formData);
      // Generic error
      if (response.error) {
        this.validating = false;
        this.uipApp.notifications.notify(response.message, "", "error", true);
      }
      // it's an error, unable to contact licence server
      else if (response instanceof Error) {
        this.validating = false;
        this.uipApp.notifications.notify(__("Check failed", "uipress-pro"), __("Unable to contact licencing servers. Please try again later", "uipress-pro"), "error", true);
      }
      //It's a licence key error
      else if (response.state == "false") {
        this.validating = false;
        this.uipApp.notifications.notify(response.message, "", "error", true);
      }
      // Activated
      else if (response.state == "true") {
        this.sp = false;
        this.validating = false;
        this.activated = true;
        this.uipApp.notifications.notify(__("Thank you!", "uipress-pro"), __("Your key is valid and you can now use pro features", "uipress-pro"), "success", true);
        this.saveData(this.userKey, response);
        this.saveUserPreference("uipfa", 2, false);
        this.userKey = "";
      }
      // Something went wrong but not sure what
      else {
        this.validating = false;
        this.uipApp.notifications.notify(__("Check failed", "uipress-pro"), __("Something went wrong. Please try again later", "uipress-pro"), "error", true);
      }

      // Remove notification
      this.uipApp.notifications.remove(notiID);
    },

    /**
     * Saves licence key details
     *
     * @param {string} key
     * @param {object} activationResponse - activation response
     * @since 3.2.00
     */
    async saveData(key, activationResponse) {
      const instance = "instance_id" in activationResponse ? activationResponse.instance_id : false;

      let formData = new FormData();
      formData.append("action", "uip_save_uip_pro_data");
      formData.append("security", uip_ajax.security);
      formData.append("key", key);
      formData.append("instance", instance);
      formData.append("multisite", this.uipApp.data.options.multisite);
      formData.append("networkActivated", this.uipApp.data.options.networkActivated);
      formData.append("primarySite", this.uipApp.data.options.primarySite);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      // Handle error response
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "", "error", true);
        return;
      }
    },

    /**
     * Main function for fetching licence details
     *
     * @since 3.2.0
     */
    async getData() {
      this.loading = true;
      let formData = new FormData();
      formData.append("action", "uip_get_pro_app_data");
      formData.append("security", uip_ajax.security);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      this.loading = false;

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "", "error", true);
        this.activated = false;
        return;
      }

      // No uipress pro keys
      if (!response.uip_pro) {
        this.activated = false;
        return;
      }

      this.activated = true;
      this.userData = response.uip_pro;
    },

    /**
     * Removes uipress activation
     *
     * @since 3.2.13
     */
    removeData() {
      const notiID = this.uipApp.notifications.notify(this.strings.removingKey, "", "default", false, true);

      let formData = new FormData();
      formData.append("action", "uip_remove_uip_pro_data");
      formData.append("security", uip_ajax.security);

      this.sendServerRequest(uip_ajax.ajax_url, formData);
      // Remove notification
      this.uipApp.notifications.remove(notiID);
      this.uipApp.notifications.notify(__("Key successfully removed", "uipress-pro"), "", "success", true);
      this.activated = false;
    },
  },
  template: `
  
  <div v-if="loading" class="uip-w-100p uip-flex uip-flex-middle uip-flex-center uip-padding-s"><loading-chart></loading-chart></div>
  
  <div v-else class="uip-grid-col-1-3">
  
  
  	<div class="uip-text-muted uip-padding-xs uip-max-w-200">{{strings.licence}}</div>
	  
	  
	<form v-if="!activated" class="uip-flex uip-gap-xs uip-flex-no-wrap" autocomplete="off" @submit.prevent="validateLicenceKey">
		
		<input class="uip-input-small uip-w-100p" type="password" v-model="userKey" placeholder="xxxx-xxxx-xxxx-xxxx">
		
		<input type="submit" class="uip-button-primary uip-text-s" :value="strings.activate"/>
	
	</form>  
	
	<div v-else class="uip-flex uip-gap-xs uip-flex-no-wrap">
	
	
		<div class="uip-background-green-wash uip-text-green uip-text-bold uip-border-rounder uip-text-s uip-padding-xs uip-flex uip-flex-column uip-row-gap-xs uip-flex-grow uip-text-center">
			{{strings.licenceActive}}
		</div>
		
		<button @click="removeData()"
		class="uip-button-primary uip-text-s uip-flex uip-gap-xxs uip-flex-center">
			
			<div class="uip-icon uip-text-muted uip-text-l uip-text-inverse">close</div>
			<span>{{strings.removeKey}}</span>
			
		</button>
	
	
	</div>
  
  </div>
  
  `,
};
