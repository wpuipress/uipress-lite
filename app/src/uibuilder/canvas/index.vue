<script>
/**
 * Builds the main ui builder shell
 * @since 3.0.0
 */
const { __ } = wp.i18n;
import { nextTick } from "vue";
import blockControl from "@/uibuilder/block-control/index.vue";
import AppButton from "@/components/app-button/index.vue";

export default {
  components: {
    blockControl,
    AppButton,
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
      canvasPosition: {
        left: "20px",
        top: "300px",
        "transform-origin": "left top",
      },
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
        if (newValue == "desktop") this.uiTemplate.windowWidth = "1000";
        if (newValue == "tablet") this.uiTemplate.windowWidth = "699";
        if (newValue == "phone") this.uiTemplate.windowWidth = "600";

        nextTick(() => {
          this.setCanvasPosition();
        });
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
        let zoom = this.ui.zoom;

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
    //this.initiateCanvas();
    //this.mountWatchers();
    //await this.$nextTick();
    //this.mounted = true;

    window.addEventListener("keydown", this.watchShortCuts);

    /* Set zoom */
    let zoom = parseFloat(this.uipApp.data.userPrefs.builderPrefersZoom);
    if (typeof zoom !== "undefined" && !isNaN(zoom)) this.ui.zoom = zoom;

    /* Set canvas position */
    await this.$nextTick();
    this.setCanvasPosition();
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

    /**
     * Returnscurrent position
     *
     * @since 3.2.0
     */
    returnCanvasPosition() {
      return { ...this.canvasPosition, transform: `scale(${this.ui.zoom})` };
    },

    /**
     * Return viewport class
     */
    returnViewPortClass() {
      const newValue = this.ui.viewDevice;

      if (newValue == "desktop") return "uip-desktop-view w-aspect-video w-[1600px] max-w-[1600px]";
      if (newValue == "tablet") return "uip-tablet-view w-[699px] max-w-[699px] aspect-[16/10]";
      if (newValue == "tablet") return "uip-phone-view w-[600px] max-w-[600px] aspect-[16/9]";
    },
  },
  methods: {
    /**
     * Removes active block on outside click
     *
     * @since 3.2.13
     */
    maybeRemoveActiveBlock() {
      // We are probably dragging
      if (this.uipApp.scrolling) return;

      this.uipApp.blockControl.removeActive();
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
      const container = this.$refs.canvasWrap;
      const canvas = this.$refs.maincanvas;

      // Calculate the unscaled width of the canvas
      const elementActualWidth = canvas.offsetWidth;

      const containerWidth = container.offsetWidth;

      // Calculate the scaling factor
      const scaleFactor = containerWidth / elementActualWidth;

      // Set the combined scale to the element
      this.ui.zoom = scaleFactor; // Multiply with existing scale to get combined scale
      await nextTick();
      this.setCanvasPosition();
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

      // Apply styles to div
      this.canvasPosition.top = `${currentTop}px`;
      this.canvasPosition.left = `${currentLeft}px`;
    },
    /**
     * Centres canvas position
     *
     * @since 3.2.13
     */
    setCanvasPosition() {
      // Get dimensions of the container
      const containerWidth = this.$refs.canvasWrap.offsetWidth;
      const containerHeight = this.$refs.canvasWrap.offsetHeight;

      // Get dimensions of the div
      const divWidth = this.$refs.maincanvas.offsetWidth * this.ui.zoom;
      const divHeight = this.$refs.maincanvas.offsetHeight * this.ui.zoom;

      // Calculate centred position for the div
      const centeredX = (containerWidth - divWidth) / 2;
      const centeredY = (containerHeight - divHeight) / 2;

      // Get left of container
      const rect = this.$refs.canvasWrap.getBoundingClientRect();

      // Apply styles to div
      this.canvasPosition.top = `${centeredY}px`;
      this.canvasPosition.left = `${centeredX + rect.left}px`;
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
      let maincanvas = this.$refs.maincanvas;
      let frameCanvases = this.$refs.framecanvases;
      let container = this.$refs.canvasWrap;

      //this.uipApp.scrolling = true;

      // Right click so bail
      if (e.button === 2) return;

      // Make sure we are not dragging on a block area
      if (maincanvas.contains(e.target)) return;

      /* Loop all sub canvases and check event location */
      for (let framecan of frameCanvases) {
        if (framecan.contains(e.target)) return;
      }

      // Prevent
      e.preventDefault();

      // Change the cursor and prevent user from selecting the text
      container.style.cursor = "grabbing";
      container.style.userSelect = "none";

      let currentTop = parseFloat(canvas.style.top || 0);
      let currentLeft = parseFloat(canvas.style.left || 0);

      pos = { left: currentLeft, top: currentTop, x: e.clientX, y: e.clientY };

      // Dragging state and threshold check
      let hasExceededThreshold = false;
      const dragThreshold = 10;

      const mouseMoveHandler = (e) => {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        if (!hasExceededThreshold) {
          if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
            hasExceededThreshold = true;

            // Update the canvas scroll state
            this.uipApp.scrolling = true;

            // Change the cursor and prevent user from selecting the text
            container.style.cursor = "grabbing";
            container.style.userSelect = "none";
          }
        }

        if (hasExceededThreshold) {
          // Scroll the element
          this.canvasPosition.top = `${pos.top + dy}px`;
          this.canvasPosition.left = `${pos.left + dx}px`;
        }
      };

      const mouseUpHandler = (e) => {
        // Set timeout so as to avoid triggering click handler on canvas container
        setTimeout(() => {
          // Update the canvas scroll state
          this.uipApp.scrolling = false;
        }, 100);

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
  },
};
</script>

<template>
  <component is="style" scoped>
    :root{
    <template v-for="item in uipApp.data.themeStyles">
      <template v-if="item.value">{{ item.name }}:{{ item.value }};</template>
    </template>
    } [data-theme="dark"], .uip-dark-mode {
    <template v-for="item in uipApp.data.themeStyles">
      <template v-if="item.darkValue"> {{ item.name }}:{{ item.darkValue }};</template>
    </template>
    }
    {{ returnTemplateCSS }}
  </component>
  <component is="script" scoped>
    {{ returnTemplateJS }}
  </component>

  <div
    class="grow h-full max-h-full max-w-full flex flex-col overflow-hidden bg-zinc-100 relative"
    ref="canvasWrap"
    @click="maybeRemoveActiveBlock"
    @wheel="scrollCanvas"
    @mousedown="handleCanvasDrag($event)"
  >
    <!-- Style container for editor -->
    <div id="uip-style-container"></div>

    <!--
    --
    -- Main canvas
    --
    -->
    <!-- Wrap containers -->
    <div class="grid grid-flow-col auto-cols-max w-max gap-16 fixed" :style="returnCanvasPosition" ref="framewrap">
      <!-- Main Canvas -->
      <div class="bg-white border border-zinc-200 rounded-lg canvas flex shadow-lg grow-0 shrink-0" :class="returnViewPortClass" ref="maincanvas">
        <uip-content-area :content="uiTemplate.content" :returnData="(data) => (uiTemplate.content = data)" class="user-style-area rounded-lg" />
      </div>

      <!--Loop block frames-->
      <div v-for="block in getBlockFrames" class="relative grow-0 shrink-0 h-full w-max" v-if="!uiTemplate.isPreview" ref="framecanvases">
        <div class="absolute pl-2 py-8 -translate-y-full">{{ block.name }} {{ ui.strings.frame }}</div>
        <div class="flex grow bg-white border border-zinc-200 rounded-lg shadow-lg min-w-[200px]">
          <uip-content-area :content="block.content" :returnData="(data) => (block.content = data)" class="user-style-area w-full grow rounded-lg" />
        </div>
      </div>
    </div>
    <!--
    --
    --
    -- Toolbar
    -- 
    -->
    <div class="fixed bottom-[32px] left-1/2 -translate-x-1/2 z-[1]" style="bottom: 32px">
      <div class="flex items-center p-2 bg-white shadow-lg border border-zinc-200 rounded-xl">
        <!-- Zoom Options -->
        <div class="px-2 text-sm text-zinc-400">{{ returnHumanZoom }}</div>

        <AppButton type="transparent" :title="ui.strings.zoomOut" @click="zoom(-0.1)">
          <AppIcon class="text-xl" icon="zoom_out" />
        </AppButton>

        <AppButton type="transparent" :title="ui.strings.zoomIn" @click="zoom(0.1)">
          <AppIcon class="text-xl" icon="zoom_in" />
        </AppButton>

        <AppButton type="transparent" :title="ui.strings.zoom100" @click="fitCanvas()">
          <AppIcon class="text-xl" icon="fit_screen" />
        </AppButton>

        <div class="border-l border-zinc-200 h-6 mx-2"></div>

        <!-- Canvas Options -->
        <AppButton type="transparent" :title="ui.strings.recenter" @click="setCanvasPosition()">
          <AppIcon class="text-xl" icon="center_focus_strong" />
        </AppButton>

        <AppButton type="transparent" :title="ui.strings.darkMode" @click="toggleDarkMode()">
          <AppIcon class="text-xl" :icon="returnThemeIcon" />
        </AppButton>

        <div class="border-l border-zinc-200 h-6 mx-2"></div>

        <!-- Responsive options -->
        <AppButton type="transparent" :title="ui.strings.desktop" @click="ui.viewDevice = 'desktop'">
          <AppIcon class="text-xl" icon="desktop" :class="ui.viewDevice == 'desktop' ? 'text-indigo-700' : ''" />
        </AppButton>

        <AppButton type="transparent" :title="ui.strings.tablet" @click="ui.viewDevice = 'tablet'">
          <AppIcon class="text-xl" icon="tablet" :class="ui.viewDevice == 'tablet' ? 'text-indigo-700' : ''" />
        </AppButton>

        <AppButton type="transparent" :title="ui.strings.mobile" @click="ui.viewDevice = 'phone'">
          <AppIcon class="text-xl" icon="phone" :class="ui.viewDevice == 'phone' ? 'text-indigo-700' : ''" />
        </AppButton>
      </div>
    </div>
  </div>

  <blockControl />
</template>
