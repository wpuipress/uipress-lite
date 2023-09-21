const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
    },
    data: function () {
      return {
        toolbar: {},
        rendered: false,
      };
    },
    inject: ['uipData', 'uipress', 'uiTemplate'],
    watch: {
      'uipData.toolbar': {
        handler(newValue, oldValue) {},
        deep: true,
      },
    },
    mounted: function () {
      let self = this;

      this.dequeueAdminBarStyles();

      this.toolbar = JSON.parse(JSON.stringify(this.uipData.toolbar));
      requestAnimationFrame(() => {
        self.updateFromDom();
      });
      //Watch for toolbar changes in frame
      document.addEventListener(
        'uip_page_change_loaded',
        (e) => {
          self.updateToolBarFromFrame();
          setTimeout(function () {
            self.updateQM();
            self.updateFromDom();
          }, 100);
        },
        { once: false }
      );

      requestAnimationFrame(() => {
        this.rendered = true;
      });
    },
    computed: {
      getHidden() {
        let hidden = this.block.settings.block.options.hiddenToolbarItems.value;

        if (this.uipress.isObject(hidden)) {
          return [];
        } else {
          return hidden;
        }
      },
      returnToolbar() {
        return this.toolbar;
      },
      returnDropdownPosition() {
        let update = this.uipress.get_block_option(this.block, 'block', 'dropdownPosition');
        if (this.uipress.isObject(update)) {
          return update.value;
        }

        if (update == '') {
          return 'bottom-left';
        }
        return update;
      },
      returnSubDropdownPosition() {
        let update = this.uipress.get_block_option(this.block, 'block', 'subDropdownPosition');
        if (this.uipress.isObject(update)) {
          return update.value;
        }

        if (update == '') {
          return 'right';
        }
        return update;
      },
    },
    methods: {
      //Removes default admin bar styling
      dequeueAdminBarStyles() {
        let styleblock = document.querySelector('link[href*="load-styles.php?"]');
        if (styleblock) {
          let href = styleblock.href.replace('admin-bar,', '');
          setTimeout(() => {
            styleblock.href = href;
          }, 100);
        }
      },
      updateFromDom() {
        let self = this;
        //Get frame
        let frames = document.getElementsByClassName('uip-page-content-frame');
        let contentframe;
        //Frame does not exist so use current dom
        if (!frames[0]) {
          contentframe = document;
          console.log('helloooo');
        } else {
          contentframe = frames[0].contentWindow.document;
        }

        let toolbarItems = contentframe.getElementById('wp-admin-bar-root-default');
        let secondarytoolbarItems = contentframe.getElementById('wp-admin-bar-top-secondary');
        if (!toolbarItems) return;

        //Get all toolbar items
        let items = toolbarItems.children;
        let secondaryitems = secondarytoolbarItems.children;

        var allitems = [];
        allitems = Array.prototype.concat.apply(allitems, items);
        allitems = Array.prototype.concat.apply(allitems, secondaryitems);
        //console.log(items);
        //console.log(self.toolbar);
        let adminURL = self.uipData.options.adminURL;
        let homeURL = self.uipData.options.domain;
        let adminPath = adminURL.replace(homeURL, '');

        for (const child of allitems) {
          let attr = child.getAttribute('id');
          if (!attr) continue;
          attr = attr.replace('wp-admin-bar-', '');

          //Non existent toolbar item so let's add
          if (!(attr in self.toolbar) && attr != 'site-name' && attr != 'menu-toggle' && attr != 'app-logo' && attr != 'my-account') {
            let newObj = {
              id: 'attr',
              group: '',
              meta: [],
              parent: '',
              submenu: {},
              title: '',
              href: '',
            };

            let link = child.querySelector('a.ab-item');

            if (link) {
              let href = link.getAttribute('href');
              if (href) {
                if (href.startsWith(adminPath)) {
                  href = href.replace(adminPath, adminURL);
                }
              }

              newObj.href = href;
              newObj.title = link.innerHTML;
            }

            let subWrap = child.querySelector('.ab-sub-wrapper .ab-submenu');
            if (subWrap) {
              for (const subchild of subWrap.children) {
                let subattr = subchild.getAttribute('id');
                if (!subattr) continue;
                subattr = subattr.replace('wp-admin-bar-', '');

                let subLink = subchild.querySelector('a.ab-item');

                let newSubObj = {
                  id: attr,
                  group: '',
                  meta: [],
                  parent: attr,
                  submenu: {},
                  title: '',
                  href: '',
                };

                if (subLink) {
                  let subhref = subLink.getAttribute('href');
                  if (subhref) {
                    if (subhref.startsWith(adminPath)) {
                      subhref = subhref.replace(adminPath, adminURL);
                    }
                  }

                  newSubObj.href = subhref;
                  newSubObj.title = subLink.innerHTML;
                }

                newObj.submenu[subattr] = newSubObj;
              }
            }

            ///Push to toolbar
            self.toolbar[attr] = newObj;
          }
        }
      },
      updateQM() {
        let self = this;
        //Check if query monitor is active
        if (!('query-monitor' in self.toolbar)) {
          return;
        }
        //Get frame
        let frames = document.getElementsByClassName('uip-page-content-frame');
        //Frame does not exist so abort
        if (!frames[0]) {
          return;
        }
        let contentframe = frames[0];
        //Get query monitor item from within frame
        let qmObject = contentframe.contentWindow.document.getElementById('wp-admin-bar-query-monitor');
        //No query monitor item inside frame
        if (!qmObject) {
          return;
        }

        let labelObj = qmObject.getElementsByClassName('ab-label');
        self.toolbar['query-monitor'].title = labelObj[0].outerHTML;
        self.toolbar['query-monitor'].frameLink = true;

        //Check for errors
        if (qmObject.classList.contains('qm-warning')) {
          self.toolbar['query-monitor'].title += '<span class="uip-display-inline-block uip-border-circle uip-w-8 uip-ratio-1-1 uip-background-red uip-margin-left-xxs"></span>';
        }

        //Check for warnings
        if (
          qmObject.classList.contains('qm-alert') ||
          qmObject.classList.contains('qm-notice') ||
          qmObject.classList.contains('qm-deprecated') ||
          qmObject.classList.contains('qm-strict') ||
          qmObject.classList.contains('qm-expensive')
        ) {
          self.toolbar['query-monitor'].title += '<span class="uip-display-inline-block uip-border-circle uip-w-8 uip-ratio-1-1 uip-background-orange uip-margin-left-xxs"></span>';
        }

        let items = qmObject.querySelectorAll('#wp-admin-bar-query-monitor-default > li');
        let newSubs = {};
        //Loop through links and pull relevant content
        for (let sub of items) {
          let ogid = sub.getAttribute('id');
          let id = ogid.replace('wp-admin-bar-query-monitor-', '');
          let link = sub.querySelector('a');
          let href = link.getAttribute('href');
          let title = link.textContent;

          newSubs[id] = {
            group: '',
            href: href,
            id: ogid,
            meta: [],
            parent: 'query-monitor',
            submenu: {},
            title: title,
            frameLink: true,
          };
        }

        self.toolbar['query-monitor'].submenu = newSubs;
      },
      updateToolBarFromFrame() {
        let frames = document.getElementsByClassName('uip-page-content-frame');
        let self = this;

        if (frames[0]) {
          let frame = frames[0];
          //Update toolbar items when the page changes
          if (frame.contentWindow.uipMasterToolbar && typeof frame.contentWindow.uipMasterToolbar !== 'undefined') {
            let toolbar = frame.contentWindow.uipMasterToolbar;
            if (!Array.isArray(toolbar)) {
              self.toolbar = JSON.parse(JSON.stringify(toolbar));
            }
          }
        }
      },
      ifHiden(uid) {
        if (this.getHidden.includes(uid)) {
          return false;
        }

        return true;
      },
      customIcon(id) {
        let icons = this.uipress.get_block_option(this.block, 'block', 'editToolbarItems');
        if (!this.uipress.isObject(icons)) {
          return false;
        }
        if (id in icons) {
          let value = icons[id].icon;
          if (value != '') {
            return value;
          }
        }
        return false;
      },
      customTitle(id) {
        let icons = this.uipress.get_block_option(this.block, 'block', 'editToolbarItems');

        if (!this.uipress.isObject(icons)) {
          return false;
        }
        if (Object.hasOwn(icons, id)) {
          let value = icons[id].title;
          if (value != '') {
            return value;
          }
        }
        return false;
      },

      updatePage(item, evt, forceReload) {
        if (evt.ctrlKey || evt.shiftKey || evt.metaKey || (evt.button && evt.button == 1)) {
          return;
        } else {
          evt.preventDefault();
        }

        if (item.frameLink) {
          //Get frame
          let frames = document.getElementsByClassName('uip-page-content-frame');
          //Frame does not exist so abort
          if (!frames[0]) {
            return;
          }
          let contentframe = frames[0];

          //Find og query monitor click
          let oglINK = contentframe.contentWindow.document.querySelector('#' + item.id + ' a');
          if (oglINK) {
            oglINK.click();
          }
          return;
        }

        if (forceReload) {
          this.uipress.updatePage(this.formatHREF(item.href), forceReload);
        } else {
          this.uipress.updatePage(this.formatHREF(item.href));
        }
      },
      formatHREF(link) {
        let self = this;
        let adminURL = self.uipData.options.adminURL;
        let homeURL = self.uipData.options.domain;
        let adminPath = adminURL.replace(homeURL, '');

        if (link) {
          if (link.startsWith(adminPath)) {
            link = link.replace(adminPath, adminURL);
          }
        }

        return link;
      },
    },
    template: `
            <div class="uip-text-normal" v-if="rendered">
            
            
              <component is="style">
                .uip-admin-toolbar #wpadminbar {all:unset}
                .uip-admin-toolbar #wpadminbar .ab-icon {font-size:18px; filter: contrast(0.6);}
              </component>
              
              <div id="wpadminbar" style="display: block !important;">
              
                <div class="uip-admin-toolbar uip-flex">
                  <template v-for="item in returnToolbar">
                  
                    <div class="" v-if="ifHiden(item.id)" :id="'wp-admin-bar-' + item.id" :class="item.meta.class">
                      <!--FIRST DROP -->
                      <dropdown :hover="true" :pos="returnDropdownPosition">
                        <template v-slot:trigger>
                        
                          <a :href="formatHREF(item.href)" @click="updatePage(item, $event)" class="uip-link-default uip-no-underline uip-toolbar-top-item uip-flex uip-gap-xs uip-flex-center">
                            <div class="uip-icon uip-toolbar-top-item-icon uip-text-l" v-if="customIcon(item.id)">{{customIcon(item.id)}}</div>
                            
                            <component v-if="customIcon(item.id)" is="style" scoped>
                              #{{'wp-admin-bar-' + item.id}} .ab-icon{display:none}
                            </component>
                            
                            <div class="uip-line-height-1 uip-flex uip-gap-xxs" v-if="customTitle(item.id)">{{customTitle(item.id)}}</div>
                            <div class="uip-line-height-1 uip-flex uip-gap-xxs uip-flex-center" v-if="!customTitle(item.id)" v-html="item.title"></div>
                          </a>
                        </template>
                        <template v-slot:content v-if="item.submenu && Object.keys(item.submenu).length > 0">
                        
                          <div class="uip-toolbar-submenu uip-min-w-200 uip-border-rounder uip-padding-xs">
                          
                          
                            <!-- NETWORK ADMIN TOOLBAR -->
                            <template v-if="item.id == 'my-sites'" v-for="subsection in item.submenu">
                              <div class="uip-padding-xxs uip-flex uip-flex-column uip-row-gap-xxs uip-min-w-130">
                                <template v-for="sub in subsection.submenu">
                                  <!--SECOND DROP -->
                                <dropdown width="200" :hover="true">
                                    <template v-slot:trigger>
                                      <a :href="formatHREF(sub.href)" @click="updatePage(sub, $event, true)"  class="uip-link-default uip-no-underline uip-toolbar-sub-item uip-flex uip-flex-center uip-flex-between uip-gap-s uip-flex-grow uip-padding-xxs uip-border-rounder hover:uip-background-muted" >
                                        <span v-html="sub.title"></span>
                                        <span v-if="sub.submenu" class="uip-icon">chevron_right</span>
                                      </a>
                                    </template>
                                    <template v-slot:content v-if="sub.submenu">
                                      <div class="uip-toolbar-submenu uip-min-w-200 uip-padding-xs">
                                        <template v-for="subsub in sub.submenu">
                                          <a :href="formatHREF(subsub.href)" @click="updatePage(subsub, $event, true)"  class="uip-link-default uip-no-underline uip-toolbar-sub-item uip-flex uip-flex-center uip-flex-between uip-gap-s uip-flex-grow uip-padding-xxs uip-border-rounder hover:uip-background-muted" v-html="subsub.title"></a>
                                        </template>
                                      </div>
                                    </template>
                                  </dropdown>
                                  <!--END SECOND DROP -->
                                </template>
                              </div>
                              <div v-if="subsection.id == 'my-sites-super-admin'" class="uip-border-bottom"></div>\
                            </template>
                            <!-- END NETWORK ADMIN TOOLBAR -->
                            
                            
                            <template  v-else v-for="sub in item.submenu">
                              <!--SECOND DROP -->
                              <dropdown width="200" :pos="returnSubDropdownPosition" triggerClass="uip-flex uip-flex-grow" :hover="true">
                                <template v-slot:trigger>
                                  <a @click="updatePage(sub, $event)" :href="formatHREF(sub.href)" class="uip-link-default uip-no-underline uip-toolbar-sub-item uip-flex uip-flex-center uip-flex-between uip-gap-s uip-flex-grow uip-padding-xxs uip-border-rounder hover:uip-background-muted" >
                                    <span v-html="sub.title"></span>
                                    <span v-if="Object.keys(sub.submenu).length > 0" class="uip-icon">chevron_right</span>
                                  </a>
                                </template>
                                <template v-slot:content v-if="Object.keys(sub.submenu).length > 0">
                                  <div class="uip-toolbar-submenu uip-min-w-200 uip-padding-xs">
                                    <template v-for="subsub in sub.submenu">
                                      <a @click="updatePage(subsub, $event)" :href="formatHREF(subsub.href)" class="uip-link-default uip-no-underline uip-toolbar-sub-item uip-flex uip-flex-center uip-flex-between uip-gap-s uip-flex-grow uip-padding-xxs uip-border-rounder hover:uip-background-muted" v-html="subsub.title"></a>
                                    </template>
                                  </div>
                                </template>
                              </dropdown>
                              <!--END SECOND DROP -->
                            </template>
                          </div>
                        </template>
                      </dropdown>
                      <!--END FIRST DROP -->
                      
                    </div>
                  </template>
                </div>
              
              </div>
              
            </div>`,
  };
}
