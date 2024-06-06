<script>
export default {
  props: {
    display: String,
    name: String,
    block: Object,
  },
  data() {
    return {};
  },
};
</script>

<template>
  <uip-content-area
    class="uip-min-w-20 uip-min-h-20"
    :content="block.content"
    :returnData="
      (data) => {
        block.content = data;
      }
    "
  />
</template>
