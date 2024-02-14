const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from "../../libs/vue-esm.js";
export default {
  components: {
    Modal: defineAsyncComponent(() => import("../v3.5/utility/modal.min.js?ver=3.3.1")),
  },
  data() {
    return {
      modelOpen: false,
      dropWidth: 0,
      position: this.dropPos,
      saving: false,
      theBlock: null,
      strings: {
        saveAsPattern: __("Save as pattern", "uipress-lite"),
        patternTitle: __("Title", "uipress-lite"),
        patternType: __("Type", "uipress-lite"),
        patternDescription: __("Patterns can be either single components or entire layoutsd and are a great way of creating reusable blocks for your projects."),
        savePattern: __("Save pattern", "uipress-lite"),
        description: __("Description", "uipress-lite"),
        patternIcon: __("Icon", "uipress-lite"),
        cancel: __("Cancel", "uipress-lite"),
      },
      newPattern: {
        name: "",
        description: "",
        type: "block",
        icon: {
          value: "interests",
        },
      },
      patternTypes: [
        { name: "layout", label: __("Layout", "uipress-lite") },
        { name: "block", label: __("Block", "uipress-lite") },
      ],
    };
  },
  inject: ["uiTemplate"],
  methods: {
    /**
     * Opens modal and sets block
     *
     * @param {Object} block - the block to save as a pattern
     * @since 3.2.13
     */
    show(block) {
      this.theBlock = {};
      this.theBlock = block;
      this.$refs.saveaspattern.open();
    },

    /**
     * Saves block as a pattern
     *
     * @since 3.2.13
     */
    async savePattern() {
      this.saving = true;

      if (!this.newPattern.name || this.newPattern.name == "") {
        this.uipApp.notifications.notify(__("Pattern not saved", "uipress-lite"), __("Pattern title is required", "uipress-lite"), "warning", true);
        this.saving = false;
        return;
      }
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
      let pattern = JSON.stringify(saveBlock, (k, v) => (v === "true" ? "uiptrue" : v === true ? "uiptrue" : v === "false" ? "uipfalse" : v === false ? "uipfalse" : v === "" ? "uipblank" : v));

      let formData = new FormData();
      formData.append("action", "uip_save_ui_pattern");
      formData.append("security", uip_ajax.security);
      formData.append("pattern", pattern);
      formData.append("name", this.newPattern.name);
      formData.append("type", this.newPattern.type);
      formData.append("description", this.newPattern.description);
      formData.append("icon", this.newPattern.icon.value);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "uipress-lite", "", "error", true);
        this.saving = false;
        return;
      }
      if (!response.success) returnData();

      this.uipApp.notifications.notify(__("Pattern saved", "uipress-lite"), "", "success", true);
      this.saving = false;
      this.uiTemplate.patterns = response.patterns;
      const patternID = response.patternid;

      // Inject pattern id into block
      saveBlock.patternID = patternID;
    },
  },
  template: `
  
  <Modal ref="saveaspattern">
  
      <div  class="uip-flex uip-flex-column uip-row-gap-m uip-w-420 uip-padding-m">
      
            <!-- title -->
            <div class="uip-flex uip-flex-between uip-flex-center">
              <div class="uip-text-bold uip-text-emphasis">{{strings.saveAsPattern}}</div>
              <div class="uip-icon uip-link-muted uip-padding-xxs uip-border-round hover:uip-background-muted" @click="$refs.saveaspattern.close()">close</div>
            </div>
      
      
            <div class="uip-grid-col-1-3 uip-padding-left-s">
          
            
              <div class="uip-text-s uip-text-muted">{{strings.patternTitle}}</div>
              <input class="uip-input" type="text" v-model="newPattern.name">
            
              <div class="uip-text-s uip-text-muted">{{strings.patternIcon}}</div>
              <icon-select :value="newPattern.icon" :returnData="function(data) {newPattern.icon = data}"/>
              
              <div class="uip-text-s uip-text-muted">{{strings.patternType}}</div>
              <select class="uip-input" v-model="newPattern.type">
                <template v-for="option in patternTypes">
                  <option :value="option.name">{{option.label}}</option>
                </template>
              </select>
            
              <div class="uip-text-s uip-text-muted">{{strings.description}}</div>
              <textarea class="uip-input" rows="4" v-model="newPattern.description"></textarea>
            
            </div>
            
            <div class="uip-flex uip-flex-between uip-flex-center uip-gap-s">
            
              <button class="uip-button-default uip-flex-grow" @click="$refs.saveaspattern.close()">{{strings.cancel}}</button>
            
              <uip-save-button class="uip-flex-grow" :saving="saving" :buttonText="strings.savePattern" :saveFunction="savePattern"/>
            
            </div>
          
	  </div>
        
  </Modal>`,
};
