const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
    },
    data() {
      return {
        activeTab: 0,
        contentIndex: 0,
      };
    },
    inject: ['uipData', 'uipress'],
    watch: {
      /**
       * Watches changes to block tabs
       *
       * @since 3.2.13
       */
      'block.settings.block.options.tabs.value.tabs': {
        handler(newValue, oldValue) {
          this.processContent();
        },
        deep: true,
      },
    },
    mounted() {
      this.processContent();
    },
    computed: {
      /**
       * Returns block tabs
       *
       * @since 3.2.13
       */
      returnTabs() {
        const tabs = this.uipress.get_block_option(this.block, 'block', 'tabs', true);
        if (!this.uipress.isObject(tabs)) return [];
        if (tabs.tabs) return tabs.tabs;
        return [];
      },

      /**
       * Returns block content
       *
       * @since 3.2.13
       */
      returnBlockContent() {
        return this.block.content;
      },

      /**
       * Returns active block content
       *
       * @since 3.2.13
       */
      returnActiveTabContent() {
        if (!this.block.content[this.activeTab]) return [];
        return this.block.content[this.activeTab].content;
      },

      /**
       * Returns current tab's content
       *
       * @since 3.2.13
       */
      returnTabContent() {
        return this.block.content[this.returnCurrentIndex].content;
      },

      /**
       * Returns current index for tab
       *
       * @since 3.2.13
       */
      returnCurrentIndex() {
        //Set active index
        const activeID = this.returnTabs[this.activeTab].id;

        // Finds current index
        this.contentIndex = this.block.content.findIndex((obj) => {
          return obj.uid === activeID;
        });

        // Ensure we don't end up below 0
        if (this.contentIndex < 0) {
          this.contentIndex = 0;
        }

        return this.contentIndex;
      },
    },
    methods: {
      /**
       * Returns new content area
       *
       * @param {Number} index - The tab index of the content area
       * @since 3.2.13
       */
      returnNewContentArea(index) {
        return {
          name: this.returnTabs[index].name,
          moduleName: 'uip-container',
          icon: 'view_agenda',
          settings: {
            block: {
              options: {
                flexAlignSelf: { value: '', settingName: 'flexAlignSelf' },
                flexJustifyContent: { value: '', settingName: 'flexJustifyContent' },
                flexAlignItems: { value: '', settingName: 'flexAlignItems' },
                flexDirection: { value: '', settingName: 'flexDirection' },
                flexWrap: { value: { value: 'wrap' }, settingName: 'flexWrap' },
                columnGap: { value: { value: '', units: '%' }, settingName: 'columnGap' },
                rowGap: { value: { value: '', units: '%' }, settingName: 'rowGap' },
              },
              name: 'block',
            },
            container: {
              options: {
                verticalAlign: { value: { value: 'none' }, settingName: 'verticalAlign' },
                horizontalAlign: { value: { value: 'none' }, settingName: 'horizontalAlign' },
                flexGrow: { value: { value: 'none' }, settingName: 'flexGrow' },
                stretchDirection: { value: { value: 'none' }, settingName: 'stretchDirection' },
                dimensions: { settingName: 'dimensions' },
              },
              styleType: 'style',
              class: '',
              name: 'container',
            },
            style: {
              options: {
                colorSelect: { settingName: 'colorSelect' },
                imageSelect: { settingName: 'imageSelect' },
                dimensions: { settingName: 'dimensions' },
                padding: { settingName: 'padding' },
                margin: { settingName: 'margin ' },
                textFormat: { settingName: 'textFormat' },
                border: { settingName: 'border' },
                positionDesigner: { settingName: 'positionDesigner' },
                shadow: { settingName: 'shadow' },
              },
              styleType: 'style',
              class: '',
              name: 'style',
            },
            advanced: {
              options: {
                classes: { value: '', settingName: 'classes' },
                conditionalShow: { component: 'conditionalShow ', label: 'Conditional show ' },
                customTemplate: { component: 'customTemplate ', label: 'Custom block template ' },
                css: { value: '', settingName: 'customCode ' },
                js: { value: '', settingName: 'customCode ' },
              },
              name: 'advanced',
            },
          },
          content: [],
          uid: this.returnTabs[index].id,
        };
      },

      /**
       * Processes tab content
       *
       * @since 3.2.13
       */
      processContent() {
        let tabs = this.returnTabs;
        let content = this.returnBlockContent;

        if (!tabs) tabs = [];

        // No tabs so nothing to process
        if (tabs.length < 1) return;

        //Loop through tabs and ensure they have content areas
        for (const [index, tab] of tabs.entries()) {
          // Ensure the tab has an id
          const tabID = tab.id ? tab.id : this.uipress.createUID();
          tab.id = tabID;

          // Get tabs content
          const tabContent = content.filter((obj) => {
            return obj.uid === tabID;
          });

          // Tba content is empty so push new content area
          if (tabContent.length === 0) {
            content[index] = this.returnNewContentArea(index);
          } else {
            tabContent[0].name = tab.name;
          }
        }

        //Loop through content areas and remove ones that no longer have tabs
        for (const [index, contentArea] of content.entries()) {
          const tabID = tabs.filter((obj) => {
            return obj.id === contentArea.uid;
          });

          //Tab has been removed so let's remove the content area too
          if (tabID.length === 0) content.splice(i, 1);
        }

        // If active tab is greater than length reset
        if (this.activeTab > this.returnTabs.length - 1) {
          this.activeTab = 0;
        }

        // Get content active index
        let activeID = this.returnTabs[this.activeTab].id;
        this.contentIndex = this.block.content.findIndex((obj) => {
          return obj.uid === activeID;
        });

        if (this.contentIndex < 0) {
          this.contentIndex = 0;
        }

        this.block.settings.block.options.tabs.value.tabs = tabs;
      },
      /**
       * Updates tab index
       *
       * @param {Number} index - the index to update to being active
       */
      updateIndex(index) {
        this.activeTab = index;
      },

      /**
       * Updates the tab content
       *
       * @param {Array} data - list of tabs children
       * @since 3.2.13
       */
      updateBlockContent(data) {
        if (!this.block.content[this.activeTab]) return;
        this.block.content[this.activeTab].content = data;
      },
    },
    template: `
      <div class="uip-text-normal">
      
       <div class="uip-flex uip-flex-row">
         <template v-for="(tab, index) in returnTabs">
            <div class="uip-padding-xs uip-cursor-pointer uip-tab-item" @click="updateIndex(index)"
            :class="{'uip-border-bottom-primary uip-text-bold uip-tab-item-active' : index == activeTab}">{{tab.name}}</div>
         </template>
       </div>
       
      <uip-content-area
      class="uip-tab-content-area"
      :content="returnActiveTabContent" :returnData="(data)=>{updateBlockContent(data)} "/>
        
      </div>
      `,
  };
}
