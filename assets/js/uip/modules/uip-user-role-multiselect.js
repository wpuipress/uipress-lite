const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      //array of selected items
      selected: Array,
      //Placeholder
      placeHolder: String,
      //Search Placeholder
      searchPlaceHolder: String,
      //Whether it is single select or multi
      single: Boolean,
      //Function to return selected on change
      updateSelected: Function,
      type: String,
    },
    data: function () {
      return {
        loading: false,
        thisSearchInput: '',
        options: [],
        all_roles: [],
        paged_users: [],
        page: 1,
        totalUsers: 0,
        selectedOptions: this.selected,
        activeTab: 'roles',
        rendered: false,
        switchOptions: {
          roles: {
            value: 'roles',
            label: __('Roles', 'uipress-lite'),
          },
          users: {
            value: 'users',
            label: __('Users', 'uipress-lite'),
          },
        },
        strings: {
          users: __('Users', 'uipress-lite'),
          roles: __('Roles', 'uipress-lite'),
        },
        ui: {
          dropOpen: false,
        },
      };
    },
    inject: ['uipress'],
    computed: {
      formattedOptions() {
        return this.options;
      },
      formattedUsers() {
        return this.paged_users;
      },
      formattedRoles() {
        return this.all_roles;
      },
    },
    watch: {
      selectedOptions: {
        handler(newValue, oldValue) {
          return;
          this.updateSelected(this.selectedOptions);
        },
        deep: true,
      },
      thisSearchInput: function (newValue, oldValue) {
        self = this;

        self.queryUsersRoles(newValue);
      },
    },
    created: function () {
      if (!Array.isArray(this.selectedOptions)) {
        this.selectedOptions = [];
      }
    },
    methods: {
      maybeQueryUsersRoles() {
        if (!this.rendered) {
          this.queryUsersRoles('');
        }
      },
      queryUsersRoles(searchString) {
        let self = this;
        let type = this.type;
        if (!type || typeof type === 'undefined') {
          type = 'all';
        }

        let formData = new FormData();
        formData.append('action', 'uip_get_user_roles');
        formData.append('security', uip_ajax.security);
        formData.append('searchString', searchString);
        formData.append('type', type);
        formData.append('page', this.page);

        self.loading = true;

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          self.rendered = true;
          self.loading = false;
          if (response.error) {
            self.uipress.notify(response.error, 'error');
            return;
          }

          if (Array.isArray(response.roles)) {
            self.options = response.roles;
          }

          if (Array.isArray(response.all_roles)) {
            self.all_roles = response.all_roles;
          }

          if (Array.isArray(response.paged_users)) {
            self.paged_users = response.paged_users;
          }

          self.totalUsers = response.users_total;
        });
      },
      //////TITLE: ADDS A SELECTED OPTION//////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /////DESCRIPTION: ADDS A SELECTED OPTION FROM OPTIONS
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
      //////TITLE: REMOVES A SLECTED OPTION//////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /////DESCRIPTION: ADDS A SELECTED OPTION FROM OPTIONS
      removeSelected(option) {
        let index = this.selectedOptions.findIndex((item) => {
          return item.name === option.name && item.type === option.type;
        });
        if (index > -1) {
          this.selectedOptions.splice(index, 1);
        }
      },
      removeByIndex(index) {
        this.selectedOptions.splice(index, 1);
      },
      //////TITLE:  CHECKS IF SELECTED OR NOT//////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /////DESCRIPTION: ADDS A SELECTED OPTION FROM OPTIONS
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
      //////TITLE:  CHECKS IF IN SEARCH//////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /////DESCRIPTION: CHECKS IF ITEM CONTAINS STRING
      ifInSearch(option, searchString) {
        let item = option.name.toLowerCase();
        let string = searchString.toLowerCase();

        if (item.includes(string)) {
          return true;
        } else {
          return false;
        }
      },
      onClickOutside(event) {
        const path = event.path || (event.composedPath ? event.composedPath() : undefined);
        // check if the MouseClick occurs inside the component
        if (path && !path.includes(this.$el) && !this.$el.contains(event.target)) {
          this.closeThisComponent(); // whatever method which close your component
        }
      },
      openThisComponent() {
        this.ui.dropOpen = true; // whatever codes which open your component
        // You can also use Vue.$nextTick or setTimeout
        requestAnimationFrame(() => {
          document.documentElement.addEventListener('click', this.onClickOutside, false);
        });
      },
      closeThisComponent() {
        this.ui.dropOpen = false; // whatever codes which close your component
        document.documentElement.removeEventListener('click', this.onClickOutside, false);
      },
      pageDown() {
        if (this.page == 1) {
          return;
        }
        this.page -= 1;
        this.queryUsersRoles(this.thisSearchInput);
      },
      pageUp() {
        this.page += 1;
        this.queryUsersRoles(this.thisSearchInput);
      },
    },
    template: `
    
    <dropdown pos="left center" class="uip-w-100p" triggerClass="uip-w-100p">
    
      <template v-slot:trigger>
      
        <div class="uip-padding-xxs uip-background-muted uip-border-rounder uip-w-100p uip-max-w-400 uip-cursor-pointer uip-border-box" :class="{'uip-active-outline' : ui.dropOpen}"> 
          <div class="uip-flex uip-flex-center">
          <div class="uip-flex-grow uip-margin-right-s" v-if="selectedOptions.length < 1">
            <div>
            <span class="uip-text-muted">{{placeHolder}}...</span>
            </div>
          </div>
          <div v-else class="uip-flex-grow uip-flex uip-flex-row uip-row-gap-xxs uip-gap-xxs uip-margin-right-s uip-flex-wrap">
            <template v-for="(item, index) in selectedOptions">
              <div class=" uip-padding-left-xxs uip-padding-right-xxs uip-background-highlight uip-border-rounder uip-border uip-flex uip-gap-xxs uip-flex-center uip-shadow-small">
                <span class="uip-text-s">{{item.name}}</span>
                <a @click="removeByIndex(index)" class="uip-link-muted uip-no-underline uip-icon">close</a>
              </div>
            </template>
          </div>
          <span class="uip-icon uip-text-muted">add</span>
          </div>
        </div>
      
      </template>
      
      <template v-slot:content>
      
        {{maybeQueryUsersRoles('')}}
      
        <div class="uip-flex uip-flex-column uip-row-gap-s uip-padding-xs">
          
          <toggle-switch :options="switchOptions" :activeValue="activeTab" :dontAccentActive="true" :returnValue="function(data){ activeTab = data}"></toggle-switch>
          
          <div class="uip-flex uip-background-default uip-flex-center uip-w-200">
            <span class="uip-icon uip-text-muted uip-margin-right-xs">search</span>
            <input class="uip-blank-input uip-flex-grow uip-text-s" type="search"  
            :placeholder="searchPlaceHolder" v-model="thisSearchInput" autofocus>
          </div>
          
          
          <div v-if="loading" class="uip-padding-s uip-flex uip-flex-center uip-flex-middle">
            <loading-chart></loading-chart>
          </div>
          
          <div class="uip-max-h-280 uip-overflow-auto" v-if="formattedOptions.length > 0">
            
            <!--Roles-->
            <template v-if="!loading && activeTab == 'roles'" v-for="option in formattedRoles">
              <div class="uip-background-default uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-flex uip-flex-center uip-gap-xs uip-link-muted" 
              @click="addSelected(option)" 
              v-if="ifInSearch(option, thisSearchInput) && !ifSelected(option)" 
              style="cursor: pointer">
              
                    <div class="uip-flex-grow uip-text-s uip-text-bold">{{option.label}}</div>
                    <div class="uip-icon">add</div>
                
              </div>
            </template>
            
            <!--Users-->
            <template v-if="!loading && activeTab == 'users'" v-for="option in formattedUsers">
              <div class="uip-background-default uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-flex uip-flex-center uip-gap-xs uip-link-muted" 
              @click="addSelected(option)" 
              v-if="ifInSearch(option, thisSearchInput) && !ifSelected(option)" 
              style="cursor: pointer">
              
                    <div class="uip-flex-grow uip-text-s uip-text-bold">{{option.label}}</div>
                    <div class="uip-icon">add</div>
                
              </div>
            </template>
            
          </div>
          
          <div class="uip-flex uip-gap-xs" v-if="activeTab == 'users' && totalUsers > formattedUsers.length">
            <button class="uip-button-default uip-icon uip-nav-button uip-padding-xxs" :class="{'uip-disabled' : page == 1}" @click="pageDown()">chevron_left</button>
            <button class="uip-button-default uip-icon uip-nav-button uip-padding-xxs" @click="pageUp()">chevron_right</button>
          </div>
        
        </div>
      
      </template>
    
    </dropdown>
    `,
  };
}
