const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    display: String,
    name: String,
    block: Object,
  },
  data() {
    return {};
  },
  template: `
          <uip-content-area class="uip-min-w-20 uip-min-h-20"
          :content="block.content" :returnData="function(data) {block.content = data} " />
          `,
};
