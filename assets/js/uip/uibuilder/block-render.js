import { nextTick, h, Teleport, ref } from "../../libs/vue-esm.js";
import BlockStyles from "./block-styles.min.js";
import BlockConditions from "./block-conditions.min.js";
import BlockInteractions from "./block-interactions.min.js";
const { __ } = wp.i18n;
export default {
  inject: ["uiTemplate"],
  mixins: [BlockStyles, BlockConditions, BlockInteractions],
  props: {
    block: Object,
    list: Array,
    index: Number,
  },
  data() {
    return {
      query: {},
      strings: {
        proOptionUnlock: __("This is a pro option. Upgrade to unlock", "uipress-lite"),
        search: __("Search", "uipress-lite"),
        totalItems: __("total items", "uipress-lite"),
      },
      windowWidth: window.innerWidth,
    };
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  mounted() {
    this.returnBlockParts;
    window.addEventListener("resize", this.handleWindowResize);
  },
  watch: {
    "block.query": {
      handler() {
        if (this.hasBlockQuery) this.runBlockQuery();
      },
      immediate: true,
      deep: true,
    },
    "query.currentPage": {
      handler() {
        if (this.hasBlockQuery) this.runBlockQuery();
      },
    },
    "query.search": {
      handler() {
        if (this.hasBlockQuery) this.runBlockQuery();
      },
    },
  },
  computed: {
    /**
     * Check if block query is enabled
     *
     * @since 3.2.13
     */
    hasBlockQuery() {
      return this.hasNestedPath(this.block, ["query", "enabled"]);
    },
    /**
     * Returns total count for query
     *
     * @since 3.2.13
     */
    returnPostQueryCount() {
      if (!this.query.totalFound) return 0;
      return this.query.totalFound;
    },

    /**
     * Return whether the block query has a pagination
     *
     * @since 3.2.13
     */
    blockPaginationEnabled() {
      return this.hasNestedPath(this.block, ["query", "settings", "showPagination"]);
    },
    /**
     * Return whether the block query has a search input
     *
     * @since 3.2.13
     */
    blockSearchEnabled() {
      return this.hasNestedPath(this.block, ["query", "settings", "search"]);
    },
    /**
     * Returns block link if it exists. Returns false otherwise
     *
     * @since 3.2.13
     */
    ifBlockHasLink() {
      return this.hasNestedPath(this.block, ["linkTo", "value"]);
    },

    /**
     * Returns block styles
     *
     * @since 3.2.13
     */
    returnBlockStyles() {
      const id = this.block.uid;
      const darkmode = this.uipApp.data.templateDarkMode;
      const screenWidth = window.innerWidth;

      let dynamic = this.formatDynamicMatches;
      let style = this.returnBlockStylesAsCss(dynamic);
      let custom = this.returnCustomCSS;
      return style + custom;
    },

    /**
     * Returns blocks custom css if it exists. Returns empty string on failure
     *
     * @since 3.2.13
     */
    returnCustomCSS() {
      let style = this.hasNestedPath(this.block, ["settings", "advanced", "options", "css", "value"]);
      if (!style) style = "";
      return style;
    },

    /**
     * Returns blocks custom JS if it exists. Returns empty string on failure
     *
     * @since 3.2.13
     */
    returnCustomJS() {
      let code = this.hasNestedPath(this.block, ["settings", "advanced", "options", "js", "value"]);
      if (!code) code = "";
      return code;
    },

    /**
     * Returns whether we are in production or preview or builder
     *
     * @returns {boolean}  - returns true if we are in production | false if not
     * @since 3.2.13
     */
    isProduction() {
      if (this.uiTemplate.display == "prod") return true;
      if (this.uiTemplate.isPreview) return true;
      return false;
    },

    /**
     * Matches dynamic keys within block and switches them to their value
     *
     * @since 3.2.13
     */
    formatDynamicMatches() {
      // Bail if we are in preview
      if (!this.isProduction) return this.block;

      let blockString = JSON.stringify(this.block);
      const pattern = /{{(.*?)}}/g;
      const matches = blockString.matchAll(pattern);

      // Convert the iterable matches into an array
      const matchesArray = Array.from(matches);

      // Bail if there was no matches
      if (!Array.isArray(matchesArray)) return this.block;

      for (let [index, match] of matchesArray.entries()) {
        const matchDynamic = match[0];
        const matchValue = match[1];
        if (matchValue in this.uipApp.data.dynamicOptions) {
          blockString = blockString.replace(matchDynamic, this.uipApp.data.dynamicOptions[matchValue].value);
        }
      }

      return JSON.parse(blockString);
    },

    /**
     * Returns block params
     *
     * @since.3.2.13
     */
    returnParams() {
      return {
        "block-uid": this.block.uid,
        block: this.formatDynamicMatches,
        class: this.returnBlockClasses(this.block),
        id: this.block.uid,
        title: this.returnToolTip(this.block),
      };
    },
    /**
     * Checks if block should be hidden for viewport
     *
     * @since 3.2.13
     */
    isHiddenForViewport() {
      const responsive = this.block.responsive;
      let screenWidth = this.windowWidth;

      const templateWidth = this.uiTemplate.windowWidth;
      if (templateWidth) screenWidth = templateWidth;

      // No responsive settings so bail
      if (typeof responsive === "undefined") return false;
      if (!responsive) return false;

      //Hidden on mobile
      if (responsive.mobile && screenWidth < 699) return true;

      //Hidden on tablet
      if (responsive.tablet && screenWidth < 990 && screenWidth >= 699) return true;

      //Hidden on desktop
      if (responsive.desktop && screenWidth > 990) return true;
    },

    /**
     * Checks for block query, if it exists then returns the query. Returns false if no query
     *
     * @since 3.2.13
     */
    returnPostQuery() {
      let posts = this.query.posts;
      if (!posts) return false;
      return posts;
    },
  },
  methods: {
    /**
     * Handles window resize event
     *
     * @since 3.2.13
     */
    handleWindowResize() {
      this.windowWidth = window.innerWidth;
    },
    /**
     * Runs the main block query
     *
     * @since 3.2.13
     */
    async runBlockQuery() {
      const blockQuery = this.hasNestedPath(this.block, ["query", "settings"]);
      let query = JSON.stringify(blockQuery);
      let blockString = JSON.stringify(this.block);

      let page = this.query.currentPage;
      if (typeof page === "undefined") page = 1;

      let search = this.query.search;
      if (typeof search === "undefined") search = "";

      //Build form data for fetch request
      let formData = new FormData();
      formData.append("action", "uip_process_block_query");
      formData.append("security", uip_ajax.security);
      formData.append("query", query);
      formData.append("blockString", blockString);
      formData.append("page", page);
      formData.append("search", search);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      if (response.error) {
        this.uipApp.notifications.notify(response.message, "uipress-lite", "", "error", true);
      }

      if (response.success) {
        this.query.posts = response.items.list;
        this.query.totalFound = response.items.found;
        this.query.dynamicMatches = response.items.matches;
        this.query.totalPages = response.items.totalPages;
        this.query.currentPage = page;
      }
    },

    /**
     * Returns tooltip for block
     *
     * @since 3.2.13
     */
    returnToolTip(block) {
      let hasTip = this.hasNestedPath(block, ["tooltip", "message"]);
      if (hasTip) return hasTip;
    },

    /**
     * Returns given block classes
     *
     * @since 3.2.13
     */
    returnBlockClasses(block, postID) {
      let classes = "";
      const advanced = this.get_block_option(block, "advanced", "classes");
      if (postID) classes += ` uip-query-id-${postID}`;
      return (classes += advanced);
    },

    /**
     * Loops query and creates nodes for each item
     *
     * @param {Object} blockTemplate - the vue block component
     * @since.3.2.13
     */
    renderQuery(blockTemplate) {
      const postQuery = this.returnPostQuery;
      let nodes = [];

      // If query is not an array then exit
      if (!Array.isArray(postQuery)) return nodes;
      // Loop items in query and create nodes
      for (let item of postQuery) {
        const queriedBlock = this.formatQueryDynamicMatches(item.ID);
        const queryBlockStyle = this.returnQueryBlockStyles(queriedBlock, item.ID);
        const queryStyleNode = h(Teleport, { to: "body" }, h("style", { scoped: "" }, queryBlockStyle));
        const args = { ...this.returnQueryParams(queriedBlock, item.ID), ...this.returnWatchers(queriedBlock) };
        const blocknode = h(blockTemplate, args);
        nodes.push(queryStyleNode, blocknode);
      }

      return nodes;
    },

    /**
     * Returns query block styles
     *
     * @since 3.2.13
     */
    returnQueryBlockStyles(block, ID) {
      const id = this.block.uid;
      const darkmode = this.uipApp.data.templateDarkMode;
      let style = this.returnBlockStylesAsCss(block);
      style = style ? style : "";
      return style.replace("#" + block.uid, ".uip-query-id-" + ID + "#" + block.uid);
    },

    /**
     * Returns block params in query
     *
     * @since.3.2.13
     */
    returnQueryParams(queriedBlock, loopID) {
      return {
        "block-uid": this.block.uid,
        block: queriedBlock,
        class: this.returnBlockClasses(queriedBlock, loopID),
        id: this.block.uid,
        title: this.returnToolTip(queriedBlock),
      };
    },

    /**
     * Replaces query loop variables in block with post / user / site values
     *
     * @param {Number} postID - the id of the current item
     * @since 3.2.13
     */
    formatQueryDynamicMatches(loopID) {
      // Deep-clone the original dynamic matches using JSON methods
      const dynamicMatches = JSON.parse(JSON.stringify(this.formatDynamicMatches));

      // Retrieve matches for this specific block uid
      const matchesForBlock = this.query.dynamicMatches;

      // If there are no matches for the given post ID, return the original dynamic matches
      if (!(loopID in matchesForBlock)) return dynamicMatches;

      // Convert dynamic matches to a string for easier manipulation
      let matchesString = JSON.stringify(dynamicMatches);

      // Iterate over each match for the given post ID
      for (let match of matchesForBlock[loopID]) {
        let replacementValue = match.replace;

        // Special case for '{{post_content}}'
        if (match.match === "{{post_content}}") {
          const replacerParts = JSON.stringify({ html: `uip_remove_this${match.replace}uip_remove_this` }).split("uip_remove_this");
          replacementValue = replacerParts[1];
        }

        // Try to replace the match with the replacement value and see if the result is valid JSON
        const potentialNewString = matchesString.replace(match.match, replacementValue);

        try {
          JSON.parse(potentialNewString); // Check if it's a valid JSON
          matchesString = potentialNewString; // Update the string if valid
        } catch (error) {
          console.error("Replacement resulted in invalid JSON:", error);
        }
      }

      // Attempt to return the parsed result
      try {
        return JSON.parse(matchesString);
      } catch (error) {
        console.error("Error parsing final string:", error);
        return this.dynamicMatches; // If parsing fails, return the original block
      }
    },

    /**
     * Returns block watchers
     *
     * @param {Object} block - the block to add watchers too;
     * @since 3.2.13
     */
    returnWatchers(block) {
      let watchers = {};

      // If production then mount the link handler
      if (this.isProduction) {
        watchers = this.handleBlockInteractions(block, watchers);

        //watchers.onclick = (evt) => {
        //this.maybeFollowLink(evt, block);
        //};
        return watchers;
      }

      watchers.onclick = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        this.uipApp.blockControl.setActive(this.block, this.list, evt);
      };

      // On mouse enter
      watchers.onmouseenter = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        this.uipApp.blockControl.setHover(evt, block);
      };

      // On mouse leave
      watchers.onmouseleave = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        this.uipApp.blockControl.removeHover(evt, block);
      };

      // On mouse leave
      watchers.oncontextmenu = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        this.uipApp.blockcontextmenu.show({ event: evt, list: this.list, index: this.index, block: this.block });
      };

      return watchers;
    },

    /**
     * Follows link if block has one set
     *
     * @param {Object} evt - click event
     * @param {Object} block - the block that was clicked
     * @since 3.2.13
     */
    maybeFollowLink(evt, block) {
      // Retrieve link value and link type
      const linkValue = this.hasNestedPath(block, ["linkTo", "value"]);
      const linkType = this.hasNestedPath(block, ["linkTo", "newTab"]);

      // Early exit if no link value is set
      if (!linkValue) return;

      // Update dynamic link
      if (linkType === "dynamic") {
        this.updateAppPage(linkValue);
        return;
      }

      // Set up common link properties
      const linkEl = this.$refs.blocklink;
      linkEl.href = linkValue;

      // Determine if modifier keys were pressed or if link should open in a new tab
      const forceNewTab = evt.ctrlKey || evt.shiftKey || evt.metaKey || (evt.button && evt.button === 1) || linkType === "newTab";

      if (forceNewTab) {
        linkEl.target = "_BLANK";
      } else {
        linkEl.target = "";
      }

      // Trigger the link
      linkEl.click();
    },

    /**
     * Renders the search input for the query
     *
     * @since 3.2.13
     */
    renderSearch() {
      const searchEnabled = this.blockSearchEnabled;
      // Exit if query doesn't have search
      if (!searchEnabled) return [];

      const icon = h("span", { class: "uip-icon uip-text-muted" }, "search");
      const watcher = { oninput: (evt) => (this.query.search = evt.target.value) };
      const searchInput = h("input", { class: "uip-blank-input uip-flex-grow uip-text-s", type: "search", placeholder: this.strings.search, ...watcher });
      return [h("div", { class: "uip-flex uip-search-block uip-border-round uip-query-search uip-w-100p uip-gap-xxs uip-flex-center" }, icon, searchInput)];
    },
    /**
     * Renders the pagination input for the query
     *
     * @since 3.2.13
     */
    renderPagination() {
      const paginationEnabled = this.blockPaginationEnabled;

      // Exit if query doesn't have search
      if (!paginationEnabled) return [];
      const totalFound = this.returnPostQueryCount + " " + this.strings.totalItems;
      const totalFoundNode = h("div", { class: "uip-text-muted uip-pagination-count" }, totalFound);

      // Only render pagination buttons if pages more than 1
      let paginationWrapper;
      if (this.query.totalPages > 1) {
        // Build back button
        let backClass = "uip-button-default uip-icon uip-pagination-button uip-border-rounder";
        if (this.query.currentPage < 2) backClass += " uip-link-disabled";
        const backWatcher = { onclick: () => this.query.currentPage-- };
        const backButton = h("button", { class: backClass, ...backWatcher, type: "button" }, "chevron_left");

        // Forward back button
        let forwardClass = "uip-button-default uip-icon uip-pagination-button uip-border-rounder";
        if (this.query.currentPage >= this.query.totalPages) forwardClass += " uip-link-disabled";
        const forwardWatcher = { onclick: () => this.query.currentPage++ };
        const forwardButton = h("button", { class: forwardClass, ...forwardWatcher, type: "button" }, "chevron_right");

        paginationWrapper = h("div", { class: "uip-flex uip-gap-xs uip-pagination-button-group" }, backButton, forwardButton);
      }

      return [h("div", { class: "uip-flex uip-w-100p uip-flex-between uip-flex-center uip-pagination-controls" }, totalFoundNode, paginationWrapper)];
    },
  },
  /**
   * Renders block, styles and scripts and applies watchers
   *
   * @since 3.2.13
   */
  render() {
    let nodes = [];

    // If block is a remote template abort
    if (this.block.remote) return nodes;
    if (!this.blockMetConditions()) return nodes;

    const styles = this.returnBlockStyles;
    const scripts = this.returnCustomJS;
    const hasBlockQuery = this.hasBlockQuery;
    const blockLink = this.ifBlockHasLink;
    const isProduction = this.isProduction;

    // Bail if block is not visible for viewport
    const isHidden = this.isHiddenForViewport;
    if (isHidden) return nodes;

    // Push the style tag if block has styles
    if (styles) nodes.push(h(Teleport, { to: "body" }, h("style", { scoped: "" }, styles)));
    if (scripts) nodes.push(h(Teleport, { to: "body" }, h("script", {}, scripts)));
    if (blockLink) nodes.push(h(Teleport, { to: "body" }, h("a", { ref: "blocklink", class: "uip-hidden" })));

    // Build the main block args
    const blockTemplate = this.$root._.appContext.components[this.block.moduleName];

    // Doesn't exist so it's like a pro component
    if (!blockTemplate) {
      const noblocknode = h("div", { innerHTML: this.strings.proOptionUnlock, class: "uip-padding-xxs uip-border-rounder uip-background-green-wash uip-text-s uip-text-normal" });
      nodes.push(noblocknode);
      return nodes;
    }

    const blockREF = ref(null);
    const args = { ...this.returnParams, ...this.returnWatchers(this.block), ...{ ref: blockREF } };
    const coreBlockNode = h(blockTemplate, args);

    // If has block query
    if (hasBlockQuery) {
      const queryNodes = this.renderQuery(blockTemplate);
      const searchNodes = this.renderSearch();
      const pagination = this.renderPagination();

      // Add the base block if in builder so there is always a block even in empty query
      let baseBlock = [coreBlockNode];
      if (isProduction) baseBlock = [];
      nodes = [...nodes, ...searchNodes, ...baseBlock, ...queryNodes, ...pagination];
    }
    // No query
    else {
      nodes.push(coreBlockNode);
    }

    // Build ref object if doesn't exist
    if (!this.isObject(this.uiTemplate.blockRefs)) this.uiTemplate.blockRefs = {};

    // Store block ref and id for interactions
    this.uiTemplate.blockRefs[this.block.uid] = {
      uid: this.block.uid,
      name: this.block.name,
      ref: blockREF,
    };

    // Return block and style
    return nodes;
  },
};
