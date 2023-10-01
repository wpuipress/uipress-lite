const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from '../../libs/vue-esm-dev.js';
export default {
  name: 'layersRecursive',
  props: {
    content: Array,
    returnData: Function,
  },
  components: {
    BlockList: defineAsyncComponent(() => import('./block-list.min.js?ver=3.2.12')),
  },
  data() {
    return {
      items: this.content,
      queryLoopEnabled: __('Block is using query loop', 'uipress-lite'),
      drag: false,
    };
  },
  inject: [ 'uiTemplate', 'uipress'],
  watch: {
    content: {
      handler(newValue, oldValue) {
        this.items = newValue;
      },
      deep: true,
    },
    '$route.query.block': {
      handler(newValue, oldValue) {
        this.setOpenItems();
      },
      deep: true,
    },
  },
  methods: {
    /**
     * Returns the drag class for the drop area
     *
     * @since 3.2.13
     */
    returnDragStyle() {
      if (this.uiTemplate.drag) {
        return 'border-color:var(--uip-background-primary);';
      }
    },

    /**
     * Opens block settings
     *
     * @param {Object} item - block item
     */
    openSettings(item) {
      this.uipApp.blockControl.setActive(item, this.items);
    },

    /**
     * Returns if the block is currently selected
     *
     * @param {String} uid - the block uid
     * @returns {boolean}  - whether it's active or not
     * @since 3.2.13
     */
    isActive(uid) {
      if ('block' in this.$route.query && this.$route.query.block == uid) return true;
    },

    /**
     * Builds and returns a string of CSS classes for a given element.
     *
     * The function calculates the classes based on the active state of the element
     * and whether the element is being hovered over in a block control context.
     *
     * @param {Object} element - The target element for which the classes are being constructed.
     * @property {string} element.uid - The unique identifier of the element.
     * @returns {string} - A string of space-separated CSS classes.
     * @since [YOUR_VERSION_HERE]
     */
    buildClasses(element) {
      let classes = 'uip-border-rounder uip-padding-xxs';
      const isActive = this.isActive(element.uid);

      // Add classes based on active state
      if (isActive) {
        classes += ' uip-background-secondary uip-text-bold uip-text-inverse';
      } else {
        classes += ' uip-background-muted';
      }

      // Add hover class in a block control context if the element is not active
      if (this.uipApp.blockControl && !isActive) {
        if (this.uipApp.blockControl.returnHoveredBlockUID === element.uid) {
          classes += ' uip-background-primary-wash';
        }
      }

      return classes;
    },

    /**
     * Traverse through blocks to open block content when active block changes
     *
     * @since 3.2.13
     */
    setOpenItems() {
      // A recursive function to handle the nested structure
      const traverse = (arr) => {
        for (let item of arr) {
          // Check if should be open
          item.tabOpen = this.isContentOpen(item);

          // If the item has children, recursively traverse them
          if (item.content && item.content.length > 0) {
            traverse(item.content);
          }
        }
      };

      traverse(this.items);
    },
    /**
     * Checks if content is open
     *
     * @param {Object} item - block item
     * @returns {boolean}  - whether or nor to show block children
     */
    isContentOpen(item) {
      if (item.tabOpen) return true;
      if (!item.content) return item.tabOpen;

      const asString = JSON.stringify(item.content);
      const currentBlock = this.$route.query.block;

      // Check if children doesn't include the current block
      if (!asString.includes(currentBlock)) return false;

      return true;
    },
  },
  template: `
    <div class="uip-border-round uip-h-100p uip-w-100p uip-flex uip-drop-area uip-template-layers"
	  :style="returnDragStyle()" :class="{'uip-drop-hightlight' : uiTemplate.drag}">
           
			<uip-draggable 
			  class="uip-flex uip-flex-column uip-row-gap-xxs uip-w-100p"
	  		  :group="{ name: 'uip-blocks', pull: true, put: true }"
              :list="items"
			  ghost-class="uip-block-ghost"
              handle=".uip-block-drag"
              animation="300"
			  :sort="true">
        
            
                  <div v-for="(element, index) in items" class="uip-border-round" :key="element.uid">
                  
                    <div class="uip-flex ui-flex-middle uip-flex-center uip-gap-xxs uip-block" style="min-width:160px" 
                    :class="buildClasses(element)" 
                    @click="openSettings(element)"
                    @mouseenter.prevent.stop="uipApp.blockControl.setHover({},element)"
                    @mouseleave.prevent.stop="uipApp.blockControl.removeHover({},element)"
                    @contextmenu.prevent.stop="uipApp.blockcontextmenu.show({event: $event, list: items, index: index, block: element})">
                      
                      
                      <div class="uip-cursor-pointer uip-icon uip-icon-small-emphasis uip-border-round uip-block-drag">drag_indicator</div>
                      <div class="uip-cursor-pointer uip-icon uip-icon-small-emphasis">{{element.icon}}</div>
                      
                     
                      
                      <div class="uip-cursor-pointer uip-flex-grow uip-text-s uip-no-wrap uip-flex-center uip-flex-between uip-flex">
                        <span>{{element.name}}</span>
                        <span :title="queryLoopEnabled" v-if="uipress.checkNestedValue(element, ['query', 'enabled'])" class="uip-cursor-pointer uip-icon uip-icon-small-emphasis uip-text-l">all_inclusive</span>
                      </div>
                      
                      <!--Chevs -->
                      <div v-if="element.content" class="uip-ratio-1-1 uip-icon uip-padding-xxxs uip-text-l uip-line-height-1 uip-cursor-pointer uip-flex uip-flex-center uip-margin-left-xs" type="button" @click.prevent.stop="element.tabOpen = !element.tabOpen">
                        <span v-if="!element.tabOpen">chevron_left</span>
                        <span v-if="element.tabOpen">expand_more</span>
                      </div>
                      
                    </div>
                    
                    <div v-if="element.tabOpen && element.content" class="uip-margin-left-s uip-margin-top-xxs">
                      
                      <!--Block selector-->
                      <div class="uip-flex uip-flex-center uip-flex-middle uip-flex-row uip-margin-bottom-xxs">
                      
                        <dropdown width="260" pos="right center" :onOpen="function(){uiTemplate.activePath = []}" triggerClass="uip-w-100p" class="uip-w-100p">
                          <template v-slot:trigger>
                            <div ref="footer" class="uip-text-muted uip-text-center uip-padding-xxs uip-text-center uip-icon uip-link-muted uip-border-rounder uip-border uip-cursor-pointer uip-w-100p uip-text-s" >add</div>
                          </template>
                          <template v-slot:content>
                            <div class="uip-padding-s uip-max-w-300 uip-w-300 uip-max-h-300 uip-overflow-auto uip-scrollbar">
                              <BlockList mode="click" :insertArea="element.content"/>
                            </div>
                          </template>
                        </dropdown>
                        
                      </div>
                      <!--End block selector-->
                    
                    
                      <layersRecursive :content="element.content" :returnData="function(data){element.content = data}" />
                    </div>
                  </div>  
        
			</uip-draggable>
	    	
		</div>`,
};
