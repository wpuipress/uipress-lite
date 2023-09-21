const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: [String, Object],
      args: Object,
    },
    inject: ['uipress'],
    data: function () {
      return {
        option: this.value,
        menus: [],
        strings: {
          none: __('None', 'uipress-lite'),
        },
      };
    },
    watch: {
      option: {
        handler(newValue, oldValue) {
          this.returnData(newValue);
        },
        deep: true,
      },
      value: {
        handler(newValue, oldValue) {
          this.option = this.value;
        },
        deep: true,
      },
    },
    created: function () {
      this.maybeGetMenus();
    },
    methods: {
      logChange() {
        this.returnData(this.option);
      },
      maybeGetMenus() {
        let self = this;
        if (this.menus.length > 0) {
          return;
        }

        //Build form data for fetch request
        let formData = new FormData();
        formData.append('action', 'uip_get_all_custom_menus');
        formData.append('security', uip_ajax.security);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          if (response.error) {
            self.uipress.notify(response.message, '', 'error', true);
            return;
          }

          self.menus = response.menus;
          return;
        });
      },
    },
    template: `
    <div class="uip-flex uip-w-100p">
      <select @change="logChange()" class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p uip-w-100p" 
      style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large);" v-model="option">
        <option value="none">{{strings.none}}</option>
        <template v-for="item in menus">
          <option :value="item.id">{{item.name}} | id: {{item.id}}</option>
        </template>
      </select>
    </div>`,
  };
}
