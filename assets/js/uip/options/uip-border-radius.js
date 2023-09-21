const { __, _x, _n, _nx } = wp.i18n;

export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: Array,
    },
    data: function () {
      return {
        borderradius: this.value,
        strings: {
          borderRadiusTopLeft: __("Radius top left", "uipress-lite"),
          borderRadiusTopRight: __("Radius  top right", "uipress-lite"),
          borderRadiusBottomLeft: __("Radius bottom left", "uipress-lite"),
          borderRadiusBottomRight: __("Radius bottom right", "uipress-lite"),
        },
      };
    },
    inject: ["uipData"],
    watch: {
      "borderradius.left": {
        handler(newValue, oldValue) {
          let self = this;

          if (self.borderradius.sync == true) {
            self.borderradius.right.value = newValue.value;
            self.borderradius.right.units = newValue.units;
            self.borderradius.top.value = newValue.value;
            self.borderradius.top.units = newValue.units;
            self.borderradius.bottom.value = newValue.value;
            self.borderradius.bottom.units = newValue.units;
          }

          self.returnData(self.borderradius);
        },
        deep: true,
      },
    },
    template:
      '<div class="uip-flex uip-flex-column uip-row-gap-xs">\
        <div class="uip-grid-small uip-flex uip-flex-wrap uip-row-gap-xxs ">\
          <template v-if="borderradius.sync">\
            <div class="">\
              <div class="uip-flex">\
                <value-units :value="borderradius.left" :returnData="function(data){borderradius.left = data}"></value-units>\
                <div class="uip-padding-xxxs uip-border-round uip-background-muted hover:uip-background-grey uip-cursor-pointer uip-flex uip-flex-middle uip-flex-center"\
                @click="borderradius.sync = !borderradius.sync">\
                  <span v-if="borderradius.sync" class="uip-icon">link</span>\
                </div>\
              </div>\
            </div>\
          </template>\
          <template v-if="!borderradius.sync">\
            <div class="uip-width-medium">\
              <div class="uip-text-s uip-text-muted uip-margin-bottom-xxs uip-flex uip-gap-xxs">\
                <span>{{strings.borderRadiusTopLeft}}</span><span class="uip-icon uip-cursor-pointer" @click="borderradius.sync = !borderradius.sync">link_off</span>\
              </div>\
              <value-units :value="borderradius.left" :returnData="function(data){borderradius.left = data}"></value-units>\
            </div>\
            <div class="uip-width-medium">\
              <div class="uip-text-s uip-text-muted uip-margin-bottom-xxs uip-flex uip-gap-xxs">\
                <span>{{strings.borderRadiusTopRight}}</span><span class="uip-icon uip-cursor-pointer" @click="borderradius.sync = !borderradius.sync">link_off</span>\
              </div>\
              <value-units :value="borderradius.right" :returnData="function(data){borderradius.right = data}"></value-units>\
            </div>\
            <div class="uip-width-medium">\
              <div class="uip-text-s uip-text-muted uip-margin-bottom-xxs uip-flex uip-gap-xxs">\
                <span>{{strings.borderRadiusBottomLeft}}</span><span class="uip-icon uip-cursor-pointer" @click="borderradius.sync = !borderradius.sync">link_off</span>\
              </div>\
              <value-units :value="borderradius.top" :returnData="function(data){borderradius.top = data}"></value-units>\
            </div>\
            <div class="uip-width-medium">\
              <div class="uip-text-s uip-text-muted uip-margin-bottom-xxs uip-flex uip-gap-xxs">\
                <span>{{strings.borderRadiusBottomRight}}</span><span class="uip-icon uip-cursor-pointer" @click="borderradius.sync = !borderradius.sync">link_off</span>\
              </div>\
              <value-units :value="borderradius.bottom" :returnData="function(data){borderradius.bottom = data}"></value-units>\
            </div>\
          </template>\
        </div>\
    </div>',
  };
}
