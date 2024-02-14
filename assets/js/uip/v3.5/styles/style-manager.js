const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent } from "../../../libs/vue-esm.js";

export default {
  components: {
    colorSelect: defineAsyncComponent(() => import("../libs/colorpicker.js")),
    contextmenu: defineAsyncComponent(() => import("../utility/contextmenu.min.js?ver=3.3.1")),
  },
  props: {
    currentColor: String,
    returnData: Function,
    actualValue: String,
  },
  data() {
    return {
      contextIndex: false,
      scrollBottom: false,
      showSearch: false,
      search: "",
      strings: {
        styles: __("Styles", "uipress-lite"),
        create: __("Create", "uipress-lite"),
        delete: __("Delete", "uipress-lite"),
        duplicate: __("Duplicate", "uipress-lite"),
        edit: __("Edit", "uipress-lite"),
        createShades: __("Create shades", "uipress-lite"),
        copyVariable: __("Copy variable", "uipress-lite"),
        searchStyles: __("Search styles", "uipress-lite"),
      },
    };
  },
  watch: {
    /**
     * Watches changes to styles and then saves
     *
     * @since 3.2.13
     */
    "uipApp.data.themeStyles": {
      handler() {
        this.saveStyles();
      },
      deep: true,
    },
  },
  computed: {
    /**
     * Returns the value for the given colour mode (light / dark)
     *
     * @since 3.2.13
     */
    returnActiveMode() {
      if (!this.uipApp.data.userPrefs.darkTheme) return "value";
      if (this.uipApp.data.userPrefs.darkTheme) return "darkValue";
    },
    /**
     * Checks whether a given style is active
     *
     * @since 3.2.13
     */
    activeStyle() {
      if (!this.actualValue) return;
      if (!this.actualValue.includes("--")) return;
      return this.actualValue;
    },
    /**
     * Returns user styles if exists
     *
     * @return {Object} - user styles object
     * @since 3.2.13
     */
    returnUserStyles() {
      let styles = this.uipApp.data.themeStyles;
      if (!styles) this.uipApp.data.themeStyles = {};
      let search = this.search.toLowerCase();

      return Object.entries(this.uipApp.data.themeStyles)
        .filter(([key, item]) => {
          item.name = key; // Assign the name here
          return (item.type === "color" || !("name" in item)) && this.maybeToLowerCase(item.name).includes(search);
        })
        .map(([key, item]) => {
          item.type = "color";
          return item;
        });
    },
    /**
     * Checks if the given var can be deleted
     *
     * @return {Boolean} - whether the var can be deleted
     * @since 3.2.13
     */
    canDeleteVar() {
      if (this.contextIndex === false) return true;
      if (!this.uipApp.data.themeStyles[this.contextIndex]) return false;
      if (this.uipApp.data.themeStyles[this.contextIndex].user) return false;
      return true;
    },
  },
  methods: {
    /**
     * Checks a string before lowercasing it
     *
     * @param {string} str
     * @since 3.3.02
     */
    maybeToLowerCase(str) {
      return str ? str.toLowerCase() : "";
    },
    /**
     * Saves users styles
     *
     * @returns {Promise}  - whether styles where saved succesfully
     * @since 3.2.13
     */
    async saveStyles() {
      // Format styles
      let stylesJson = JSON.stringify(this.uipApp.data.themeStyles);

      // Build form data for fetch request
      let formData = new FormData();
      formData.append("action", "uip_save_user_styles");
      formData.append("security", uip_ajax.security);
      formData.append("styles", stylesJson);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      // Error saving styles
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "uipress-lite", "", "error", true);
      }

      return true;
    },
    /**
     * Opens a new color picker screen for creating new color styles
     *
     * @since 3.2.13
     */
    addNewStyle() {
      const newColor = {
        name: "",
        type: "color",
        value: this.currentColor,
        darkValue: this.currentColor,
        user: true,
      };

      let screen = {
        component: "colourStyleEditor",
        label: __("New color style", "uipress-lite"),
        value: newColor,
        returnData: (d) => {
          this.uipApp.data.themeStyles[d.name] = d;
          this.$emit("go-back");
        },
      };

      this.$emit("request-screen", screen);
    },

    /**
     * Edits a color
     *
     * @since 3.2.13
     */
    editColor() {
      const color = this.uipApp.data.themeStyles[this.contextIndex];

      let screen = {
        component: "colourStyleEditor",
        label: __("Edit color style", "uipress-lite"),
        value: color,
        returnData: false,
      };

      this.$refs.colorcontext.close();
      this.$emit("request-screen", screen);
    },
    /**
     * Duplicates a color
     *
     * @since 3.2.13
     */
    duplicateColor() {
      const duplicate = this.uipApp.data.themeStyles[this.contextIndex];
      let newColor = JSON.parse(JSON.stringify(duplicate));
      newColor.name += "-copy";

      let screen = {
        component: "colourStyleEditor",
        label: __("New color style", "uipress-lite"),
        value: newColor,
        returnData: (d) => {
          this.seqlData.options.app_data.styles.push(d);
          this.$emit("go-back");
        },
      };

      this.$refs.colorcontext.close();
      this.$emit("request-screen", screen);
    },
    /**
     * Returns color style object
     *
     * @param {Object} color - variable object
     * @returns {Object} - color variable object
     * @since 3.2.13
     */
    setColor(color) {
      this.returnData(color);
    },

    /**
     * Watches for scroll to bottom of styles and sets gradient to hidden
     *
     * @param {Object} event - Scroll event
     * @since 3.2.13
     */
    checkForBottomScroll(event) {
      const target = event.target;

      // Check if scrolled to bottom
      if (target.scrollTop + target.clientHeight >= target.scrollHeight - 16) {
        this.scrollBottom = true;
      } else {
        this.scrollBottom = false;
      }
    },

    /**
     * Checks whether to show the var search
     *
     * @since 3.2.13
     */
    maybeHideSearch() {
      if (this.search.length === 0 || !this.search) {
        this.showSearch = false;
      }
    },
    /**
     * Returns the css background value
     *
     * @param {Object} style - style object
     * @since 3.2.13
     */
    returnStyleBackground(style) {
      const mode = this.returnActiveMode;
      if (!style[mode]) return `var(${style.name})`;
      if (style[mode].includes("--")) return `var(${style[mode]})`;
      return style[mode];
    },
  },

  template: `
  
	<div class="uip-flex uip-flex-column uip-row-gap-xs uip-position-relative">
	  
	  <div class="uip-flex uip-flex-between uip-flex-center">
	  
		<component is="style" scoped>
		  .searchfade-enter-active,
		  .searchfade-leave-active {
			transition: all 0.2s ease;
		  }
		  .searchfade-enter-from,
		  .searchfade-leave-to {
			opacity: 0;
			transform: translateX(30px);
		  }
		</component>
	  
		<Transition name="searchfade" mode="out-in">
		
		  <div key="title" v-if="!showSearch" class="uip-text-bold uip-text-emphasis" @mouseenter="showSearch = true;">{{ strings.styles }}</div>
		  
		  <!-- Search -->
		  <div key="search" v-else @mouseleave="maybeHideSearch" class="uip-flex uip-gap-xs uip-flex-center">
			<span class="uip-icon">search</span>
			<input class="uip-input uip-blank-input uip-text-s" type="text" @blur="maybeHideSearch" v-model="search" :placeholder="strings.searchStyles" autofocus>
		  </div>
		
		</Transition>
		
		<div @click="addNewStyle" 
		class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-default hover:uip-background-muted uip-border-rounder">
		  <span class="uip-icon">add</span>
		</div>
	  </div>
	  
	  
	  <div class="uip-flex uip-flex-column uip-max-h-160" @scroll="checkForBottomScroll" style="overflow:auto">
		
		
	  
		<template v-for="(style, index) in returnUserStyles">
		
		  <div @contextmenu.prevent.stop="contextIndex = style.name; $refs.colorcontext.show($event)" 
		  @click="setColor(style)"
		  :class="{'uip-background-muted' : activeStyle == style.name, 'hover:uip-background-muted' : activeStyle != style.name}"
		  class="uip-flex uip-gap-s uip-flex-center uip-padding-xxs uip-padding-left-xs uip-link-default uip-border-rounder">
		  
			<div class="uip-w-16 uip-border-circle uip-ratio-1-1 uip-background-checkered">
			  <div class="uip-w-16 uip-border-circle uip-ratio-1-1 uip-border" :style="{background:returnStyleBackground(style)}">
			  
			  </div>
			</div>
			
			<div class="">{{style.name}}</div>
			
		  </div>
		
		</template>
		
		
		
		
	  </div>
	  
	  <div class="uip-fade-in uip-position-absolute uip-bottom-0 uip-w-100p" v-if="!scrollBottom && search == ''" style="pointer-events: none">
		<div style="position:absolute;top:0px;background-image: linear-gradient(to top, var(--uip-color-base-0) , transparent);transform:translateY(-100%);height: 60px;width:100%;z-index:9"></div>
	  </div>
	  
	  
	  <contextmenu ref="colorcontext" :disableTeleport="true">
		  
		  <div class="uip-padding-xs uip-flex uip-flex-column uip-text-weight-normal uip-text-s">
			
			
			
			<a class="uip-link-default uip-flex uip-gap-m uip-flex-between uip-flex-center hover:uip-background-muted uip-border-round uip-padding-xxs"
			@click.prevent="editColor">
			  <span class="">{{strings.edit}}</span>
			  <span class="uip-icon">edit</span>
			</a>
			
			<a class="uip-link-default uip-flex uip-gap-m uip-flex-between uip-flex-center hover:uip-background-muted uip-border-round uip-padding-xxs"
			@click.prevent="duplicateColor">
			  <span class="">{{strings.duplicate}}</span>
			  <span class="uip-icon">content_copy</span>
			</a>
			
			<div class="uip-border-top uip-margin-top-xs uip-margin-bottom-xs "></div>
		  
			<a class="uip-link-danger uip-flex uip-gap-m uip-flex-between uip-flex-center hover:uip-background-muted uip-border-round uip-padding-xxs"
			@click.prevent="delete this.uipApp.data.themeStyles[contextIndex];$refs.colorcontext.close()" :class="{'uip-link-disabled' : canDeleteVar}">
			  <span class="">{{strings.delete}}</span>
			  <span class="uip-icon">delete</span>
			</a>
		  
		  </div>
	  
	  </contextmenu>
   
   
	</div>
		`,
};
