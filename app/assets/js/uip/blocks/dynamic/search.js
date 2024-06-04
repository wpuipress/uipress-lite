const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    display: String,
    name: String,
    block: Object,
  },
  data() {
    return {
      searchString: "",
      results: [],
      types: [],
      activeType: "all",
      page: 1,
      totalPages: 0,
      totalFound: 0,
      strings: {
        searchPlaceHolder: __("Search content", "uipress-lite"),
        nothingFound: __("Nothing found for query", "uipress-lite"),
        by: __("by", "uipress-lite"),
        found: __("found", "uipress-lite"),
        all: __("All", "uipress-lite"),
        edit: __("Edit", "uipress-lite"),
        view: __("View", "uipress-lite"),
        copy: __("Copy url", "uipress-lite"),
      },
      searching: false,
    };
  },
  watch: {
    searchString: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.page = 1;
          this.searchContent();
        } else {
          this.results = [];
        }
      },
    },
    page: {
      handler(newValue, oldValue) {
        if (newValue) this.searchContent();
      },
    },
    activeType: {
      handler(newValue, oldValue) {
        if (newValue) this.searchContent();
      },
    },
  },
  computed: {
    /**
     * Returns custom post types for search
     *
     * @since 3.2.13
     */
    getPostTypes() {
      return this.get_block_option(this.block, "block", "searchPostTypes");
    },

    /**
     * Returns whether the posts should be limited to the current author's own
     *
     * @since 3.2.13
     */
    limitToAuthor() {
      let limit = this.get_block_option(this.block, "block", "limitToAuthor");
      if (!limit) return false;
      if (!this.isObject(limit)) return limit;
      if (limit.value) return limit.value;
      return false;
    },
  },
  methods: {
    /**
     * Search blog content
     *
     * @returns {Promise}
     * @since 3.2.13
     */
    async searchContent() {
      // Query already running so exit
      if (this.searching) return;

      this.searching = true;

      let postTypes = [];
      const limitToauthor = this.limitToauthor;

      if (Array.isArray(this.getPostTypes)) {
        postTypes = this.getPostTypes;
      }

      postTypes = JSON.stringify(postTypes);

      //Build form data for fetch request
      let formData = new FormData();
      formData.append("action", "uip_search_content");
      formData.append("security", uip_ajax.security);
      formData.append("search", this.searchString);
      formData.append("page", this.page);
      formData.append("limitToauthor", limitToauthor);
      formData.append("postTypes", postTypes);
      formData.append("filter", this.activeType);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      // Something went very wrong
      if (!response) {
        this.uipApp.notifications.notify(__("Unable to fetch posts at this tiem", "uipress-lite"), "", "", "error", true);
        this.searching = false;
        return;
      }

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "", "", "error", true);
        this.searching = false;
      }

      // Handle success
      if (response.success) {
        this.searching = false;
        this.results = response.posts;
        this.totalPages = response.totalPages;
        this.totalFound = response.totalFound;
        this.types = response.types;
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
            <div class="uip-flex uip-flex-column">
            
              <div class="uip-flex uip-padding-xxs uip-border uip-search-block uip-border-round uip-flex-center uip-margin-bottom-s uip-position-relative">
                <span class="uip-icon uip-text-muted uip-margin-right-xs">search</span> 
                <input class="uip-blank-input uip-flex-grow uip-text-s" type="search" :placeholder="strings.searchPlaceHolder" v-model="searchString" autofocus>
                
                <div class="uip-position-absolute uip-left-0 uip-bottom-0 uip-w-100p" v-if="searching">
                  <div ref="loader" class="uip-ajax-loader">
                    <div class="uip-loader-bar"></div>
                  </div>
                </div>
                
              </div>
              
              
              <template v-if="results.length > 0">
                
                
              
                <div class="uip-flex uip-flex-column uip-row-gap-xs uip-padding-xxs uip-search-results-area">
                
                  <div class="uip-flex uip-flex-row uip-gap-xs uip-border-bottom uip-margin-bottom-s uip-padding-left-xxs">
                    
                    <div class="uip-link-muted uip-padding-xxs" :class="{'uip-border-bottom-primary uip-text-emphasis' : activeType == 'all'}" @click="activeType = 'all'">{{strings.all}}</div>
                    
                    <template v-for="type in types">
                        <div class="uip-link-muted uip-padding-xxs" :class="{'uip-border-bottom-primary uip-text-emphasis' : activeType == type.name}" @click="activeType = type.name">{{type.label}}</div>
                    </template>
                    
                    <div class="uip-flex-grow uip-flex uip-flex-right uip-padding-xxs">
                      <button class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted" @click="searchString = ''">close</button>
                    </div>
                  </div>
                
                  
                  
                  <div class="uip-flex uip-flex-column uip-row-gap-xs uip-found-items-list">
                    <template v-for="item in results">
                      <div class="uip-flex uip-flex-row uip-gap-s uip-flex-center" @mouseover="item.hover = true" @mouseleave="item.hover = false">
                      
                        <div v-if="item.icon == 'article' || !item.icon" class="uip-border uip-border-round uip-padding-xxs">
                          <div v-if="item.icon == 'article'" class="uip-icon">article</div>
                          <div v-if="!item.icon" class="uip-icon">collections</div>
                        </div>
                        
                        <div v-else class="uip-border uip-border-round uip-w-25 uip-ratio-1-1 uip-background-cover"
                        :style="'background-image: url(' + item.icon + ')'">
                        </div>
                        
                        <div class="">
                          <div class="uip-flex uip-flex-row uip-gap-xxs uip-flex-center" >
                          
                            <div class="uip-text-bold uip-search-result-title uip-link-default uip-cursor-pointer"  @click="updateAppPage(item.link)" v-html="item.name"></div>
                            
                            <div class="uip-text-xs uip-background-primary-wash uip-border-round uip-padding-xxxs uip-hidden">{{item.type}}</div>
                            
                          </div>
                          <div class="uip-text-s uip-search-result-meta uip-flex uip-flex-row uip-gap-xxxs">
                            <span >{{item.type}}</span>
                            <span class="uip-text-muted">{{strings.by}}</span>
                            <span class="">{{item.author}}</span>
                            <span class="uip-text-muted">{{item.modified}}</span>
                          </div>
                        </div>
                        
                        <!--Options Dropdown-->
                        <div class="uip-flex-grow uip-flex uip-flex-right">
                        
                          <dropdown pos="bottom right">
                          
                            <template v-slot:trigger>
                              <div class="uip-icon uip-link-muted uip-text-l">more_vert</div>
                            </template>
                            
                            <template v-slot:content>
                              <div class="uip-flex uip-flex-column uip-row-gap-xxs uip-padding-xxs">
                              
                                <a :href="item.editLink" class="uip-link-muted hover:uip-background-muted uip-border-round uip-padding-xxxs uip-flex uip-flex-row uip-gap-xs uip-flex-center uip-no-underline">
                                  <div class="uip-icon uip-text-l">edit</div>
                                  <div class="uip-no-wrap">{{strings.edit + ' ' + item.type}}</div>
                                </a>
                                
                                <a :href="item.link" class="uip-link-muted hover:uip-background-muted uip-border-round uip-padding-xxxs uip-flex uip-flex-row uip-gap-xs uip-flex-center uip-no-underline" @click="updateAppPage(item.link)">
                                  <div class="uip-icon uip-text-l">visibility</div>
                                  <div class="uip-no-wrap">{{strings.view + ' ' + item.type}}</div>
                                </a>
                                
                                
                              </div>
                            </template>
                            
                          </dropdown>
                        </div>
                        <!--End-->
                      </div>
                    </template>
                  </div>
                  <div v-if="results.length == 0 && searchString.length > 0" class="uip-text-muted uip-text-s">
                    {{strings.nothingFound}} {{searchString}}
                  </div>
                  
                  <div class="uip-flex uip-flex-between uip-gap-xxs uip-flex-center" v-if="searchString != ''">
                    <div class="uip-padding-xs uip-padding-left-remove uip-text-muted">{{totalFound}} {{strings.found}}</div>
                    <div class="uip-flex uip-gap-xs uip-padding-xs" v-if="totalPages > 1">
                      <button @click="goBack" class="uip-button-default uip-icon uip-search-nav-button">chevron_left</button>
                      <button @click="goForward" v-if="page < totalPages" class="uip-button-default uip-icon uip-search-nav-button">chevron_right</button>
                    </div>
                  </div>
                  
                </div>
                
              </template>
              
              
            </div>`,
};
