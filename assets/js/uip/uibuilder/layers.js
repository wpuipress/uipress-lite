const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from '../../libs/vue-esm-dev.js';

const Layer = {
  name: 'Layer',
  components: {
    BlockList: defineAsyncComponent(() => import('./block-list.min.js?ver=3.2.12')),
  },
  props: {
    block: Object,
    returnData: Function,
    items: Array,
  },
  data() {
    return {
      open: false,
      queryLoopEnabled: __('Block is using query loop', 'uipress-lite'),
    };
  },
  computed: {
    /**
     * Returns if the block is currently selected
     *
     * @returns {boolean}  - whether it's active or not
     * @since 3.2.13
     */
    isActive() {
      if ('block' in this.$route.query && this.$route.query.block == this.block.uid) return true;
    },

    /**
     * Builds and returns a string of CSS classes for a given element.
     *
     * The function calculates the classes based on the active state of the element
     * and whether the element is being hovered over in a block control context.
     *
     * @since 3.2.13
     */
    buildClasses() {
      let classes = 'uip-border-rounder uip-padding-xxs';
      const isActive = this.isActive;

      // Add classes based on active state
      if (isActive) {
        classes += ' uip-text-emphasis uip-background-secondary uip-text-bold uip-text-inverse ';
      } else {
        classes += ' uip-link-default uip-margin-right-xs';
      }

      // Add hover class in a block control context if the element is not active
      if (this.uipApp.blockControl && !isActive) {
        if (this.uipApp.blockControl.returnHoveredBlockUID === this.block.uid) {
          classes += ' uip-background-primary-wash uip-text-emphasis';
        }
      }

      return classes;
    },
  },
  methods: {
    /**
     * Opens block settings
     *
     * @since 3.2.13
     */
    openSettings() {
      this.uipApp.blockControl.setActive(this.block, this.items);
    },
  },
  template: `
  
      
      <div class="uip-border-rounder" :class="{'uip-background-primary-wash' : isActive}">
      
        <div class="uip-flex ui-flex-middle uip-flex-center uip-gap-xxs"
        :class="buildClasses" 
        @click="openSettings();open = true"
        @mouseenter.prevent.stop="uipApp.blockControl.setHover({},block)"
        @mouseleave.prevent.stop="uipApp.blockControl.removeHover({},block)"
        @contextmenu.prevent.stop="uipApp.blockcontextmenu.show({event: $event, list: items, index: index, block: block})">
          
          
          
          <!--Chevs -->
          <div v-if="block.content" class="uip-ratio-1-1 uip-icon uip-line-height-1 uip-cursor-pointer uip-flex uip-flex-center"
          @click.prevent.stop="open = !open">
            <span v-if="!open">chevron_right</span>
            <span v-if="open">expand_more</span>
          </div>
          
          
          <div class="uip-cursor-pointer uip-icon uip-icon-small-emphasis">{{block.icon}}</div>
          
          
          <div class="uip-cursor-pointer uip-flex-grow uip-text-s uip-no-wrap uip-flex-center uip-flex-between uip-flex">
            <span>{{block.name}}</span>
            <span :title="queryLoopEnabled" v-if="hasNestedPath(block, ['query', 'enabled'])" class="uip-cursor-pointer uip-icon uip-icon-small-emphasis uip-text-l">all_inclusive</span>
          </div>
          
          
          
        </div>
        
        <div v-if="open && block.content" class="uip-margin-left-xs  uip-padding-xs uip-padding-right-remove uip-flex uip-flex-column uip-gap-xs">
        
        
          <uip-draggable 
          class="uip-flex uip-flex-column uip-row-gap-xxs uip-w-100p uip-template-layers"
          :group="{ name: 'uip-blocks', pull: true, put: true }"
          :list="block.content"
          ghost-class="uip-block-ghost"
          handle=".uip-block-drag"
          animation="300"
          :sort="true">
          
                    <template v-for="(element, index) in block.content" :key="element.uid">
                    
                      <Layer :block="element" :items="block.content"/>
                      
                    </template>  
          
          </uip-draggable>
          
          <!--Block selector-->
          <dropdown width="260" pos="right center"
          class="uip-w-100p uip-flex uip-flex-center uip-flex-middle uip-flex-row uip-padding-right-xs">
            <template v-slot:trigger>
              <button class="uip-button-default uip-icon uip-w-100p uip-text-s uip-padding-xxs" >
                add
              </button>
            </template>
            <template v-slot:content>
              <div class="uip-padding-s uip-max-w-300 uip-w-300 uip-max-h-300 uip-overflow-auto uip-scrollbar">
                <BlockList mode="click" :insertArea="block.content"/>
              </div>
            </template>
          </dropdown>
          <!--End block selector-->
        
        
        </div>
      
      </div>
  
  `,
};
export default {
  name: 'layersRecursive',
  props: {
    content: Array,
    returnData: Function,
  },
  components: {
    BlockList: defineAsyncComponent(() => import('./block-list.min.js?ver=3.2.12')),
    Layer: Layer,
  },
  data() {
    return {
      items: this.content,
      queryLoopEnabled: __('Block is using query loop', 'uipress-lite'),
      drag: false,
    };
  },
  inject: ['uiTemplate'],
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
           
	  <uip-draggable 
	  class="uip-flex uip-flex-column uip-row-gap-xxs uip-w-100p uip-template-layers"
	  :group="{ name: 'uip-blocks', pull: true, put: true }"
      :list="items"
	  ghost-class="uip-block-ghost"
      handle=".uip-block-drag"
      animation="300"
	  :sort="true">
    
        
              <template v-for="(element, index) in items" :key="element.uid">
              
                <Layer :block="element" :items="items"/>
                
              </template>  
    
	  </uip-draggable>
    
    
    <!--Block selector-->
    <dropdown width="260" pos="right center" triggerClass="uip-w-100p" 
    class="uip-w-100p uip-flex uip-flex-center uip-flex-middle uip-flex-row">
      <template v-slot:trigger>
        <button class="uip-button-default uip-icon uip-w-100p uip-text-s uip-padding-xxs" >
          add
        </button>
      </template>
      <template v-slot:content>
        <div class="uip-padding-s uip-max-w-300 uip-w-300 uip-max-h-300 uip-overflow-auto uip-scrollbar">
          <BlockList mode="click" :insertArea="items"/>
        </div>
      </template>
    </dropdown>
    <!--End block selector-->
    
	    `,
};
