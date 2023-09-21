export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: [String, Object],
      args: Object,
    },
    data: function () {
      return {
        option: this.value,
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
    methods: {
      logChange() {
        this.returnData(this.option);
      },
    },
    template: `
    <div class="uip-flex uip-w-100p">
      <select @change="logChange()" class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p uip-w-100p" 
      style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large);" v-model="option">
        <template v-for="item in args.options">
          <option :value="item.value">{{item.label}}</option>
        </template>
      </select>
    </div>`,
  };
}
