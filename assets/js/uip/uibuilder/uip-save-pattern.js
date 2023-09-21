const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      args: Object,
      triggerClass: String, // Allows custom classes to be set on the trigger container
    },
    data: function () {
      return {
        modelOpen: false,
        dropWidth: 0,
        position: this.dropPos,
        saving: false,
        theBlock: this.args.blockitem,
        strings: {
          saveAsPattern: __('Save as pattern', 'uipress-lite'),
          patternTitle: __('Pattern title', 'uipress-lite'),
          patternType: __('Pattern type', 'uipress-lite'),
          patternDescription: __('Patterns can be either single components or entire layoutsd and are a great way of creating reusable blocks for your projects.'),
          savePattern: __('Save pattern', 'uipress-lite'),
          description: __('Description', 'uipress-lite'),
          patternIcon: __('Pattern icon', 'uipress-lite'),
        },
        newPattern: {
          name: '',
          description: '',
          type: 'block',
          icon: {
            value: 'interests',
          },
        },
        patternTypes: [
          { name: 'layout', label: __('Layout', 'uipress-lite') },
          { name: 'block', label: __('Block', 'uipress-lite') },
        ],
      };
    },
    inject: ['uipress', 'uiTemplate'],
    watch: {},
    mounted: function () {},
    computed: {
      returnBlockName() {
        return this.blockitem.name;
      },
      returnBlock() {
        this.theBlock = this.args.blockitem;
        return this.theBlock;
      },
    },
    methods: {
      savePattern() {
        this.saving = true;
        let saveBlock = this.args.blockitem;

        if (!this.newPattern.name || this.newPattern.name == '') {
          this.uipress.notify(__('Pattern not saved', 'uipress-lite'), __('Pattern title is required', 'uipress-lite'), 'warning', true);
          this.saving = false;
        }

        let self = this;
        self.uipress.blockHouseKeeping(saveBlock).then((response) => {
          self.savePatternToDb(saveBlock);
        });
      },
      savePatternToDb(saveBlock) {
        let self = this;
        let uid = saveBlock.uid;
        let pattern = JSON.stringify(saveBlock, (k, v) => (v === 'true' ? 'uiptrue' : v === true ? 'uiptrue' : v === 'false' ? 'uipfalse' : v === false ? 'uipfalse' : v === '' ? 'uipblank' : v));

        let formData = new FormData();
        formData.append('action', 'uip_save_ui_pattern');
        formData.append('security', uip_ajax.security);
        formData.append('pattern', pattern);
        formData.append('name', self.newPattern.name);
        formData.append('type', self.newPattern.type);
        formData.append('description', self.newPattern.description);
        formData.append('icon', self.newPattern.icon.value);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          if (response.error) {
            self.uipress.notify(response.message, 'uipress-lite', '', 'error', true);
            self.saving = false;
          }
          if (response.success) {
            self.uipress.notify(__('Pattern saved', 'uipress-lite'), '', 'success', true);
            self.saving = false;
            self.uiTemplate.patterns = response.patterns;
            let patternID = response.patternid;

            //Inject pattern id into block
            self.uipress.searchForBlock(self.uiTemplate.content, uid).then((response) => {
              if (response) {
                response.patternID = patternID;
              }
            });
          }
        });
      },
    },
    template: `
          <div class="uip-flex uip-flex-column uip-row-gap-xs">
        
          
            <div class="uip-flex uip-flex-column uip-row-gap-xxs">
              <div class="uip-text-s uip-text-muted">{{strings.patternTitle}}</div>
              <input class="uip-input" type="text" v-model="newPattern.name">
            </div>
          
            <div class="uip-flex uip-flex-column uip-row-gap-xxs">
              <div class="uip-text-s uip-text-muted">{{strings.patternIcon}}</div>
              <icon-select :value="newPattern.icon" :returnData="function(data) {newPattern.icon = data}"></icon-select>
            </div>
          
            <div class="uip-flex uip-flex-column uip-row-gap-xxs">
              <div class="uip-text-s uip-text-muted">{{strings.description}}</div>
              <textarea class="uip-input" rows="4" v-model="newPattern.description"></textarea>
            </div>
          
            <div class="uip-flex uip-flex-column uip-row-gap-xxs">
              <div class="uip-text-s uip-text-muted">{{strings.patternType}}</div>
              <select class="uip-input" v-model="newPattern.type">
                <template v-for="option in patternTypes">
                  <option :value="option.name">{{option.label}}</option>
                </template>
              </select>
            </div>
          
            <div class="uip-margin-top-s">
              <uip-save-button :saving="saving" :buttonText="strings.savePattern" :saveFunction="savePattern"></uip-save-button>
            </div>
          
		    </div>`,
  };
}
