import { defineAsyncComponent } from "../../libs/vue-esm.js";
import { validDateTemplate } from "../v3.5/utility/functions.min.js";
export default {
  components: {
    contextmenu: defineAsyncComponent(() => import("../v3.5/utility/contextmenu.min.js?ver=3.3.1")),
    SaveAsPattern: defineAsyncComponent(() => import("./save-as-pattern.min.js?ver=3.3.1")),
  },
  inject: ["uiTemplate"],
  data() {
    return {
      block: {},
      list: null,
      blockIndex: null,
      strings: {
        settings: __("Settings", "uipress-lite"),
        styles: __("Styles", "uipress-lite"),
        delete: __("Delete", "uipress-lite"),
        duplicate: __("Duplicate", "uipress-lite"),
        copy: __("Copy", "uipress-lite"),
        paste: __("Paste", "uipress-lite"),
        editTemplate: __("Edit template", "uipress-lite"),
        resetTemplate: __("Reset template", "uipress-lite"),
        insert: __("Insert", "uipress-lite"),
        loremIpsum: __("Lorem Ipsum", "uipress-lite"),
        autoGenerate: __("Auto generate", "uipress-lite"),
        fromPrompt: __("From prompt", "uipress-lite"),
        editStates: __("Edit states", "uipress-lite"),
        copyStyles: __("Copy styles", "uipress-lite"),
      },
      enabled: {
        settings: true,
        styles: true,
        variants: true,
        duplicate: true,
        copy: true,
        copystyles: true,
        paste: true,
        insert: true,
        loremipsum: true,
        autogenerate: true,
        fromprompt: true,
        edittemplate: true,
        resettemplate: true,
        delete: true,
        renameBlock: true,
        pastestyles: true,
        advanced: true,
      },
      links: [
        {
          name: "settings",
          label: __("Settings", "uipress-lite"),
          icon: "tune",
          action: () => {
            this.uipApp.blockSettings.show(this.block, "settings");
            this.$refs.blockcontextmenu.close();
          },
        },
        {
          name: "styles",
          label: __("Styles", "uipress-lite"),
          icon: "palette",
          action: () => {
            this.uipApp.blockSettings.show(this.block, "style");
            this.$refs.blockcontextmenu.close();
          },
        },
        {
          name: "advanced",
          label: __("Advanced", "uipress-lite"),
          icon: "code",
          action: () => {
            this.uipApp.blockSettings.show(this.block, "advanced");
            this.$refs.blockcontextmenu.close();
          },
        },
        { name: "divider" },

        {
          name: "copy",
          label: __("Copy", "uipress-lite"),
          icon: "chevron_right",
          action: () => {},
          children: [
            {
              name: "copyblock",
              label: __("Block", "uipress-lite"),
              icon: "copy_all",
              action: () => {
                this.uiTemplate.copied = this.block;
                this.$refs.blockcontextmenu.close();
              },
            },
            {
              name: "copystyles",
              label: __("Styles", "uipress-lite"),
              icon: "palette",
              action: () => {
                this.uiTemplate.stylesCopied = this.block.settings;
                this.$refs.blockcontextmenu.close();
              },
            },
          ],
        },
        {
          name: "paste",
          label: __("Paste", "uipress-lite"),
          icon: "chevron_right",
          action: () => {},
          children: [
            {
              name: "pastecontent",
              label: __("Content", "uipress-lite"),
              icon: "content_paste",
              condition: () => {
                if (this.block.content && this.uiTemplate.copied) return true;
                return false;
              },
              action: () => {
                this.pasteBlockContent();
                this.$refs.blockcontextmenu.close();
              },
            },
            {
              name: "pastestyles",
              label: __("Styles", "uipress-lite"),
              icon: "content_paste",
              condition: () => {
                if (this.uiTemplate.stylesCopied) return true;
                return false;
              },
              action: () => {
                this.pasteStyles();
                this.$refs.blockcontextmenu.close();
              },
            },
          ],
        },
        {
          name: "duplicate",
          label: __("Duplicate", "uipress-lite"),
          shortcut: [
            { type: "icon", value: "keyboard_command_key" },
            { type: "text", value: "D" },
          ],
          action: () => {
            this.uipApp.blockControl.duplicateBlock();
            this.$refs.blockcontextmenu.close();
          },
        },

        { name: "divider" },

        {
          name: "saveAsPattern",
          label: __("Save as pattern", "uipress-lite"),
          icon: "bookmark_add",
          action: () => {
            this.$refs.saveaspattern.show(this.block);
            this.$refs.blockcontextmenu.close();
          },
        },
        {
          name: "syncPattern",
          label: __("Sync pattern", "uipress-lite"),
          icon: "sync",
          condition: () => {
            if (this.block.patternID) return true;
            return false;
          },
          action: () => {
            this.uipApp.blockControl.syncBlockPattern();
            this.$refs.blockcontextmenu.close();
          },
        },
        { name: "divider" },
        {
          name: "import",
          label: __("Import", "uipress-lite"),
          icon: "chevron_right",
          action: () => {},
          condition: () => {
            if (this.block.content) return true;
            return false;
          },
          children: [
            {
              name: "blockimport",
              label: __("Block", "uipress-lite"),
              icon: "file_upload",
              action: () => {
                this.importSomething("block");
                this.$refs.blockcontextmenu.close();
              },
            },
            {
              name: "contentimport",
              label: __("Content", "uipress-lite"),
              icon: "file_upload",
              action: () => {
                this.importSomething("blockcontent");
                this.$refs.blockcontextmenu.close();
              },
            },
            {
              name: "templateimport",
              label: __("Template", "uipress-lite"),
              icon: "file_upload",
              action: () => {
                this.importSomething("template");
                this.$refs.blockcontextmenu.close();
              },
            },
          ],
        },
        {
          name: "export",
          label: __("Export", "uipress-lite"),
          icon: "chevron_right",
          action: () => {},
          children: [
            {
              name: "blockexport",
              label: __("Block", "uipress-lite"),
              icon: "file_download",
              action: () => {
                this.exportStuff("block");
                this.$refs.blockcontextmenu.close();
              },
            },
            {
              name: "contentexport",
              label: __("Content", "uipress-lite"),
              icon: "file_download",
              condition: () => {
                if (this.block.content) return true;
                return false;
              },
              action: () => {
                this.exportStuff("blockcontent");
                this.$refs.blockcontextmenu.close();
              },
            },
            {
              name: "templateexport",
              label: __("Template", "uipress-lite"),
              icon: "file_download",
              action: () => {
                this.exportStuff("template");
                this.$refs.blockcontextmenu.close();
              },
            },
          ],
        },

        { name: "divider" },
        {
          name: "delete",
          label: __("Delete", "uipress-lite"),
          shortcut: [
            { type: "icon", value: "keyboard_command_key" },
            { type: "icon", value: "backspace" },
          ],
          danger: true,
          action: () => {
            this.uipApp.blockControl.deleteBlock();
            this.$refs.blockcontextmenu.close();
          },
        },
      ],
    };
  },
  created() {
    this.uipApp.blockcontextmenu = this;
  },
  computed: {
    returnBlock() {
      return this.block;
    },
    /**
     * Checks if current block is editable
     * no args
     * @since 0.0.1
     */
    blockTemplateEditable() {
      let blocktype = this.block.type;
      if (blocktype in this.seqlData.blocks) {
        return this.seqlData.blocks[blocktype].templateEditable;
      }
      return false;
    },
  },
  methods: {
    /**
     * Shows context menu and sets block
     * args (object) {event, list, index, block, disabled}
     * @since 0.0.1
     */
    show(args) {
      this.block = args.block;
      this.list = args.list;
      this.index = args.index;
      this.$refs.blockcontextmenu.show(args.event);
      this.uipApp.blockControl.setActive(this.block, this.list, null, true);
    },
    /**
     * Allows users to import a file from a dynamically generated file input
     *
     * @param {String} context - the type of file we are uploading
     * @since 3.2.13
     */
    importSomething(context) {
      // Create the file input element
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".json";
      fileInput.style.display = "none";

      // Add the input to the DOM
      document.body.appendChild(fileInput);

      // Create event listener to handle file selection
      const eventHandler = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (file.type !== "application/json") return;
        if (file.size > 1000000) return;

        this.importSettings(file, context);
      };
      fileInput.addEventListener("change", eventHandler);

      // Programmatically click the file input to open the file selector
      fileInput.click();
    },

    /**
     * Import settings from an uploaded JSON file.
     *
     * @param {Event} event - The file input change event.
     * @param {string} type - The type of content to import: 'template', 'block', or 'blockcontent'.
     * @since 3.2.13
     */
    importSettings(thefile, type) {
      const reader = new FileReader();
      reader.readAsText(thefile, "UTF-8");

      reader.onload = (evt) => {
        const json_settings = evt.target.result;
        let parsed;

        // Check for valid JSON data
        try {
          parsed = JSON.parse(json_settings);
        } catch (error) {
          this.uipApp.notifications.notify(error, "", "error", true, false);
          return;
        }

        if (parsed) {
          if (!Array.isArray(parsed) && !this.isObject(parsed)) {
            this.uipApp.notifications.notify("Template is not valid", "", "error", true, false);
            return;
          }

          let temper;
          let message = __("Template imported", "uipress-lite");

          switch (type) {
            case "template":
              if (Array.isArray(parsed)) {
                temper = parsed;
              } else if (parsed.uipLayout) {
                temper = Array.isArray(parsed.uipLayout) ? parsed.uipLayout : [parsed.uipLayout];
              } else {
                return this.uipApp.notifications.notify(__("Template mismatch", "uipress-lite"), "", "error", true, false);
              }
              break;
            case "block":
              if (!parsed.uipLayout) {
                return this.uipApp.notifications.notify(__("Template mismatch", "uipress-lite"), "", "error", true, false);
              }
              message = __("Block imported", "uipress-lite");
              temper = [parsed.uipLayout];
              break;
            case "blockcontent":
              if (!parsed.uipBlockContent) {
                return this.uipApp.notifications.notify(__("Template mismatch", "uipress-lite"), "", "error", true, false);
              }
              message = __("Content imported", "uipress-lite");
              temper = parsed.uipBlockContent;
              break;
            default:
              console.error("Invalid type provided to importSettings function");
              return;
          }

          validDateTemplate(temper).then((response) => {
            if (!response.includes(false)) {
              if (type === "template") {
                this.uiTemplate.content = temper;
              }
              if (type === "block") {
                this.block.content.push(temper[0]);
              }
              if (type === "blockcontent") {
                this.block.content = temper;
              }

              this.uipApp.notifications.notify(message, "", "success", true, false);
            } else {
              this.uipApp.notifications.notify(__("File is not a valid JSON template", "uipress-lite"), "", "error", true, false);
            }
          });
        } else {
          this.uipApp.notifications.notify(__("JSON parse failed", "uipress-lite"), "", "error", true, false);
        }
      };
    },
    /**
     * Export content as JSON file.
     * @param {string} type - The type of content to export: 'template', 'block', or 'blockcontent'.
     */
    exportStuff(type) {
      let layout;
      let namer = "uip-ui-template-";

      switch (type) {
        case "template":
          layout = JSON.stringify({ uipLayout: this.uiTemplate.content });
          break;
        case "block":
          layout = JSON.stringify({ uipLayout: this.block });
          namer = "uip-ui-block-";
          break;
        case "blockcontent":
          layout = JSON.stringify({ uipBlockContent: this.block.content });
          namer = "uip-ui-block-content-";
          break;
        default:
          console.error("Invalid type provided to exportStuff function");
          return;
      }

      const name = this.uiTemplate.globalSettings.name;

      const today = new Date();
      const formattedDate = `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`;
      const filename = `${namer}${name}-${formattedDate}.json`;

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(layout);
      const dlAnchorElem = this.$refs.templateexport;
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", filename);
      dlAnchorElem.click();

      let message = __("Exported", "uipress-lite");

      this.uipApp.notifications.notify(message, "", "success", true);
    },

    /**
     * Checks if a menu item is enabled
     * no args
     * @since 0.0.1
     */
    isEnabled(menuitem) {
      if (menuitem.condition) return menuitem.condition();
      return true;
    },
    /**
     * Paste styles if they exist
     *
     * @since 0.0.1
     */
    async pasteStyles() {
      if (!this.uiTemplate.stylesCopied) return;

      let newStyles = JSON.parse(JSON.stringify(this.uiTemplate.stylesCopied));

      for (let key in newStyles) {
        //These are not styles so don't copy them
        if (key == "advanced" || key == "block" || key == "container") {
          continue;
        }
        //Check if the new block has the same settings
        if (key in this.block.settings) {
          let options = newStyles[key].options;
          this.block.settings[key] = { ...this.block.settings[key], ...newStyles[key] };
          this.block.settings[key].options = { ...this.block.settings[key].options, ...options };
        }
      }
    },
    /**
     * Pastes block into content
     */
    pasteBlockContent() {
      if (!this.block.content) return;
      if (!this.uiTemplate.copied) return;

      let currentTem = JSON.parse(JSON.stringify(this.uiTemplate.content));

      //Duplicate it
      let item = JSON.parse(JSON.stringify(this.uiTemplate.copied));
      item.uid = this.createUID();
      item.options = [];
      item.settings = JSON.parse(JSON.stringify(item.settings));

      if (item.content) {
        item.content = this.uipApp.blockControl.uniqueIds(item.content);
      }

      this.block.content.splice(this.block.content.length, 0, item);

      this.uiTemplate.copied = false;
    },

    /**
     * Wrapper for block template editing permissions
     * no args
     * @since 0.0.1
     */
    async canEditBlockTemplates() {
      return await this.seqlData.permissions.user_can({ request: "edit_block_templates", showMessage: true });
    },
    /**
     * Enters template edit
     * no args
     * @since 0.0.1
     */
    async editTemplate() {
      const canEdit = await this.canEditBlockTemplates();
      if (canEdit) {
        this.$refs.blockcontextmenu.close();
        this.$router.push({
          query: { ...this.$route.query, hasContext: true },
        });
        this.seqlData.templateeditor.show(this.block);
      }
    },

    /**
     * Enters block state edit
     * no args
     * @since 0.0.1
     */
    async editBlockState() {
      this.$refs.blockcontextmenu.close();
      this.seqlData.blockstates.show(this.block, this.list);
      //this.seqlData.templateeditor.show(this.block);
    },

    /**
     * Confirms deletion of custom template
     * no args
     * @since 0.0.1
     */
    async confirmClearTemplate() {
      const canEdit = await this.canEditBlockTemplates();

      if (!canEdit) return;

      const ok = await this.seqlData.confirm.show({
        title: __("Reset template", "uipress-lite"),
        message: __("Are you sure you want to reset this block's template? Any custom changes to the template will be lost", "uipress-lite"),
        okButton: __("Reset template", "uipress-lite"),
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        delete this.block._custom_template;
      }
    },
    /**
     * Returns position of clicked element for context menu
     * no args
     * @since 0.0.1
     */
    returnThisPosition(evt) {
      if (!evt.currentTarget) return false;
      const rect = evt.currentTarget.getBoundingClientRect();
      return { clientX: rect.right, clientY: rect.top };
    },
    /**
     * Shows submenu for items with children
     * no args
     * @since 0.0.1
     */
    maybeShowSubMenu(evt, item) {
      if (!item.children) return;
      this.$refs[item.name + "menu"][0].show(evt, this.returnThisPosition(evt));
    },
    /**
     * Hides submenu for items with children
     * no args
     * @since 0.0.1
     */
    maybeHideSubMenu(evt, item) {
      if (!item.children) return;
      this.$refs[item.name + "menu"][0].close();
    },
  },
  template: `
  
		  <contextmenu ref="blockcontextmenu">
	  
		  <div class="uip-padding-xs uip-flex uip-flex-column uip-text-weight-normal uip-text-s">
		  
			<template v-for="item in links">
			
				<div v-if="item.name == 'divider'" class="uip-border-top uip-margin-top-xxs uip-margin-bottom-xxs"></div>
				
				<a v-else
				@click.prevent="item.action"
				class="uip-link-default uip-padding-xxs uip-border-rounder hover:uip-background-muted uip-no-underline uip-flex uip-flex-center uip-flex-between uip-gap-s"
				:class="{ 'uip-link-danger' : item.danger && isEnabled(item), 'uip-link-disabled' : !isEnabled(item) }"
				@mouseenter="maybeShowSubMenu($event, item)"
				@mouseleave="maybeHideSubMenu($event, item)">
				
				  <span class="">{{item.label}}</span>
				  
				  <span v-if="item.icon" class="uip-flex-no-shrink uip-icon" 
				  :class="{ 'uip-link-muted' : !item.danger }">{{item.icon}}</span>
				  
				  <span v-if="item.shortcut" class="uip-flex uip-flex-center uip-gap-xxxs uip-opacity-50">
					<template v-for="cut in item.shortcut">
					  <span v-if="cut.type=='icon'" class="uip-icon">{{cut.value}}</span>
					  <span v-if="cut.type=='text'" class="uip-text-s">{{ cut.value }}</span>
					</template>
				  </span>
				  
				  
				  <!-- Submenu -->
				  
				  <contextmenu v-if="item.children" :ref="item.name + 'menu'" :disableTeleport="true">
					  
					  
						<div class="uip-padding-xs uip-flex uip-flex-column uip-text-weight-normal uip-min-w-130">
						
						  <template v-for="subitem in item.children">
						  
							<a
							class="uip-link-default uip-padding-xxs uip-border-rounder hover:uip-background-muted uip-no-underline uip-flex uip-flex-center uip-flex-between uip-gap-s"
							@click.prevent="subitem.action"
							:class="{ 'uip-link-danger' : item.danger && isEnabled(subitem), 'uip-link-disabled' : !isEnabled(subitem) }"
							type="menuLink">
							  
							  <span class="">{{subitem.label}}</span>
							  <span class="uip-flex-no-shrink uip-text-muted uip-icon">{{ subitem.icon }}</span>
							  
							</a>  
						  
						  </template>
						
						</div>
					  
				  </contextmenu>
				
				</a>
			
			</template>
		  
		  
		  </div>
	  
	      
			  
		</contextmenu>
    
        <a ref="templateexport" href="" style="display:none;"></a>
    
        <SaveAsPattern ref="saveaspattern"/>
		  
	
		`,
};
