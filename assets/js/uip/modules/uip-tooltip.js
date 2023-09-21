export function moduleData() {
  return {
    props: {
      message: String,
      delay: Number,
      containerClass: String,
    },
    data: function () {
      return {
        showTip: false,
        tipDisplayed: false,
      };
    },
    computed: {},
    mounted: function () {},
    methods: {
      setPosition() {
        self = this;

        if (self.$el == null) {
          return;
        }

        let content = self.$refs.tiptrigger;

        let bottomoftrigger = content.getBoundingClientRect().bottom;
        let triggerHalfWidth = content.getBoundingClientRect().width / 2;

        let POStop = bottomoftrigger + 10;
        let POSLeft = self.$el.getBoundingClientRect().left;

        let style = '';
        style += 'top:' + POStop + 'px;';
        style += 'left:' + (POSLeft + triggerHalfWidth) + 'px;';
        style += 'transform:' + 'translateX(-50%);';
        return style;
      },
      justTheTip() {
        let self = this;
        self.showTip = true;
        setTimeout(function () {
          if (self.showTip == false) {
            self.tipDisplayed = false;
            return;
          }
          self.tipDisplayed = true;
        }, self.delay);
      },
      hideTip() {
        let self = this;
        self.showTip = false;
        self.tipDisplayed = false;
      },
    },
    template: `
      <div :class="containerClass" @mouseover="justTheTip()" @mouseleave="hideTip()" ref="tiptrigger">
		    <slot></slot>
        <template v-if="message && message != ''">
		      <div v-if="tipDisplayed" :style="setPosition()" class="uip-tooltip" ref="dynamictip">
          {{message}}
          </div>
        </template>
	    </div>`,
  };
}
