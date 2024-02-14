export default {
  data() {
    return {};
  },
  computed: {
    /**
     * Returns blank list of interactions
     *
     * @since 3.3.095
     */
    returnBlankInteractions() {
      return {
        click: [],
        dblclick: [],
        mouseenter: [],
        mouseleave: [],
        focus: [],
        blur: [],
      };
    },
  },
  methods: {
    /**
     * Handles and mounts block interactions
     *
     * @param {object} block - the block object
     * @param {object} watchers - the watchers object
     * @since 3.3.095
     */
    handleBlockInteractions(block, watchers) {
      let formattedInteractions = JSON.parse(JSON.stringify(this.returnBlankInteractions));

      // Bail if no interactions
      if (!block.interactions || !Array.isArray(block.interactions)) return watchers;

      // Loop interactions

      for (let interaction of block.interactions) {
        switch (interaction.type) {
          case "click":
            formattedInteractions.click.push(this.renderInteraction(interaction, block));
            break;
          case "dblclick":
            formattedInteractions.dblclick.push(this.renderInteraction(interaction, block));
            break;
          case "mouseenter":
            formattedInteractions.mouseenter.push(this.renderInteraction(interaction, block));
            break;
          case "mouseleave":
            formattedInteractions.mouseleave.push(this.renderInteraction(interaction, block));
            break;
          case "focus":
            formattedInteractions.focus.push(this.renderInteraction(interaction, block));
            break;
          case "blur":
            formattedInteractions.blur.push(this.renderInteraction(interaction, block));
            break;
        }
      }

      // Mount on click events
      watchers.onclick = (evt) => {
        this.maybeFollowLink(evt, block);
        formattedInteractions.click.forEach((listener) => listener(evt));
      };

      // Mount on double click events
      if (formattedInteractions.dblclick.length) {
        watchers.ondblclick = (evt) => {
          formattedInteractions.dblclick.forEach((listener) => listener(evt));
        };
      }

      // Mount on mouse enter events
      if (formattedInteractions.mouseenter.length) {
        watchers.onmouseenter = (evt) => {
          formattedInteractions.mouseenter.forEach((listener) => listener(evt));
        };
      }

      // Mount on mouse leave events
      if (formattedInteractions.mouseleave.length) {
        watchers.onmouseleave = (evt) => {
          formattedInteractions.mouseleave.forEach((listener) => listener(evt));
        };
      }

      // Mount on focus events
      if (formattedInteractions.focus.length) {
        watchers.onfocus = (evt) => {
          formattedInteractions.focus.forEach((listener) => listener(evt));
        };
      }

      // Mount on focus events
      if (formattedInteractions.blur.length) {
        watchers.onblur = (evt) => {
          formattedInteractions.blur.forEach((listener) => listener(evt));
        };
      }

      return watchers;
    },

    /**
     * Returns whether a target is needed for interaction
     *
     * @param {object} interaction - the interaction object
     * @since 3.3.095
     */
    needsTarget(interaction) {
      const notNeeded = ["toggleDarkMode", "toggleMenuCollapse", "toggleFulscreenMode", "toggleScreenOptions", "toggleHelpOptions"];
      if (notNeeded.includes(interaction.action)) return false;
      return true;
    },

    /**
     * Renders functions for block interactions
     *
     * @param {object} interaction - the interaction object
     * @param {object} block - the block object
     * @since 3.3.095
     */
    renderInteraction(interaction, block) {
      // Build function
      const handler = async (evt) => {
        let target;

        // Get the target
        switch (interaction.target) {
          case "block":
            target = document.querySelector("#" + interaction.blockTarget);
            break;
          case "selector":
            target = document.querySelector(interaction.selector);
            break;
          case "self":
            target = evt.currentTarget;
            break;
        }

        // No target, log failure
        if (!target && this.needsTarget(interaction)) {
          console.log(`Target for interaction id ${interaction.id} failed. No valid target found.`);
          return;
        }

        // Interaction started
        document.dispatchEvent(new CustomEvent(`uipress/interactions/start/${interaction.id}`, { detail: { event: evt, target: target, block: block } }));

        this.doInteractionAction(target, interaction, evt);

        // Interaction end
        await this.$nextTick();
        document.dispatchEvent(new CustomEvent(`uipress/interactions/end/${interaction.id}`, { detail: { event: evt, target: target, block: block } }));
      };

      return handler;
    },

    /**
     * Performs interaction action
     *
     * @param {object} target - the target dom object
     * @param {object} interaction - the interaction object
     * @param {object} evt - the interaction event
     *
     * @since 3.3.095
     */
    doInteractionAction(target, interaction, evt) {
      // Set action
      switch (interaction.action) {
        case "showElement":
          target.style.display = "";
          break;
        case "hideElement":
          target.style.display = "none";
          break;
        case "toggleElementVisibility":
          this.toggleElementVisibility(target);
          break;
        case "addAttribute":
          this.addAttribute(target, interaction);
          break;
        case "removeAttribute":
          this.removeAttribute(target, interaction);
          break;
        case "toggleAttribute":
          this.toggleAttribute(target, interaction);
          break;
        case "javascript":
          this.executeCustomCode(evt, target, interaction);
          break;
        // Uipress actions
        case "toggleDarkMode":
          document.dispatchEvent(new CustomEvent("uipress/app/darkmode/toggle"));
          break;
        case "toggleMenuCollapse":
          document.dispatchEvent(new CustomEvent("uipress/blocks/adminmenu/togglecollapse"));
          break;
        case "toggleFulscreenMode":
          document.dispatchEvent(new CustomEvent("uipress/app/window/fullscreen"));
          break;
        // Site actions
        case "toggleScreenOptions":
          this.toggleScreenOptions("#screen-options-wrap");
          break;
        case "toggleHelpOptions":
          this.toggleScreenOptions("#contextual-help-wrap");
          break;
      }

      if (interaction.action.includes("_block_")) {
        this.handleBlockSpecificAction(interaction, evt, target);
      }
    },

    /**
     * Adds element attribute
     *
     * @param {node} target - The target node
     * @param {Object} interaction - The interaction object
     *
     * @since 3.3.095
     */
    addAttribute(target, interaction) {
      const attrKey = interaction.key;
      const attrValue = interaction.keyvalue;

      if (!attrKey || !attrValue) {
        console.log(`Interaction id ${interaction.id} failed. No valid key or key value to add.`);
        return;
      }

      if (attrKey !== "class") {
        target.setAttribute(attrKey, attrValue);
      } else {
        target.classList.add(attrValue);
      }
    },

    /**
     * Adds element attribute
     *
     * @param {node} target - The target node
     * @param {Object} interaction - The interaction object
     *
     * @since 3.3.095
     */
    removeAttribute(target, interaction) {
      const attrKey = interaction.key;
      const attrValue = interaction.keyvalue;

      if (!attrKey) {
        console.log(`Interaction id ${interaction.id} failed. No valid key to remove.`);
        return;
      }

      if (attrKey !== "class") {
        target.removeAttribute(attrKey, "");
      } else {
        target.classList.remove(attrValue);
      }
    },

    /**
     * Toggles elements attribute
     *
     * @param {node} target - The target node
     * @param {Object} interaction - The interaction object
     *
     * @since 3.3.095
     */
    toggleAttribute(target, interaction) {
      const attrKey = interaction.key;
      const attrValue = interaction.keyvalue;

      if (!attrKey || !attrValue) {
        console.log(`Interaction id ${interaction.id} failed. No valid key or key value to toggle.`);
        return;
      }

      if (attrKey !== "class") {
        const currentValue = target.getAttribute(attrKey);
        const newValue = currentValue != attrValue ? attrValue : "";
        // Set the new value for the attribute
        target.setAttribute(attrKey, newValue);
      } else {
        const currentValue = target.classList;

        if (currentValue.contains(attrValue)) target.classList.remove(attrValue);
        else target.classList.add(attrValue);
      }
    },

    /**
     * Toggles elements visibility
     *
     * @param {node} target - The target node
     * @param {String} display - Optional display type
     *
     * @since 3.3.095
     */
    toggleElementVisibility(target, display) {
      const displayType = display ? display : "";
      // If the element is hidden, show it
      if (target.style.display === "none") target.style.display = displayType;
      // If the element is visible, hide it
      else target.style.display = "none";
    },

    /**
     * Executes custom code
     *
     * @param {object} evt - the interaction event
     * @param {node} target - The target node
     * @param {object} interaction - The interaction object
     *
     * @since 3.3.095
     */
    executeCustomCode(evt, target, interaction) {
      // No code to execute
      if (!interaction.javascript) return;

      const codeHandler = new Function(interaction.javascript);
      codeHandler(evt, target);
    },

    /**
     * Toggles screen options
     *
     * @param {String} type - type of screen meta to show (options / help)
     *
     * @since 3.3.095
     */
    toggleScreenOptions(type) {
      const frames = document.querySelectorAll("iframe");

      // No iframes to update so bail
      if (!frames) return;

      // Update all iframes with data theme tag
      for (const iframe of frames) {
        const documentInner = iframe.contentWindow.document;
        if (!documentInner) continue;

        const screenOptions = documentInner.querySelector(type);
        const screenMeta = documentInner.querySelector("#screen-meta");

        if (screenOptions) this.toggleElementVisibility(screenOptions, "block");
        if (screenMeta) this.toggleElementVisibility(screenMeta, "block");
      }
    },

    /**
     * Handles block specific actions
     *
     * @param {object} interaction - The interaction object
     * @param {object} evt - the interaction event
     * @param {node} target - The target node
     *
     * @since 3.3.095
     */
    handleBlockSpecificAction(interaction, evt, target) {
      const blockTarget = interaction.blockTarget;
      const action = interaction.action.replace("_block_", "");

      if (!(blockTarget in this.uiTemplate.blockRefs)) {
        console.log(`Interaction id ${interaction.id} failed. Block not found.`);
        return;
      }

      try {
        this.uiTemplate.blockRefs[blockTarget].ref[action]();
      } catch (err) {
        console.log(`Interaction id ${interaction.id} failed. Block does not have specified method. Message: ${err}`);
      }
    },
  },
};
