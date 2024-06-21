<script>
/**
 * Builds the main ui builder shell
 * @since 3.0.0
 */
const { __ } = wp.i18n;
import { deleteRemotePost } from "@/utility/functions.js";
import { nextTick } from "vue";
import AppButton from "@/components/app-button/index.vue";

import screenOverlay from "./screenOverlay.vue";
import Confirm from "@/components/confirm/index.vue";

export default {
  inject: ["uiTemplate"],
  components: { screenOverlay, Confirm, AppButton },
  data() {
    return {
      loading: true,
      themes: [],
      search: "",
      activeTemplate: false,
      imageIndex: 0,
      imageHover: false,
      draggingBlock: false,
      activeCategory: false,
      strings: {
        missingMessage: __("This block no longer exists", "uipress-lite"),
        templateLibrary: __("Template library", "uipress-lite"),
        pro: __("Pro", "uipress-lite"),
        searchTemplates: __("Search templates", "uipress-lite"),
        backToAllThemes: __("Back to all templates", "uipress-lite"),
        includesProBlocks: __("Includes pro blocks", "uipress-lite"),
        createdBy: __("Created by", "uipress-lite"),
        addToTemplate: __("Add to template", "uipress-lite"),
        replaceContent: __("Replace current layout", "uipress-lite"),
        addAtEndOfContent: __("Add to end of layout", "uipress-lite"),
        requires: __("Requires uipress", "uipress-lite"),
        downloadcount: __("How many times this template has been downloaded", "uipress-lite"),
        sortBy: __("Sort by", "uipress-lite"),
        include: __("Include", "uipress-lite"),
        uiTemplates: __("UI templates", "uipress-lite"),
        pages: __("Pages", "uipress-lite"),
        sections: __("Sections", "uipress-lite"),
        patterns: __("Patterns", "uipress-lite"),
        patternTitle: __("Name", "uipress-lite"),
        patternType: __("Type", "uipress-lite"),
        savePattern: __("Save pattern", "uipress-lite"),
        description: __("Description", "uipress-lite"),
        patternIcon: __("Icon", "uipress-lite"),
        allTemplates: __("All templates", "uipress-lite"),
      },
      patternTypes: {
        layout: { name: "layout", label: __("Layout", "uipress-lite") },
        block: { name: "block", label: __("Block", "uipress-lite") },
      },
      sortby: "newest",
      typeOptions: {
        uiTemplates: {
          label: __("UI templates", "uipress-lite"),
          value: "ui-template",
          selected: true,
        },
        adminPages: {
          label: __("Admin pages", "uipress-lite"),
          value: "ui-admin-page",
          selected: true,
        },
      },
      categories: [
        {
          label: __("UI templates", "uipress-lite"),
          type: "Layout",
          icon: "space_dashboard",
          color: "bg-indigo-600",
        },
        {
          label: __("Pages", "uipress-lite"),
          type: "Admin Page",
          icon: "article",
          color: "bg-purple-600",
        },
        {
          label: __("Sections", "uipress-lite"),
          type: "Section",
          icon: "calendar_view_day",
          color: "bg-sky-600",
        },
      ],
    };
  },
  watch: {
    sortby: {
      handler(newValue, oldValue) {
        this.fetchThemes();
      },
    },
    typeOptions: {
      handler(newValue, oldValue) {
        this.fetchThemes();
      },
      deep: true,
    },
  },
  mounted() {
    this.fetchThemes();
  },
  computed: {
    /**
     * Returns an array of themes filtered by type "Layout".
     *
     * @returns {Array} - Array of themes of type "Layout".
     * @since 3.2.13
     */
    returnActiveCategoryItems() {
      return this.themes.filter((obj) => obj.type === this.activeCategory.type);
    },

    /**
     * Returns the current sorting criteria.
     *
     * @returns {string} - The current sorting criteria.
     * @since 3.2.13
     */
    returnSortBy() {
      return this.sortby;
    },

    /**
     * Constructs and returns the filter string based on selected type options.
     *
     * @returns {string} - The filter string based on selected type options.
     * @since 3.2.13
     */
    returnFilter() {
      let filter = Object.values(this.typeOptions)
        .filter((option) => option.selected)
        .map((option) => option.value)
        .join("||");

      if (!filter) {
        this.typeOptions.uiTemplates.selected = true;
      }
      return filter;
    },
  },
  methods: {
    /**
     * Fetch available themes from the API.
     *
     * @since 3.2.13
     */
    fetchThemes() {
      this.loading = true;
      const formData = new FormData();
      const URL = `https://api.uipress.co/templates/list/?sort=${this.returnSortBy}&filter=${this.returnFilter}&v321=true`;

      this.sendServerRequest(URL, formData).then((response) => {
        this.loading = false;
        if (response.error) {
          this.uipApp.notifications.notify(response.message, "uipress-lite", "", "error", true);
        } else {
          this.themes = response;
        }
      });
    },

    /**
     * Navigate forward through theme images.
     *
     * @param {Object} theme - The theme object.
     * @since 3.2.13
     */
    navImagesForward(theme) {
      theme.imageIndex = (theme.imageIndex + 1) % theme.images.length;
    },

    /**
     * Navigate backward through theme images.
     *
     * @param {Object} theme - The theme object.
     * @since 3.2.13
     */
    navImagesBackward(theme) {
      theme.imageIndex = (theme.imageIndex - 1 + theme.images.length) % theme.images.length;
    },

    /**
     * Returns the current theme image index, initializing it if not set.
     *
     * @param {Object} theme - The theme object.
     * @returns {number} - Current theme image index.
     * @since 3.2.13
     */
    returnThemeIndex(theme) {
      if (!("imageIndex" in theme)) theme.imageIndex = 0;
      return theme.imageIndex;
    },

    /**
     * Prepare a template for cloning by generating the relevant URL.
     *
     * @param {Object} template - The template to be cloned.
     * @returns {Object} - An object containing the remote status and path.
     * @since 3.2.13
     */
    clone(template) {
      const URL = `https://api.uipress.co/templates/get/?templateid=${template.ID}`;
      return { remote: true, path: URL };
    },

    /**
     * Import a specified template.
     *
     * @param {Object} template - The template to import.
     * @param {boolean} replaceContent - Whether to replace the current content or append to it.
     * @since 3.2.13
     */
    importThis(template, replaceContent) {
      const URL = `https://api.uipress.co/templates/get/?templateid=${template.ID}`;
      const item = { remote: true, path: URL };

      if (replaceContent) {
        this.uiTemplate.content = [item];
      } else {
        this.uiTemplate.content.push(item);
      }
    },
    /**
     * Imports the given pattern into the UI template content.
     *
     * @param {Object} template - The template pattern to import.
     * @since 3.2.13
     */
    importThisPattern(template) {
      this.uiTemplate.content.push(this.clonePattern(template));
    },

    /**
     * Returns an appropriate icon based on the pattern's properties.
     *
     * @param {Object} pattern - The pattern for which to return the icon.
     * @returns {string} - The name of the icon.
     * @since 3.2.13
     */
    returnIcon(pattern) {
      if (pattern.icon && pattern.icon !== "") {
        return pattern.icon;
      }
      if (pattern.type === "layout") {
        return "account_tree";
      } else if (pattern.type === "block") {
        return "add_box";
      }
      return "interests";
    },

    /**
     * Deletes an item based on its post ID and refreshes the patterns.
     *
     * @param {number|string} postID - The ID of the post to be deleted.
     * @since 3.2.13
     */
    async deleteThisItem(postID) {
      const confirm = await this.$refs.confirm.show({
        title: __("Delete pattern", "uipress-lite"),
        message: __("Are you sure you want to delete this custom pattern?", "uipress-lite"),
        okButton: __("Delete pattern", "uipress-lite"),
      });

      if (!confirm) return;

      await deleteRemotePost(postID);
      this.uipApp.notifications.notify(__("Pattern deleted", "uipress-lite"), "", "success", true);
      this.getPatterns();
    },
    /**
     * Fetches available UI patterns.
     *
     * @since 3.2.13
     */
    getPatterns() {
      const formData = new FormData();
      formData.append("action", "uip_get_ui_patterns_list");
      formData.append("security", uip_ajax.security);

      this.sendServerRequest(uip_ajax.ajax_url, formData).then((response) => {
        if (response.error) {
          this.uipApp.notifications.notify(response.message, "uipress-lite", "", "error", true);
        }
        if (response.success) {
          this.uiTemplate.patterns = response.patterns;
        }
      });
    },

    /**
     * Clones a given block pattern, ensuring unique UIDs.
     *
     * @param {Object} block - The block pattern to clone.
     * @returns {Object} - The cloned block pattern.
     * @since 3.2.13
     */
    clonePattern(block) {
      const itemFreshIDs = this.duplicateBlock(block.template);
      return JSON.parse(JSON.stringify(itemFreshIDs));
    },

    /**
     * Duplicates a block, generating new UIDs for it and its children.
     *
     * @param {Object} block - The block to duplicate.
     * @returns {Object} - The duplicated block with new UIDs.
     * @since 3.2.13
     */
    duplicateBlock(block) {
      const item = { ...block };
      item.uid = this.createUID();
      item.options = [];
      item.settings = JSON.parse(JSON.stringify(item.settings));

      if (item.content) {
        item.content = this.duplicateChildren(item.content);
      }

      return item;
    },

    /**
     * Duplicates the children blocks, generating new UIDs for them.
     *
     * @param {Array} content - The children blocks to duplicate.
     * @returns {Array} - The duplicated children blocks with new UIDs.
     * @since 3.2.13
     */
    duplicateChildren(content) {
      return content.map((block) => {
        const item = { ...block };
        item.uid = this.createUID();
        item.settings = JSON.parse(JSON.stringify(item.settings));

        if (item.content) {
          item.content = this.duplicateChildren(item.content);
        }

        return item;
      });
    },
  },
};
</script>

<template>
  <div class="max-h-full">
    <div class="flex flex-col gap-3">
      <!-- Loop categories -->
      <template v-for="category in categories" v-if="!activeCategory">
        <div class="flex flex-row gap-2 items-center p-1 cursor-pointer hover:bg-zinc-100 rounded-lg uip-block-drag text-zinc-400 hover:text-zinc-900" @click="activeCategory = category">
          <div class="p-1 rounded-lg" :class="category.color">
            <AppIcon :icon="category.icon" class="text-white" />
          </div>
          <div class="select-none grow">{{ category.label }}</div>
          <AppIcon icon="chevron_right" />
        </div>
      </template>

      <div v-else class="flex flex-col gap-8">
        <div class="flex flex-row gap-2 items-center hover:text-zinc-900 cursor-pointer" @click="activeCategory = null">
          <AppIcon icon="chevron_left" />
          <div>{{ strings.allTemplates }}</div>
        </div>

        <!-- Loop active category -->
        <VueDraggableNext
          :list="returnActiveCategoryItems"
          class="flex flex-col gap-8"
          handle=".uip-block-drag"
          :group="{ name: 'uip-blocks', pull: 'clone', put: false, revertClone: true }"
          animation="300"
          :sort="false"
          :clone="clone"
          itemKey="name"
        >
          <template v-for="(theme, index) in returnActiveCategoryItems" :key="theme.ID" :index="index">
            <div class="cursor-pointer">
              <div class="flex flex-col gap-3">
                <div class="w-full pl-7 pt-7 bg-indigo-600 rounded-lg">
                  <div
                    class="w-full rounded-tl-lg aspect-video uip-block-drag bg-zinc-200 bg-no-repeat bg-center bg-cover"
                    :style="'background-image:url(' + theme.images[returnThemeIndex(theme)] + ');'"
                  ></div>
                </div>

                <div class="flex gap-2 items-center">
                  <AppButton type="transparent" @click="theme.showInfo = !theme.showInfo"> <AppIcon icon="lightbulb" /></AppButton>
                  <div class="grow font-semiboldd">{{ theme.name }}</div>

                  <AppButton type="transparent" v-if="theme.images.length > 1" @click="navImagesBackward(theme)"> <AppIcon icon="chevron_left" /></AppButton>

                  <AppButton type="transparent" v-if="theme.images.length > 1" @click="navImagesForward(theme)"> <AppIcon icon="chevron_right" /></AppButton>

                  <AppButton type="transparent" v-if="theme.images.length > 1" @click="importThis(theme, true)"> <AppIcon icon="download" /></AppButton>
                </div>

                <template v-if="theme.showInfo">
                  <div class="text-zinc-400 text-sm">
                    {{ theme.description }}
                  </div>

                  <div class="flex flex-row gap-3 place-content-between">
                    <div class="text-xs bg-indigo-100 rounded px-2 py-1 flex flex-row gap-1 items-center">
                      <AppIcon icon="file_download" />
                      <span>{{ theme.downloads }}</span>
                    </div>

                    <div class="text-zinc-400 text-sm">
                      {{ strings.createdBy }} <a href="https://uipress.co" class="text-zinc-600 hover:text-zinc-900">{{ theme.created_by }}</a>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </VueDraggableNext>
      </div>
    </div>

    <Confirm ref="confirm" />
  </div>
</template>
