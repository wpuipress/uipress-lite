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
        searchString: '',
        results: [],
        columns: [],
        page: 1,
        totalPages: 0,
        totalFound: 0,
        initialLoading: false,
        perPage: this.block.settings.block.options.postsPerPage.value,
        postTypes: this.block.settings.block.options.activePostTypes.value,

        customColumns: this.block.settings.block.options.activeColumns.value,
        loading: false,
        strings: {
          nothingFound: __('Nothing posts found', 'uipress-lite'),
          by: __('By', 'uipress-lite'),
          results: __('items', 'uipress-lite'),
          searchPlaceHolder: __('Search items', 'uipress-lite'),
          gridView: __('Grid view', 'uipress-lite'),
          listView: __('List view', 'uipress-lite'),
        },
        ui: {
          view: 'list',
        },
        searching: false,
      };
    },
    inject: ['uipData', 'uipress', 'uiTemplate'],
    mounted: function () {
      this.getPosts();
      if (this.uipData.userPrefs.prefersGridView) {
        this.ui.view = 'grid';
      } else {
        this.ui.view = 'list';
      }
    },
    watch: {
      searchString: {
        handler(newValue, oldValue) {
          this.page = 1;
          this.getPosts();
        },
        deep: true,
      },
      page: {
        handler(newValue, oldValue) {
          if (newValue != '') {
            this.getPosts();
          }
        },
        deep: true,
      },
      postTypes: {
        handler(newValue, oldValue) {
          this.getPosts();
        },
        deep: true,
      },
      perPage: {
        handler(newValue, oldValue) {
          this.getPosts();
        },
        deep: true,
      },
      'block.settings.block.options.postsPerPage.value': {
        handler(newValue, oldValue) {
          this.getPosts();
        },
        deep: true,
      },
      'block.settings.block.options.activeColumns.value': {
        handler(newValue, oldValue) {
          this.getPosts();
        },
        deep: true,
      },
      'block.settings.block.options.actionsEnabled.value': {
        handler(newValue, oldValue) {
          this.getPosts();
        },
        deep: true,
      },
      'ui.view': {
        handler(newValue, oldVaklue) {
          let view = false;
          if (newValue == 'grid') {
            view = true;
          }

          this.uipress.saveUserPreference('prefersGridView', view, false);
        },
        deep: true,
      },
    },
    computed: {
      returnPerPage() {
        return this.block.settings.block.options.postsPerPage.value;
      },
      getColumns() {
        return this.block.settings.block.options.activeColumns.value;
      },
      getActions() {
        return this.block.settings.block.options.actionsEnabled.value;
      },
      limitToAuthor() {
        let temp = this.uipress.get_block_option(this.block, 'block', 'limitToAuthor');
        if (this.uipress.isObject(temp)) {
          if ('value' in temp) {
            return temp.value;
          }
          return true;
        }
        return temp;
      },
      searchDisabled() {
        let temp = this.uipress.get_block_option(this.block, 'block', 'searchDisabled');
        if (this.uipress.isObject(temp)) {
          if ('value' in temp) {
            return temp.value;
          }
        }
        return temp;
      },
    },
    methods: {
      getPosts() {
        let self = this;
        //Query already running
        if (self.loading) {
          return;
        }
        self.loading = true;

        let posties = this.uipress.get_block_option(this.block, 'block', 'activePostTypes');
        self.postTypes = posties;

        //Build form data for fetch request
        let formData = new FormData();
        formData.append('action', 'uip_get_posts_for_table');
        formData.append('security', uip_ajax.security);
        formData.append('search', self.searchString);
        formData.append('page', self.page);
        formData.append('postTypes', JSON.stringify(self.postTypes));
        formData.append('perPage', self.returnPerPage);
        formData.append('limitToAuthor', self.limitToAuthor);
        formData.append('search', self.searchString);
        formData.append('columns', JSON.stringify(self.getColumns));
        formData.append('actions', JSON.stringify(self.getActions));

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          if (response.error) {
            self.uipress.notify(response.message, 'uipress-lite', '', 'error', true);
            self.searching = false;
          }
          if (response.success) {
            self.loading = false;
            self.results = response.posts;
            self.columns = response.columns;
            self.totalFound = response.total;
            self.totalPages = response.totalPages;
          }
        });
      },
      goBack() {
        if (this.page > 1) {
          this.page = this.page - 1;
        }
      },
      goForward() {
        if (this.page < this.totalPages) {
          this.page = this.page + 1;
        }
      },
      formatResults(results) {
        return new Intl.NumberFormat(self.uipress.uipAppData.options.locale).format(results);
      },
      deleteThisItem(postID) {
        let self = this;
        this.uipress.deletePost(postID).then((response) => {
          if (response) {
            self.getPosts();
          }
        });
      },
    },
    template: `
          <div class="uip-flex uip-flex-column uip-self-flex-start uip-max-w-100p uip-table-wrap">
            <div class="uip-margin-bottom-xs uip-flex uip-flex-between">
            
              <div class="uip-flex uip-padding-xxs uip-search-block uip-border-round uip-flex-center" v-if="!searchDisabled">
                <span class="uip-icon uip-text-muted uip-margin-right-xs">search</span> 
                <input class="uip-blank-input uip-flex-grow" type="search" :placeholder="strings.searchPlaceHolder" v-model="searchString" autofocus="">
              </div>
              
              <div class="uip-flex uip-flex-row uip-flex-gap-s">
                <uip-tooltip :message="strings.listView" :delay="400">
                  <div class="uip-icon uip-icon-medium uip-text-l uip-link-default uip-padding-xxs" @click="ui.view = 'list'"
                  :class="{'uip-border-bottom-primary uip-text-emphasis' : ui.view == 'list'}" >sort</div>
                </uip-tooltip>
                <uip-tooltip :message="strings.gridView" :delay="400">
                  <div class="uip-icon uip-icon-medium uip-text-l uip-link-default uip-padding-xxs" @click="ui.view = 'grid'"
                  :class="{'uip-border-bottom-primary uip-text-emphasis' : ui.view == 'grid'}">grid_view</div>
                </uip-tooltip>
              </div>
            </div>
            
            <!--Grid view -->
            <div v-if="ui.view == 'grid'"  class="uip-position-relative">
              <div class="uip-ajax-loader" v-if="loading && !initialLoading">
                <div class="uip-loader-bar"></div>
              </div>
            </div>
            <div v-if="ui.view == 'grid'" class="uip-margin-bottom-xs uip-position-relative uip-grid-col-5">
              
              <template v-for="item in results">
                <div class="uip-border-round uip-background-muted uip-overflow-hidden uip-self-flex-start uip-grid-item">
                  <div v-if="item.img" class="uip-background-grey uip-flex uip-flex-center uip-flex-middle">
                    <img :src="item.img" class="uip-max-w-100p uip-max-h-130" :alt="item.name">
                  </div>
                  <div class="uip-padding-xs uip-flex uip-flex-column uip-row-gap-xxs">
                    <div class="uip-flex uip-flex-row uip-flex-between">
                      <div class="uip-text-bold uip-link-emphasis uip-grid-item-title" @click="uipress.updatePage(item.link)">{{item.name}}</div>
                      <div>
                        <dropdown pos="left center">
                          <template v-slot:trigger>
                            <div class="uip-icon uip-icon-medium uip-text-l uip-link-muted hover:uip-background-muted uip-padding-xxs uip-border-round">more_vert</div>
                          </template>
                          <template v-slot:content>
                            <div class="uip-padding-xs uip-flex uip-flex-column uip-row-gap-xs">
                              <template v-for="action in item.actions">
                                <div v-if="action.name == 'delete'" class="uip-flex uip-gap-xxs uip-flex-center uip-link-muted" @click="deleteThisItem(action.ID)">
                                  <div class="uip-icon uip-icon-small-emphasis">{{action.icon}}</div>
                                  <div>{{action.label}}</div>
                                </div>
                                <div v-else class="uip-flex uip-gap-xxs uip-flex-center uip-link-muted" @click="uipress.updatePage(action.link)">
                                  <div class="uip-icon uip-icon-small-emphasis">{{action.icon}}</div>
                                  <div>{{action.label}}</div>
                                </div>
                              </template>
                            </div>
                          </template>
                        </dropdown>
                      </div>
                    </div>
                    <div class="uip-text-s">
                      <span class="uip-text-muted">{{strings.by}}</span>
                      <span class="uip-link-default " @click="uipress.updatePage(item.authorLink)">{{item.author}}</span>
                      <span class="uip-text-muted">{{item.modified}}</span>
                    </div>
                  </div>
                  <div class="uip-flex uip-flex-column uip-row-gap-xxs uip-padding-xs" v-if="item.categories.length > 0 || item.tags.length > 0 || item.type">
                    <div class="uip-flex uip-gap-xxs">
                      <div class="uip-text-xs uip-background-primary-wash uip-border-round uip-padding-xxxs uip-text-normal uip-post-type-label">
                        {{item.type}}
                      </div>
                    </div>
                    <div class="uip-flex uip-gap-xxs">
                      <div v-for="cat in item.categories" class="uip-text-xs uip-background-primary-wash uip-border-round uip-padding-xxxs uip-text-normal uip-post-type-label">
                        {{cat.name}}
                      </div>
                    </div>
                    <div class="uip-flex uip-gap-xxs">
                      <div v-for="cat in item.categories" class="uip-text-xs uip-background-primary-wash uip-border-round uip-padding-xxxs uip-text-normal uip-post-type-label">
                        {{cat.tags}}
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <!-- End of list view -->
          
            <div class="uip-overflow-auto uip-max-w-100vw uip-scrollbar">
              <div class="uip-position-relative uip-w-100p">
                <div class="uip-ajax-loader" v-if="loading && !initialLoading">
                  <div class="uip-loader-bar"></div>
                </div>
              </div>
              <table class="uip-w-100p uip-border-collapse uip-post-table uip-min-w-700" v-if="ui.view == 'list'">
                <thead>
                  <tr class="uip-post-table-row">
                    <template v-for="column in columns">
                        <th v-if="column.active && column.name == 'actions'" class="uip-post-table-head-cell uip-text-capitalize uip-text-muted uip-text-left uip-text-weight-normal uip-padding-xxs uip-post-table-head" style="text-align:right">
                          {{column.label}}
                        </th>
                        <th v-else-if="column.active" class="uip-post-table-head-cell uip-text-capitalize uip-text-muted uip-text-left uip-text-weight-normal uip-padding-xxs uip-post-table-head">
                          {{column.label}}
                        </th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="item in results">
                    <tr class="uip-post-table-row">
                      <template v-for="column in columns">
                        <template v-if="column.active">
                          <td v-if="column.name == 'name'" class="uip-padding-xxs uip-post-table-cell" :class="column.name">
                            <div>
                              <div class="uip-flex uip-flex-row uip-gap-xxs uip-flex-center" >
                                <div class="uip-text-bold uip-post-title uip-link-default  uip-cursor-pointer"  @click="uipress.updatePage(item.editLink)">{{item.name}}</div>
                                <div class="uip-flex uip-gap-xxs uip-flex-center" v-if="item.hover">
                                  <div @click="uipress.updatePage(item.editLink)" :href="item.editLink" class="uip-icon uip-cursor-pointer uip-link-default">edit_document</div>
                                  <a :href="item.link" target="_BLANK" class="uip-icon uip-cursor-pointer uip-link-default uip-no-underline">open_in_new</a>
                                </div>
                              </div>
                              <div class="uip-text-s uip-post-meta uip-flex uip-flex-row uip-gap-xxxs">
                                <span class="uip-text-muted">{{strings.by}}</span>
                                <span class="uip-link-default " @click="uipress.updatePage(item.authorLink)">{{item.author}}</span>
                                <span class="uip-text-muted">{{item.modified}}</span>
                              </div>
                            </div>
                          </td>
                          <td v-else-if="column.name == 'actions'" class="uip-padding-xxs uip-post-table-cell" :class="column.name">
                            <div class="uip-flex uip-flex-row uip-flex-wrap uip-gap-xs uip-row-gap-xs uip-flex-right">
                              <dropdown pos="bottom right">
                                <template v-slot:trigger>
                                  <div class="uip-icon uip-icon-medium uip-text-l uip-link-muted hover:uip-background-muted uip-padding-xxs uip-border-round">more_vert</div>
                                </template>
                                <template v-slot:content>
                                  <div class="uip-padding-xs uip-flex uip-flex-column uip-row-gap-xs">
                                    <template v-for="action in item[column.name]">
                                      <div v-if="action.name == 'delete'" class="uip-flex uip-gap-xxs uip-flex-center uip-link-muted" @click="deleteThisItem(action.ID)">
                                        <div class="uip-icon uip-icon-small-emphasis">{{action.icon}}</div>
                                        <div class="">{{action.label}}</div>
                                      </div>
                                      <div v-else class="uip-flex uip-gap-xxs uip-flex-center uip-link-muted" @click="uipress.updatePage(action.link)">
                                        <div class="uip-icon uip-icon-small-emphasis">{{action.icon}}</div>
                                        <div>{{action.label}}</div>
                                      </div>
                                    </template>
                                  </div>
                                </template>
                              </dropdown>
                            </div>
                          </td>
                          <td v-else-if="column.name == 'categories'" class="uip-padding-xxs uip-post-table-cell" :class="column.name">
                            <div class="uip-flex uip-flex-row uip-flex-wrap uip-gap-xs uip-row-gap-xs">
                              <div v-for="cat in item[column.name]" class="uip-text-xs uip-background-primary-wash uip-border-round uip-padding-xxxs uip-text-normal uip-post-type-label">
                                {{cat.name}}
                              </div>
                            </div>
                          </td>
                          <td v-else-if="column.name == 'tags'" class="uip-padding-xxs uip-post-table-cell" :class="column.name">
                            <div class="uip-flex uip-flex-row uip-flex-wrap uip-gap-xs uip-row-gap-xs">
                              <div v-for="tag in item[column.name]" class="uip-text-xs uip-background-primary-wash uip-border-round uip-padding-xxxs uip-text-normal uip-post-type-label">
                                {{tag.name}}
                              </div>
                            </div>
                          </td>
                          <td v-else class="uip-padding-xxs uip-post-table-cell" :class="column.name">
                            <template v-if="!Array.isArray(item[column.name])">{{item[column.name]}}</template>
                            <div v-else class="uip-flex uip-flex-row uip-flex-wrap uip-gap-xs uip-row-gap-xs">
                              <div v-for="tag in item[column.name]" class="uip-text-xs uip-background-primary-wash uip-border-round uip-padding-xxxs uip-text-normal uip-post-type-label">
                                {{tag.name}}
                              </div>
                            </div>
                          </td>
                        </template>
                      </template>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            
            <div class="uip-flex uip-flex-between uip-flex-center">
              <div class="uip-padding-xxs uip-post-count">{{totalFound}} {{strings.results}}</div>
              <div class="uip-flex uip-gap-xs uip-padding-xs" v-if="totalPages > 1">
                <button @click="goBack" class="uip-button-default uip-icon uip-nav-button">chevron_left</button>
                <button @click="goForward" v-if="page < totalPages" class="uip-button-default uip-icon uip-nav-button">chevron_right</button>
              </div>
            </div>
          
      </div>
      `,
  };
}
