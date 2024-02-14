import { nextTick } from "../../libs/vue-esm.js";
export default {
  inject: ["uiTemplate"],

  props: {
    block: Object,
  },

  data() {
    return {
      blocksearch: "",
      option: this.returnDefaultOptions,
      updating: false,
      strings: {
        newinteraction: __("New interaction", "uipress-lite"),
        type: __("Type", "uipress-lite"),
        operator: __("Operator", "uipress-lite"),
        searchUsers: __("Search", "uipress-lite"),
        value: __("Value", "uipress-lite"),
        addinteraction: __("Add interaction", "uipress-lite"),
        editinteraction: __("Edit interaction", "uipress-lite"),
        users: __("Users", "uipress-lite"),
        dateAndTime: __("Date and time", "uipress-lite"),
        site: __("Site", "uipress-lite"),
        action: __("Action", "uipress-lite"),
        defaultActions: __("Default", "uipress-lite"),
        uipressActions: __("uiPress", "uipress-lite"),
        siteActions: __("Site", "uipress-lite"),
        target: __("Target", "uipress-lite"),
        CSSselector: __("CSS selector", "uipress-lite"),
        block: __("Block", "uipress-lite"),
        searchBlocks: __("Search blocks", "uipress-lite"),
        blockSpecific: __("Block specific", "uipress-lite"),
        blockList: __("Block list", "uipress-lite"),
        trigger: __("Trigger", "uipress-lite"),
        key: __("Key", "uipress-lite"),
      },

      interactions: {
        defaultActions: {
          showElement: {
            value: "showElement",
            label: __("Show element", "uipress-lite"),
          },
          hideElement: {
            value: "hideElement",
            label: __("Hide element", "uipress-lite"),
          },
          toggleElementVisibility: {
            value: "toggleElementVisibility",
            label: __("Toggle element visibility", "uipress-lite"),
          },
          addAttribute: {
            value: "addAttribute",
            label: __("Add attribute", "uipress-lite"),
          },
          removeAttribute: {
            value: "removeAttribute",
            label: __("Remove attribute", "uipress-lite"),
          },
          toggleAttribute: {
            value: "toggleAttribute",
            label: __("Toggle attribute", "uipress-lite"),
          },
          javascript: {
            value: "javascript",
            label: __("Custom javascript", "uipress-lite"),
          },
        },
        uipressActions: {
          toggleDarkMode: {
            value: "toggleDarkMode",
            label: __("Toggle dark mode", "uipress-lite"),
          },
          toggleMenuCollapse: {
            value: "toggleMenuCollapse",
            label: __("Toggle menu collapse", "uipress-lite"),
          },
          toggleFulscreenMode: {
            value: "toggleFulscreenMode",
            label: __("Toggle fullscreen mode", "uipress-lite"),
          },
        },
        siteActions: {
          toggleScreenOptions: {
            value: "toggleScreenOptions",
            label: __("Toggle screen options", "uipress-lite"),
          },
          toggleHelpOptions: {
            value: "toggleHelpOptions",
            label: __("Toggle help options", "uipress-lite"),
          },
        },
      },
    };
  },
  watch: {
    /**
     * Watches changes to value and injects
     *
     * @since 3.2.13
     */
    block: {
      handler() {
        if (this.updating) return;
        this.injectProp();
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    /**
     * Returns list of all actions
     *
     * @since 3.3.095
     */
    returnAllActions() {
      return { ...this.interactions.defaultActions, ...this.interactions.uipressActions, ...this.interactions.siteActions };
    },

    /**
     * Returns new interaction ID
     *
     * @since 3.3.095
     */
    newInteraction() {
      return { id: this.createUID(), type: "click", target: "self", action: "" };
    },

    /**
     * Returns list of user types interactions
     *
     * @since 3.3.095
     */
    returnInteractionTypes() {
      return {
        click: {
          value: "click",
          label: __("Click", "uipress-lite"),
        },
        dblclick: {
          value: "dblclick",
          label: __("Double click", "uipress-lite"),
        },
        mouseenter: {
          value: "mouseenter",
          label: __("Hover / Mouse enter", "uipress-lite"),
        },
        mouseleave: {
          value: "mouseleave",
          label: __("Mouse leave", "uipress-lite"),
        },
        focus: {
          value: "focus",
          label: __("Focus", "uipress-lite"),
        },
        blur: {
          value: "blur",
          label: __("Blur", "uipress-lite"),
        },
      };
    },

    /**
     * Returns list of targets
     *
     * @since 3.3.095
     */
    returnTargetTypes() {
      return {
        self: {
          value: "self",
          label: __("Self", "uipress-lite"),
        },
        selector: {
          value: "selector",
          label: __("CSS selector", "uipress-lite"),
        },
        block: {
          value: "block",
          label: __("Block", "uipress-lite"),
        },
      };
    },

    /**
     * Returns whether there are any interactions
     *
     * @returns {boolean}
     * @since 3.2.13
     */
    hasinteractions() {
      if (!this.option.interactions) return false;
      return this.option.interactions.length;
    },

    /**
     * Returns default options for interactions
     *
     * @since 3.2.13
     */
    returnDefaultOptions() {
      return {
        relation: "and",
        interactions: [],
        blockTarget: "",
      };
    },
  },
  methods: {
    /**
     * Injects prop value into component
     *
     * @since 3.2.13
     */
    async injectProp() {
      this.updating = true;
      if (!Array.isArray(this.block.interactions)) this.block.interactions = [];

      await nextTick();
      this.updating = false;
    },

    /**
     * Adds a new interaction
     *
     * @since 3.2.13
     */
    async addinteraction() {
      const newInteraction = JSON.parse(JSON.stringify(this.newInteraction));
      this.block.interactions.push(newInteraction);
      await this.$nextTick();
      const opener = () => {
        const newIndex = this.block.interactions.length - 1;
        this.$refs["interaction" + newIndex][0].show();
      };
      setTimeout(opener, 100);
    },

    /**
     * Removes a interaction
     *
     * @param {Number} index - index of item to remove
     * @since 3.2.13
     */
    removeinteraction(index) {
      this.block.interactions.splice(index, 1);
    },

    /**
     * Returns action nice name
     *
     * @param {String} action - action name
     *
     * @since 3.3.095
     */
    returnActionNiceName(action) {
      if (!action) return "";
      return this.returnAllActions[action] ? this.returnAllActions[action].label : action;
    },

    /**
     * Returns interaction nice name
     *
     * @param {String} interaction - interaction name
     *
     * @since 3.3.095
     */
    returnInteractionNiceName(interaction) {
      return this.returnInteractionTypes[interaction].label;
    },

    /**
     * Checks if block is in search
     *
     * @param {Object} block - the block to check
     *
     * @since 3.3.095
     */
    blockInSearch(block) {
      if (!this.blocksearch) return true;

      const lcSearch = this.blocksearch.toLowerCase();
      const lcName = block.name ? block.name.toLowerCase() : "";
      const lcUID = block.uid ? block.uid.toLowerCase() : "";

      if (lcName.includes(lcSearch) || lcUID.includes(lcSearch)) return true;

      return false;
    },

    /**
     * Returns specific block methods
     *
     * @param {String} target - the block uid
     *
     * @since 3.3.095
     */
    returnBlockSpecificActions(target) {
      if (!(target in this.uiTemplate.blockRefs)) return false;

      const methods = this.uiTemplate.blockRefs[target].ref;
      const publicMethods = "returnPublicMethods" in methods ? methods.returnPublicMethods() : false;
      return publicMethods;
    },
  },
  template: `
	
	<div class="uip-flex uip-w-100p uip-flex-column uip-row-gap-xs" v-if="block.interactions">
  
	  <template v-for="(element, index) in block.interactions">
    
		<dropdown pos="left center" class="uip-w-100p" :snapX="['#uip-block-settings']" :ref="'interaction'+index">
		  <template v-slot:trigger>
      
            <div class="uip-grid-col-1-3">
            
              <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{returnInteractionNiceName(element.type)}}</span></div>
			
			  <div class="uip-flex uip-flex-row uip-gap-xxs">
			    <div class="uip-padding-xxs uip-padding-left-xs uip-border-rounder uip-text-s uip-background-muted uip-flex-grow uip-text-ellipsis uip-no-wrap uip-overflow-hidden uip-max-w-160">
				  {{returnActionNiceName(element.action)}}
			    </div>
			    
			    <button class="uip-button-default uip-border-rounder uip-icon uip-padding-xxs uip-link-muted"
			    @click="removeinteraction(index)">close</button>
			  </div>  
      
            </div>
			
		  </template>
		  <template v-slot:content>
			<div class="uip-padding-s uip-flex uip-flex-column uip-row-gap-s">
      
              <div class="uip-flex uip-flex-between uip-flex-center">
                <div class="uip-text-emphasis uip-text-bold uip-text-s">{{strings.editinteraction}}</div>
                <div @click="$refs['interaction'+index][0].close()" class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
                  <span class="uip-icon">close</span>
                </div>
              </div>
			
			  <div class="uip-grid-col-1-3">
        
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">ID</div>
                  <div class="uip-flex uip-flex-center uip-gap-xxs">
                    <input type="text" class="uip-input-small uip-flex-grow" style="min-width:1px" v-model="element.id" disabled="true">
                  </div>
			  
				  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.trigger}}</span></div>
				  <div class="uip-flex uip-flex-center">
          
					<select v-model="element.type" 
                    class="uip-input uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p uip-w-100p uip-border-rounder" 
                    style="padding-top: 2px; padding-bottom: 2px; border-radius: var(--uip-border-radius-large);">
          
					    <template v-for="item in returnInteractionTypes">
						  <option :value="item.value">{{item.label}}</option>
					    </template>
                      
					</select>
          
				  </div> 
          
				  
				  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.target}}</span></div>
          
                  <select class="uip-input uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p uip-w-100p uip-border-rounder" 
                  v-model="element.target" style="padding-top: 2px; padding-bottom: 2px; border-radius: var(--uip-border-radius-large);">
                  
                    <template v-for="item in returnTargetTypes">
                      <option :value="item.value">{{item.label}}</option>
                    </template>
                  
                  </select>
                  
                  <template v-if="element.target == 'selector'">
                  
                    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.CSSselector}}</span></div>
                    <div class="uip-flex uip-flex-center uip-gap-xxs">
                      <input type="text" class="uip-input-small uip-flex-grow" style="min-width:1px" placeholder="#element_id" v-model="element.selector">
                    </div>
                  
                  </template>
                  
                  
                  <template v-if="element.target == 'block'">
                  
                    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.block}}</span></div>
                    <div class="uip-flex uip-flex-center uip-gap-xxs">
                      
                      
                      <dropdown pos="bottom right" class="uip-flex uip-w-100p" :ref="'blocksearch_' + index">
                      
                        <template #trigger>
                        
                          <div class="uip-padding-xxs uip-padding-left-xs uip-border-rounder uip-text-s uip-background-muted uip-flex-grow uip-text-ellipsis uip-no-wrap uip-overflow-hidden uip-max-w-160 uip-flex uip-gap-xxxs uip-flex-center">
                          
                            <span v-if="!element.blockTarget" class="uip-text-muted">{{strings.searchBlocks}}...</span>
                            <span v-else class="uip-overflow-hidden uip-text-ellipsis uip-max-w-140">{{element.blockTarget}}</span>
                            
                            <a v-if="element.blockTarget" 
                            @click.prevent="element.blockTarget = ''"
                            class="uip-no-underline uip-border-rounder uip-padding-xxxs uip-link-muted"><span class="uip-icon">close</span></a>
                            
                          </div>
                        
                        
                        </template>
                        
                        <template #content>
                        
                          <div class="uip-w-260 uip-padding-s uip-flex uip-flex-column uip-row-gap-xs">
                          
                            <div class="uip-flex uip-flex-between uip-flex-center">
                            
                              <div class="uip-text-emphasis uip-text-bold uip-text-s">{{strings.blockList}}</div>
                              
                              <div @click="$refs['blocksearch_' + index][0].close()"
                              class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
                                <span class="uip-icon">close</span>
                              </div>
                              
                            </div>
                          
                            <input type="text" class="uip-input-small uip-flex-grow" :placeholder="strings.searchBlocks" v-model="blocksearch" autofocus>
                            
                            <div class="uip-flex uip-flex-column uip-max-h-300 uip-overflow-auto">
                            
                              <template v-for="block in uiTemplate.blockRefs">
                              
                                <div v-if="blockInSearch(block)" 
                                @click="element.blockTarget = block.uid;$refs['blocksearch_' + index][0].close()"
                                :class="element.blockTarget === block.uid ? 'uip-background-muted' : 'hover:uip-background-muted'"
                                class="uip-padding-xxs uip-border-rounder uip-text-s uip-cursor-pointer">
                                  <div class="uip-text-emphasis">{{block.name}}</div>
                                  <div class="uip-text-muted">{{block.uid}}</div>
                                </div>
                              
                              </template>
                              
                            </div>
                          
                          </div>
                        
                        </template>
                      
                      </dropdown>
                      
                    </div>
                  
                  </template>
                  
                  
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.action}}</span></div>
                  
                  <select class="uip-input uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p uip-w-100p uip-border-rounder" 
                  v-model="element.action" style="padding-top: 2px; padding-bottom: 2px; border-radius: var(--uip-border-radius-large);">
                    
                    <!-- Default actions-->
                    <optgroup :label="strings.defaultActions">
                      <template v-for="item in interactions.defaultActions">
                        <option :value="item.value">{{item.label}}</option>
                      </template>
                    </optgroup>
                    
                    <!-- uipressActions actions-->
                    <optgroup :label="strings.uipressActions">
                      <template v-for="item in interactions.uipressActions">
                        <option :value="item.value">{{item.label}}</option>
                      </template>
                    </optgroup>
                    
                    <!-- siteActions actions-->
                    <optgroup :label="strings.siteActions">
                      <template v-for="item in interactions.siteActions">
                        <option :value="item.value">{{item.label}}</option>
                      </template>
                    </optgroup>
                    
                    <!-- Block actions-->
                    <optgroup v-if="element.target == 'block' && element.blockTarget && returnBlockSpecificActions(element.blockTarget)" :label="strings.blockSpecific">
                      <template v-for="item in returnBlockSpecificActions(element.blockTarget)">
                        <option :value="'_block_' + item">{{item}}</option>
                      </template>
                    </optgroup>
                    
                  </select> 
                  
                  
                  <template v-if="element.action == 'javascript'">
                  
                    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>Javascript</span></div>
                    
                    <code-editor :value="element.javascript" :returnData="(d)=>{element.javascript=d}" :args="{language: 'javascript'}"/>
                  
                  </template>
                  
                  <template v-if="element.action == 'toggleAttribute' || element.action == 'addAttribute' || element.action == 'removeAttribute'">
                  
                    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.key}}</span></div>
                    <div class="uip-flex uip-flex-center uip-gap-xxs">
                      <input type="text" class="uip-input-small uip-flex-grow" style="min-width:1px" placeholder="class" v-model="element.key">
                    </div>
                    
                    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.value}}</span></div>
                    <div class="uip-flex uip-flex-center uip-gap-xxs">
                      <input type="text" class="uip-input-small uip-flex-grow" style="min-width:1px" placeholder="uip-background-primary" v-model="element.keyvalue">
                    </div>
                  
                  </template>
				  
			  </div>    
			  
			</div>
			
		  </template>
		</dropdown>
	  
	  </template>
	  
      <!-- Placeholder -->
      <div class="uip-grid-col-1-3">
        <div></div>
	    <div @click="addinteraction()" class="uip-padding-xxs uip-border-rounder uip-background-muted hover:uip-background-grey uip-cursor-pointer uip-flex uip-flex-middle uip-flex-center uip-gap-xs uip-flex-grow">
		  <span class="uip-icon">add</span>
	    </div>
      </div>
	  
	  
	</div>`,
};
