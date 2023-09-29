const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
    },
    data() {
      return {};
    },
    inject: ['uipress'],
    computed: {
      /**
       * Returns text for button if exists
       *
       * @since 3.2.13
       */
      returnText() {
        const item = this.uipress.get_block_option(this.block, 'block', 'buttonText', true);
        if (!item) return '';

        if (!this.isObject(item)) return item;
        if (item.string) return item.string;
        return '';
      },

      /**
       * Returns button link
       *
       * @since 3.2.13
       */
      getLink() {
        const link = this.uipress.get_block_option(this.block, 'block', 'linkSelect', true);
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
        return this.uipress.get_block_option(this.block, 'block', 'onClickCode');
      },

      /**
       * Returns icon for button
       *
       * @since 3.2.13
       */
      returnIcon() {
        let icon = this.uipress.get_block_option(this.block, 'block', 'iconSelect');
        if (!icon) return '';
        if (!this.isObject(icon)) return icon;
        if (icon.value) return icon.value;
        return '';
      },

      /**
       * Returns the button target
       *
       * @since 3.2.13
       */
      returnTarget() {
        if (this.returnLinkType == 'newTab') return '_BLANK';
        return '';
      },

      /**
       * Returns link type for button
       *
       * @since 3.2.13
       */
      returnLinkType() {
        let srcOBJ = this.uipress.get_block_option(this.block, 'block', 'linkSelect');
        if (this.isObject(srcOBJ)) return srcOBJ.newTab;
      },

      /**
       * Returns the reverse class if icon position is right
       *
       * @since 3.2.13
       */
      returnClasses() {
        const position = this.uipress.get_block_option(this.block, 'block', 'iconPosition');
        if (!position) return;
        if (!this.isObject(position) && position == 'right') return 'uip-flex-reverse';
        if (position.value && position.value == 'right') return 'uip-flex-reverse';
      },
    },
    methods: {
      /**
       * Follows a buttons link on click
       *
       * @param {Object} evt - Click event
       * @since 3.2.13
       */
      followLink(evt) {
        // If modifier clicks or linktype is new tab let the browser handler it
        if (evt.ctrlKey || evt.shiftKey || evt.metaKey || (evt.button && evt.button == 1) || this.returnLinkType == 'newTab') return;

        evt.preventDefault();

        const url = this.getLink;
        const type = this.returnLinkType;

        if (!url) return;

        // Dynamic link so update frame
        if (type == 'dynamic') return this.uipress.updatePage(url);
        // Default link so update browser window
        if (type == 'default') return window.location.replace(url);
      },

      /**
       * Builds on click code
       *
       * @since 3.2.13
       */
      buildOnClick() {
        return `
          document.getElementById(" ${this.block.uid} ").addEventListener("click", (event)=>{
            ${this.getOnClickCode}
          });
        `;
      },
    },
    template: `
    
          <a :href="getLink" :target="returnTarget" class="uip-button-default uip-flex uip-gap-xxs uip-flex-center uip-no-underline"
          :class="returnClasses" @click="followLink($event);" ref="newTab">
          
            <span class="uip-icon" v-if="returnIcon">{{returnIcon}}</span>
            <span class="uip-flex-grow" v-if="returnText != ''">{{returnText}}</span>
            
            <component v-if="getOnClickCode" is="script" scoped>
            
              {{buildOnClick()}}
            
            </component>
            
            
          </a>
          

          `,
  };
}
