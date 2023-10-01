export function moduleData() {
  return {
    props: {
      content: Array,
      returnData: Function,
      layout: String,
      dropAreaStyle: String,
      contextualData: Object,
    },
    data: function () {
      return {
        items: this.content,
        emptyMessage: __('Drag blocks here', 'uipress-lite'),
        footerhideen: false,
        rendered: false,
        randomClass: this.createUID(),
        test: [1, 2, 6, 5, 3, 8, 9, 4],
        activeTab: 'blocks',
        windowWidth: window.innerWidth,
        drag: false,
        queries: {},
        strings: {
          doesntExist: __("This component is missing or can't be loaded", 'uipress-lite'),
          totalItems: __('Total items', 'uipress-lite'),
          search: __('Search', 'uipress-lite'),
        },
        switchOptions: {
          blocks: {
            value: 'blocks',
            label: __('Blocks', 'uipress-lite'),
          },
          patterns: {
            value: 'patterns',
            label: __('Patterns', 'uipress-lite'),
          },
        },
      };
    },
    inject: [ 'uiTemplate', 'uipress'],
    watch: {
      content: {
        handler(newValue, oldValue) {
          if (this.rendered) {
            this.items = newValue;
          }
        },
        deep: true,
      },
      queriesLength: {
        handler(newValue, oldValue) {
          for (let uid in this.queries) {
            let block = this.items.find((obj) => {
              return obj.uid === uid;
            });

            if (block) {
              this.runBlockQuery(block);
            }
          }
        },
        deep: true,
      },
      itemsLength: {
        handler(newValue, oldValue) {
          for (let [index, item] of this.items.entries()) {
            if (typeof item === 'undefined') {
              continue;
            }
            if ('remote' in item) {
              if (item.remote) {
                this.importBlock(item, index);
                this.items.splice(index, 1);
                continue;
              }
            }
            if (Object.keys(item.settings).length === 0) {
              this.uipress.inject_block_presets(item, item.settings);
            }
          }
        },
        deep: true,
      },
      'uiTemplate.isPreview': {
        handler(newValue, oldValue) {
          //Rerun queries on preview
          for (let uid in this.queries) {
            let block = this.items.find((obj) => {
              return obj.uid === uid;
            });
            if (block) {
              this.runBlockQuery(block);
            }
          }
        },
        deep: true,
      },
    },
    created: function () {},
    mounted: function () {
      let self = this;

      requestAnimationFrame(() => {
        self.rendered = true;
        //this.passSettingsToBlock();
      });
    },
    computed: {
      queriesLength() {
        return Object.keys(this.queries).length;
      },
      returnAllBlocks() {
        return this.items;
      },
      itemsLength() {
        return this.items.length;
      },
      returnAllQueries() {
        return this.queries;
      },
      returnItems() {
        return this.items;
      },
      returnActiveBlockUID() {
        let uid = this.uipress.checkNestedValue(this.$route, ['params', 'uid']);
        return uid;
      },
    },
    methods: {
      async forceReload() {
        // Remove MyComponent from the DOM
        this.rendered = false;

        // Wait for the change to get flushed to the DOM
        await this.$nextTick();

        // Add the component back in
        this.rendered = true;

        await this.$nextTick();
      },
      importBlock(template, index) {
        let self = this;

        let formData = new FormData();
        let notiID = self.uipress.notify(__('Importing template', 'uipress-lite'), '', 'default', false, true);

        self.sendServerRequest(template.path, formData).then((response) => {
          if (response.error) {
            self.uipress.notify(response.message, '', 'error', true);
            self.uipress.destroy_notification(notiID);
          }

          let parsed = JSON.parse(response);
          if (Array.isArray(parsed)) {
            parsed = parsed[0];
            parsed.uid = self.createUID();

            if (!self.isObject(parsed)) {
              self.uipress.notify(__('Unable to import template right now', 'uipress-lite'), '', 'error', true);
              self.uipress.destroy_notification(notiID);
            }

            let freshLayout = [];
            if ('content' in parsed) {
              for (const block of parsed.content) {
                freshLayout.push(self.cleanBlock(block));
              }
              parsed.content = freshLayout;
            }
            self.uipress.destroy_notification(notiID);
            self.uipress.notify(__('Template imported', 'uipress-lite'), '', 'success', true);
            self.items.splice(index, 0, parsed);
          } else {
            self.uipress.notify(__('Unable to import template right now', 'uipress-lite'), '', 'error', true);
            self.uipress.destroy_notification(notiID);
          }
        });
      },
      cleanBlock(block) {
        let item = Object.assign({}, block);
        //item.uid = this.createUID();
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
          //item.uid = this.createUID();
          item.settings = JSON.parse(JSON.stringify(item.settings));

          if (item.content) {
            item.content = this.duplicateChildren(item.content);
          }

          returnChildren.push(item);
        }

        return returnChildren;
      },
      itemAdded(evt) {
        let self = this;
        if (evt.added) {
          if (this.uipress.checkNestedValue(evt, ['added', 'element', 'remote'])) {
            return;
          }

          //ADD A UID TO ADDED OPTION
          let newElement = evt.added.element;
          //New block, add uid
          if (!('uid' in newElement)) {
            newElement.uid = this.createUID();

            //Open block
            let ID = self.$route.params.templateID;
            this.$router.push({
              path: '/uibuilder/' + ID + '/settings/blocks/' + newElement.uid,
              query: { ...this.$route.query },
            });
          }

          //New block so let's add settings
          if (Object.keys(newElement.settings).length === 0) {
            this.uipress.inject_block_presets(newElement, newElement.settings);
          }
        }
        this.returnData(this.items);
        //Force a reload
        this.forceReload();
      },
      setdropAreaStyles() {
        let returnData = [];
        returnData.class = 'uip-flex uip-w-100p uip-builder-drop-area';

        if (this.dropAreaStyle) {
          returnData.style = this.dropAreaStyle;
        }

        //returnData.componentInstance = this.$refs.dragger;
        return returnData;
      },
      returnDragStyle() {
        if (this.uiTemplate.drag) {
          return 'border-color:var(--uip-background-primary);';
        }
      },
      componentExists(block) {
        if (this.$root._.appContext.components[block.moduleName]) {
          if (this.metConditions(block)) {
            return true;
          }
        } else {
          return false;
        }
      },
      metConditions(block) {
        let conditions = this.get_block_option(block, 'advanced', 'conditions');

        if (typeof conditions === 'undefined') {
          return true;
        }

        if (!conditions) {
          return true;
        }

        if (!this.isObject(conditions)) {
          return true;
        }

        let allConditions = conditions.conditions;
        let relation = conditions.relation;
        if (!relation) {
          relation = 'and';
        }

        if (!Array.isArray(allConditions)) return true;

        let met = true;
        let metAnds = [];

        let userid = this.uipApp.data.options.dynamicData.userid.value;
        let username = this.uipApp.data.options.dynamicData.username.value;
        let userroles = this.uipApp.data.options.dynamicData.userroles.value;
        let useremail = this.uipApp.data.options.dynamicData.useremail.value;

        //Loop through the conditions
        for (let condition of allConditions) {
          //username conditions
          if (condition.type == 'userlogin') {
            if (condition.operator == 'is') {
              if (username != condition.value) {
                if (relation == 'and') {
                  met = false;
                  break;
                }
                if (relation == 'or') {
                  metAnds.push(false);
                }
              }
            }
            if (condition.operator == 'isnot') {
              if (username == condition.value) {
                if (relation == 'and') {
                  met = false;
                  break;
                }
                if (relation == 'or') {
                  metAnds.push(false);
                }
              }
            }
          }
          //username conditions
          if (condition.type == 'userid') {
            if (condition.operator == 'is') {
              if (userid != condition.value) {
                if (relation == 'and') {
                  met = false;
                  break;
                }
                if (relation == 'or') {
                  metAnds.push(false);
                }
              }
            }
            if (condition.operator == 'isnot') {
              if (userid == condition.value) {
                if (relation == 'and') {
                  met = false;
                  break;
                }
                if (relation == 'or') {
                  metAnds.push(false);
                }
              }
            }
          }
          //Role conditions
          if (condition.type == 'userrole') {
            if (condition.operator == 'is') {
              if (!userroles.includes(condition.value)) {
                if (relation == 'and') {
                  met = false;
                  break;
                }
                if (relation == 'or') {
                  metAnds.push(false);
                }
              }
            }
            if (condition.operator == 'isnot') {
              if (userroles.includes(condition.value)) {
                if (relation == 'and') {
                  met = false;
                  break;
                }
                if (relation == 'or') {
                  metAnds.push(false);
                }
              }
            }
          }

          //useremail conditions
          if (condition.type == 'useremail') {
            if (condition.operator == 'is') {
              if (useremail != condition.value) {
                if (relation == 'and') {
                  met = false;
                  break;
                }
                if (relation == 'or') {
                  metAnds.push(false);
                }
              }
            }
            if (condition.operator == 'isnot') {
              if (useremail == condition.value) {
                if (relation == 'and') {
                  met = false;
                  break;
                }
                if (relation == 'or') {
                  metAnds.push(false);
                }
              }
            }
          }
        }

        if (relation == 'or') {
          if (metAnds.length == allConditions.length) {
            return false;
          } else {
            return true;
          }
        } else {
          return met;
        }
      },
      returnBlockStyles(block, index) {
        if (!this.rendered) {
          return '';
        }
        let style = '';

        style += this.uipress.render_block_styles(this.formatDynamicMatches(block), block.uid, this.uipApp.data.userPrefs.darkTheme, this.windowWidth);

        style = style.replace('#' + block.uid, '.' + this.randomClass + ' #' + block.uid);

        return style;
      },
      returnQueryStyles(block, index) {
        if (!this.rendered) {
          return '';
        }
        let style = '';

        style += this.uipress.render_block_styles(block, block.uid, this.uipApp.data.templateDarkMode, this.windowWidth);
        style = style.replace('#' + block.uid, '.uip-query-id-' + index + '#' + block.uid);

        return style;
      },
      ifBlockHasCss(block) {
        if (block.settings.advanced) {
          if (block.settings.advanced.options.css) {
            if (block.settings.advanced.options.css.value) {
              return block.settings.advanced.options.css.value;
            }
          }
        }
        return false;
      },
      ifBlockHasJS(block) {
        if (block.settings.advanced) {
          if (block.settings.advanced.options.js) {
            if (block.settings.advanced.options.js.value) {
              return block.settings.advanced.options.js.value;
            }
          }
        }
        return false;
      },
      responsiveHidden(responsive) {
        if (typeof responsive === 'undefined') {
          return true;
        }
        if (!responsive) {
          return true;
        }
        let screenWidth = window.innerWidth;
        if ('windowWidth' in this.uiTemplate) {
          screenWidth = this.uiTemplate.windowWidth;
        }
        //Hidden on mobile
        if (responsive.mobile == true && screenWidth < 699) {
          return false;
        }
        //Hidden on tablet
        if (responsive.tablet == true && screenWidth < 990 && screenWidth >= 699) {
          return false;
        }
        //Hidden on desktop
        if (responsive.desktop == true && screenWidth > 990) {
          return false;
        }
        return true;
      },
      blockHasQuery(block) {
        if (this.uipress.checkNestedValue(block, ['query', 'enabled'])) {
          if (!this.uipress.checkNestedValue(this.queries, [block.uid, 'posts'])) {
            this.queries[block.uid] = {
              currentPage: 1,
              posts: [],
              totalPages: 0,
              totalFound: 0,
              dynamicMatches: {},
              query: JSON.parse(JSON.stringify(block.query)),
            };
            return true;
          } else {
            if (JSON.stringify(block.query) != JSON.stringify(this.queries[block.uid].query)) {
              this.queries[block.uid].query = JSON.parse(JSON.stringify(block.query));
              this.runBlockQuery(block);
            }
            return true;
          }
        }
        return false;
      },
      blockPaginationEnabled(block) {
        if (this.uipress.checkNestedValue(block, ['query', 'settings', 'showPagination'])) {
          return true;
        }
        return false;
      },
      returnQuerySearch(blockUID) {
        let search = this.uipress.checkNestedValue(this.returnAllQueries, [blockUID, 'search']);
        if (!search) {
          return '';
        }
        return search;
      },
      runBlockQuery(block) {
        let self = this;
        let query = JSON.stringify(block.query.settings);
        let blockString = JSON.stringify(block);

        let page = 1;
        if (this.returnPostQueryCurrentPage(block.uid)) {
          page = this.returnPostQueryCurrentPage(block.uid);
        }

        let search = this.returnQuerySearch(block.uid);

        //Build form data for fetch request
        let formData = new FormData();
        formData.append('action', 'uip_process_block_query');
        formData.append('security', uip_ajax.security);
        formData.append('query', query);
        formData.append('blockString', blockString);
        formData.append('page', page);
        formData.append('search', search);

        self.sendServerRequest(uip_ajax.ajax_url, formData).then((response) => {
          if (response.error) {
            self.uipress.notify(response.message, 'uipress-lite', '', 'error', true);
            self.saving = false;
            return false;
          }
          if (response.success) {
            this.queries[block.uid].posts = response.items.list;
            this.queries[block.uid].totalFound = response.items.found;
            this.queries[block.uid].dynamicMatches = response.items.matches;
            this.queries[block.uid].totalPages = response.items.totalPages;
            this.queries[block.uid].currentPage = page;
          }
        });
      },
      returnPostQuery(blockUID) {
        let posts = this.uipress.checkNestedValue(this.queries, [blockUID, 'posts']);
        if (!posts) {
          return [];
        }
        return posts;
      },
      returnPostQueryCount(blockUID) {
        let totalFound = this.uipress.checkNestedValue(this.returnAllQueries, [blockUID, 'totalFound']);
        if (!totalFound) {
          return 0;
        }
        return totalFound;
      },
      returnPostQueryPageCount(blockUID) {
        let totalFound = this.uipress.checkNestedValue(this.returnAllQueries, [blockUID, 'totalPages']);
        if (!totalFound) {
          return 0;
        }
        return totalFound;
      },
      returnPostQueryCurrentPage(blockUID) {
        let totalFound = this.uipress.checkNestedValue(this.returnAllQueries, [blockUID, 'currentPage']);
        if (!totalFound) {
          return 0;
        }
        return totalFound;
      },
      blockSearchEnabled(block) {
        if (this.uipress.checkNestedValue(block, ['query', 'settings', 'search'])) {
          return true;
        }
        return false;
      },
      formatQueryDynamicMatches(block, postID) {
        let temp = JSON.stringify(this.formatDynamicMatches(block));

        if (postID in this.queries[block.uid].dynamicMatches) {
          for (let match of this.queries[block.uid].dynamicMatches[postID]) {
            let replacer = match.replace;
            if (match.match == '{{post_content}}') {
              replacer = JSON.stringify({ html: 'uip_remove_this' + match.replace + 'uip_remove_this' });
              let parts = replacer.split('uip_remove_this');
              replacer = parts[1];
            }
            let holder = temp.replaceAll(match.match, replacer);
            try {
              JSON.parse(holder);
              temp = holder;
            } catch (error) {
              console.log(error);
              continue;
            }
          }
        }

        try {
          return JSON.parse(temp);
        } catch (error) {
          console.log(error);
          return block;
        }
      },
      formatDynamicMatches(block) {
        let blockString = JSON.stringify(block);
        const pattern = /{{(.*?)}}/g;
        const matches = blockString.matchAll(pattern);

        // Convert the iterable matches into an array
        const matchesArray = Array.from(matches);
        if (!Array.isArray(matchesArray)) {
          return block;
        }

        for (let [index, match] of matchesArray.entries()) {
          const matchDynamic = match[0];
          const matchValue = match[1];

          if (matchValue in this.uipApp.data.dynamicOptions) {
            blockString = blockString.replaceAll(matchDynamic, this.uipApp.data.dynamicOptions[matchValue].value);
          }
        }

        let newBlock = JSON.parse(blockString);

        return newBlock;
      },
      pageNext(block) {
        if (this.queries[block.uid].currentPage >= this.returnPostQueryPageCount(block.uid)) {
          return;
        }
        this.queries[block.uid].currentPage += 1;
        this.runBlockQuery(block);
      },
      pagePrevious(block) {
        if (this.queries[block.uid].currentPage <= 1) {
          return;
        }
        this.queries[block.uid].currentPage -= 1;
        this.runBlockQuery(block);
      },
      getComponentInstance(uid) {
        const dynamicComponentRef = this.$refs[`dynamicComponentRef_${uid}`];
        return dynamicComponentRef;
      },
      returnRefName(uid) {
        return `dynamicComponentRef_${uid}`;
      },
      maybeAddHover(evt) {
        document.querySelectorAll('.uip-drop-zone').forEach(function (foundBlock) {
          if (!evt.target.contains(foundBlock)) {
            foundBlock.classList.remove('uip-drop-zone');
          }
        });

        let element = evt.toElement.closest('.uip-builder-drop-area');
        if (element) {
          element.classList.add('uip-drop-zone');
        }
      },
      removeDragClass(evt) {
        evt.target.classList.remove('uip-drop-zone');
      },
      getBlockClasses(block, query) {
        let classes = '';
        let advanced = this.get_block_option(block, 'advanced', 'classes');
        classes += advanced;

        //Check if block is active
        if (block.uid === this.returnActiveBlockUID && !query) {
          classes += ' uip-preview-selected-block';
        }
        return classes;
      },
      maybeFollowLink(evt, block) {
        let hasLink = this.uipress.checkNestedValue(block, ['linkTo', 'value']);
        let linkType = this.uipress.checkNestedValue(block, ['linkTo', 'newTab']);

        ///No link set so return;
        if (!hasLink || hasLink == '') {
          return;
        }
        ///Update dynamic link
        if (linkType == 'dynamic') {
          this.uipress.updatePage(hasLink);
        }

        //If modifier keys were pressed pass the event to the link element and force click
        if (evt.ctrlKey || evt.shiftKey || evt.metaKey || (evt.button && evt.button == 1) || linkType == 'newTab') {
          this.$refs.blocklink.target = '';
          if (linkType == 'newTab') {
            this.$refs.blocklink.target = '_BLANK';
          }
          this.$refs.blocklink.href = hasLink;
          let newEvent = new MouseEvent('click', evt);
          this.$refs.blocklink.dispatchEvent(newEvent);
          return;
        }

        if (linkType == 'default' && this.uiTemplate.isPreview) {
          this.$refs.blocklink.target = '';
          this.$refs.blocklink.href = hasLink;
          this.$refs.blocklink.click();
        }
      },
      returnToolTip(block) {
        let hasTip = this.uipress.checkNestedValue(block, ['tooltip', 'message']);
        if (hasTip) {
          return hasTip;
        }
        return '';
      },
    },
    template: `
    
    <div class="uip-flex uip-w-100p" v-if="rendered" :class="randomClass">
     
      <a ref="blocklink" href="" class="uip-hidden"></a>
     
      <template v-for="element in items">
      
        <!--Block does exist-->
        <component v-if="componentExists(element) && ifBlockHasCss(element)" is="style">{{ifBlockHasCss(element)}}</component>
        <component v-if="componentExists(element) && ifBlockHasJS(element)" is="script">{{ifBlockHasJS(element)}}</component>
        
        <component is="style" scoped>
          {{returnBlockStyles(element, index)}}
        </component>
        
      </template>
      
      
      <template v-for="(element, index) in returnItems" 
      :key="element.uid" :index="index">
        
        <component
        v-if="componentExists(element) && responsiveHidden(element.responsive) && !blockHasQuery(element)" 
        :class="getBlockClasses(element)"
        :id="element.uid"
        :modulename="element.moduleName" 
        :is="element.moduleName"
        :block-uid="element.uid"
        :index="index" 
        :contextualData="contextualData" 
        :name="element.name"
        :block="formatDynamicMatches(element)" 
        :title="returnToolTip(element)"
        @click="maybeFollowLink($event, formatDynamicMatches(element))"
        />
        
        
        
        
        <!--Block query-->
        <template v-else-if="responsiveHidden(element.responsive) && componentExists(element) && blockHasQuery(element)" :key="index">
        
          <!--Search -->
          <div class="uip-flex uip-search-block uip-border-round uip-query-search uip-w-100p" v-if="blockSearchEnabled(element)">
            <span class="uip-icon uip-text-muted uip-margin-right-xs uip-text-l uip-icon uip-icon-medium">search</span>
            <input @input="runBlockQuery(element)"
            class="uip-blank-input uip-flex-grow uip-text-s" type="search" :placeholder="strings.search" v-model="queries[element.uid].search" autofocus="">
          </div>
        
          <template v-for="(loop,index) in returnPostQuery(element.uid)">
          
          
            <component is="style" scoped>
              {{returnQueryStyles(formatQueryDynamicMatches(element, loop.ID),index)}}
            </component>
          
            <component 
            :is="element.moduleName"
            :modulename="element.moduleName"
            :class="getBlockClasses(element, true) + ' uip-query-id-' + index"
            :id="element.uid"
            :block-uid="element.uid"
            :index="index" 
            :contextualData="contextualData" 
            :block="formatQueryDynamicMatches(element, loop.ID)" 
            uip-block-query="true"
            :title="returnToolTip(formatQueryDynamicMatches(element, loop.ID))"
            :name="element.name"
            @click="maybeFollowLink($event, formatQueryDynamicMatches(element, loop.ID))"
            />
          
          </template>
          
          <!--Pagination-->
          <div class="uip-flex uip-w-100p uip-flex-between uip-pagination-controls" v-if="blockPaginationEnabled(element)">
            
            <div class="uip-text-muted uip-pagination-count">{{returnPostQueryCount(element.uid)}} {{strings.totalItems}}</div>
            
            <div v-if="returnPostQueryPageCount(element.uid) > 1" class="uip-flex uip-gap-xs uip-pagination-button-group">
              <button class="uip-button-default uip-icon uip-pagination-button uip-border-rounder"
              :class="returnPostQueryCurrentPage(element.uid) > 1 ? '' : 'uip-link-disabled'" @click="pagePrevious(element)">chevron_left</button>
              
              <button class="uip-button-default uip-icon uip-pagination-button uip-border-rounder" 
              :class="returnPostQueryCurrentPage(element.uid) < returnPostQueryPageCount(element.uid) ? '' : 'uip-link-disabled'" @click="pageNext(element)">chevron_right</button>
            </div>
            
          </div>
          
        </template>
        
        
        
      
      </template>
              
      
      
      
        
    </div>
    `,
  };
}
