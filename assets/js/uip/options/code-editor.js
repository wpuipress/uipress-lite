const { __, _x, _n, _nx } = wp.i18n;

import '../../libs/ace-editor.min.js';
import '../../libs/ace-editor-css.min.js';
import '../../libs/ace-editor-javascript.min.js';
import '../../libs/ace-editor-html.min.js';
import '../../libs/ace-theme-dracular.min.js';
import '../../libs/ace-editor-beautify.min.js';

export default {
  props: {
    returnData: Function,
    value: String,
    args: Object,
  },
  data() {
    return {
      option: '',
      editor: Object,
      language: this.args.language,
      fullScreen: false,
      finalVal: '',
      modalOpen: false,
      strings: {
        openFullscreen: __('Fullscreen', 'uipress-lite'),
        closeFullscreen: __('Exit fullscreen', 'uipress-lite'),
        codeEditor: __('Code editor', 'uipress-lite'),
        editCode: __('Edit code', 'uipress-lite'),
        add: __('Add', 'uipress-lite'),
      },
    };
  },
  inject: ['uipress'],
  mounted() {
    this.option = this.value;
    this.initiateEditor();
  },
  watch: {
    option: {
      handler(newValue, oldValue) {
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
     * Builds editor and sets code editor options
     *
     * @since 3.2.13
     */
    initiateEditor() {
      this.beautify = ace.require('ace/ext/beautify');
      this.editor = ace.edit(this.$refs.codeeditor);
      this.editor.setTheme('ace/theme/dracula');
      this.editor.session.setUseWrapMode(true);
      this.editor.setShowPrintMargin(false);
      this.editor.renderer.setScrollMargin(14, 14);
      this.editor.container.style.lineHeight = 1.6;
      this.editor.renderer.updateFontSize();
      this.editor.renderer.setPadding(16);
      this.editor.setHighlightActiveLine(false);

      this.editor.setOptions({
        maxLines: Infinity,
        tabSize: 3,
        wrap: 0, // wrap text to view
        indentedSoftWrap: false,
        fontSize: '0.8rem',
        wrap: 1, // wrap text to view
        indentedSoftWrap: true,
        useWorker: false,
        fontSize: '12px',
      });

      if (!this.language) this.language = 'css';

      switch (this.language) {
        case 'css':
          this.editor.session.setMode('ace/mode/css');
          break;

        case 'javascript':
          this.editor.session.setMode('ace/mode/javascript');
          break;

        case 'html':
          this.editor.session.setMode('ace/mode/html');
          break;
      }

      // Set start code
      const thisCode = structuredClone(this.option);
      this.editor.setValue(thisCode, -1);

      // Beautify
      this.beautify.beautify(this.editor.session);

      const onChange = () => {
        this.finalVal = this.editor.getValue();
      };
      this.editor.session.on('change', onChange);
    },

    /**
     * Closes code modal
     *
     * @param {Object} evt - the click event
     * @since 3.2.13
     */
    closeModal(evt) {
      if (!evt.target.contains(this.$refs.modalInner)) return;
      this.modalOpen = false;
    },

    /**
     * Saves code, closes model and returns back to caller
     *
     * @since 3.2.13
     */
    saveCode() {
      this.option = this.finalVal;
      this.modalOpen = false;
      this.uipress.notify(__('Code updated', 'uipress-lite'), '', 'success');
    },

    /**
     * Clears code
     *
     * @since 3.2.13
     */
    clearCode() {
      this.option = '';
    },
  },
  template: `
    
    
    <div class="uip-w-100p">
    
        <button class="uip-button-default uip-border-rounder uip-padding-xxs uip-w-100p uip-flex uip-gap-xs uip-flex-center uip-text-left" @click="modalOpen = true">
        
          <div class="uip-background-primary uip-text-inverse uip-border-round uip-padding-xxxs"><span class="uip-icon">code</span></div>
          
          <span v-if="!returnCode" class="uip-text-s uip-link-muted uip-flex-grow">{{strings.add}}...</span>
          <span v-else class="uip-text-s uip-flex-grow">{{strings.editCode}}</span>
          
          <a @click.prevent.stop="clearCode"
          v-if="returnCode"
          class="uip-no-underline uip-border-rounder uip-padding-xxxs uip-link-muted uip-text-s"><span class="uip-icon">close</span></a>
          
        </button>
        
        
        <div v-show="modalOpen" class="uip-position-fixed uip-top-0 uip-left-0 uip-h-viewport uip-w-vw uip-background-black-wash uip-flex uip-flex-center uip-flex-middle uip-fade-in uip-z-index-9999" @click="closeModal($event)">
        
          <div class="uip-background-muted uip-border-rounder uip-border uip-flex uip-flex-column uip-scale-in uip-min-w-600 uip-min-w-200 uip-max-w-100p uip-text-normal uip-position-relative uip-modal-body uip-flex uip-flex-column uip-dark-mode" ref="modalInner">
            
            
            <div class="uip-padding-xs uip-border-bottom uip-flex uip-flex-between">
              <span>{{strings.codeEditor}}</span>
              <span class="uip-icon uip-text-l uip-link-muted" @click="modalOpen = false">close</span>
            </div>
          
            <div class="">
            
              <div class="uip-min-h-400 uip-w-100p uip-scrollbar uip-flex-grow" style="border-radius: 0 0 var(--uip-border-radius-large) var(--uip-border-radius-large)" ref="codeeditor">
              </div>
              
            </div>  
            
            
            <div class="uip-padding-xs uip-flex uip-flex-between">
              <button class="uip-button-default uip-background-grey" @click="modalOpen = false">Cancel</button>
              <button class="uip-button-primary" @click="saveCode()">Save</button>
            </div>
            
          
          </div>
          
          
        </div>  
    
    
    </div>
    
    `,
};
