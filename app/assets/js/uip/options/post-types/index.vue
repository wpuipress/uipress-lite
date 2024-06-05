<script>
import { __ } from '@wordpress/i18n';
export default {
  props: {
    returnData: Function,
    value: Array,
    placeHolder: String,
  },
  data() {
    return {
      strings: {
        placeHolder: __("Select post types", "uipress-lite"),
        searchPlaceHolder: __("Seach post types", "uipress-lite"),
      },
    };
  },
};
</script>

<template>
  <post-type-select :selected="value" :placeHolder="strings.placeHolder" :searchPlaceHolder="strings.searchPlaceHolder" :single="false" :updateSelected="returnData" />
</template>
