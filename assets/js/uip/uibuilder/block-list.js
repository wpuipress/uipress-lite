/**
 * Builds the main ui builder shell
 * @since 3.0.0
 */
const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from '../../libs/vue-esm-dev.js';
export default {
  props: {
    mode: String,
    insertArea: Array,
  },
  data() {
    return {
      loading: true,
      categories: [],
      search: '',
      sortedBlocks: this.uipData.blocks.sort((a, b) => a.name.localeCompare(b.name)),
      strings: {
        proBlock: __('This block requires uipress pro. Upgrade to unlock.', 'uipress-lite'),
        seachBlocks: __('Search blocks...', 'uipress-lite'),
      },
    };
  },
  inject: ['uipData', 'uipress', 'uiTemplate'],
  mounted() {
    this.removeOldBlocks();
  },
  computed: {
    /**
     * Returns filters categories with blocks as children
     *
     * @since 3.2.13
     */
    returnCats() {
      const excludedModules = ['responsive-grid', 'uip-admin-menu', 'uip-user-meta-block'];

      return Object.entries(this.returnGroups).map(([catKey, catValue]) => {
        const sortedBlocks = this.uipData.blocks.filter((block) => block.group === catKey && !excludedModules.includes(block.moduleName)).sort((a, b) => a.name.localeCompare(b.name));

        return {
          name: catValue.label,
          blocks: sortedBlocks,
        };
      });
    },

    /**
     * Returns categories / groups for blocks
     *
     * @since 3.2.13
     */
    returnGroups() {
      return this.uipData.blockGroups;
    },
  },
  methods: {
    /**
     * Removes old blocks from list
     *
     * @since 3.2.13
     */
    removeOldBlocks() {
      const excludedModules = ['responsive-grid', 'uip-admin-menu', 'uip-user-meta-block'];
      this.sortedBlocks = this.sortedBlocks.filter((block) => !excludedModules.includes(block.moduleName));
    },
    /**
     * Clones block upon succesful drag
     *
     * @param {Object} block
     * @since 3.2.13
     */
    clone(block) {
      let item = JSON.parse(JSON.stringify(block));
      item.tooltip = {};
      item.settings = {};

      delete item.path;
      delete item.args;

      delete item.category;

      delete item.description;

      delete item.optionsEnabled;

      delete item.path;

      return item;
    },

    /**
     * Checks whether a component exists
     *
     * @param {String} mod - component name
     * @since 3.2.13
     */
    componentExists(mod) {
      if (mod.premium && !this.uiTemplate.proActivated) return false;

      const name = mod.moduleName;
      if (this.$root._.appContext.components[name]) return true;
    },

    /**
     * Inserts block at a given position
     *
     * @param {Object} block
     * @returns {Promise}
     * @since 3.2.13
     */
    async insertAtPos(block) {
      //Check if we allowing click from modal list
      if (this.mode != 'click') {
        return;
      }
      if (!Array.isArray(this.insertArea)) return;
      let item = this.clone(block);
      item.uid = this.uipress.createUID();
      this.insertArea.push(item);
      await nextTick();
      const addedBlock = this.insertArea[this.insertArea.length - 1];
      this.uipApp.blockControl.setActive(addedBlock, this.insertArea);
    },

    /**
     * Checks whether the block is in the search
     *
     * @param {Object} block - the block to check
     * @since 3.2.13
     */
    inSearch(block) {
      if (this.search == '') {
        return true;
      }
      let str = this.search.toLowerCase();

      if (block.name.toLowerCase().includes(str)) {
        return true;
      }
      if (block.description.toLowerCase().includes(str)) {
        return true;
      }
      return false;
    },
  },
  template: `
    
    <div class="">
    
        <div class="uip-flex uip-padding-xxs uip-search-block uip-border-round uip-margin-bottom-s">
          <span class="uip-icon uip-text-muted uip-margin-right-xs uip-text-l uip-icon uip-icon-medium">search</span>
          <input class="uip-blank-input uip-flex-grow uip-text-s" type="search" :placeholder="strings.seachBlocks" autofocus="" v-model="search">
        </div>
        
        <!--Searching-->
        <uip-draggable v-if="search != ''"
          :list="sortedBlocks" 
          class="uip-grid-col-3 uip-grid-gap-xs uip-flex-center"
          handle=".uip-block-drag"
          :group="{ name: 'uip-blocks', pull: 'clone', put: false, revertClone: true }"
          animation="300"
          :sort="false"
          :clone="clone"
          ghostClass="uip-drop-in-ghost"
          itemKey="name">
            <template v-for="(element, index) in sortedBlocks" :key="element.name" :index="index">
          
                <div v-show="componentExists(element) && inSearch(element)" class="uip-block-item" :block-name="element.name">
                    <div @click="insertAtPos(element)" class="uip-border-rounder uip-padding-xs uip-link-default uip-background-muted hover:uip-background-grey uip-cursor-pointer uip-block-drag uip-no-text-select">
                      <div class="uip-flex uip-flex-column uip-flex-center">
                        <div class="uip-icon uip-icon-medium uip-text-xl">
                          {{element.icon}}
                        </div> 
                        <div class="uip-text-center uip-text-s">{{element.name}}</div>
                      </div>
                    </div>
                </div>
            
            </template>
        </uip-draggable>
              
        
        <template v-if="search == ''" v-for="cat in returnCats">
          
            <div class="uip-flex uip-margin-bottom-s uip-border-rounder uip-border-round uip-text-bold uip-text-emphasis">{{cat.name}}</div>
            <div class=" uip-margin-bottom-s uip-flex-wrap uip-flex-row">
          
            
              <uip-draggable 
                :list="cat.blocks" 
                class="uip-grid-col-3 uip-grid-gap-xs uip-flex-center"
                handle=".uip-block-drag"
                :group="{ name: 'uip-blocks', pull: 'clone', put: false, revertClone: true }"
                animation="300"
                :sort="false"
                :clone="clone"
                ghostClass="uip-drop-in-ghost"
                itemKey="name">
                  <template v-for="(element, index) in cat.blocks" :key="element.name" :index="index">
                
                      <div v-if="componentExists(element) && inSearch(element)" class="uip-block-item" :block-name="element.name">
                        <uip-tooltip :message="element.description" :delay="500">
                          <div @click="insertAtPos(element)" class="uip-border-rounder uip-padding-xs uip-link-default uip-background-muted hover:uip-background-grey uip-cursor-pointer uip-block-drag uip-no-text-select">
                            <div class="uip-flex uip-flex-column uip-flex-center">
                              <div class="uip-icon uip-icon-medium uip-text-xl">
                                {{element.icon}}
                              </div> 
                              <div class="uip-text-center uip-text-s">{{element.name}}</div>
                            </div>
                          </div>
                        </uip-tooltip>
                      </div>
                      
                      <div v-else-if="inSearch(element)" class="uip-block-item" :block-name="element.name">
                        <uip-tooltip :message="strings.proBlock" :delay="200">
                          <div class="uip-border-rounder uip-padding-xs uip-background-green-wash uip-cursor-pointer">
                            <div class="uip-flex uip-flex-column uip-flex-center">
                              <div class="uip-icon uip-icon-medium uip-text-xl">
                                redeem
                              </div> 
                              <div class="uip-text-center uip-text-xs uip-text-s">{{element.name}}</div>
                            </div>
                          </div>
                        </uip-tooltip>
                      </div>
                  
                  </template>
              </uip-draggable>
              
            
            </div>
          
        </template>
      </div>`,
};
