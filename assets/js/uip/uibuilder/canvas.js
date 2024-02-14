/**
 * Builds the main ui builder shell
 * @since 3.0.0
 */
const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from "../../libs/vue-esm.js";
import BlockControl from "./block-control.min.js?ver=3.3.1";

export default {
  components: {
    blockControl: BlockControl,
  },
  inject: ["uiTemplate"],
  data() {
    return {
      mounted: false,
      loading: true,
      firstRender: false,
      templateID: this.$route.params.templateID,
      activeBlockID: false,
      saving: false,
      helpLoaded: false,
      allUiTemplates: [],
      blockFrames: [],
      deviceSwitcherOpen: false,
      domBlocks: [],
      scrollDebounce: null,
      scrollTimeout: false,
      zoomTimeout: false,
      ui: {
        zoom: 0.9,
        zoomoptions: false,
        viewDevice: "desktop",
        strings: {
          backToList: __("Exit builder", "uipress-lite"),
          toggleLayers: __("Toggle layers panel", "uipress-lite"),
          backToList: __("Back to template list", "uipress-lite"),
          zoomIn: __("Zoom in", "uipress-lite"),
          zoomOut: __("Zoom out", "uipress-lite"),
          darkMode: __("Dark mode", "uipress-lite"),
          preview: __("Preview", "uipress-lite"),
          import: __("Import template", "uipress-lite"),
          export: __("Export template", "uipress-lite"),
          templateLibrary: __("Template Library", "uipress-lite"),
          mobile: __("Mobile", "uipress-lite"),
          desktop: __("Desktop", "uipress-lite"),
          tablet: __("Tablet", "uipress-lite"),
          saveTemplate: __("Save", "uipress-lite"),
          help: __("Help", "uipress-lite"),
          active: __("Active", "uipress-lite"),
          draft: __("Draft", "uipress-lite"),
          active: __("Active", "uipress-lite"),
          draft: __("Draft", "uipress-lite"),
          recenter: __("Re-center", "uipress-lite"),
          showGridLines: __("Show grid lines", "uipress-lite"),
          frame: __("frame", "uipress-lite"),
          zoom100: __("Zoom to fit", "uipress-lite"),
        },
      },
      previewOptions: [
        {
          value: "builder",
          label: __("Builder", "uipress-lite"),
        },
        {
          value: "preview",
          label: __("Preview", "uipress-lite"),
        },
      ],
    };
  },
  watch: {
    /**
     * Watch changes to the viewport and update accordingly
     *
     * @since 3.2
     */
    "uiTemplate.globalSettings.type": {
      async handler(newValue, oldValue) {
        await nextTick();
        await this.setCanvasPosition();
      },
      deep: true,
    },
    /**
     * Watch changes to the viewport and update accordingly
     *
     * @since 3.2
     */
    "ui.viewDevice": {
      handler(newValue, oldValue) {
        this.handleViewPortChange();
      },
      deep: true,
    },
    /**
     * Watch changes to the template color mode and update accordingly
     *
     * @since 3.2
     */
    "uipApp.data.templateDarkMode": {
      handler(newValue, oldValue) {
        let theme = newValue ? "dark" : "light";
        let frame = document.getElementsByClassName("uip-page-content-frame");
        if (frame[0]) {
          frame[0].contentWindow.document.documentElement.setAttribute("data-theme", theme);
        }
      },
      deep: true,
    },
    /**
     * Watch changes to the template color mode and update accordingly
     *
     * @since 3.2
     */
    "uipApp.data.userPrefs.darkTheme": {
      handler(newValue, oldValue) {
        //Only adjust preview dark mode if we are not in prod
        if (this.uiTemplate.display != "prod") {
          this.uipApp.data.templateDarkMode = newValue;
        }
      },
      deep: true,
    },
    /**
     * Watch changes to the template zoom mode and update accordingly
     *
     * @since 3.2
     */
    "ui.zoom": {
      async handler(newValue, oldValue) {
        if (!this.mounted) return;

        let zoom = this.ui.zoom;
        this.$refs.framewrap.style.transform = `scale(${this.ui.zoom})`;

        clearTimeout(this.zoomTimeout);
        this.zoomTimeout = setTimeout(() => {
          // Save new zoom
          let rounded = Math.round(this.ui.zoom * 10) / 10;
          this.saveUserPreference("builderPrefersZoom", String(rounded), false);
        }, 300);
      },
    },
    /**
     * Watch changes to the current template id
     *
     * @since 3.2
     */
    "$route.params.templateID": {
      handler() {
        this.templateID = this.$route.params.templateID;
      },
    },
    /**
     * Watch changes to the current block id
     *
     * @since 3.2
     */
    "$route.params.uid": {
      handler() {
        this.activeBlockID = this.$route.params.uid;
      },
    },
  },
  created() {
    this.setTheme();
  },
  beforeUnmount() {
    this.$refs.previewCanvas.removeEventListener("wheel", this.scrollCanvas);
    window.addEventListener("keydown", this.watchShortCuts);
  },
  async mounted() {
    // Mount watchers
    this.initiateCanvas();
    this.mountWatchers();

    await this.$nextTick();
    this.mounted = true;
  },
  computed: {
    /**
     * Returns the current zoom level at a percent level
     *
     * @since 3.2
     */
    returnHumanZoom() {
      return parseInt(this.ui.zoom * 100) + "%";
    },
    /**
     * Returns the current block
     *
     * @since 3.2
     */
    returnActiveBlockUID() {
      return this.activeBlockID;
    },
    /**
     * Returns the all uiTemplates
     *
     * @since 3.2
     */
    returnAllUiTemplates() {
      let self = this;
      if (self.allUiTemplates.length < 1) {
        let formData = new FormData();
        formData.append("action", "uip_get_ui_templates");
        formData.append("security", uip_ajax.security);
        formData.append("page", 1);
        formData.append("search", "");

        self.sendServerRequest(uip_ajax.ajax_url, formData).then((response) => {
          this.allUiTemplates = response.templates;
          return this.allUiTemplates;
        });
      } else {
        return this.allUiTemplates;
      }
    },
    /**
     * Returns custom javascript for the template
     *
     * @since 3.2
     */
    returnTemplateJS() {
      if (typeof this.uiTemplate.globalSettings.options === "undefined") {
        return;
      }
      if ("advanced" in this.uiTemplate.globalSettings.options) {
        if ("js" in this.uiTemplate.globalSettings.options.advanced) {
          return this.uiTemplate.globalSettings.options.advanced.js;
        }
      }
    },
    /**
     * Returns custom CSS for the template
     *
     * @since 3.2
     */
    returnTemplateCSS() {
      if (typeof this.uiTemplate.globalSettings.options === "undefined") {
        return;
      }
      if ("advanced" in this.uiTemplate.globalSettings.options) {
        if ("css" in this.uiTemplate.globalSettings.options.advanced) {
          return this.uiTemplate.globalSettings.options.advanced.css;
        }
      }
    },
    /**
     * Returns list of block with offcanvas context
     *
     * @since 3.2
     */
    getBlockFrames() {
      this.blockFrames = [];
      this.findBlocksByComponentName(this.uiTemplate.content, ["uip-dropdown", "uip-block-modal", "uip-slide-out", "uip-accordion"], this.blockFrames);
      return this.blockFrames;
    },

    /**
     * Returns a scale property to counteract canvas scale
     *
     * @since 3.2.13
     */
    returnScale() {
      let zoom = parseFloat(this.ui.zoom);
      let width = zoom * 100;
      const calc = 1 / zoom;
      const origin = this.uipApp.isRTL ? "bottom right" : "bottom left";
      return `scale:${calc};transform-origin:${origin};width:${width}%`;
    },
    /**
     * Returns the current color theme
     *
     * @since 3.2
     */
    returnColorMode() {
      if (this.uipApp.data.userPrefs.darkTheme) return "dark";
      if (this.uipApp.data.templateDarkMode) return "dark";

      return "light";
    },

    /**
     * Returns current theme icon
     *
     * @since 3.2.0
     */
    returnThemeIcon() {
      if (this.uipApp.data.userPrefs.darkTheme) {
        return "light_mode";
      }
      return "dark_mode";
    },
  },
  methods: {
    /**
     * Sets up properties for canvas
     *
     * @since 3.2.13
     */
    async initiateCanvas() {
      // Add class to body for shortcuts
      if (this.detectOperatingSystem() == "Mac") {
        document.body.classList.add("macos");
      }

      //Set zoom level from prefs
      let zoom = parseFloat(this.uipApp.data.userPrefs.builderPrefersZoom);
      if (typeof zoom !== "undefined" && !isNaN(zoom)) this.ui.zoom = zoom;
      this.$refs.framewrap.style.transform = `scale(${this.ui.zoom})`;

      await nextTick();

      this.firstRender = true;
      this.activeBlockID = this.$route.params.uid;

      await nextTick();
      await this.setCanvasPosition();

      this.loading = false;
    },
    /**
     * Mounts container watchers
     *
     * @since 3.2.13
     */
    mountWatchers() {
      this.$refs.previewCanvas.addEventListener("wheel", this.scrollCanvas);
      window.addEventListener("keydown", this.watchShortCuts);
    },

    /**
     * Watches for shortcuts for canvas
     *
     * @param {Object} e - keydown event
     * @since 3.2.13
     */
    watchShortCuts(e) {
      // Command minus / zoom
      if (e.key === "-" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        this.zoom(-0.1);
      }
      // Command plus / zoom
      if ((e.key === "+" || e.code == "Equal") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        this.zoom(0.1);
      }
      // Command 0 - zoom to 100%
      if (e.key === "0" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        this.fitCanvas();
        this.uipApp.data.userPrefs.builderPrefersZoom = 1;
      }
    },

    /**
     * Zooms in / out
     *
     * @param {Number} = increment - the amount to zoom
     * @since 3.2.13
     */
    async zoom(increment) {
      // Bail so the zoom doesn't go negative and invert
      if (increment < 0) {
        if (this.ui.zoom < 0.05) return;
      }
      this.uipApp.scrolling = true;
      this.ui.zoom += increment;
      this.uipApp.data.userPrefs.builderPrefersZoom = this.ui.zoom;
      await nextTick();
      this.uipApp.scrolling = false;
    },

    /**
     * Recursively searches through a structure of arrays and objects to find items with a specific moduleName.
     *
     * @param {Object | Array} data - the data to search through
     * @param {Array} needle - the array of moduleNames to look for
     * @param {Array} holder - array of items to push into and return
     * @since 3.0.0
     */
    findBlocksByComponentName(data, needle, holder) {
      if (!data) return;

      // If the data is an array, iterate over its items
      if (Array.isArray(data)) {
        for (const item of data) {
          if (item && item.moduleName && needle.includes(item.moduleName)) {
            holder.push(item);
          } else if (item && item.content) {
            this.findBlocksByComponentName(item.content, needle, holder);
          }
        }
      }
    },

    /**
     * Fits the canvas into view
     *
     * @since 3.2.13
     */
    async fitCanvas() {
      this.uipApp.scrolling = true;
      const container = this.$refs.previewCanvas;
      const canvas = this.$refs.templatebody;

      // Calculate the unscaled width of the canvas
      const elementActualWidth = canvas.offsetWidth;

      const containerWidth = container.offsetWidth;

      // Calculate the scaling factor
      const scaleFactor = containerWidth / elementActualWidth;

      // Set the combined scale to the element
      this.ui.zoom = scaleFactor; // Multiply with existing scale to get combined scale
      await nextTick();
      this.uipApp.scrolling = false;
    },

    /**
     * Mounts container watchers
     *
     * @param {Object} - e - Wheel event object
     * @since 3.2.13
     */
    scrollCanvas(e) {
      e.preventDefault();

      // Set timeout for scroll to detect end
      this.uipApp.scrolling = true;
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.uipApp.scrolling = false;
      }, 150);

      // Pinch zoom
      if (e.ctrlKey) {
        // Now handle the zoom action
        if (e.deltaY < 0) this.zoom(0.02);
        if (e.deltaY >= 0) this.zoom(-0.02);
        return;
      }

      // Calculate the new top position
      let canvas = this.$refs.framewrap;
      let currentTop = parseFloat(canvas.style.top || 0);
      let currentLeft = parseFloat(canvas.style.left || 0);
      const device = this.detectOperatingSystem();

      // Calculate the new top and left values based on the wheel event's delta values
      if (device == "Mac") {
        currentTop -= e.deltaY;
        currentLeft -= e.deltaX;
      } else {
        currentTop += e.deltaY;
        currentLeft += e.deltaX;
      }

      // Apply the new top and left values to the absolute div
      canvas.style.top = `${currentTop}px`;
      canvas.style.left = `${currentLeft}px`;
    },
    /**
     * Centres canvas position
     *
     * @since 3.2.13
     */
    async setCanvasPosition() {
      // Get dimensions of the container
      const containerWidth = this.$refs.previewCanvas.offsetWidth;
      const containerHeight = this.$refs.previewCanvas.offsetHeight;

      // Get dimensions of the div
      const divWidth = this.$refs.templatebody.offsetWidth;
      const divHeight = this.$refs.templatebody.offsetHeight;

      // Calculate centred position for the div
      const centeredX = (containerWidth - divWidth) / 2;
      const centeredY = (containerHeight - divHeight) / 2;

      // Apply styles to div
      this.$refs.framewrap.style.top = `${centeredY}px`;
      this.$refs.framewrap.style.left = `${centeredX}px`;

      await this.$nextTick();

      return true;
    },
    /**
     * Handles changes to the viewport
     *
     * @since 3.0.0
     */
    handleViewPortChange() {
      const newValue = this.ui.viewDevice;
      if (newValue == "desktop") {
        this.uiTemplate.windowWidth = "1000";
        let frame = document.getElementById("uip-preview-content");
        if (frame) {
          frame.classList.add("uip-desktop-view");
          frame.classList.remove("uip-tablet-view");
          frame.classList.remove("uip-phone-view");
        }
      }
      if (newValue == "tablet") {
        this.uiTemplate.windowWidth = "699";
        let frame = document.getElementById("uip-preview-content");
        if (frame) {
          frame.classList.add("uip-tablet-view");
          frame.classList.remove("uip-desktop-view");
          frame.classList.remove("uip-phone-view");
        }
      }
      if (newValue == "phone") {
        this.uiTemplate.windowWidth = "600";
        let frame = document.getElementById("uip-preview-content");
        if (frame) {
          frame.classList.add("uip-phone-view");
          frame.classList.remove("uip-tablet-view");
          frame.classList.remove("uip-desktop-view");
        }
      }
      let previewwidthChange = new CustomEvent("uipress/builder/preview/change", { detail: { windowWidth: this.uiTemplate.windowWidth } });
      document.dispatchEvent(previewwidthChange);
      requestAnimationFrame(() => {
        this.setCanvasPosition();
      });
    },
    /**
     * Detects whether we are on a mac or windows
     *
     * @returns {String} - operating machine
     * @since 3.2.13
     */
    detectOperatingSystem() {
      const userAgent = window.navigator.userAgent.toLowerCase();

      if (userAgent.includes("mac") || userAgent.includes("ipad") || userAgent.includes("iphone")) {
        return "Mac";
      } else {
        return "Windows";
      }
    },
    /**
     * Handles canvas drag to move
     *
     * @param {Object} e - mousedown event
     */
    handleCanvasDrag(e) {
      // Mousedown
      let pos = { top: 0, left: 0, x: 0, y: 0 };
      let canvas = this.$refs.framewrap;
      let container = this.$refs.previewCanvas;

      // Right click so bail
      if (e.button === 2) return;

      // Make sure we are not dragging on a block area
      if (canvas.contains(e.target)) return;

      // Prevent
      e.preventDefault();

      // Change the cursor and prevent user from selecting the text
      container.style.cursor = "grabbing";
      container.style.userSelect = "none";

      let currentTop = parseFloat(canvas.style.top || 0);
      let currentLeft = parseFloat(canvas.style.left || 0);

      pos = { left: currentLeft, top: currentTop, x: e.clientX, y: e.clientY };

      const mouseMoveHandler = (e) => {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;
        // Scroll the element
        canvas.style.top = `${pos.top + dy}px`;
        canvas.style.left = `${pos.left + dx}px`;
      };

      const mouseUpHandler = (e) => {
        // Reset cursor
        container.style.cursor = "default";
        container.style.removeProperty("user-select");
        // Remove event listeners
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      };

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    },
    /**
     * Toggles view mode
     *
     * @since 3.2.0
     */
    toggleDisplay() {
      if (this.uiTemplate.display == "preview") {
        this.uiTemplate.display = "builder";
      } else {
        this.uiTemplate.display = "preview";
      }
    },

    /**
     * Toggles color theme
     *
     * @since 3.2.0
     */
    toggleDarkMode() {
      this.uipApp.data.userPrefs.darkTheme = !this.uipApp.data.userPrefs.darkTheme;
      this.setTheme();
      this.saveUserPreference("darkTheme", this.uipApp.data.userPrefs.darkTheme, false);
    },
    /**
     * Sets theme
     *
     * @since 3.2.0
     */
    setTheme() {
      let theme = "light";
      if (this.uipApp.data.userPrefs.darkTheme) {
        theme = "dark";
        this.uipApp.data.userPrefs.darkTheme = true;
      } else {
        this.uipApp.data.userPrefs.darkTheme = false;
      }
      document.getElementsByTagName("html")[0].setAttribute("data-theme", theme);
      let frames = document.getElementsByClassName("uip-page-content-frame");
      if (frames[0]) {
        for (const iframe of frames) {
          iframe.contentWindow.document.documentElement.setAttribute("data-theme", theme);
        }
      }
    },

    /**
     * Format user styles for save
     *
     * @since 3.2.0
     */
    formatStyles() {
      let styles = this.uipApp.data.themeStyles;
      let formatted = {};
      for (let key in styles) {
        if (styles[key].value) {
          if (!formatted[styles[key].name]) {
            formatted[styles[key].name] = {};
          }
          formatted[styles[key].name].value = styles[key].value;
        }
        if (styles[key].darkValue) {
          if (!formatted[styles[key].name]) {
            formatted[styles[key].name] = {};
          }
          formatted[styles[key].name].darkValue = styles[key].darkValue;
        }
        if (styles[key].user) {
          formatted[styles[key].name].user = styles[key].user;
          formatted[styles[key].name].label = styles[key].label;
          formatted[styles[key].name].name = styles[key].name;
          formatted[styles[key].name].type = styles[key].type;
        }
      }

      return formatted;
    },
  },
  template: `
    
    
      <component is="style" scoped >
        .user-style-area{
          <template v-for="item in uipApp.data.themeStyles">
             <template v-if="item.value">{{item.name}}:{{item.value}};</template>
          </template>
        }
        [data-theme="dark"] .user-style-area, .uip-dark-mode .user-style-area, .uip-dark-mode.user-style-area, .user-style-area .uip-dark-mode {
          <template v-for="item in uipApp.data.themeStyles">
             <template v-if="item.darkValue"> {{item.name}}:{{item.darkValue}};</template>
          </template>
        }
        {{returnTemplateCSS}}
      </component>
      <component is="script" scoped >
        {{returnTemplateJS}}
      </component>

      
      
      <div ref="previewcontainer" class="uip-h-100p uip-w-100p uip-flex uip-flex-column uip-max-h-100p uip-overflow-hidden">
        
        <!--preview area -->
        
        <div id="uip-preview-canvas" ref="previewCanvas" class="uip-flex-grow uip-flex-grow uip-flex-middle uip-overflow-hidden uip-max-w-100p uip-max-h-100p uip-w-100p uip-border-box"
        :data-theme="returnColorMode" @click="uipApp.blockControl.removeActive()" @mousedown="handleCanvasDrag($event)">
        
              
              <div ref="framewrap" class="uip-flex uip-gap-l uip-flex-start uip-w-auto uip-position-absolute" id="uip-frame-wrap">
                
                <!--Primary template -->
                <div class="uip-flex uip-flex-column">
                
                  
                  <div class="uip-background-muted uip-border uip-flex uip-gap-xs uip-flex-center uip-padding-xxs uip-padding-left-xs uip-margin-bottom-s" :style="returnScale"
                  style="border-radius: calc( var(--uip-border-radius) + var(--uip-padding-xxs) );"
                  :class="uiTemplate.isPreview ? 'uip-opacity-0' : ''">
                  
                  
                      <div class="uip-text-muted uip-flex-grow uip-text-s" >{{uiTemplate.globalSettings.name}}</div>
                      
                      <!--Device switcher-->
                      
                      <dropdown pos="bottom right">
                      
                        <template v-slot:trigger>
                    
                          <div class="uip-padding-left-xs uip-padding-right-xs uip-border-rounder uip-flex uip-gap-xs uip-flex-between uip-link-muted uip-flex-center uip-text-s" style=""  
                          @click="deviceSwitcherOpen = !deviceSwitcherOpen">
                              <div class="">
                                <template v-if="ui.viewDevice == 'desktop'">{{ui.strings.desktop}}</template>
                                <template v-if="ui.viewDevice == 'tablet'">{{ui.strings.tablet}}</template>
                                <template v-if="ui.viewDevice == 'phone'">{{ui.strings.mobile}}</template>
                              </div>
                              <div class="uip-icon uip-text-l">expand_more</div>
                          </div>
                      
                        </template>
                        
                        <template v-slot:content>
                        
                          <div class="uip-padding-xs">
                            <div class="uip-flex uip-flex-row uip-flex-center uip-gap-xs uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-gap-l uip-flex-between uip-link-default" 
                            @click="ui.viewDevice = 'desktop';deviceSwitcherOpen = false;">
                              
                              <div class="">{{ui.strings.desktop}}</div>
                              <div class="uip-flex uip-flex-center uip-text-muted uip-gap-xxxs">
                                <span class="uip-icon" style="line-height:0">desktop_windows</span>
                              </div>
                              
                            </div> 
                            
                            <div class="uip-flex uip-flex-row uip-flex-center uip-gap-xs uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-gap-l uip-flex-between uip-link-default" 
                            @click="ui.viewDevice = 'tablet';deviceSwitcherOpen = false;">
                              
                              <div class="">{{ui.strings.tablet}}</div>
                              <div class="uip-flex uip-flex-center uip-text-muted uip-gap-xxxs">
                                <span class="uip-icon">tablet_mac</span>
                              </div>
                              
                            </div> 
                            
                            
                            <div class="uip-flex uip-flex-row uip-flex-center uip-gap-xs uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-gap-l uip-flex-between uip-link-default" 
                            @click="ui.viewDevice = 'phone';deviceSwitcherOpen = false">
                              
                              <div class="">{{ui.strings.mobile}}</div>
                              <div class="uip-flex uip-flex-center uip-text-muted uip-gap-xxxs">
                                <span class="uip-icon">smartphone</span>
                              </div>
                              
                            </div> 
                          </div>
                        
                        </template>
                        
                      </dropdown>
                        
                    
                  </div>
                
                  <div class="uip-position-relative" :class="uiTemplate.globalSettings.type" style="transform: translate(0, 0)">
                    <div id="uip-preview-content" class="uip-flex uip-flex-column uip-text-normal uip-desktop-view uip-position-relative uip-block-canvas">
                      
                      <!--PAGE BODY-->
                      <div ref="templatebody" id="uip-template-body" class="uip-flex uip-flex-grow uip-text-normal uip-body-font uip-background-default uip-border-round uip-border" >
                    
                          <!--MAIN DROP AREA-->
                          <uip-content-area :content="uiTemplate.content" :returnData="function(data) {uiTemplate.content = data}" class="user-style-area"></uip-content-area>
                          <!--END OF MAIN DROP AREA-->
                        
                      </div>
                    </div>
                  </div>
                  
                
                </div>
                <!--End primary template-->
                
                <!--Output frames-->
                
                <template v-for="block in getBlockFrames">
                
                  <div class="uip-flex uip-flex-column" :id="'block-frame-wrap-' + block.uid" :class="uiTemplate.isPreview ? 'uip-opacity-0' : ''">
                  
                  
                    <div class="uip-background-muted uip-border uip-flex uip-gap-xs uip-flex-center uip-padding-xxs uip-margin-bottom-s" :style="returnScale"
                    style="border-radius: calc( var(--uip-border-radius) + var(--uip-padding-xxs) );"
                    :id="'block-frame-title-' + block.uid"
                    :class="uiTemplate.isPreview ? 'uip-opacity-0' : ''">
                    
                      <div :title="ui.strings.preview" class="uip-icon uip-border-rounder" style="">crop_free</div>
                      <div class="uip-text-muted uip-text-s uip-flex-grow uip-no-wrap uip-overflow-hidden uip-text-ellipsis">{{block.name}} {{ui.strings.frame}}</div>
                      
                    </div>
                    
                    
                    <!--Frame content-->
                    <div class="uip-position-relative uip-frame-content">
                    
                      <div class="uip-text-normal uip-body-font uip-background-default uip-border-round uip-border uip-min-h-300 uip-min-w-200 uip-overflow-visible uip-block-canvas uip-flex uip-flex-column" 
                      :id="'block-frame-' + block.uid">
                      
                        
                          <!--BLOCK MAIN DROP AREA-->
                          <uip-content-area :content="block.content" :returnData="function(data) {block.content = data}" class="user-style-area uip-w-100p uip-flex-grow"/>
                          <!--END OF MAIN DROP AREA-->
                        
                      </div>
                    
                    </div>
                    
                    
                  </div>  
                
                </template>
                
                <!--Endframes-->
              
              </div>
              
          
          
        </div>
        <!--end of preview area -->
        
        
        <div class="uip-position-fixed uip-bottom-0 uip-left-50p uip-translateX--50p uip-z-index-1" style="bottom:32px">
          
          
          
            <div class="uip-flex uip-flex-center uip-padding-xs uip-background-default uip-shadow uip-border" style="border-radius: calc( var(--uip-border-radius-large) + var(--uip-padding-xs) )">
               
                
                
                
                <dropdown pos="top left">
                  
                  <template v-slot:trigger>
                
                    <div class="uip-background-muted uip-padding-xxs uip-border-rounder uip-flex uip-gap-s uip-flex-between uip-link-default uip-flex-center">
                        <div class="">{{returnHumanZoom}}</div>
                        <div class="uip-icon uip-text-l">expand_less</div>
                    </div>
                  
                  </template>
                  
                  <template v-slot:content>
                    <div class="uip-padding-xs uip-flex uip-flex-column uip-text-s">
                      
                      <div class="uip-flex uip-flex-row uip-flex-center uip-gap-xs uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-gap-l uip-flex-between uip-link-default" @click="zoom(-0.1)">
                        
                        <div class="uip-no-wrap">{{ui.strings.zoomOut}}</div>
                        <div class="uip-flex uip-flex-center uip-text-muted uip-gap-xxxs">
                          
                          <span class="uip-command-icon"></span>
                          <span class="uip-icon" style="line-height:0">remove</span>
                          
                        </div>
                        
                      </div> 
                      
                      <div class="uip-flex uip-flex-row uip-flex-center uip-gap-xs uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-gap-l uip-flex-between uip-link-default" @click="zoom(0.1)">
                        
                        <div class="uip-no-wrap">{{ui.strings.zoomIn}}</div>
                        <div class="uip-flex uip-flex-center uip-text-muted uip-gap-xxxs">
                        
                          <span class="uip-command-icon"></span>
                          <span class="uip-icon" style="line-height:0">add</span>
                          
                        </div>
                        
                      </div> 
                      
                      
                      <div class="uip-flex uip-flex-row uip-flex-center uip-gap-xs uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-gap-l uip-flex-between uip-link-default" @click="fitCanvas()">
                        
                        <div class="uip-no-wrap">{{ui.strings.zoom100}}</div>
                        <div class="uip-flex uip-flex-center uip-text-muted uip-gap-xxxs">
                        
                          <span class="uip-command-icon"></span>
                          <span class="uip-icon" style="line-height:0">exposure_zero</span>
                          
                        </div>
                        
                      </div> 
                      
                      
                      
                    </div>
                  </template>
                
                </dropdown>
                
                <div class=" uip-margin-left-xs uip-margin-right-xs uip-h-20"></div>
                
                
                
                
               
                
                <div :title="ui.strings.recenter" class="hover:uip-background-muted uip-padding-xxxs uip-border-round uip-flex uip-flex-center  uip-icon uip-link-default uip-text-xl uip-ratio-1-1 uip-line-height-1 uip-icon-medium" @click="setCanvasPosition()">
                center_focus_strong
                </div>
                
                <div :title="ui.strings.showGridLines" class="hover:uip-background-muted uip-padding-xxxs uip-border-round uip-flex uip-flex-center  uip-icon uip-link-default uip-text-xl uip-ratio-1-1 uip-line-height-1 uip-icon-medium" @click="toggleDisplay()" :class="{'uip-background-grey uip-text-emphasis' : uiTemplate.display != 'preview'}">
                grid_3x3
                </div>
                
                <!-- Dark mode -->
                <div :title="ui.strings.darkMode" class="hover:uip-background-muted uip-padding-xxxs uip-border-round uip-flex uip-flex-center  uip-icon uip-link-default uip-text-xl uip-ratio-1-1 uip-line-height-1 uip-icon-medium" @click="toggleDarkMode()">
                {{returnThemeIcon}}
                </div>
                
                
                  
                
                
                
              
            </div>
          
        </div>
        
        
        
        <!-- End right click -->
      </div>
      
      
      
      
      <blockControl/>
      
      `,
};
