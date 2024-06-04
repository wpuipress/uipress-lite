const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    display: String,
    name: String,
    block: Object,
  },
  data() {
    return {
      searchString: '',
      results: [],
      page: 1,
      totalPages: 0,
      loading: false,
      strings: {
        nothingFound: __('Nothing posts found', 'uipress-lite'),
        by: __('By', 'uipress-lite'),
      },
      searching: false,
    };
  },
  mounted() {
    this.getPosts();
  },
  watch: {
    page: {
      handler(newValue, oldValue) {
        if (newValue) this.getPosts();
      },
    },
    'block.settings.block.options': {
      handler(newValue, oldValue) {
        this.getPosts();
      },
      deep: true,
    },
  },
  computed: {
    /**
     * Returns items per page
     *
     * @since 3.2.13
     */
    returnPerPage() {
      return this.block.settings.block.options.postsPerPage.value;
    },

    /**
     * Returns post types active for block
     *
     * @since 3.2.13
     */
    postTypes() {
      return this.get_block_option(this.block, 'block', 'activePostTypes');
    },

    /**
     * Returns per page option for block
     *
     * @since 3.2.13
     */
    perPage() {
      return this.get_block_option(this.block, 'block', 'postsPerPage');
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
  },
  methods: {
    /**
     * Fetches posts
     *
     * @returns {Promise}
     * @since 3.2.13
     */
    async getPosts() {
      //Query already running
      if (this.loading) return;

      this.loading = true;

      const postTypes = this.postTypes;

      //Build form data for fetch request
      let formData = new FormData();
      formData.append('action', 'uip_get_recent_posts');
      formData.append('security', uip_ajax.security);
      formData.append('search', this.searchString);
      formData.append('page', this.page);
      formData.append('postTypes', JSON.stringify(postTypes));
      formData.append('perPage', this.returnPerPage);
      formData.append('limitToAuthor', this.limitToAuthor);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      // No response to exit early
      if (!response) {
        this.uipApp.notifications.notify(__('Unable to fetch posts at this tiem', 'uipress-lite'), '', '', 'error', true);
        this.searching = false;
        return;
      }

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, '', '', 'error', true);
        this.searching = false;
      }

      // Handle success
      if (response.success) {
        this.loading = false;
        this.results = response.posts;
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
  },
  template: `
    
            <div class="uip-flex uip-flex-column uip-row-gap-s">
              <div class="uip-flex uip-flex-column uip-row-gap-xs uip-list-area">
                <loading-chart v-if="loading"></loading-chart>
                <template  v-if="!loading" v-for="item in results">
                  <div class="uip-flex uip-flex-row uip-flex-between uip-flex-center" @mouseover="item.hover = true" @mouseleave="item.hover = false">
                    <div class="">
                      <div class="uip-flex uip-flex-row uip-gap-xxs uip-flex-center" >
                        <div class="uip-text-bold uip-post-title uip-link-default uip-cursor-pointer"  @click="updateAppPage(item.link)">{{item.name}}</div>
                        <div class="uip-text-xs uip-background-primary-wash uip-border-round uip-padding-xxxs uip-post-type-label">{{item.type}}</div>
                        <div class="uip-flex uip-gap-xxs uip-flex-center" v-if="item.hover">
                          <div @click="updateAppPage(item.editLink)" :href="item.editLink" class="uip-icon uip-cursor-pointer uip-link-muted">edit_document</div>
                          <a :href="item.link" target="_BLANK" class="uip-icon uip-cursor-pointer uip-link-muted uip-no-underline">open_in_new</a>
                        </div>
                      </div>
                      <div class="uip-text-s uip-post-meta uip-flex uip-flex-row uip-gap-xxxs">
                        <span class="uip-text-muted">{{strings.by}}</span>
                        <span class="">{{item.author}}</span>
                        <span class="uip-text-muted">{{item.modified}}</span>
                      </div>
                    </div>
                  </div>
                </template>
                <div v-if="results.length == 0 && searchString.length > 0" class="uip-text-muted uip-text-s">
                  {{strings.nothingFound}}
                </div>
              </div>
              <div class="uip-flex uip-gap-xs" v-if="totalPages > 1">
                <button @click="goBack" class="uip-button-default uip-icon uip-nav-button">chevron_left</button>
                <button @click="goForward" v-if="page < totalPages" class="uip-button-default uip-icon uip-nav-button">chevron_right</button>
              </div>
            </div>
            
            `,
};
