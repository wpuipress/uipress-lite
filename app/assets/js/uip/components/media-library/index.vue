<script>
import axios from "axios";
import { __ } from "@wordpress/i18n";
import { defineAsyncComponent } from "vue";
import MediaLibrary from "./MediaLibrary.vue";

export default {
  components: {
    MediaLibrary: MediaLibrary,
  },

  data() {
    return {
      resolvePromise: undefined,
      rejectPromise: undefined,
      strings: {
        mediaLibrary: __("Media library", "uipress-lite"),
      },
    };
  },
  methods: {
    /**
     * Cancels and closes modal
     *
     * @since 3.2.13
     */
    cancel() {
      this.$emit("cancel-select");
      this.$refs.popup.close();
      this.resolvePromise(false);
    },

    /**
     * Shows confirm dialog and sets options
     * opts (Object)
     * @since 3.2.13
     */
    show(opts = {}) {
      this.selected = false;
      this.$refs.popup.open();
      this.resolvePromise = undefined;
      this.rejectPromise = undefined;

      requestAnimationFrame(() => {
        this.$refs.confirmBody.focus();
      });
      // Return promise so the caller can get results
      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve;
        this.rejectPromise = reject;
      });
    },
  },
};
</script>

<template>
  <component is="style"> .imageload-enter-active, .imageload-leave-active { transition: all 0.5s ease; } .imageload-enter-from, .imageload-leave-to { opacity: 0; } </component>

  <Modal ref="popup">
    <div ref="confirmBody" @keydown.escape="cancel()" @click.stop class="uip-w-500 uip-flex uip-flex-column uip-row-gap-s uip-padding-m" tabindex="1" style="height: 70vh; max-height: 80vh" autofocus>
      <div class="uip-flex uip-gap-xs uip-flex-start uip-flex-no-wrap uip-max-h-100p">
        <h2 class="uip-margin-remove uip-flex-grow">{{ strings.mediaLibrary }}</h2>
        <div @click="cancel()" class="uip-padding-xxs uip-border-rounder hover:uip-background-muted uip-cursor-pointer">
          <span class="uip-icon uip-link-muted">close</span>
        </div>
      </div>

      <MediaLibrary
        @image-selected="
          (d) => {
            resolvePromise(d);
            $refs.popup.close();
          }
        "
        @cancel-select="
          $refs.popup.close();
          resolvePromise(false);
        "
      />
    </div>
  </Modal>
</template>
