/**
 * Builds the list view for patterns
 * @since 3.0.0
 */
import * as twoColumnPattern from '../patterns/2_column_layout.min.js';
import * as threeColumnPattern from '../patterns/3_column_layout.min.js';
import * as fourColumnPattern from '../patterns/4_column_layout.min.js';
import * as adminBoilerPlate from '../patterns/admin_boilerplate.min.js';
const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      mode: String,
      insertArea: Array,
    },
    data: function () {
      return {
        loading: true,
        categories: [],
        builtInLayouts: [
          {
            description: '',
            name: __('2 column', 'uipress-lite'),
            icon: 'view_column_2',
            type: 'layout',
            template: JSON.parse(twoColumnPattern.exportPattern()),
          },
          {
            description: '',
            name: __('3 column', 'uipress-lite'),
            icon: 'view_week',
            type: 'layout',
            template: JSON.parse(threeColumnPattern.exportPattern()),
          },
          {
            description: '',
            name: __('4 column', 'uipress-lite'),
            icon: 'calendar_view_week',
            type: 'layout',
            template: JSON.parse(fourColumnPattern.exportPattern()),
          },
          {
            description: __('A basic sidebar, toolbar and content frame layout', 'uipress-lite'),
            name: __('Admin boilerplate', 'uipress-lite'),
            icon: 'view_quilt',
            type: 'layout',
            template: JSON.parse(adminBoilerPlate.exportPattern()),
          },
        ],
        search: '',
        patternTypes: [
          { name: 'layout', label: __('Layout', 'uipress-lite') },
          { name: 'block', label: __('Block', 'uipress-lite') },
        ],
        strings: {
          proBlock: __('Pro', 'uipress-lite'),
          seachPatterns: __('Search patterns...', 'uipress-lite'),
          patternTitle: __('Pattern title', 'uipress-lite'),
          patternType: __('Pattern type', 'uipress-lite'),
          savePattern: __('Save pattern', 'uipress-lite'),
          description: __('Description', 'uipress-lite'),
          patternIcon: __('Pattern icon', 'uipress-lite'),
          import: __('Import', 'uipress-lite'),
          layouts: __('Layouts', 'uipress-lite'),
          patterns: __('Patterns', 'uipress-lite'),
        },
      };
    },
    inject: ['uipData', 'router', 'uipress', 'uiTemplate'],
    mounted: function () {
      this.loading = false;
    },
    computed: {
      returnPatterns() {
        return this.uiTemplate.patterns;
      },
    },
    methods: {
      setDropAreaClasses() {
        let returnData = [];
        returnData.class = 'uip-flex uip-flex-column uip-row-gap-xxs uip-w-100p';
        return returnData;
      },
      clone(block) {
        let itemFreshIDs = this.duplicateBlock(block.template);
        let item = JSON.parse(JSON.stringify(itemFreshIDs));
        return item;
      },
      //Iterate over content and create new UIDs
      duplicateBlock(block) {
        let item = Object.assign({}, block);
        item.uid = this.uipress.createUID();
        item.options = [];
        item.settings = JSON.parse(JSON.stringify(item.settings));

        if (item.content) {
          item.content = this.duplicateChildren(item.content);
        }

        return item;
      },

      duplicateChildren(content) {
        let returnChildren = [];

        for (let block of content) {
          let item = Object.assign({}, block);
          item.uid = this.uipress.createUID();
          item.settings = JSON.parse(JSON.stringify(item.settings));

          if (item.content) {
            item.content = this.duplicateChildren(item.content);
          }

          returnChildren.push(item);
        }

        return returnChildren;
      },
      setDragAreaClasses() {
        let returnData = [];
        returnData.class = 'uip-flex uip-flex-column uip-row-gap-xxxs uip-margin-bottom-s';

        return returnData;
      },
      insertAtPos(block) {
        //Check if we allowing click from modal list
        if (this.mode != 'click') {
          return;
        }
        if (Array.isArray(this.insertArea)) {
          this.insertArea.push(this.clone(block));
        }
      },
      inSearch(block) {
        if (this.search == '') {
          return true;
        }
        let str = this.search.toLowerCase();

        if (block.name.toLowerCase().includes(str)) {
          return true;
        }
        if (block.description.toLowerCase().includes(str)) {
          return true;
        }
        return false;
      },
      returnIcon(pattern) {
        if (pattern.icon && pattern.icon != '') {
          return pattern.icon;
        }
        if (pattern.type == 'layout') {
          return 'account_tree';
        } else if (pattern.type == 'block') {
          return 'add_box';
        }
        return 'interests';
      },
      getPatterns() {
        let self = this;

        let formData = new FormData();
        formData.append('action', 'uip_get_ui_patterns_list');
        formData.append('security', uip_ajax.security);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          if (response.error) {
            self.uipress.notify(response.message, 'uipress-lite', '', 'error', true);
          }
          if (response.success) {
            self.uiTemplate.patterns = response.patterns;
          }
        });
      },
      deleteThisItem(postID) {
        let self = this;
        this.uipress.deletePost(postID).then((response) => {
          if (response) {
            self.getPatterns();
          }
        });
      },
      exportPattern(pattern, index) {
        self = this;
        let layout = JSON.stringify(pattern);
        let name = pattern.name;

        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        let date_today = mm + '-' + dd + '-' + yyyy;
        let filename = 'uip-ui-pattern-' + name + '-' + date_today + '.json';

        let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(layout);
        let dlAnchorElem = document.getElementById('uip-pattern-export-' + index);
        dlAnchorElem.setAttribute('href', dataStr);
        dlAnchorElem.setAttribute('download', filename);
        dlAnchorElem.click();
        self.uipress.notify(__('Pattern exported', 'uipress-lite'), '', 'success', true);
      },
      importPattern() {
        let self = this;
        let notiID = self.uipress.notify(__('Importing pattern', 'uipress-lite'), '', 'default', false, true);

        let fileInput = document.getElementById('uip-import-pattern');
        let thefile = fileInput.files[0];

        if (thefile.type != 'application/json') {
          self.uipress.notify('Patterns must be in valid JSON format', '', 'error', true, false);
          return;
        }

        if (thefile.size > 1000000) {
          self.uipress.notify('Uploaded file is too big', '', 'error', true, false);
          return;
        }

        let reader = new FileReader();
        reader.readAsText(thefile, 'UTF-8');

        reader.onload = function (evt) {
          let json_settings = evt.target.result;
          let parsed;
          try {
            parsed = JSON.parse(json_settings);
          } catch (error) {
            self.uipress.notify(error, '', 'error', true, false);
            self.uipress.destroy_notification(notiID);
            return;
          }

          if (parsed != null) {
            if (!self.uipress.isObject(parsed)) {
              self.uipress.notify('Pattern is not valid', '', 'error', true, false);
              self.uipress.destroy_notification(notiID);
              return;
            }

            if (!('template' in parsed)) {
              self.uipress.notify('Pattern is not valid', '', 'error', true, false);
              self.uipress.destroy_notification(notiID);
              return;
            }
            self.uipress.validDateTemplate([parsed.template]).then((response) => {
              if (!response.includes(false)) {
                //self.uiTemplate.content = parsed;

                self.savePatternToDb(parsed).then((response) => {
                  if (response) {
                    self.uipress.notify('Pattern imported', '', 'success', true, false);
                    self.uipress.destroy_notification(notiID);
                  }
                });
              } else {
                self.uipress.notify('File is not a valid JSON template', '', 'error', true, false);
                self.uipress.destroy_notification(notiID);
              }
            });
          } else {
            self.uipress.notify('JSON parse failed', '', 'error', true, false);
            self.uipress.destroy_notification(notiID);
          }
        };
      },
      async savePatternToDb(importedPattern) {
        let self = this;
        let pattern = JSON.stringify(importedPattern.template, (k, v) =>
          v === 'true' ? 'uiptrue' : v === true ? 'uiptrue' : v === 'false' ? 'uipfalse' : v === false ? 'uipfalse' : v === '' ? 'uipblank' : v
        );

        let formData = new FormData();
        formData.append('action', 'uip_save_ui_pattern');
        formData.append('security', uip_ajax.security);
        formData.append('pattern', pattern);
        formData.append('name', importedPattern.name);
        formData.append('type', importedPattern.type);
        formData.append('description', importedPattern.description);
        formData.append('icon', importedPattern.icon);

        return await self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          if (response.error) {
            self.uipress.notify(response.message, 'uipress-lite', '', 'error', true);
            return false;
          }
          if (response.success) {
            self.uiTemplate.patterns = response.patterns;
            return true;
          }
        });
      },
    },
    template: `<div class="">
        <div class="uip-flex uip-flex-row uip-gap-xs uip-margin-bottom-s">
          <div class="uip-flex uip-padding-xxs uip-border uip-search-block uip-border-round uip-flex-grow">
            <span class="uip-icon uip-text-muted uip-margin-right-xs uip-text-l uip-icon uip-icon-medium">search</span>
            <input class="uip-blank-input uip-flex-grow uip-text-s" type="search" :placeholder="strings.seachPatterns" autofocus="" v-model="search">
          </div>
          <label class="">
            <div class="uip-button-default uip-padding-xs uip-flex uip-gap-xxs uip-flex-center uip-text-s">
              <span class="uip-icon uip-icon-medium">file_upload</span>
              <span class="">{{strings.import}}</span>
            </div>
            <input hidden accept=".json" type="file" single="" id="uip-import-pattern" @change="importPattern()">
          </label>
        </div>
        
        <div class="uip-margin-bottom-s uip-flex-wrap uip-flex-row">
        
          <div class="uip-flex uip-cursor-pointer uip-margin-bottom-s uip-background-muted uip-border-rounded uip-padding-xs uip-border-round uip-text-bold uip-text-emphasis">{{strings.layouts}}</div>
          
          <draggable 
            v-model="builtInLayouts" 
            handle=".uip-pattern-drag"
            :component-data="setDragAreaClasses()"
            :group="{ name: 'uip-patterns', pull: 'clone', put: false, revertClone: true }"
            @start="uiTemplate.drag = true" 
            @end="uiTemplate.drag = false" 
            ghost-class=""
            :clone="clone"
            itemKey="id">
              <template #item="{element, index}">
            
                   <div v-if="inSearch(element)" class="uip-pattern-item" :block-name="element.description"
                   @mouseenter="element.hover = true" @mouseleave="element.hover = false">
                      <div @click="insertAtPos(element)" class="uip-border-round uip-padding-xxs hover:uip-background-muted uip-cursor-pointer uip-pattern-drag">
                        <div class="uip-flex uip-flex-row uip-gap-xs uip-flex-center">
                          <div class="uip-icon uip-icon-large uip-text-xl uip-padding-xxxs uip-flex-center uip-flex-middle uip-border-round">
                            {{returnIcon(element)}}
                          </div> 
                          <div class="uip-flex uip-flex-column uip-flex-shrink">
                            <div class="uip-flex uip-flex-between">
                              <div class="uip-flex uip-flex-row uip-gap-xxs uip-flex-center">
                                <span class="uip-text-emphasis">{{element.name}}</span>
                              </div>
                            </div>
                            <div class="uip-text-s uip-text-muted">{{element.description}}</div>
                          </div>
                      
                        </div>
                      </div>
                  </div>
              
              </template>
          </draggable>
          
          <div class="uip-flex uip-cursor-pointer uip-margin-bottom-s uip-background-muted uip-border-rounded uip-padding-xs uip-border-round uip-text-bold uip-text-emphasis">{{strings.patterns}}</div>
              
          <draggable 
            v-model="uiTemplate.patterns" 
            handle=".uip-pattern-drag"
            :component-data="setDragAreaClasses()"
            :group="{ name: 'uip-patterns', pull: 'clone', put: false, revertClone: true }"
            @start="uiTemplate.drag = true" 
            @end="uiTemplate.drag = false" 
            ghost-class=""
            :clone="clone"
            itemKey="id">
              <template #item="{element, index}">
            
                   <div v-if="inSearch(element)" class="uip-pattern-item" :block-name="element.description"
                   @mouseenter="element.hover = true" @mouseleave="element.hover = false">
                      <div @click="insertAtPos(element)" class="uip-border-round uip-padding-xxs hover:uip-background-muted uip-cursor-pointer uip-pattern-drag">
                        <div class="uip-flex uip-flex-row uip-gap-xs uip-flex-center">
                          <div class="uip-icon uip-icon-large uip-text-xl uip-padding-xxxs uip-flex-center uip-flex-middle uip-border-round">
                            {{returnIcon(element)}}
                          </div> 
                          <div class="uip-flex uip-flex-column uip-row-gap-xxxs uip-flex-shrink">
                            <div class="uip-flex uip-flex-between">
                              <div class="uip-flex uip-flex-row uip-gap-xxs uip-flex-center">
                                <span class="uip-text-emphasis">{{element.name}}</span>
                                <span class="uip-text-xs uip-background-primary-wash uip-border-round uip-padding-xxxs uip-post-type-label">{{element.type}}</span>
                              </div>
                            </div>
                            <div class="uip-text-s uip-text-muted">{{element.description}}</div>
                          </div>
                        
                          <div class="uip-flex uip-flex-right uip-w-60 uip-flex-grow" >
                            <dropdown pos="left center">
                              <template v-slot:trigger>
                                <span class="uip-icon uip-link-muted uip-text-l uip-icon-medium">more_vert</span>
                              </template>
                              <template v-slot:content>
                            
                                <!--Pattern contextual options -->
                                  <div class="uip-flex uip-flex-row uip-gap-xxs uip-padding-xxxs">
                                    <span @click="exportPattern(element, index)"
                                    class="uip-icon uip-link-muted uip-text-l uip-icon-medium">file_download</span>
                                    <a href="" :id="'uip-pattern-export-' + index" style="display:none"></a>
                                    <dropdown pos="left center">
                                      <template v-slot:trigger>
                                        <span 
                                        class="uip-icon uip-link-muted uip-text-l uip-icon-medium ">edit_document</span>
                                      </template>
                                      <template v-slot:content>
                                        <div class="uip-padding-s uip-flex uip-flex-column uip-row-gap-xs">
                                          <div class="uip-flex uip-flex-column uip-row-gap-xxs">
                                            <div class="uip-text-s uip-text-muted">{{strings.patternTitle}}</div>
                                            <input class="uip-input" type="text" v-model="element.name">
                                          </div>
                                          <div class="uip-flex uip-flex-column uip-row-gap-xxs">
                                            <div class="uip-text-s uip-text-muted">{{strings.patternIcon}}</div>
                                            <icon-select :value="{value: element.icon}" :returnData="function(data) {element.icon = data.value}"></icon-select>
                                          </div>
                                          <div class="uip-flex uip-flex-column uip-row-gap-xxs">
                                            <div class="uip-text-s uip-text-muted">{{strings.description}}</div>
                                            <textarea class="uip-input" rows="4" v-model="element.description"></textarea>
                                          </div>
                                          <div class="uip-flex uip-flex-column uip-row-gap-xxs">
                                            <div class="uip-text-s uip-text-muted">{{strings.patternType}}</div>
                                            <select class="uip-input" v-model="element.type">
                                              <template v-for="option in patternTypes">
                                                <option :value="option.name">{{option.label}}</option>
                                              </template>
                                            </select>
                                          </div>
                                        </div>
                                      </template>
                                    </dropdown>
                                    <span @click="deleteThisItem(element.id)"
                                    class="uip-icon uip-link-danger uip-text-l uip-icon-medium">delete</span>
                                  </div>
                                <!--End pattern contextual Options -->
                              
                              </template>
                            </dropdown>
                          </div>
                      
                        </div>
                      </div>
                  </div>
              
              </template>
          </draggable>
                
              
        </div>
      </div>`,
  };
  return compData;
}
