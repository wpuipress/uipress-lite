<script>
const { __ } = wp.i18n;
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
      const item = this.get_block_option(this.block, "block", "buttonText", true);
      if (!item) return "";

      if (!this.isObject(item)) return item;
      if (item.string) return item.string;
      return "";
    },

    /**
     * Returns button link
     *
     * @since 3.2.13
     */
    getLink() {
      const link = this.get_block_option(this.block, "block", "linkSelect", true);
      if (!link) return;

      if (!this.isObject(link)) return link;
      if (link.value) return link.value;
    },

    /**
     * Returns whether the buttons 'onClick' custom code
     *
     * @since 3.2.13
     */
    getOnClickCode() {
      return this.get_block_option(this.block, "block", "onClickCode");
    },

    /**
     * Returns icon for button
     *
     * @since 3.2.13
     */
    returnIcon() {
      let icon = this.get_block_option(this.block, "block", "iconSelect");
      if (!icon) return "";
      if (!this.isObject(icon)) return icon;
      if (icon.value) return icon.value;
      return "";
    },

    /**
     * Returns the button target
     *
     * @since 3.2.13
     */
    returnTarget() {
      if (this.returnLinkType == "newTab") return "_BLANK";
      return "";
    },

    /**
     * Returns link type for button
     *
     * @since 3.2.13
     */
    returnLinkType() {
      let srcOBJ = this.get_block_option(this.block, "block", "linkSelect");
      if (this.isObject(srcOBJ)) return srcOBJ.newTab;
    },

    /**
     * Returns the reverse class if icon position is right
     *
     * @since 3.2.13
     */
    returnClasses() {
      const position = this.get_block_option(this.block, "block", "iconPosition");
      if (!position) return;
      if (!this.isObject(position) && position == "right") return "uip-flex-reverse";
      if (position.value && position.value == "right") return "uip-flex-reverse";
    },
  },
  methods: {
    /**
     * Builds on click code
     *
     * @since 3.2.13
     */
    handleUserOnClick() {
      if (!this.getOnClickCode) return;
      const code = this.getOnClickCode;
      const codeHandler = new Function(code);
      codeHandler();
    },
  },
};
</script>

<template>
  <a :href="getLink" :target="returnTarget" class="uip-button-default uip-flex uip-gap-xxs uip-flex-center uip-no-underline" tabindex="0" :class="returnClasses" ref="newTab">
    <AppIcon :icon="returnIcon" class="uip-icon" v-if="returnIcon" />
    <span class="uip-flex-grow" v-if="returnText != ''">{{ returnText }}</span>
  </a>
</template>
