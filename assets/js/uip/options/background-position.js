const { __, _x, _n, _nx } = wp.i18n;
import BackgroundPositions from "../v3.5/lists/background_positions.min.js";
import BackgroundRepeat from "../v3.5/lists/background_repeat.min.js";
import BackgroundSize from "../v3.5/lists/background_size.min.js";

export default {
  props: {
    returnData: Function,
    value: Object,
  },

  data() {
    return {
      updating: false,
      option: {
        position: "",
        repeat: "no-repeat",
        size: "cover",
      },
      options: {
        positions: BackgroundPositions,
        repeat: BackgroundRepeat,
        size: BackgroundSize,
      },
      strings: {
        position: __("Position", "uipress-lite"),
        repeat: __("Repeat", "uipress-lite"),
        size: __("Size", "uipress-lite"),
      },
    };
  },
  watch: {
    /**
     * Watches for changes to the input and returns the value
     *
     * @since 3.2.13
     */
    value: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.formatInput();
      },
      deep: true,
      immediate: true,
    },
    /**
     * Watches for changes to the options and returns the value
     *
     * @since 3.2.13
     */
    option: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.returnData(this.option);
      },
      deep: true,
    },
  },
  computed: {
    /**
     * Returns default value
     *
     * @since 3.2.0
     */
    returnDefault() {
      return {
        position: "center center",
        repeat: "no-repeat",
        size: "cover",
      };
    },
    /**
     * Returns options
     *
     * @since 3.2.13
     */
    returnOption() {
      return this.option;
    },
  },
  methods: {
    /**
     * Formats the input value
     *
     * @param {Mixed} value - the input value
     * @since 3.2.13
     */
    async formatInput() {
      this.updating = true;
      this.option = this.isObject(this.value) ? this.value : this.returnDefault;
      await this.$nextTick();
      this.updating = false;
    },
  },
  template: `
    <div class="uip-flex uip-flex-column uip-row-gap-xs">
    
    
      <!--Position -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.position}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          <default-select :value="returnOption.position" :args="{options: options.positions}" :returnData="function(e) {option.position = e}"></default-select>
        
        </div>
        
      </div>
      
      <!--Repeat -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.repeat}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          <default-select :value="returnOption.repeat" :args="{options: options.repeat}" :returnData="function(e) {option.repeat = e}"></default-select>
        
        </div>
        
      </div>
      
      
      <!--Size -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.size}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          <default-select :value="returnOption.size" :args="{options: options.size}" :returnData="function(e) {option.size = e}"></default-select>
        
        </div>
        
      </div>
    
    
    </div>`,
};
