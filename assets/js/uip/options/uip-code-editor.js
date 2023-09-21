const { __, _x, _n, _nx } = wp.i18n;
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
      self.editor = ace.edit(this.$refs.codeeditor);
      self.editor.setTheme('ace/theme/dracula');

      if (self.language == 'css') {
        let cssMode = ace.require('ace/mode/css').Mode;
        self.editor.session.setMode(new cssMode());
      }
      if (self.language == 'javascript') {
        let jsMode = ace.require('ace/mode/javascript').Mode;
        self.editor.session.setMode(new jsMode());
      }
      if (self.language == 'html') {
        let jsMode = ace.require('ace/mode/html').Mode;
        self.editor.session.setMode('ace/mode/html');
      }

      let thisCode = structuredClone(self.option);
      self.editor.setValue(thisCode, -1);

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
