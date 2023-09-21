export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: [Boolean, String],
      args: Object,
    },
    inject: ['uipress'],
    data: function () {
      return {
        option: this.value,
        yesNoOptions: {
          false: {
            value: false,
            label: __('No', 'uipress-lite'),
          },
          true: {
            value: true,
            label: __('Yes', 'uipress-lite'),
          },
        },
      };
    },
    created: function () {
      if (this.uipress.isObject(this.args)) {
        if ('options' in this.args) {
          this.yesNoOptions = this.args.options;
        }
      }
    },
    mounted: function () {},
    watch: {
      option: {
        handler(newValue, oldValue) {
          console.log(this.option);
          this.returnData(this.option);
        },
      },
    },
    computed: {
      asText() {
        if (this.uipress.isObject(this.args)) {
          if ('asText' in this.args) {
            return true;
          }
        }
        return false;
      },
    },
    template: `
    <toggle-switch v-if="asText" :options="yesNoOptions" :activeValue="option" :returnValue="function(data){ option = data}"></toggle-switch>
    <label v-else class="uip-switch">
      <input type="checkbox" v-model="option">
      <span class="uip-slider"></span>
    </label>`,
  };
}
