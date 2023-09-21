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
        activeTab: 0,
        contentIndex: 0,
      };
    },
    inject: ['uipData', 'uipress', 'uiTemplate'],
    watch: {
      'block.settings.block.options.tabs.value.tabs': {
        handler(newValue, oldValue) {
          this.processContent();
        },
        deep: true,
      },
    },
    mounted: function () {
      this.processContent();
    },
    computed: {
      returnTabs() {
        if (typeof this.block.settings.block.options.tabs.value.tabs === 'undefined') {
          return [];
        }
        return this.block.settings.block.options.tabs.value.tabs;
      },
      returnBlockContent() {
        return this.block.content;
      },
      returnTabContent() {
        return this.block.content[this.returnContentIndex].content;
      },
      returnContentIndex() {
        //Set active index
        let activeID = this.returnTabs[this.activeTab].id;
        this.contentIndex = this.block.content.findIndex((obj) => {
          return obj.uid === activeID;
        });
        if (this.contentIndex < 0) {
          this.contentIndex = 0;
        }

        return this.contentIndex;
      },
    },
    methods: {
      processContent() {
        let tabs = this.returnTabs;
        let content = this.returnBlockContent;

        if (typeof tabs === 'undefined') {
          tabs = [];
        }

        if (tabs.length < 1) {
          return;
        }

        if (tabs.length == content.length) {
          //return;
        }

        //Loop through tabs and ensure they have content areas
        for (let i = 0; i < tabs.length; i++) {
          //Create id for tab
          if (tabs[i].id == '') {
            tabs[i].id = this.uipress.createUID();
          }

          let tabContent = content.filter((obj) => {
            return obj.uid === tabs[i].id;
          });

          //Content area doesn't exist so create one
          if (tabContent.length === 0) {
            content[i] = {
              name: tabs[i].name,
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
              uid: tabs[i].id,
            };
          } else {
            //Content block already exists so update it's name
            tabContent[0].name = tabs[i].name;
          }
        }
        //Loop through content areas and remove ones that no longer have tabs
        for (var i = 0; i < content.length; i++) {
          let contentArea = content[i];

          let tabID = tabs.filter((obj) => {
            return obj.id === contentArea.uid;
          });

          //Tab has been removed so let's remove the content area too
          if (tabID.length === 0) {
            content.splice(i, 1);
            continue;
          }
        }

        if (this.activeTab > this.returnTabs.length - 1) {
          this.activeTab = 0;
        }

        //Gte content active index
        let activeID = this.returnTabs[this.activeTab].id;
        this.contentIndex = this.block.content.findIndex((obj) => {
          return obj.uid === activeID;
        });

        if (this.contentIndex < 0) {
          this.contentIndex = 0;
        }

        this.block.settings.block.options.tabs.value.tabs = tabs;
      },
      updateIndex(index) {
        this.activeTab = index;
      },
      arraymove(arr, fromIndex, toIndex) {
        arr.splice(fromIndex + 1, 0, arr.splice(toIndex, 1)[0]);
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
       <div class="uip-tab-content-area uip-margin-top" v-if="returnTabs.length > 0">
           <template v-for="(item, index) in returnBlockContent">
            <uip-content-area v-if="returnContentIndex == index" :content="item.content" :returnData="function(data) {item.content = data} "></uip-content-area>
           </template>
        </div>
      </div>
      `,
  };
}
