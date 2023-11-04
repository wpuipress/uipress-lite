export default {
  data() {
    return {
      mountedFonts: [],
    };
  },
  computed: {},
  methods: {
    /**
     * Returns block styles as css string
     *
     * @since 3.2.13
     */
    returnBlockStylesAsCss(block) {
      const blockParts = this.returnBlockParts(block);
      // No style to process
      if (!blockParts.length) return;

      let masterSelector = `#${block.uid}`;
      let innerStyles = "";
      let pseudoString = "";
      // Dark styles
      let darkInnerStyles = "";
      let darkPseudoString = "";

      for (let stylePart of blockParts) {
        let subSelector = stylePart.class ? `${masterSelector} ${stylePart.class}` : masterSelector;
        subSelector = subSelector.startsWith(":") ? `${masterSelector}${subSelector}` : subSelector;
        const subSelectorEnd = `}`;

        // Handle light styles
        let { substyle, formattedPseudo } = this.processBlockPartStyleSection(stylePart, "value");
        pseudoString += formattedPseudo.length ? this.handleParsedPseudos(formattedPseudo, masterSelector, subSelector, subSelectorEnd) : "";
        innerStyles += substyle ? `${subSelector} { ${substyle} }` : "";

        // Handle dark styles
        let { substyle: darkSubstyle, formattedPseudo: darkFormattedPseudo } = this.processBlockPartStyleSection(stylePart, "darkValue");
        darkPseudoString += darkFormattedPseudo.length ? this.handleParsedPseudos(darkFormattedPseudo, masterSelector, `[data-theme="dark"] ${subSelector}`, subSelectorEnd) : "";
        darkInnerStyles += darkSubstyle ? `[data-theme="dark"] ${subSelector} { ${darkSubstyle} }` : "";
      }

      // Light styles
      let setStyles = innerStyles.trim() ? innerStyles : "";
      setStyles += pseudoString.trim() ? pseudoString : "";

      let darkSetStyles = darkInnerStyles.trim() ? darkInnerStyles : "";
      darkSetStyles += darkPseudoString.trim() ? darkPseudoString : "";

      return setStyles + darkSetStyles;
    },

    /**
     * Handles array of pseudo styles
     *
     * @param {Array} formattedPseudo - the formatted array of pseudo styles
     * @param {String} masterSelector - the main block selector
     * @param {String} subSelector - the current sub selector
     * @param {String} subSelectorEnd - the ending for subselector if it exists
     * @since 3.2.13
     */
    handleParsedPseudos(formattedPseudo, masterSelector, subSelector, subSelectorEnd) {
      if (!Array.isArray(formattedPseudo)) return "";

      let innerStyles = "";
      let outerStyles = "";
      let outerKeys = [
        { key: ":menu-collapsed", selector: 'html[uip-menu-collapsed="true"]' },
        { key: "tablet", selector: ".uip-tablet-view" },
        { key: "mobile", selector: ".uip-phone-view" },
      ];

      // Loop through all inner styles
      for (let pseudo of formattedPseudo) {
        if (pseudo.key === "default") continue;

        // Item is for the outer css loop so process separately
        const outerKey = outerKeys.find((item) => item.key === pseudo.key);
        if (outerKey) {
          const spacer = subSelector.startsWith('[data-theme="dark"]') ? `` : ` `;
          outerStyles += pseudo.style.trim() ? `${outerKey.selector}${spacer}${subSelector} {  ${pseudo.style}  }` : "";
          continue;
        }

        const key = pseudo.key === ":active" ? `${subSelector}${pseudo.key}, ${subSelector}[active="true"]` : `${subSelector}${pseudo.key}`;
        innerStyles += pseudo.style ? `${key} { ${pseudo.style} }` : "";
      }

      let setStyles = innerStyles.trim() ? innerStyles : "";
      setStyles += outerStyles.trim() ? outerStyles : "";
      return setStyles;
    },

    /**
     * Returns block parts list
     *
     * @since 3.2.13
     */
    returnBlockParts(block) {
      const { moduleName, settings: blockSettings } = block;
      const allBlocks = this.uipApp.data.blocks;

      // No settings in the block so no css
      if (!this.isObject(blockSettings)) return [];

      const blockInfo = allBlocks.find((block) => block.moduleName === moduleName);

      if (!blockInfo || !blockInfo.optionsEnabled) return [];

      const keysToRemove = new Set(["advanced", "block"]);
      const registeredBlockSettings = blockInfo.optionsEnabled.filter((option) => !keysToRemove.has(option.name));

      return registeredBlockSettings
        .filter((registered) => registered.name in blockSettings && blockSettings[registered.name].options)
        .map((registered) => ({
          ...registered,
          styleSettings: blockSettings[registered.name].options,
          beforeContent: blockSettings[registered.name].beforeContent,
          afterContent: blockSettings[registered.name].afterContent,
        }));
    },

    /**
     * Processes an individual block part style section
     *
     * @param {Object} stylePart - the settings object
     * @param {String} property - The property value of the current color mode 'value' or 'darkValue'
     * @since 3.2.13
     */
    processBlockPartStyleSection(stylePart, property) {
      let substyle = "";
      let pseudoStyle = "";
      let formattedPseudo = [];
      const styleSettings = stylePart.styleSettings;

      // If it's not an object bail
      if (!this.isObject(styleSettings)) return substyle;

      const afterContent = stylePart.afterContent ? stylePart.afterContent : "";
      const beforeContent = stylePart.beforeContent ? stylePart.beforeContent : "";

      /** Process layout styles */
      substyle += this.isObject(styleSettings.flexLayout) ? this.processLayoutStyle(styleSettings.flexLayout, property) : "";
      pseudoStyle = this.hasNestedPath(styleSettings, "flexLayout", "pseudo")
        ? this.handlePseudoStyle(styleSettings.flexLayout.pseudo, this.processLayoutStyle, property, beforeContent, afterContent)
        : "";
      formattedPseudo = pseudoStyle.length ? [...formattedPseudo, ...pseudoStyle] : formattedPseudo;

      /** Process dimensions styles */
      substyle += this.isObject(styleSettings.dimensions) ? this.processDimensionsStyle(styleSettings.dimensions, property) : "";
      pseudoStyle = this.hasNestedPath(styleSettings, "dimensions", "pseudo")
        ? this.handlePseudoStyle(styleSettings.dimensions.pseudo, this.processDimensionsStyle, property, beforeContent, afterContent)
        : "";
      formattedPseudo = pseudoStyle.length ? [...formattedPseudo, ...pseudoStyle] : formattedPseudo;

      /** Process styling */
      substyle += this.isObject(styleSettings.styles) ? this.processStylesStyle(styleSettings.styles, property) : "";
      pseudoStyle = this.hasNestedPath(styleSettings, "styles", "pseudo") ? this.handlePseudoStyle(styleSettings.styles.pseudo, this.processStylesStyle, property, beforeContent, afterContent) : "";
      formattedPseudo = pseudoStyle.length ? [...formattedPseudo, ...pseudoStyle] : formattedPseudo;

      /** Process spacing styles */
      substyle += this.isObject(styleSettings.spacing) ? this.processSpacingStyle(styleSettings.spacing, property) : "";
      pseudoStyle = this.hasNestedPath(styleSettings, "spacing", "pseudo") ? this.handlePseudoStyle(styleSettings.spacing.pseudo, this.processSpacingStyle, property, beforeContent, afterContent) : "";
      formattedPseudo = pseudoStyle.length ? [...formattedPseudo, ...pseudoStyle] : formattedPseudo;

      /** Process spacing styles */
      substyle += this.isObject(styleSettings.textFormat) ? this.processTextStyle(styleSettings.textFormat, property) : "";
      pseudoStyle = this.hasNestedPath(styleSettings, "textFormat", "pseudo")
        ? this.handlePseudoStyle(styleSettings.textFormat.pseudo, this.processTextStyle, property, beforeContent, afterContent)
        : "";
      formattedPseudo = pseudoStyle.length ? [...formattedPseudo, ...pseudoStyle] : formattedPseudo;

      /** Process Position styles */
      substyle += this.isObject(styleSettings.positionDesigner) ? this.processPositionStyle(styleSettings.positionDesigner, property) : "";
      pseudoStyle = this.hasNestedPath(styleSettings, "positionDesigner", "pseudo")
        ? this.handlePseudoStyle(styleSettings.positionDesigner.pseudo, this.processPositionStyle, property, beforeContent, afterContent)
        : "";
      formattedPseudo = pseudoStyle.length ? [...formattedPseudo, ...pseudoStyle] : formattedPseudo;

      /** Process Position styles */
      substyle += this.isObject(styleSettings.effectsDesigner) ? this.processEffectsStyle(styleSettings.effectsDesigner, property) : "";
      pseudoStyle = this.hasNestedPath(styleSettings, "effectsDesigner", "pseudo")
        ? this.handlePseudoStyle(styleSettings.effectsDesigner.pseudo, this.processEffectsStyle, property, beforeContent, afterContent)
        : "";
      formattedPseudo = pseudoStyle.length ? [...formattedPseudo, ...pseudoStyle] : formattedPseudo;

      return { substyle, formattedPseudo };
    },

    /**
     * Handles pseudo styles
     *
     * @param {Object} pseudo - the pseudo object
     * @param {Function} callBack - the callback function
     * @param {String} property - The property value of the current color mode 'value' or 'darkValue'
     * @param {String} beforeContent - The text for css content property for ::before
     * @param {String} afterContent - The text for css content property for ::after
     * @since 3.2.13
     */
    handlePseudoStyle(pseudo, callBack, property, beforeContent, afterContent) {
      const colorMode = property == "value" ? "light" : "dark";
      if (!(colorMode in pseudo)) return [];
      let styleString = [];

      if (this.isObject(pseudo[colorMode])) {
        for (const key in pseudo[colorMode]) {
          let pseudoStyles = callBack({ value: pseudo[colorMode][key] }, "value");

          pseudoStyles += key == "::before" ? `content:"${beforeContent}";` : "";
          pseudoStyles += key == "::after" ? `content:"${afterContent}";` : "";

          styleString.push({ key: key, style: pseudoStyles });
        }
      }

      return styleString;
    },

    /**
     * Processes block effects styles
     *
     * @param {Object} options - effects object
     * @param {String} property - The property value of the current color mode 'value' or 'darkValue'
     * @since 3.2.13
     */
    processEffectsStyle(options, property) {
      if (!this.isObject(options[property])) return "";
      const effects = options[property];

      let styleString = "";

      let transform = "";
      let filters = "";

      const translateX = this.hasNestedPath(effects, "transform", "translateX", "value");
      const translateXunits = this.hasNestedPath(effects, "transform", "translateX", "units");
      transform += translateX && translateXunits ? `translateX(${translateX}${translateXunits}) ` : "";

      let translateY = this.hasNestedPath(effects, "transform", "translateY", "value");
      let translateYunits = this.hasNestedPath(effects, "transform", "translateY", "units");
      transform += translateY && translateYunits ? `translateY(${translateY}${translateXunits}) ` : "";

      let scaleX = this.hasNestedPath(effects, "transform", "scaleX");
      transform += scaleX ? `scaleX(${scaleX}) ` : "";

      let scaleY = this.hasNestedPath(effects, "transform", "scaleY");
      transform += scaleY ? `scaleY(${scaleY}) ` : "";

      let rotateX = this.hasNestedPath(effects, "transform", "rotateX");
      transform += rotateX ? `rotateX(${rotateX}deg) ` : "";

      let rotateY = this.hasNestedPath(effects, "transform", "rotateY");
      transform += rotateY ? `rotateY(${rotateY}deg) ` : "";

      let rotateZ = this.hasNestedPath(effects, "transform", "rotateZ");
      transform += rotateZ ? `rotateZ(${rotateZ}deg) ` : "";

      let skewX = this.hasNestedPath(effects, "transform", "skewX");
      transform += skewX ? `skewX(${skewX}deg) ` : "";

      let skewY = this.hasNestedPath(effects, "transform", "skewY");
      transform += skewY ? `skewY(${skewY}deg) ` : "";

      styleString += transform ? `transform:${transform};` : "";

      // mixBlendMode
      let mixBlendMode = this.hasNestedPath(effects, "filters", "mixBlendMode");
      styleString += mixBlendMode ? `mix-blend-mode:${mixBlendMode};` : "";

      // grayscale
      let grayscale = this.hasNestedPath(effects, "filters", "grayscale");
      filters += grayscale ? `grayscale(${grayscale}) ` : "";

      //blur
      let blur = this.hasNestedPath(effects, "filters", "blur");
      filters += blur ? `blur(${blur}px) ` : "";

      // saturate
      let saturate = this.hasNestedPath(effects, "filters", "saturate");
      filters += saturate ? `saturate(${saturate}) ` : "";

      // contrast
      let contrast = this.hasNestedPath(effects, "filters", "contrast");
      filters += contrast ? `contrast(${contrast}) ` : "";

      // backdropBlur
      let backdropBlur = this.hasNestedPath(effects, "filters", "backdropBlur");
      styleString += backdropBlur ? `backdrop-filter:blur(${backdropBlur}px);` : "";

      // Push all filters to style
      styleString += filters ? `filter:${filters};` : "";

      // Transition animations
      let transitionType = this.hasNestedPath(effects, "transitionType");
      let transitionTime = this.hasNestedPath(effects, "transitionTime");
      let transitionDelay = this.hasNestedPath(effects, "transitionDelay");
      let cursor = this.hasNestedPath(effects, "cursor");

      styleString += transitionType && !this.isUnDefined(transitionTime) ? `transition:all ${transitionType} ${transitionTime}s;` : "";
      styleString += transitionDelay ? `transition-delay: ${transitionDelay}s;` : "";
      styleString += cursor ? `cursor: ${cursor};` : "";

      return styleString;
    },

    /**
     * Processes block position styles
     *
     * @param {Object} options - position object
     * @param {String} property - The property value of the current color mode 'value' or 'darkValue'
     * @since 3.2.13
     */
    processPositionStyle(options, property) {
      if (!this.isObject(options[property])) return "";
      const position = options[property];

      let styleString = "";

      styleString += position.position ? `position:${position.position};` : "";
      styleString += position.display ? `display:${position.display};` : "";
      styleString += !this.isUnDefined(position.zIndex) ? `z-index:${position.zIndex};` : "";

      const offsetUnits = this.hasNestedPath(position, "offset", "units");
      if (offsetUnits) {
        styleString += !this.isUnDefined(position.offset.left) ? `left:${position.offset.left}${offsetUnits};` : "";
        styleString += !this.isUnDefined(position.offset.top) ? `top:${position.offset.top}${offsetUnits};` : "";
        styleString += !this.isUnDefined(position.offset.right) ? `right:${position.offset.right}${offsetUnits};` : "";
        styleString += !this.isUnDefined(position.offset.bottom) ? `bottom:${position.offset.bottom}${offsetUnits};` : "";
      }

      styleString += position.verticalAlign == "top" ? "margin-bottom: auto;" : "";
      styleString += position.verticalAlign == "bottom" ? "margin-top: auto;" : "";
      styleString += position.verticalAlign == "center" ? "margin-top: auto;margin-bottom: auto;" : "";

      styleString += position.horizontalAlign == "left" ? "margin-right: auto;" : "";
      styleString += position.horizontalAlign == "right" ? "margin-left:auto;align-self: flex-end;" : "";
      styleString += position.horizontalAlign == "center" ? "margin-right:auto;margin-left:auto;align-self: center;" : "";

      return styleString;
    },

    /**
     * Processes block text styles
     *
     * @param {Object} options - text object
     * @param {String} property - The property value of the current color mode 'value' or 'darkValue'
     * @since 3.2.13
     */
    processTextStyle(options, property) {
      if (!this.isObject(options[property])) return "";
      const text = options[property];

      let preset = this.hasNestedPath(text, "size", "preset");
      const fontSize = this.hasNestedPath(text, "size", "value");
      const lineHeight = this.hasNestedPath(text, "lineHeight", "value");
      const spacing = this.hasNestedPath(text, "spacing", "value");

      let styleString = "";

      if (preset && preset != "custom") {
        preset = preset.toUpperCase();
        styleString += preset == "XS" ? `font-size: var(--uip-text-xs);` : "";
        styleString += preset == "SMALL" || preset == "S" ? `font-size: var(--uip-text-s);` : "";
        styleString += preset == "MEDIUM" || preset == "M" ? `font-size: var(--uip-text-m);` : "";
        styleString += preset == "LARGE" || preset == "L" ? `font-size: var(--uip-text-l);` : "";
        styleString += preset == "XL" ? `font-size: var(--uip-text-xl);` : "";
      }

      if (preset == "custom" && fontSize) {
        styleString += text.size.units ? `font-size:${fontSize}${text.size.units};` : "";
      }

      if (lineHeight) {
        styleString += text.lineHeight.units ? `line-height:${lineHeight}${text.lineHeight.units};` : "";
      }

      if (spacing) {
        styleString += text.spacing.units ? `letter-spacing:${spacing}${text.spacing.units};` : "";
      }

      styleString += text.align ? `text-align: ${text.align};` : "";
      styleString += text.bold ? `font-weight: bold;` : "";
      styleString += text.italic || text.decoration == "italic" ? `font-style: italic;` : "";
      styleString += text.underline || text.decoration == "underline" ? `text-decoration: underline;` : "";
      styleString += text.strikethrough || text.decoration == "strikethrough" ? `text-decoration: strikethrough;` : "";
      styleString += !this.isUnDefined(text.weight) ? `font-weight: ${text.weight};` : "";
      styleString += text.transform ? `text-transform: ${text.transform};` : "";

      if (this.isObject(text.color)) {
        styleString += text.color.value ? `color: ${this.handleColorOutput(text.color.value)};` : "";
      }

      /** Font family */
      styleString += text.font && text.font != "custom" ? `font-family: ${text.font};` : "";
      /** Custom font family */
      styleString += text.customName && text.font == "custom" ? `font-family: ${text.customName};` : "";

      if (!this.mountedFonts.includes(text.customURL) && text.customURL) {
        // Create a new style element
        const style = document.createElement("style");
        style.textContent = `@import url('${text.customURL}');`;
        // Append the style element to the document's head
        document.head.appendChild(style);
        this.mountedFonts.push(text.customURL);
      }

      return styleString;
    },

    /**
     * Processes block layout styles
     *
     * @param {Object} options - spacing object
     * @param {String} property - The property value of the current color mode 'value' or 'darkValue'
     * @since 3.2.13
     */
    processSpacingStyle(options, property) {
      if (!this.isObject(options[property])) return "";
      const spacing = options[property];

      let styleString = "";
      const padding = spacing.padding;
      const margin = spacing.margin;

      /** No spacing to exit */
      if (!padding && !margin) return styleString;

      const handleSpacing = (obj, type) => {
        let style = "";
        const preset = obj.preset;

        /** Has preset */
        if (preset && preset !== "custom") {
          style += preset == "0" ? `${type}: 0;` : "";
          style += preset == "XS" ? `${type}: var(--uip-${type}-xxs);` : "";
          style += preset == "S" ? `${type}: var(--uip-${type}-xs);` : "";
          style += preset == "M" ? `${type}: var(--uip-${type}-s);` : "";
          style += preset == "L" ? `${type}: var(--uip-${type}-m);` : "";
          style += preset == "XL" ? `${type}: var(--uip-${type}-l);` : "";
          return style;
        }

        if (preset == "custom" && obj.sync) {
          style = !this.isUnDefined(obj.left) && obj.units ? `${type}:${obj.left}${obj.units};` : "";
          return style;
        }

        if (preset == "custom" && !obj.sync) {
          if (!obj.units) return "";
          style += !this.isUnDefined(obj.left) ? `${type}-left:${obj.left}${obj.units};` : "";
          style += !this.isUnDefined(obj.top) ? `${type}-top:${obj.top}${obj.units};` : "";
          style += !this.isUnDefined(obj.right) ? `${type}-right:${obj.right}${obj.units};` : "";
          style += !this.isUnDefined(obj.bottom) ? `${type}-bottom:${obj.bottom}${obj.units};` : "";
          return style;
        }
      };

      /** Padding */
      styleString += padding ? handleSpacing(padding, "padding") : "";
      /** Margin */
      styleString += margin ? handleSpacing(margin, "margin") : "";

      return styleString;
    },

    /**
     * Processes block layout styles
     *
     * @param {Object} options - flex layout object
     * @param {String} property - The property value of the current color mode 'value' or 'darkValue'
     * @since 3.2.13
     */
    processLayoutStyle(options, property) {
      if (!this.isObject(options[property])) return "";
      const layout = options[property];

      switch (layout.type) {
        case "grid":
          return this.generateGridStyles(layout);
        case "stack":
          return this.generateStackStyles(layout);
        default:
          return "";
      }
    },

    /**
     * Generates grid css
     *
     * @param {Object} value - the grid object
     * @since 3.2.13
     */
    generateGridStyles(value) {
      let style = "display:grid;";

      // Check required values
      if (!value.columns) return "";
      if (!value.columnWidth) return "";
      if (this.isUnDefined(value.columnWidth.value)) return "";

      /**  Process responsive grid styles */
      if (!value.responsive) {
        style += `grid-template-columns: repeat(${value.columns}, minmax(${value.columnWidth.value}${value.columnWidth.units}, 1fr));`;
        style += "justify-content: center;";
        style += "grid-auto-rows: minmax(0, 1fr);";
        style += `grid-template-rows: repeat(${value.rows}, minmax(0, 1fr));`;
        if ("gap" in value) {
          style += `gap: ${value.gap.value}${value.gap.units};`;
        }
      } else {
        /**  Process grid styles */
        style += `
		  --grid-layout-gap: ${value.gap.value}${value.gap.units};
		  --grid-column-count:${value.columns};
		  --grid-item--min-width: ${value.minColumnWidth.value}${value.minColumnWidth.units};
		  --gap-count: calc(var(--grid-column-count) - 1);
		  --total-gap-width: calc(var(--gap-count) * var(--grid-layout-gap));
		  --grid-item--max-width: calc((100% - var(--total-gap-width)) / var(--grid-column-count));
		  grid-template-columns: repeat(auto-fill, minmax(max(var(--grid-item--min-width), var(--grid-item--max-width)), 1fr));
		  grid-gap: var(--grid-layout-gap);
		  grid-auto-rows: min-content;
		`;
      }
      return style;
    },

    /**
     * Generates flexbox / stack styles css
     *
     * @param {Object} value - the grid object
     * @since 3.2.13
     */
    generateStackStyles(value) {
      let style = "display:flex;";

      style += value.direction ? `flex-direction: ${value.direction};` : "";
      style += value.distribute ? `justify-content: ${value.distribute};` : "";
      style += value.align ? `align-items: ${value.align};` : "";
      style += value.wrap ? `flex-wrap: ${value.wrap};` : "";
      style += value.placeContent ? `align-content: ${value.placeContent};` : "";

      if ("gap" in value) {
        style += value.gap.value && value.gap.units ? `gap: ${value.gap.value}${value.gap.units};` : "";
      }
      return style;
    },

    /**
     * Processes block dimensions styles
     *
     * @param {Object} options - dimensions object
     * @param {String} property - The property value of the current color mode 'value' or 'darkValue'
     * @since 3.2.13
     */
    processDimensionsStyle(options, property) {
      if (!this.isObject(options[property])) return "";
      const dimensions = options[property];

      let style = "";

      /** Width */
      if (this.isObject(dimensions.width)) {
        style += !this.isUnDefined(dimensions.width.value) && dimensions.width.units ? `width:${dimensions.width.value}${dimensions.width.units};` : "";
      }

      /** Max width */
      if (this.isObject(dimensions.maxWidth)) {
        style += !this.isUnDefined(dimensions.maxWidth.value) && dimensions.maxWidth.units ? `max-width:${dimensions.maxWidth.value}${dimensions.maxWidth.units};` : "";
      }

      /** Min width */
      if (this.isObject(dimensions.minWidth)) {
        style += !this.isUnDefined(dimensions.minWidth.value) && dimensions.minWidth.units ? `min-width:${dimensions.minWidth.value}${dimensions.minWidth.units};` : "";
      }

      /** Height */
      if (this.isObject(dimensions.height)) {
        style += !this.isUnDefined(dimensions.height.value) && dimensions.height.units ? `height:${dimensions.height.value}${dimensions.height.units};` : "";
      }

      /** Min height */
      if (this.isObject(dimensions.minHeight)) {
        style += !this.isUnDefined(dimensions.minHeight.value) && dimensions.minHeight.units ? `min-height:${dimensions.minHeight.value}${dimensions.minHeight.units};` : "";
      }

      /** Max height */
      if (this.isObject(dimensions.maxHeight)) {
        style += !this.isUnDefined(dimensions.maxHeight.value) && dimensions.maxHeight.units ? `max-height:${dimensions.maxHeight.value}${dimensions.maxHeight.units};` : "";
      }

      style += dimensions.grow === "grow" ? `flex-grow:1;` : "";
      style += dimensions.flexShrink === "shrink" ? `flex-shrink:1;` : "";
      style += dimensions.flexShrink === "none" ? `flex-shrink:0;` : "";

      return style;
    },

    /**
     * Processes block styles into css
     *
     * @param {Object} options - styles object
     * @param {String} property - The property value of the current color mode 'value' or 'darkValue'
     * @since 3.2.13
     */
    processStylesStyle(options, property) {
      let styleString = "";

      if (!this.isObject(options[property])) return styleString;
      const styles = options[property];

      /** Opacity */
      styleString += !this.isUnDefined(styles.opacity) ? `opacity: ${styles.opacity};` : "";
      /** Overflow */
      styleString += styles.overflow ? `overflow: ${styles.overflow};` : "";

      /** Outline */
      const outline = this.hasNestedPath(styles, "outline");
      if (this.hasNestedPath(outline, "width", "value") && this.hasNestedPath(outline, "color", "value")) {
        const outlineWidth = outline.width;
        const outlineColor = this.handleColorOutput(outline.color.value);
        const outlineOffset = outline.offset;
        const hasRequiredVals = !this.isUnDefined(outlineWidth.value) && outlineWidth.units && outline.style && outlineColor;
        styleString += hasRequiredVals ? `outline:${outlineWidth.value}${outlineWidth.units} ${outline.style} ${outlineColor};` : "";
      }
      /** Outline offset */
      if (this.hasNestedPath(outline, "offset", "value")) {
        const hasOffset = !this.isUnDefined(outline.offset.value) && outline.offset.units;
        styleString += hasOffset ? `outline-offset:${outline.offset.value}${outline.offset.units};` : "";
      }

      /** Background color / gradient */
      if (this.hasNestedPath(styles, "fill", "value")) {
        const fillColor = styles.fill.value ? this.handleColorOutput(styles.fill.value) : "";
        const gradient = fillColor.includes("gradient") ? true : false;

        if (gradient) styleString += fillColor ? `background: ${fillColor};` : "";
        if (!gradient) styleString += fillColor ? `background-color: ${fillColor};` : "";
      }

      /** Background Image */
      if (this.hasNestedPath(styles, "backgroundImage", "url")) {
        const bgImage = styles.backgroundImage.url;
        styleString += bgImage ? `background-image: url(${bgImage});` : "";

        /** Background sizing */
        if (this.hasNestedPath(styles, "backgroundImage", "sizing")) {
          const bgSizing = styles.backgroundImage.sizing;
          styleString += bgSizing.position ? `background-position:${bgSizing.position};` : "";
          styleString += bgSizing.repeat ? `background-repeat:${bgSizing.repeat};` : "";
          styleString += bgSizing.size ? `background-size:${bgSizing.size};` : `background-size:contain;`;
        }
      }

      /** Borders */
      if (styles.borders && Array.isArray(styles.borders)) {
        for (let border of styles.borders) {
          styleString += this.processBorderStyle(border);
        }
      }

      /** Master Border radius */
      if (this.hasNestedPath(styles, "radius", "topleft")) {
        const borderRadius = styles.radius;

        /** Border synced */
        if (borderRadius.sync && borderRadius.units) {
          styleString += !this.isUnDefined(borderRadius.topleft) && borderRadius.units ? `border-radius: ${borderRadius.topleft}${borderRadius.units};` : "";
        }
        // Unlinked border
        else if (borderRadius.units) {
          const topleft = !this.isUnDefined(borderRadius.topleft) ? borderRadius.topleft + borderRadius.units : 0;
          const topright = !this.isUnDefined(borderRadius.topright) ? borderRadius.topright + borderRadius.units : 0;
          const bottomright = !this.isUnDefined(borderRadius.bottomright) ? borderRadius.bottomright + borderRadius.units : 0;
          const bottomleft = !this.isUnDefined(borderRadius.bottomleft) ? borderRadius.bottomleft + borderRadius.units : 0;
          styleString += `border-radius: ${topleft} ${topright} ${bottomright} ${bottomleft};`;
        }
      }

      /** Shadows */
      if (styles.shadows && Array.isArray(styles.shadows)) {
        styleString += this.processShadowStyle(styles.shadows);
      }

      return styleString;
    },

    /**
     * Processes border style object
     *
     * @param {Object} border
     * @since 3.2.13
     */
    processBorderStyle(border = {}) {
      let styleString = "";

      let borderColor = this.hasNestedPath(border, "color", "value");
      let borderPosition = this.hasNestedPath(border, "position");
      let borderStyle = this.hasNestedPath(border, "style");
      let borderWidth = this.hasNestedPath(border, "width", "value");
      let borderUnits = this.hasNestedPath(border, "width", "units");
      let borderRadius = this.hasNestedPath(border, "radius", "value");

      /** Exit early if no border colour and no border radius */
      if (!borderColor && !borderRadius) return styleString;

      /** If there is a border color then output border */
      if (borderColor && borderWidth && borderUnits) {
        let borderPosMap = {
          solid: "border:",
          left: "border-left:",
          right: "border-right:",
          top: "border-top:",
          bottom: "border-bottom:",
        };

        let borderPos = borderPosMap[borderPosition] || "";
        borderColor = this.handleColorOutput(borderColor);

        styleString += `${borderPos}${borderWidth}${borderUnits} ${borderStyle} ${borderColor};`;
      }

      /** No border radius so exit */
      if (!borderRadius) return styleString;

      /**   Border radius */
      if (borderRadius.sync) {
        styleString += !this.isUnDefined(borderRadius.topleft) && borderRadius.units ? `border-radius: ${borderRadius.topleft}${borderRadius.units};` : "";
      } else if (borderRadius.units) {
        const topleft = !this.isUnDefined(borderRadius.topleft) ? borderRadius.topleft + borderRadius.units : 0;
        const topright = !this.isUnDefined(borderRadius.topright) ? borderRadius.topright + borderRadius.units : 0;
        const bottomright = !this.isUnDefined(borderRadius.bottomright) ? borderRadius.bottomright + borderRadius.units : 0;
        const bottomleft = !this.isUnDefined(borderRadius.bottomleft) ? borderRadius.bottomleft + borderRadius.units : 0;
        styleString += `border-radius: ${topleft} ${topright} ${bottomright} ${bottomleft};`;
      }

      return styleString;
    },

    /**
     * Processes border style object
     *
     * @param {Array} shadows
     * @since 3.2.13
     */
    processShadowStyle(shadows = []) {
      let styleString = "";
      let formattedShadows = "";
      let formattedInsideShadows = [];

      for (let shadow of shadows) {
        let shadowColour = this.hasNestedPath(shadow, "color", "value");
        let horiz = this.hasNestedPath(shadow, "verticalDistance", "value");
        let vert = this.hasNestedPath(shadow, "verticalDistance", "value");
        let blur = this.hasNestedPath(shadow, "blur", "value");
        let position = this.hasNestedPath(shadow, "position");

        /** Exit if not shadow color */
        if (!shadowColour || !horiz || !vert || !blur) continue;

        shadowColour = this.handleColorOutput(shadowColour);

        const shadowValue = `${horiz}px ${vert}px ${blur}px ${shadowColour}`;
        if (position === "inside") {
          formattedInsideShadows.push(`inset ${shadowValue}`);
        } else {
          formattedShadows += `drop-shadow(${shadowValue}) `;
        }
      }

      styleString += formattedShadows ? `filter: ${formattedShadows};` : "";
      styleString += formattedInsideShadows.length ? `box-shadow: ${formattedInsideShadows.join(",")};` : "";

      return styleString;
    },
    /**
     * Handles colour variables output
     *
     * @param {Object}
     * @since 3.2.13
     */
    handleColorOutput(value) {
      if (!value) return;
      const color = value.trim();
      if (color.startsWith("--")) return `var(${color})`;
      return color;
    },
  },
};
