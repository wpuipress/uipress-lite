export default {
  props: {
    selected: Array,
    searchPlaceHolder: String,
    updateSelected: Function,
    returnType: String,
  },
  data() {
    return {
      loading: false,
      searchString: "",
      options: [],
      selectedOptions: this.selected,
      ui: {
        dropOpen: false,
      },
      strings: {
        userSearch: __("User search", "uipress-lite"),
      },
    };
  },

  computed: {
    /**
     * Returns options array
     *
     * @since 3.2.13
     */
    formattedOptions() {
      return this.options;
    },
  },
  watch: {
    searchString: {
      handler(newValue, oldValue) {
        this.searchRolesAndUsers();
      },
    },
  },
  methods: {
    /**
     * Searches roles and users
     *
     * @returns {Promise}
     * @since 3.2.13
     */
    async searchRolesAndUsers() {
      // Empty search value so exit
      if (!this.searchString) return;

      this.loading = true;

      let formData = new FormData();
      formData.append("action", "uip_get_users_and_roles");
      formData.append("security", uip_ajax.security);
      formData.append("searchString", this.searchString);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);
      this.loading = false;

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.error, "error");
        return;
      }

      // Update options

      this.options = this.returnType == "userrole" ? response.roles : response.users;
    },

    /**
     * Adds the selected option value depending on type
     *
     * @param {Object} selectedoption - the item selected
     * @since 3.2.13
     */
    addSelected(selectedoption) {
      switch (this.returnType) {
        case "userrole":
          this.updateSelected(selectedoption.label);
          break;

        case "userlogin":
          this.updateSelected(selectedoption.login);
          break;

        case "userid":
          this.updateSelected(selectedoption.id);
          break;

        case "useremail":
          this.updateSelected(selectedoption.email);
          break;
      }

      // Close select
      this.$refs.userDropdown.close();
    },
  },
  template: `
    
    <dropdown pos="left center" :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']" ref="userDropdown">
    
      <template v-slot:trigger>
        <button class="uip-button-default uip-border-rounder uip-icon uip-padding-xxs uip-link-muted">search</button>
      </template>
      
      <template v-slot:content>
        
        <div class="uip-flex uip-flex-column uip-row-gap-s uip-padding-s uip-w-240">
        
          <div class="uip-flex uip-flex-between uip-flex-center">
            <div class="uip-text-emphasis uip-text-bold uip-text-s">{{strings.userSearch}}</div>
            <div @click.prevent.stop="$refs.userDropdown.close()"
            class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
              <span class="uip-icon">close</span>
            </div>
          </div>
          
          <div class="uip-flex uip-background-muted uip-border-rounder uip-padding-xxs uip-flex-center">
           <span class="uip-icon uip-text-muted uip-margin-right-xs">search</span>
           <input class="uip-blank-input uip-flex-grow uip-text-s" type="search"  
           :placeholder="searchPlaceHolder" v-model="searchString" autofocus>
          </div>
          
          <div class="uip-max-h-280" v-if="formattedOptions.length > 0 || loading" style="overflow:auto">
          
            <div v-if="loading" class="uip-padding-s uip-flex uip-flex-center uip-flex-middle"><loading-chart></loading-chart></div>
            
            <template v-if="!loading" v-for="option in formattedOptions">
            
              <div class="uip-background-default uip-padding-xxs uip-border-rounder uip-link-default hover:uip-background-muted" 
              @click="addSelected(option)" 
              style="cursor: pointer">
              
                <div class="uip-flex uip-gap-xxs uip-flex-center">
                    <div class="uip-text-bold uip-text-emphasis">{{option.label}}</div>
                    <div class="uip-text-muted">{{option.type}}</div>
                </div>
              
              </div>
              
            </template>
            
          </div>
          
        </div>
        
      </template>
    </dropdown>
    `,
};
