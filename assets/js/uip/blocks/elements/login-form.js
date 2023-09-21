const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
    },
    data: function () {
      return {
        loading: true,
        loginForm: '',
      };
    },
    inject: ['uipData', 'uipress', 'uiTemplate'],
    watch: {},
    mounted: function () {
      this.buildLoginForm();
    },
    computed: {},
    methods: {
      returnClasses() {
        let classes = '';

        let advanced = this.uipress.get_block_option(this.block, 'advanced', 'classes');
        classes += advanced;
        return classes;
      },
      buildLoginForm() {
        let self = this;

        let formData = new FormData();
        formData.append('action', 'uip_get_login_form');
        formData.append('security', uip_ajax.security);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          if (response.error) {
            //self.uipress.notify(response.message, 'uipress-lite', '', 'error', true);
            //self.saving = false;
          }
          if (response.success) {
            self.loginForm = response.loginForm;
          }
        });
      },
    },
    template: `
      <div class="uip-w-100p"\
      :class="returnClasses()" :id="block.uid" v-html="loginForm">\
      </div>`,
  };
}
