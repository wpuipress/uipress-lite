const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from "../../libs/vue-esm.js";
import { core as PostTypeSelect, preview as PostTypeSelectPreview } from "../components/post-type-select.min.js?ver=3.3.1";
import { core as StatusTypeSelect, preview as StatusTypeSelectPreview } from "../components/multiselect.min.js?ver=3.3.1";
import { core as UserRoleSelect, preview as UserRoleSelectPreview } from "../components/user-role-multiselect.min.js?ver=3.3.1";

import Comparisons from "../v3.5/lists/comparisons.min.js";
import DataTypes from "../v3.5/lists/query_data_types.min.js";
import FieldTypes from "../v3.5/lists/tax_field_types.min.js";
import OrderByOptions from "../v3.5/lists/query_orderby.min.js";
import OrderByOptionsUser from "../v3.5/lists/query_orderby_user.min.js";
import OrderByOptionsSites from "../v3.5/lists/query_orderby_sites.min.js";

const QueryBuilder = {
  components: {
    PostTypeSelectPreview: PostTypeSelectPreview,
    StatusTypeSelectPreview: StatusTypeSelectPreview,
    UserRoleSelectPreview: UserRoleSelectPreview,
  },
  props: {
    returnData: Function,
    value: Object,
    blockSettings: Object,
  },
  data() {
    return {
      open: false,
      options: {
        type: "post",
        postType: ["post"],
        order: "DESC",
        orderBy: "date",
        roles: [],
        orderBykEY: "",
        perPage: 20,
        status: ["publish"],
        relation: "AND",
        taxRelation: "AND",
        offset: "",
        taxQuery: [],
        metaQuery: [],
        limitToAuthor: false,
        showPagination: false,
        search: false,
      },
      strings: {
        type: __("Type", "uipress-lite"),
        postType: __("Post type", "uipress-lite"),
        orderBy: __("Order by", "uipress-lite"),
        perPage: __("Per page", "uipress-lite"),
        offset: __("Offset", "uipress-lite"),
        metaQuery: __("Meta query", "uipress-lite"),
        taxQuery: __("Tax query", "uipress-lite"),
        postTypes: __("Post types", "uipress-lite"),
        searchPostTypes: __("Search post types", "uipress-lite"),
        seacrhStatus: __("Search statuses", "uipress-lite"),
        metaKey: __("Meta key", "uipress-lite"),
        metaValue: __("Meta value", "uipress-lite"),
        terms: __("Terms", "uipress-lite"),
        compare: __("Compare", "uipress-lite"),
        order: __("Order", "uipress-lite"),
        metaKey: __("Meta key", "uipress-lite"),
        status: __("Status", "uipress-lite"),
        relation: __("Relation", "uipress-lite"),
        postStatus: __("Post statuses", "uipress-lite"),
        seacrhPostStatus: __("Search post statuses", "uipress-lite"),
        pagination: __("Pagination", "uipress-lite"),
        roles: __("Roles", "uipress-lite"),
        searchRoles: __("Search roles", "uipress-lite"),
        search: __("Search", "uipress-lite"),
        usersOwnContent: __("Own content", "uipress-lite"),
        taxonomy: __("Taxonomy", "uipress-lite"),
        field: __("Field", "uipress-lite"),
        taxValue: __("Tax value", "uipress-lite"),
        includeChildren: __("Include children", "uipress-lite"),
      },
      fieldTypes: FieldTypes,
      queryType: {
        post: {
          value: "post",
          label: __("Posts", "uipress-lite"),
        },
        user: {
          value: "user",
          label: __("Users", "uipress-lite"),
        },
      },
      relationOptions: {
        AND: {
          value: "AND",
          label: __("AND", "uipress-lite"),
        },
        OR: {
          value: "OR",
          label: __("OR", "uipress-lite"),
        },
      },
      comparisons: Comparisons,
      dataTypes: DataTypes,

      showPagination: {
        false: {
          value: false,
          label: __("Hide", "uipress-lite"),
        },
        true: {
          value: true,
          label: __("Show", "uipress-lite"),
        },
      },

      activeSection: "query",
      metaSections: {
        query: {
          value: "query",
          label: __("Query", "uipress-lite"),
        },
        meta: {
          value: "meta",
          label: __("Meta", "uipress-lite"),
        },
        tax: {
          value: "tax",
          label: __("Tax", "uipress-lite"),
        },
        settings: {
          value: "settings",
          label: __("Settings", "uipress-lite"),
        },
      },
      updating: false,
      orderByOptions: OrderByOptions,
      orderByOptionsUser: OrderByOptionsUser,
      orderByOptionsSites: OrderByOptionsSites,
    };
  },

  watch: {
    value: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.formatValue();
      },
      deep: true,
      immediate: true,
    },

    options: {
      handler(newValue, oldValue) {
        this.returnData(newValue);
      },
      deep: true,
    },
  },
  mounted() {
    this.maybePushSiteOption();
  },
  computed: {
    /**
     * Returns order options for query type
     *
     * @since 3.2.13
     */
    returnOrderOptions() {
      if (this.options.type == "post") {
        return this.orderByOptions;
      }
      if (this.options.type == "user") {
        return this.orderByOptionsUser;
      }
      if (this.options.type == "site") {
        return this.orderByOptionsSites;
      }
    },
    /**
     * Returns and filters the available sections depending on query type
     *
     * @since 3.2.12
     */
    returnMetaSections() {
      let temp = { ...this.metaSections };
      if (this.options.type != "post") {
        delete temp.tax;
        if (this.activeSection == "tax") this.activeSection = "query";
      }

      return temp;
    },
  },
  methods: {
    /**
     * Injects prop value
     *
     * @since 3.2.13
     */
    async formatValue() {
      this.updating = true;
      this.options = this.isObject(this.value) ? { ...this.options, ...this.value } : { ...this.options };

      await this.$nextTick();
      this.updating = false;
    },

    /**
     * Checks if we are on multisite. If so then push site option to the query
     *
     * @since 3.2.13
     */
    maybePushSiteOption() {
      if (!this.uipApp.data.options.multisite) return;
      this.queryType.site = {
        value: "site",
        label: __("Sites", "uipress-lite"),
      };
    },

    /**
     * Returns default meta query
     *
     * @since 3.2.13
     */
    defaultMetaQuery() {
      return structuredClone({
        key: "",
        value: "",
        compare: "=",
        type: "CHAR",
      });
    },

    /**
     * Returns default tax query
     *
     * @since 3.2.13
     */
    defaultTaxQuery() {
      return structuredClone({
        taxonomy: "",
        value: "",
        fieldType: "term_id",
        compare: "=",
        includeChildren: true,
      });
    },

    /**
     * Returns tax post types as string
     *
     * @param {Array} postTypes - array of post types for conversion
     * @since 3.2.13
     */
    returnTaxPostTypes(postTypes) {
      return postTypes.toString();
    },

    /**
     * Returns the meta editor screen
     *
     * @since 3.2.13
     */
    requestMetaScreen(meta) {
      const screen = {
        component: "MetaBuilder",
        value: meta,
        label: this.strings.metaQuery,
        returnData: (d) => {
          meta = d;
        },
      };

      this.$emit("request-screen", screen);
    },

    /**
     * Pushes new meta query and opens the meta editor
     *
     * @returns {Promise}
     * @since 3.2.13
     */
    async addNewMeta() {
      const newItem = this.defaultMetaQuery();
      this.options.metaQuery.push(newItem);

      // await next tick to ensure the item has been added
      await nextTick();
      const index = this.options.metaQuery.length - 1;
      let addedItem = this.options.metaQuery[index];
      this.requestMetaScreen(addedItem);
    },

    /**
     * Returns the tax editor screen
     *
     * @since 3.2.13
     */
    requestTaxScreen(tax) {
      const screen = {
        component: "TaxBuilder",
        value: tax,
        label: this.strings.taxQuery,
        returnData: (d) => {
          tax = d;
        },
      };

      this.$emit("request-screen", screen);
    },

    /**
     * Pushes new tax query and opens the meta editor
     *
     * @returns {Promise}
     * @since 3.2.13
     */
    async addNewTax() {
      const newItem = this.defaultTaxQuery();
      this.options.taxQuery.push(newItem);

      // await next tick to ensure the item has been added
      await nextTick();
      const index = this.options.taxQuery.length - 1;
      let addedItem = this.options.taxQuery[index];
      this.requestTaxScreen(addedItem);
    },

    /**
     * Returns the tax editor screen
     *
     * @since 3.2.13
     */
    requestOrderByScreen() {
      const screen = {
        component: "OrderByBuilder",
        value: this.options,
        label: this.strings.orderBy,
        returnData: (d) => {
          this.options = d;
        },
      };

      this.$emit("request-screen", screen);
    },

    /**
     * Returns the post type select screen
     *
     * @since 3.2.13
     */
    requestPostTypeScreen() {
      const screen = {
        component: "PostTypeSelect",
        label: this.strings.postTypes,
        attributes: {
          selected: this.options.postType,
          placeHolder: this.strings.postTypes,
          searchPlaceHolder: this.strings.searchPostTypes,
          updateSelected: (d) => {
            this.options.postType = d;
          },
        },
      };

      this.$emit("request-screen", screen);
    },

    /**
     * Returns the post status select screen
     *
     * @since 3.2.13
     */
    requestPostStatusScreen() {
      const screen = {
        component: "StatusTypeSelect",
        label: this.strings.postStatus,
        attributes: {
          selected: this.options.status,
          placeHolder: this.strings.postStatus,
          availableOptions: this.uipApp.data.options.post_statuses,
          searchPlaceHolder: this.strings.seacrhStatus,
          updateSelected: (d) => {
            this.options.status = d;
          },
        },
      };

      this.$emit("request-screen", screen);
    },

    /**
     * Returns the user role select screen
     *
     * @since 3.2.13
     */
    requestRoleSelectScreen() {
      const screen = {
        component: "UserRoleSelect",
        label: this.strings.roles,
        attributes: {
          type: "roles",
          selected: this.options.roles,
          placeHolder: this.strings.roles,
          searchPlaceHolder: this.strings.searchRoles,
          updateSelected: (d) => {
            this.options.roles = d;
          },
        },
      };

      this.$emit("request-screen", screen);
    },
  },
  template: `
  
      <div class="uip-flex uip-flex-column uip-row-gap-s">
      
        <toggle-switch :options="returnMetaSections" :activeValue="activeSection" :returnValue="(d)=>{ activeSection = d }"></toggle-switch>
      
        <div class="uip-flex uip-flex-column uip-row-gap-xs uip-padding-left-xs">
          
          <template v-if="activeSection=='query'">
          
            <!--Type -->
            <div class="uip-grid-col-1-3">
            
              <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.type}}</span></div>
                
              <toggle-switch :options="queryType" :activeValue="options.type" :returnValue="function(data){ options.type = data}"></toggle-switch>
              
            </div>
            
            
            
            
            <!--Post Type -->
            <div v-if="options.type == 'post'" class="uip-grid-col-1-3">
            
              <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.postType}}</span></div>
                
              <PostTypeSelectPreview @click="requestPostTypeScreen()"
              :selected="options.postType" :placeHolder="strings.postTypes"
              :searchPlaceHolder="strings.searchPostTypes" :updateSelected="(d)=>{options.postType = d}" />
              
            </div>
            
            
            <!--Role select -->
            <div v-if="options.type == 'user'" class="uip-grid-col-1-3">
            
              <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.roles}}</span></div>
                
              <UserRoleSelectPreview @click="requestRoleSelectScreen()" 
              type="roles" :selected="options.roles" :placeHolder="strings.roles"
              :searchPlaceHolder="strings.searchRoles" :updateSelected="(d)=>{options.roles = d}" />
              
            </div>
            
            
            <!--Status -->
            <div class="uip-grid-col-1-3" v-if="options.type == 'post'">
            
              <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.status}}</span></div>
              
              <StatusTypeSelectPreview
              @click="requestPostStatusScreen()"
              :availableOptions="uipApp.data.options.post_statuses" :selected="options.status" :placeHolder="strings.postStatus"
              :searchPlaceHolder="strings.seacrhStatus" :updateSelected="function(d){options.status = d}" />
              
            </div>
            
            
            <!--Order by-->
            <div class="uip-grid-col-1-3">
            
              <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.order}}</span></div>
                
              
              <div @click="requestOrderByScreen()" class="uip-background-muted uip-border-rounder uip-padding-xxs uip-padding-left-xs uip-flex uip-gap-xs uip-w-100p uip-pointer-cursor">
                <div class="uip-text-capitalize uip-flex uip-gap-xxs">
                  <span>{{options.orderBy}}</span>
                  <span class="uip-text-muted">|</span>
                  <span class="uip-text-muted">{{options.order}}</span>
                </div>
              </div>
              
            </div>
            
            
            <!--Per page -->
            <div class="uip-grid-col-1-3">
            
              <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.perPage}}</span></div>
                
              <div class="uip-position-relative uip-flex uip-gap-xs">
                <input type="number" min="1" class="uip-input uip-input-small uip-remove-steps uip-background-remove uip-padding-xxxs uip-flex-grow" style="width: 30px;" v-model="options.perPage">
                
                <div class="uip-padding-xxs uip-border-rounder uip-background-muted uip-flex uip-gap-xxs uip-no-text-select uip-flex-center">
                  <div class="uip-link-muted uip-icon" @click="options.perPage = parseInt(options.perPage) - 1">remove</div>
                  <div class="uip-border-right uip-h-12"></div>
                  <div class="uip-link-muted uip-icon" @click="options.perPage = parseInt(options.perPage) + 1">add</div>
                </div>
              </div>
              
            </div>
            
            
            
            
            
            <!--Offset -->
            <div class="uip-grid-col-1-3">
            
              <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.offset}}</span></div>
                
              <div class="uip-position-relative uip-flex uip-gap-xs">
                <input type="number" min="0" class="uip-input uip-input-small uip-remove-steps uip-background-remove uip-padding-xxxs uip-flex-grow" style="width: 30px;" v-model="options.offset">
                
                <div class="uip-padding-xxs uip-border-rounder uip-background-muted uip-flex uip-gap-xxs uip-no-text-select uip-flex-center">
                  <div class="uip-link-muted uip-icon" @click="options.offset = parseInt(options.offset) - 1">remove</div>
                  <div class="uip-border-right uip-h-12"></div>
                  <div class="uip-link-muted uip-icon" @click="options.offset = parseInt(options.offset) + 1">add</div>
                </div>
              </div>
              
            </div>
            
            
            
            
            
            
            
            
          </template>
          <!-- End query section-->
          
          
          
          
          <!-- Start meta section-->
          <template v-if="activeSection=='meta'">
          
            <!--Meta query-->
            <div class="uip-grid-col-1-3">
            
              <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-padding-top-xxxs uip-flex-start"><span>{{strings.metaQuery}}</span></div>
                
              <div class="uip-flex uip-flex-column uip-row-gap-xxs">
              
                <template v-for="(meta, index) in options.metaQuery">
                
                  <div class="uip-flex uip-gap-xs uip-row-gap-xs uip-flex-center">
                  
                    <div @click="requestMetaScreen(meta)" class="uip-background-muted uip-border-rounder uip-padding-xxxs uip-padding-left-xs uip-flex uip-flex-center uip-text-s uip-gap-xxs uip-w-100p uip-cursor-pointer">
                        
                        <span class="uip-text-muted uip-flex-grow">{{meta.type}}</span>
                        <span>{{meta.key}}</span>
                        <span v-if="meta.type && meta.key" class="uip-text-muted">|</span>
                        
                        <a @click.prevent.stop="options.metaQuery.splice(index, 1)"
                        class="uip-link-muted uip-icon uip-border-rounder uip-padding-xxs uip-link-muted" >
                          close
                        </a>
                        
                    </div>
                    
                  </div>
                  
                </template>
                
                <button class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-w-100p uip-text-s" 
                @click="addNewMeta()">add</button>
              
              </div>
              
              
            </div>
            
            <!--Relation -->
            <div class="uip-grid-col-1-3">
            
              <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.relation}}</span></div>
                
              <div class="uip-position-relative">
                <toggle-switch :options="relationOptions" :activeValue="options.relation" :returnValue="function(data){ options.relation = data}"></toggle-switch>
              </div>
              
            </div>
          
          </template>
          <!--End meta section-->
          
          
          
          
          
          
          
          
          
          <!-- Start tax section-->
          <template v-if="activeSection=='tax'">
          
            
            <div class="uip-grid-col-1-3">
            
              <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-padding-top-xxxs uip-flex-start"><span>{{strings.taxQuery}}</span></div>
                
              <div class="uip-flex uip-flex-column uip-row-gap-xxs">
              
                <template v-for="(tax, index) in options.taxQuery">
                
                  <div class="uip-flex uip-gap-xs uip-row-gap-xs uip-flex-center">
                  
                    <div @click="requestTaxScreen(tax)" class="uip-background-muted uip-border-rounder uip-padding-xxxs uip-padding-left-xs uip-flex uip-flex-center uip-text-s uip-gap-xxs uip-w-100p uip-cursor-pointer">
                        
                        <div class="uip-flex uip-flex-center uip-flex-grow uip-gap-xxs">
                          <span class="uip-text-muted">{{tax.fieldType}}</span>
                          <span v-if="tax.taxonomy && tax.fieldType" class="uip-text-muted">|</span>
                          <span class="uip-text-muted">{{tax.taxonomy}}</span>
                        </div>
                        
                        <a @click.prevent.stop="options.taxQuery.splice(index, 1)"
                        class="uip-link-muted uip-icon uip-border-rounder uip-padding-xxs uip-link-muted" >
                          close
                        </a>
                        
                    </div>
                    
                  </div>
                  
                </template>
                
                <button class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-w-100p uip-text-s" 
                @click="addNewTax()">add</button>
              
              </div>
              
              
            </div>
            
            
            <!--TAX Relation -->
            <div class="uip-grid-col-1-3">
            
              <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.relation}}</span></div>
                
              <div class="uip-position-relative">
                <toggle-switch :options="relationOptions" :activeValue="options.taxRelation" :returnValue="function(data){ options.taxRelation = data}"></toggle-switch>
              </div>
              
            </div>
          
          
          </template>
          <!--End tax section-->
          
          
          
          
          <!-- Start settings section-->
          <template v-if="activeSection=='settings'">
          
            <!--Has own content -->
            <div class="uip-grid-col-1-3">
            
              <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.usersOwnContent}}</span></div>
              <switch-select :args="{asText: true}" :activeValue="options.limitToAuthor" :returnValue="function(data){ options.limitToAuthor = data}"/>
              
            </div>
            
            <!--Pagination -->
            <div class="uip-grid-col-1-3">
            
              <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.pagination}}</span></div>
              <toggle-switch :options="showPagination" :activeValue="options.showPagination" :returnValue="function(data){ options.showPagination = data}"/>
              
            </div>
            
            <!--Search -->
            <div class="uip-grid-col-1-3">
            
              <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.search}}</span></div>
              <toggle-switch :options="showPagination" :activeValue="options.search" :returnValue="function(data){ options.search = data}"/>
              
            </div>
          
          
          </template>
          <!--End settings section-->
          
          
        </div>
      
      </div>`,
};

const OrderBy = {
  props: {
    returnData: Function,
    value: Object,
  },
  data() {
    return {
      strings: {
        order: __("Order", "uipress-lite"),
        orderBy: __("Order by", "uipress-lite"),
        metaKey: __("Meta key", "uipress-lite"),
      },
      options: {},
      orderByOptions: OrderByOptions,
      orderByOptionsUser: OrderByOptionsUser,
      orderByOptionsSites: OrderByOptionsSites,
    };
  },
  watch: {
    options: {
      handler() {
        this.returnData(this.options);
      },
      deep: true,
    },
  },
  computed: {
    /**
     * Returns dynamic list of order by options depending on type
     *
     * @since 3.2.13
     */
    returnOrderOptions() {
      if (this.options.type == "post") {
        return this.orderByOptions;
      }
      if (this.options.type == "user") {
        return this.orderByOptionsUser;
      }
      if (this.options.type == "site") {
        return this.orderByOptionsSites;
      }
    },
    /**
     * Returns order direction object
     *
     * @since 3.2.13
     */
    orderDirectionsOptions() {
      return {
        DESC: {
          value: "DESC",
          label: __("Descending", "uipress-lite"),
        },
        ASC: {
          value: "ASC",
          label: __("Ascending", "uipress-lite"),
        },
      };
    },
  },
  created() {
    this.options = this.value;
  },
  template: `
  
  
    <div class="uip-grid-col-1-3 uip-padding-left-xs">
    
     <!--ORDER-->
     <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.order}}</span></div>
     <div class="uip-position-relative">
       <toggle-switch :options="orderDirectionsOptions" :activeValue="options.order" :returnValue="function(data){ options.order = data}"></toggle-switch>
     </div>
     
     <!--Orderby-->
     <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.orderBy}}</span></div>
     <div class="uip-position-relative">
       <select class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p  uip-w-100p uip-border-rounder" style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large)" v-model="options.orderBy">
         <template v-for="item in returnOrderOptions">
           <option :value="item.value">{{item.label}}</option>
         </template>
       </select>
     </div>
     
     <!--Meta key-->
     <template v-if="options.orderBy == 'meta_value'" >
       <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.metaKey}}</span></div>
       <div class="uip-position-relative">
         <input type="text" min="0" class="uip-input uip-remove-steps uip-background-remove uip-padding-xxxs uip-flex-grow" v-model="options.orderBykEY">
       </div>
     </template>
      
    </div>
  
  
  `,
};

const TaxQuery = {
  props: {
    returnData: Function,
    value: Object,
  },
  data() {
    return {
      strings: {
        taxonomy: __("Taxonomy", "uipress-lite"),
        taxValue: __("Tax value", "uipress-lite"),
        field: __("Field", "uipress-lite"),
        compare: __("Compare", "uipress-lite"),
        includeChildren: __("Include children"),
      },
      tax: {},
      comparisons: Comparisons,
      dataTypes: DataTypes,
      fieldTypes: FieldTypes,
    };
  },
  watch: {
    tax: {
      handler() {
        this.returnData(this.tax);
      },
      deep: true,
    },
  },
  mounted() {
    this.tax = this.value;
  },
  methods: {
    /**
     * Returns post types as string
     *
     * @param {Array} postTypes - array of post types for conversion
     * @since 3.2.13
     */
    returnTaxPostTypes(postTypes) {
      return postTypes.toString();
    },
  },
  template: `
  
  
    <div class="uip-grid-col-1-3 uip-padding-left-xs">
    
     <!--tax key-->
     <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.taxonomy}}</span></div>
     <div class="uip-flex uip-flex-center">
     
       <select class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p  uip-w-100p uip-border-rounder" style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large)" v-model="tax.taxonomy">
         <template v-for="item in uipApp.data.options.taxonomies">
           <option :value="item.name">
             {{item.label}} 
             ({{returnTaxPostTypes(item.object_type)}})
           </option>
         </template>
       </select>
       
     </div>
     
     <!--tax value-->
     <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.taxValue}}</span></div>
     <div class="uip-flex uip-flex-center">
       <input placeholder="term_1, term_2"
       type="text" min="0" class="uip-input-small uip-w-100p" v-model="tax.value">
     </div>
     
     <!--Field type-->
     <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.field}}</span></div>
     <div class="uip-flex uip-flex-center">
       <select class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p  uip-w-100p uip-border-rounder" style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large)" v-model="tax.fieldType">
         <template v-for="item in fieldTypes">
           <option :value="item.value">{{item.label}}</option>
         </template>
       </select>
     </div>
     
     <!--Compare-->
     <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.compare}}</span></div>
     <div class="uip-flex uip-flex-center">
       <select class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p  uip-w-100p uip-border-rounder" style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large)" v-model="tax.compare">
         <template v-for="item in comparisons">
           <option :value="item.value">{{item.label}}</option>
         </template>
       </select>
     </div>
     
     <!--Include children-->
     <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.includeChildren}}</span></div>
     <div class="uip-flex uip-flex-center">
       <switch-select :args="{asText: true}" :activeValue="tax.includeChildren" :returnValue="(d)=>{ tax.includeChildren = d}"/>
     </div>
      
    </div>
  
  
  `,
};

const MetaQuery = {
  props: {
    returnData: Function,
    value: Object,
  },
  data() {
    return {
      strings: {
        metaKey: __("Meta key", "uipress-lite"),
        metaValue: __("Meta value", "uipress-lite"),
        compare: __("Compare", "uipress-lite"),
        type: __("Type", "uipress-lite"),
      },
      meta: {},
      comparisons: Comparisons,
      dataTypes: DataTypes,
    };
  },
  watch: {
    meta: {
      handler() {
        this.returnData(this.meta);
      },
      deep: true,
    },
  },
  mounted() {
    this.meta = this.value;
  },
  template: `
  
  
    <div class="uip-grid-col-1-3 uip-padding-left-xs">
    
      <!--Meta key-->
      <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.metaKey}}</span></div>
      <div class="uip-flex uip-flex-center">
        <input type="text" min="0" class="uip-input uip-remove-steps uip-background-remove uip-padding-xxxs uip-width-100p" v-model="meta.key">
      </div>
    
      <!--Meta value-->
      <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.metaValue}}</span></div>
      <div class="uip-flex uip-flex-center">
        <input type="text" min="0" class="uip-input uip-remove-steps uip-background-remove uip-padding-xxxs uip-width-100p" v-model="meta.value">
      </div>
      
      <!--Compare-->
      <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.compare}}</span></div>
      <div class="uip-flex uip-flex-center">
        <select class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p  uip-w-100p uip-border-rounder" style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large)" v-model="meta.compare">
          <template v-for="item in comparisons">
            <option :value="item.value">{{item.label}}</option>
          </template>
        </select>
      </div>
      
      <!--Compare-->
      <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.type}}</span></div>
      <div class="uip-flex uip-flex-center">
        <select class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p uip-w-100p uip-border-rounder" style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large)" v-model="meta.type">
          <template v-for="item in dataTypes">
            <option :value="item.value">{{item.label}}</option>
          </template>
        </select>
      </div>
      
    </div>
  
  
  `,
};

export default {
  components: {
    ScreenControl: defineAsyncComponent(() => import("../v3.5/utility/screen-control.min.js?ver=3.3.1")),
    PostTypeSelect: PostTypeSelect,
    QueryBuilder: QueryBuilder,
    MetaBuilder: MetaQuery,
    TaxBuilder: TaxQuery,
    OrderByBuilder: OrderBy,
    StatusTypeSelect: StatusTypeSelect,
    UserRoleSelect: UserRoleSelect,
  },
  props: {
    returnData: Function,
    value: Object,
    blockSettings: Object,
    block: Object,
  },
  data() {
    return {
      open: false,
      strings: {
        query: __("Query", "uipress-lite"),
        editQuery: __("Edit query", "uipress-lite"),
        add: __("Add", "uipress-lite"),
      },
      enabledDisabled: {
        false: {
          value: false,
          label: __("Disabled", "uipress-lite"),
        },
        true: {
          value: true,
          label: __("Enabled", "uipress-lite"),
        },
      },
    };
  },
  watch: {
    "block.query.enabled": {
      async handler() {
        if (this.block.query.enabled) {
          await nextTick();
          this.$refs.queryBuilder.show();
        }
      },
      deep: true,
    },
  },
  computed: {
    /**
     * Checks if query is enabled
     *
     * @since 3.2.13
     */
    returnQueryVal() {
      if (!("query" in this.block)) {
        this.block.query = {
          enabled: false,
          settings: {},
        };
      }

      return this.block.query.enabled;
    },

    /**
     * Returns the block fill screen
     *
     * @since 3.2.13
     */
    queryFillScreen() {
      return {
        component: "QueryBuilder",
        value: this.block.query.settings,
        label: this.strings.query,
        returnData: (d) => {
          this.block.query.settings = { ...d };
        },
      };
    },

    /**
     * Checks if block has active query
     *
     * @since 3.3.05
     */
    emptyBlockQuery() {
      return !this.returnBlockQueryType && !this.returnBlockQueryPerPage;
    },

    /**
     * Returns query type
     *
     * @since 3.3.05
     */
    returnBlockQueryType() {
      return this.hasNestedPath(this.block, ["query", "settings", "type"]) ? this.block.query.settings.type : false;
    },

    /**
     * Returns query per page
     *
     * @since 3.3.05
     */
    returnBlockQueryPerPage() {
      return this.hasNestedPath(this.block, ["query", "settings", "perPage"]) ? this.block.query.settings.perPage : false;
    },

    /**
     * Returns query preview text
     *
     * @since 3.3.05
     */
    returnQueryPreviewText() {
      if (this.emptyBlockQuery) return this.strings.add;
      return this.returnBlockQueryType + " | " + this.returnBlockQueryPerPage;
    },
  },
  template: `
  
  
    <div class="uip-grid-col-1-3">
    
      <!--Enabled / disabled -->
      <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-text-s"><span>{{strings.query}}</span></div>
      <toggle-switch :options="enabledDisabled" :activeValue="returnQueryVal" :returnValue="(d)=>{ block.query.enabled = d}"></toggle-switch>
      
      <!--Spacer-->
      <div></div>
      
      
      <dropdown v-if="returnQueryVal" pos="left center"
      ref="queryBuilder"
      :snapX="['#uip-block-settings']"
      class="uip-w-100p">
      
        <template #trigger>
          
          <div class="uip-background-muted uip-border-rounder uip-padding-xxs uip-flex uip-flex-center uip-gap-xs uip-cursor-pointer">
          
            <div class="uip-background-primary uip-text-inverse uip-border-round uip-padding-xxxs">
              <span class="uip-icon">all_inclusive</span>
            </div>
            
            
            <div class="uip-no-wrap uip-flex uip-gap-xxs uip-flex-grow uip-flex-center">
            
              <span class="uip-text-muted" key="add">{{returnQueryPreviewText}}</span>
              
            </div>
            
            <a @click.prevent.stop="block.query.settings = {}"
            class="uip-link-muted uip-padding-xxxs uip-border-rounder uip-text-s hover:uip-background-muted uip-icon">close</a>
            
          </div>
          
        </template>
        
        <template #content>
        
          <div class="uip-padding-s uip-w-260">
            
            <ScreenControl :startScreen="queryFillScreen" :homeScreen="queryFillScreen.component" :closer="$refs.queryBuilder.close" :showNavigation="true">
              
              <template #componenthandler="{ processScreen, currentScreen, goBack }">
                <KeepAlive>
                  <component @tab-change="(d)=>{fillTab = d}" @request-screen="(d)=>{processScreen(d)}" @go-back="goBack()"
                  :returnData="currentScreen.returnData"
                  :value="currentScreen.value"
                  :args="currentScreen.args"
                  v-bind="currentScreen.attributes"
                  :is="currentScreen.component"/>
                </KeepAlive>
              </template>
              
            </ScreenControl>
          
          </div>
          
        </template>
      
      
      </dropdown>
    </div>
  
  
  `,
};
