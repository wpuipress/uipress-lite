const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {},
  data() {
    return {
      loading: false,
      search: "",
      allErrrors: [],
      perPage: 20,
      order: "desc",
      page: 0,
      totalFound: 0,
      totalPages: 0,
      error: {
        state: false,
        message: "",
        description: "",
      },
      strings: {
        pixels: __("Pixels", "uipress-lite"),
        searchErrors: __("Search errors", "uipress-lite"),
        errorLog: __("Error log", "uipress-lite"),
        misc: __("Misc", "uipress-lite"),
        fatal: __("Fatal", "uipress-lite"),
        warning: __("Warning", "uipress-lite"),
        syntax: __("Syntax", "uipress-lite"),
        notice: __("Notice", "uipress-lite"),
        exception: __("Exception", "uipress-lite"),
        results: __("entries", "uipress-lite"),
        newestFirst: __("Newest first", "uipress-lite"),
        oldestFirst: __("Oldest first", "uipress-lite"),
        sortBy: __("Sort by", "uipress-lite"),
        line: __("line", "uipress-lite"),
        refreshLog: __("Refresh log", "uipress-lite"),
        stackTrace: __("Stack trace", "uipress-lite"),
        noErrrors: __("No PHP errors to display!", "uipress-lite"),
      },
    };
  },

  watch: {
    order: {
      handler(newVal, oldVal) {
        this.fetchErrorLog();
      },
      deep: true,
    },
    search: {
      handler(newVal, oldVal) {
        this.fetchErrorLog();
      },
      deep: true,
    },
  },
  mounted() {
    this.fetchErrorLog();
  },
  methods: {
    /**
     * Fetches error log
     *
     * @returns {Promise}
     * @since 3.2.13
     */
    async fetchErrorLog() {
      if (this.loading) return;

      this.loading = true;
      this.error.state = false;
      //Build form data for fetch request
      let formData = new FormData();
      formData.append("action", "uip_get_php_errors");
      formData.append("security", uip_ajax.security);
      formData.append("perPage", this.perPage);
      formData.append("search", this.search);
      formData.append("order", this.order);
      formData.append("page", this.page);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);
      this.loading = false;

      // Handle error
      if (response.error) {
        this.error.state = true;
        this.error.message = response.message;
        this.error.description = response.description;
        this.loading = false;
      }

      // Handle success
      if (response.success) {
        this.allErrrors = response.errors;
        this.totalFound = response.totalFound;
        this.totalPages = response.totalPages;
      }
    },

    /**
     * Navigated back a page
     *
     * @since 3.2.13
     */
    goBack() {
      if (this.page > 0) {
        this.page = this.page - 1;
        this.fetchErrorLog();
      }
    },

    /**
     * Navigates forward a page
     *
     * @since 3.2.13
     */
    goForward() {
      if (this.page < this.totalPages) {
        this.page = this.page + 1;
        this.fetchErrorLog();
      }
    },
  },
  template: `
  
    <uip-floating-panel closeRoute="/" id="uip-global-settings">
    
      <div class="uip-body-font uip-h-100p uip-flex uip-max-h-100p uip-overflow-hidden uip-flex uip-flex-column uip-row-gap-m uip-padding-m" style="font-size:14px">
       
        
          
          
          <!-- Titles and search -->
          <div class="uip-text-bold uip-text-emphasis">{{strings.errorLog}}</div>
        
          <div class="uip-flex uip-gap-xxs uip-flex-center">
            
            <dropdown pos="bottom left">
              <template v-slot:trigger>
                <button class="uip-icon uip-button-default uip-padding-xxs">sort</button>
              </template>
              <template v-slot:content>
                  <div class="uip-padding-s uip-flex uip-flex-column uip-row-gap-xxs uip-w-200"> 
                  
                    <div class="uip-text-s uip-text-muted">{{strings.sortBy}}</div>
                  
                    <div class="uip-flex uip-flex-between uip-gap-l hover:uip-background-muted uip-padding-xxs uip-border-rounder uip-flex-center uip-cursor-pointer"
                    :class="{'uip-background-grey' : order == 'desc'}" @click="order = 'desc'">
                      <div class="">{{strings.newestFirst}}</div>
                      <div v-if="order == 'desc'" class="uip-icon uip-text-l">done</div>
                    </div>
                    
                    <div class="uip-flex uip-flex-between uip-gap-l hover:uip-background-muted uip-padding-xxs uip-border-rounder uip-flex-center uip-cursor-pointer" 
                    :class="{'uip-background-grey' : order == 'asc'}" @click="order = 'asc'">
                      <div class="">{{strings.oldestFirst}}</div>
                      <div v-if="order == 'asc'" class="uip-icon uip-text-l">done</div>
                    </div>
                    
                  </div>
              </template>
            </dropdown>
            
            
            
            <div class="uip-flex uip-padding-xxs uip-border-round uip-flex-grow uip-background-muted uip-border-rounder uip-flex-center">
              <span class="uip-icon uip-text-muted">search</span>
              <input class="uip-blank-input uip-flex-grow uip-text-s" type="search" :placeholder="strings.searchErrors" v-model="search" autofocus="">
            </div>
            
            <button :title="strings.refreshLog" class="uip-icon uip-button-default uip-padding-xxs" @click="fetchErrorLog()">refresh</button>
            
          </div>
          
          <!--End title and search -->
          
          <div class="uip-flex uip-flex-column uip-gap-s uip-flex-grow uip-overflow-auto">
          
            
            
            <div v-if="error.state" class="uip-padding-xs uip-background-orange-wash uip-border-round uip-flex uip-flex-column uip-row-gap-xxs">
              <div class="uip-text-">{{error.message}}</div>
              <div class="uip-text-s uip-text-muted">{{error.description}}</div>
            </div>
            
            <div class="uip-padding-m uip-flex uip-flex-center uip-flex-middle uip-w-100p" v-if="loading"><loading-chart></loading-chart></div>
            
            <template v-else v-for="err in allErrrors" >
            
                <div class="uip-flex uip-flex-column uip-gap-xxs">
                
                  <div class="uip-flex uip-flex-column uip-gap-xxs uip-cursor-pointer" @click="err.open = !err.open" v-if="err">
                
                    <div class="uip-flex uip-flex-row uip-gap-xxs">
                     
                      
                      <span v-if="err.type == 'UNKNOWN'" class="uip-background-muted uip-border-round uip-padding-xxxs uip-text-s">{{strings.misc}}</span>
                      <span v-if="err.type == 'FATAL'" class="uip-background-muted uip-border-round uip-padding-xxxs uip-text-s uip-background-red-wash uip-color-danger">{{strings.fatal}}</span>
                      <span v-if="err.type == 'WARNING'" class="uip-background-muted uip-border-round uip-padding-xxxs uip-text-s uip-background-orange-wash">{{strings.warning}}</span>
                      <span v-if="err.type == 'SYNTAX'" class="uip-background-muted uip-border-round uip-padding-xxxs uip-text-s uip-background-orange-wash">{{strings.syntax}}</span>
                      <span v-if="err.type == 'NOTICE'" class="uip-background-muted uip-border-round uip-padding-xxxs uip-text-s uip-background-primary-wash">{{strings.notice}}</span>
                      <span v-if="err.type == 'EXCEPTION'" class="uip-background-muted uip-border-round uip-padding-xxxs uip-text-s uip-background-orange-wash">{{strings.exception}}</span>
                      
                      <span class="uip-background-mute uip-border-round uip-padding-xxxs uip-text-muted uip-text-s">{{err.date}} @{{err.time}}</span>
                      
                      
                    </div>
                    
                    <div class="uip-overflow-hidden uip-text-ellipsis uip-text-s uip-padding-xxxs" :class="!err.open ? 'uip-no-wrap' : ''">{{err.message}}</div>
                  
                  </div>
                  
                  <div v-if="err.open && err" class="uip-flex uip-flex-column uip-row-gap-xs uip-scale-in-top uip-margin-bottom-s">
                    
                    <div class="uip-text-s uip-padding-xxs uip-background-muted uip-border-round uip-text-muted">{{err.file}} @{{strings.line}} {{err.line}}</div>
                    
                    <template v-if="err.stackTrace &&  err.stackTrace.length > 0">
                    
                      <div class="uip-text-s uip-padding-xxxs">{{strings.stackTrace}}</div>
                      
                      <div class="uip-flex uip-flex-column uip-padding-left-s">
                        <template v-for="(item, index) in err.stackTrace">
                          <div class="uip-text-xs uip-text-muted uip-padding-xxs uip-border-left uip-padding-left-s uip-circle-before uip-position-relative" 
                          :class="[{'uip-padding-remove-top' : index == 0},{'uip-padding-remove-bottom uip-border-transparent' : index == (err.stackTrace.length - 1)}]">{{item}}</div>
                        </template>
                      </div>
                    
                    </template>
                    
                  
                  </div>
                
                </div>
                
            </template>
            
            <div v-if="allErrrors.length < 1 && !loading" class="uip-padding-xs uip-text-muted uip-background-green-wash uip-border-round uip-text-s">
              {{strings.noErrrors}}
            </div>
            
          </div>
          
          
          <div class="uip-flex uip-flex-row uip-flex-between uip-flex-center uip-padding-xs uip-padding-remove-bottom uip-margin-top-s">
            <div class="uip-text-muted uip-text-s">{{totalFound + ' ' + strings.results}}</div>
            <div class="uip-flex uip-gap-xs" v-if="totalPages > 0">
              <button @click="goBack" v-if="totalPages >= 1" class="uip-button-default uip-icon uip-search-nav-button">chevron_left</button>
              <button @click="goForward" v-if="page < totalPages" class="uip-button-default uip-icon uip-search-nav-button">chevron_right</button>
            </div>
          </div>
          
          
        
        
        
      </div>
      
    </uip-floating-panel>  
    `,
};
