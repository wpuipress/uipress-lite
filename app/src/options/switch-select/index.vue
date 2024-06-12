<script>
const { __ } = wp.i18n;
export default {
  props: {
    returnData: Function,
    value: [Boolean, String],
    args: Object,
  },

  data() {
    return {
      yesNoOptions: {
        false: {
          value: false,
          label: __("No", "uipress-lite"),
        },
        true: {
          value: true,
          label: __("Yes", "uipress-lite"),
        },
      },
    };
  },
};
</script>

<template>
  <toggle-switch :options="yesNoOptions" :activeValue="value" :returnValue="returnData" />
</template>
