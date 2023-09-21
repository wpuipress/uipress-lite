export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: String,
      placeHolder: String,
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
          this.returnData(this.option);
        },
        deep: true,
      },
    },
    template:
      '\
    <div class="uip-background-muted uip-border-round uip-overflow-hidden uip-colour-select uip-padding-xxs">\
      \
      <div class="uip-flex uip-flex-row uip-gap-xxs uip-flex-center">\
        <color-picker :value="option" :returnData="function(data){option = data}">\
          <template v-slot:trigger>\
               <div class="uip-border-round uip-w-18 uip-ratio-1-1 uip-border" :style="\'background-color:\' + option"></div>\
          </template>\
        </color-picker>\
        <input v-model="option" type="text" class="uip-blank-input uip-text-s" style="line-height:1.2em!important;">\
      </div>\
    \
    </div>',
  };
}
