export default {
  props: {
    startScreen: Object,
    homeScreen: String,
    showNavigation: Boolean,
    closer: Function,
    largeNavigation: Boolean,
  },
  watch: {
    startScreen: {
      handler() {
        // oOnly update homescreen if it has actually changed
        if (this.startScreen.component == this.currentScreen.component) {
          this.currentScreen = this.startScreen;
        }
      },
    },
  },
  data() {
    return {
      currentScreen: this.startScreen,
    };
  },
  computed: {
    /**
     * Returns current home screen
     *
     * @since 3.2.13
     */
    returnHomeScreen() {
      return this.startScreen;
    },
  },
  methods: {
    /**
     * Toggles the view to the previous screen or to the home screen.
     *
     * @since 3.2.13
     */
    toggleBack() {
      this.currentScreen = this.currentScreen.backscreen || this.returnHomeScreen;
    },
    /**
     * Sets the current screen and updates the back screen.
     *
     * @param {Object} screen - The screen to be processed.
     * @since 3.2.13
     */
    processScreen(screen) {
      const screenNow = this.currentScreen;
      this.currentScreen = screen;
      this.currentScreen.backscreen = screenNow;
    },
  },
  template: `
	
  
		<div class="uip-flex uip-flex-column uip-row-gap-s">
		 
			
			<Transition name="translate" mode="out-in">  
			  <div 
              class="uip-flex uip-flex-between uip-flex-center" v-if="currentScreen.component != homeScreen || showNavigation">
				
				<div @click.prevent.stop="toggleBack()" v-if="currentScreen.component != homeScreen"
				class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
                  <span class="uip-icon">chevron_left</span>
				</div>
			  
				<div class="uip-text-emphasis uip-text-bold" :class="largeNavigation ? 'uip-text-l' : 'uip-text-s' ">{{ currentScreen.label }}</div>
				
				<!--Spacer-->
				<div v-if="!closer"></div>
				
				<div v-else @click="closer()" 
				class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
                  <span class="uip-icon">close</span>
				</div>
			  
			  </div>  
			</Transition>
			
			
			
			<!--Options-->
			
			
			<Transition name="translate" mode="out-in">
			  
			  
				<slot name="componenthandler" :processScreen="processScreen" :currentScreen="currentScreen" :goBack="toggleBack"/>
				
				
			</Transition>
			
			
		</div>
  
  
		`,
};
