export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: [Object, String, Boolean],
      args: Object,
    },
    data: function () {
      return {
        option: {
          value: false,
        },
        options: {},
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
    inject: ['uipress'],
    mounted: function () {
      this.formatInput(this.value);
      this.formatArgs(this.value);
    },
    computed: {
      enabledDisabled() {
        return {
          true: {
            value: true,
            label: __('Disabled', 'uipress-lite'),
          },
          false: {
            value: false,
            label: __('Enabled', 'uipress-lite'),
          },
        };
      },
      yesNo() {
        return {
          false: {
            value: false,
            label: __('Disabled', 'uipress-lite'),
          },
          true: {
            value: true,
            label: __('Enabled', 'uipress-lite'),
          },
        };
      },
      hideShow() {
        return {
          false: {
            value: false,
            label: __('Show', 'uipress-lite'),
          },
          true: {
            value: true,
            label: __('Hide', 'uipress-lite'),
          },
        };
      },
      returnOptions() {
        return this.options;
      },
    },
    methods: {
      formatArgs() {
        if (this.uipress.isObject(this.args)) {
          if ('type' in this.args) {
            if (this.args.type == 'enabledDisabled') {
              this.options = this.enabledDisabled;
            }
            if (this.args.type == 'hideShow') {
              this.options = this.hideShow;
            }
            return;
          }
          if ('options' in this.args) {
            this.options = this.args.options;
            return;
          }
        }

        this.options = this.yesNo;
      },
      formatInput(value) {
        if (typeof value === 'undefined') {
          return;
        }
        if (this.uipress.isObject(value)) {
          this.option = { ...this.option, ...value };
          return;
        }
        if (value == true) {
          this.option.value = true;
        }
        if (value == false) {
          this.option.value = false;
        }
      },
    },
    template: `
    <div class="uip-flex uip-w-100p">
      <toggle-switch :options="returnOptions" :activeValue="option.value" :returnValue="function(data){ option.value = data}"></toggle-switch>
    </div>
    `,
  };
}
