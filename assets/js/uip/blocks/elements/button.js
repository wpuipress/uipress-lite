const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
    },
    data: function () {
      return {
        loading: true,
        dynamics: this.uipData.dynamicOptions,
      };
    },
    inject: ['uipData', 'uipress', 'uiTemplate'],
    watch: {},
    mounted: function () {},
    computed: {
      returnText() {
        let item = this.uipress.get_block_option(this.block, 'block', 'buttonText', true);
        if (!item) {
          return '';
        }
        if (this.uipress.isObject(item)) {
          if ('string' in item) {
            return item.string;
          } else {
            return '';
          }
        }
        return item;
      },
      getLink() {
        let src = this.uipress.get_block_option(this.block, 'block', 'linkSelect', true);
        if (this.uipress.isObject(src)) {
          return src.value;
        }
        return src;
      },
      getOnClickCode() {
        let code = this.uipress.get_block_option(this.block, 'block', 'onClickCode');
        return code;
      },
      getIcon() {
        let icon = this.uipress.get_block_option(this.block, 'block', 'iconSelect');
        if (!icon) {
          return '';
        }
        if ('value' in icon) {
          return icon.value;
        }
        return icon;
      },
      returnTarget() {
        if (this.returnLinkType == 'newTab') {
          return '_BLANK';
        }

        return '';
      },
      returnLinkType() {
        let srcOBJ = this.uipress.get_block_option(this.block, 'block', 'linkSelect');
        let newTab;
        if (this.uipress.isObject(srcOBJ)) {
          newTab = srcOBJ.newTab;
        }

        return newTab;
      },
    },
    methods: {
      returnClasses() {
        let classes = '';

        let posis = this.uipress.get_block_option(this.block, 'block', 'iconPosition');
        if (posis) {
          if (posis.value == 'right') {
            classes += 'uip-flex-reverse';
          }
        }
        return classes;
      },
      followLink(evt) {
        if (evt.ctrlKey || evt.shiftKey || evt.metaKey || (evt.button && evt.button == 1) || this.returnLinkType == 'newTab') {
          return;
        } else {
          evt.preventDefault();
        }

        let url = this.getLink;
        let type = this.returnLinkType;

        if (!url) {
          return;
        }

        if (type == 'dynamic') {
          this.uipress.updatePage(url);
        }
        if (type == 'default') {
          window.location.replace(url);
        }
      },
      buildOnClick() {
        let textString = '';
        textString += 'document.getElementById("' + this.block.uid + '").addEventListener("click", function(){';
        textString += this.getOnClickCode;
        textString += '});';

        return textString;
      },
    },
    template: `
    
          <a :href="getLink" :target="returnTarget" class="uip-button-default uip-flex uip-gap-xxs uip-flex-center uip-no-underline"
          :class="returnClasses()" @click="followLink($event);" ref="newTab">
          
            <span class="uip-icon" v-if="getIcon">{{getIcon}}</span>
            <span class="uip-flex-grow" v-if="returnText != ''">{{returnText}}</span>
            
            <component v-if="getOnClickCode" is="script" scoped>
            
              {{buildOnClick()}}
            
            </component>
            
            
          </a>
          

          `,
  };
}
