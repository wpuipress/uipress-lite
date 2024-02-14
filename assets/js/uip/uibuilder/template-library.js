/**
 * Builds the main ui builder shell
 * @since 3.0.0
 */
const { __, _x, _n, _nx } = wp.i18n;
import { deleteRemotePost } from "../v3.5/utility/functions.min.js";
import { defineAsyncComponent, nextTick } from "../../libs/vue-esm.js";

const screenOverlay = {
  data() {
    return {
      show: false,
    };
  },
  template: `
    
    <div @mouseenter="show=true" @mouseleave="show=false" class="uip-position-relative uip-flex">
      
      <div class="uip-flex-grow">
        <slot name="trigger"/>
      </div>
      
      <div class="uip-position-relative uip-flex-shrink">
        <div v-if="show" style="top:64px;bottom:0px;max-height:calc(100vh - 64px);"
        class="uip-position-fixed uip-z-index-9 uip-w-400 uip-padding-bottom-l uip-overflow-auto uip-background-default uip-border-left">
        
          <slot name="content"/>
        
        </div>
      </div>
    
    </div>
  `,
};

export default {
  inject: ["uiTemplate"],
  components: {
    screenOverlay: screenOverlay,
    Confirm: defineAsyncComponent(() => import("../v3.5/utility/confirm.min.js?ver=3.3.1")),
  },
  data() {
    return {
      loading: true,
      themes: [],
      search: "",
      activeTemplate: false,
      imageIndex: 0,
      imageHover: false,
      draggingBlock: false,
      strings: {
        missingMessage: __("This block no longer exists", "uipress-lite"),
        templateLibrary: __("Template library", "uipress-lite"),
        pro: __("Pro", "uipress-lite"),
        searchTemplates: __("Search templates", "uipress-lite"),
        backToAllThemes: __("Back to all templates", "uipress-lite"),
        includesProBlocks: __("Includes pro blocks", "uipress-lite"),
        createdBy: __("Created by", "uipress-lite"),
        addToTemplate: __("Add to template", "uipress-lite"),
        replaceContent: __("Replace current layout", "uipress-lite"),
        addAtEndOfContent: __("Add to end of layout", "uipress-lite"),
        requires: __("Requires uipress", "uipress-lite"),
        downloadcount: __("How many times this template has been downloaded", "uipress-lite"),
        sortBy: __("Sort by", "uipress-lite"),
        include: __("Include", "uipress-lite"),
        uiTemplates: __("UI templates", "uipress-lite"),
        pages: __("Pages", "uipress-lite"),
        sections: __("Sections", "uipress-lite"),
        patterns: __("Patterns", "uipress-lite"),
        patternTitle: __("Name", "uipress-lite"),
        patternType: __("Type", "uipress-lite"),
        savePattern: __("Save pattern", "uipress-lite"),
        description: __("Description", "uipress-lite"),
        patternIcon: __("Icon", "uipress-lite"),
      },
      patternTypes: {
        layout: { name: "layout", label: __("Layout", "uipress-lite") },
        block: { name: "block", label: __("Block", "uipress-lite") },
      },
      sortby: "newest",
      typeOptions: {
        uiTemplates: {
          label: __("UI templates", "uipress-lite"),
          value: "ui-template",
          selected: true,
        },
        adminPages: {
          label: __("Admin pages", "uipress-lite"),
          value: "ui-admin-page",
          selected: true,
        },
      },
    };
  },
  watch: {
    sortby: {
      handler(newValue, oldValue) {
        this.fetchThemes();
      },
    },
    typeOptions: {
      handler(newValue, oldValue) {
        this.fetchThemes();
      },
      deep: true,
    },
  },
  mounted() {
    this.fetchThemes();
  },
  computed: {
    /**
     * Returns an array of themes filtered by type "Layout".
     *
     * @returns {Array} - Array of themes of type "Layout".
     * @since 3.2.13
     */
    returnThemes() {
      return this.themes.filter((obj) => obj.type === "Layout");
    },

    /**
     * Returns an array of themes filtered by type "Admin Page".
     *
     * @returns {Array} - Array of themes of type "Admin Page".
     * @since 3.2.13
     */
    returnPages() {
      return this.themes.filter((obj) => obj.type === "Admin Page");
    },

    /**
     * Returns an array of themes filtered by type "Section".
     *
     * @returns {Array} - Array of themes of type "Section".
     * @since 3.2.13
     */
    returnSections() {
      return this.themes.filter((obj) => obj.type === "Section");
    },

    /**
     * Returns the current sorting criteria.
     *
     * @returns {string} - The current sorting criteria.
     * @since 3.2.13
     */
    returnSortBy() {
      return this.sortby;
    },

    /**
     * Constructs and returns the filter string based on selected type options.
     *
     * @returns {string} - The filter string based on selected type options.
     * @since 3.2.13
     */
    returnFilter() {
      let filter = Object.values(this.typeOptions)
        .filter((option) => option.selected)
        .map((option) => option.value)
        .join("||");

      if (!filter) {
        this.typeOptions.uiTemplates.selected = true;
      }
      return filter;
    },
  },
  methods: {
    /**
     * Fetch available themes from the API.
     *
     * @since 3.2.13
     */
    fetchThemes() {
      this.loading = true;
      const formData = new FormData();
      const URL = `https://api.uipress.co/templates/list/?sort=${this.returnSortBy}&filter=${this.returnFilter}&v321=true`;

      this.sendServerRequest(URL, formData).then((response) => {
        this.loading = false;
        if (response.error) {
          this.uipApp.notifications.notify(response.message, "uipress-lite", "", "error", true);
        } else {
          this.themes = response;
        }
      });
    },

    /**
     * Navigate forward through theme images.
     *
     * @param {Object} theme - The theme object.
     * @since 3.2.13
     */
    navImagesForward(theme) {
      theme.imageIndex = (theme.imageIndex + 1) % theme.images.length;
    },

    /**
     * Navigate backward through theme images.
     *
     * @param {Object} theme - The theme object.
     * @since 3.2.13
     */
    navImagesBackward(theme) {
      theme.imageIndex = (theme.imageIndex - 1 + theme.images.length) % theme.images.length;
    },

    /**
     * Returns the current theme image index, initializing it if not set.
     *
     * @param {Object} theme - The theme object.
     * @returns {number} - Current theme image index.
     * @since 3.2.13
     */
    returnThemeIndex(theme) {
      if (!("imageIndex" in theme)) theme.imageIndex = 0;
      return theme.imageIndex;
    },

    /**
     * Prepare a template for cloning by generating the relevant URL.
     *
     * @param {Object} template - The template to be cloned.
     * @returns {Object} - An object containing the remote status and path.
     * @since 3.2.13
     */
    clone(template) {
      const URL = `https://api.uipress.co/templates/get/?templateid=${template.ID}`;
      return { remote: true, path: URL };
    },

    /**
     * Import a specified template.
     *
     * @param {Object} template - The template to import.
     * @param {boolean} replaceContent - Whether to replace the current content or append to it.
     * @since 3.2.13
     */
    importThis(template, replaceContent) {
      const URL = `https://api.uipress.co/templates/get/?templateid=${template.ID}`;
      const item = { remote: true, path: URL };

      if (replaceContent) {
        this.uiTemplate.content = [item];
      } else {
        this.uiTemplate.content.push(item);
      }
    },
    /**
     * Imports the given pattern into the UI template content.
     *
     * @param {Object} template - The template pattern to import.
     * @since 3.2.13
     */
    importThisPattern(template) {
      this.uiTemplate.content.push(this.clonePattern(template));
    },

    /**
     * Returns an appropriate icon based on the pattern's properties.
     *
     * @param {Object} pattern - The pattern for which to return the icon.
     * @returns {string} - The name of the icon.
     * @since 3.2.13
     */
    returnIcon(pattern) {
      if (pattern.icon && pattern.icon !== "") {
        return pattern.icon;
      }
      if (pattern.type === "layout") {
        return "account_tree";
      } else if (pattern.type === "block") {
        return "add_box";
      }
      return "interests";
    },

    /**
     * Deletes an item based on its post ID and refreshes the patterns.
     *
     * @param {number|string} postID - The ID of the post to be deleted.
     * @since 3.2.13
     */
    async deleteThisItem(postID) {
      const confirm = await this.$refs.confirm.show({
        title: __("Delete pattern", "uipress-lite"),
        message: __("Are you sure you want to delete this custom pattern?", "uipress-lite"),
        okButton: __("Delete pattern", "uipress-lite"),
      });

      if (!confirm) return;

      await deleteRemotePost(postID);
      this.uipApp.notifications.notify(__("Pattern deleted", "uipress-lite"), "", "success", true);
      this.getPatterns();
    },
    /**
     * Fetches available UI patterns.
     *
     * @since 3.2.13
     */
    getPatterns() {
      const formData = new FormData();
      formData.append("action", "uip_get_ui_patterns_list");
      formData.append("security", uip_ajax.security);

      this.sendServerRequest(uip_ajax.ajax_url, formData).then((response) => {
        if (response.error) {
          this.uipApp.notifications.notify(response.message, "uipress-lite", "", "error", true);
        }
        if (response.success) {
          this.uiTemplate.patterns = response.patterns;
        }
      });
    },

    /**
     * Clones a given block pattern, ensuring unique UIDs.
     *
     * @param {Object} block - The block pattern to clone.
     * @returns {Object} - The cloned block pattern.
     * @since 3.2.13
     */
    clonePattern(block) {
      const itemFreshIDs = this.duplicateBlock(block.template);
      return JSON.parse(JSON.stringify(itemFreshIDs));
    },

    /**
     * Duplicates a block, generating new UIDs for it and its children.
     *
     * @param {Object} block - The block to duplicate.
     * @returns {Object} - The duplicated block with new UIDs.
     * @since 3.2.13
     */
    duplicateBlock(block) {
      const item = { ...block };
      item.uid = this.createUID();
      item.options = [];
      item.settings = JSON.parse(JSON.stringify(item.settings));

      if (item.content) {
        item.content = this.duplicateChildren(item.content);
      }

      return item;
    },

    /**
     * Duplicates the children blocks, generating new UIDs for them.
     *
     * @param {Array} content - The children blocks to duplicate.
     * @returns {Array} - The duplicated children blocks with new UIDs.
     * @since 3.2.13
     */
    duplicateChildren(content) {
      return content.map((block) => {
        const item = { ...block };
        item.uid = this.createUID();
        item.settings = JSON.parse(JSON.stringify(item.settings));

        if (item.content) {
          item.content = this.duplicateChildren(item.content);
        }

        return item;
      });
    },
  },
  template: `
    
    <div class="uip-background-default uip-flex uip-flex-column uip-border-box uip-max-h-100p">
        
        <div v-if="loading" class="uip-padding-m uip-flex uip-flex-center uip-flex-middle"><loading-chart></loading-chart></div>
        
		    <div v-else class="uip-flex uip-flex-column uip-h-100p uip-max-h-100p uip-row-gap-xs">
            
            
            
            <!--Ui templates-->
            <screenOverlay class="uip-w-100p"> 
            
              <template v-slot:trigger>
                <div class="uip-flex uip-gap-s uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-flex-center">
                
                    <div class="uip-icon uip-text-xl uip-background-muted uip-border-rounder uip-padding-xxs">
                      space_dashboard
                    </div>   
                    <div class="uip-text-emphasis uip-flex-grow">{{strings.uiTemplates}}</div>             
                    
                    <div class="uip-icon uip-text-l">chevron_right</div>
                </div>
              </template>
              
              <template v-slot:content>
                
                
                  <uip-draggable 
                  :list="returnThemes" 
                  class="uip-padding-m uip-flex uip-flex-column uip-row-gap-m"
                  handle=".uip-block-drag"
                  :group="{ name: 'uip-blocks', pull: 'clone', put: false, revertClone: true }"
                  animation="300"
                  :sort="false"
                  :clone="clone"
                  itemKey="name"
                  >
                    <template v-for="(theme, index) in returnThemes" :key="theme.ID" :index="index">
                    
                        <div class="uip-cursor-pointer">
                        
                          <div class="uip-flex uip-flex-column uip-row-gap-xs">
                          
                              
                              <div class="uip-w-100p uip-border-rounder uip-ratio-16-10 uip-block-drag uip-background-grey uip-background-no-repeat uip-background-center uip-background-cover" :style="'background-image:url(' + theme.images[returnThemeIndex(theme)] + ');'" >
                              </div>
                              
                              <div class="uip-flex uip-gap-xs uip-flex-center">
                              
                                <div class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-icon" @click="theme.showInfo = !theme.showInfo">lightbulb</div>
                                <div class="uip-flex-grow uip-text-bold">{{theme.name}}</div>
                                
                                <div v-if="theme.images.length > 1" class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-icon uip-text-l" @click="navImagesBackward(theme)">chevron_left</div>
                                <div v-if="theme.images.length > 1" class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-icon uip-text-l" @click="navImagesForward(theme)">chevron_right</div>
                                
                                <div class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-icon uip-text-l" @click="importThis(theme, true)">download</div>
                              </div>
                              
                              <template v-if="theme.showInfo">
                              
                                <div class="uip-text-muted" style="line-height:1.6">
                                  {{theme.description}}
                                </div>
                                
                                <div class="uip-flex uip-flex-gap-xs uip-flex-between">
                                  
                                  <div class="uip-text-xs uip-background-primary-wash uip-border-rounder uip-padding-left-xxxs uip-padding-right-xxxs uip-flex uip-flex-row uip-gap-xxs uip-flex-center">
                                    <span class="uip-icon">file_download</span>
                                    <span>{{theme.downloads}}</span>
                                  </div>
                                  
                                  <div class="uip-text-muted uip-text-s">
                                    {{strings.createdBy}} <a href="https://uipress.co" class="uip-link-default">{{theme.created_by}}</a>
                                  </div>
                                  
                                </div>
                              
                              </template>
                            
                            
                          </div>
                        </div>
                      
                    </template>
                  
                  </uip-draggable>
                
                
              </template>
            
            </screenOverlay>
            
            
            
            <!--Ui Pages-->
            <screenOverlay class="uip-w-100p">
            
              <template v-slot:trigger>
                <div class="uip-flex uip-gap-s uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-flex-center">
                
                    <div class="uip-icon uip-text-xl uip-background-muted uip-border-rounder uip-padding-xxs">
                      article
                    </div>   
                    <div class="uip-text-emphasis uip-flex-grow">{{strings.pages}}</div>             
                    
                    <div class="uip-icon uip-text-l">chevron_right</div>
                </div>
              </template>
              
              <template v-slot:content>
                
                <uip-draggable 
                :list="returnPages" 
                class="uip-padding-m uip-flex uip-flex-column uip-row-gap-m"
                handle=".uip-block-drag"
                :group="{ name: 'uip-blocks', pull: 'clone', put: false, revertClone: true }"
                animation="300"
                :sort="false"
                :clone="clone"
                itemKey="name"
                >
                  <template v-for="(theme, index) in returnPages" :key="theme.ID" :index="index">
                  
                      <div class="uip-cursor-pointer">
                      
                        <div class="uip-flex uip-flex-column uip-row-gap-xs">
                        
                            
                            <div class="uip-w-100p uip-border-rounder uip-ratio-16-10 uip-block-drag uip-background-grey uip-background-no-repeat uip-background-center uip-background-cover" :style="'background-image:url(' + theme.images[returnThemeIndex(theme)] + ');'" >
                            </div>
                            
                            <div class="uip-flex uip-gap-xs uip-flex-center">
                            
                              <div class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-icon" @click="theme.showInfo = !theme.showInfo">lightbulb</div>
                              <div class="uip-flex-grow uip-text-bold">{{theme.name}}</div>
                              
                              <div v-if="theme.images.length > 1" class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-icon uip-text-l" @click="navImagesBackward(theme)">chevron_left</div>
                              <div v-if="theme.images.length > 1" class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-icon uip-text-l" @click="navImagesForward(theme)">chevron_right</div>
                              
                              <div class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-icon uip-text-l" @click="importThis(theme, true)">download</div>
                            </div>
                            
                            <template v-if="theme.showInfo">
                            
                              <div class="uip-text-muted" style="line-height:1.6">
                                {{theme.description}}
                              </div>
                              
                              <div class="uip-flex uip-flex-gap-xs uip-flex-between">
                                
                                <div class="uip-text-xs uip-background-primary-wash uip-border-rounder uip-padding-left-xxxs uip-padding-right-xxxs uip-flex uip-flex-row uip-gap-xxs uip-flex-center">
                                  <span class="uip-icon">file_download</span>
                                  <span>{{theme.downloads}}</span>
                                </div>
                                
                                <div class="uip-text-muted uip-text-s">
                                  {{strings.createdBy}} <a href="https://uipress.co" class="uip-link-default">{{theme.created_by}}</a>
                                </div>
                                
                              </div>
                            
                            </template>
                          
                          
                        </div>
                      </div>
                    
                  </template>
                
                </uip-draggable>
                
              </template>
            
            </screenOverlay>
            
            
            
            
            <!--sections-->
            <screenOverlay class="uip-w-100p" >
            
              <template v-slot:trigger>
                <div class="uip-flex uip-gap-s uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-flex-center">
                
                    <div class="uip-icon uip-text-xl uip-background-muted uip-border-rounder uip-padding-xxs">
                      calendar_view_day
                    </div>   
                    <div class="uip-text-emphasis uip-flex-grow">{{strings.sections}}</div>             
                    
                    <div class="uip-icon uip-text-l">chevron_right</div>
                </div>
              </template>
              
              <template v-slot:content>
                
                <uip-draggable 
                :list="returnSections" 
                class="uip-padding-m uip-flex uip-flex-column uip-row-gap-m"
                handle=".uip-block-drag"
                :group="{ name: 'uip-blocks', pull: 'clone', put: false, revertClone: true }"
                animation="300"
                :sort="false"
                :clone="clone"
                itemKey="name"
                >
                  <template v-for="(theme, index) in returnSections" :key="theme.ID" :index="index">
                  
                      <div class="uip-cursor-pointer">
                      
                        <div class="uip-flex uip-flex-column uip-row-gap-xs">
                        
                            <div class="uip-w-100p uip-border-rounder uip-ratio-16-10 uip-block-drag uip-background-grey uip-background-no-repeat uip-background-center" :style="'background-image:url(' + theme.images[returnThemeIndex(theme)] + ');background-size:90%;'" >
                            </div>
                            
                            <div class="uip-flex uip-gap-xs uip-flex-center">
                            
                              <div class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-icon" @click="theme.showInfo = !theme.showInfo">lightbulb</div>
                              <div class="uip-flex-grow uip-text-bold">{{theme.name}}</div>
                              
                              <div v-if="theme.images.length > 1" class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-icon uip-text-l" @click="navImagesBackward(theme)">chevron_left</div>
                              <div v-if="theme.images.length > 1" class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-icon uip-text-l" @click="navImagesForward(theme)">chevron_right</div>
                              
                              <div class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-icon uip-text-l" @click="importThis(theme)">download</div>
                            </div>
                            
                            <template v-if="theme.showInfo">
                            
                              <div class="uip-text-muted" style="line-height:1.6">
                                {{theme.description}}
                              </div>
                              
                              <div class="uip-flex uip-flex-gap-xs uip-flex-between">
                                
                                <div class="uip-text-xs uip-background-primary-wash uip-border-rounder uip-padding-left-xxxs uip-padding-right-xxxs uip-flex uip-flex-row uip-gap-xxs uip-flex-center">
                                  <span class="uip-icon">file_download</span>
                                  <span>{{theme.downloads}}</span>
                                </div>
                                
                                <div class="uip-text-muted uip-text-s">
                                  {{strings.createdBy}} <a href="https://uipress.co" class="uip-link-default">{{theme.created_by}}</a>
                                </div>
                                
                              </div>
                            
                            </template>
                          
                          
                        </div>
                      </div>
                    
                  </template>
                
                </uip-draggable>
                
              </template>
            
            </screenOverlay>
            
            
            
            <div class="uip-border-top uip-margin-top-s uip-margin-bottom-s"></div>
            
            
            
            
            <!--Patterns-->
            <screenOverlay class="uip-w-100p">
            
              <template v-slot:trigger>
                <div class="uip-flex uip-gap-s uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-flex-center">
                
                    <div class="uip-icon uip-text-xl uip-background-muted uip-border-rounder uip-padding-xxs">
                      texture
                    </div>   
                    <div class="uip-text-emphasis uip-flex-grow">{{strings.patterns}}</div>             
                    
                    <div class="uip-icon uip-text-l">chevron_right</div>
                </div>
              </template>
              
              <template v-slot:content>
              
                <p v-if="uiTemplate.patterns.length < 1" class="uip-padding-m uip-text-muted uip-text-center">No patterns created yet</p>
                
                <uip-draggable 
                :list="uiTemplate.patterns" 
                class="uip-padding-s uip-flex uip-flex-column uip-row-gap-s"
                handle=".uip-block-drag"
                :group="{ name: 'uip-blocks', pull: 'clone', put: false, revertClone: true }"
                animation="300"
                :sort="false"
                :clone="clonePattern"
                itemKey="name"
                >
                  <template v-for="(theme, index) in uiTemplate.patterns" :key="theme.id" :index="index">
                      
                        <div class="uip-flex uip-flex-column uip-block-drag uip-row-gap-xs">
                        
                            <div class="uip-flex uip-gap-xs uip-flex-center hover:uip-background-grey uip-padding-xxs uip-border-rounder uip-cursor-pointer" @dblclick="importThisPattern(theme)">
                            
                              <div class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-icon uip-text-l">{{returnIcon(theme)}}</div>
                              <div class="uip-flex-grow uip-text-bold">{{theme.name}}</div>
                              
                              <div v-if="!theme.editing" class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-icon" @click="theme.editing = true">edit</div>
                              <div v-if="theme.editing" class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-icon uip-text-green" @click="theme.editing = false">done</div>
                              
                              <div class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-icon" @click="deleteThisItem(theme.id)">delete</div>
                            </div>
                            
                            <div v-if="theme.editing" class="uip-grid-col-1-3 uip-padding-s uip-padding-right-remove">
                              
                              <!--Name -->
                              <div class="uip-flex uip-flex-center">
                                <div class="uip-text-s uip-text-muted">{{strings.patternTitle}}</div>
                              </div>
                              <div class="uip-flex uip-flex-center">
                                <input class="uip-input uip-input-small uip-w-100p" type="text" v-model="theme.name">
                              </div>
                              
                              <!--Icon-->
                              <div class="uip-flex uip-flex-center">
                                <div class="uip-text-s uip-text-muted">{{strings.patternIcon}}</div>
                              </div>
                              <div class="uip-flex uip-flex-center">
                                <icon-select :value="{value: theme.icon}" :returnData="function(data) {theme.icon = data.value}"/>
                              </div>
                              
                              <!--Description-->
                              <div class="uip-flex uip-flex-center">
                                <div class="uip-text-s uip-text-muted">{{strings.description}}</div>
                              </div>
                              <div class="uip-flex uip-flex-center">
                                <textarea class="uip-input uip-w-100p" rows="4" v-model="theme.description"></textarea>
                              </div>
                              
                              <!--Description-->
                              <div class="uip-flex uip-flex-center">
                                <div class="uip-text-s uip-text-muted">{{strings.patternType}}</div>
                              </div>
                              <div class="uip-flex uip-flex-center">
                                <toggle-switch :options="patternTypes" :activeValue="theme.type" :returnValue="function(data){ theme.type = data}"></toggle-switch>
                              </div>
                              
                            
                            </div>
                            
                        </div>
                    
                  </template>
                
                </uip-draggable>
                
              </template>
            
            </screenOverlay>
            
            
            
          
        </div>
        
        <Confirm ref="confirm"/>
      </div>`,
};
