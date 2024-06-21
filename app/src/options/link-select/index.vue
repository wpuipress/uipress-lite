<script>
const { __ } = wp.i18n;
import AppInput from "@/components/text-input/index.vue";
import AppButton from "@/components/app-button/index.vue";
export default {
  components: { AppInput, AppButton },
  props: {
    returnData: Function,
    value: Object,
    args: Object,
  },
  data() {
    return {
      updating: false,
      open: false,
      link: this.returnDefault,
      hideLinkType: false,
      adminMenu: this.uipApp.data.adminMenu.menu,
      dynamics: this.uipApp.data.dynamicOptions,
      posts: [],
      searchString: "",
      fetchSearchString: "",
      serverActive: false,
      strings: {
        searchLinks: __("Search admin pages", "uipress-lite"),
        searchPages: __("Search pages and posts", "uipress-lite"),
        noneFound: __("No posts found for current query", "uipress-lite"),
        newTab: __("Link mode", "uipress-lite"),
        linkSelect: __("Link select", "uipress-lite"),
        currentValue: __("Current value", "uipress-lite"),
        select: __("select", "uipress-lite"),
      },
      linkTypes: {
        admin: {
          value: "admin",
          label: __("Admin", "uipress-lite"),
        },
        content: {
          value: "content",
          label: __("Content", "uipress-lite"),
        },
      },
      linkModes: {
        dynamic: {
          value: "dynamic",
          label: __("Dynamic", "uipress-lite"),
          placeHolder: __("Dynamic links will load in the available content frame without page refresh. If none exists then it will perform a normal relead."),
        },
        default: {
          value: "default",
          label: __("Default", "uipress-lite"),
          placeHolder: __("Default links load like a normal link and will refresh the whole page."),
        },
        newTab: {
          value: "newTab",
          label: __("New tab", "uipress-lite"),
          placeHolder: __("New tab links open in a new browser tab."),
        },
      },
      activeValue: "admin",
    };
  },

  watch: {
    /**
     * Watches for changes to border options and sends the data back
     *
     * @since 3.2.13
     */
    value: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.injectProp();
      },
      deep: true,
      immediate: true,
    },

    fetchSearchString: {
      handler(newValue, oldValue) {
        this.searchPosts();
      },
      deep: true,
    },
    link: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.returnData(newValue);
      },
      deep: true,
    },
  },
  mounted() {
    this.formatArgs();
  },
  computed: {
    /**
     * Returns posts parameter
     *
     * @returns {Array}
     * @since 3.2.13
     */
    getPosts() {
      return this.posts;
    },

    /**
     * Returns blank options object
     *
     * @returns {object}
     * @since 3.2.13
     */
    createOptionObject() {
      return {
        value: "",
        newTab: "dynamic",
        dynamic: false,
        dynamicKey: "",
      };
    },

    /**
     * Returns default option value
     *
     * @since 3.2.0
     */
    returnDefault() {
      return {
        value: "",
        newTab: "dynamic",
        dynamic: false,
        dynamicKey: "",
        dynamicType: "",
      };
    },
  },
  methods: {
    /**
     * Injects input value if object
     *
     * @since 3.2.13
     */
    async injectProp() {
      this.updating = true;
      this.link = this.isObject(this.value) ? { ...this.value } : this.returnDefault;

      await this.$nextTick();
      this.updating = false;
    },

    /**
     * Injects args if they are available
     *
     * @since 3.2.13
     */
    formatArgs() {
      if (!this.args) return;

      if (this.args.hideLinkType) {
        this.hideLinkType = this.args.hideLinkType;
      }

      //Only add this option if it was already as it uses the old dynamic system
      if (this.link.dynamic) {
        this.linkTypes.dynamic = {
          value: "dynamic",
          label: __("Dynamic", "uipress-lite"),
        };
      }
    },

    /**
     * Searches posts, pages and admin pages
     *
     * @returns {Promise}
     * @since 3.2.13
     */
    async searchPosts() {
      // Bail early if no search or search currently active
      if (!this.fetchSearchString || this.serverActive) return;

      this.serverActive = true;

      const str = this.fetchSearchString.toLowerCase();

      //Build form data for fetch request
      let formData = new FormData();
      formData.append("action", "uip_search_posts_pages");
      formData.append("security", uip_ajax.security);
      formData.append("searchStr", str);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      // Exit if error
      if (!response) return;

      this.posts = response.posts;
      this.serverActive = false;
    },

    /**
     * Choose given option
     *
     * @param {Object} option - the selected option
     * @since 3.2.13
     */
    chooseLink(option) {
      this.link.value = option;
      this.link.dynamic = false;
      this.link.dynamicKey = "";
      this.returnData(this.link);
    },

    /**
     * Checks if item is in the search
     *
     * @param {Object} menu - menu object
     * @since 3.2.13
     */
    inSearch(menu) {
      if (!this.searchString) return true;
      if (!menu[0]) return true;

      const lowStr = this.searchString.toLowerCase();
      const name = menu[0].toLowerCase();
      const id = menu[2].toLowerCase();

      if (name.includes(lowStr) || id.includes(lowStr)) return true;

      return false;
    },

    /**
     * Selects menu option and returns to caller
     *
     * @param {Object} item - the selected menu item
     * @since 3.2.13
     */
    chooseItem(item) {
      this.link.dynamic = true;
      this.link.dynamicKey = item.key;
      this.link.value = item.value;
      this.link.dynamicType = "link";
    },

    /**
     * Removes dynamic options and returns to caller
     *
     * @since 3.2.13
     */
    removeDynamicItem() {
      this.link.dynamic = false;
      this.link.dynamicKey = "";
      this.link.value = "";
      this.link.dynamicType = "";
    },
  },
};
</script>

<template>
  <div class="w-full flex flex-col gap-3">
    <div class="flex gap-2 items-center">
      <dropdown pos="left center" ref="linkselect" :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']">
        <template #trigger>
          <AppButton type="default"><AppIcon icon="link" /></AppButton>
        </template>

        <template #content>
          <div class="flex flex-col gap-4 p-4 w-[240px]">
            <div class="flex place-content-between items-center">
              <div class="text-zinc-900 font-semibold text-sm">{{ strings.linkSelect }}</div>
              <AppButton type="transparent" @click.prevent.stop="$refs.linkselect.close()"><AppIcon icon="close" /></AppButton>
            </div>

            <toggle-switch
              :options="linkTypes"
              :activeValue="activeValue"
              :returnValue="
                function (data) {
                  activeValue = data;
                }
              "
            ></toggle-switch>

            <template v-if="activeValue == 'admin'">
              <AppInput v-model="searchString" type="text" class="grow" :placeholder="strings.searchLinks" icon="search" />

              <div class="flex flex-col max-h-[200px]" style="overflow: auto">
                <template v-for="(menu, index) in adminMenu">
                  <div v-if="menu[0] != '' && inSearch(menu)" class="rounded-lg hover:bg-zinc-100 p-2 flex cursor-pointer w-full flex flex-col flex-nowrap" @click="chooseLink(menu[2])">
                    <div class="text-sm font-semibold" v-html="menu[0]"></div>
                    <div class="text-sm text-zinc-400 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">{{ menu[2] }}</div>
                  </div>

                  <template v-if="menu.submenu" v-for="sub in menu.submenu">
                    <div v-if="sub[0] != '' && inSearch(sub)" class="rounded-lg hover:bg-zinc-100 p-2 flex cursor-pointer w-full flex flex-col flex-nowrap" @click="chooseLink(sub[2])">
                      <div class="text-sm font-semibold" v-html="sub[0]"></div>
                      <div class="text-sm text-zinc-400 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">{{ sub[2] }}</div>
                    </div>
                  </template>
                </template>
              </div>
            </template>

            <template v-if="activeValue == 'content'">
              <AppInput v-model="fetchSearchString" type="text" class="grow" :placeholder="strings.searchPages" icon="search" />

              <div class="flex flex-col max-h-[200px]" style="overflow: auto">
                <template v-for="post in getPosts">
                  <div class="rounded-lg hover:bg-zinc-100 p-2 flex cursor-pointer" @click="chooseLink(post.link)">
                    <div class="">
                      <div class="text-sm font-semibold">{{ post.name }}</div>
                      <div class="text-sm text-zinc-400">{{ post.link }}</div>
                    </div>
                  </div>
                </template>
                <div v-if="posts.length < 1 && fetchSearchString != ''" class="text-zinc-400 text-sm p-2">{{ strings.noneFound }}</div>
              </div>
            </template>
          </div>
        </template>
      </dropdown>

      <AppInput v-model="link.value" type="text" class="grow" />
    </div>

    <div class="flex flex-col gap-3" v-if="!hideLinkType && link.value != ''">
      <toggle-switch
        :options="linkModes"
        :activeValue="link.newTab"
        :returnValue="
          function (data) {
            link.newTab = data;
          }
        "
      ></toggle-switch>
    </div>
  </div>
</template>
