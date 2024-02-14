const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from "../../libs/vue-esm.js";
import "../../libs/ace-editor.min.js";
import "../../libs/ace-editor-css.min.js";
import "../../libs/ace-editor-javascript.min.js";
import "../../libs/ace-editor-html.min.js";
import "../../libs/ace-theme-dracular.min.js";
import "../../libs/ace-editor-beautify.min.js";
import "../../libs/ace-theme-xcode.min.js";

export default {
  components: {
    Modal: defineAsyncComponent(() => import("../v3.5/utility/modal.min.js?ver=3.3.1")),
  },
  props: {
    returnData: Function,
    value: String,
    args: Object,
  },
  data() {
    return {
      option: "",
      editor: Object,
      language: this.args.language,
      fullScreen: false,
      finalVal: "",
      modalOpen: false,
      updating: false,
      changed: false,
      strings: {
        openFullscreen: __("Fullscreen", "uipress-lite"),
        closeFullscreen: __("Exit fullscreen", "uipress-lite"),
        codeEditor: __("Code editor", "uipress-lite"),
        editCode: __("Edit code", "uipress-lite"),
        add: __("Add", "uipress-lite"),
        updateCode: __("Update code", "uipress-lite"),
        discard: __("Discard changes", "uipress-lite"),
      },
    };
  },

  mounted() {
    this.option = this.value;
  },
  watch: {
    value: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.injectProp();
      },
      deep: true,
      immediate: true,
    },

    option: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.returnData(this.option);
      },
      deep: true,
    },
  },
  computed: {
    /**
     * Returns the current code value
     */
    returnCode() {
      return this.option;
    },
  },
  methods: {
    /**
     * Injects prop value
     *
     * @since 3.3.092
     */
    async injectProp() {
      this.updating = true;

      this.option = this.value;

      await this.$nextTick();

      this.updating = false;
    },
    /**
     * Builds editor and sets code editor options
     *
     * @since 3.2.13
     */
    initiateEditor() {
      this.beautify = ace.require("ace/ext/beautify");
      this.editor = ace.edit(this.$refs.codeeditor);
      this.editor.setTheme("ace/theme/xcode");
      this.editor.session.setUseWrapMode(true);
      this.editor.setShowPrintMargin(false);
      this.editor.container.style.lineHeight = 1.6;
      this.editor.renderer.updateFontSize();
      this.editor.setHighlightActiveLine(false);

      this.changed = false;

      this.editor.setOptions({
        maxLines: Infinity,
        tabSize: 3,
        wrap: 1, // wrap text to view
        indentedSoftWrap: false,
        fontSize: "0.8rem",
        indentedSoftWrap: true,
        useWorker: false,
        fontSize: "12px",
      });

      if (!this.language) this.language = "css";

      switch (this.language) {
        case "css":
          this.editor.session.setMode("ace/mode/css");
          break;

        case "javascript":
          this.editor.session.setMode("ace/mode/javascript");
          break;

        case "html":
          this.editor.session.setMode("ace/mode/html");
          break;
      }

      // Set start code
      const thisCode = structuredClone(this.option);
      this.editor.setValue(thisCode, -1);

      // Beautify
      this.beautify.beautify(this.editor.session);

      const onChange = () => {
        this.changed = true;
        this.finalVal = this.editor.getValue();
      };
      this.editor.session.on("change", onChange);
    },

    /**
     * Saves code, closes model and returns back to caller
     *
     * @since 3.2.13
     */
    saveCode() {
      this.option = this.changed ? this.finalVal : this.option;
      this.$refs.codemodal.close();
      this.uipApp.notifications.notify(__("Code updated", "uipress-lite"), "", "success");
    },

    /**
     * Clears code
     *
     * @since 3.2.13
     */
    clearCode() {
      this.option = "";
    },

    /**
     * Opens code editor and starts code editor
     *
     * @since 3.2.13
     */
    async showModal() {
      this.$refs.codemodal.open();
      await nextTick();
      this.initiateEditor();
    },
  },
  template: `
    
    
    <div class="uip-w-100p">
    
        <component is="style">
          .ace-xcode .ace_gutter{background:transparent;}
          .ace_gutter-cell{color:var(--uip-text-color-muted);opacity:0.6}
          .ace-xcode .ace_gutter-active-line {
              background:transparent;
              color: var(--uip-text-color-emphasis);
              font-weight: bolder;
              opacity:1;
          }
          .ace_scrollbar {
              display: none;
          }
          .ace_editor:hover .ace_scrollbar {
              display: block;
          }
          .ace_editor {background:transparent}
          html[data-theme="dark"] .ace_editor .ace_scroller{filter: invert(100%) saturate(0.8);}
        </component>
    
        <button class="uip-button-default uip-border-rounder uip-padding-xxs uip-w-100p uip-flex uip-gap-xs uip-flex-center uip-text-left" @click="showModal">
        
          <div class="uip-background-primary uip-text-inverse uip-border-round uip-padding-xxxs"><span class="uip-icon">code</span></div>
          
          <span v-if="!returnCode" class="uip-text-s uip-link-muted uip-flex-grow">{{strings.add}}...</span>
          <span v-else class="uip-text-s uip-flex-grow">{{strings.editCode}}</span>
          
          <a @click.prevent.stop="clearCode"
          v-if="returnCode"
          class="uip-no-underline uip-border-rounder uip-padding-xxxs uip-link-muted uip-text-s"><span class="uip-icon">close</span></a>
          
        </button>
        
        
        <Modal ref="codemodal">
            
            <div class="uip-padding-m uip-w-600 uip-flex uip-flex-column uip-row-gap-m">
            
              <div class="uip-flex uip-flex-between uip-flex-center">
                <span class="uip-text-bold">{{strings.codeEditor}}</span>
                <span class="uip-icon uip-link-muted hover:uip-background-muted uip-padding-xxs uip-border-rounder" @click="$refs.codemodal.close()">close</span>
              </div>
            
              
              <div class="uip-max-h-500 uip-min-h-400" style="overflow:scroll">
                <div class="" ref="codeeditor">
                </div>
              </div>
              
              
              <div class="uip-flex uip-flex-between">
                <button class="uip-button-default uip-background-grey" @click="$refs.codemodal.close()">{{strings.discard}}</button>
                <button class="uip-button-primary" @click="saveCode()">{{strings.updateCode}}</button>
              </div>
            
            </div> 
            
          
        </Modal>
          
          
         
    
    
    </div>
    
    `,
};
