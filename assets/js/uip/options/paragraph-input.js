import * as QuillEditor from '../../libs/quill.min.js';
export default {
  props: {
    returnData: Function,
    value: String,
  },
  data() {
    return {
      option: this.value,
      quillEditor: '',
      variableTrigger: false,
    };
  },
  inject: ['uipress', 'uipData'],
  mounted() {
    this.startEditor();
  },
  methods: {
    /**
     * Returns path to quill styles
     *
     * @since 3.2.13
     */
    returnStylePath() {
      return this.uipData.options.pluginURL + 'assets/css/modules/uip-quill.css';
    },

    /**
     * Initialises editor
     *
     * @since 3.2.13
     */
    startEditor() {
      const container = this.$refs.uipeditor;

      this.quillEditor = new Quill(container, {
        theme: 'snow',
      });

      this.quillEditor.on('text-change', this.handleTextChange);
    },

    /**
     * Handles text editor changes
     *
     * @since 3.2.13
     */
    handleTextChange(delta, oldDelta, source) {
      this.returnData(this.quillEditor.root.innerHTML);
    },
  },
  template: `
    <div class="uip-flex uip-flex-column uip-min-h-200 uip-w-100p uip-gap-xs">
    
      <component is="style">
        @import '{{returnStylePath()}}';
      </component>
    
      <div ref="uipeditor" class="uip-h-100p uip-w-100p" v-html="option"></div>
    </div>`,
};
