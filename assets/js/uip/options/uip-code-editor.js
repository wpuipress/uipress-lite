const { __, _x, _n, _nx } = wp.i18n;

import '../../libs/ace-editor.min.js';
import '../../libs/ace-editor-css.min.js';
import '../../libs/ace-editor-javascript.min.js';
import '../../libs/ace-editor-html.min.js';
import '../../libs/ace-theme-dracular.min.js';
import '../../libs/ace-editor-beautify.min.js';

export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: String,
      args: Object,
    },
    data: function () {
      return {
        option: this.value,
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
        },
      };
    },
    inject: ['uipress'],
    mounted: function () {
      let self = this;
      self.beautify = ace.require('ace/ext/beautify');
      self.editor = ace.edit(this.$refs.codeeditor);
      self.editor.setTheme('ace/theme/dracula');
      self.editor.setOptions({ useWorker: false, fontSize: '12px' });
      self.editor.session.setUseWrapMode(true);
      self.editor.setShowPrintMargin(false);
      self.editor.renderer.setScrollMargin(14, 14);
      self.editor.container.style.lineHeight = 1.6;
      self.editor.renderer.updateFontSize();

      self.editor.setOptions({
        maxLines: Infinity,
        tabSize: 3,
        wrap: 0, // wrap text to view
        indentedSoftWrap: false,
        fontSize: '0.8rem',
        wrap: 1, // wrap text to view
        indentedSoftWrap: true,
      });

      self.editor.renderer.setPadding(16);
      self.editor.setHighlightActiveLine(false);

      if (!self.language) self.language = 'css';

      if (self.language == 'css') {
        self.editor.session.setMode('ace/mode/css');
      }
      if (self.language == 'javascript') {
        self.editor.session.setMode('ace/mode/javascript');
      }
      if (self.language == 'html') {
        self.editor.session.setMode('ace/mode/html');
      }

      const thisCode = structuredClone(self.option);
      self.editor.setValue(thisCode, -1);

      self.beautify.beautify(self.editor.session);

      self.editor.session.on('change', function (delta) {
        let val = self.editor.getValue();
        self.finalVal = val;
      });
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
      returnCode() {
        return this.option;
      },
    },
    methods: {
      returnFullscreenClass() {
        let self = this;

        if (self.fullScreen) {
          return 'uip-position-fixed uip-top-0 uip-bottom-0 uip-left-0 uip-right-0 uip-z-index-9999';
        }
      },
      closeModal(evt) {
        if (evt.target) {
          if (evt.target.contains(this.$refs.modalInner)) {
            this.modalOpen = false;
          }
        }
      },
      saveCode() {
        this.option = this.finalVal;
        this.modalOpen = false;
        this.uipress.notify(__('Code updated', 'uipress-lite'), '', 'success');
      },
    },
    template: `
    
    
    <div class="uip-w-100p">
    
        <button class="uip-button-default uip-border-rounder uip-padding-xxs uip-w-100p" @click="modalOpen = true">
          <span v-if="returnCode == ''" class="uip-icon">add</span>
          <span v-else class="uip-w-100p uip-text-s uip-text-muted uip-no-wrap uip-text-ellipsis uip-overflow-hidden">{{strings.editCode}}</span>
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
}
