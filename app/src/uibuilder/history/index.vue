<script>
import AppButton from "@/components/app-button/index.vue";
/**
 * Builds the main ui builder shell
 * @since 3.0.0
 */
const { __ } = wp.i18n;
import { nextTick } from "vue";
export default {
  components: { AppButton },
  data() {
    return {
      history: [],
      currentIndex: -1,
      track: false,
      currentPage: null,
      maxHistory: 20,
      strings: {
        undo: __("Undo", "uipress-lite"),
        redo: __("Redo", "uipress-lite"),
      },
    };
  },
  inject: ["uiTemplate"],
  watch: {
    /**
     * Watches for changes in history
     * no args
     * @since 0.0.1
     */
    "uiTemplate.content": {
      immediate: true,
      handler() {
        if (this.track) {
          this.addToHistory();
        }
      },
      deep: true,
    },
    /**
     * Resets the history on page switch
     * no args
     * @since 0.0.1
     */
    "$route.params.templateID": {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.history = [];
          this.currentIndex = -1;
        }
      },
      deep: true,
    },
  },
  /**
   * Adds watcher and allows template tracking
   * no args
   * @since 0.0.1
   */
  mounted() {
    this.track = true;
    document.addEventListener("keydown", this.watchHistoryKeys);
  },
  /**
   * Removes watchers on destory
   * no args
   * @since 0.0.1
   */
  beforeUnmount() {
    document.removeEventListener("keydown", this.watchHistoryKeys);
  },
  methods: {
    /**
     * Pushes items to history
     * no args
     * @since 0.0.1
     */
    addToHistory() {
      // Check if the last item in the history is the same as the current template
      const currentTemplate = this.cloneTemplate(this.uiTemplate.content);
      if (this.history[this.currentIndex] && JSON.stringify(this.history[this.currentIndex]) === JSON.stringify(currentTemplate)) {
        return; // Don't add if it's the same
      }

      this.history = this.history.slice(0, this.currentIndex + 1);
      const clonedTemplate = this.cloneTemplate(this.uiTemplate.content);
      this.history.push(clonedTemplate);
      this.currentIndex++;
      if (this.history.length > this.maxHistory) {
        this.history.shift();
        this.currentIndex--;
      }
    },
    /**
     * Clones a template to avoid reactivity
     * no args
     * @since 0.0.1
     */
    cloneTemplate(template) {
      return JSON.parse(JSON.stringify(template));
    },
    /**
     * Watches for undo / redo
     * e (event)
     * @since 0.0.1
     */
    watchHistoryKeys(e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return; // Don't interfere with input or textarea.
      if (e.keyCode === 90 && (e.metaKey || e.ctrlKey)) {
        if (e.shiftKey) {
          this.handleForwardsInHistory();
        } else {
          this.handleBackInHistory();
        }
      }
    },
    /**
     * Handles going back in history
     * no args
     * @since 0.0.1
     */
    handleBackInHistory() {
      if (this.currentIndex <= 0) return;
      this.uipApp.scrolling = true;
      this.track = false;
      this.currentIndex--;
      this.uiTemplate.content = this.cloneTemplate(this.history[this.currentIndex]);

      nextTick(() => {
        this.track = true;
        this.uipApp.scrolling = false;
      });
    },
    /**
     * Handles going forwards in history
     * no args
     * @since 0.0.1
     */
    handleForwardsInHistory() {
      if (this.currentIndex >= this.history.length - 1) return;
      this.uipApp.scrolling = true;
      this.track = false;
      this.currentIndex++;
      this.uiTemplate.content = this.cloneTemplate(this.history[this.currentIndex]);
      nextTick(() => {
        this.track = true;
        this.uipApp.scrolling = false;
      });
    },
  },
  template: `
    

	  	`,
};
</script>

<template>
  <div class="flex flex-row items-center">
    <AppButton type="transparent" @click="handleBackInHistory()" :title="strings.undo" :disabled="currentIndex <= 0">
      <AppIcon icon="undo" class="text-2xl" />
    </AppButton>

    <AppButton type="transparent" @click="handleForwardsInHistory()" :title="strings.redo" :disabled="currentIndex >= history.length - 1">
      <AppIcon icon="redo" class="text-2xl" />
    </AppButton>
  </div>
</template>
