const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent } from "../../libs/vue-esm.js";
export const core = {
  props: {
    selected: Array,
    placeHolder: String,
    searchPlaceHolder: String,
    single: Boolean,
    updateSelected: Function,
    type: String,
    roleOnly: Boolean,
  },
  data() {
    return {
      loading: false,
      thisSearchInput: "",
      options: [],
      roles: [],
      users: [],
      page: 1,
      totalUsers: 0,
      selectedOptions: [],
      activeTab: "roles",
      rendered: false,
      updating: false,
      switchOptions: {
        roles: {
          value: "roles",
          label: __("Roles", "uipress-lite"),
        },
        users: {
          value: "users",
          label: __("Users", "uipress-lite"),
        },
      },
      strings: {
        users: __("Users", "uipress-lite"),
        roles: __("Roles", "uipress-lite"),
        roleSelect: __("Role select", "uipress-lite"),
        search: __("Search", "uipress-lite"),
      },
      ui: {
        dropOpen: false,
      },
    };
  },

  watch: {
    selectedOptions: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.updateSelected(this.selectedOptions);
      },
      deep: true,
    },
    thisSearchInput: {
      handler() {
        this.queryUsersRoles();
      },
    },
    selected: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.injectValue();
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.queryUsersRoles();
  },
  computed: {
    /**
     * Returns all users
     *
     * @since 3.1.0
     */
    formattedUsers() {
      return this.users;
    },
    /**
     * Returns all roles
     *
     * @since 3.1.0
     */
    formattedRoles() {
      return this.roles;
    },
  },

  methods: {
    /**
     * Updates selected from value
     *
     * @since 3.2.13
     */
    async injectValue() {
      this.updating = true;

      this.selectedOptions = Array.isArray(this.selected) ? this.selected : [];

      await this.$nextTick();
      this.updating = false;
    },

    /**
     * Queries user roles and users
     *
     * @since 3.1.0
     */
    async queryUsersRoles() {
      let type = this.type;
      if (!type || typeof type === "undefined") {
        type = "all";
      }

      let formData = new FormData();
      formData.append("action", "uip_get_users_and_roles");
      formData.append("security", uip_ajax.security);
      formData.append("searchString", this.thisSearchInput);
      formData.append("type", type);
      formData.append("page", this.page);

      this.loading = true;

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);
      this.rendered = true;
      this.loading = false;

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.error, "error");
        return;
      }

      // Update roles
      if (Array.isArray(response.roles)) {
        this.roles = response.roles;
      }

      // Update users
      if (Array.isArray(response.users)) {
        this.users = response.users;
      }

      this.totalUsers = response.total_users;
    },

    /**
     * Adds an item to selected
     *
     * @param {Mixed} selectedoption
     * @since 3.1.0
     */
    addSelected(selectedoption) {
      //if selected then remove it
      if (this.ifSelected(selectedoption)) {
        this.removeSelected(selectedoption);
        return;
      }
      if (this.single == true) {
        this.selectedOptions[0] = selectedoption;
      } else {
        this.selectedOptions.push(selectedoption);
      }
    },
    /**
     * Removes a selected option
     *
     * @param {Mixed} option
     * @since 3.1.0
     */
    removeSelected(option) {
      let index = this.selectedOptions.findIndex((item) => {
        return item.name === option.name && item.type === option.type;
      });
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
    },
    /**
     * Removes item by index
     *
     * @param {Number} index
     * @since 3.1.0
     */
    removeByIndex(index) {
      this.selectedOptions.splice(index, 1);
    },

    /**
     * Checks if an item is selected or not
     *
     * @param {Mixed} option
     * @since 3.1.0
     */
    ifSelected(option) {
      let index = this.selectedOptions.findIndex((item) => {
        return item.name === option.name && item.type === option.type;
      });

      if (index > -1) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * Checks if item is valid for search
     *
     * @param {Mixed} option
     * @since 3.1.0
     */
    ifInSearch(option) {
      let item = option.name.toLowerCase();
      let string = this.thisSearchInput.toLowerCase();

      if (item.includes(string)) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * toggles pages back
     *
     * @since 3.1.0
     */
    pageBack() {
      if (this.page == 1) {
        return;
      }
      this.page -= 1;
      this.queryUsersRoles();
    },
    /**
     * Toggles page forwards
     *
     * @since 3.1.0
     */
    pageForward() {
      this.page += 1;
      this.queryUsersRoles();
    },
  },
  template: `
      
      
        <div class="uip-flex uip-flex-column uip-row-gap-s">
          
          <toggle-switch v-if="!roleOnly" :options="switchOptions" :activeValue="activeTab" :dontAccentActive="true" :returnValue="function(data){ activeTab = data}"></toggle-switch>
          
          <div class="uip-flex uip-background-muted uip-border-rounder uip-padding-xxs uip-flex-center">
            <span class="uip-icon uip-text-muted uip-margin-right-xs">search</span>
            <input class="uip-blank-input uip-flex-grow uip-text-s" type="search"  
            :placeholder="strings.search" v-model="thisSearchInput" autofocus>
          </div>
          
          
          <div v-if="loading" class="uip-padding-s uip-flex uip-flex-center uip-flex-middle uip-h-200">
            <loading-chart></loading-chart>
          </div>
          
          <div class="uip-max-h-200 uip-gap-xxxs uip-flex uip-flex-column" style="overflow:auto">
            
            <!--Roles-->
            <template v-if="!loading && activeTab == 'roles'" v-for="option in formattedRoles">
              <div class="uip-background-default uip-padding-xxs uip-border-rounder uip-flex uip-flex-center uip-gap-xs uip-link-muted hover:uip-background-muted" 
              @click="addSelected(option)" 
              :class="{'uip-text-emphasis' : ifSelected(option), 'uip-link-muted' : !ifSelected(option)}"
              v-if="ifInSearch(option)" 
              style="cursor: pointer">
                    
                    
                    <div class="uip-flex-grow uip-text-s uip-text-bold">{{option.label}}</div>
                    <input type="checkbox" :name="option.name" :value="option.name" class="uip-checkbox uip-margin-remove" 
                    :checked="ifSelected(option)">
                
              </div>
            </template>
            
            <!--Users-->
            <template v-if="!loading && activeTab == 'users'" v-for="option in formattedUsers">
              <div class="uip-background-default uip-padding-xxs uip-border-rounder uip-flex uip-flex-center uip-gap-xs uip-link-muted hover:uip-background-muted" 
              @click="addSelected(option)" 
              :class="{'uip-text-emphasis' : ifSelected(option), 'uip-link-muted' : !ifSelected(option)}"
              v-if="ifInSearch(option)" 
              style="cursor: pointer">
                    
                    
                    <div class="uip-flex-grow uip-text-s uip-text-bold">{{option.label}}</div>
                    <input type="checkbox" :name="option.name" :value="option.name" class="uip-checkbox uip-margin-remove" 
                    :checked="ifSelected(option)">
                
              </div>
            </template>
            
          </div>
          
          <div class="uip-flex uip-gap-xs" v-if="activeTab == 'users' && totalUsers > formattedUsers.length">
            <button class="uip-button-default uip-icon uip-nav-button uip-padding-xxs" :class="{'uip-disabled' : page == 1}" @click="pageBack()">chevron_left</button>
            <button class="uip-button-default uip-icon uip-nav-button uip-padding-xxs" @click="pageForward()">chevron_right</button>
          </div>
        
        </div>
      
    `,
};

export const preview = {
  components: {
    contextmenu: defineAsyncComponent(() => import("../v3.5/utility/contextmenu.min.js?ver=3.3.1")),
  },
  props: {
    selected: Array,
    placeHolder: String,
    searchPlaceHolder: String,
    single: Boolean,
    updateSelected: Function,
    type: String,
  },
  data() {
    return {
      hoverTimeout: null,
      selectedOptions: [],
      updating: false,
      strings: {
        users: __("Users", "uipress-lite"),
        roles: __("Roles", "uipress-lite"),
        roleSelect: __("Role select", "uipress-lite"),
        others: __("others", "uipress-lite"),
        other: __("other", "uipress-lite"),
      },
      ui: {
        dropOpen: false,
      },
    };
  },

  watch: {
    selectedOptions: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.updateSelected(this.selectedOptions);
        // Closes multi select contextmenu
        if (this.selectedOptions.length < 1) {
          if (!this.$refs.showList) return;
          this.$refs.showList.close();
        }
      },
      deep: true,
    },
    selected: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.injectValue();
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    /**
     * Returns the position of the multiselect to fix the contextmenu position
     *
     * @since 3.2.13
     */
    returnSelectPosition() {
      const rect = this.$refs.multiselect.getBoundingClientRect();
      return { clientX: rect.left, clientY: rect.bottom + 8 };
    },

    /**
     * Returns width of multiselect
     *
     * @since 3.2.13
     */
    returnDropWidth() {
      const rect = this.$refs.multiselect.getBoundingClientRect();
      return { width: rect.width + "px" };
    },
  },
  methods: {
    /**
     * Updates selected from value
     *
     * @since 3.2.13
     */
    async injectValue() {
      this.updating = true;
      this.selectedOptions = Array.isArray(this.selected) ? this.selected : [];
      await this.$nextTick();
      this.updating = false;
    },

    /**
     * Removes item by index
     *
     * @param {Number} index
     * @since 3.1.0
     */
    removeByIndex(index) {
      this.selectedOptions.splice(index, 1);
    },

    /**
     * Shows all selected items and clears any timeout to close
     *
     * @param {Object} evt - mouseenter event
     */
    showSelected(evt) {
      this.$refs.showList.show(evt, this.returnSelectPosition);
      clearTimeout(this.hoverTimeout);
    },

    /**
     * Starts a timeout to close after 1 second
     *
     * @since 3.1.0
     */
    dispatchClose() {
      const handleTimeout = () => {
        this.$refs.showList.close();
      };
      this.hoverTimeout = setTimeout(handleTimeout, 1000);
    },
  },
  template: `
    
        <div ref="multiselect"
        class="uip-padding-xxxs uip-background-muted uip-border-rounder uip-w-100p uip-max-w-400 uip-cursor-pointer uip-border-box uip-padding-right-xs"> 
        
          <div class="uip-flex uip-flex-center">
            
            <!-- Nothing selected -->
            <div v-if="selectedOptions.length < 1" class="uip-flex-grow uip-padding-xs uip-padding-top-xxxs uip-padding-bottom-xxxs uip-flex uip-gap-xxs uip-flex-center uip-link-default uip-text-s uip-border" style="border-color:transparent">
              <span class="uip-text-muted">{{placeHolder}}...</span>
            </div>
            
            <!-- One selected -->
            <div v-if="selectedOptions.length === 1" class="uip-padding-xs uip-padding-top-xxxs uip-padding-bottom-xxxs uip-background-highlight uip-border-rounder uip-border uip-flex uip-gap-xxs uip-flex-center uip-link-default uip-text-s">
              <span class="uip-text-emphasis">{{selectedOptions[0].name}}</span>
              <a @click.prevent.stop="removeByIndex(0)" class="uip-link-muted uip-no-underline uip-icon">close</a>
            </div>
            
            <!-- Multiple selected -->
            <div v-if="selectedOptions.length > 1" class="uip-padding-xs uip-padding-top-xxxs uip-padding-bottom-xxxs uip-background-highlight uip-border-rounder uip-border uip-flex uip-gap-xxs uip-flex-center uip-link-default uip-text-s" 
            @mouseenter="showSelected($event)"
            @mouseleave="dispatchClose()">
              <span class="uip-text-emphasis uip-max-w-60 uip-overflow-hidden uip-no-wrap uip-text-ellipsis">{{selectedOptions[0].name}}</span>
              <span class="uip-text-muted uip-text-s" v-if="selectedOptions.length < 3"> + {{ selectedOptions.length - 1 }} {{ strings.other }}</span>
              <span class="uip-text-muted uip-text-s" v-if="selectedOptions.length > 2"> + {{ selectedOptions.length - 1 }} {{ strings.others }}</span>
              <a @click.prevent.stop="selectedOptions.length = 0" class="uip-link-muted uip-no-underline uip-icon">close</a>
            </div>
            
            <div class="uip-flex-grow uip-flex uip-flex-right">
              <a class="uip-link-muted uip-no-underline uip-icon">expand_more</a>
            </div>
            
            
            
          </div>
          
          <component is="style">
            .selected-enter-active,
            .selected-leave-active {
              transition: all 0.3s ease;
            }
            .selected-enter-from,
            .selected-leave-to {
              opacity: 0;
              transform: translateX(-30px);
            }
          </component>
          
          
          <contextmenu ref="showList" :disableTeleport="true">
          
            <div class="uip-flex uip-gap-xxs uip-flex-wrap uip-padding-xs"
            :style="returnDropWidth"
            @mouseenter="showSelected($event)"
            @mouseleave="$refs.showList.close()">
              
              <TransitionGroup name="selected">
                <template v-for="(item, index) in selectedOptions" :key="item.name">
                  
                  <div class="uip-padding-xxs uip-padding-top-xxxs uip-padding-bottom-xxxs uip-background-muted uip-border-rounder uip-border uip-flex uip-gap-xxs uip-flex-center uip-link-default uip-text-xs">
                    <span class="uip-text-emphasis">{{item.name}}</span>
                    <a @click.prevent.stop="removeByIndex(index)" class="uip-link-muted uip-no-underline uip-icon">close</a>
                  </div>
                
                </template>
              </TransitionGroup>
            
            </div>
          
          </contextmenu>
          
        </div>
      
    `,
};

export default {
  components: {
    UserRoleSelect: core,
    UserRoleSelectPreview: preview,
  },
  props: {
    selected: Array,
    placeHolder: String,
    searchPlaceHolder: String,
    single: Boolean,
    updateSelected: Function,
    type: String,
    roleOnly: Boolean,
  },
  data() {
    return {
      strings: {
        roleSelect: __("Role select", "uipress-lite"),
      },
    };
  },

  template: `
  
    <dropdown pos="left center" class="uip-w-100p" ref="userDropdown"
    :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']">
    
      <template v-slot:trigger>
      
        <UserRoleSelectPreview :selected="selected" :placeHolder="placeHolder" :searchPlaceHolder="searchPlaceHolder" :single="single" :updateSelected="updateSelected" :type="type"/>
      
      </template>
      
      <template v-slot:content>
      
      
        <div class="uip-flex uip-flex-column uip-row-gap-s uip-padding-s uip-w-240">
        
          <div class="uip-flex uip-flex-between uip-flex-center">
            <div class="uip-text-emphasis uip-text-bold uip-text-s">{{strings.roleSelect}}</div>
            <div @click.prevent.stop="$refs.userDropdown.close()"
            class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
              <span class="uip-icon">close</span>
            </div>
          </div>
          
          <UserRoleSelect :roleOnly="roleOnly" :selected="selected" :placeHolder="placeHolder" :searchPlaceHolder="searchPlaceHolder" :single="single" :updateSelected="updateSelected" :type="type"/>
        
        </div>
      
      </template>
    
    </dropdown>
    `,
};
