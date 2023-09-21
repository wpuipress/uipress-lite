export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: String,
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
    template: '<div class="uip-flex">\
      <toggle-switch :options="option.options" :activeValue="option.value" :returnValue="function(data){ option.value = data}"></toggle-switch>\
    </div>',
  };
}
