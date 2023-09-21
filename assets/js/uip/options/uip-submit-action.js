const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: Object,
    },
    data: function () {
      return {
        option: this.value,
        submitOptions: [
          {
            label: __('Email', 'uipress-lite'),
            name: 'email',
          },
          {
            label: __('Save as site option', 'uipress-lite'),
            name: 'siteOption',
          },
          {
            label: __('Save as user meta', 'uipress-lite'),
            name: 'userMeta',
          },
          {
            label: __('Send to PHP function', 'uipress-lite'),
            name: 'phpFunction',
          },
        ],
        userMetaOptions: [
          {
            label: __('Individual keys', 'uipress-lite'),
            name: 'single',
          },
          {
            label: __('Group object', 'uipress-lite'),
            name: 'object',
          },
        ],
        strings: {
          pixels: __('Pixels', 'uipress-lite'),
          submitType: __('Submit type', 'uipress-lite'),
          functionName: __('PHP function', 'uipress-lite'),
          siteOptionName: __('Option name', 'uipress-lite'),
          recipientEmail: __('Recipient email', 'uipress-lite'),
          emailSubject: __('Email subject', 'uipress-lite'),
          emailTemplate: __('Email template', 'uipress-lite'),
          templateDescription: __('Use form values in the email template by using {{meta_keys}} set inside from input blocks', 'uipress-lite'),
          siteOptionDescription: __(
            "The form data will be saved as an object to your database using the function update_site_option(). You will then be able to access your data using the function get_site_option('your_option_key')",
            'uipress-lite'
          ),
          saveAs: __('Save as', 'uipress-lite'),
          metaKey: __('Meta key', 'uipress-lite'),
          redirectAfterSubmission: __('Submission redirect', 'uipress-lite'),
          action: __('Action', 'uipress-lite'),
        },
      };
    },
    watch: {
      option: {
        handler(newValue, oldValue) {
          this.returnData(this.option);
        },
        deep: true,
      },
    },
    methods: {},
    template: `
      <div class="uip-flex uip-flex-column uip-row-gap-xs uip-w-100p">
        <!--Submit type -->
        
        
        <div class="uip-grid-col-1-3">
        
          <div class="uip-text-muted  uip-flex uip-gap-xxs uip-flex-center uip-text-s">{{strings.action}}</div>
          
          <select class="uip-input uip-padding-top-xxxs uip-padding-bottom-xxxs uip-w-100p" v-model="option.action">
            <template v-for="action in submitOptions">
              <option :value="action.name">{{action.label}}</option>
            </template>
          </select>
        
        </div>
            
        <!--PHP function name-->
        <div v-if="option.action == 'phpFunction'" class="uip-grid-col-1-3">
          <div class="uip-text-muted uip-text-s uip-flex uip-flex-center"><span>{{strings.functionName}}</span></div>
          <input type="text" class="uip-input" v-model="option.phpFunction">
        </div>
        
        
        
        <!--User meta-->
        <div v-if="option.action == 'userMeta'" class="uip-grid-col-1-3">
          <div class="uip-text-muted uip-text-s uip-flex uip-flex-center"><span>{{strings.saveAs}}</span></div>
          
          <div class="">
            <select class="uip-input uip-padding-top-xxxs uip-padding-bottom-xxxs uip-w-100p" v-model="option.objectOrSingle">
              <template v-for="action in userMetaOptions">
                <option :value="action.name">{{action.label}}</option>
              </template>
            </select>
          </div>
          
          <template v-if="option.objectOrSingle == 'object'">
            <div class="uip-text-muted uip-text-s">{{strings.metaKey}}</div>
            <div class="uip-margin-bottom-xs">
              <uip-input :value="option.userMetaObjectKey" :returnData="function(e){option.userMetaObjectKey = e}" :args="{metaKey: true}"></uip-input>
            </div>
          </template>
        </div>
        
        
        <!--Site option name-->
        <div v-if="option.action == 'siteOption'" class="uip-grid-col-1-3">
        
          <div class="uip-text-muted uip-flex uip-gap-xxs uip-flex-center">
          
            <span class="uip-text-s">{{strings.siteOptionName}}</span>
            <uip-tooltip :message="strings.siteOptionDescription" class="uip-inline-flex">
              <span class="uip-icon uip-border-circle uip-background-grey uip-cursor-pointer" style="font-size: 12px;">question_mark</span>
            </uip-tooltip>
            
          </div>
          
          <div class="">
            <uip-input :value="option.siteOptionName" :returnData="function(e){option.siteOptionName = e}" :args="{metaKey: true}"></uip-input>
          </div>
          
        </div>
        
        
        
        <!--Email options-->
        <template v-if="option.action == 'email'">
          <div class="uip-grid-col-1-3">
            <div class="uip-text-muted uip-margin-bottom-xx uip-text-s uip-flex uip-flex-center"><span>{{strings.recipientEmail}}</span></div>
            <div>
            <input type="email" class="uip-input" v-model="option.emailAddress">
            </div>
          </div>
          <div class="uip-grid-col-1-3">
            <div class="uip-text-muted  uip-text-s">{{strings.emailSubject}}</div>
            <input type="text" class="uip-input" v-model="option.emailSubject">
          </div>
          <div class="">
            <div class="uip-text-muted uip-margin-bottom-xs uip-flex uip-gap-xs uip-flex-center">
              <span class="uip-text-s">{{strings.emailTemplate}}</span>
              <uip-tooltip :message="strings.templateDescription">
                <span class="uip-icon uip-border-circle uip-background-grey uip-cursor-pointer" style="font-size: 12px;">question_mark</span>
              </uip-tooltip>
            </div>
            <div class="uip-margin-bottom-xs">
              <uip-paragraph-input :value="option.emailTemplate" :returnData="function(e) {option.emailTemplate = e}"></uip-paragraph-input>
            </div>
          </div>
        </template>
        
        <!--Redirect option-->
        <div class="uip-grid-col-1-3">
          <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">{{strings.redirectAfterSubmission}}</div>
          <div class="">
            <link-select :value="option.redirectURL" :returnData="function(e){option.redirectURL = e}" :args="{hideLinkType: true}"></link-select>
          </div>
        </div>
      </div>`,
  };
}
