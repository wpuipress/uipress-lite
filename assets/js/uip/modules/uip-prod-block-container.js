export function moduleData() {
  return {
    props: {
      display: String,
      block: Object,
      itemIndex: Number,
      currentContent: Array,
    },
    data: function () {
      return {
        hover: false,
        delay: 200,
        tips: [],
        windowWidth: window.innerWidth,
        blockStyles: '',
        darkTheme: this.uipData.userPrefs.darkTheme,
      };
    },
    inject: ['uipData', 'uiTemplate', 'router', 'uipress'],
    watch: {
      'uipData.userPrefs.darkTheme': {
        handler(newVal, oldVal) {
          this.darkTheme = newVal;
          this.updateBlockStyle();
        },
        deep: true,
      },
    },
    mounted: function () {
      let self = this;
      this.updateBlockStyle();
      window.addEventListener('resize', function () {
        self.windowWidth = window.innerWidth;
      });
    },
    computed: {
      getBlockStyles() {
        return this.updateBlockStyle();
      },
    },
    methods: {
      updateBlockStyle() {
        this.blockStyles = this.uipress.render_block_styles(this.block.settings, this.block.uid, this.darkTheme, this.windowWidth);
        return this.blockStyles;
      },
      ifHasCss() {
        if (this.block.settings.advanced) {
          if (this.block.settings.advanced.options.css) {
            if (this.block.settings.advanced.options.css.value) {
              return true;
            }
          }
        }
        return false;
      },
      ifHasJS() {
        if (this.block.settings.advanced) {
          if (this.block.settings.advanced.options.js) {
            if (this.block.settings.advanced.options.js.value) {
              return true;
            }
          }
        }
        return false;
      },
      removeTooltip() {
        let self = this;
        self.hover = false;

        for (const tip of this.tips) {
          tip.remove();
        }
        self.tips = [];
      },
      showTooltip() {
        let self = this;
        self.hover = true;
        if (!('tooltip' in this.block)) {
          return;
        }
        if (!('message' in this.block.tooltip)) {
          return;
        }
        if (this.block.tooltip.message == '') {
          return;
        }

        let tooltipContent = this.block.tooltip.message;

        let content = document.getElementById(self.block.uid);
        let position = 'bottom';
        if (content.getBoundingClientRect().bottom > window.innerHeight - 100) {
          position = 'top';
        }

        let tip = document.createElement('div');
        tip.classList.add('uip-tooltip');
        tip.classList.add('uip-fade-in');
        tip.classList.add('uip-hidden');

        if (position == 'top') {
          tip.classList.add('uip-tooltip-top');
        }

        tip.setAttribute('id', 'tooltip-' + self.block.uid);
        tip.innerHTML = tooltipContent;

        let thetip = document.body.appendChild(tip);

        self.tips.push(thetip);

        let topoftrigger = content.getBoundingClientRect().top;
        let bottomoftrigger = content.getBoundingClientRect().bottom;
        let triggerHalfWidth = content.getBoundingClientRect().width / 2;

        let POSbottom = window.innerHeight - topoftrigger + 10;
        let POStop = bottomoftrigger + 10;
        let POSLeft = content.getBoundingClientRect().left;

        if (position == 'bottom') {
          tip.style.top = POStop + 'px';
        } else {
          tip.style.bottom = POSbottom + 'px';
        }
        tip.style.left = POSLeft + triggerHalfWidth + 'px';
        tip.style.transform = 'translateX(-50%)';

        //Delay show
        self.delay = 200;
        if (this.block.tooltip.delay && Number.isInteger(parseInt(this.block.tooltip.delay))) {
          self.delay = this.block.tooltip.delay;
        }
        setTimeout(function () {
          //We are not hovering anymore so remove
          if (!self.hover) {
            let activeTip = document.getElementById('tooltip-' + self.block.uid);
            if (activeTip) {
              activeTip.remove();
            }
            return;
          }
          let created = document.getElementById('tooltip-' + self.block.uid);
          created.classList.remove('uip-hidden');
          //Delete after 5 seconds
          setTimeout(function () {
            self.removeTooltip();
          }, 3000);
        }, self.delay);
      },
      responsiveHidden(responsive) {
        if (typeof responsive === 'undefined') {
          return true;
        }
        let screenWidth = this.windowWidth;
        //Hidden on mobile
        if (responsive.mobile == true && screenWidth < 699) {
          return false;
        }
        //Hidden on tablet
        if (responsive.tablet == true && screenWidth < 990 && screenWidth >= 699) {
          return false;
        }
        //Hidden on desktop
        if (responsive.desktop == true && screenWidth > 990) {
          return false;
        }
        return true;
      },
    },
    template:
      '<div ref="container" v-if="responsiveHidden(block.responsive)"  class="uip-position-relative uip-inline-flex" :style="uipress.explodeBlockSettings(block.settings.container.options, \'style\', uipData.templateDarkMode)" :id="\'container-\' + block.uid" @mouseenter="showTooltip(block, block.uid)" @mouseleave="removeTooltip()" >\
        <component is="style" scoped>\
          {{getBlockStyles}}\
        </component>\
        <component is="style" v-if="ifHasCss()" scoped>{{block.settings.advanced.options.css.value}}</component>\
        <component is="script" scoped v-if="ifHasJS()">\
          {{block.settings.advanced.options.js.value}}\
        </component>\
	  		<slot></slot>\
		  </div>',
  };
}
