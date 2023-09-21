export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: [String, Number],
      placeHolder: String,
      customStep: [String, Number],
    },
    data: function () {
      return {
        option: this.value,
        step: 1,
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
    created: function () {
      if (this.customStep) {
        this.step = this.customStep;
      }
    },
    template: `
      
      
      <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center uip-w-100p">
      
        <input  type="number" class="uip-input-small uip-w-100p uip-flex-grow" v-model="option" :placeholder="placeHolder">
        
        <div class="uip-padding-xxxs uip-border-rounder uip-background-muted uip-flex uip-gap-xxs uip-no-text-select">
          <div class="uip-link-muted uip-icon uip-text-l" @click="option = +parseFloat(parseFloat(option) - step).toFixed( 2 )">remove</div>
          <div class="uip-border-right"></div>
          <div class="uip-link-muted uip-icon uip-text-l" @click="option = +parseFloat(parseFloat(option) + step).toFixed( 2 )">add</div>
        </div>
        
      </div>
      
      `,
  };
}
