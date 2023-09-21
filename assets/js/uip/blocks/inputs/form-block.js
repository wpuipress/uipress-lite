const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
      contextualData: Object,
    },
    data: function () {
      return {
        formSuccess: false,
        contextData: this.contextualData,
        loading: false,
        prePopulate: [],
        populating: false,
        strings: {
          submit: __('Submit', 'uipress-lite'),
        },
      };
    },
    inject: ['uipData', 'uipress', 'uiTemplate'],
    watch: {
      'block.settings.block.options': {
        handler(newValue, oldValue) {
          if (this.uipress.enviroment && this.uipress.enviroment == 'builder') {
            this.getPrepopulate();
          }
        },
        deep: true,
      },
      'block.content': {
        handler(newValue, oldValue) {
          if (this.uipress.enviroment && this.uipress.enviroment == 'builder') {
            this.getPrepopulate();
          }
        },
        deep: true,
      },
    },
    mounted: function () {
      this.getPrepopulate();
    },
    computed: {
      getSubmitValue() {
        let item = this.uipress.get_block_option(this.block, 'block', 'submitText', true);
        if (!item) {
          return '';
        }
        if (this.uipress.isObject(item)) {
          if ('string' in item) {
            return item.string;
          } else {
            return '';
          }
        }
        return item;
      },
      getSuccessMessage() {
        let text = this.uipress.get_block_option(this.block, 'block', 'successMessage');
        return text;
      },
      returnFormData() {
        if (typeof this.contextData === 'undefined') {
          this.contextData = {};
          this.contextData.formData = {};
          return this.contextData;
        }
        if (!this.uipress.isObject(this.contextData)) {
          this.contextData = {};
          this.contextData.formData = {};
          return this.contextData;
        }
        if (!('formData' in this.contextData)) {
          this.contextData.formData = {};
          return this.contextData;
        }
        return this.contextData;
      },
    },
    methods: {
      //Fetches data to populate the forms input
      getPrepopulate() {
        let self = this;
        let formOptions = this.uipress.get_block_option(this.block, 'block', 'submitAction');

        //Nothing to prepopulate
        if (formOptions.action == 'email' || formOptions.action == 'phpFunction') {
          self.prePopulate = [];
          return;
        }

        if (!this.uipress.get_block_option(this.block, 'block', 'prePopulate')) {
          self.prePopulate = false;
          return;
        }
        //Currently fetching data
        if (this.populating) {
          return;
        }

        self.populating = true;
        let formKeys = [];
        let data = new FormData(this.$refs.form);
        for (const [key, value] of data) {
          formKeys.push(key);
        }

        //Only populate if we have keys
        if (formKeys.length < 1) {
          return;
        }

        let formData = new FormData();
        formData.append('action', 'uip_pre_populate_form_data');
        formData.append('security', uip_ajax.security);
        formData.append('formKeys', JSON.stringify(formKeys));
        formData.append('saveType', formOptions.action);
        formData.append('objectOrSingle', formOptions.objectOrSingle);
        formData.append('userMetaObjectKey', formOptions.userMetaObjectKey);
        formData.append('siteOptionName', formOptions.siteOptionName);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          //Delay the the function so it doesn't overload the server
          setTimeout(function () {
            self.populating = false;
          }, 2000);
          if (response.error) {
            self.uipress.notify(response.message, '', 'error', true);
            return;
          }
          if (response.success) {
            self.prePopulate = response.formValues;
            if (typeof self.contextData === 'undefined') {
              return;
              self.contextData = {};
            }
            if (!self.uipress.isObject(self.contextData)) {
              return;
              self.contextData = {};
            }
            self.contextData.formData = self.prePopulate;
          }
        });
      },
      onSubmit() {
        let data = new FormData(this.$refs.form);
        let formattedData = {};

        for (const [key, value] of data) {
          formattedData[key] = value;
        }

        let formOptions = this.uipress.get_block_option(this.block, 'block', 'submitAction');

        if (formOptions.action == 'phpFunction') {
          if (!formOptions.phpFunction || formOptions.phpFunction == '') {
            this.uipress.notify(__('Configuration error', 'uipress-lite'), __('No php function supplied to send form data to', 'uipress-lite'), 'error');
            return;
          } else {
            this.processPHPfunction(formattedData, formOptions.phpFunction);
          }
        }

        if (formOptions.action == 'email') {
          if (!formOptions.emailAddress || formOptions.emailAddress == '') {
            this.uipress.notify(__('Configuration error', 'uipress-lite'), __('No email supplied to send form data to', 'uipress-lite'), 'error');
            return;
          } else {
            this.processEmail(formattedData, formOptions);
          }
        }

        if (formOptions.action == 'siteOption') {
          if (!formOptions.siteOptionName || formOptions.siteOptionName == '') {
            this.uipress.notify(__('Configuration error', 'uipress-lite'), __('No site option name supplied to save as', 'uipress-lite'), 'error');
            return;
          } else {
            this.processSaveAsSiteOption(formattedData, formOptions);
          }
        }

        if (formOptions.action == 'userMeta') {
          if (!formOptions.objectOrSingle || formOptions.objectOrSingle == '') {
            this.uipress.notify(__('Configuration error', 'uipress-lite'), __('You have not specified how to save the data to the user meta', 'uipress-lite'), 'error');
            return;
          }

          if (formOptions.objectOrSingle == 'object' && formOptions.userMetaObjectKey == '') {
            this.uipress.notify(__('Configuration error', 'uipress-lite'), __('You need to specifiy a meta key to save the meta data to', 'uipress-lite'), 'error');
            return;
          }

          this.processSaveAsUserOption(formattedData, formOptions);
        }
      },
      handleRedirect() {
        let self = this;
        let formOptions = this.uipress.get_block_option(this.block, 'block', 'submitAction');

        if (formOptions.redirectURL.value == '') {
          return;
        }

        let redirectURL = formOptions.redirectURL;

        if (redirectURL.dynamic) {
          if (self.uipData.dynamicOptions[redirectURL.dynamicKey]) {
            redirectURL = self.uipData.dynamicOptions[redirectURL.dynamicKey].value;
          }
        } else {
          redirectURL = redirectURL.value;
        }

        if (typeof redirectURL === 'undefined') {
          return;
        }

        let type = formOptions.redirectURL.newTab;

        if (type == '' || type == 'dynamic') {
          this.uipress.updatePage(redirectURL);
        }

        if (type == 'newTab') {
          this.$refs.hiddenlink.href = redirectURL;
          this.$refs.hiddenlink.click();
        }

        if (type == 'default') {
          window.location.assign(redirectURL);
        }
      },
      processSaveAsUserOption(data, formOptions) {
        let self = this;
        let formatted = JSON.stringify(data);
        self.loading = true;

        let formData = new FormData();
        formData.append('action', 'uip_save_form_as_user_option');
        formData.append('security', uip_ajax.security);
        formData.append('formData', formatted);
        formData.append('objectOrSingle', formOptions.objectOrSingle);
        formData.append('userMetaObjectKey', formOptions.userMetaObjectKey);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          self.loading = false;
          if (response.error) {
            self.uipress.notify(response.message, '', 'error', true);
            return;
          }
          if (response.success) {
            self.handleRedirect();
            self.formSuccess = true;
            //this.$refs.form.reset();
            setTimeout(function () {
              self.formSuccess = false;
            }, 10000);
          }
        });
      },
      processSaveAsSiteOption(data, formOptions) {
        let self = this;
        let formatted = JSON.stringify(data);
        self.loading = true;

        let formData = new FormData();
        formData.append('action', 'uip_save_form_as_option');
        formData.append('security', uip_ajax.security);
        formData.append('formData', formatted);
        formData.append('optionKey', formOptions.siteOptionName);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          self.loading = false;
          if (response.error) {
            self.uipress.notify(response.message, '', 'error', true);
            return;
          }
          if (response.success) {
            self.handleRedirect();
            self.formSuccess = true;
            //this.$refs.form.reset();
            setTimeout(function () {
              self.formSuccess = false;
            }, 10000);
          }
        });
      },
      processEmail(data, formOptions) {
        let self = this;
        let formatted = JSON.stringify(data);
        self.loading = true;

        let formData = new FormData();
        formData.append('action', 'uip_send_form_email');
        formData.append('security', uip_ajax.security);
        formData.append('formData', formatted);
        formData.append('emailTo', formOptions.emailAddress);
        formData.append('emailSubject', formOptions.emailSubject);
        formData.append('emailTemplate', formOptions.emailTemplate);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          self.loading = false;
          if (response.error) {
            self.uipress.notify(response.message, '', 'error', true);
            return;
          }
          if (response.success) {
            self.handleRedirect();
            self.formSuccess = true;
            self.$refs.form.reset();
            setTimeout(function () {
              self.formSuccess = false;
            }, 10000);
          }
        });
      },
      processPHPfunction(data, userFunction) {
        let self = this;
        let formatted = JSON.stringify(data);
        self.loading = true;

        let formData = new FormData();
        formData.append('action', 'uip_process_form_input');
        formData.append('security', uip_ajax.security);
        formData.append('formData', formatted);
        formData.append('userFunction', userFunction);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          self.loading = false;
          if (response.error) {
            self.uipress.notify(response.message, '', 'error', true);
            return;
          }
          if (response.success) {
            self.handleRedirect();
            self.formSuccess = true;
            self.$refs.form.reset();
            setTimeout(function () {
              self.formSuccess = false;
            }, 10000);
          }
        });
      },
      returnClasses() {
        let classes = '';

        let advanced = this.uipress.get_block_option(this.block, 'advanced', 'classes');
        classes += advanced;
        return classes;
      },
    },
    template:
      '\
      <div :class="returnClasses()" :id="block.uid">\
        <div v-if="formSuccess" class="uip-padding-xxs uip-border-round uip-background-green-wash uip-text-green uip-text-bold uip-margin-bottom-s uip-scale-in-top" v-html="getSuccessMessage"></div>\
        <div class="uip-ajax-loader" v-if="loading">\
          <div class="uip-loader-bar"></div>\
        </div>\
        <form ref="form" class="uip-form-area uip-body-font" @submit.prevent="onSubmit()">\
          <uip-content-area :contextualData="returnFormData"\
          :content="block.content" :returnData="function(data) {block.content = data} " layout="vertical" ></uip-content-area>\
          <input type="submit" class="uip-button-primary uip-submit-button uip-body-font" :value="getSubmitValue"/>\
        </form>\
        <a ref="hiddenlink" target="_BLANK" class="uip-hidden"></a>\
      </div>',
  };
}
