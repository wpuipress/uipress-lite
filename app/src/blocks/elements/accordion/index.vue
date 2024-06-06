<script>
import { __ } from "@wordpress/i18n";
export default {
  props: {
    display: String,
    name: String,
    block: Object,
  },
  data() {
    return {};
  },

  computed: {
    /**
     * Returns text for button if exists
     *
     * @since 3.2.13
     */
    returnText() {
      let item = this.get_block_option(this.block, "block", "headingText", true);
      if (!item) return "";

      if (!this.isObject(item)) return item;
      if (item.string) return item.string;
      return "";
    },
  },
};
</script>

<template>
  <accordion :openOnTick="false">
    <template v-slot:title>
      <div class="uip-flex-grow uip-flex uip-gap-xxs uip-flex-center">
        <AppIcon :icon="block.settings.block.options.iconSelect.value.value" class="uip-icon" v-if="block.settings.block.options.iconSelect.value.value" />
        <div class="uip-">{{ returnText }}</div>
      </div>
    </template>

    <template v-slot:content>
      <uip-content-area
        class="uip-accordion-body"
        :content="block.content"
        :returnData="
          (data) => {
            block.content = data;
          }
        "
      ></uip-content-area>
    </template>
  </accordion>
</template>
