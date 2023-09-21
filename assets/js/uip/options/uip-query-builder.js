const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: Object,
      blockSettings: Object,
    },
    data: function () {
      return {
        open: false,
        options: {
          type: 'post',
          postType: ['post'],
          order: 'DESC',
          orderBy: 'date',
          roles: [],
          orderBykEY: '',
          perPage: 20,
          status: ['publish'],
          relation: 'AND',
          taxRelation: 'AND',
          offset: '',
          taxQuery: [],
          metaQuery: [],
          limitToAuthor: false,
          showPagination: false,
          search: false,
        },
        strings: {
          type: __('Type', 'uipress-lite'),
          postType: __('Post type', 'uipress-lite'),
          orderBy: __('Order by', 'uipress-lite'),
          perPage: __('Per page', 'uipress-lite'),
          offset: __('Offset', 'uipress-lite'),
          metaQuery: __('Meta query', 'uipress-lite'),
          taxQuery: __('Tax query', 'uipress-lite'),
          postTypes: __('Post types', 'uipress-lite'),
          searchPostTypes: __('Search post types', 'uipress-lite'),
          metaKey: __('Meta key', 'uipress-lite'),
          metaValue: __('Meta value', 'uipress-lite'),
          terms: __('Terms', 'uipress-lite'),
          compare: __('Compare', 'uipress-lite'),
          order: __('Order', 'uipress-lite'),
          metaKey: __('Meta key', 'uipress-lite'),
          status: __('Status', 'uipress-lite'),
          relation: __('Relation', 'uipress-lite'),
          postStatus: __('Post statuses', 'uipress-lite'),
          seacrhPostStatus: __('Search post statuses', 'uipress-lite'),
          pagination: __('Pagination', 'uipress-lite'),
          roles: __('Roles', 'uipress-lite'),
          searchRoles: __('Search roles', 'uipress-lite'),
          search: __('Search', 'uipress-lite'),
          usersOwnContent: __('Limit to users own content', 'uipress-lite'),
          taxonomy: __('Taxonomy', 'uipress-lite'),
          field: __('Field', 'uipress-lite'),
          taxValue: __('Tax value', 'uipress-lite'),
          includeChildren: __('Include children', 'uipress-lite'),
        },
        fieldTypes: {
          term_id: {
            value: 'term_id',
            label: 'term_id',
          },
          name: {
            value: 'name',
            label: 'name',
          },
          slug: {
            value: 'slug',
            label: 'slug',
          },
          term_taxonomy_id: {
            value: 'term_taxonomy_id',
            label: 'term_taxonomy_id',
          },
        },
        queryType: {
          post: {
            value: 'post',
            label: __('Posts', 'uipress-lite'),
          },
          user: {
            value: 'user',
            label: __('Users', 'uipress-lite'),
          },
        },
        relationOptions: {
          AND: {
            value: 'AND',
            label: __('AND', 'uipress-lite'),
          },
          OR: {
            value: 'OR',
            label: __('OR', 'uipress-lite'),
          },
        },
        comparisons: [
          {
            value: '=',
            label: __('Equal', 'uipress-lite'),
          },
          {
            value: '!=',
            label: __('Not equal', 'uipress-lite'),
          },
          {
            value: '>',
            label: __('Greater than', 'uipress-lite'),
          },
          {
            value: '>=',
            label: __('Greater than or equal', 'uipress-lite'),
          },
          {
            value: '<',
            label: __('Lesser than', 'uipress-lite'),
          },
          {
            value: '<=',
            label: __('Lesser than or equal', 'uipress-lite'),
          },
          {
            value: 'LIKE',
            label: __('LIKE', 'uipress-lite'),
          },
          {
            value: 'NOT LIKE',
            label: __('NOT LIKE', 'uipress-lite'),
          },
          {
            value: 'IN',
            label: __('IN', 'uipress-lite'),
          },
          {
            value: 'NOT IN',
            label: __('NOT IN', 'uipress-lite'),
          },
        ],
        dataTypes: [
          {
            value: 'NUMERIC',
            label: __('NUMERIC', 'uipress-lite'),
          },
          {
            value: 'CHAR',
            label: __('CHAR', 'uipress-lite'),
          },
          {
            value: 'DATE',
            label: __('DATE', 'uipress-lite'),
          },
          {
            value: 'DATETIME',
            label: __('DATETIME', 'uipress-lite'),
          },
          {
            value: 'DECIMAL',
            label: __('DECIMAL', 'uipress-lite'),
          },
          {
            value: 'SIGNED',
            label: __('SIGNED', 'uipress-lite'),
          },
          {
            value: 'TIME',
            label: __('TIME', 'uipress-lite'),
          },
          {
            value: 'UNSIGNED',
            label: __('UNSIGNED', 'uipress-lite'),
          },
        ],
        orderDirectionsOptions: {
          DESC: {
            value: 'DESC',
            label: __('Descending', 'uipress-lite'),
          },
          ASC: {
            value: 'ASC',
            label: __('Ascending', 'uipress-lite'),
          },
        },
        showPagination: {
          false: {
            value: false,
            label: __('Hide', 'uipress-lite'),
          },
          true: {
            value: true,
            label: __('Show', 'uipress-lite'),
          },
        },
        orderByOptions: [
          {
            value: 'none',
            label: __('None', 'uipress-lite'),
          },
          {
            value: 'ID',
            label: __('ID', 'uipress-lite'),
          },
          {
            value: 'author',
            label: __('Author', 'uipress-lite'),
          },
          {
            value: 'title',
            label: __('Title', 'uipress-lite'),
          },
          {
            value: 'name',
            label: __('Name', 'uipress-lite'),
          },
          {
            value: 'type',
            label: __('Poast type', 'uipress-lite'),
          },
          {
            value: 'date',
            label: __('Date', 'uipress-lite'),
          },
          {
            value: 'modified',
            label: __('Modified', 'uipress-lite'),
          },
          {
            value: 'rand',
            label: __('Random', 'uipress-lite'),
          },
          {
            value: 'comment_count',
            label: __('Commend count', 'uipress-lite'),
          },
          {
            value: 'meta_value',
            label: __('Meta value', 'uipress-lite'),
          },
        ],
        orderByOptionsUser: [
          {
            value: 'none',
            label: __('None', 'uipress-lite'),
          },
          {
            value: 'ID',
            label: __('ID', 'uipress-lite'),
          },
          {
            value: 'display_name',
            label: __('Name', 'uipress-lite'),
          },
          {
            value: 'user_name',
            label: __('Username', 'uipress-lite'),
          },
          {
            value: 'user_login',
            label: __('User login', 'uipress-lite'),
          },
          {
            value: 'user_nicename',
            label: __('Nicename', 'uipress-lite'),
          },
          {
            value: 'user_email',
            label: __('Email', 'uipress-lite'),
          },
          {
            value: 'user_registered',
            label: __('Registered date', 'uipress-lite'),
          },
          {
            value: 'post_count',
            label: __('Post count', 'uipress-lite'),
          },
          {
            value: 'rand',
            label: __('Random', 'uipress-lite'),
          },
          {
            value: 'meta_value',
            label: __('Meta value', 'uipress-lite'),
          },
        ],
        orderByOptionsSites: [
          {
            value: 'none',
            label: __('None', 'uipress-lite'),
          },
          {
            value: 'ID',
            label: __('ID', 'uipress-lite'),
          },
          {
            value: 'domain',
            label: __('Domain', 'uipress-lite'),
          },
          {
            value: 'path',
            label: __('Path', 'uipress-lite'),
          },
          {
            value: 'network_id',
            label: __('Network ID', 'uipress-lite'),
          },
          {
            value: 'last_updated',
            label: __('Last updated', 'uipress-lite'),
          },
          {
            value: 'registered',
            label: __('Registered', 'uipress-lite'),
          },
          {
            value: 'domain_length',
            label: __('Domain length', 'uipress-lite'),
          },
          {
            value: 'path_length',
            label: __('Path length', 'uipress-lite'),
          },
        ],
      };
    },
    inject: ['uipress', 'uipData'],
    watch: {
      options: {
        handler(newValue, oldValue) {
          this.returnData(newValue);
        },
        deep: true,
      },
    },
    mounted: function () {
      this.formatValue(this.value);

      if (this.uipData.options.multisite) {
        this.queryType.site = {
          value: 'site',
          label: __('Sites', 'uipress-lite'),
        };
      }
    },
    computed: {
      returnAlignOptions() {
        if (this.options.direction == 'horizontal') {
          return this.alignments;
        }
        return this.verticalAlignments;
      },
      returnOrderOptions() {
        if (this.options.type == 'post') {
          return this.orderByOptions;
        }
        if (this.options.type == 'user') {
          return this.orderByOptionsUser;
        }
        if (this.options.type == 'site') {
          return this.orderByOptionsSites;
        }
      },
    },
    methods: {
      formatValue(value) {
        if (typeof value === 'undefined') {
          return;
        }
        if (this.uipress.isObject(value)) {
          this.options = { ...this.options, ...value };
          return;
        }
      },
      defaultMetaQuery() {
        return structuredClone({
          key: '',
          value: '',
          compare: '=',
          type: 'CHAR',
        });
      },
      defaultTaxQuery() {
        return structuredClone({
          taxonomy: '',
          value: '',
          fieldType: 'term_id',
          compare: '=',
          includeChildren: true,
        });
      },
      returnTaxPostTypes(postTypes) {
        return postTypes.toString();
      },
    },
    template: `
      <div class="uip-flex uip-flex-column uip-row-gap-xs">
        
        
        <!--Type -->
        <div class="uip-grid-col-1-3">
        
          <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.type}}</span></div>
            
          <div class="uip-position-relative">
            <toggle-switch :options="queryType" :activeValue="options.type" :returnValue="function(data){ options.type = data}"></toggle-switch>
          </div>
          
        </div>
        
        
        
        
        
        <!--Post Type -->
        <div v-if="options.type == 'post'" class="uip-grid-col-1-3">
        
          <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.postType}}</span></div>
            
          <div class="uip-position-relative">
            <post-type-select :selected="options.postType" :placeHolder="strings.postTypes"
            :searchPlaceHolder="strings.searchPostTypes" :updateSelected="function(d){options.postType = d}" />
          </div>
          
        </div>
        
        
        <!--Role select -->
        <div v-if="options.type == 'user'" class="uip-grid-col-1-3">
        
          <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.roles}}</span></div>
            
          <div class="uip-position-relative">
            <user-role-select type="roles" :selected="options.roles" :placeHolder="strings.roles"
            :searchPlaceHolder="strings.searchRoles" :updateSelected="function(d){options.roles = d}" />
          </div>
          
        </div>
        
        
        <!--Status -->
        <div class="uip-grid-col-1-3" v-if="options.type == 'post'">
        
          <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.status}}</span></div>
          
          <div class="uip-position-relative uip-flex uip-gap-xs">
            <multi-select :availableOptions="uipData.options.post_statuses" :selected="options.status" :placeHolder="strings.postStatus"
            :searchPlaceHolder="strings.seacrhPostStatus" :updateSelected="function(d){options.status = d}" />
          </div>
          
        </div>
        
        
        <!--Order by-->
        <div class="uip-grid-col-1-3">
        
          <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.order}}</span></div>
            
          <div class="uip-position-relative">
            
            <dropdown pos="left center" triggerClass="uip-flex uip-flex-grow uip-w-100p" containerClass="uip-flex uip-flex-grow uip-w-100p">
              <template v-slot:trigger>
                <div class="uip-background-muted uip-border-rounder uip-padding-xxs uip-padding-left-xs uip-flex uip-gap-xs uip-w-100p">
                  <div class="uip-text-capitalize uip-flex uip-gap-xxs">
                    <span>{{options.orderBy}}</span>
                    <span class="uip-text-muted">|</span>
                    <span class="uip-text-muted">{{options.order}}</span>
                  </div>
                </div>
              </template>
              <template v-slot:content>
                <div class="uip-padding-s uip-border-bottom uip-text-bold">
                  {{strings.orderBy}}
                </div>
                <div class="uip-padding-s uip-flex uip-flex-column uip-row-gap-xs">
                
                  <!--ORDER-->
                  <div class="uip-grid-col-1-3">
                    <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.order}}</span></div>
                    <div class="uip-position-relative">
                      <toggle-switch :options="orderDirectionsOptions" :activeValue="options.order" :returnValue="function(data){ options.order = data}"></toggle-switch>
                    </div>
                  </div>
                  
                  <!--Orderby-->
                  <div class="uip-grid-col-1-3">
                    <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.orderBy}}</span></div>
                    <div class="uip-position-relative">
                      <select class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p  uip-w-100p uip-border-rounder" style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large)" v-model="options.orderBy">
                        <template v-for="item in returnOrderOptions">
                          <option :value="item.value">{{item.label}}</option>
                        </template>
                      </select>
                    </div>
                  </div>
                  
                  <!--Meta key-->
                  <div v-if="options.orderBy == 'meta_value'" class="uip-grid-col-1-3">
                    <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.metaKey}}</span></div>
                    <div class="uip-position-relative">
                      <input type="text" min="0" class="uip-input uip-remove-steps uip-background-remove uip-padding-xxxs uip-flex-grow" v-model="options.orderBykEY">
                    </div>
                  </div>
                  
                </div>
              </template>
            </dropdown>
            
            
          </div>
          
        </div>
        
        
        
        <div class="uip-border-top uip-margin-top-xs uip-margin-bottom-xs"></div>
        
        <!--Per page -->
        <div class="uip-grid-col-1-3">
        
          <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.perPage}}</span></div>
            
          <div class="uip-position-relative uip-flex uip-gap-xs">
            <input type="number" min="1" class="uip-input uip-remove-steps uip-background-remove uip-padding-xxxs uip-flex-grow" style="width: 30px;" v-model="options.perPage">
            
            <div class="uip-padding-xxs uip-border-rounder uip-background-muted uip-flex uip-gap-xxs uip-no-text-select">
              <div class="uip-link-muted uip-icon uip-text-l" @click="options.perPage = parseInt(options.perPage) - 1">remove</div>
              <div class="uip-border-right"></div>
              <div class="uip-link-muted uip-icon uip-text-l" @click="options.perPage = parseInt(options.perPage) + 1">add</div>
            </div>
          </div>
          
        </div>
        
        
        
        
        
        <!--Offset -->
        <div class="uip-grid-col-1-3">
        
          <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.offset}}</span></div>
            
          <div class="uip-position-relative uip-flex uip-gap-xs">
            <input type="number" min="0" class="uip-input uip-remove-steps uip-background-remove uip-padding-xxxs uip-flex-grow" style="width: 30px;" v-model="options.offset">
            
            <div class="uip-padding-xxs uip-border-rounder uip-background-muted uip-flex uip-gap-xxs uip-no-text-select">
              <div class="uip-link-muted uip-icon uip-text-l" @click="options.offset = parseInt(options.offset) - 1">remove</div>
              <div class="uip-border-right"></div>
              <div class="uip-link-muted uip-icon uip-text-l" @click="options.offset = parseInt(options.offset) + 1">add</div>
            </div>
          </div>
          
        </div>
        
        <div class="uip-border-top uip-margin-top-xs uip-margin-bottom-xs"></div>
        
        
        <!--Meta query-->
        <div class="uip-grid-col-1-3">
        
          <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.metaQuery}}</span></div>
            
          <div v-if="options.metaQuery.length === 0" class="uip-position-relative">
            
            <button class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-w-100p" 
            @click="options.metaQuery.push(defaultMetaQuery())">add</button>
            
          </div>
          
          <template v-for="(meta, index) in options.metaQuery">
          
            <div v-if="index > 0"></div>
          
            <div class="uip-flex uip-gap-xs uip-row-gap-xs uip-flex-center">
            
              <dropdown pos="left center" triggerClass="uip-flex uip-flex-grow uip-w-100p" containerClass="uip-flex uip-flex-grow uip-w-100p">
                <template v-slot:trigger>
                  <div class="uip-background-muted uip-border-rounder uip-padding-xxs uip-padding-left-xs uip-flex uip-gap-xs uip-w-100p">
                    <div class="uip-flex uip-gap-xxs">
                      <span>{{meta.key}}</span>
                      <span v-if="meta.type && meta.key" class="uip-text-muted">|</span>
                      <span class="uip-text-muted">{{meta.type}}</span>
                    </div>
                  </div>
                </template>
                <template v-slot:content>
                
                
                  <div class="uip-flex uip-flex-column uip-gap-s uip-padding-s">
                  
                    <div class="uip-text-bold">
                      {{strings.metaQuery}}
                    </div>
                    
                    <div class="uip-border-bottom"></div>
                    
                    <div class="uip-flex uip-flex-column uip-row-gap-xs">
                    
                      <!--Meta key-->
                      <div class="uip-grid-col-1-3">
                        <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.metaKey}}</span></div>
                        <div class="uip-position-relative">
                          <input type="text" min="0" class="uip-input uip-remove-steps uip-background-remove uip-padding-xxxs uip-flex-grow" v-model="meta.key">
                        </div>
                      </div>
                      
                      <!--Meta value-->
                      <div class="uip-grid-col-1-3">
                        <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.metaValue}}</span></div>
                        <div class="uip-position-relative">
                          <input type="text" min="0" class="uip-input uip-remove-steps uip-background-remove uip-padding-xxxs uip-flex-grow" v-model="meta.value">
                        </div>
                      </div>
                      
                      <!--Compare-->
                      <div class="uip-grid-col-1-3">
                        <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.compare}}</span></div>
                        <div class="uip-position-relative">
                          <select class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p  uip-w-100p uip-border-rounder" style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large)" v-model="meta.compare">
                            <template v-for="item in comparisons">
                              <option :value="item.value">{{item.label}}</option>
                            </template>
                          </select>
                        </div>
                      </div>
                      
                      <!--Compare-->
                      <div class="uip-grid-col-1-3">
                        <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.type}}</span></div>
                        <div class="uip-position-relative">
                          <select class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p  uip-w-100p uip-border-rounder" style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large)" v-model="meta.type">
                            <template v-for="item in dataTypes">
                              <option :value="item.value">{{item.label}}</option>
                            </template>
                          </select>
                        </div>
                      </div>
                      
                    </div>
                  
                  </div>
                </template>
              </dropdown>
              
              <button class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted" @click="options.metaQuery.splice(index, 1)">close</button>
            
            </div>
          
          
          </template>
          
          
          <template v-if="options.metaQuery.length > 0">
          
            <div></div>
              
            <div class="uip-position-relative">
              
              <button class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-w-100p" 
              @click="options.metaQuery.push(defaultMetaQuery())">add</button>
              
            </div>
          
          </template>
          
        </div>
        
        
        
        
        <!--Relation -->
        <div class="uip-grid-col-1-3" v-if="options.metaQuery.length > 0">
        
          <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.relation}}</span></div>
            
          <div class="uip-position-relative">
            <toggle-switch :options="relationOptions" :activeValue="options.relation" :returnValue="function(data){ options.relation = data}"></toggle-switch>
          </div>
          
        </div>
        
        <div class="uip-border-top uip-margin-top-xs uip-margin-bottom-xs"></div>
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        <!--Tax query-->
        <template v-if="options.type == 'post'">
        
          <div class="uip-grid-col-1-3">
          
            <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.taxQuery}}</span></div>
              
            <div v-if="options.taxQuery.length === 0" class="uip-position-relative">
              
              <button class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-w-100p" 
              @click="options.taxQuery.push(defaultTaxQuery())">add</button>
              
            </div>
            
            <template v-for="(tax, index) in options.taxQuery">
            
              <div v-if="index > 0"></div>
            
              <div class="uip-flex uip-gap-xs uip-row-gap-xs uip-flex-center">
              
                <dropdown pos="left center" triggerClass="uip-flex uip-flex-grow uip-w-100p" containerClass="uip-flex uip-flex-grow uip-w-100p">
                  <template v-slot:trigger>
                    <div class="uip-background-muted uip-border-rounder uip-padding-xxs uip-padding-left-xs uip-flex uip-gap-xs uip-w-100p">
                      <div class="uip-flex uip-gap-xxs">
                        <span class="uip-text-muted">{{tax.taxonomy}}</span>
                        <span v-if="tax.taxonomy && tax.fieldType" class="uip-text-muted">|</span>
                        <span class="uip-text-muted">{{tax.fieldType}}</span>
                      </div>
                    </div>
                  </template>
                  <template v-slot:content>
                  
                    <div class="uip-flex uip-flex-column uip-gap-s uip-padding-s">
                    
                      <div class="uip-text-bold">
                        {{strings.taxQuery}}
                      </div>
                      
                      <div class="uip-border-bottom"></div>
                      
                      <div class="uip-flex uip-flex-column uip-row-gap-xs">
                      
                        <!--tax key-->
                        <div class="uip-grid-col-1-3">
                          <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.taxonomy}}</span></div>
                          <div class="uip-position-relative">
                          
                            <select class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p  uip-w-100p uip-border-rounder" style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large)" v-model="tax.taxonomy">
                              <template v-for="item in uipData.options.taxonomies">
                                <option :value="item.name">
                                  {{item.label}} 
                                  ({{returnTaxPostTypes(item.object_type)}})
                                </option>
                              </template>
                            </select>
                            
                          </div>
                         
                        </div>
                        
                        <!--tax value-->
                        <div class="uip-grid-col-1-3">
                          <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.taxValue}}</span></div>
                          <div class="uip-position-relative">
                            <input placeholder="term_1, term_2"
                            type="text" min="0" class="uip-input-small uip-w-100p" v-model="tax.value">
                          </div>
                        </div>
                        
                        
                        
                        
                        <!--Field type-->
                        <div class="uip-grid-col-1-3">
                          <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.field}}</span></div>
                          <div class="uip-position-relative">
                            <select class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p  uip-w-100p uip-border-rounder" style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large)" v-model="tax.fieldType">
                              <template v-for="item in fieldTypes">
                                <option :value="item.value">{{item.label}}</option>
                              </template>
                            </select>
                          </div>
                        </div>
                        
                        <!--Compare-->
                        <div class="uip-grid-col-1-3">
                          <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.compare}}</span></div>
                          <div class="uip-position-relative">
                            <select class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p  uip-w-100p uip-border-rounder" style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large)" v-model="tax.compare">
                              <template v-for="item in comparisons">
                                <option :value="item.value">{{item.label}}</option>
                              </template>
                            </select>
                          </div>
                        </div>
                        
                        <!--Include children-->
                        <div class="uip-grid-col-1-3">
                          <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.includeChildren}}</span></div>
                          <div class="uip-position-relative">
                            <switch-select :args="{asText: true}" :activeValue="tax.includeChildren" :returnValue="function(data){ tax.includeChildren = data}"/>
                          </div>
                        </div>
                        
                      </div>
                    
                    </div>
                    
                  </template>
                </dropdown>
                
                <button class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted" @click="options.taxQuery.splice(index, 1)">close</button>
              
              </div>
            
            
            </template>
            
            
            <template v-if="options.taxQuery.length > 0">
            
              <div></div>
                
              <div class="uip-position-relative">
                
                <button class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-w-100p" 
                @click="options.taxQuery.push(defaultTaxQuery())">add</button>
                
              </div>
            
            </template>
            
          </div>
          
          
          
          
          <!--Relation -->
          <div class="uip-grid-col-1-3" v-if="options.taxQuery.length > 0">
          
            <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.relation}}</span></div>
              
            <div class="uip-position-relative">
              <toggle-switch :options="relationOptions" :activeValue="options.taxRelation" :returnValue="function(data){ options.taxRelation = data}"></toggle-switch>
            </div>
            
          </div>
          
          <div class="uip-border-top uip-margin-top-xs uip-margin-bottom-xs"></div>
        
        
        
        
        </template>
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        <!--Has own content -->
        <div class="uip-grid-col-1-3">
        
          <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.usersOwnContent}}</span></div>
            
          <div class="uip-position-relative">
            <switch-select :args="{asText: true}" :activeValue="options.limitToAuthor" :returnValue="function(data){ options.limitToAuthor = data}"></switch-select>
          </div>
          
        </div>
        
        <!--Pagination -->
        <div class="uip-grid-col-1-3">
        
          <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.pagination}}</span></div>
            
          <div class="uip-position-relative">
            <toggle-switch :options="showPagination" :activeValue="options.showPagination" :returnValue="function(data){ options.showPagination = data}"></toggle-switch>
          </div>
          
        </div>
        
        <!--Search -->
        <div class="uip-grid-col-1-3">
        
          <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.search}}</span></div>
            
          <div class="uip-position-relative">
            <toggle-switch :options="showPagination" :activeValue="options.search" :returnValue="function(data){ options.search = data}"></toggle-switch>
          </div>
          
        </div>
        
        
        
        
        
      </div>`,
  };
}
