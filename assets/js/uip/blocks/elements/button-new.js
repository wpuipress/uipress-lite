const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
      contextualData: Object,
    },
    data: function () {
      return {
        loading: true,
        dynamics: this.uipData.dynamicOptions,
        forceFlex: false,
        showContent: false,
      };
    },
    inject: ['uipData', 'uipress', 'uiTemplate'],
    watch: {},
    created: function () {},
    mounted: function () {
      this.setContent();
    },
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
      returnShowContent() {
        return this.showContent;
      },
    },
    methods: {
      setContent() {
        if (!('content' in this.block)) {
          const iconBlock = this.uipData.blocks.filter((obj) => {
            return obj.moduleName == 'uip-icon';
          });
          const textBlock = this.uipData.blocks.filter((obj) => {
            return obj.moduleName == 'uip-paragraph';
          });

          let copiedIconBlock = JSON.parse(JSON.stringify(iconBlock[0]));
          let copiedtextBlock = JSON.parse(JSON.stringify(textBlock[0]));

          copiedIconBlock.uid = this.uipress.createUID();
          copiedtextBlock.uid = this.uipress.createUID();

          delete copiedIconBlock.path;
          delete copiedIconBlock.args;
          delete copiedIconBlock.category;
          delete copiedIconBlock.description;
          delete copiedIconBlock.path;

          delete copiedtextBlock.path;
          delete copiedtextBlock.args;
          delete copiedtextBlock.category;
          delete copiedtextBlock.description;
          delete copiedtextBlock.path;

          this.block.content = [];
          this.block.content.push(copiedIconBlock);
          this.block.content.push(copiedtextBlock);

          this.uipress.inject_block_presets(copiedIconBlock, copiedIconBlock.settings);
          this.uipress.inject_block_presets(copiedtextBlock, copiedtextBlock.settings);

          requestAnimationFrame(() => {
            this.showContent = true;
          });
          //this.forceReload();
        }
      },
      async forceReload() {
        // Remove MyComponent from the DOM
        this.showContent = false;

        // Wait for the change to get flushed to the DOM
        await this.$nextTick();

        // Add the component back in
        this.showContent = true;
      },
      followLink(evt) {
        if (evt.ctrlKey || evt.shiftKey || evt.metaKey || (evt.button && evt.button == 1)) {
          return;
        } else {
          evt.preventDefault();
        }

        let url = false;
        let item = false;
        let src = this.uipress.get_block_option(this.block, 'block', 'linkSelect', true);
        let srcOBJ = this.uipress.get_block_option(this.block, 'block', 'linkSelect');

        if (!src) {
          return;
        }
        if (this.uipress.isObject(src)) {
          if ('value' in src) {
            url = src.value;
          }
        } else {
          url = src;
        }

        if (!url || url == '') {
          return;
        }

        let newTab;
        if (!this.uipress.isObject(srcOBJ)) {
          newTab = 'dynamic';
        } else {
          newTab = srcOBJ.newTab;
        }
        if (newTab == 'dynamic') {
          this.uipress.updatePage(url);
        }
        if (newTab == 'default') {
          window.location.replace(url);
        }
        if (newTab == 'newTab') {
          let clicker = this.$refs.newTab;
          clicker.href = url;
          clicker.click();

          document.getElementById;
        }
      },
      buildOnClick() {
        let textString = '';
        textString += 'document.getElementById("' + this.block.uid + '").addEventListener("click", function(){';
        textString += this.getOnClickCode;
        textString += '});';

        return textString;
      },
      returnDropStyles() {
        let options = this.uipress.checkNestedValue(this.block, ['settings', 'style', 'options']);

        if (!options) {
          return;
        }

        let styles = this.uipress.explodeSpecificBlockSettings(options, 'style', this.uipData.templateDarkMode, null, 'flexLayout');

        if (typeof styles == 'undefined') {
          return '';
        }
        if (styles.includes('display:grid;')) {
          this.forceFlex = true;
        } else {
          this.forceFlex = false;
        }
        return styles;
      },
    },
    template: `
    
          
            <a :href="getLink" class="uip-button-default uip-inline-flex uip-gap-xxs uip-flex-center uip-no-underline" @click="followLink($event);">
            
              <uip-content-area v-if="block.content" :contextualData="contextualData" :dropAreaStyle="returnDropStyles()"
              :content="block.content" :returnData="function(data) {block.content = data} "/>
              
              <component v-if="getOnClickCode" is="script" scoped>
              
                {{buildOnClick()}}
              
              </component>
              
              <a ref="newTab" target="_BLANK" class="uip-hidden"></a>
              
            </a>
            
            

          `,
  };
}
