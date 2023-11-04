const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    display: String,
    name: String,
    block: Object,
  },
  data() {
    return {
      formSuccess: false,
      loading: false,
      prePopulate: [],
      populating: false,
      strings: {
        submit: __("Submit", "uipress-lite"),
      },
    };
  },

  watch: {
    /**
     * Watches changes to block options and updates pre-populate data
     *
     * @since 3.2.13
     */
    "block.settings.block.options": {
      handler(newValue, oldValue) {
        this.getPrepopulate();
      },
      deep: true,
    },

    /**
     * Watches changes to block content and updates pre-populate data
     *
     * @since 3.2.13
     */
    "block.content": {
      handler(newValue, oldValue) {
        this.getPrepopulate();
      },
      deep: true,
    },
  },
  async mounted() {
    await this.$nextTick();
    setTimeout(this.getPrepopulate, 100);
  },
  computed: {
    /**
     * Returns whether item has pre populate
     *
     * @since 3.2.13
     */
    hasPrePopulate() {
      const item = this.get_block_option(this.block, "block", "prePopulate");
      return this.isObject(item) ? item.value : item;
    },

    /**
     * Returns text for submit value
     *
     * @since 3.2.13
     */
    getSubmitValue() {
      const item = this.get_block_option(this.block, "block", "submitText", true);
      if (!item) return "";

      if (!this.isObject(item)) return item;
      if (item.string) return item.string;
      return "";
    },
    /**
     * Returns success message
     *
     * @since 3.2.13
     */
    getSuccessMessage() {
      return this.get_block_option(this.block, "block", "successMessage");
    },
  },
  methods: {
    /**
     * Fetches pre populate data for the form
     *
     * @since 3.2.13
     */
    async getPrepopulate() {
      let formOptions = this.get_block_option(this.block, "block", "submitAction");

      if (!formOptions) return;

      //Nothing to pre-populate
      if (formOptions.action == "email" || formOptions.action == "phpFunction") {
        this.prePopulate = [];
        return;
      }

      // Pre populate is disabled
      if (!this.hasPrePopulate) {
        this.prePopulate = false;
        return;
      }

      // Currently fetching data
      if (this.populating) return;

      this.populating = true;
      let formKeys = [];

      // Set form keys
      let data = new FormData(this.$refs.form);
      for (const [key, value] of data) {
        formKeys.push(key);
      }

      // Only populate if we have keys
      if (formKeys.length < 1) return;

      this.loading = true;

      let formData = new FormData();
      formData.append("action", "uip_pre_populate_form_data");
      formData.append("security", uip_ajax.security);
      formData.append("formKeys", JSON.stringify(formKeys));
      formData.append("saveType", formOptions.action);
      formData.append("objectOrSingle", formOptions.objectOrSingle);
      formData.append("userMetaObjectKey", formOptions.userMetaObjectKey);
      formData.append("siteOptionName", formOptions.siteOptionName);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);
      this.loading = false;
      // Delay the the function so it doesn't overload the server

      const finishPopulate = () => {
        this.populating = false;
      };
      setTimeout(finishPopulate, 2000);

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "", "error", true);
        return;
      }
      if (!response.success) return;

      this.prePopulate = response.formValues;

      const IDS = this.getChildIDS();
      const dateRangeEvent = new CustomEvent("uipress/app/forms/change", {
        detail: { formData: this.prePopulate, IDS: IDS },
      });

      document.dispatchEvent(dateRangeEvent);
    },

    /**
     * Returns all children IDS for group date event change
     *
     * @since 3.2.0
     */
    getChildIDS() {
      const RecursiveHandler = (blocks) => {
        if (!Array.isArray(blocks)) return [];
        let IDs = [];

        for (let block of blocks) {
          IDs.push(block.uid);
          if (!Array.isArray(block.content)) continue;
          IDs = [...IDs, ...RecursiveHandler(block.content)];
        }

        return IDs;
      };

      // No children so return empty array
      if (!this.block.content.length) return [];

      return RecursiveHandler(this.block.content);
    },

    /**
     * Handles submit action
     *
     * @since 3.2.13
     */
    onSubmit() {
      const data = new FormData(this.$refs.form);
      let formattedData = {};

      // Build formatted data
      for (const [key, value] of data) {
        formattedData[key] = value;
      }

      // Get form submit action
      const formOptions = this.get_block_option(this.block, "block", "submitAction");
      const errorMessage = () => {
        this.uipApp.notifications.notify(__("Configuration error", "uipress-lite"), __("No php function supplied to send form data to", "uipress-lite"), "error");
      };

      switch (formOptions.action) {
        // Handle PHP submit
        case "phpFunction":
          if (!formOptions.phpFunction) return errorMessage();
          this.processPHPfunction(formattedData, formOptions.phpFunction);
          break;

        // Handle Email submit
        case "email":
          if (!formOptions.emailAddress) return errorMessage();
          this.processEmail(formattedData, formOptions);
          break;

        // Handle site option form
        case "siteOption":
          if (!formOptions.siteOptionName) return errorMessage();
          this.processSaveAsSiteOption(formattedData, formOptions);
          break;

        // Handle site option form
        case "userMeta":
          if (!formOptions.objectOrSingle) return errorMessage();
          if (!formOptions.objectOrSingle == "object" || formOptions.userMetaObjectKey == "") return errorMessage();
          this.processSaveAsUserOption(formattedData, formOptions);
          break;
      }
    },

    /**
     * Handles redirect after form submit
     *
     * @since 3.2.13
     */
    handleRedirect() {
      const formOptions = this.get_block_option(this.block, "block", "submitAction");
      const redirectURL = this.hasNestedPath(formOptions, "redirectURL", "value");
      const redirectType = this.hasNestedPath(formOptions, "redirectURL", "newTab");

      // No redirect so exit early
      if (!redirectURL) return;

      // Dynamic redirect / update frame
      if (redirectType == "" || redirectType == "dynamic") {
        this.updateAppPage(redirectURL);
        return;
      }

      // New tab redirect
      if (redirectType == "newTab") {
        this.$refs.hiddenlink.href = redirectURL;
        this.$refs.hiddenlink.click();
      }

      // Default window behaviour
      if (redirectType == "default") {
        window.location.assign(redirectURL);
      }
    },

    /**
     * Processes save as user submit
     *
     * @param {Object} data - form data
     * @param {Object} formOptions - the form options
     * @since 3.2.13
     */
    async processSaveAsUserOption(data, formOptions) {
      const formatted = JSON.stringify(data);
      this.loading = true;

      let formData = new FormData();
      formData.append("action", "uip_save_form_as_user_option");
      formData.append("security", uip_ajax.security);
      formData.append("formData", formatted);
      formData.append("objectOrSingle", formOptions.objectOrSingle);
      formData.append("userMetaObjectKey", formOptions.userMetaObjectKey);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);
      this.loading = false;

      // Handle error state
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "", "error", true);
        return;
      }
      if (!response.success) {
        return;
      }

      this.handleRedirect();
      this.formSuccess = true;

      const finishForm = () => {
        this.formSuccess = false;
      };
      setTimeout(finishForm, 10000);
    },

    /**
     * Processes save as site submit
     *
     * @param {Object} data - form data
     * @param {Object} formOptions - the form options
     * @since 3.2.13
     */
    async processSaveAsSiteOption(data, formOptions) {
      const formatted = JSON.stringify(data);
      this.loading = true;

      let formData = new FormData();
      formData.append("action", "uip_save_form_as_option");
      formData.append("security", uip_ajax.security);
      formData.append("formData", formatted);
      formData.append("optionKey", formOptions.siteOptionName);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);
      this.loading = false;

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "", "error", true);
        return;
      }
      if (!response.success) {
        return;
      }

      this.handleRedirect();
      this.formSuccess = true;

      const finishForm = () => {
        this.formSuccess = false;
      };
      setTimeout(finishForm, 10000);
    },

    /**
     * Processes form as email submit
     *
     * @param {Object} data - form data
     * @param {Object} formOptions - the form options
     * @since 3.2.13
     */
    async processEmail(data, formOptions) {
      const formatted = JSON.stringify(data);
      this.loading = true;

      let formData = new FormData();
      formData.append("action", "uip_send_form_email");
      formData.append("security", uip_ajax.security);
      formData.append("formData", formatted);
      formData.append("emailTo", formOptions.emailAddress);
      formData.append("emailSubject", formOptions.emailSubject);
      formData.append("emailTemplate", formOptions.emailTemplate);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);
      this.loading = false;

      // Catch error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "", "error", true);
        return;
      }

      if (!response.success) {
        return;
      }

      this.handleRedirect();
      this.formSuccess = true;

      // Reset form
      this.$refs.form.reset();
      const finishForm = () => {
        this.formSuccess = false;
      };
      setTimeout(finishForm, 10000);
    },

    /**
     * Processes form as php function
     *
     * @param {Object} data - form data
     * @param {String} userFunction - the form options
     * @since 3.2.13
     */
    async processPHPfunction(data, userFunction) {
      const formatted = JSON.stringify(data);
      this.loading = true;

      let formData = new FormData();
      formData.append("action", "uip_process_form_input");
      formData.append("security", uip_ajax.security);
      formData.append("formData", formatted);
      formData.append("userFunction", userFunction);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);
      this.loading = false;

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "", "error", true);
        return;
      }

      if (!response.success) {
        return;
      }

      this.handleRedirect();
      this.formSuccess = true;

      // Reset form
      this.$refs.form.reset();
      const finishForm = () => {
        this.formSuccess = false;
      };
      setTimeout(finishForm, 10000);
    },
  },
  template: `
    
      <div class="uip-position-relative">
      
        <div v-if="formSuccess" class="uip-padding-xxs uip-border-round uip-background-green-wash uip-text-green uip-text-bold uip-margin-bottom-s uip-scale-in-top" v-html="getSuccessMessage"></div>
        
        <div class="uip-ajax-loader" v-if="loading">
          <div class="uip-loader-bar"></div>
        </div>
        
        <form ref="form" class="uip-form-area uip-body-font" @submit.prevent="onSubmit()">
          <uip-content-area 
          :content="block.content" :returnData="function(data) {block.content = data}"/>
          <input type="submit" class="uip-button-primary uip-submit-button uip-body-font" :value="getSubmitValue"/>
        </form>
        
        <a ref="hiddenlink" target="_BLANK" class="uip-hidden"></a>
        
      </div>
      
      `,
};
