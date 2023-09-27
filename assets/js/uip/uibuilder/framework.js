/**
 * Builds the main ui builder shell
 * @since 3.0.0
 */
const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from '../../libs/vue-esm-dev.js';
export default {
  components: {
    layersPanels: defineAsyncComponent(() => import('./layers.min.js?ver=3.2.12')),
    blockcontextmenu: defineAsyncComponent(() => import('./block-contextmenu.min.js?ver=3.2.12')),
    ToolBar: defineAsyncComponent(() => import('./toolbar.min.js?ver=3.2.12')),
    Canvas: defineAsyncComponent(() => import('./canvas.min.js?ver=3.2.12')),
    BlockList: defineAsyncComponent(() => import('./block-list.min.js?ver=3.2.12')),
    TemplateLibrary: defineAsyncComponent(() => import('./template-library.min.js?ver=3.2.12')),
    DynamicData: defineAsyncComponent(() => import('./dynamic-data-watcher.min.js?ver=3.2.12')),
  },
  inject: ['uipData', 'uipress'],
  data: function () {
    return {
      loading: true,
      templateID: this.$route.params.templateID,
      layoutFetched: false,
      unsavedChanges: false,
      welcomeMessage: true,
      updating: false,
      blocksForUpdating: [],
      selectedBlocks: [],
      ui: {
        contextualMenu: {
          display: false,
          top: '',
          left: '',
          block: false,
        },

        modal: {
          open: false,
          activeModule: '',
          title: '',
          args: {},
        },
        settingsPanel: {
          pos: {},
        },
        layers: {
          display: this.uipData.userPrefs.builderLayers,
        },
        sideBar: {
          activeTab: 'blocks',
        },
        strings: {
          layers: __('Layers', 'uipress-lite'),
          welcomeTitle: __('Welcome to the uiBuilder', 'uipress-lite'),
          welcomeMeta: __(
            'Brand new for UiPress 3, the uiBuilder is a powerful drag and drop tool for building great looking, functional admin experiences for yourself or your clients',
            'uipress-lite'
          ),
          browseTemplates: __('Browse premade templates or start from scratch', 'uipress-lite'),
          blankCanvas: __('Blank canvas', 'uipress-lite'),
          viewTemplates: __('View templates', 'uipress-lite'),
          dontShowAgain: __("Don't show this again", 'uipress-lite'),
          close: __('Close', 'uipress-lite'),
          deletesAllBlocks: __('Deletes all blocks', 'uipress-lite'),
          hideLayers: __('Hide layers', 'uipress-lite'),
          shortCuts: __('Block shortcuts', 'uipress-lite'),
          shortCutsExplanation: __('As you build your template, key blocks will automatically be added here for easy settings access'),
          deleteLayout: __('Clear layers', 'uipress-lite'),
          searchData: __('Search', 'uipress-lite'),
        },
        keyBlocks: [],
      },
      template: {
        copied: false,
        notifications: [],
        activePath: [],
        activePathLock: false,
        windowWidth: window.innerWidth,
        patterns: [],
        isPreview: false,
        googleAnalyticsRequest: {
          range: {
            start: '',
            end: '',
          },
          fetching: false,
          data: {},
        },
        display: 'preview',

        globalSettings: {
          name: __('Draft Layout', 'uipress-lite'),
          status: false,
          rolesAndUsers: [],
          excludesRolesAndUsers: [],
          type: 'ui-template',
          options: {},
          menuIcon: {
            value: '',
          },
          code: {
            css: '',
            js: '',
          },
        },
        content: [],
      },
      switchOptions: {
        blocks: {
          value: 'blocks',
          label: __('Blocks', 'uipress-lite'),
        },
        layers: {
          value: 'layers',
          label: __('Layers', 'uipress-lite'),
        },
        library: {
          value: 'library',
          label: __('Library', 'uipress-lite'),
        },
      },
    };
  },
  watch: {
    'ui.sideBar.activeTab': {
      handler(newValue, oldValue) {
        this.$router.push({
          query: { ...this.$route.query, ...{ tab: newValue } },
        });
      },
      deep: true,
    },
    'template.content': {
      handler(newValue, oldValue) {
        let self = this;
        ///Finds outdated blocks / settings that need updating
        self.blocksForUpdating = [];
        self.uipress.findOutdatedBlocks(self.template.content, self.blocksForUpdating);
      },
      deep: true,
    },
    'blocksForUpdating': {
      handler(newValue, oldValue) {
        let self = this;
        if (!self.updating) {
          self.updating = true;
          let holdingBlocks = self.blocksForUpdating;
          self.uipress.updateBlocksV312(self.blocksForUpdating).then((response) => {
            for (let holder of self.blocksForUpdating) {
              let index = self.blocksForUpdating.findIndex((item) => item.uid === holder.uid);
              if (index > -1) {
                self.blocksForUpdating.splice(index, 1);
              }
            }
            self.blocksForUpdating = [];
            requestAnimationFrame(() => {
              self.updating = false;
            });
            //self.items = response;
          });
        }
      },
    },
    '$route.params.templateID': {
      handler() {
        this.templateID = this.$route.params.templateID;
        this.template.globalSettings = [];
        this.template.content = [];
        this.getTemplate();
      },
    },
  },
  provide() {
    return {
      uiTemplate: this.returnTemplateData,
      layersPanel: this.ui.layers,
      openModal: this.openModal,
      unsavedChanges: this.returnUnsaved,
    };
  },
  mounted: function () {
    let self = this;
    self.loading = false;
    self.getTemplate();

    document.addEventListener(
      'uip_page_change_loaded',
      (e) => {
        self.getNotifications();
      },
      { once: false }
    );

    for (const key in self.template.layout) {
      let item = self.template.layout[key];
      self.buildOptions(item.optionsEnabled, item.settings);
    }

    let query = self.$route.query;

    if (query) {
      if (query.tab) {
        self.ui.sideBar.activeTab = query.tab;
      }
    }

    //Watch for right clicks on frame content
    document.addEventListener(
      'right_click_frame',
      (e) => {
        self.uipress.searchForBlock(self.template.content, e.detail.uid).then((response) => {
          if (response) {
            let framePos = document.getElementById(e.detail.uid).getBoundingClientRect();

            e.detail.pos.y = this.uipData.userPrefs.builderPrefersZoom * e.detail.pos.y + framePos.y;
            e.detail.pos.x = this.uipData.userPrefs.builderPrefersZoom * e.detail.pos.x + framePos.x;

            self.ui.contextualMenu.block = response;
            self.setRightClickPos(e.detail.pos);
            self.ui.contextualMenu.display = true;
          } else {
            return;
          }
        });
      },
      { once: false }
    );
    if (window.parent) {
      window.parent.postMessage({ eventName: 'uip_request_fullscreen' }, '*');
    }
  },

  computed: {
    returnSelectedBlocks() {
      ///Maybe one day!
      if (!this.$route.params.uid) {
        this.selectedBlocks = [];
      }

      let self = this;
      let uid = this.$route.params.uid;

      self.uipress.searchForBlock(self.template.content, uid).then((response) => {
        if (response) {
          let block = response;
          let markedBlocks = document.querySelectorAll('.uip-preview-selected-block');
          if (!markedBlocks || !block) {
            return [];
          }

          for (let domBlock of markedBlocks) {
            self.selectedBlocks[domBlock];
          }
          console.log(self.selectedBlocks);
          return self.selectedBlocks;
        }
      });
    },
    returnTemplateData() {
      return this.template;
    },
    returnLayers() {
      return this.ui.layers;
    },
    currentRouteName() {
      return this.$route.name;
    },
    returnUnsaved() {
      return this.unsavedChanges;
    },
    returnOptionsWidth() {
      let width = parseFloat(this.uipData.userPrefs.builderOptionsWodth);
      if ((width && typeof width !== 'undefined' && width != '') || !isNaN(width)) {
        return 'width:' + width + 'px;';
      }
      return false;
    },
    getBlockshortcuts() {
      let self = this;
      self.ui.keyBlocks = [];
      self.uipress.findBYmodnameAndReturn(self.template.content, ['uip-admin-menu', 'uip-admin-menu-new', 'uip-content', 'uip-toolbar', 'uip-content-navigator'], self.ui.keyBlocks);
      return self.ui.keyBlocks;
    },
    returnLeftPanelStyle() {
      if (this.template.isPreview) {
        return 'transform:scale(0,1);max-width:0%;transition: all 0.2s ease-in-out;transform-origin: left;';
      } else {
        return 'max-width:100%;transition:all 0.2s ease-in-out;transform-origin: left;';
      }
    },
  },
  methods: {
    getNotifications() {
      let self = this;
      //Get frame
      let frames = document.getElementsByClassName('uip-page-content-frame');
      //Frame does not exist so abort
      let notifications;

      if (!frames[0]) {
        notifications = document.querySelectorAll('.notice:not(#message):not(.inline):not(.update-message),.wp-analytify-notification');
      } else {
        let contentframe = frames[0];
        notifications = contentframe.contentWindow.document.querySelectorAll('.notice:not(#message):not(.inline):not(.update-message),.wp-analytify-notification');
      }

      this.template.notifications = [];
      if (!notifications) return;

      let notiActive = false;
      if (JSON.stringify(self.template.content).includes('site-notifications')) {
        notiActive = true;
      }

      for (const noti of notifications) {
        this.template.notifications.push(noti.outerHTML.replace('uip-framed-page=1', ''));
        if (notiActive) {
          noti.setAttribute('style', 'display:none !important; visibility: hidden !important; opacity: 0 !important;');
        }
      }

      this.uipData.dynamicOptions.notificationCount.value = this.template.notifications.length;
    },
    addCanvas() {
      const containerBlock = this.uipData.blocks.filter((obj) => {
        return obj.moduleName == 'uip-container';
      });

      let copiedConatiner = JSON.parse(JSON.stringify(containerBlock[0]));

      delete copiedConatiner.path;
      delete copiedConatiner.args;

      delete copiedConatiner.category;

      delete copiedConatiner.description;

      delete copiedConatiner.path;

      copiedConatiner.uid = this.uipress.createUID();
      copiedConatiner.name = __('Canvas', 'uipress-lite');

      this.uipress.createNestedObject(copiedConatiner, ['settings', 'style', 'options', 'flexLayout', 'value']);
      copiedConatiner.settings.style.options.flexLayout.value = {
        direction: 'row',
        distribute: 'start',
        align: 'flex-start',
        wrap: 'wrap',
        type: 'stack',
      };

      this.uipress.inject_block_presets(copiedConatiner, copiedConatiner.settings);
      this.template.content.push(copiedConatiner);
    },

    injectSavedStyles(styles) {
      let themeStyles = this.uipData.themeStyles;
      for (let key in themeStyles) {
        let item = themeStyles[key];

        if (styles[item.name]) {
          if ('value' in styles[item.name]) {
            item.value = styles[item.name].value;
          }
          if ('darkValue' in styles[item.name]) {
            item.darkValue = styles[item.name].darkValue;
          }
        }
      }

      for (let key in styles) {
        let item = styles[key];
        if (item.user) {
          this.uipData.themeStyles[item.name] = item;
        }
      }
    },
    getTemplate() {
      let self = this;

      //Build form data for fetch request
      let formData = new FormData();
      formData.append('action', 'uip_get_ui_template');
      formData.append('security', uip_ajax.security);
      formData.append('templateID', self.templateID);
      self.layoutFetched = false;

      self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
        if (response.error) {
          self.uipress.notify(response.message, '', 'error', true);
          return;
        }

        if (response.styles) {
          self.injectSavedStyles(response.styles);
        }

        let settings = response.settings[0];
        let content = response.content;

        //Store user patterns
        self.template.patterns = response.patterns;

        if (!content) {
          self.addCanvas();

          self.layoutFetched = true;
          return;
        }

        if (!settings) {
          if ('type' in response) {
            self.template.globalSettings.type = response.type;
          }

          if (content.length === 0) {
            self.addCanvas();
          }

          self.layoutFetched = true;
          return;
        }
        //Update global settings
        if ('excludesRolesAndUsers' in settings) {
          self.template.globalSettings.excludesRolesAndUsers = settings.excludesRolesAndUsers;
        }
        if ('rolesAndUsers' in settings) {
          self.template.globalSettings.rolesAndUsers = settings.rolesAndUsers;
        }
        if ('name' in settings) {
          self.template.globalSettings.name = settings.name;
        }
        if ('status' in settings) {
          self.template.globalSettings.status = settings.status;
        }
        if ('type' in settings) {
          self.template.globalSettings.type = settings.type;
        }
        if ('excludesRolesAndUsers' in settings) {
          self.template.globalSettings.excludesRolesAndUsers = settings.excludesRolesAndUsers;
        }

        if ('applyToSubsites' in settings) {
          self.template.globalSettings.applyToSubsites = settings.applyToSubsites;
        }

        if ('options' in settings) {
          self.template.globalSettings.options = settings.options;
        }
        if ('menuParent' in settings) {
          self.template.globalSettings.menuParent = settings.menuParent;
        }
        if ('menuIcon' in settings) {
          self.template.globalSettings.menuIcon = settings.menuIcon;
        }
        self.formatBuilderGroupOptions();

        self.unsavedChanges = false;

        self.template.content = content;
        self.template.globalSettings.updatedV312 = true;
        self.getNotifications();
        requestAnimationFrame(() => {
          self.layoutFetched = true;
        });

        return;
      });
    },

    formatBuilderGroupOptions() {
      let self = this;
      let settings = self.uipData.templateGroupOptions;
      let options = self.template.globalSettings.options;

      for (let [key, value] of Object.entries(settings)) {
        if (!(key in options)) {
          options[key] = {};
        }

        for (let option of value.settings) {
          if (!value.uniqueKey in options[key]) {
            if (option.accepts === String) {
              options[group][key] = '';
            }
            if (option.accepts === Array) {
              options[group][key] = [];
            }
            if (option.accepts === Object) {
              options[group][key] = {};
            }
          }
        }
      }
    },
    openThemeLibrary() {
      //let ID = this.$route.params.templateID;
      //this.$router.push('/uibuilder/' + ID);
      this.$router.push({
        query: { tab: 'library' },
      });
      this.ui.sideBar.activeTab = 'library';
    },
    suppressWelcome() {
      this.welcomeMessage = false;
      this.uipData.userPrefs.supressBuilderWelcome = true;
      this.uipress.saveUserPreference('supressBuilderWelcome', true, false);
    },
    closeLayersPanel() {
      this.ui.layers.display = false;
      this.uipress.saveUserPreference('builderLayers', false, false);
    },
    openModal(componentName, modalTitle, args) {
      if (!componentName || componentName == '') {
        return;
      }
      this.ui.modal.activeModule = componentName;
      this.ui.modal.title = modalTitle;
      this.ui.modal.args = args;
      this.ui.modal.open = true;

      //this.setPosition();
      // You can also use Vue.$nextTick or setTimeout
      requestAnimationFrame(() => {
        document.documentElement.addEventListener('click', this.onClickOutside, false);
      });
    },
    onClickOutside(event) {
      if (!this.$refs.uipmodal) {
        return;
      }
      const path = event.path || (event.composedPath ? event.composedPath() : undefined);
      // check if the MouseClick occurs inside the component
      if (path && !path.includes(this.$refs.uipmodal) && !this.$refs.uipmodal.contains(event.target)) {
        this.closeThisComponent(); // whatever method which close your component
      }
    },
    closeThisComponent() {
      this.ui.modal.open = false; // whatever codes which close your component
      document.documentElement.removeEventListener('click', this.onClickOutside, false);
    },
    confirmEmptyTemplate() {
      let self = this;

      this.uipress.confirm(__('Are you sure?', 'uipress-lite'), __('This will delete all blocks from your template.', 'uipress-lite')).then((response) => {
        if (response) {
          self.template.content = [];
        }
      });
    },
    componentExists(name) {
      if (this.$root._.appContext.components[name]) {
        return true;
      } else {
        return false;
      }
    },
    mouseMoveHandler(e) {
      const optionsPanel = document.getElementById('uip-builder-settings-panel');
      let change = e.clientX - this.ui.settingsPanel.pos.startX;
      optionsPanel.style.width = this.ui.settingsPanel.pos.width - change + 'px';
    },
    mouseUpHandler() {
      document.removeEventListener('mousemove', this.mouseMoveHandler, true);
      document.removeEventListener('mouseup', this.mouseUpHandler, true);
      const optionsPanel = document.getElementById('uip-builder-settings-panel');
      this.uipress.saveUserPreference('builderOptionsWodth', optionsPanel.style.width, false);
    },
    mouseDownHandler(e) {
      const optionsPanel = document.getElementById('uip-builder-settings-panel');

      this.ui.settingsPanel.pos = {
        // The current scroll
        startX: e.clientX,
        width: parseInt(optionsPanel.getBoundingClientRect().width, 10),
      };
      document.addEventListener('mousemove', this.mouseMoveHandler, true);
      document.addEventListener('mouseup', this.mouseUpHandler, true);
    },
    openSettings(uid) {
      let ID = this.$route.params.templateID;
      this.$router.push('/uibuilder/' + ID + '/settings/blocks/' + uid);
    },
    showOptions(evt, item) {
      let self = this;

      let settingsPanel = document.querySelector('#uip-builder-settings-panel');
      if (settingsPanel) {
        if (settingsPanel.contains(evt.target)) {
          return;
        }
      }

      let target = false;
      let attr = 'block-uid';
      let foldersPanel = document.querySelector('.uip-template-layers');

      target = evt.target.closest('[block-uid]');

      if (!target) {
        self.closeContextual();
        return;
      }
      let targetUID = target.getAttribute('block-uid');
      //No block to select
      if (!targetUID) {
        self.closeContextual();
        return;
      }

      evt.preventDefault();

      self.uipress.searchForBlock(self.template.content, targetUID).then((response) => {
        if (response) {
          self.ui.contextualMenu.block = response;
          self.setRightClickPos(evt);
          self.ui.contextualMenu.display = true;
        } else {
          return;
        }
      });
    },
    setRightClickPos(e) {
      let self = this;
      let x = e.pageX;
      let y = e.pageY;

      if (!('pageX' in e)) {
        x = e.x;
        y = e.y;
      }

      let contextHeight = 300;
      window.innerHeight;

      if (y + contextHeight > window.innerHeight) {
        y = y - contextHeight;
      }
      self.ui.contextualMenu.top = `${y}px`;
      self.ui.contextualMenu.left = `${x}px`;
    },
    returnContextMenuStyle() {
      let self = this;
      let style = 'top:' + self.ui.contextualMenu.top + '; left:' + self.ui.contextualMenu.left + ';';
      return style;
    },

    hideContextual(evt) {
      let self = this;

      if (self.ui.contextualMenu.display) {
        // check if the MouseClick occurs inside the component
        if (!self.$refs.contextualMenu.contains(evt.target)) {
          self.ui.contextualMenu.display = false;
        }
      }
    },
    closeContextual() {
      this.ui.contextualMenu.display = false;
    },
  },
  template: `
    
    
      <component is="style">
        .v-enter-active, .v-leave-active {transition: opacity 0.6s ease;}
        .v-enter-from, .v-leave-to {opacity: 0;}
      </component>
      
      <Transition>
        <div v-if="!layoutFetched" class="uip-background-default uip-body-font uip-h-viewport uip-max-h-viewport uip-flex uip-flex-center uip-flex-middle uip-position-fixed uip-z-index-9" 
        style="min-height: 100vh; max-height: 100vh; min-width: 100vw; max-width: 100vw">
          <loading-chart></loading-chart>
        </div>
      </Transition>
      
      
      <component is="style">
        #wpcontent{margin:0 !important;}
        #wpadminbar{display:none !important;}
        html.wp-toolbar{padding-top:0;}
        #adminmenumain{display:none}
      </component>
    
      <div v-if="layoutFetched" class="uip-background-default uip-body-font uip-h-viewport uip-max-h-viewport uip-flex uip-text-normal uip-app-frame uip-border-box uip-builder-frame uip-flex uip-flex-column uip-w-100p" >
          
          <!--Dynamic data watcher-->
          <DynamicData/>
          
        
          <!--Builder Toolbar-->
          <ToolBar/>
          
          
      
      
          <div class="uip-flex uip-h-100p uip-flex-grow uip-overflow-hidden uip-position-relative">
          

            <!--Left panel -->
            <div class="uip-overflow-auto uip-scrollbar uip-border-right uip-app-frame uip-flex-no-shrink uip-w-300 uip-max-h-100p uip-background-default uip-z-index-1" 
            :style="returnLeftPanelStyle">
              
              
              <div class="uip-flex uip-flex-column uip-h-100p uip-max-h-100p">
              
                  <div class="uip-padding-s uip-border-box ">
                    <toggle-switch :options="switchOptions" :activeValue="ui.sideBar.activeTab" :dontAccentActive="true" :returnValue="function(data){ ui.sideBar.activeTab = data}"></toggle-switch>
                  </div>
                  
                  <div class="uip-padding-left-s uip-padding-right-s uip-flex">
                    <div class="uip-border-bottom uip-w-100p"></div>
                  </div>
                  
                  <!-- OUTPUT SETTINGS OR BLOCKS -->
                  <div class="uip-flex-grow uip-overflow-auto uip-padding-s uip-scrollbar">
                  
                    <TemplateLibrary v-if="ui.sideBar.activeTab == 'library'"/>
                    
                    <BlockList v-if="ui.sideBar.activeTab == 'blocks'"/>
                   
                    
                    <!--LAYERS-->
                    <template v-if="ui.sideBar.activeTab == 'layers'" >
                      <div class="uip-flex uip-flex-column uip-row-gap-xs">
                      
                        <layersPanels :content="template.content" :returnData="function(data){template.content = data}" />
                        
                        <!--Block selector-->
                        <div class="uip-flex uip-flex-center uip-flex-middle uip-flex-row">
                          <dropdown width="260" pos="right center" triggerClass="uip-w-100p" class="uip-w-100p">
                            <template v-slot:trigger>
                              <div ref="footer" class="uip-text-muted uip-text-center uip-padding-xxs uip-text-center uip-icon uip-link-muted uip-border-rounder uip-border uip-cursor-pointer uip-w-100p uip-text-s" >add</div>
                            </template>
                            <template v-slot:content>
                              <div class="uip-padding-s uip-max-w-300 uip-w-300 uip-max-h-300 uip-overflow-auto uip-scrollbar">
                                <BlockList mode="click" :insertArea="template.content"/>
                              </div>
                            </template>
                          </dropdown>
                        </div>
                        <!--End block selector-->
                        
                        
                        <div class="uip-padding-xs uip-margin-top-s uip-flex uip-flex-column uip-row-gap-xs">
                        
                          <div class="uip-text-bold uip-text-m uip-flex uip-gap-xs uip-flex-center uip-flex-between">
                            {{ui.strings.shortCuts}}
                          </div>
                          
                          <div v-if="getBlockshortcuts.length < 1" class="uip-text-muted uip-text-s">
                            {{ui.strings.shortCutsExplanation}}
                          </div>
                        
                        </div>
                          
                        <div class="uip-flex uip-flex-column uip-row-gap-xxxs uip-padding-xxxs">
                          
                          <template v-for="element in getBlockshortcuts">
                            <div class="uip-flex ui-flex-middle uip-flex-center uip-gap-xxs uip-flex uip-cursor-pointer uip-flex-middle uip-flex-center uip-border-round uip-padding-xxs hover:uip-background-muted" style="min-width:140px">
                              <div class="uip-cursor-pointer uip-icon uip-padding-xxxs" @click="openSettings(element.uid)">{{element.icon}}</div>
                              <div class="uip-cursor-pointer uip-flex-grow uip-text-s" @click="openSettings(element.uid)">{{element.name}}</div>
                            </div>
                          </template>
                            
                        </div>
                        
                      </div>
                      
                      
                      <!-- End right click -->
                    
                    </template>
                    
                    <!--END LAYERS-->
                    
                  </div>
                  
              </div>
              
              
              
            </div>
            <!--End Layers panel -->
            
            <!-- Main canvas -->
            <div class="uip-flex-grow uip-canvas-background">
              <Canvas/>
            </div>
            <!--End canvas-->
            
            
            <!--Right bar -->
            <router-view :key="$route.path" v-show="!template.isPreview"></router-view>
            <!-- End right bar -->
            
          </div>
          
	      </div>
      
        <div ref="modalOuter" v-if="ui.modal.activeModule != '' && ui.modal.open" class="uip-position-fixed uip-top-0 uip-left-0 uip-h-viewport uip-w-vw uip-background-black-wash uip-flex uip-flex-center uip-flex-middle uip-fade-in">
          <div ref="uipmodal" class="uip-background-default uip-border-round uip-border uip-flex uip-flex-column uip-row-gap-s uip-scale-in uip-min-w-350 uip-w-600 uip-max-w-100p uip-text-normal">
            <div class="uip-flex uip-flex-between  uip-padding-s">
              <div class="uip-text-bold uip-text-l">{{ui.modal.title}}</div>
              <div @click="closeThisComponent()" class="hover:uip-background-grey uip-padding-xxs uip-border-round uip-cursor-pointer">
                <div class="uip-icon uip-text-l">close</div>
              </div>
            </div>
            <div class="uip-max-h-500 uip-overflow-auto uip-scrollbar  uip-padding-s uip-padding-top-remove">
              <component :is="ui.modal.activeModule" :args="ui.modal.args"></component>
            </div>
          </div>
        </div>
    
        <!--Import plugins -->
        <template v-for="plugin in uipData.plugins" v-if="layoutFetched">
          <component v-if="componentExists(plugin.component) && plugin.loadInApp" :is="plugin.component"></component>
        </template>
        <!-- end plugin import -->
      
        
        
        <!--Block context menu-->
        <blockcontextmenu/>
        
        
        
        
        
        
        
        `,
};
