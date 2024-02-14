const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from "../../libs/vue-esm.js";
export default {
  components: {
    contextmenu: defineAsyncComponent(() => import("../v3.5/utility/contextmenu.min.js?ver=3.3.1")),
    Confirm: defineAsyncComponent(() => import("../v3.5/utility/confirm.min.js?ver=3.3.1")),
  },
  data() {
    return {
      templates: [],
      page: 1,
      totalPages: 0,
      totalFound: 0,
      loading: false,
      initialLoading: true,
      selectAll: false,
      showWelcome: true,
      search: "",
      strings: {
        templates: __("Templates", "uipress-lite"),
        status: __("Status", "uipress-lite"),
        name: __("Name", "uipress-lite"),
        type: __("Type", "uipress-lite"),
        active: __("Active", "uipress-lite"),
        draft: __("Draft", "uipress-lite"),
        results: __("results", "uipress-lite"),
        searchUsersRoles: __("Search users and roles", "uipress-lite"),
        searchTemplates: __("Search templates", "uipress-lite"),
        templateDuplicated: __("Template duplicated", "uipress-lite"),
        deleteSelected: __("Delete selected", "uipress-lite"),
        uiBuilder: __("uiBuilder", "uipress-lite"),
        newTemplate: __("New template", "uipress-lite"),
        viewDocs: __("View docs", "uipress-lite"),
        settings: __("Site settings", "uipress-lite"),
        phpErrorLog: __("PHP error log", "uipress-lite"),
        setupWizard: __("Setup wizard", "uipress-lite"),
        globalExport: __("Global export", "uipress-lite"),
        templateType: __("New template", "uipress-lite"),
        edit: __("Edit", "uipress-lite"),
        duplicate: __("Duplicate", "uipress-lite"),
        globalImport: __("Global import", "uipress-lite"),
        siteSync: __("Remote sync", "uipress-lite"),
        new: __("New", "uipress-lite"),
        appliesTo: __("Applies to", "uipress-lite"),
        delete: __("Delete", "uuipress-lite"),
        documentation: __("Documentation", "uipress-lite"),
        siteSettings: __("Site settings", "uipress-lite"),
        tipsTricks: __("Tips and updates", "uipress-lite"),
        noTemplatesYet: __("No templates found", "uipress-lite"),
      },
      activeFilter: "all",
      tabletabs: [
        {
          name: "all",
          label: __("All templates", "uipress-lite"),
        },
        {
          name: "ui-template",
          label: __("UI Templates", "uipress-lite"),
        },
        {
          name: "ui-admin-page",
          label: __("Admin pages", "uipress-lite"),
        },
        {
          name: "ui-front-template",
          label: __("Frontend toolbars", "uipress-lite"),
        },
      ],
      activeSwitchOptions: {
        draft: {
          value: "draft",
          label: __("Draft", "uipress-lite"),
        },
        publish: {
          value: "publish",
          label: __("Active", "uipress-lite"),
        },
      },
    };
  },

  mounted() {
    this.getTemplates();
    this.enqueueAdminBarStyles();

    if (this.uipApp.data.userPrefs.supressWelcome) {
      this.showWelcome = false;
    }

    if (window.parent) {
      window.parent.postMessage({ eventName: "uip_exit_fullscreen" }, "*");
    }
  },
  watch: {
    search: {
      handler(newValue, oldValue) {
        this.page = 1;
        this.getTemplates();
      },
      deep: true,
    },
    selectAll: {
      handler(newValue, oldValue) {
        this.selectAllItems(newValue);
      },
      deep: true,
    },
    activeTableTab: {
      handler(newValue, oldValue) {
        this.getTemplates();
      },
    },
  },
  computed: {
    /**
     * Returns all templates or templates of a specific type depending on the active filter
     *
     * @returns {Array}
     * @since 3.2.13
     */
    returnTableData() {
      const templates = this.templates;

      // If filter is set to all just return the whole list
      if (this.activeFilter == "all") return templates;

      // Filter template list by current type
      return templates.filter((template) => template.actualType == this.activeFilter);
    },

    /**
     * Returns current page
     *
     * @since 3.2.13
     */
    returnPage() {
      return this.page;
    },
  },
  methods: {
    /**
     * Re-ads default toolbar styling
     *
     * @since 3.2.0
     */
    enqueueAdminBarStyles() {
      let styleblock = document.querySelector('link[href*="load-styles.php?"]');
      if (!styleblock) return;

      // Stylesheet already has admin styles enqueued
      if (styleblock.href.includes("admin-bar,")) return;

      const newLink = styleblock.href.replace("admin-menu,", "admin-menu,admin-bar,");
      const link = document.createElement("link");
      link.href = newLink;
      link.setAttribute("rel", "stylesheet");

      // Event listener function
      const onLoad = () => {
        styleblock.remove();
        link.removeEventListener("load", onLoad); // Remove the event listener
      };

      const head = document.head;
      if (head.firstChild) {
        head.insertBefore(link, head.firstChild);
      } else {
        head.appendChild(link);
      }

      // Add the event listener
      link.addEventListener("load", onLoad);
    },

    /**
     * Gets templates
     *
     * @since 3.2.13
     */
    async getTemplates() {
      if (this.loading == true) return;

      this.loading = true;

      let formData = new FormData();
      formData.append("action", "uip_get_ui_templates");
      formData.append("security", uip_ajax.security);
      formData.append("page", this.returnPage);
      formData.append("search", this.search);
      formData.append("filter", this.activeTableTab);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      // Error
      if (!response) return;

      this.templates = response.templates;
      this.totalPages = response.totalPages;
      this.totalFound = response.totalFound;
      this.loading = false;
      this.initialLoading = false;
    },

    /**
     * Duplicates a template
     *
     * @param {Number} id - template id to duplicate
     * @returns {Promise}
     * @since 3.2.13
     */
    async duplicateTemplate(id) {
      let formData = new FormData();
      formData.append("action", "uip_duplicate_ui_template");
      formData.append("security", uip_ajax.security);
      formData.append("id", id);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      // Catch error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "", "error", true);
        return;
      }

      // Template duplicated
      this.uipApp.notifications.notify(this.strings.templateDuplicated, "", "success", true);
      this.getTemplates();
    },

    /**
     * Deletes templates by ids
     *
     * @param {Array} ids - array of templates to delete
     * @returns {Promise}
     * @since 3.0.0
     */
    async deleteTemplate(ids) {
      let formData = new FormData();
      formData.append("action", "uip_delete_ui_template");
      formData.append("security", uip_ajax.security);
      formData.append("templateids", ids);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "", "error", true);
        return;
      }

      // Success message
      this.uipApp.notifications.notify(response.message, "", "success", true);

      const index = this.templates.findIndex((item) => item.id === ids);

      if (index !== -1) {
        this.templates.splice(index, 1);
      }
    },

    /**
     * Creates new draft ui template
     *
     * @since 3.0.0
     */
    async createNewUI(templateType) {
      let self = this;

      let formData = new FormData();
      formData.append("action", "uip_create_new_ui_template");
      formData.append("security", uip_ajax.security);
      formData.append("templateType", templateType);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      // Catch error
      if (!response) return;

      this.$router.push("/uibuilder/" + response.id + "/");
    },

    /**
     * Confirms the deletion of template
     *
     * @param {Number} id - id of template to delete
     * @since 3.0.0
     */
    async confirmDelete(id) {
      const confirm = await this.$refs.confirm.show({
        title: __("Delete template", "uipress-lite"),
        message: __("Deleted templates can't be recovered", "uipress-lite"),
        okButton: __("Delete", "uipress-lite"),
      });
      if (!confirm) return;
      this.deleteTemplate(id);
    },

    /**
     * Confirms the deletion of multiple templates
     *
     * @param {Number} id - id of template to delete
     * @since 3.0.0
     */
    async confirmDeleteMultiple(id) {
      const confirm = await this.$refs.confirm.show({
        title: __("Delete multiple template", "uipress-lite"),
        message: __("Deleted templates can't be recovered", "uipress-lite"),
        okButton: __("Delete", "uipress-lite"),
      });

      if (!confirm) return;
      this.deleteTemplate(id);
    },

    /**
     * Updates a template status and roles / users
     *
     * @param {Object} template - the template to update
     * @param {String} status - the new template status
     * @returns {Promise}
     * @since 3.2.13
     */
    async updateTemplate(template) {
      let formData = new FormData();
      formData.append("action", "uip_update_ui_template_status");
      formData.append("security", uip_ajax.security);
      formData.append("templateid", template.id);
      formData.append("status", template.status);
      formData.append("templatefor", JSON.stringify(template.for));

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "", "error", true);
        return;
      }

      // Updated message
      this.uipApp.notifications.notify(response.message, "", "success", true);
    },

    /**
     * Returns style for active indicator
     *
     * @param {String} status - the item status
     * @since 3.2.13
     */
    returnActiveIndicatorStyle(status) {
      let style = "border:1px solid var(--uip-color-green)";
      if (status == "draft") {
        style = "border:1px solid var(--uip-color-orange)";
      }
      return style;
    },

    /**
     * Loads a template
     *
     * @param {Number} id - the template id to load
     */
    loadTemplate(id) {
      this.$router.push("/uibuilder/" + id + "/");
    },

    /**
     * Handles change to applied roles / users
     *
     * @param {Object} template - template object that change occurred on
     * @param {Array} newroles - an array of new roles
     * @since 3.2.13
     */
    handleRoleChange(template, newroles) {
      const currennt = JSON.stringify(template.for);
      const newset = JSON.stringify(newroles);

      if (currennt == newset) return;

      template.for = newroles;
      this.updateTemplate(template);
    },

    /**
     * Returns a clone of the templates roles for property
     *
     * @param {Array} data - the array of data to clone
     * @returns {Array}
     * @since 3.2.13
     */
    returnRoleClone(data) {
      if (!data) return [];
      return [...data];
    },

    /**
     * Returns active style for tab
     *
     * @param {object} item
     * @since 3.2.0
     */
    returnTabStyle(item) {
      if (item.name != this.activeFilter) return;
      return { "border-bottom": "2px solid var(--uip-color-accent)" };
    },
  },
  template: `
  
  
  
  <div class="uip-flex uip-flex-column uip-h-100p uip-w-100p uip-background-muted" style="min-height:100dvh">
  
    <!-- Toolbar -->
    <div class="uip-padding-s uip-background-default uip-border-bottom uip-border-bottom uip-flex uip-flex-between uip-position-relative">
    
      <!-- Logo -->
      <dropdown pos="bottom left" ref="logodrop">
        <template #trigger>
          <div class="uip-flex uip-gap-xs uip-flex-center uip-link-default uip-border-rounder uip-background-muted uip-padding-xs uip-padding-top-xxs uip-padding-bottom-xxs">
            <div class="uip-logo uip-w-18 uip-ratio-1-1"></div>
            <div class="uip-icon uip-text-l uip-text-muted">expand_more</div>
          </div>
        </template>
        
        <template #content>
        
          <div class="uip-padding-xs uip-flex uip-flex-column uip-text-weight-normal uip-text-s">
          
              
            <router-link to="/site-settings/" 
            @click="$refs.logodrop.close()"
            class="uip-link-default uip-flex uip-flex-center uip-flex-between uip-gap-m uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-no-underline">
              <span class="">{{strings.siteSettings}}</span>
              <span class="uip-icon">tune</span>
            </router-link>  
          
            <router-link to="/setupWizard/" 
            @click="$refs.logodrop.close()"
            class="uip-link-default uip-flex uip-flex-center uip-flex-between uip-gap-m uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-no-underline">
              <span class="">{{strings.setupWizard}}</span>
              <span class="uip-icon">magic_button</span>
            </router-link>
            
            <div class="uip-border-top uip-margin-top-xs uip-margin-bottom-xs"></div>
            
            <a href="https://uipress.co/docs/" target="_BLANK"
            @click="$refs.logodrop.close()"
            class="uip-link-default uip-flex uip-flex-center uip-flex-between uip-gap-m uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-no-underline">
              <span class="">{{strings.documentation}}</span>
              <span class="uip-icon">import_contacts</span>
            </a>
            
            <a role="button"
            @click="$refs.logodrop.close();this.uipApp.tipsAndTricks.show()"
            class="uip-link-default uip-flex uip-flex-center uip-flex-between uip-gap-m uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-no-underline">
              <span class="">{{strings.tipsTricks}}</span>
              <span class="uip-icon">lightbulb</span>
            </a>
            
            <div class="uip-border-top uip-margin-top-xs uip-margin-bottom-xs"></div>
            
            <router-link to="/globalexport/" 
            @click="$refs.logodrop.close()"
            class="uip-link-default uip-flex uip-flex-center uip-flex-between uip-gap-m uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-no-underline">
              <span class="">{{strings.globalExport}}</span>
              <span class="uip-icon">file_download</span>
            </router-link>
            
            <router-link to="/globalimport/" 
            @click="$refs.logodrop.close()"
            class="uip-link-default uip-flex uip-flex-center uip-flex-between uip-gap-m uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-no-underline">
              <span class="">{{strings.globalImport}}</span>
              <span class="uip-icon">file_upload</span>
            </router-link>
            
            <router-link to="/sitesync/" 
            @click="$refs.logodrop.close()"
            class="uip-link-default uip-flex uip-flex-center uip-flex-between uip-gap-m uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-no-underline">
              <span class="">{{strings.siteSync}}</span>
              <span class="uip-icon">sync</span>
            </router-link>
            
            <div class="uip-border-top uip-margin-top-xs uip-margin-bottom-xs"></div>
            
            <router-link to="/errorlog/" 
            @click="$refs.logodrop.close()"
            class="uip-link-default uip-flex uip-flex-center uip-flex-between uip-gap-m uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-no-underline">
              <span class="">{{strings.phpErrorLog}}</span>
              <span class="uip-icon">code</span>
            </router-link>
            
            
            
            
            
            
            
          </div>
        
        </template>
      </dropdown>  
      
      <!-- Global search -->
      <div class="uip-position-absolute uip-left-50p uip-translateX--50p uip-flex uip-flex-center uip-flex-middle">
        <div class="uip-flex uip-background-muted uip-border-rounder uip-padding-xxs uip-flex-center uip-w-240 ">
          <span class="uip-icon uip-text-muted uip-margin-right-xs">search</span>
          <input class="uip-blank-input uip-flex-grow uip-text-s" type="search" v-model="search" :placeholder="strings.searchTemplates" autofocus="">
        </div>
      </div>
      
      <!-- Right actions -->
      <div class="uip-flex uip-gap-xs uip-flex-center">
      
        <!-- Site settings -->
        <router-link to="/site-settings/" class="uip-button-default uip-flex uip-flex-row uip-gap-xxs uip-flex-center uip-no-underline uip-text-s">
          <span>{{strings.settings}}</span>
        </router-link>
        
        <!-- New template -->
        <div class="uip-button-primary uip-flex uip-flex-row uip-gap-xxs uip-flex-center uip-text-s" @click="createNewUI('ui-template')">
          <span>{{strings.newTemplate}}</span>
        </div>
      
      </div>
      
    </div>
    <!-- End Toolbar-->
    
    <!-- Body-->
    <div class="uip-flex uip-flex-column uip-flex-center uip-padding-l">
      
      <!-- Inner body -->
      <div class="uip-flex uip-flex-column uip-row-gap-m uip-w-1000 uip-max-w-100p">
      
        <!-- Heading -->
        <div class="uip-text-bold uip-text-xl uip-text-emphasis">{{ strings.templates }}</div>
        
        <!-- Filters -->
        <div class="uip-flex uip-gap-s">
          <template v-for="item in tabletabs">
            <a class="uip-padding-bottom-s" @click="activeFilter = item.name" 
            :class="item.name == this.activeFilter ? 'uip-text-bold uip-link-emphasis' : 'uip-link-muted'"
            :style="returnTabStyle(item)">
              {{item.label}}
            </a>
          </template>
        </div>
        
        <component is="style">
          
          
          tr:hover {
           box-shadow: var(--uip-box-shadow);
          }
          
          tr:hover td:first-child{
            border-radius:8px 0 0 8px;
          }
          tr:hover td:last-child{
            border-radius:0 8px 8px 0;
          }
          .uip-template-table tr:first-child td:first-child {border-radius: 8px 0 0 0;}
          .uip-template-table tr:first-child td:last-child {border-radius: 0 8px 0 0;}
          .uip-template-table tr:last-child td:first-child {border-radius: 0 0 0 8px;}
          .uip-template-table tr:last-child td:last-child {border-radius: 0 0 8px 0;}
          .uip-template-table tr:last-child td {border: none !important;}
        </component>
        
        
        <div v-if="!returnTableData.length && !loading" class="uip-background-green-wash uip-padding-s uip-border-rounder">
          {{strings.noTemplatesYet}}
        </div>
        
        <!-- Table -->
        <TransitionGroup name="list" tag="table" class="uip-background-transparent uip-template-table" style="border-collapse: collapse;
        border-spacing: 0;">
        
          <template v-for="(template, index) in returnTableData" :key="template.id">
            
          
            <tr class="uip-link-default uip-border-rounder" @click="loadTemplate(template.id)"
            @contextmenu.prevent.stop="$refs['templatemenu-'+index][0].show($event)">
              <!-- Template Title -->
              <td class="uip-border-bottom uip-padding-s uip-background-default">
                <div class="uip-flex uip-flex-column uip-gap-xxs">
                  
                  <div class="uip-flex uip-gap-xs uip-flex-center">
                  
                    <div class="uip-text-bold">{{ template.name }}</div>
                    
                    <div class="uip-w-9 uip-ratio-1-1 uip-border-circle uip-opacity-70"
                    :class="template.status == 'publish' ? 'uip-background-green' : 'uip-background-orange'" 
                    style="returnActiveIndicatorStyle(template.status)"></div>
                    
                  </div>
                  
                  
                  <div class="uip-text-muted uip-text-s">{{ template.modified }}</div>
                  
                </div>
              </td>
              
              <!-- Template type -->
              <td class="uip-border-bottom uip-padding-s uip-max-w-160 uip-background-default">
                <div class="uip-background-primary-wash uip-text-accent uip-padding-xxxs uip-border-round uip-text-s uip-border uip-display-inline">{{ template.type }}</div>
              </td>
              
              <!-- Active state -->
              <td class="uip-border-bottom uip-padding-s uip-max-w-100 uip-background-default">
                
                <switch-select :args="{asText:true, small:true, options: activeSwitchOptions}" 
                @click.stop
                :value="template.status" 
                :returnData="(d)=>{template.status=d;updateTemplate(template)}"/>
                
              </td>
              
              
              
              <!-- Applies to -->
              <td class="uip-border-bottom uip-padding-s uip-max-w-160 uip-background-default">
                
                <user-role-select :selected="returnRoleClone(template.for)"
                @click.stop
                :placeHolder="strings.appliesTo"
                :searchPlaceHolder="strings.searchUsersRoles"
                :updateSelected="(d)=>{handleRoleChange(template, d)}"/>
                
              </td>
              
              
              
              <!-- Dropdown -->
              <td class="uip-border-bottom uip-padding-s uip-text-right uip-background-default">
                
                <a @click.prevent.stop="$refs['templatemenu-'+index][0].show($event)"
                class="uip-link-muted hover:uip-background-muted uip-border-rounder uip-padding-xxs uip-inline-flex uip-flex-centers uip-text-l">
                  <span class="uip-icon">more_vert</span>
                </a>
                
              </td>
              
            </tr>
          
          </template>
        </TransitionGroup>
        <!-- End table -->
        
        <template v-for="(template, index) in returnTableData" :key="template.id">
          <contextmenu :ref="'templatemenu-'+index">
          
            <div class="uip-padding-xs uip-flex uip-flex-column uip-text-weight-normal uip-text-s">
            
              <router-link :to="'/uibuilder/' + template.id + '/'" 
              class="uip-link-muted uip-flex uip-flex-center uip-flex-between uip-gap-m uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-no-underline">
                <span class="">{{strings.edit}}</span>
                <span class="uip-icon">edit</span>
              </router-link>
            
              <a class="uip-link-muted uip-flex uip-flex-center uip-flex-between uip-gap-m uip-padding-xxs hover:uip-background-muted uip-border-rounder"
              @click.prevent="duplicateTemplate(template.id);$refs['templatemenu-'+index][0].close()">
                <span class="">{{strings.duplicate}}</span>
                <span class="uip-icon">content_copy</span>
              </a>
              
              <div class="uip-border-top uip-margin-top-xs uip-margin-bottom-xs"></div>
              
              <a class="uip-link-danger uip-flex uip-flex-center uip-flex-between uip-gap-m uip-padding-xxs hover:uip-background-muted uip-border-rounder"
              @click.prevent="confirmDelete(template.id);$refs['templatemenu-'+index][0].close()">
                <span class="">{{strings.delete}}</span>
                <span class="uip-icon">delete</span>
              </a>
            
            </div>
          
          </contextmenu>
        </template>
        
      </div>
      <!-- End inner body-->
      
    </div>
    <!-- End body-->
    
    <!-- Child routes -->
    <router-view :key="$route.path"/>
    
    <Confirm ref="confirm"/>
  
  </div>
  
    
    
  `,
};
