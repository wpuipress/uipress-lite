const { __ } = wp.i18n;
import { maybeForceReload, stripUIPparams } from "../../v3.5/utility/functions.min.js";

export default {
  props: {
    display: String,
    name: String,
    block: Object,
  },
  data() {
    return {
      frame: false,
      loading: true,
      fullScreen: false,
      breadCrumbs: [],
      startPage: this.returnAdminPage,
      cornertickle: false,
      currentURL: false,
      rendered: false,
      scrollOver: true,
      mounted: false,
      updatingBrowserWindow: false,
    };
  },
  inject: ["uiTemplate"],
  watch: {
    "uipApp.data.themeStyles": {
      handler(newValue, oldValue) {
        this.injectStyles();
      },
      deep: true,
    },
    "uiTemplate.globalSettings.options.advanced.css": {
      handler(newValue, oldValue) {
        this.injectStyles();
      },
      deep: true,
    },
  },
  mounted() {
    this.mountProductionFunctions();
    this.mountMainWatchers();
    this.mounted = true;
  },
  beforeUnmount() {
    this.removeWatchers();
  },
  computed: {
    /**
     * Returns a default start page for the iframe
     *
     * @since 3.2.13
     */
    returnStartPage() {
      if (this.uiTemplate.display == "prod") return window.location.href;

      const defaultAdmin = this.returnAdminPage;
      return this.formatRequiredParams(defaultAdmin);
    },

    /**
     * Returns a css opacity string if loading
     *
     * @since 3.2.13
     */
    returnLoadingStyle() {
      if (!this.rendered) {
        return "opacity:0";
      }
    },
    /**
     * Retrieves the home page URL from the block options.
     *
     * @returns {string|boolean} Returns the home page URL if found, otherwise returns false.
     * @since 3.2.13
     */
    returnHomePage() {
      return this.getBlockOption("loginRedirect", "value", false);
    },

    /**
     * Determines if themes are disabled based on block option.
     *
     * @returns {boolean} Returns true if theme is disabled, otherwise false.
     * @since 3.2.13
     */
    returnTheme() {
      return this.getBlockOption("disableTheme", "value", false);
    },

    /**
     * Determines if plugin notices should be hidden.
     *
     * @returns {boolean} Returns true if notices should be hidden, otherwise false.
     * @since 3.2.13
     */
    returnNotices() {
      let hideNotices = this.getBlockOption("hidePluginNotices", "value", false);

      if (JSON.stringify(this.uiTemplate.content).includes("site-notifications")) {
        hideNotices = true;
      }

      return hideNotices;
    },

    /**
     * Determines if the loader should be hidden.
     *
     * @returns {boolean} Returns true if loader should be hidden, otherwise false.
     * @since 3.2.13
     */
    showLoader() {
      return this.getBlockOption("hideLoader", "value", true);
    },

    /**
     * Determines if screen options should be hidden.
     *
     * @returns {boolean} Returns true if screen options should be hidden, otherwise false.
     * @since 3.2.13
     */
    returnScreen() {
      return this.getBlockOption("hideScreenOptions", "value", true);
    },

    /**
     * Determines if the help tab should be hidden.
     *
     * @returns {boolean} Returns true if help tab should be hidden, otherwise false.
     * @since 3.2.13
     */
    returnHelp() {
      return this.getBlockOption("hideHelpTab", "value", true);
    },

    /**
     * Determines if the fullscreen mode is disabled.
     *
     * @returns {boolean} Returns true if fullscreen mode is disabled, otherwise false.
     * @since 3.2.13
     */
    disableFullScreen() {
      return this.getBlockOption("disableFullScreen", "value", true);
    },

    /**
     * Returns the CSS classes based on current settings.
     *
     * @returns {string} CSS classes string.
     * @since 3.2.13
     */
    returnClasses() {
      let classes = "";
      if (this.fullScreen) {
        classes += "uip-fullscreen-mode uip-scale-in-bottom-right uip-z-index-9";
      }
      return classes;
    },

    /**
     * Retrieves custom CSS from the UI template's global settings.
     *
     * @returns {string|undefined} Custom CSS string or undefined if not found.
     * @since 3.2.13
     */
    returnTemplateCSS() {
      const options = this.uiTemplate.globalSettings.options;
      if (typeof options === "undefined") return;
      if (!("advanced" in options)) return;

      if ("css" in options.advanced) {
        return options.advanced.css;
      }
    },

    /**
     * Retrieves the admin page URL.
     *
     * @returns {string} Admin page URL.
     * @since 3.2.13
     */
    returnAdminPage() {
      let url = this.hasNestedPath(this.uipApp.data, "dynamicOptions", "viewadmin", "value");
      return url;
    },
  },
  methods: {
    /**
     * Removes all watchers
     *
     * @since 3.2.13
     */
    removeWatchers() {
      window.removeEventListener("message", this.handleFrameMessages, false);
      window.removeEventListener("popstate", this.handleHashChanges, false);
      window.removeEventListener("hashchange", this.handleHashChanges, false);
      document.removeEventListener("uipress/app/breadcrumbs/update", this.handleBreadCrumbChange, { once: false });
      document.removeEventListener("uip_update_frame_url", this.handleURLchangeRequest, { once: false });
      document.removeEventListener("keydown", this.handleEscapeFullScreen);
      document.removeEventListener("uipress/app/window/fullscreen", this.toggleFullScreen);
    },
    /**
     * Mounts all watchers that are not state specific
     *
     * @since 3.2.13
     */
    mountMainWatchers() {
      document.addEventListener("uipress/app/breadcrumbs/update", this.handleBreadCrumbChange, { once: false });
      document.addEventListener("uipress/app/window/fullscreen", this.toggleFullScreen);
      document.addEventListener("uip_update_frame_url", this.handleURLchangeRequest, { once: false });
      this.iframeURLChange(this.$refs.contentframe, this.handleFrameURLChange);
    },

    /**
     * Mounts all watchers for production
     *
     * @since 3.2.13
     */
    mountProductionFunctions() {
      // Only mount fullscreen listeners on production
      if (this.uiTemplate.display != "prod") return;
      window.addEventListener("message", this.handleFrameMessages, false);
      window.addEventListener("popstate", this.handleHashChanges, false);
      window.addEventListener("hashchange", this.handleHashChanges, false);
    },

    /**
     * Handles changes to the iframe's URL. Initiates loading indications, updates current URL,
     * reloads iframe content if necessary, and updates active links.
     *
     * @param {string} newURL - The new URL to which the iframe has navigated.
     * @since [your_version]
     */
    handleFrameURLChange(newURL) {
      const frame = this.$refs.contentframe;

      // Begin loading indication
      this.initiateLoading();

      this.currentURL = newURL;
      const url = new URL(newURL);

      // Force iframe reload based on new URL
      maybeForceReload(url);

      // Check if we should reload the entire page
      if (this.shouldReloadPage(url)) return window.location.assign(url);

      // Handle changes related to the iframe's content
      this.handleIframeContentChanges(frame, url, newURL);
    },

    /**
     * Checks if dynamic loading is disabled and reloads the page if so
     *
     * @param {string} url
     * @since 3.2.13
     */
    dynamicLoadingDisabled(url) {
      const isProd = this.uiTemplate.display == "prod" ? true : false;
      if (typeof UIPdisableDynamicLoading !== "undefined") {
        const disabledDynamicLoading = UIPdisableDynamicLoading && isProd ? true : false;
        const newURL = stripUIPparams(url);
        if (disabledDynamicLoading) window.location.assign(newURL);
      }
    },

    /**
     * Starts loading bar
     *
     * @since 3.2.13
     */
    initiateLoading() {
      document.dispatchEvent(new CustomEvent("uipress/app/page/load/start"));
      this.loading = true;

      const stopLoader = () => (this.loading = false);
      setTimeout(stopLoader, 2000);
    },

    /**
     * Checks if we should force reload the page
     *
     * @param {String} url - url to check against
     * @since 3.2.13
     */
    shouldReloadPage(url) {
      const forceReload = typeof UIPfrontEndReload !== "undefined" && UIPfrontEndReload;
      return forceReload && this.uiTemplate.display !== "builder" && !url.href.includes(this.returnAdminPage);
    },

    /**
     * Handles iframe content changes
     *
     * @param {Node} frame - iframe dom element
     * @param {String} url - current url
     * @param {String} newURL - new url
     * @since 3.2.13
     */
    handleIframeContentChanges(frame, url, newURL) {
      const fallBackState = frame.contentWindow.document.documentElement && frame.contentWindow.document.documentElement.getAttribute("uip-framed-page");

      // Check if we have already processed this URL to prevent double loading
      if (url.searchParams.get("uip-framed-page") || fallBackState) {
        const activeItem = frame.contentWindow.document.querySelectorAll("#adminmenu a[aria-current='page']");
        let path = newURL;

        // Get active page from iframe
        if (activeItem[0]) path = activeItem[0].getAttribute("href");

        this.updateActiveLink(path);
        this.injectStyles();
        this.loading = false;
        return;
      }

      // If none of the conditions matched, replace the frame's content with the new URL
      frame.src = "about:blank";
      const formattedUrl = this.formatUserUrlOptions(url);
      frame.contentWindow.location.replace(formattedUrl);
    },

    /**
     * Handles iframe load event
     *
     * @param {Object} - event - uipress/app/breadcrumbs/update event
     * @since 3.2.13
     */
    async handleIframeLoad(event) {
      const frame = this.$refs.contentframe;

      // No iframe so exit
      if (!frame) return;
      const currentURL = frame.contentWindow.location.href;

      // If the page failed to load it may be due to CORS so force a window reload
      const isLoaded = await this.checkPageLoaded();
      if (!isLoaded) return window.location.assign(this.currentURL);

      this.mountFrameWatchers();
      this.getAdminPageTitle();
      this.checkForUserFullSreen(currentURL);

      this.loading = false;
      this.rendered = true;

      const title = frame.contentDocument.title;
      if (title) document.title = title;

      //Update browser address if we are not in builder
      if (this.uiTemplate.display == "prod") this.updateBrowserAddress(frame.contentWindow.location.href);

      document.dispatchEvent(new CustomEvent("uipress/app/page/load/finish"));
      this.updatePageUrls();
      //this.injectWindowOpenMethod();
    },

    /**
     * Gets admin page title from frame and updates dynamic data
     *
     * @since 3.2.13
     */
    getAdminPageTitle() {
      const frame = this.$refs.contentframe;
      if (!frame) return;
      const script = frame.contentWindow.document.querySelector("#uip-admin-page-title");
      if (!script) return;
      const title = script.getAttribute("data-title");
      this.uipApp.data.dynamicOptions.adminPageTitle.value = title;
    },

    /**
     * Injects a handler to ensure window.open methods open in new tab and not inside frame
     *
     * helps avoid CORS issues
     * @since 3.2.13
     */
    injectWindowOpenMethod() {
      const frame = this.$refs.contentframe;
      const uipWindowOpenMethod = frame.contentWindow.open;

      // Build custom handler for window.open
      const handleOpen = (url, target, windowFeatures) => {
        if (target) {
          let tempTarget = target.toLowerCase();
          if (tempTarget == "_blank" || tempTarget == "_top" || tempTarget == "_parent") {
            uipWindowOpenMethod(url, "_blank", windowFeatures);
            return;
          }
        }

        let origin = window.location.origin;
        let newURL = new URL(url);
        if (newURL.origin != origin) {
          uipWindowOpenMethod(url, "_parent", windowFeatures);
        } else {
          uipWindowOpenMethod(url, target, windowFeatures);
        }
      };
      // Mount custom method
      frame.contentWindow.open = handleOpen;
    },
    /**
     * Attemps to get page title to see if the page loaded or was blocked by CORS
     *
     * @since 3.2.13
     */
    async checkPageLoaded() {
      //Try to get contents to see if frame was loaded or blocked
      try {
        this.$refs.contentframe.contentWindow.title;
        return true;
      } catch (error) {
        return false;
      }
    },
    /**
     * Handles url / page change requests from custom event 'uip_update_frame_url'
     *
     * @param {Object} - event - uip_update_frame_url event
     * @since 3.2.13
     */
    handleURLchangeRequest(event) {
      let url = event.detail.url;
      this.loading = true;

      // Set a timeout to stop endless loading bar if plugin doesn't trigger an iframe load
      const stopLoading = () => (this.loading = false);
      setTimeout(stopLoading, 2000);

      url = this.formatUserUrlOptions(url);
      if (!this.$refs.contentframe.contentWindow) return;
      this.$refs.contentframe.contentWindow.location.assign(url);
    },

    /**
     * Handles breadcrumb changes from custom event 'uipress/app/breadcrumbs/update'
     *
     * @param {Object} - event - uipress/app/breadcrumbs/update event
     * @since 3.2.13
     */
    handleBreadCrumbChange(event) {
      this.breadCrumbs = event.detail.crumbs;
    },

    /**
     * Handles full screen requests from iframe
     *
     * @param {Object} - event - Message event
     * @since 3.2.13
     */
    handleFrameMessages(event) {
      if (!event.data) return;

      const isRequestingFullscreen = event.data.eventName === "uip_request_fullscreen";
      const isExitingFullscreen = event.data.eventName === "uip_exit_fullscreen";
      const frameContainer = this.$refs.frameContainer;

      if (isRequestingFullscreen && !this.isFullScreen()) {
        this.setFullScreen();
      }

      if (isExitingFullscreen && this.isFullScreen()) {
        this.removeFullScreen();
      }
    },

    /**
     * Handles hash and popstate changes and updates url
     *
     * @param {Object} - event - Message event
     * @since 3.2.13
     */
    async handleHashChanges(event) {
      // Check if event came from this block manually updating browser adress
      if (this.isObject(event.state)) {
        if (event.state.blockEvent) return;
      }

      if (window.location.href == this.startPage) return;
      this.$refs.contentframe.contentWindow.location.assign(window.location.href);
    },

    /**
     * Update the start page based on certain conditions.
     *
     * @since 3.2.13
     */
    updateStartPage() {
      const { dynamicOptions } = this.uipApp.data;
      const adminLink = dynamicOptions.viewadmin.value;

      // If 'returnHomePage' is set and current page is an admin link
      if (this.returnHomePage && (this.startPage === adminLink || this.startPage === `${adminLink}#/`)) {
        const absoluteUrlPattern = /^(?:[a-z+]+:)?\/\//i;

        // If 'returnHomePage' is not an absolute URL
        if (!absoluteUrlPattern.test(this.returnHomePage)) {
          this.startPage = `${adminLink}${this.returnHomePage}`;
        } else {
          this.startPage = this.returnHomePage;
        }
      }

      this.navigateFrameToStartPage();
    },

    /**
     * Gets a block option or returns false
     *
     * @param {String} optNmae - name of the option group
     * @param {String} propertyName - Name of the property
     * @param {Mixed} returnValue - The value to return if not found
     * @since 3.2.13
     */
    getBlockOption(optNmae, propertyName, returnValue) {
      const opt = this.get_block_option(this.block, "block", optNmae, true);

      if (this.isObject(opt)) {
        return propertyName in opt ? opt[propertyName] : returnValue;
      }

      return opt || returnValue;
    },

    /**
     * Navigate the frame to the updated start page and handle active link.
     *
     * @3.2.13
     */
    navigateFrameToStartPage() {
      let url = new URL(this.startPage);
      url = this.formatUserUrlOptions(url);
      this.$refs.contentframe.contentWindow.location.replace(url);
      this.updateActiveLink(this.startPage);
    },

    /**
     * Checks if we should enter fullscreen based on user fullscreen pages
     *
     * @param {String} url - url to check
     * @since 3.2.13
     */
    checkForUserFullSreen(url) {
      if (typeof UIPFullscreenUserPages === "undefined") return;
      if (!UIPFullscreenUserPages) return;
      if (this.enviroment == "builder") return;
      if (!Array.isArray(UIPFullscreenUserPages)) return;

      // Loop through fullscreen pages
      for (let part of UIPFullscreenUserPages) {
        if (url == part || url.includes(part)) this.setFullScreen();
      }
    },

    /**
     * Traverse through a nodes parents to see if it's in a link
     *
     * @param {node} el
     * @since 3.2.0
     */
    findClosestLink(el) {
      while (el && el !== document) {
        if (el.tagName === "A") return el;
        el = el.parentNode;
      }
      return null;
    },

    /**
     * Mounts event listeners on specific forms inside an iframe to modify
     * their action URLs, adding 'uip-framed-page' if it doesn't exist.
     *
     * @since 3.2.13
     */
    mountFrameWatchers() {
      // Get the iframe reference
      const frame = this.$refs.contentframe;

      // Mount link watcher
      const iframeClicker = (event) => {
        const linkElement = this.findClosestLink(event.target);
        // We found a link so handle the url
        if (linkElement) {
          this.handleInsideFrameLink(linkElement.href);
        }
        return this.forceClickEvent();
      };

      const hashWatcher = (event) => {
        const location = this.$refs.contentframe.contentWindow.location;
        this.updateBrowserAddress(location);
      };

      frame.contentWindow.document.addEventListener("click", iframeClicker);
      frame.contentWindow.addEventListener("hashchange", hashWatcher);
      frame.contentWindow.addEventListener("uip-frame-hash-change", hashWatcher);

      // Return early if not in 'prod' mode
      if (this.uiTemplate.display !== "prod") return;

      // List of form names to check and attach listeners
      const formNames = ["upgrade-plugins", "upgrade-themes", "upgrade"];

      // Helper function to handle the form submission event
      const handleFormSubmit = function (form) {
        form.addEventListener("submit", function (evt) {
          const url = new URL(form.action);

          // If 'uip-framed-page' is not part of the URL, modify the form's action
          if (!url.searchParams.get("uip-framed-page")) {
            evt.preventDefault();
            this.formatUserUrlOptions(url);
            form.action = url.href;
            form.submit();
          }
        });
      }.bind(this); // Ensure `this` inside function refers to Vue component

      // Iterate over each form name and attach event listener
      formNames.forEach((name) => {
        const form = frame.contentWindow.document.querySelector(`form[name="${name}"]`);
        if (form) handleFormSubmit(form);
      });
    },

    /**
     * Handles links clicked on from within the iframe
     * Checks if they are for same origin. If not reloads the whole page
     *
     * @since 3.2.13
     */
    handleInsideFrameLink(url) {
      // No url so bail
      if (!url) return;

      if (url.startsWith("#")) return;

      // Check if dynamic loading is disabled
      this.dynamicLoadingDisabled(url);

      const absoluteUrlPattern = /^(?:[a-z+]+:)?\/\//i;

      // Link is not relative so bail
      if (!absoluteUrlPattern.test(url)) return;

      const domain = this.extractDomain(this.uipApp.data.options.domain);

      if (url.includes("googlesitekit_proxy_setup_start")) return (window.location.href = url);

      // URL contains domain so exit
      if (url.includes(domain)) return;

      // High chance we will run into cors issues so reload page outside frame
      window.location.href = url;
    },

    /**
     * Extracts domain name from url
     *
     * @param {String} urlString
     * @since 3.2.13
     */
    extractDomain(urlString) {
      const url = new URL(urlString);

      // Split the hostname into parts
      const parts = url.hostname.split(".");
      if (parts.length <= 2) {
        return url.hostname; // Return as is for hostnames
      }

      return parts.slice(-2).join(".");
    },

    /**
     * Updates the browser address on page change
     *
     * @param {String} url - url to update address too
     */
    async updateBrowserAddress(url) {
      if (!url || url == "about:blank") return;

      let processed = stripUIPparams(url);
      processed = processed ? decodeURIComponent(processed) : processed;
      // Exit if address is same as current
      if (processed == window.location.href) return;
      history.pushState({ blockEvent: true }, null, processed);
    },

    /**
     * Updates form actions and hrefs in the frame content based on the admin URL.
     *
     * @since 3.2.13
     */
    updatePageUrls() {
      const adminURL = this.uipApp.data.options.adminURL;

      this.updateFormActions(adminURL);
      this.updateFormHrefs(adminURL);
    },

    /**
     * Update form action attributes based on the admin URL.
     *
     * @param {string} adminURL - The admin URL to check and format with.
     * @since 3.2.13
     */
    updateFormActions(adminURL) {
      const allFormLinks = this.$refs.contentframe.contentWindow.document.querySelectorAll("form");
      for (let form of allFormLinks) {
        let formAction = form.action;

        if (!formAction || typeof formAction !== "string") continue;

        if (formAction.includes(adminURL)) {
          form.action = this.formatRequiredParams(formAction);
        }
      }
    },

    /**
     * Update anchor href attributes based on the admin URL.
     *
     * @param {string} adminURL - The admin URL to check and format with.
     * @since 3.2.13
     */
    updateFormHrefs(adminURL) {
      const allFormHrefs = this.$refs.contentframe.contentWindow.document.querySelectorAll("body.update-php a");
      for (let link of allFormHrefs) {
        let href = link.href;

        if (!href || typeof href !== "string") continue;

        if (href.includes(adminURL)) {
          link.href = this.formatRequiredParams(href);
        } else {
          let templink = adminURL + href;
          let newLink = this.formatRequiredParams(templink);
          newLink = newLink.replace(adminURL, "");
          link.href = newLink;
        }
      }
    },

    /**
     * Modifies the given URL by adding various search parameters based on the
     * current state of the Vue component.
     *
     * @param {URL} url - The URL to be formatted.
     * @returns {URL} - The modified URL with the appropriate search parameters.
     * @since 3.2.13
     */
    formatUserUrlOptions(url) {
      // Always set 'uip-framed-page' to 1
      url.searchParams.set("uip-framed-page", 1);

      // Check and set various search parameters based on the Vue component's state
      if (this.returnScreen) {
        url.searchParams.set("uip-hide-screen-options", 1);
      }
      if (this.returnHelp) {
        url.searchParams.set("uip-hide-help-tab", 1);
      }
      if (this.returnTheme) {
        url.searchParams.set("uip-default-theme", 1);
      }
      if (this.returnNotices) {
        url.searchParams.set("uip-hide-notices", 1);
      }

      // Set 'uipid' based on the component's 'uiTemplate' id
      url.searchParams.set("uipid", this.uiTemplate.id);

      return url;
    },

    /**
     * Modifies the provided URL string by adding or updating various search parameters
     * based on the current state of the Vue component.
     *
     * @param {string} unformatted - The original URL string to be formatted.
     * @returns {string} - The formatted URL string with the appropriate search parameters.
     * @since 3.2.13
     */
    formatRequiredParams(unformatted) {
      const url = new URL(unformatted);

      // Always set 'uip-framed-page' to 1
      url.searchParams.set("uip-framed-page", 1);

      // Check and set various search parameters based on the Vue component's state
      if (this.returnScreen) {
        url.searchParams.set("uip-hide-screen-options", 1);
      }
      if (this.returnHelp) {
        url.searchParams.set("uip-hide-help-tab", 1);
      }
      if (this.returnTheme) {
        url.searchParams.set("uip-default-theme", 1);
      }
      if (this.returnNotices) {
        url.searchParams.set("uip-hide-notices", 1);
      }

      // Always set 'uipid' based on the component's 'uiTemplate' id
      url.searchParams.set("uipid", this.uiTemplate.id);

      return url.href;
    },

    /**
     * Checks if the iframe is in full-screen mode.
     *
     * @returns {boolean} - True if the iframe is in full-screen mode, false otherwise.
     * @since 3.2.13
     */
    isFullScreen() {
      const container = this.$refs.frameContainer;
      return container.classList.contains("uip-fullscreen-mode");
    },

    /**
     * Toggles the full-screen mode of the iframe.
     *
     * @since 3.2.13
     */
    toggleFullScreen() {
      if (this.isFullScreen()) {
        this.removeFullScreen();
      } else {
        this.setFullScreen();
      }
    },

    /**
     * Sets the iframe to full-screen mode.
     *
     * @since 3.2.13
     */
    setFullScreen() {
      const container = this.$refs.frameContainer;
      container.classList.add("uip-fullscreen-mode", "uip-scale-in-bottom-right");
      document.addEventListener("keydown", this.handleEscapeFullScreen);
    },

    /**
     * Removes the full-screen mode from the iframe.
     *
     * @since 3.2.13
     */
    removeFullScreen() {
      const container = this.$refs.frameContainer;
      container.classList.remove("uip-fullscreen-mode", "uip-scale-in-bottom-right");
      document.removeEventListener("keydown", this.handleEscapeFullScreen);
    },

    /**
     * Handles escape key press on fullscreen
     *
     * @param {object} evt - keydown event
     * @since 3.3.07
     */
    handleEscapeFullScreen(evt) {
      if (evt.target.tagName === "INPUT") return;
      // Check if the pressed key is the Escape key
      if (evt.key === "Escape" || evt.keyCode === 27) {
        this.removeFullScreen();
      }
    },

    /**
     * Injects custom styles into the iframe.
     *
     * @since 3.2.13
     */
    injectStyles() {
      const frame = this.$refs.contentframe;

      // Only inject custom CSS in production mode
      if (this.uiTemplate.display === "prod") {
        return;
      }

      const styles = this.uipApp.data.themeStyles;
      const styleArea = frame.contentWindow.document.querySelector("#uip-theme-styles");

      // If style area doesn't exist, abort the function
      if (!styleArea) return;

      let lightStyle = 'html[data-theme="light"]{';

      for (const key in styles) {
        const item = styles[key];
        if (item.value) {
          lightStyle += `${item.name}:${item.value};`;
        }
      }
      lightStyle += "}";

      let darkStyle = 'html[data-theme="dark"]{';

      for (const key in styles) {
        const item = styles[key];
        if (item.darkValue) {
          darkStyle += `${item.name}:${item.darkValue};`;
        }
      }
      darkStyle += "}";

      const globalCSS = this.returnTemplateCSS;
      styleArea.innerHTML = lightStyle + darkStyle + globalCSS;
    },
    /**
     * Injects global CSS into the iframe.
     *
     * @since 3.2.13
     */
    injectCSS() {
      const frame = this.$refs.contentframe;
      const styleArea = frame.contentWindow.document.getElementById("uip-theme-styles");

      // If style area doesn't exist, abort the function
      if (!styleArea) return;

      const globalCSS = this.returnTemplateCSS;
      styleArea.innerText = globalCSS;
    },

    /**
     * Monitors changes to the URL of an iframe and calls a callback function when a change is detected.
     *
     * @param {HTMLIFrameElement} iframe - The iframe element to monitor.
     * @param {Function} callback - The function to call when the iframe's URL changes.
     * @since 3.2.13
     */
    iframeURLChange(iframe, callback) {
      let lastDispatched = null;

      const dispatchChange = () => {
        if (!iframe.contentWindow) return;

        let newHref = "";
        try {
          newHref = iframe.contentWindow.location.href;
        } catch (errr) {
          //console.log("we caught the error");
          //console.log(lastDispatched);
          //window.location.href = lastDispatched;
          return;
        }

        if (!this.compareURLsWithoutHash(newHref, lastDispatched)) {
          callback(newHref);
          lastDispatched = newHref;
        }
      };

      const unloadHandler = () => {
        // Timeout needed because the URL changes immediately after
        // the `unload` event is dispatched.
        setTimeout(dispatchChange, 0);
      };

      const attachUnload = () => {
        // Remove the unloadHandler in case it was already attached.
        // Prevents attaching multiple identical event handlers.
        iframe.contentWindow.removeEventListener("unload", unloadHandler);
        iframe.contentWindow.addEventListener("unload", unloadHandler);
      };

      iframe.addEventListener("load", () => {
        attachUnload();
        // Ensure any URL change is caught after the iframe has loaded
        dispatchChange();
      });

      // Attach the unload event handler when the function is first called
      attachUnload();
    },

    /**
     * Compares two URLs without hash changes
     *
     * @param {string} url1
     * @param {string} url2
     * @since 3.3.07
     */
    compareURLsWithoutHash(url1, url2) {
      if (!url1 || !url2) return false;

      const parsedUrl1 = new URL(url1);
      const parsedUrl2 = new URL(url2);

      // Remove the hash from both URLs
      parsedUrl1.hash = "";
      parsedUrl2.hash = "";

      // Compare the URLs without the hash
      return parsedUrl1.href === parsedUrl2.href;
    },
    /**
     * Handles clicks inside iframes and bubbles up the event so dropdowns etc can response
     *
     * @since 3.2.13
     */
    forceClickEvent() {
      this.$refs.frameContainer.click();
    },
  },
  template: `
    
    <div ref="frameContainer" class="uip-flex uip-flex-column uip-overflow-hidden uip-content-frame uip-overflow-hidden uip-position-relative" 
    :class="returnClasses" @mouseenter="scrollOver = true;" @keydown.esc="removeFullScreen" tabindex="1">
    
      <div class="uip-position-relative" v-if="!showLoader">
        <div ref="loader" :class="block.uid" class="uip-ajax-loader" v-if="loading">
        <div :class="block.uid" class="uip-loader-bar"></div>
        </div>
      </div>
      
      <iframe :style="returnLoadingStyle" :src="returnStartPage" ref="contentframe" 
      @load="handleIframeLoad"
      class="uip-page-content-frame uip-background-default uip-scrollbar uip-w-100p uip-flex-grow" :class="{'uip-no-select' : uiTemplate.display != 'prod' && !uiTemplate.isPreview}"></iframe>
       
      <div @mouseover="cornertickle = true" @mouseleave="cornertickle = false" class="uip-position-absolute uip-text-muted uip-top-0 uip-right-0 uip-cursor-pointer uip-flex uip-flex-column uip-flex-middle uip-padding-xs" v-if="!disableFullScreen">
      
        <div @click="toggleFullScreen()" v-if="cornertickle" class="uip-border-box uip-background-muted uip-text-muted uip-padding-xxxs uip-link-muted hover:uip-background-grey uip-flex uip-flex-column uip-flex-middle uip-fade-in uip-shadow-small uip-border-round" style="pointer-events: all">
        <span v-if="isFullScreen()" class="uip-icon uip-text-l uip-slide-in-right uip-line-height-1">fullscreen_exit</span>
        <span v-if="!isFullScreen()" class="uip-icon uip-text-l uip-line-height-1">fullscreen</span>
        </div>
        
      </div>
      
      <template v-else>
        
        <component v-if="disableFullScreen" is="style">
        .uip-fullscreen-toggle {
         display:none; 
        }
        .uip-fullscreen-mode .uip-fullscreen-toggle {
         display:block; 
        }
        </component>
        
        <div @mouseover="cornertickle = true" @mouseleave="cornertickle = false" class="uip-position-absolute uip-text-muted uip-top-0 uip-right-0 uip-cursor-pointer uip-flex uip-flex-column uip-flex-middle uip-padding-xs" v-if="!disableFullScreen">
        
        <div @click="toggleFullScreen()" v-if="cornertickle" class="uip-border-box uip-background-muted uip-text-muted uip-padding-xxxs uip-link-muted hover:uip-background-grey uip-flex uip-flex-column uip-flex-middle uip-fade-in uip-shadow-small uip-border-round" style="pointer-events: all">
          <span v-if="isFullScreen()" class="uip-icon uip-text-l uip-slide-in-right uip-line-height-1">fullscreen_exit</span>
          <span v-if="!isFullScreen()" class="uip-icon uip-text-l uip-line-height-1">fullscreen</span>
        </div>
        
        </div>
      
      </template>
      
    </div>
    `,
};
