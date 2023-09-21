export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: String,
      placeHolder: String,
      args: Object,
      size: String,
    },
    data: function () {
      return {
        option: this.value,
        password: false,
      };
    },

    watch: {
      option: {
        handler(newValue, oldValue) {
          this.returnData(this.option);

          if (!this.args) {
            return;
          }
          if (this.args.metaKey) {
            if (newValue) {
              let ammended = newValue;

              ammended = ammended.replace(' ', '_');
              ammended = ammended.replace(/[&/#,+()$~%.'":*?<>{}]/g, '');
              ammended = ammended.toLowerCase();

              this.option = ammended;
            }
          }
        },
        deep: true,
      },
    },
    mounted: function () {
      if (this.args) {
        if ('password' in this.args) {
          if (this.args.password) {
            this.password = true;
          }
        }
      }
    },
    computed: {
      returnType() {
        if (this.password) {
          return 'password';
        }
        return 'text';
      },
    },
    template: `
      <input :type="returnType" class="uip-input-small uip-w-100p" v-model="option" :placeholder="placeHolder" :class="{'uip-w-100' : size == 'xsmall'}">`,
  };
}
