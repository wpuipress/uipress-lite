/**
 * Builds the main ui builder shell
 * @since 3.0.0
 */
import { defineAsyncComponent } from "../../libs/vue-esm.js";
const { __, _x, _n, _nx } = wp.i18n;

/**
 * Toggle section
 *
 * @since 3.2.13
 */
const ToggleSection = {
  props: {
    title: String,
    startOpen: Boolean,
  },
  data() {
    return {
      open: false,
    };
  },
  mounted() {
    if (this.startOpen) this.open = true;
  },
  computed: {
    /**
     * Returns the icon depending on open status
     *
     * @since 3.2.13
     */
    returnVisibilityIcon() {
      if (this.open) return "expand_more";
      if (!this.open) return "chevron_left";
    },
  },
  methods: {
    /**
     * Toggles section visibility
     *
     * @since 3.2.13
     */
    toggleVisibility() {
      this.open = !this.open;
    },
  },
  template: `
  
    <div class="uip-flex uip-flex-column uip-row-gap-s">
    
      <!-- Title -->
      <div class="uip-flex uip-gap-s uip-flex-center uip-flex-between">
        
       
        <div class="uip-flex uip-gap-xxs uip-flex-center uip-cursor-pointer uip-flex-between uip-flex-grow"
        @click="toggleVisibility()">
          
          
          <span class="uip-text-bold uip-text-emphasis">{{ title }}</span> 
          
          <a class="uip-link-muted uip-icon">{{ returnVisibilityIcon }}</a>
          
          
        </div>
      
      </div>
      
      <div v-if="open" class="uip-padding-left-s">
        <slot></slot>
      </div>
      
    </div>
  
  `,
};

export default {
  components: {
    globalVariables: defineAsyncComponent(() => import("./variables.min.js?ver=3.3.1")),
    ToggleSection: ToggleSection,
  },
  data() {
    return {
      loading: true,
      templateID: this.$route.params.templateID,
      mode: "light",
      menu: this.uipApp.data.adminMenu.menu,
      ui: {
        sideBar: {
          activeTab: "settings",
        },
        strings: {
          themeStyles: __("Theme styles"),
          revertStyle: __("Revert style back to default", "uipress-lite"),
          appliesTo: __("Applies to", "uipress-lite"),
          excludes: __("Excludes", "uipress-lite"),
          templateType: __("Template type", "uipress-lite"),
          uiTemplate: __("User template (admin theme)", "uipress-lite"),
          adminPage: __("Admin Page", "uipress-lite"),
          toolBar: __("Frontend toolbar", "uipress-lite"),
          loginPage: __("Login page", "uipress-lite"),
          appliesToSelfTitle: __("Template will now load for you!", "uipress-lite"),
          appliesToSelf: __("Take care not to revoke access to anything you may need in the admin.", "uipress-lite"),
          appliesToSelfMeta: __("If you haven't already, we recommend setting up:", "uipress-lite"),
          safeMode: __("safe mode", "uipress-lite"),
          customCSS: __("CSS", "uipress-lite"),
          customJS: __("Javascript", "uipress-lite"),
          light: __("Light", "uipress-lite"),
          dark: __("Dark", "uipress-lite"),
          templateName: __("Template name", "uipress-lite"),
          active: __("Active", "uipress-lite"),
          selectUsersAndRoles: __("Users and roles", "uipress-lite"),
          searchUsersAndRoles: __("Search users and roles", "uipress-lite"),
          custom: __("custom", "uipress-lite"),
          menuIcon: __("Menu icon", "uipress-lite"),
          addToSubmenu: __("Add to submenu", "uipress-lite"),
          noneTopLevel: __("None (top level)", "uipress-lite"),
          applyToSubsites: __("Apply to subsites", "uipress-lite"),
          watchOut: __("Is this an admin page?", "uipress-lite"),
          watchOutDescription: __(
            "This template does not contain a content block. The content block is key to navigating the admin. Setting this live as a uiTemplate can cause a lock out.",
            "uipress-lite"
          ),
          pageLink: __("Link", "uipress-lite"),
          name: __("Name", "uipress-lite"),
          type: __("Type", "uipress-lite"),
          templateSettings: __("Template settings", "uipress-lite"),
          status: __("Status", "uipress-lite"),
          general: __("General", "uipress-lite"),
          slug: __("Slug", "uipress-lite"),
          content: __("Content", "uipress-lite"),
          theme: __("Theme", "uipress-lite"),
          helpTab: __("Help tab", "uipress-lite"),
          screenOptions: __("Screen options", "uipress-lite"),
          pluginNotices: __("Plugin notices", "uipress-lite"),
          adminTheme: __("Admin theme", "uipress-lite"),
          frameDescription: __("The following options will only take effect on live templates.", "uipress-lite"),
        },
      },
      enabledDisabled: {
        false: {
          value: false,
          label: __("Disabled", "uipress-lite"),
        },
        true: {
          value: true,
          label: __("Enabled", "uipress-lite"),
        },
      },
      showHide: {
        false: {
          value: false,
          label: __("Hide", "uipress-lite"),
        },
        true: {
          value: true,
          label: __("Show", "uipress-lite"),
        },
      },
      switchOptions: {
        light: {
          value: "light",
          label: __("Light", "uipress-lite"),
        },
        dark: {
          value: "dark",
          label: __("Dark", "uipress-lite"),
        },
      },
      newVariable: {
        label: "",
        var: "",
      },
    };
  },
  inject: ["uiTemplate"],
  watch: {
    "uiTemplate.globalSettings.slug": {
      handler() {
        this.handleSlugChange();
      },
    },
  },
  async mounted() {
    this.loading = false;
    setTimeout(this.mountHandlers, 100);
    this.setDefaults();
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickEvents);
  },
  computed: {
    /**
     * Returns list of menu items for admin page sub selector
     *
     * @since 3.2.13
     */
    returnFormatedMenu() {
      return this.menu
        .filter((item) => item.type !== "sep")
        .map(({ uid, url, name }) => {
          return {
            name: uid,
            url: url,
            label: name.replace(/<[^>]*>?/gm, ""),
          };
        });
    },
    /**
     * Returns whether the template has a page content block or not
     *
     * @returns {boolean}
     * @since 3.2.13
     */
    isTemplateWithoutFrame() {
      let templateType = this.uiTemplate.globalSettings.type;

      // Exit early
      if (templateType != "ui-template") return false;
      if (this.uiTemplate.content.length > 0) {
        let templateString = JSON.stringify(this.uiTemplate.content);

        // Template doesn't include a uip-content block
        if (!templateString.includes("uip-content")) return true;
      }

      return false;
    },

    /**
     * Returns link to current admin page
     *
     * @since 3.2.13
     */
    returnPageLink() {
      const title = this.uiTemplate.globalSettings.slug ? this.uiTemplate.globalSettings.slug : this.uiTemplate.globalSettings.name + "-uiptp-" + this.$route.params.templateID;
      return this.uipApp.data.options.adminURL + "admin.php?page=" + this.formatPageName(title);
    },
  },
  methods: {
    /**
     * Sets up defaults for template settings
     *
     * @since 3.3.095
     */
    setDefaults() {
      if (!this.isObject(this.uiTemplate.globalSettings)) this.uiTemplate.globalSettings = {};

      if (!("contentTheme" in this.uiTemplate.globalSettings)) this.uiTemplate.globalSettings.contentTheme = true;
      if (!("helpTab" in this.uiTemplate.globalSettings)) this.uiTemplate.globalSettings.helpTab = false;
      if (!("screenOptions" in this.uiTemplate.globalSettings)) this.uiTemplate.globalSettings.screenOptions = false;
      if (!("pluginNotices" in this.uiTemplate.globalSettings)) this.uiTemplate.globalSettings.pluginNotices = false;
    },

    /**
     * Mounts click watcher to detect outside clicks
     *
     * @since 3.3.0
     */
    mountHandlers() {
      document.addEventListener("click", this.handleClickEvents);
    },

    /**
     * Handles click events and checks if the click is outside the panel
     *
     * @param {object} evt
     * @since 3.3.0
     */
    handleClickEvents(evt) {
      const canvas = document.querySelector("#uip-preview-canvas");
      if (!evt.target || !canvas) return;
      if (canvas.contains(evt.target)) this.goBack();
    },
    /**
     * Retrieves the template option based on the provided group and option.
     * Ensures the options data structure is adhered to and initializes
     * option values based on their expected type if they do not exist.
     *
     * @param {String} group - The option group.
     * @param {Object} option - The option configuration object.
     * @returns {String|Array|Object} - The option value.
     *
     * @since 3.2.13
     */
    returnTemplateOption(group, { uniqueKey: key, accepts }) {
      const options = this.uiTemplate.globalSettings.options;

      // Ensure the group exists.
      if (!options.hasOwnProperty(group)) {
        options[group] = {};
      }

      // Exit early if the key exists
      if (options[group].hasOwnProperty(key)) {
        return options[group][key];
      }

      // Ensure the key exists within the group, initializing based on accepted type.
      let initialValue;

      switch (accepts) {
        case String:
          initialValue = "";
          break;
        case Array:
          initialValue = [];
          break;
        case Object:
          initialValue = {};
          break;
        default:
          initialValue = "";
      }

      options[group][key] = initialValue;

      return options[group][key];
    },

    /**
     * Updates a dynamic options value
     *
     * @param {string} group - the group the option belongs to
     * @param {string} key - the key name of the option
     * @param {Mixed} value - the new option value
     * @since 3.2.13
     */
    saveTemplateOption(group, key, value) {
      let options = this.uiTemplate.globalSettings.options;
      options[group][key] = value;
    },

    /**
     * Formats Page title for url
     *
     * @since 3.2.13
     */
    formatPageName(title) {
      if (!title) return "";

      title = title.toLowerCase();
      title = title.replace("~[^pLd]+~u", "-");
      title = title.replace("~[^-w]+~", "");
      title = title.trim();
      title = title.replace("~-+~", "-");
      title = title.replace(" ", "-");
      return title;
    },

    /**
     * Ensure slug is url safe
     *
     * @since 3.2.0
     */
    handleSlugChange() {
      const name = this.uiTemplate.globalSettings.slug;
      this.uiTemplate.globalSettings.slug = this.formatPageName(name);
    },

    /**
     * Exits template settings
     *
     * @since 3.2.13
     */
    goBack() {
      const ID = this.$route.params.templateID;
      document.removeEventListener("click", this.handleClickEvents);
      this.$router.push({
        path: `/uibuilder/${ID}/`,
        query: { ...this.$route.query },
      });
    },
  },
  template: `
      <div class="uip-position-fixed uip-top-80 uip-right-16 uip-bottom-16 uip-background-default uip-w-320 uip-flex uip-flex-column uip-row-gap-s uip-overflow-auto uip-fade-in uip-shadow" style="border-radius: calc(var(--uip-border-radius-large) + var(--uip-padding-xs)); z-index: 2;"
      ref="uipTemplateSettings"
      id="uip-template-settings">
      
        <div class="uip-h-100p uip-w-100p uip-max-h-100p uip-max-w-100p uip-overflow-hidden uip-flex-grow uip-flex uip-flex-column uip-border-rounder uip-shadow uip-background-default">
        
          <!-- Block settings header -->
          <div class="uip-padding-s uip-padding-remove-bottom">
          
            <div class="uip-flex uip-gap-xxs uip-flex-center">
            
            
              <div class="uip-flex uip-flex-column uip-flex-grow">
                <div class="uip-text-bold uip-blank-input uip-text-l uip-text-emphasis">{{ui.strings.templateSettings}}</div>
              </div>
              
              <a class="uip-link-muted hover:uip-background-muted uip-border-rounder uip-icon uip-padding-xxs" @click="goBack()">close</a>
              
            </div>
            
          </div>
          <!-- End block settings header -->
          
          
        
          <div class="uip-flex uip-flex-column uip-gap-s uip-padding-s uip-flex-grow uip-overflow-auto">
            
            <div class=""></div>
            
            <ToggleSection :title="ui.strings.general" :startOpen="true">
            
              <div class="uip-flex uip-flex-column uip-row-gap-s">
                
                <div v-if="isTemplateWithoutFrame" class="uip-background-red-wash uip-border-rounder uip-text-s uip-padding-xs uip-scale-in-top uip-flex uip-flex-column uip-row-gap-xs">
                  <div class="uip-text-bold uip-text-l uip-text-emphasis">{{ui.strings.watchOut}}</div>
                  <div>{{ui.strings.watchOutDescription}}</div>
                </div>
                
                
                <div class="uip-grid-col-1-3">
                
                  <!--Status-->
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-h-30 uip-gap-xs">
                    <span>{{ui.strings.status}}</span>
                  </div>
                  <toggle-switch :options="enabledDisabled" :activeValue="uiTemplate.globalSettings.status" :dontAccentActive="true" :returnValue="function(data){ uiTemplate.globalSettings.status = data;}"/>
                  
                  <!--Name-->
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-h-30 uip-gap-xs">
                    <span>{{ui.strings.name}}</span>
                  </div>
                  <input class="uip-input uip-input-small uip-w-100p" type="text" v-model="uiTemplate.globalSettings.name" :placeholder="ui.strings.templateName">
                  
                  <!--Type-->
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-h-30 uip-gap-xs">
                    <span>{{ui.strings.type}}</span>
                  </div>
                  <select class="uip-input uip-input-small uip-w-100p" v-model="uiTemplate.globalSettings.type">
                    <option value="ui-template">{{ui.strings.uiTemplate}}</option>
                    <option value="ui-admin-page">{{ui.strings.adminPage}}</option>
                    <option value="ui-front-template">{{ui.strings.toolBar}}</option>
                  </select>
                  
                  <!--Subsites multisite only-->
                  <template v-if="uipApp.data.options.multisite && uipApp.data.options.networkActivated && uipApp.data.options.primarySite">
                    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-h-30 uip-gap-xs">
                      <span>{{ui.strings.applyToSubsites}}</span>
                    </div>
                    <toggle-switch :options="enabledDisabled" :activeValue="uiTemplate.globalSettings.applyToSubsites" :dontAccentActive="true" :returnValue="function(data){ uiTemplate.globalSettings.applyToSubsites = data;}"></toggle-switch>
                  </template>
                  
                  <!--Applies to-->
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-h-30 uip-gap-xs">
                    {{ui.strings.appliesTo}}
                  </div>
                  <user-role-select :selected="uiTemplate.globalSettings.rolesAndUsers" 
                  :placeHolder="ui.strings.selectUsersAndRoles" 
                  :searchPlaceHolder="ui.strings.searchUsersAndRoles" :single="false" 
                  :updateSelected="(d)=>uiTemplate.globalSettings.rolesAndUsers = d"></user-role-select>
                  
                  <!--Excludes to-->
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-h-30 uip-gap-xs">
                    {{ui.strings.excludes}}
                  </div>
                  <user-role-select :selected="uiTemplate.globalSettings.excludesRolesAndUsers" 
                   :placeHolder="ui.strings.selectUsersAndRoles" 
                   :searchPlaceHolder="ui.strings.searchUsersAndRoles" :single="false" 
                  :updateSelected="(d)=>uiTemplate.globalSettings.excludesRolesAndUsers = d"></user-role-select>
                  
                  
                  <!-- Admin page specific options-->
                  <template v-if="uiTemplate.globalSettings.type == 'ui-admin-page'">
                  
                    <!--Slug-->
                    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-h-30 uip-gap-xs">
                      <span>{{ui.strings.slug}}</span>
                    </div>
                    <input class="uip-input uip-input-small uip-w-100p" type="text" v-model="uiTemplate.globalSettings.slug" :placeholder="ui.strings.slug">
                  
                    <!--Menu Icon-->
                    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-h-30 uip-gap-xs">
                      <span>{{ui.strings.menuIcon}}</span>
                    </div>
                    <icon-select class="uip-w-100p" :value="uiTemplate.globalSettings.menuIcon" :returnData="function(e){uiTemplate.globalSettings.menuIcon = e}"></icon-select>
                    
                    <!--Submenu-->
                    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-h-30 uip-gap-xs">
                      <span>{{ui.strings.addToSubmenu}}</span>
                    </div>
                    <select class="uip-input" v-model="uiTemplate.globalSettings.menuParent">
                        <option value="">{{ui.strings.noneTopLevel}}</option>
                        <template v-for="item in returnFormatedMenu">
                          <option :value="item.url">{{item.label}}</option>
                        </template>
                    </select>
                    
                    <!--Page link-->
                    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-flex-start uip-padding-top-xxs">
                      <span>{{ui.strings.pageLink}}</span>
                    </div>
                    <a :href="returnPageLink" target="_BLANK" class="uip-link-muted">
                      {{returnPageLink}}
                    </a>
                  
                  </template>
                  
                  
                </div>
                  
                
                
              </div>  
            </ToggleSection>
            
            
            <!--Frame settings-->
            <template v-if="uiTemplate.globalSettings.type == 'ui-template'">
            
              <div class="uip-border-top"></div>
              
              <ToggleSection :title="ui.strings.content" :startOpen="true">
              
                <div class="uip-background-orange-wash uip-border-rounder uip-text-s uip-padding-xs uip-scale-in-top uip-flex uip-flex-column uip-row-gap-xs uip-margin-bottom-s uip-text-muted">
                  {{ui.strings.frameDescription}}
                </div>
                
                <div class="uip-grid-col-1-3">
                
                  <!--Theme enabled-->
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-h-30 uip-gap-xs">
                    <span>{{ui.strings.theme}}</span>
                  </div>
                  <toggle-switch :options="enabledDisabled" :activeValue="uiTemplate.globalSettings.contentTheme" :dontAccentActive="true" 
                  :returnValue="(data)=>{ uiTemplate.globalSettings.contentTheme = data}"/>
                  
                  <!--Help tab-->
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-h-30 uip-gap-xs">
                    <span>{{ui.strings.helpTab}}</span>
                  </div>
                  <toggle-switch :options="showHide" :activeValue="uiTemplate.globalSettings.helpTab" :dontAccentActive="true" 
                  :returnValue="(data)=>{ uiTemplate.globalSettings.helpTab = data}"/>
                  
                  <!--Screen options-->
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-h-30 uip-gap-xs">
                    <span>{{ui.strings.screenOptions}}</span>
                  </div>
                  <toggle-switch :options="showHide" :activeValue="uiTemplate.globalSettings.screenOptions" :dontAccentActive="true" 
                  :returnValue="(data)=>{ uiTemplate.globalSettings.screenOptions = data}"/>
                  
                  <!--Plugin notices-->
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-h-30 uip-gap-xs">
                    <span>{{ui.strings.pluginNotices}}</span>
                  </div>
                  <toggle-switch :options="showHide" :activeValue="uiTemplate.globalSettings.pluginNotices" :dontAccentActive="true" 
                  :returnValue="(data)=>{ uiTemplate.globalSettings.pluginNotices = data}"/>  
                
                </div>
              
              
              </ToggleSection>  
              
            </template>
            
            
            <div class="uip-border-top"></div>
            
              <!-- Theme styles -->
              <ToggleSection :title="ui.strings.themeStyles" :startOpen="true">
                <globalVariables/>
              </ToggleSection>  
              
              
              <div class="uip-border-top"></div>
              
              <!-- Dynamic settings -->
              <template v-for="group in uipApp.data.templateGroupOptions">
              
                <ToggleSection :title="group.label" :startOpen="false">
                
                    <div class="uip-grid-col-1-3">
                    
                      <!--Loop through group settings -->
                      <template v-for="option in group.settings">
                      
                        <div class=" uip-flex uip-flex-center uip-flex uip-gap-xs">
                          <span class="uip-text-muted uip-text-s">{{option.label}}</span>
                          <uip-tooltip v-if="option.help" :message="option.help">
                            <span class="uip-icon uip-border-circle uip-background-grey uip-cursor-pointer" style="font-size:12px">question_mark</span>
                          </uip-tooltip>
                        </div>
                        
                        <div class="uip-flex uip-flex-center">
                          <component :is="option.component" :value="returnTemplateOption(group.name, option)" :args="option.args"
                          :returnData="(data)=>{saveTemplateOption(group.name, option.uniqueKey, data)}"></component>
                        </div>
                        
                      </template>
                      
                      <!--End loop through group settings -->
                      
                    </div>
                    
                </ToggleSection>
                
                <div class="uip-border-top"></div>
                
              </template>
              <!-- End dynamic settings -->
            
          </div>
          
        </div>
      
      </div>`,
};
