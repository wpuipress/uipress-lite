const { __, _x, _n, _nx } = wp.i18n;
<<<<<<< HEAD
export default {
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
      search: '',
      strings: {
        status: __('Status', 'uipress-lite'),
        forRoles: __('Roles and users', 'uipress-lite'),
        excludes: __('Excludes', 'uipress-lite'),
        modified: __('Modified', 'uipress-lite'),
        name: __('Name', 'uipress-lite'),
        type: __('Type', 'uipress-lite'),
        active: __('Active', 'uipress-lite'),
        draft: __('Draft', 'uipress-lite'),
        results: __('results', 'uipress-lite'),
        searchTemplates: __('Search templates...', 'uipress-lite'),
        templateDuplicated: __('Template duplicated', 'uipress-lite'),
        templateDeleted: __('Template deleted', 'uipress-lite'),
        deleteSelected: __('Delete selected', 'uipress-lite'),
        uiBuilder: __('uiBuilder', 'uipress-lite'),
        newTemplate: __('New template', 'uipress-lite'),
        welcomeTotheUibuilder: __("It's a little quiet!", 'uipress-lite'),
        welcomeMeta: __('Create a new template to get started with uiBuilder or check out the docs', 'uipress-lite'),
        viewDocs: __('View docs', 'uipress-lite'),
        editTemplate: __('Edit template', 'uipress-lite'),
        duplicateTemplate: __('Duplicate template', 'uipress-lite'),
        deleteTemplate: __('Delete template', 'uipress-lite'),
        version: __('version', 'uipress-lite'),
        tools: __('Tools', 'uipress-lite'),
        settings: __('Site settings', 'uipress-lite'),
        phpErrorLog: __('PHP error log', 'uipress-lite'),
        roleEditor: __('Role editor', 'uipress-lite'),
        pro: __('pro', 'uipress-lite'),
        uiTemplate: __('UI template', 'uipress-lite'),
        uiTemplates: __('UI templates', 'uipress-lite'),
        adminPage: __('Admin page', 'uipress-lite'),
        loginPage: __('Login page', 'uipress-lite'),
        frontEndToolbar: __('Frontend toolbar', 'uipress-lite'),
        setupWizard: __('Setup wizard', 'uipress-lite'),
        globalExport: __('Global export', 'uipress-lite'),
        templateType: __('New template', 'uipress-lite'),
        userInterface: __('User interface', 'uipress-lite'),
        edit: __('Edit', 'uipress-lite'),
        duplicate: __('Duplicate', 'uipress-lite'),
        noTemplatesYet: __('No templates yet!', 'uipress-lite'),
        welcomeTov32: __('Welcome to version 3.2!', 'uipress-lite'),
        globalImport: __('Global import', 'uipress-lite'),
        siteSync: __('Remote sync', 'uipress-lite'),
      },
      activeTableTab: 'all',
      tabletabs: [
        {
          name: 'all',
          label: __('All templates', 'uipress-lite'),
        },
        {
          name: 'active',
          label: __('Active', 'uipress-lite'),
        },
        {
          name: 'drafts',
          label: __('Drafts', 'uipress-lite'),
        },
        {
          name: 'templates',
          label: __('UI Templates', 'uipress-lite'),
        },
        {
          name: 'pages',
          label: __('Admin pages', 'uipress-lite'),
        },
        {
          name: 'toolbar',
          label: __('Frontend toolbars', 'uipress-lite'),
        },
      ],
      tabbedTemplateTypes: {
        all: {
          value: 'all',
          label: __('All', 'uipress-lite'),
        },
        templates: {
          value: 'templates',
          label: __('UI Templates', 'uipress-lite'),
        },
        pages: {
          value: 'pages',
          label: __('Admin pages', 'uipress-lite'),
        },
        toolbar: {
          value: 'toolbar',
          label: __('Toolbars', 'uipress-lite'),
        },
      },
      activeSwitchOptions: {
        draft: {
          value: 'draft',
          label: __('Draft', 'uipress-lite'),
        },
        publish: {
          value: 'publish',
          label: __('Active', 'uipress-lite'),
        },
      },
      templateTypes: {
        templates: {
          value: 'ui-template',
          label: __('UI Templates', 'uipress-lite'),
          icon: 'space_dashboard',
        },
        pages: {
          value: 'ui-admin-page',
          label: __('Admin pages', 'uipress-lite'),
          icon: 'article',
        },
        toolbar: {
          value: 'ui-front-template',
          label: __('Toolbars', 'uipress-lite'),
          icon: 'build',
        },
      },
    };
  },
  inject: ['uipData', 'router', 'uipress', 'uipMediaLibrary'],
  mounted: function () {
    let query = this.$route.query;

    if (query) {
      if (query.page) {
        this.page = parseInt(query.page);
      }

      if (query.search) {
        this.search = query.search;
      }
    }

    this.getTemplates();
    this.enqueueAdminBarStyles();

    if (this.uipData.userPrefs.supressWelcome) {
      this.showWelcome = false;
    }

    if (window.parent) {
      window.parent.postMessage({ eventName: 'uip_exit_fullscreen' }, '*');
    }
  },
  watch: {
    search: {
      handler(newValue, oldValue) {
        this.page = 1;
        this.pushQueries();
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
    returnTableData() {
      this.templates.sort((a, b) => b.status.localeCompare(a.status));
      return this.templates;
      //return [];
    },
    toggleSelect() {
      return this.templates;
    },
    returnPage() {
      let self = this;
      return self.page;
    },
    returnSelected() {
      let self = this;
      let count = 0;

      for (const item of self.templates) {
        if (item.selected) {
          count += 1;
        }
      }

      return count;
    },
    returnSelectedIDs() {
      let self = this;
      let ids = [];

      for (const item of self.templates) {
        if (item.selected) {
          ids.push(item.id);
        }
      }

      return JSON.stringify(ids);
    },
  },
  methods: {
    enqueueAdminBarStyles() {
      let styleblock = document.querySelector('link[href*="load-styles.php?"]');
      if (styleblock) {
        if (document.documentElement.hasAttribute('uip-core-app')) {
          return;
        }

        let href = styleblock.href;
        if (!href.includes('admin-bar,')) {
          href = styleblock.href.replace('admin-menu,', 'admin-menu,admin-bar,');
          styleblock.href = href;
        }
      }
    },
    selectAllItems(value) {
      let self = this;

      for (const item of self.templates) {
        item.selected = value;
      }
    },
    pushQueries() {
      this.$router.push({
        query: { search: this.search, page: this.page },
      });
    },
    getTemplates() {
      let self = this;
      if (self.loading == true) {
        return;
      }
      self.loading = true;

      let formData = new FormData();
      formData.append('action', 'uip_get_ui_templates');
      formData.append('security', uip_ajax.security);
      formData.append('page', self.returnPage);
      formData.append('search', self.search);
      formData.append('filter', self.activeTableTab);

      self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
        self.templates = response.templates;
        self.totalPages = response.totalPages;
        self.totalFound = response.totalFound;
        self.loading = false;
        self.initialLoading = false;
      });
    },
    duplicateTemplate(id) {
      let self = this;

      let formData = new FormData();
      formData.append('action', 'uip_duplicate_ui_template');
      formData.append('security', uip_ajax.security);
      formData.append('id', id);

      self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
        if (response.error) {
          self.uipress.notify(response.message, '', 'error', true);
          return;
        }
        self.uipress.notify(self.strings.templateDuplicated, '', 'success', true);
        self.getTemplates();
      });
    },
    /**
     * Deletes templates
     * @since 3.0.0
     */
    deleteTemplate(ids) {
      let self = this;

      let formData = new FormData();
      formData.append('action', 'uip_delete_ui_template');
      formData.append('security', uip_ajax.security);
      formData.append('templateids', ids);

      self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
        if (response.error) {
          self.uipress.notify(response.message, '', 'error', true);
          return;
        }
        self.uipress.notify(response.message, '', 'success', true);

        let index = self.templates.findIndex((item) => item.id === ids);

        if (index !== -1) {
          self.templates.splice(index, 1);
        }
      });
    },
    /**
     * Creates new draft ui template
     * @since 3.0.0
     */
    createNewUI(templateType) {
      let self = this;

      let formData = new FormData();
      formData.append('action', 'uip_create_new_ui_template');
      formData.append('security', uip_ajax.security);
      formData.append('templateType', templateType);

      self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
        self.router.push('/uibuilder/' + response.id + '/');
      });
    },
    /**
     * Confirms the deletion of template
     * @since 3.0.0
     */
    confirmDelete(id) {
      let self = this;
      self.uipress
        .confirm(__('Are you sure you want to delete this template?', 'uipress-lite'), __("Deleted templates can't be recovered", 'uipress-lite'), __('Delete', 'uipress-lite'))
        .then((response) => {
          if (response) {
            self.deleteTemplate(id);
          }
        });
    },
    confirmDeleteMultiple(id) {
      let self = this;
      self.uipress
        .confirm(__('Are you sure you want to multiple templates?', 'uipress-lite'), __("Deleted templates can't be recovered", 'uipress-lite'), __('Delete', 'uipress-lite'))
        .then((response) => {
          if (response) {
            self.deleteTemplate(id);
          }
        });
    },
    editLayout(id) {
      let self = this;
      self.router.push('/uibuilder/' + id + '/');
    },
    goBack() {
      if (this.page > 1) {
        this.page = this.page - 1;
        this.pushQueries();
        this.getTemplates();
      }
    },
    goForward() {
      if (this.page < this.totalPages) {
        this.page = this.page + 1;

        this.pushQueries();
        this.getTemplates();
      }
    },
    componentExists(name) {
      if (this.$root._.appContext.components[name]) {
        return true;
      } else {
        return false;
      }
    },
    generateVal(stat) {
      if (stat == 'publish') {
        return true;
      }
      return false;
    },
    updateItemStatus(item) {
      let self = this;

      let formData = new FormData();
      formData.append('action', 'uip_update_ui_template_status');
      formData.append('security', uip_ajax.security);
      formData.append('templateid', item.id);
      formData.append('status', item.status);

      self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
        if (response.error) {
          self.uipress.notify(response.message, '', 'error', true);
          return;
        }
        self.uipress.notify(response.message, '', 'success', true);
      });
    },
  },
  template: `
=======
export function moduleData() {
  return {
    data: function () {
      return {
        templates: [],
        page: 1,
        totalPages: 0,
        totalFound: 0,
        loading: false,
        initialLoading: true,
        selectAll: false,
        showWelcome: true,
        search: '',
        strings: {
          status: __('Status', 'uipress-lite'),
          forRoles: __('Roles and users', 'uipress-lite'),
          excludes: __('Excludes', 'uipress-lite'),
          modified: __('Modified', 'uipress-lite'),
          name: __('Name', 'uipress-lite'),
          type: __('Type', 'uipress-lite'),
          active: __('Active', 'uipress-lite'),
          draft: __('Draft', 'uipress-lite'),
          results: __('results', 'uipress-lite'),
          searchTemplates: __('Search templates...', 'uipress-lite'),
          templateDuplicated: __('Template duplicated', 'uipress-lite'),
          templateDeleted: __('Template deleted', 'uipress-lite'),
          deleteSelected: __('Delete selected', 'uipress-lite'),
          uiBuilder: __('uiBuilder', 'uipress-lite'),
          newTemplate: __('New template', 'uipress-lite'),
          welcomeTotheUibuilder: __("It's a little quiet!", 'uipress-lite'),
          welcomeMeta: __('Create a new template to get started with uiBuilder or check out the docs', 'uipress-lite'),
          viewDocs: __('View docs', 'uipress-lite'),
          editTemplate: __('Edit template', 'uipress-lite'),
          duplicateTemplate: __('Duplicate template', 'uipress-lite'),
          deleteTemplate: __('Delete template', 'uipress-lite'),
          version: __('version', 'uipress-lite'),
          tools: __('Tools', 'uipress-lite'),
          settings: __('Site settings', 'uipress-lite'),
          phpErrorLog: __('PHP error log', 'uipress-lite'),
          roleEditor: __('Role editor', 'uipress-lite'),
          pro: __('pro', 'uipress-lite'),
          uiTemplate: __('UI template', 'uipress-lite'),
          uiTemplates: __('UI templates', 'uipress-lite'),
          adminPage: __('Admin page', 'uipress-lite'),
          loginPage: __('Login page', 'uipress-lite'),
          frontEndToolbar: __('Frontend toolbar', 'uipress-lite'),
          setupWizard: __('Setup wizard', 'uipress-lite'),
          globalExport: __('Global export', 'uipress-lite'),
          templateType: __('New template', 'uipress-lite'),
          userInterface: __('User interface', 'uipress-lite'),
          edit: __('Edit', 'uipress-lite'),
          duplicate: __('Duplicate', 'uipress-lite'),
          noTemplatesYet: __('No templates yet!', 'uipress-lite'),
          welcomeTov32: __('Welcome to version 3.2!', 'uipress-lite'),
          globalImport: __('Global import', 'uipress-lite'),
          siteSync: __('Remote sync', 'uipress-lite'),
        },
        activeTableTab: 'all',
        tabletabs: [
          {
            name: 'all',
            label: __('All templates', 'uipress-lite'),
          },
          {
            name: 'active',
            label: __('Active', 'uipress-lite'),
          },
          {
            name: 'drafts',
            label: __('Drafts', 'uipress-lite'),
          },
          {
            name: 'templates',
            label: __('UI Templates', 'uipress-lite'),
          },
          {
            name: 'pages',
            label: __('Admin pages', 'uipress-lite'),
          },
          {
            name: 'toolbar',
            label: __('Frontend toolbars', 'uipress-lite'),
          },
        ],
        tabbedTemplateTypes: {
          all: {
            value: 'all',
            label: __('All', 'uipress-lite'),
          },
          templates: {
            value: 'templates',
            label: __('UI Templates', 'uipress-lite'),
          },
          pages: {
            value: 'pages',
            label: __('Admin pages', 'uipress-lite'),
          },
          toolbar: {
            value: 'toolbar',
            label: __('Toolbars', 'uipress-lite'),
          },
        },
        activeSwitchOptions: {
          draft: {
            value: 'draft',
            label: __('Draft', 'uipress-lite'),
          },
          publish: {
            value: 'publish',
            label: __('Active', 'uipress-lite'),
          },
        },
        templateTypes: {
          templates: {
            value: 'ui-template',
            label: __('UI Templates', 'uipress-lite'),
            icon: 'space_dashboard',
          },
          pages: {
            value: 'ui-admin-page',
            label: __('Admin pages', 'uipress-lite'),
            icon: 'article',
          },
          toolbar: {
            value: 'ui-front-template',
            label: __('Toolbars', 'uipress-lite'),
            icon: 'build',
          },
        },
      };
    },
    inject: ['uipData', 'router', 'uipress', 'uipMediaLibrary'],
    mounted: function () {
      let query = this.$route.query;

      if (query) {
        if (query.page) {
          this.page = parseInt(query.page);
        }

        if (query.search) {
          this.search = query.search;
        }
      }

      this.getTemplates();
      this.enqueueAdminBarStyles();

      if (this.uipData.userPrefs.supressWelcome) {
        this.showWelcome = false;
      }

      if (window.parent) {
        window.parent.postMessage({ eventName: 'uip_exit_fullscreen' }, '*');
      }
    },
    watch: {
      search: {
        handler(newValue, oldValue) {
          this.page = 1;
          this.pushQueries();
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
      returnTableData() {
        this.templates.sort((a, b) => b.status.localeCompare(a.status));
        return this.templates;
        //return [];
      },
      toggleSelect() {
        return this.templates;
      },
      returnPage() {
        let self = this;
        return self.page;
      },
      returnSelected() {
        let self = this;
        let count = 0;

        for (const item of self.templates) {
          if (item.selected) {
            count += 1;
          }
        }

        return count;
      },
      returnSelectedIDs() {
        let self = this;
        let ids = [];

        for (const item of self.templates) {
          if (item.selected) {
            ids.push(item.id);
          }
        }

        return JSON.stringify(ids);
      },
    },
    methods: {
      enqueueAdminBarStyles() {
        let styleblock = document.querySelector('link[href*="load-styles.php?"]');
        if (styleblock) {
          if (document.documentElement.hasAttribute('uip-core-app')) {
            return;
          }

          let href = styleblock.href;
          if (!href.includes('admin-bar,')) {
            href = styleblock.href.replace('admin-menu,', 'admin-menu,admin-bar,');
            styleblock.href = href;
          }
        }
      },
      selectAllItems(value) {
        let self = this;

        for (const item of self.templates) {
          item.selected = value;
        }
      },
      pushQueries() {
        this.$router.push({
          query: { search: this.search, page: this.page },
        });
      },
      getTemplates() {
        let self = this;
        if (self.loading == true) {
          return;
        }
        self.loading = true;

        let formData = new FormData();
        formData.append('action', 'uip_get_ui_templates');
        formData.append('security', uip_ajax.security);
        formData.append('page', self.returnPage);
        formData.append('search', self.search);
        formData.append('filter', self.activeTableTab);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          self.templates = response.templates;
          self.totalPages = response.totalPages;
          self.totalFound = response.totalFound;
          self.loading = false;
          self.initialLoading = false;
        });
      },
      duplicateTemplate(id) {
        let self = this;

        let formData = new FormData();
        formData.append('action', 'uip_duplicate_ui_template');
        formData.append('security', uip_ajax.security);
        formData.append('id', id);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          if (response.error) {
            self.uipress.notify(response.message, '', 'error', true);
            return;
          }
          self.uipress.notify(self.strings.templateDuplicated, '', 'success', true);
          self.getTemplates();
        });
      },
      /**
       * Deletes templates
       * @since 3.0.0
       */
      deleteTemplate(ids) {
        let self = this;

        let formData = new FormData();
        formData.append('action', 'uip_delete_ui_template');
        formData.append('security', uip_ajax.security);
        formData.append('templateids', ids);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          if (response.error) {
            self.uipress.notify(response.message, '', 'error', true);
            return;
          }
          self.uipress.notify(response.message, '', 'success', true);

          let index = self.templates.findIndex((item) => item.id === ids);

          if (index !== -1) {
            self.templates.splice(index, 1);
          }
        });
      },
      /**
       * Creates new draft ui template
       * @since 3.0.0
       */
      createNewUI(templateType) {
        let self = this;

        let formData = new FormData();
        formData.append('action', 'uip_create_new_ui_template');
        formData.append('security', uip_ajax.security);
        formData.append('templateType', templateType);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          self.router.push('/uibuilder/' + response.id + '/');
        });
      },
      /**
       * Confirms the deletion of template
       * @since 3.0.0
       */
      confirmDelete(id) {
        let self = this;
        self.uipress
          .confirm(__('Are you sure you want to delete this template?', 'uipress-lite'), __("Deleted templates can't be recovered", 'uipress-lite'), __('Delete', 'uipress-lite'))
          .then((response) => {
            if (response) {
              self.deleteTemplate(id);
            }
          });
      },
      confirmDeleteMultiple(id) {
        let self = this;
        self.uipress
          .confirm(__('Are you sure you want to multiple templates?', 'uipress-lite'), __("Deleted templates can't be recovered", 'uipress-lite'), __('Delete', 'uipress-lite'))
          .then((response) => {
            if (response) {
              self.deleteTemplate(id);
            }
          });
      },
      editLayout(id) {
        let self = this;
        self.router.push('/uibuilder/' + id + '/');
      },
      goBack() {
        if (this.page > 1) {
          this.page = this.page - 1;
          this.pushQueries();
          this.getTemplates();
        }
      },
      goForward() {
        if (this.page < this.totalPages) {
          this.page = this.page + 1;

          this.pushQueries();
          this.getTemplates();
        }
      },
      componentExists(name) {
        if (this.$root._.appContext.components[name]) {
          return true;
        } else {
          return false;
        }
      },
      generateVal(stat) {
        if (stat == 'publish') {
          return true;
        }
        return false;
      },
      updateItemStatus(item) {
        let self = this;

        let formData = new FormData();
        formData.append('action', 'uip_update_ui_template_status');
        formData.append('security', uip_ajax.security);
        formData.append('templateid', item.id);
        formData.append('status', item.status);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          if (response.error) {
            self.uipress.notify(response.message, '', 'error', true);
            return;
          }
          self.uipress.notify(response.message, '', 'success', true);
        });
      },
    },
    template: `
>>>>>>> main
    
    
  <div class="uip-padding-m uip-background-default uip-body-font uip-text-normal uip-app-frame uip-border-box uip-overflow-auto" style="min-height: calc(100vh - 32px); max-height: calc(100vh - 32px)">
		<div class="uip-flex uip-flex-between uip-margin-bottom-m uip-flex-center">
      <div class="uip-flex uip-flex-row uip-gap-xs uip-flex-center">
      
        <div class="uip-dark-mode uip-padding-xxs uip-border-rounder" style="background:#222">
          <div class="uip-w-32 uip-ratio-1-1 uip-logo"></div>
        </div>
        
			  <div class="uip-flex uip-flex-column uip-row-gap-xxs">
        
          <span class="uip-text-xl uip-text-bold uip-text-emphasis">{{strings.uiBuilder}}</span>
          <span class="uip-text-xs uip-text-muted">{{strings.version}} {{uipData.options.uipVersion}}</span>
        
        </div>
      </div>
      
      <div class="uip-flex uip-flex-row uip-gap-xs uip-flex-center">
        
        
        <router-view :key="$route.path"></router-view>
      
        <dropdown pos="bottom right">
          <template v-slot:trigger>
			      <div class="uip-button-default uip-flex uip-flex-row uip-gap-xxs uip-flex-center">
              <span class="uip-icon">build</span>
              <span>{{strings.tools}}</span>
            </div>
          </template>
          <template v-slot:content>
            <div class="uip-flex uip-flex-column uip-padding-xs uip-min-w-150 uip-row-gap-xxxs">
            
              <!-- ERROR LOG --> 
              <uip-offcanvas position="right" style="max-width:90%;width:500px">
                <template v-slot:trigger>
                  <div class="uip-flex uip-gap-m uip-flex-between uip-link-default uip-flex-center uip-padding-xxxs uip-padding-left-xxs uip-padding-right-xxs hover:uip-background-muted uip-border-round">
                    
                    <div class="">{{strings.phpErrorLog}}</div>
                    <div class="uip-icon uip-text-l">code</div>
                  </div>
                </template>
                <template v-slot:content>
                  <div class="uip-w-100p">
                    <uip-error-log></uip-error-log>
                  </div>
                </template>
              </uip-offcanvas>
              
              
              <router-link to="/setupwizard/" class="uip-flex uip-gap-m uip-flex-between uip-link-default uip-no-underline uip-flex-center uip-padding-xxxs uip-padding-left-xxs uip-padding-right-xxs hover:uip-background-muted uip-border-round">
                
                <div class="">{{strings.setupWizard}}</div>
                <div class="uip-icon uip-text-l">magic_button</div>
                
              </router-link>
              
              <div class="uip-border-top uip-margin-top-xs uip-margin-bottom-xs"></div>
              
              <router-link to="/globalexport/" class="uip-flex uip-gap-m uip-flex-between uip-link-default uip-no-underline uip-flex-center uip-padding-xxxs uip-padding-left-xxs uip-padding-right-xxs hover:uip-background-muted uip-border-round">
                
                <div class="">{{strings.globalExport}}</div>
                <div class="uip-icon uip-text-l">file_download</div>
                
              </router-link>
              
              <router-link to="/globalimport/" class="uip-flex uip-gap-m uip-flex-between uip-link-default uip-no-underline uip-flex-center uip-padding-xxxs uip-padding-left-xxs uip-padding-right-xxs hover:uip-background-muted uip-border-round">
                
                <div class="">{{strings.globalImport}}</div>
                <div class="uip-icon uip-text-l">file_upload</div>
                
              </router-link>
              
              
              <router-link to="/sitesync/" class="uip-flex uip-gap-m uip-flex-between uip-link-default uip-no-underline uip-flex-center uip-padding-xxxs uip-padding-left-xxs uip-padding-right-xxs hover:uip-background-muted uip-border-round">
                
                <div class="">{{strings.siteSync}}</div>
                <div class="uip-icon uip-text-l">sync</div>
                
              </router-link>
              
              
              
              
            </div>
          </template>
        </dropdown>
        
        <router-link to="/site-settings/" class="uip-button-default uip-flex uip-flex-row uip-gap-xxs uip-flex-center uip-no-underline">
          <span class="uip-icon">tune</span>
          <span>{{strings.settings}}</span>
        </router-link>

      
      </div>
		</div>
    
    
    <!--LIST-->
    
    <div class="uip-margin-bottom-m uip-padding-s uip-border-rounder uip-background-orange-wash" v-if="showWelcome">
      
      <div class="uip-text-bold uip-margin-bottom-s uip-flex uip-flex-between">
        <div>{{strings.welcomeTov32}}</div>
        <div @click="showWelcome = false;uipress.saveUserPreference('supressWelcome', true, false);"
        class="uip-padding-xxs uip-border-rounder hover:uip-background-grey uip-cursor-pointer"><span class="uip-icon">close</span></div>
      </div>
      
      <div class="uip-text-muted uip-margin-bottom-s">
        <p>This update brings a refinded builder experience with plenty of new features, performance improvements and an improved user interface. </p>
        
        <p>If you have just updated from an earlier version we suggest clearing browser cache before entering the builder. If you are new to uiPress then you can check out our brand new, in depth documentation below.</p>
      </div>
      
      <div class="uip-flex">
        <a href="https://uipress.co/docs/#/"
        target="_BLANK" class="uip-link-default uip-no-underline uip-flex uip-flex-row uip-gap-xxs uip-flex-center">
          <span class="uip-text-bold">{{strings.viewDocs}}</span>
          <span class="uip-icon">arrow_forward</span>
        </a>
      </div>
    </div>
    
    <div class="uip-margin-bottom-m uip-flex uip-flex-between uip-flex-center">
    
      <div class="uip-flex uip-flex-row uip-gap-s">
        
        <div class="uip-flex uip-padding-xxs uip-search-block uip-border-rounder uip-background-muted uip-gap-xxs uip-flex-center uip-w-250">
            <span class="uip-icon uip-text-muted uip-text-l">search</span> 
            <input class="uip-blank-input uip-flex-grow" type="search" v-model="search" :placeholder="strings.searchTemplates">
        </div>
         
         <div v-if="returnSelected > 0">
             <button @click="confirmDeleteMultiple(returnSelectedIDs)" class="uip-button-danger" >{{strings.deleteSelected}} <strong> ({{returnSelected}}) </strong></button>
         </div>
         
      </div>
       
      <div class="uip-flex uip-flex-row uip-gap-s uip-flex-center">
       
        <div class="uip-button-primary uip-flex uip-flex-row uip-gap-xxs uip-flex-center" @click="createNewUI('ui-template')">
          <span class="uip-icon">add</span>
          <span>{{strings.newTemplate}}</span>
        </div>
         
      </div>
       
    </div>
    
    <div v-if="loading && !initialLoading" class="uip-position-relative" style="top:-18px">
      <div class="uip-ajax-loader">
        <div class="uip-loader-bar"></div>
      </div>
    </div>
  
    <!--Ui Templates-->
    <div class="uip-flex uip-flex-column uip-row-gap-m uip-margin-bottom-l">
      <template v-for="templateType in templateTypes">
      
        <div class="uip-flex uip-flex-column uip-row-gap-s">
          <div class="uip-text-bold">
            {{templateType.label}}
          </div>
          
          <div class="uip-flex uip-gap-s uip-row-gap-s uip-flex-wrap">
            
            <div v-if="initialLoading" class="uip-w-150 uip-flex uip-flex-center uip-flex-middle">
              <loading-chart></loading-chart>
            </div>
            
            
            
            <!--Empty -->
            <template v-else-if="templateType.value  == 'ui-template' && returnTableData.length == 0 && !loading && search == ''">
            
              <div class="uip-background-green-wash uip-border-rounder uip-overflow-hidden uip-w-200 uip-min-w-150 hover:uip-shadow uip-transition-all uip-fade-in">
                
                <div class="uip-padding-xs uip-flex uip-flex-column uip-row-gap-s">
                
                  <div class="uip-flex uip-flex-between uip-gap-s uip-flex-center">
                    <div class="uip-text-bold uip-link-default uip-no-underline">{{strings.noTemplatesYet}}</div>
                  </div>  
                  
                  <div class="uip-flex uip-flex-wrap uip-gap-xxs uip-max-w-100p">
                    <div class="uip-text-muted">{{strings.welcomeMeta}}</div>
                  </div>
                  
                  <div class="uip-flex uip-row-gap-xxs uip-flex-column">
                  
                    <router-link to="/setupwizard/" class="uip-link-default uip-no-underline uip-flex uip-flex-row uip-gap-xxs uip-flex-center uip-flex-between uip-w-100p">
                      
                      <span>{{strings.setupWizard}}</span>
                      <span class="uip-icon">magic_button</span>
                      
                    </router-link>
                    
                    <div @click="createNewUI('ui-template')" class="uip-link-default uip-no-underline uip-flex uip-flex-row uip-gap-xxs uip-flex-center uip-flex-between uip-w-100p">
                      
                      <span>{{strings.newTemplate}}</span>
                      <span class="uip-icon">add</span>
                      
                    </div>
                    
                    <a href="https://uipress.co/docs/#/"
                    target="_BLANK" class="uip-link-default uip-no-underline uip-flex uip-flex-row uip-gap-xxs uip-flex-center uip-flex-between uip-w-100p">
                      <span class="uip-text-bold">{{strings.viewDocs}}</span>
                      <span class="uip-icon">arrow_forward</span>
                    </a>
                    
                  </div>
                  
                </div>
                
              </div>
              
              <div @click="createNewUI('ui-template')" class="uip-cursor-pointer uip-background-muted uip-border-rounder uip-overflow-hidden uip-w-200 uip-min-w-150 hover:uip-shadow uip-transition-all uip-fade-in uip-padding-s uip-flex uip-flex-center uip-flex-middle">
              
                <span class="uip-icon uip-text-xxl">add</span>
                
              </div>
            
            </template>
            
            <component is="style">
              .templates-move, 
              .templates-enter-active,
              .templates-leave-active {
                transition: all 0.5s ease;
              }
              
              .templates-enter-from,
              .templates-leave-to {
                opacity: 0;
                transform: translateX(30px);
              }
              
              .templates-leave-active {
                position: absolute;
              }
            </component>
          
            <TransitionGroup name="templates">

              <template v-if="!initialLoading" v-for="(item, index) in returnTableData">
                
              
                <div :key="templateType.value + index" v-if="item.actualType == templateType.value" class="uip-background-muted uip-border-rounder uip-overflow-hidden uip-w-200 uip-min-w-150 hover:uip-shadow uip-transition-all uip-fade-in">
                  <div class="uip-padding-s uip-background-grey uip-flex uip-flex-center uip-flex-middle">
                    <span class="uip-icon uip-text-xl">{{templateType.icon}}</span>
                  </div>
                  <div class="uip-padding-xs uip-flex uip-flex-column uip-row-gap-xxs">
                  
                    <div class="uip-flex uip-flex-between uip-gap-s uip-flex-center">
                      <router-link :to="'/uibuilder/' + item.id + '/'" class="uip-text-bold uip-link-default uip-no-underline">{{item.name}}</router-link>
                      
                      <dropdown pos="bottom right">
                      
                        <template v-slot:trigger>
                          <div class="uip-icon uip-padding-xxs hover:uip-background-grey uip-border-rounder">more_vert</div>
                        </template>
                        
                        <template v-slot:content>
                          <div class="uip-padding-xs">
                          
                            <div class="uip-flex uip-flex-column">
                            
                              <switch-select :args="{asText:true, small:true, options: activeSwitchOptions}" :value="item.status" :returnData="function(d){item.status = d;updateItemStatus(item)}"></switch-select>
                              
                            </div>  
                            <div class="uip-border-bottom uip-margin-top-xs uip-margin-bottom-xs"></div>
                            <div class="uip-flex uip-flex-column">
                            
                              <!--Edit-->
                              <router-link :to="'/uibuilder/' + item.id + '/'" class="uip-flex uip-flex-row uip-flex-center uip-gap-xs uip-link-default uip-no-underline uip-padding-xxxs uip-padding-left-xxs uip-padding-right-xxs hover:uip-background-muted uip-border-rounder uip-flex-reverse uip-gap-m uip-flex-between">
                                <div class="uip-icon">edit</div>
                                <div class="">{{strings.edit}}</div>
                              </router-link>
                              
                              <!--Duplicate-->
                              <div @click="duplicateTemplate(item.id)" class="uip-flex uip-flex-row uip-flex-center uip-gap-xs uip-link-default uip-padding-xxxs uip-padding-left-xxs uip-padding-right-xxs hover:uip-background-muted uip-border-rounder uip-flex-reverse uip-gap-m uip-flex-between">
                                <div class="uip-icon">content_copy</div>
                                <div class="">{{strings.duplicate}}</div>
                              </div>
                              
                            </div>
                            <div class="uip-border-bottom uip-margin-top-xs uip-margin-bottom-xs"></div>
                            <div class="uip-flex uip-flex-column">
                              <div @click="confirmDelete(item.id)" class="uip-flex uip-flex-row uip-flex-center uip-gap-xs uip-link-danger uip-padding-xxxs uip-padding-left-xxs uip-padding-right-xxs hover:uip-background-muted uip-border-rounder uip-flex-reverse uip-gap-m uip-flex-between">
                                <div class="uip-icon">delete</div>
                                <div class="">Delete</div>
                              </div>
                            </div>
                          </div>
                        </template>
                        
                      </dropdown>
                      
                    </div>  
                    
                    <div v-if="item.status == 'publish'" class="uip-flex uip-gap-xs uip-flex-center">
                      <div class="uip-w-8 uip-ratio-1-1 uip-border-circle uip-background-green-wash" style="border:1px solid var(--uip-color-green)"></div>
                      <div class="uip-text-green">{{strings.active}}</div>
                    </div>
                    
                    <div v-if="item.status == 'draft'" class="uip-flex uip-gap-xs uip-flex-center">
                      <div class="uip-w-8 uip-ratio-1-1 uip-border-circle uip-background-orange-wash" style="border:1px solid var(--uip-color-orange)"></div>
                      <div class="uip-text-orange">{{strings.draft}}</div>
                    </div>
                    
                    <div class="uip-flex uip-flex-wrap uip-gap-xxs uip-max-w-100p uip-margin-top-xxs" v-if="item.for.length > 0">
                      <template v-for="user in item.for">
                        <div class="uip-padding-left-xxs uip-padding-right-xxs uip-background-primary-wash uip-border-rounder uip-text-xs">{{user.name}}</div>
                      </template>
                    </div>
                    
                  </div>
                </div>
              </template>
              
            </TransitionGroup>
          </div>
        </div>
        
      </template>
    </div>
      
      
      
      
     
      
	</div>`,
<<<<<<< HEAD
};
=======
  };
  return compData;
}
>>>>>>> main
