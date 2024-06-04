const { __, _x, _n, _nx } = wp.i18n;
export default {
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
  watch: {
    /**
     * Watches changes to block tabs
     *
     * @since 3.2.13
     */
    'block.settings.block.options.tabs.value.tabs': {
      handler(newValue, oldValue) {
        //this.processContent();
      },
      deep: true,
    },
  },
  mounted() {
    if (this.block.content.length) return;
    this.pushNewContentBlock();
  },
  computed: {
    /**
     * Returns block tabs
     *
     * @since 3.2.13
     */
    returnTabs() {
      if (!this.block.content) return [];
      console.log(this.block.content);
      return this.block.content.map((block) => block.name);
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
      const content = this.block.content[this.activeTab].content;
      if (!Array.isArray(content)) return [];
      return content;
    },
  },
  methods: {
    /**
     * Pushes new content block
     *
     * @since 3.2.13
     */
    pushNewContentBlock() {
      const containerBlock = this.uipApp.data.blocks.filter((obj) => {
        return obj.moduleName == 'uip-container';
      });

      let copiedConatiner = JSON.parse(JSON.stringify(containerBlock[0]));

      delete copiedConatiner.path;
      delete copiedConatiner.args;
      delete copiedConatiner.category;
      delete copiedConatiner.description;
      delete copiedConatiner.optionsEnabled;

      copiedConatiner.uid = this.createUID();
      copiedConatiner.name = __('Tab', 'uipress-lite');
      copiedConatiner.settings = {};
      copiedConatiner.tooltip = {};

      this.block.content.push(copiedConatiner);
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
            :class="{'uip-border-bottom-primary uip-text-bold uip-tab-item-active' : index == activeTab}">{{tab}}</div>
         </template>
       </div>
       
      <uip-content-area
      class="uip-tab-content-area"
      :content="returnActiveTabContent" :returnData="(data)=>{updateBlockContent(data)} "/>
        
      </div>
      `,
};
