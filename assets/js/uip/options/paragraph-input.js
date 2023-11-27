import * as QuillEditor from "../../libs/quill.min.js";
export default {
  props: {
    returnData: Function,
    value: String,
  },
  data() {
    return {
      option: this.value,
      quillEditor: "",
      variableTrigger: false,
    };
  },
  watch: {
    value: {
      handler() {
        if (this.updating) return;
        this.option = this.value;

        if (this.quillEditor) {
          this.quillEditor.root.innerHTML = this.option;
        } else {
          this.startEditor();
        }
      },
    },
  },
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
      return this.uipApp.litePath + "assets/css/modules/uip-quill.css";
    },

    /**
     * Initialises editor
     *
     * @since 3.2.13
     */
    startEditor() {
      const container = this.$refs.uipeditor;

      this.quillEditor = new Quill(container, {
        theme: "snow",
      });

      this.quillEditor.on("text-change", this.handleTextChange);
      this.quillEditor.root.innerHTML = this.option;
    },

    /**
     * Handles text editor changes
     *
     * @since 3.2.13
     */
    async handleTextChange(delta, oldDelta, source) {
      this.updating = true;
      this.returnData(this.quillEditor.root.innerHTML);

      await this.$nextTick();
      this.updating = false;
    },
  },
  template: `
    <div class="uip-flex uip-flex-column uip-min-h-200 uip-w-100p uip-gap-xs">
    
      <component is="style">
        @import '{{returnStylePath()}}';
      </component>
    
      <div ref="uipeditor" class="uip-h-100p uip-w-100p"></div>
    </div>`,
};
