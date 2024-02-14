import { defineAsyncComponent, nextTick } from '../../libs/vue-esm.js';
import Modal from '../v3.5/utility/modal.min.js?ver=3.3.1';
export default {
  components: {
    Modal: Modal,
  },
  data() {
    return {
      strings: {
        previous: __('Previous', 'uipress-lite'),
        next: __('Next', 'uipress-lite'),
        done: __('Done', 'uipress-lite'),
        close: __('Close', 'uipress-lite'),
      },
      tips: {
        allTips: [
          {
            title: __('Dynamic data', 'uipress-lite'),
            content: __('Typing "{{" in any window now opens the new dynamic data flow. Continue typing to search or press enter to select. Dynamic data will render in preview mode.', 'uipress-lite'),
            img: this.uipApp.data.options.pluginURL + 'assets/img/dynamic_data_preview.gif',
          },
          {
            title: __('Query builder', 'uipress-lite'),
            content: __(
              'The new query builder can be enabled on any block and allows you to query posts, pages, users and sites (multsitie only). The query builder is designed to work perfectly with the new dynamic data selector.',
              'uipress-lite'
            ),
            img: this.uipApp.data.options.pluginURL + 'assets/img/query_builder.gif',
          },
          {
            title: __('Style presets', 'uipress-lite'),
            content: __(
              'Style presets allow you to create custom presets that you can apply to any blocks. Presets are global and making changes to them in one place will update them across all of your templates',
              'uipress-lite'
            ),
            img: this.uipApp.data.options.pluginURL + 'assets/img/presets_preview.gif',
          },
          {
            title: __('Redesigned block styles', 'uipress-lite'),
            content: __('The new editor makes it easier to adjust block styles and create more advanced layouts. Use the new pseudo switcher to create detailed templates', 'uipress-lite'),
            img: this.uipApp.data.options.pluginURL + 'assets/img/styles_psuedo.gif',
          },
          {
            title: __('Effects and transitions', 'uipress-lite'),
            content: __('You can add and manage transitions within the uiBuilder. Adjust timings and animation styles to get the perfect result.', 'uipress-lite'),
            img: this.uipApp.data.options.pluginURL + 'assets/img/transitions_preview.gif',
          },
          {
            title: __('Contextual options', 'uipress-lite'),
            content: __('Common actions are just a right click away. Duplicate blocks, copy styles or export your entire template', 'uipress-lite'),
            img: this.uipApp.data.options.pluginURL + 'assets/img/contextual_options.gif',
          },
        ],
        currentTip: 0,
      },
    };
  },
  mounted() {
    this.uipApp.tipsAndTricks = this;
    if (!this.uipApp.data.userPrefs.supressTips) {
      this.show();
    }
  },
  methods: {
    /**
     * Opens tips and tricks
     *
     * @since 3.2.13
     */
    show() {
      this.$refs.tips.open();
    },
  },
  template: `
  
  <Modal ref="tips">
  
	  <div ref="cheese" class="uip-flex uip-flex-column uip-row-gap-s uip-w-400 uip-padding-m">
		
		
		  <div class="uip-flex uip-flex-column uip-row-gap-s">
			
			<img :src="tips.allTips[tips.currentTip].img" :alt="tips.allTips[tips.currentTip].title" class="uip-w-100p uip-border-rounder uip-fade-in">
			<div class="uip-text-emphasis uip-text-l uip-fade-in">{{tips.allTips[tips.currentTip].title}}</div>
			<div class="uip-text-muted uip-fade-in" style="line-height:1.6">{{tips.allTips[tips.currentTip].content}}</div>
			
		  </div>
		  
		  <div class="uip-flex uip-flex-between">
		  
			<button class="uip-button-default" @click="$refs.tips.close();saveUserPreference('supressTips', true, false);">{{strings.close}}</button>
			
			<div class="uip-flex uip-gap-xs">
			
			  <button v-if="tips.currentTip > 0" class="uip-button-default" @click="tips.currentTip -= 1">{{strings.previous}}</button>
			  <button v-if="tips.currentTip < tips.allTips.length - 1" class="uip-button-default" @click="tips.currentTip += 1">{{strings.next}}</button>
			  
			  <button v-if="tips.currentTip == tips.allTips.length - 1" class="uip-button-primary" @click="$refs.tips.close()">{{strings.done}}</button>
			  
			</div>
		  </div>
		
		
	  </div>
	  
	</Modal> 
  `,
};
