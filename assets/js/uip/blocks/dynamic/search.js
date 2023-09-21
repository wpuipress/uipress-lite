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
        types: [],
        activeType: 'all',
        page: 1,
        totalPages: 0,
        totalFound: 0,
        strings: {
          searchPlaceHolder: __('Search content', 'uipress-lite'),
          nothingFound: __('Nothing found for query', 'uipress-lite'),
          by: __('by', 'uipress-lite'),
          found: __('found', 'uipress-lite'),
          all: __('All', 'uipress-lite'),
          edit: __('Edit', 'uipress-lite'),
          view: __('View', 'uipress-lite'),
          copy: __('Copy url', 'uipress-lite'),
        },
        searching: false,
      };
    },
    inject: ['uipData', 'uipress', 'uiTemplate'],
    watch: {
      searchString: {
        handler(newValue, oldValue) {
          if (newValue != '') {
            this.page = 1;
            this.searchContent();
          } else {
            this.results = [];
          }
        },
        deep: true,
      },
      page: {
        handler(newValue, oldValue) {
          if (newValue != '') {
            this.searchContent();
          }
        },
        deep: true,
      },
      activeType: {
        handler(newValue, oldValue) {
          if (newValue != '') {
            this.searchContent();
          }
        },
        deep: true,
      },
    },
    computed: {
      getPostTypes() {
        let types = this.uipress.get_block_option(this.block, 'block', 'searchPostTypes');
        return types;
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
    },
    methods: {
      searchContent() {
        let self = this;
        //Query already running
        if (self.searching) {
          return;
        }
        self.searching = true;
        let postTypes = [];
        if (typeof self.getPostTypes != 'undefined') {
          if (Array.isArray(self.getPostTypes)) {
            postTypes = self.getPostTypes;
          }
        }

        postTypes = JSON.stringify(postTypes);

        let limitToauthor = self.limitToauthor;
        //Build form data for fetch request
        let formData = new FormData();
        formData.append('action', 'uip_search_content');
        formData.append('security', uip_ajax.security);
        formData.append('search', self.searchString);
        formData.append('page', self.page);
        formData.append('limitToauthor', limitToauthor);
        formData.append('postTypes', postTypes);
        formData.append('filter', this.activeType);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          if (response.error) {
            self.uipress.notify(response.message, 'uipress-lite', '', 'error', true);
            self.searching = false;
          }
          if (response.success) {
            self.searching = false;
            self.results = response.posts;
            self.totalPages = response.totalPages;
            self.totalFound = response.totalFound;
            self.types = response.types;
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
      formatHighlight(name) {
        return name;
      },
    },
    template: `
            <div class="uip-flex uip-flex-column">
              <div class="">
                <div class="uip-flex uip-padding-xxs uip-border uip-search-block uip-border-round uip-flex-center uip-margin-bottom-s uip-position-relative">
                  <span class="uip-icon uip-text-muted uip-margin-right-xs">search</span> 
                  <input class="uip-blank-input uip-flex-grow uip-text-s" type="search" :placeholder="strings.searchPlaceHolder" v-model="searchString" autofocus="">
                  
                  <div class="uip-position-absolute uip-left-0 uip-bottom-0 uip-w-100p" v-if="searching">
                    <div ref="loader" class="uip-ajax-loader">
                      <div class="uip-loader-bar"></div>
                    </div>
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
                          
                            <div class="uip-text-bold uip-search-result-title uip-link-default uip-cursor-pointer"  @click="uipress.updatePage(item.link)" v-html="formatHighlight(item.name)"></div>
                            
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
                                
                                <a :href="item.link" class="uip-link-muted hover:uip-background-muted uip-border-round uip-padding-xxxs uip-flex uip-flex-row uip-gap-xs uip-flex-center uip-no-underline" @click="uipress.updatePage(item.link)">
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
}
