const { __, _x, _n, _nx } = wp.i18n;
import { deleteRemotePost } from '../../v3.5/utility/functions.min.js';
import { defineAsyncComponent, nextTick } from '../../../libs/vue-esm.js';

export default {
  components: {
    Confirm: defineAsyncComponent(() => import('../../v3.5/utility/confirm.min.js?ver=3.3.1')),
  },
  props: {
    display: String,
    name: String,
    block: Object,
  },
  data() {
    return {
      searchString: '',
      results: [],
      columns: [],
      page: 1,
      totalPages: 0,
      totalFound: 0,
      initialLoading: false,
      postTypes: [],
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
  
  mounted() {
    this.getPosts();
    this.updateView();
  },
  watch: {
    searchString: {
      handler(newValue, oldValue) {
        this.page = 1;
        this.getPosts();
      },
    },
    page: {
      handler(newValue, oldValue) {
        if (newValue) this.getPosts();
      },
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
    },
    'block.settings.block.options': {
      handler(newValue, oldValue) {
        this.getPosts();
      },
      deep: true,
    },
    'ui.view': {
      handler(newValue, oldVaklue) {
        let view = false;
        if (newValue == 'grid') view = true;
        this.saveUserPreference('prefersGridView', view, false);
      },
    },
  },
  computed: {
    /**
     * Returns items per page
     *
     * @since 3.2.13
     */
    returnPerPage() {
      return this.hasNestedPath(this.block, 'settings', 'block', 'options', 'postsPerPage', 'value');
    },

    /**
     * Returns amount of columns from settings
     *
     * @since 3.2.13
     */
    getColumns() {
      return this.hasNestedPath(this.block, 'settings', 'block', 'options', 'activeColumns', 'value');
    },

    /**
     * Returns enabled actions for table
     *
     * @since 3.2.13
     */
    getActions() {
      return this.hasNestedPath(this.block, 'settings', 'block', 'options', 'actionsEnabled', 'value');
    },

    /**
     * Returns whether the posts should be limited to the current author's own
     *
     * @since 3.2.13
     */
    limitToAuthor() {
      let limit = this.get_block_option(this.block, 'block', 'limitToAuthor');
      if (!limit) return false;
      if (!this.isObject(limit)) return limit;
      if (limit.value) return limit.value;
      return false;
    },

    /**
     * Returns whether the table's search is disabled
     *
     * @since 3.2.13
     */
    searchDisabled() {
      let disabled = this.get_block_option(this.block, 'block', 'searchDisabled');
      if (!disabled) return false;
      if (!this.isObject(disabled)) return disabled;
      if (disabled.value) return disabled.value;
      return false;
    },
  },
  methods: {
    /**
     * Updates the users prefered view for table
     *
     * @since 3.2.13
     */
    updateView() {
      const grid = this.uipApp.data.userPrefs.prefersGridView;
      if (grid) return (this.ui.view = 'grid');
      this.ui.view = 'list';
    },

    /**
     * Main function for fetching posts
     *
     * @since 3.2.13
     */
    async getPosts() {
      // Query already running so exit
      if (this.loading) return;

      this.loading = true;
      this.postTypes = this.get_block_option(this.block, 'block', 'activePostTypes');

      //Build form data for fetch request
      let formData = new FormData();
      formData.append('action', 'uip_get_posts_for_table');
      formData.append('security', uip_ajax.security);
      formData.append('search', this.searchString);
      formData.append('page', this.page);
      formData.append('postTypes', JSON.stringify(this.postTypes));
      formData.append('perPage', this.returnPerPage);
      formData.append('limitToAuthor', this.limitToAuthor);
      formData.append('search', this.searchString);
      formData.append('columns', JSON.stringify(this.getColumns));
      formData.append('actions', JSON.stringify(this.getActions));

      // Fetch posts
      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      // Something went very wrong
      if (!response) {
        this.uipApp.notifications.notify(__('Unable to fetch posts at this tiem', 'uipress-lite'), '', '', 'error', true);
        this.searching = false;
        return;
      }

      // Error response
      if (response.error) {
        this.uipApp.notifications.notify(response.message, '', '', 'error', true);
        this.searching = false;
      }

      // Success response
      if (response.success) {
        this.loading = false;
        this.results = response.posts;
        this.columns = response.columns;
        this.totalFound = response.total;
        this.totalPages = response.totalPages;
      }
    },

    /**
     * Handles previous page requests
     *
     * @since 3.2.13
     */
    goBack() {
      if (this.page > 1) this.page--;
    },

    /**
     * Handles next page requests
     *
     * @since 3.2.13
     */
    goForward() {
      if (this.page < this.totalPages) this.page++;
    },

    /**
     * Deletes an item based on its post ID and refreshes the patterns.
     *
     * @param {number|string} postID - The ID of the post to be deleted.
     * @since 3.2.13
     */
    async deleteThisItem(postID) {
      const confirm = await this.$refs.confirm.show({
        title: __('Delete post', 'uipress-lite'),
        message: __('Are you sure you want to delete this post?', 'uipress-lite'),
        okButton: __('Delete post', 'uipress-lite'),
      });

      if (!confirm) return;

      await deleteRemotePost(postID);
      this.uipApp.notifications.notify(__('Post deleted', 'uipress-lite'), '', 'success', true);
      this.getPosts();
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
                      <div class="uip-text-bold uip-link-emphasis uip-grid-item-title" @click="updateAppPage(item.link)">{{item.name}}</div>
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
                                <div v-else class="uip-flex uip-gap-xxs uip-flex-center uip-link-muted" @click="updateAppPage(action.link)">
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
                      <span class="uip-link-default " @click="updateAppPage(item.authorLink)">{{item.author}}</span>
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
                                <div class="uip-text-bold uip-post-title uip-link-default  uip-cursor-pointer"  @click="updateAppPage(item.editLink)">{{item.name}}</div>
                                <div class="uip-flex uip-gap-xxs uip-flex-center" v-if="item.hover">
                                  <div @click="updateAppPage(item.editLink)" :href="item.editLink" class="uip-icon uip-cursor-pointer uip-link-default">edit_document</div>
                                  <a :href="item.link" target="_BLANK" class="uip-icon uip-cursor-pointer uip-link-default uip-no-underline">open_in_new</a>
                                </div>
                              </div>
                              <div class="uip-text-s uip-post-meta uip-flex uip-flex-row uip-gap-xxxs">
                                <span class="uip-text-muted">{{strings.by}}</span>
                                <span class="uip-link-default " @click="updateAppPage(item.authorLink)">{{item.author}}</span>
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
                                      <div v-else class="uip-flex uip-gap-xxs uip-flex-center uip-link-muted" @click="updateAppPage(action.link)">
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
          
        <Confirm ref="confirm"/>  
      </div>
      `,
};
