<script>
import { __ } from '@wordpress/i18n';
import { defineAsyncComponent } from "vue";
export default {
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
};
</script>

<template>
  <div class="uip-flex uip-flex-column uip-row-gap-s">
    <toggle-switch
      v-if="!roleOnly"
      :options="switchOptions"
      :activeValue="activeTab"
      :dontAccentActive="true"
      :returnValue="
        function (data) {
          activeTab = data;
        }
      "
    ></toggle-switch>

    <div class="uip-flex uip-background-muted uip-border-rounder uip-padding-xxs uip-flex-center">
      <span class="uip-icon uip-text-muted uip-margin-right-xs">search</span>
      <input class="uip-blank-input uip-flex-grow uip-text-s" type="search" :placeholder="strings.search" v-model="thisSearchInput" autofocus />
    </div>

    <div v-if="loading" class="uip-padding-s uip-flex uip-flex-center uip-flex-middle uip-h-200">
      <loading-chart></loading-chart>
    </div>

    <div class="uip-max-h-200 uip-gap-xxxs uip-flex uip-flex-column" style="overflow: auto">
      <!--Roles-->
      <template v-if="!loading && activeTab == 'roles'" v-for="option in formattedRoles">
        <div
          class="uip-background-default uip-padding-xxs uip-border-rounder uip-flex uip-flex-center uip-gap-xs uip-link-muted hover:uip-background-muted"
          @click="addSelected(option)"
          :class="{ 'uip-text-emphasis': ifSelected(option), 'uip-link-muted': !ifSelected(option) }"
          v-if="ifInSearch(option)"
          style="cursor: pointer"
        >
          <div class="uip-flex-grow uip-text-s uip-text-bold">{{ option.label }}</div>
          <input type="checkbox" :name="option.name" :value="option.name" class="uip-checkbox uip-margin-remove" :checked="ifSelected(option)" />
        </div>
      </template>

      <!--Users-->
      <template v-if="!loading && activeTab == 'users'" v-for="option in formattedUsers">
        <div
          class="uip-background-default uip-padding-xxs uip-border-rounder uip-flex uip-flex-center uip-gap-xs uip-link-muted hover:uip-background-muted"
          @click="addSelected(option)"
          :class="{ 'uip-text-emphasis': ifSelected(option), 'uip-link-muted': !ifSelected(option) }"
          v-if="ifInSearch(option)"
          style="cursor: pointer"
        >
          <div class="uip-flex-grow uip-text-s uip-text-bold">{{ option.label }}</div>
          <input type="checkbox" :name="option.name" :value="option.name" class="uip-checkbox uip-margin-remove" :checked="ifSelected(option)" />
        </div>
      </template>
    </div>

    <div class="uip-flex uip-gap-xs" v-if="activeTab == 'users' && totalUsers > formattedUsers.length">
      <button class="uip-button-default uip-icon uip-nav-button uip-padding-xxs" :class="{ 'uip-disabled': page == 1 }" @click="pageBack()">chevron_left</button>
      <button class="uip-button-default uip-icon uip-nav-button uip-padding-xxs" @click="pageForward()">chevron_right</button>
    </div>
  </div>
</template>
