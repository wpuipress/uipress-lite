export default {
  props: {
    icon: String,
  },
  data() {
    return {};
  },
  computed: {
    returnIconStyle() {
      const pluginBase = this.uipApp.data.options.pluginURL;

      let icon = `${pluginBase}assets/icons/${this.icon}.svg`;

      return `display:block;
				height:1em;
				width:1em;
				min-height:1em;
				min-width:1em;
				background-color:currentColor;
				-webkit-mask: url(${icon}) no-repeat center;
				-webkit-mask-size: contain;
				mask: url(${icon}) no-repeat center;
				mask-size: contain;`;
    },
  },
  template: `
	
	<span :style="returnIconStyle"></span>
	
		`,
};
