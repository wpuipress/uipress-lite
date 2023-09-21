const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: String,
    },
    data: function () {
      return {
        option: this.value,
        strings: {
          pixels: __('Pixels', 'uipress-lite'),
          percentage: __('Percent', 'uipress-lite'),
          points: __('Points', 'uipress-lite'),
          fontSize: __('Font size', 'uipress-lite'),
          rootFontSize: __('Root font size', 'uipress-lite'),
          viewportHeight: __('Viewport height', 'uipress-lite'),
          dviewportHeight: __('Dynamic Viewport height', 'uipress-lite'),
          viewportWidth: __('Viewport width', 'uipress-lite'),
          auto: __('auto', 'uipress-lite'),
        },
      };
    },
    watch: {
      option: {
        handler(newValue, oldValue) {
          this.returnData(this.option);
        },
        deep: true,
      },
      value: {
        handler(newValue, oldValue) {
          this.option = newValue;
        },
        deep: true,
      },
    },
    mounted: function () {
      if (!this.option || this.option == '') {
        this.option = 'px';
      }
    },
    methods: {},
    template: `<div class="uip-flex">
        <dropdown pos="bottom right">
          <template v-slot:trigger>
            <div class="uip-padding-xxs uip-text-s uip-text-muted uip-min-w-18 uip-text-center">{{option}}</div>
          </template>
          <template v-slot:content>
            <div class="uip-flex uip-flex-column uip-flex-left uip-text-s uip-padding-xs  uip-row-gap-xxs">
              <div class="uip-link-muted" @click="option = 'px'" :class="{'uip-text-emphasis' : option == 'px'}">{{strings.pixels}} (px)</div>
              <div class="uip-link-muted" @click="option = 'pt'" :class="{'uip-text-emphasis' : option == 'pt'}">{{strings.points}} (pt)</div>
              <div class="uip-link-muted" @click="option = '%'" :class="{'uip-text-emphasis' : option == '%'}">{{strings.percentage}} (%)</div>
              <div class="uip-border-top"></div>
              <div class="uip-link-muted" @click="option = 'em'" :class="{'uip-text-emphasis' : option == 'em'}">{{strings.fontSize}} (em)</div>
              <div class="uip-link-muted" @click="option = 'rem'" :class="{'uip-text-emphasis' : option == 'rem'}">{{strings.rootFontSize}} (rem)</div>
              <div class="uip-border-top"></div>
              <div class="uip-link-muted" @click="option = 'vh'" :class="{'uip-text-emphasis' : option == 'vh'}">{{strings.viewportHeight}} (vh)</div>
              <div class="uip-link-muted" @click="option = 'dvh'" :class="{'uip-text-emphasis' : option == 'dvh'}">{{strings.dviewportHeight}} (dvh)</div>
              <div class="uip-link-muted" @click="option = 'vw'" :class="{'uip-text-emphasis' : option == 'vw'}">{{strings.viewportWidth}} (vw)</div>
              <div class="uip-border-top"></div>
              <div class="uip-link-muted" @click="option = 'auto'" :class="{'uip-text-emphasis' : option == 'vw'}">{{strings.auto}}</div>
            </div>
          </template>
        </dropdown>
      </div>`,
  };
}
