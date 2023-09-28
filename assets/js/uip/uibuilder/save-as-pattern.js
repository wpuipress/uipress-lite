const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from '../../libs/vue-esm-dev.js';
export default {
  components: {
    Modal: defineAsyncComponent(() => import('../v3.5/utility/modal.min.js?ver=3.2.12')),
  },
  data() {
    return {
      modelOpen: false,
      dropWidth: 0,
      position: this.dropPos,
      saving: false,
      theBlock: null,
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
  methods: {
    /**
     * Opens modal adn sets block
     *
     * @param {Object} block - the block to save as a pattern
     * @since 3.2.13
     */
    show(block) {
      this.theBlock = {};
      this.theBlock = { ...block };
      this.$refs.saveaspattern.open();
    },

    /**
     * Saves block as a pattern
     *
     * @since 3.2.13
     */
    async savePattern() {
      this.saving = true;

      if (!this.newPattern.name || this.newPattern.name == '') {
        this.uipress.notify(__('Pattern not saved', 'uipress-lite'), __('Pattern title is required', 'uipress-lite'), 'warning', true);
        this.saving = false;
      }

      const response = await this.uipress.blockHouseKeeping(this.theBlock);
      this.savePatternToDb(this.theBlock);
    },

    /**
     * Saves pattern to DB
     *
     * @param {Object} saveBlock - the block pattern
     * @since 3.2.13
     */
    async savePatternToDb(saveBlock) {
      let uid = saveBlock.uid;
      let pattern = JSON.stringify(saveBlock, (k, v) => (v === 'true' ? 'uiptrue' : v === true ? 'uiptrue' : v === 'false' ? 'uipfalse' : v === false ? 'uipfalse' : v === '' ? 'uipblank' : v));

      let formData = new FormData();
      formData.append('action', 'uip_save_ui_pattern');
      formData.append('security', uip_ajax.security);
      formData.append('pattern', pattern);
      formData.append('name', this.newPattern.name);
      formData.append('type', this.newPattern.type);
      formData.append('description', this.newPattern.description);
      formData.append('icon', this.newPattern.icon.value);

      const response = await this.uipress.callServer(uip_ajax.ajax_url, formData);

      // Handle error
      if (response.error) {
        this.uipress.notify(response.message, 'uipress-lite', '', 'error', true);
        this.saving = false;
        return;
      }
      if (!response.success) returnData();

      this.uipress.notify(__('Pattern saved', 'uipress-lite'), '', 'success', true);
      this.saving = false;
      this.uiTemplate.patterns = response.patterns;
      const patternID = response.patternid;

      // Inject pattern id into block
      const foundBlock = await this.uipress.searchForBlock(this.uiTemplate.content, uid);
      if (!foundBlock) return;
      foundBlock.patternID = patternID;
    },
  },
  template: `
  
  <Modal ref="saveaspattern">
  
      <div  class="uip-flex uip-flex-column uip-row-gap-s uip-w-500 uip-padding-m">
      
            <!-- title -->
            <div class="uip-flex uip-flex-between uip-flex-center">
              <div class="uip-text-bold">{{strings.saveAsPattern}}</div>
              <div class="uip-icon uip-link-muted uip-padding-xxs uip-border-round hover:uip-background-muted" @click="$refs.saveaspattern.close()">close</div>
            </div>
        
          
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
          
	  </div>
        
  </Modal>`,
};