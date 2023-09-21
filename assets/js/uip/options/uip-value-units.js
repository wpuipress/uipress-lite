export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: Object,
    },
    data: function () {
      return {
        option: {
          value: '',
          units: 'px',
        },
        focus: false,
        rendered: false,
      };
    },
    inject: ['uipress'],
    watch: {
      option: {
        handler(newValue, oldValue) {
          if (!this.rendered) {
            return;
          }
          if (newValue.units == 'auto') {
            this.returnData({ value: ' ', units: 'auto' });
          } else {
            this.returnData(newValue);
          }
        },
        deep: true,
      },
      value: {
        handler(newValue, oldValue) {
          if (JSON.stringify(newValue) != JSON.stringify(this.option)) {
            this.formatValue(this.value);
          }
        },
        deep: true,
      },
    },
    mounted: function () {
      this.formatValue(this.value);
    },
    computed: {
      returnOption() {
        this.formatValue(this.value);
        return this.option;
      },
      returnUnits() {
        return this.option.units;
      },
    },
    methods: {
      formatValue(item) {
        if (this.uipress.isObject(item)) {
          this.option = { ...this.option, ...item };
        }
        this.$nextTick(() => {
          this.rendered = true;
        });
      },
    },
    template: `
    <div v-if="rendered" class="uip-flex uip-background-muted uip-border-rounder uip-padding-left-xs uip-flex-content-stretch uip-w-100p" :class="{'uip-active-outline' : focus}">
      <input v-if="option.units != 'auto'" @focus="focus = true" @blur="focus = false" style="width:30px" type="text" class="uip-input-small uip-blank-input uip-remove-steps uip-background-remove uip-padding-xxxs uip-flex-grow" v-model="option.value">
      <units-select :value="returnUnits" :returnData="function(e){option.units = e}" :class=" option.units == 'auto' ? 'uip-flex-grow' : '' "></units-select>
    </div>`,
  };
}
