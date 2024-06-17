<script>
const { __ } = wp.i18n;
export default {
  props: {
    returnData: Function,
    value: Array,
  },
  data() {
    return {
      toolbar: this.uipApp.data.toolbar,
      selected: [],
      strings: {
        selectItems: __("Hidden toolbar items", "uipress-lite"),
        searchItems: __("Search toolbar items", "uipress-lite"),
      },
    };
  },
  watch: {
    selected: {
      handler(newValue, oldValue) {
        this.returnData(this.selected);
      },
      deep: true,
    },
  },
  mounted() {
    this.formatInput();
  },
  computed: {
    /**
     * Returns a formatted toolbar data structure.
     *
     * Processes the toolbar items and their potential submenus. It retrieves the id of
     * each item, and also creates a label for it by removing any HTML tags from the id.
     * The result is an array of objects, each having a `name` and `label` property.
     *
     * @since 3.2.13
     * @returns {Array} - The formatted toolbar data.
     */
    returnFormattedToolbar() {
      const formattedData = [];

      for (const key in this.toolbar) {
        const item = this.toolbar[key];

        if (!item) continue;

        formattedData.push({
          name: item.id,
          label: this.removeHTMLTags(item.id),
        });

        if (!item.submenu) continue;
        if (!item.submenu.length) continue;

        // Process submenu
        for (const sub of item.submenu) {
          formattedData.push({
            name: sub.id,
            label: this.removeHTMLTags(sub.id),
          });
        }
      }

      return formattedData;
    },
  },

  methods: {
    /**
     * Injects input value
     *
     * @snce 3.2.13
     */
    formatInput() {
      if (!this.value) return;
      if (!Array.isArray(this.value)) return;
      this.selected = this.value;
    },

    /**
     * Removes any HTML tags from a given string.
     *
     * @param {string} str - The input string.
     * @returns {string} - String without HTML tags.
     */
    removeHTMLTags(str) {
      if (!str) return "";
      if (typeof str !== "string") return "";
      return str.replace(/<[^>]*>?/gm, "");
    },
  },
};
</script>

<template>
  <multi-select
    metaKey="url"
    :selected="selected"
    :availableOptions="returnFormattedToolbar"
    :placeHolder="strings.selectItems"
    :searchPlaceHolder="strings.searchItems"
    :single="false"
    :updateSelected="
      function (data) {
        selected = data;
      }
    "
  />
</template>
