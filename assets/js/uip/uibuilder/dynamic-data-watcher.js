const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from '../../libs/vue-esm.js';
export default {
  components: {
    contextmenu: defineAsyncComponent(() => import('../v3.5/utility/contextmenu.min.js?ver=3.3.1')),
  },
  data: function () {
    return {
      ui: {
        dynamicData: {
          display: false,
          index: 0,
          top: 0,
          right: 0,
          input: false,
          search: '',
          inlineSearch: '',
          cursorPosition: 0,
        },
      },
      strings: {
        dynamicData: __('Dynamic data', 'uipress-lite'),
        searchData: __('Search', 'uipress-lite'),
      },

      dynamicCategories: [
        {
          name: 'query',
          label: __('Query', 'uipress-lite'),
          icon: 'all_inclusive',
        },
        {
          name: 'array',
          label: __('Array', 'uipress-lite'),
          icon: 'data_array',
        },
        {
          name: 'image',
          label: __('Image', 'uipress-lite'),
          icon: 'image',
        },
        {
          name: 'link',
          label: __('Link', 'uipress-lite'),
          icon: 'link',
        },
        {
          name: 'text',
          label: __('Text', 'uipress-lite'),
          icon: 'title',
        },
      ],
      dynamicOptions: [
        {
          name: 'post_title',
          label: __('Post title', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'post_author',
          label: __('Post author', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'post_date',
          label: __('Post date', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'post_link',
          label: __('Post link', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'post_edit_link',
          label: __('Post edit link', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'post_featured_image',
          label: __('Post featured image', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'post_content',
          label: __('Post content', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'post_excerpt',
          label: __('Post excerpt', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'post_type',
          label: __('Post type', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'post_status',
          label: __('Post status', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'comment_count',
          label: __('Comment count', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'meta:key',
          label: __('Meta key', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'acf_meta:key',
          label: __('ACF Meta key', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'mb_meta:key',
          label: __('Metabox Meta key', 'uipress-lite'),
          type: 'query',
        },
        //Attachment
        {
          name: 'attachment_image',
          label: __('Attachment image', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'post_mime_type',
          label: __('Attachment type', 'uipress-lite'),
          type: 'query',
        },
        //Users
        {
          name: 'ID',
          label: __('User id', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'display_name',
          label: __('User display name', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'user_email',
          label: __('User email', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'user_login',
          label: __('User login', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'user_nicename',
          label: __('User nicename', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'user_registered',
          label: __('User registered', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'user_avatar',
          label: __('User profile image', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'meta:key',
          label: __('User meta', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'acf_user_meta:key',
          label: __('ACF User meta', 'uipress-lite'),
          type: 'query',
        },
      ],
      multisiteOptions: [
        //Multisites
        {
          name: 'registered',
          label: __('Site registered', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'domain',
          label: __('Site domain', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'last_updated',
          label: __('Site last updated', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'path',
          label: __('Site path', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'blog_id',
          label: __('Site id', 'uipress-lite'),
          type: 'query',
        },

        {
          name: 'site_name',
          label: __('Site name', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'site_home_url',
          label: __('Site home url', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'site_dashboard_url',
          label: __('Site admin url', 'uipress-lite'),
          type: 'query',
        },
        {
          name: 'meta:key',
          label: __('Site meta', 'uipress-lite'),
          type: 'query',
        },
      ],
    };
  },
  
  mounted() {
    this.formatDynamicData();
    this.mountWatcher();
  },
  beforeUnmount() {
    if (!this.ui.dynamicData.input) return;
    this.ui.dynamicData.input.removeEventListener('keydown', this.watchForClosure);
    this.ui.dynamicData.input.removeEventListener('keypress', this.watchKeyInput);
    this.ui.dynamicData.input.removeEventListener('click', this.watchKeyInput);
  },
  computed: {
    /**
     * Filters dynamicOptions based on the search criteria.
     *
     * @returns {Array} An array containing filtered options based on search.
     * @since 3.2.13
     */
    dynamicOptionsWithSearch() {
      return this.dynamicOptions.filter((item) => this.inSearch(item));
    },
  },
  methods: {
    /**
     * Formats dynamic data, sorts it based on the type, and
     * optionally merges with multisite options if available.
     *
     * @since 3.2.13
     */
    formatDynamicData() {
      const dynaAsArray = Object.values(this.uipApp.data.dynamicOptions).sort((a, b) => {
        if (a.type < b.type) return -1;
        if (a.type > b.type) return 1;
        return 0;
      });

      if (this.uipApp.data.options.multisite) {
        this.dynamicOptions = [...this.dynamicOptions, ...this.multisiteOptions];
      }

      this.dynamicOptions = [...this.dynamicOptions, ...dynaAsArray];
    },

    /**
     * Watches for the mounting of dynamic sequences and triggers the appropriate actions.
     * This function listens for a specified sequence and performs actions such as setting
     * positions, triggering menus, and setting up additional event listeners.
     *
     * @since 3.2.13
     */
    mountWatcher() {
      const SequenceWatcher = (coordinates, input) => {
        const right = window.innerWidth - coordinates.x;

        this.ui.dynamicData.input = input;
        this.ui.dynamicData.search = '';
        this.ui.dynamicData.cursorPosition = this.getCaretPosition(input);

        // Show dynamic data
        const evt = { clientX: coordinates.x - 220, clientY: coordinates.y };
        this.$refs.dynamicdatamenu.show(evt, evt);

        // Setup for detecting sequence closure
        this.ui.dynamicData.closeEvent = this.mountDynamicSequence('}}', this.closeDynamicData);
        input.addEventListener('keypress', this.watchKeyInput);
        input.addEventListener('keydown', this.watchForclosure);
      };

      // Mounts the initial sequence watcher
      this.mountDynamicSequence('{{', SequenceWatcher);
    },

    /**
     * Sets up an event listener to detect a specific sequence in any input event across
     * the document. Once the sequence is detected, the provided callback is executed.
     *
     * @param {string} sequence - The specific sequence of characters to detect.
     * @param {Function} callback - The callback function to execute upon detecting the sequence.
     * @returns {Function} - The wrapped event handler, useful for later removal if needed.
     *
     * @since 3.2.13
     */
    mountDynamicSequence(sequence, callback) {
      /**
       * Wrapped event handler to process the input event and check for the desired sequence.
       *
       * @param {Event} event - The input event.
       */
      const wrappedHandleInputEvent = (event) => this.handleInputEvent(event, sequence, callback);

      // Add the event listener to detect the sequence in input events across the document
      document.addEventListener('input', wrappedHandleInputEvent);

      return wrappedHandleInputEvent;
    },

    /**
     * Handles input events to detect if a specific sequence of characters is present at the
     * current caret position within an input element or an element with the 'ql-editor' class.
     * If the sequence is detected, the provided callback is executed with the cursor's coordinates.
     *
     * @param {Event} event - The input event.
     * @param {string} sequence - The specific sequence of characters to detect.
     * @param {Function} callback - The callback function to execute upon detecting the sequence.
     *                              It is called with cursor coordinates and the event target.
     *
     * @since 3.2.13
     */
    handleInputEvent(event, sequence, callback) {
      if (event.target.tagName === 'INPUT' || event.target.classList.contains('ql-editor')) {
        const inputValue = this.returnInputValue(event.target);
        const cursor = this.getCaretPosition(event.target);

        const subInputValue = inputValue.slice(cursor - sequence.length);
        const afterSequence = subInputValue.slice(sequence.length);
        const detectedSequence = subInputValue.replace(afterSequence, '');

        if (detectedSequence === sequence) {
          const inputRect = event.target.getBoundingClientRect();
          const cursorCoordinates = {
            x: inputRect.left + cursor,
            y: inputRect.top,
          };
          callback(cursorCoordinates, event.target);
        }
      }
    },

    /**
     * Injects a dynamic label into the current input at the location of a specified sequence,
     * typically "{{". It then updates the cursor's position and dispatches an 'input' event.
     * This is useful for replacing placeholders or sequences with actual dynamic values.
     *
     * @param {Object} data - The dynamic data containing the label to be injected.
     * @property {string} data.name - The name of the dynamic label to be injected.
     *
     * @since 3.2.13
     */
    injectDynamicLabel(data) {
      const input = this.ui.dynamicData.input;
      let sequence = '{{';
      const textToInject = `{{${data.name}}}`;
      const cursorPosition = this.ui.dynamicData.cursorPosition;

      if (this.ui.dynamicData.inlineSearch) {
        sequence += this.ui.dynamicData.inlineSearch;
      }

      // Extract the current input value and generate the updated value by replacing the sequence
      const currentInputValue = this.returnInputValue(input);
      const updatedValue = currentInputValue.slice(0, cursorPosition - sequence.length) + textToInject + currentInputValue.slice(cursorPosition);

      // Update the input value and set the new cursor position
      if (input.tagName === 'INPUT') {
        input.value = updatedValue;
      } else {
        input.textContent = updatedValue;
      }
      input.selectionStart = input.selectionEnd = cursorPosition - sequence.length + textToInject.length;

      // Dispatch an 'input' event to notify of the change and close any associated UI components
      input.dispatchEvent(new Event('input'));
      this.$refs.dynamicdatamenu.close();
      this.closeDynamicData();
    },
    /**
     * Watches for specific keypress events in an input element or an element with class 'ql-editor'.
     * Depending on the key pressed, it can modify search criteria, close dynamic data, or inject
     * a dynamic label. It's designed for a richer interactive experience during input.
     *
     * @param {Event} event - The keypress event triggered on the target element.
     *
     * @since 3.2.13
     */
    watchKeyInput(event) {
      event.preventDefault();

      // Check if the event target is either an input element or has the class 'ql-editor'
      if (event.target.tagName === 'INPUT' || event.target.classList.contains('ql-editor')) {
        // Actions for specific keypresses
        switch (event.key) {
          case 'Backspace':
            this.ui.dynamicData.search = this.ui.dynamicData.search.slice(0, -1);
            this.ui.dynamicData.inlineSearch = this.ui.dynamicData.inlineSearch.slice(0, -1);
            break;
          case 'Escape':
            this.closeDynamicData();
            break;
          case 'Enter':
            if (this.dynamicOptionsWithSearch[this.ui.dynamicData.index]) {
              this.injectDynamicLabel(this.dynamicOptionsWithSearch[this.ui.dynamicData.index]);
            }
            break;
          default:
            this.ui.dynamicData.search += event.key;
            this.ui.dynamicData.inlineSearch += event.key;
        }

        // Update the cursor position
        this.ui.dynamicData.cursorPosition = this.getCaretPosition(event.target);
      }
    },

    /**
     * Monitors the event target for specific key events to determine when
     * to close dynamic data or navigate dynamic options using arrow keys.
     * It can close dynamic data, inject a dynamic label, or adjust the focus
     * of dynamic options based on the key pressed.
     *
     * @param {Event} event - The keydown event triggered on the target element.
     *
     * @since 3.2.13
     */
    watchForclosure(event) {
      // Ensure the event target is either an input element or has the class 'ql-editor'
      if (event.target.tagName !== 'INPUT' && !event.target.classList.contains('ql-editor')) return;

      let maxIndex, name;

      switch (event.key) {
        case 'Escape':
          this.closeDynamicData();
          break;

        case 'Enter':
          if (!this.dynamicOptionsWithSearch[this.ui.dynamicData.index]) break;
          this.injectDynamicLabel(this.dynamicOptionsWithSearch[this.ui.dynamicData.index]);
          break;

        case 'ArrowDown':
          maxIndex = this.dynamicOptionsWithSearch.length - 1;
          this.ui.dynamicData.index = this.ui.dynamicData.index >= maxIndex ? 0 : this.ui.dynamicData.index + 1;
          name = this.dynamicOptionsWithSearch[this.ui.dynamicData.index].name;
          this.scrollItemIntoView(name);
          break;

        case 'ArrowUp':
          maxIndex = this.dynamicOptionsWithSearch.length - 1;
          this.ui.dynamicData.index = this.ui.dynamicData.index <= 0 ? maxIndex : this.ui.dynamicData.index - 1;
          name = this.dynamicOptionsWithSearch[this.ui.dynamicData.index].name;
          this.scrollItemIntoView(name);
          break;
      }
    },

    /**
     * Scrolls given item into view
     *
     * @param {String} name - the name of the item to scroll into view
     * @since 3.2.13
     */
    scrollItemIntoView(name) {
      const id = `#${this.formatNameAsID(name)}`;
      const item = document.querySelector(`#uip-dynamic-list ${id}`);
      if (!item) return;
      item.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
    },

    /**
     * Closes dynamic dropdown and removes event listeners
     *
     * @since 3.2.13
     */
    closeDynamicData() {
      this.$refs.dynamicdatamenu.close();
      this.ui.dynamicData.index = 0;
      this.ui.dynamicData.search = '';
      this.ui.dynamicData.inlineSearch = '';
      document.removeEventListener('input', this.ui.dynamicData.closeEvent);
      this.ui.dynamicData.input.removeEventListener('keydown', this.watchForClosure);
      this.ui.dynamicData.input.removeEventListener('keypress', this.watchKeyInput);
      this.ui.dynamicData.input.removeEventListener('click', this.watchKeyInput);
    },

    /**
     * Retrieves the value or text content of the specified target.
     * If the target has the class 'ql-editor', it returns its text content.
     * Otherwise, it returns the target's value.
     *
     * @param {HTMLElement} target - The target element from which the value or text content is needed.
     * @returns {string} - The value or text content of the target element.
     *
     * @since 3.2.13
     */
    returnInputValue(target) {
      if (target.classList.contains('ql-editor')) {
        return target.textContent;
      } else {
        return target.value;
      }
    },

    /**
     * Retrieves the caret (cursor) position within the specified element.
     * If the element is an input field, it returns the selection end.
     * For other elements, it computes the caret offset using the current selection.
     *
     * @param {HTMLElement} element - The target element where the caret position is needed.
     * @returns {number} - The caret position within the target element.
     *
     * @since 3.2.13
     */
    getCaretPosition(element) {
      // For input fields, simply return the selectionEnd property
      if (element.tagName === 'INPUT') {
        return element.selectionEnd;
      }

      let caretOffset = 0;

      // Check for browser support for the Selection API
      if (!window.getSelection) return caretOffset;

      const selection = window.getSelection();

      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();

        // Set the range to encompass the entire content of the element up to the caret
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);

        // Compute the caret offset based on the text content of the range
        caretOffset = preCaretRange.toString().length;
      }

      return caretOffset;
    },

    /**
     * Determines whether the specified item matches the current dynamic data search.
     * The match checks are performed against the item's label, name, and type properties,
     * comparing them with the dynamic data search query.
     *
     * @param {Object} item - The item object containing label, name, and type properties.
     * @returns {boolean} - True if the item matches the search query, otherwise false.
     *
     * @since 3.2.13
     */
    inSearch(item) {
      const lowerLabel = item.label.toLowerCase();
      const lowerName = item.name.toLowerCase();
      const lowerType = item.type.toLowerCase();
      const lowerSearch = this.ui.dynamicData.search.toLowerCase();

      if (lowerLabel.includes(lowerSearch) || lowerName.includes(lowerSearch) || lowerType.includes(lowerSearch)) {
        return true;
      }
      return false;
    },

    /**
     * Removes invalid selector items so name can be used as ID
     *
     * @param {String} name - The name of the option
     * @since 3.2.13
     */
    formatNameAsID(name) {
      return name.replace(':', '-');
    },
  },
  template: `
      
      <contextmenu ref="dynamicdatamenu">
      
          <div class="uip-padding-s uip-flex uip-flex-column uip-row-gap-s">
              <!-- Header -->
              <div class="uip-flex uip-flex-between uip-flex-center uip-min-w-200">
                  <div class="uip-text-emphasis uip-text-bold uip-text-s">{{strings.dynamicData}}</div>
                  <a class="uip-link-muted hover:uip-background-muted uip-icon uip-border-rounder uip-padding-xxxs uip-link-muted" 
                     @click="closeDynamicData()">close</a>
              </div>
      
              <!-- Search Box -->
              <div class="uip-flex uip-flex-column uip-row-gap-xs">
                  <div class="uip-flex uip-search-block uip-padding-xxs uip-border-rounder uip-flex uip-gap-xxs uip-flex-center uip-background-muted">
                      <span class="uip-icon uip-text-muted uip-icon uip-icon-medium">search</span>
                      <input class="uip-blank-input uip-flex-grow uip-text-s" 
                             type="search" 
                             :placeholder="strings.searchData" 
                             autofocus 
                             v-model="ui.dynamicData.search">
                  </div>
              </div>  
      
              <!-- Dynamic List -->
              <div class="uip-flex uip-flex-column uip-max-h-200 uip-row-gap-xxxs" id="uip-dynamic-list" style="overflow:auto;">
                  <template v-for="cat in dynamicCategories">
                      <template v-for="(data, index) in dynamicOptionsWithSearch">
                          <div v-if="cat.name == data.type" 
                               class="uip-padding-xs uip-padding-top-xxs uip-padding-bottom-xxs hover:uip-background-muted uip-border-rounder uip-flex uip-flex-center uip-gap-xxxs" 
                               @click="injectDynamicLabel(data)" 
                               :class="{'uip-background-muted uip-text-emphasis' : index == ui.dynamicData.index}" 
                               :id="formatNameAsID(data.name)">
      
                              <span class="uip-text-muted uip-text-s">{{ cat.label }}</span>
                              <span class="uip-icon uip-text-muted uip-text-s">chevron_right</span>
                              <span class="uip-link-default">{{data.label}}</span>
                          </div>
                      </template>
                  </template>
              </div>
          </div>
          
      </contextmenu>

          `,
};
