const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from "../../libs/vue-esm.js";
export default {
  components: {
    Modal: defineAsyncComponent(() => import("../v3.5/utility/modal.min.js?ver=3.3.1")),
    Variables: defineAsyncComponent(() => import("./variables.min.js?ver=3.3.1")),
  },
  props: {
    args: Object,
    triggerClass: String, // Allows custom classes to be set on the trigger container
  },
  data() {
    return {
      modelOpen: true,
      themeLoading: false,
      themes: [],
      saving: false,
      finished: false,
      strings: {
        setupWizard: __("Setup wizard", "uipress-lite"),
        previous: __("Previous", "uipress-lite"),
        next: __("Next", "uipress-lite"),
        finish: __("Finish", "uipress-lite"),
        siteLogo: __("Site logo", "uipress-lite"),
        siteLogoDarkMode: __("Site logo dark mode"),
        appliesTo: __("Applies to", "uipress-lite"),
        excludes: __("Excludes", "uipress-lite"),
        selectUsersAndRoles: __("Select users and roles", "uipress-lite"),
        searchUsersAndRoles: __("Search users and roles", "uipress-lite"),
        loginLogo: __("Login logo", "uipress-lite"),
        loginBackground: __("Login background", "uipress-lite"),
        enableLoginTheme: __("Enable login theme", "uipress-lite"),
        setupComplete: __("Setup complete!", "uipress-lite"),
        finishedDescription: __("Settings from the wizard have been saved to your site. If you chose a admin template you will need to reload the page to use it."),
        newAdmin: __("Refresh admin", "uipress-lite"),
        close: __("Exit", "uipress-lite"),
        lightMode: __("Light mode", "uipress-lite"),
        darkMode: __("Dark mode", "uipress-lite"),
      },
      currentStep: 1,
      steps: [
        {
          key: 1,
          title: __("Site logo", "uipress-lite"),
          description: __("Choose a logo for the admin area.", "uipress-lite"),
        },
        {
          key: 2,
          title: __("Template", "uipress-lite"),
          description: __("Choose a template for the admin area. This can be editied after the intiial setup.", "uipress-lite"),
        },
        {
          key: 3,
          title: __("Theme styles", "uipress-lite"),
          description: __("Choose your colors and styles to run through the admin area.", "uipress-lite"),
        },
        {
          key: 4,
          title: __("Applies to", "uipress-lite"),
          description: __("Choose who you want to use the new admin template", "uipress-lite"),
        },
        {
          key: 5,
          title: __("Login page", "uipress-lite"),
          description: __("Use the options below to customise your login page.", "uipress-lite"),
        },
      ],
      setupDetails: {
        logo: false,
        darkLogo: false,
        appliesTo: [],
        excludes: [],
        loginLogo: false,
        loginBackground: false,
        enableLoginTheme: false,
        chosenTemplate: false,
      },
    };
  },

  watch: {
    currentStep: {
      handler(newValue, oldValue) {
        if (newValue == 2) {
          this.fetchThemes();
        }
      },
    },
  },
  computed: {
    /**
     * Returns filtered theme list of layouts
     *
     * @since 3.2.13
     */
    returnThemes() {
      return this.themes.filter(function (theme) {
        return theme.type == "Layout";
      });
    },
  },
  methods: {
    /**
     * Returns whether the tips are finished
     *
     * @since 3.2.13
     */
    returnFinished() {
      return this.finished;
    },

    /**
     * Fetches themes from uipress servers
     *
     * @since 3.2.13
     */
    async fetchThemes() {
      this.themeLoading = true;
      let formData = new FormData();
      let URL = "https://api.uipress.co/templates/list/" + "?sort=newest&filter=ui-template&v321=true";

      const response = await this.sendServerRequest(URL, formData);

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "uipress-lite", "", "error", true);
        this.themeLoading = false;
      }

      this.themeLoading = false;
      this.themes = response;
    },

    /**
     * Close setup wizard
     *
     * @since 3.2.13
     */
    closeThisComponent() {
      this.$router.push("/");
    },

    /**
     * Finsihes setup process
     *
     * @since 3.2.13
     */
    finishSetup() {
      // Exit if we are currently saving
      if (this.saving == true) return;

      this.saving = true;

      if (this.setupDetails.chosenTemplate) {
        this.getTemplate();
      } else {
        this.saveSettings();
      }
    },

    /**
     * Gets chosen template ready for import
     *
     * @since 3.2.13
     */
    async getTemplate() {
      let formData = new FormData();
      let URL = "https://api.uipress.co/templates/get/?templateid=" + this.setupDetails.chosenTemplate;
      let notiID = this.uipApp.notifications.notify(__("Importing template", "uipress-lite"), "", "default", false, true);

      const response = await this.sendServerRequest(URL, formData);

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "", "error", true);
        this.uipApp.notifications.remove(notiID);
        this.saveSettings();
      }

      this.uipApp.notifications.remove(notiID);
      this.setupDetails.templateJSON = response;
      this.saveSettings();
    },

    /**
     * Saves settings from wizard and sends to server
     *
     * @since 3.2.13
     */
    async saveSettings() {
      const settings = this.prepareJSON(this.setupDetails);

      const notiID = this.uipApp.notifications.notify(__("Confirguring settings", "uipress-lite"), "", "default", false, true);

      let formData = new FormData();
      formData.append("action", "uip_save_from_wizard");
      formData.append("security", uip_ajax.security);
      formData.append("settings", settings);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);
      this.uipApp.notifications.remove(notiID);
      this.saving = false;
      this.uipApp.notifications.notify("Setup complete", "", "success", true);
      this.finished = true;
    },

    /**
     * Refreshes the page to the home admin
     *
     * @since 3.2.13
     */
    refreshAdmin() {
      window.location.assign(this.uipApp.data.options.adminURL);
    },

    /**
     * Returns active step index for theme images
     *
     * @param {object} theme - theme object
     * @since 3.2.13
     */
    returnActiveIndex(theme) {
      if (!("activeIndex" in theme)) theme.activeIndex = 0;
      return theme.activeIndex;
    },
  },
  template: `
    
    
     <Modal :startOpen="true">
     
        <div ref="uipmodal" class="uip-flex uip-flex-column uip-row-gap-m uip-scale-in uip-w-500 uip-padding-m">
          
          
          <!-- title -->
          <div class="uip-flex uip-flex-between uip-flex-center">
            <div class="uip-text-bold">{{strings.setupWizard}}</div>
            <div class="uip-icon uip-link-muted uip-padding-xxs uip-border-round hover:uip-background-muted" @click="closeThisComponent()">close</div>
          </div>
          <!-- end title -->
          
          
         
          <template v-if="returnFinished()">
          
            <div class=" uip-text-center uip-flex uip-flex-column uip-row-gap-s">
              <div class="uip-icon uip-text-green" style="font-size:80px">check_circle</div>
              <div class="uip-text-bold uip-margin-bottom-xxs uip-text-xl">{{strings.setupComplete}}</div>
              <div class="uip-text-muted">{{strings.finishedDescription}}</div>
            </div>
            
            <div class="uip-flex uip-gap-xs uip-padding-remove-top uip-flex-between">
            
              <button class="uip-button-default" @click="closeThisComponent">{{strings.close}}</button>
              
              <button class="uip-button-primary" @click="refreshAdmin()">{{strings.newAdmin}}</button>
                
            </div>
            
          </template>
          
          <template v-else>
          
            <!-- step display --> 
            <div class="uip-flex uip-flex-middle">
              <div class="uip-flex uip-flex-row uip-flex-between uip-flex-center uip-w-250">
                <template v-for="step in steps">
                  <div class="uip-border-circle uip-w-22 uip-ratio-1-1 uip-background-muted uip-flex uip-flex-center uip-flex-middle uip-transition-all uip-link-default" :class="{'uip-text-inverse uip-background-primary' : currentStep == step.key || currentStep > step.key}" @click="currentStep = step.key">
                    <span>{{step.key}}</span>
                  </div>
                  
                  <div v-if="step.key < steps.length" class="uip-flex-grow uip-background-grey uip-transition-all"
                  :class="{'uip-background-primary' : currentStep > step.key}" style="height:1px"></div>
                </template>
              </div>
            </div>
            <!-- End step display -->
          
            <!-- Description -->
            
            <div class=" uip-padding-remove-top uip-text-center">
              <div class="uip-text-bold uip-margin-bottom-xxs uip-text-l">{{steps[currentStep - 1].title}}</div>
              <div class="uip-text-muted">{{steps[currentStep - 1].description}}</div>
            </div>
            
            <!-- End description -->
            
            <!--Step 1 -->
            <div v-if="currentStep == 1" class="uip-grid-col-1-3  uip-padding-remove-top uip-fade-in">
            
                <div class="uip-text-muted uip-flex uip-flex-center">{{strings.lightMode}}</div>
                <inline-image-select :value="setupDetails.logo" :returnData='function(d){ setupDetails.logo = d}' :args="{ hasPositioning: false }"></inline-image-select>
                
                <div class="uip-text-muted uip-flex uip-flex-center">{{strings.darkMode}}</div>
                <inline-image-select :value="setupDetails.darkLogo" :returnData='function(d){ setupDetails.darkMode = d}' :args="{ hasPositioning: false }"></inline-image-select>
                
            </div>
            
            <!--Step 2 -->
            <div v-if="currentStep == 2" class="uip-flex uip-flex-column uip-row-gap-m uip-max-h-500 uip-overflow-auto uip-scrollbar  uip-padding-remove-top uip-fade-in uip-max-w-100p">
              
              <div v-if="themeLoading" class="uip-padding-m uip-flex uip-flex-center uip-flex-middle"><loading-chart></loading-chart></div>
              
              <div v-else class="uip-flex uip-flex-column uip-row-gap-m uip-flex-grow uip-max-w-100p" >
                <template v-for="theme in returnThemes">
                
                    <div class="uip-border-round uip-cursor-pointer uip-pattern-drag">
                      <div class="uip-flex uip-flex-column uip-row-gap-xs uip-flex-left">
                        <img :src="theme.images[returnActiveIndex(theme)]" :alt="theme.theme_title" class="uip-w-100p uip-h-100p uip-border uip-border-round uip-ratio-16-10">
                        
                        <div class="uip-flex uip-flex-row uip-gap-xs">
                          <template v-for="(item, index) in theme.images">
                            <div class="uip-w-32 uip-ratio-1-1 uip-border-round uip-background-muted uip-background-cover uip-border uip-border-box" @click="theme.activeIndex = index"
                            :style="'background-image: url(' + item + ')'" :class="{'uip-border-primary' : returnActiveIndex(theme) == index}"></div>
                          </template>
                        </div>
                        
                        <div class="uip-flex uip-flex-column uip-row-gap-xxxs uip-flex-shrink">
                          <div class="uip-flex uip-flex-between uip-margin-bottom-xs">
                            <div class="uip-flex uip-flex-row uip-gap-xxs uip-flex-center">
                              <span class="uip-text-emphasis uip-text-bold uip-text-l">{{theme.name}}</span>
                              <div class="uip-flex uip-flex-row uip-gap-xxs uip-flex-center">
                                <span class="uip-text-xs uip-background-primary-wash uip-border-round uip-padding-xxxs uip-post-type-label">{{theme.type}}</span>
                                <uip-tooltip :message="strings.downloadcount">
                                  <div class="uip-text-xs uip-background-primary-wash uip-border-round uip-padding-xxxs uip-post-type-label uip-flex uip-flex-row uip-gap-xxxs">
                                    <span class="uip-icon">file_download</span>
                                    {{theme.downloads}}
                                  </div>
                                </uip-tooltip>
                              </div>
                            </div>
                          </div>
                          <div class="uip-text-s uip-text-muted uip-max-w-100p uip-margin-bottom-xs">{{theme.description}}</div>
                          <button v-if="setupDetails.chosenTemplate != theme.ID" class="uip-button-default uip-flex-left" @click.stop="setupDetails.chosenTemplate = theme.ID">Select this template</button>
                          <button v-else class="uip-button-secondary uip-flex-left">Selected</button>
                        </div>
                      </div>
                    </div>
                    
                </template>
              </div>
              
            </div>
            
            <!--Step 3 -->
            <div v-if="currentStep == 3" class="uip-flex uip-flex-column uip-row-gap-m uip-max-h-500 uip-overflow-auto  uip-padding-remove-top uip-fade-in">
              <Variables/>
            </div>
            
            
            <!--Step 4 -->
            <div v-if="currentStep == 4" class="uip-grid-col-1-3  uip-padding-remove-top uip-fade-in">
                
                <div class="uip-text-muted uip-flex uip-flex-center">{{strings.appliesTo}}</div>
                <user-role-select :selected="setupDetails.appliesTo" 
                :placeHolder="strings.selectUsersAndRoles" 
                :searchPlaceHolder="strings.searchUsersAndRoles" :single="false" 
                :updateSelected="function(data){setupDetails.appliesTo = data}"></user-role-select>
              
                <div class="uip-text-muted uip-flex uip-flex-center">{{strings.excludes}}</div>
                <user-role-select :selected="setupDetails.excludes" 
                :placeHolder="strings.selectUsersAndRoles" 
                :searchPlaceHolder="strings.searchUsersAndRoles" :single="false" 
                :updateSelected="function(data){setupDetails.excludes = data}"></user-role-select>
                
                
            </div>
            
            <!--Step 5 -->
            <div v-if="currentStep == 5" class="uip-grid-col-1-3  uip-padding-remove-top uip-fade-in">
              
              <div class="uip-text-muted uip-flex uip-flex-center">{{strings.enableLoginTheme}}</div>
              <switch-select :value="setupDetails.enableLoginTheme" :returnData='function(d){ setupDetails.enableLoginTheme = d}' :args="{asText: true}"></switch-select>
            
              <div class="uip-text-muted uip-flex uip-flex-center">{{strings.loginLogo}}</div>
              <inline-image-select :value="setupDetails.loginLogo" :returnData='function(d){ setupDetails.loginLogo = d}' :args="{ hasPositioning: false }"></inline-image-select>
           
              <div class="uip-text-muted uip-flex uip-flex-center">{{strings.loginBackground}}</div>
              <inline-image-select :value="setupDetails.loginBackground" :returnData='function(d){ setupDetails.loginBackground = d}' :args="{ hasPositioning: false }"></inline-image-select>
              
            </div>
            
            
            
            <!--Navigation -->
            
            <div class="uip-flex uip-gap-xs">
              <button class="uip-button-default" @click.stop.prevent="currentStep -= 1"
              :disabled="currentStep <= 1">{{strings.previous}}</button>
              <button v-if="currentStep < steps.length" class="uip-button-default" @click.stop.prevent="currentStep += 1">{{strings.next}}</button>
              
              <button type="button" v-if="currentStep == steps.length" class="uip-button-primary uip-flex- uip-flex-center uip-gap-xxs uip-position-relative" @click.stop.prevent="finishSetup()">
              
                <span v-if="!saving">{{strings.finish}}</span>
                <div class="uip-position-relative" v-if="saving">
                  <span class="uip-load-spinner"></span>
                </div>
              
              </button>
              
            </div>
          
          </template>
          
          <!--End of navigation-->
          
          
        </div>
      </Modal>
    
    `,
};
