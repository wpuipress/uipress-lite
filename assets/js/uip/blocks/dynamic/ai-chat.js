const { __, _x, _n, _nx } = wp.i18n;
import '../../../libs/marked.min.js';
export default {
  props: {
    display: String,
    name: String,
    block: Object,
  },
  data() {
    return {
      searchString: '',
      loading: false,
      strings: {
        sendAmessage: __('Send a message...', 'uipress-lite'),
        apiKeyMissing: __('Please add an openAI api key to use this block', 'uipress-lite'),
      },
      newMessage: '',
      errorMessage: '',
      error: false,
      messages: [],
      thinking: false,
    };
  },
  
  watch: {
    'block.settings.block.options.welcomeMessage': {
      handler(newValue, oldvalue) {
        this.setMessages();
      },
      deep: true,
    },
    'block.settings.block.options.systemMessage': {
      handler(newValue, oldvalue) {
        this.setMessages();
      },
      deep: true,
    },
  },
  created() {
    this.setMessages();
  },
  computed: {
    /**
     * Returns ai key
     *
     * @sine 3.2.12
     */
    returnKey() {
      let key = this.get_block_option(this.block, 'block', 'apiKey');
      return key;
    },

    /**
     * Returns welcome message
     *
     * @sine 3.2.12
     */
    returnWelcome() {
      let welcome = this.get_block_option(this.block, 'block', 'welcomeMessage');
      return welcome;
    },
    /**
     * Returns system message
     *
     * @sine 3.2.12
     */
    returnSystem() {
      let system = this.get_block_option(this.block, 'block', 'systemMessage');
      return system;
    },

    /**
     * Returns ai model to use
     *
     * @sine 3.2.12
     */
    returnModel() {
      let model = this.get_block_option(this.block, 'block', 'chatModel');
      if (!model) return 'gpt-3.5-turbo';
      return model;
    },
  },
  methods: {
    /**
     * Sets default messages
     *
     * @since 3.2.13
     */
    setMessages() {
      if (this.returnSystem) {
        const current = this.messages.findIndex((item) => item.role === 'system');
        if (current) {
          this.messages[current].content = this.returnSystem;
        } else {
          this.messages.push({ role: 'system', content: this.returnSystem });
        }
      }

      if (this.returnWelcome) {
        const current = this.messages.findIndex((item) => item.welcome === true);
        if (current > -1) {
          this.messages[current].content = this.returnWelcome;
        } else {
          this.messages.push({ role: 'assistant', content: this.returnWelcome, welcome: true });
        }
      }
    },
    /**
     * Resizes text area automatically based on input
     *
     * @param {Object} event - Input event
     * @since 3.2.13
     */
    resizeTextarea(event) {
      const newHeight = Math.min(event.target.scrollHeight, 500);

      event.target.style.height = '';
      event.target.style.height = newHeight + 'px';

      if (newHeight == 500) {
        event.target.style.overflow = 'auto';
      } else {
        event.target.style.overflow = 'hidden';
      }
    },

    /**
     * Main method for submitting new messages
     *
     * @param {Object} e - Keyup event
     * @since 3.2.13
     */
    submiteNewMessage(e) {
      // If modifier keys or no key then bail and allow normal behaviour
      if (e.shiftKey || e.metaKey || !this.returnKey) return;

      // Empty message so exit
      if (this.newMessage.trim() == '') return;

      e.preventDefault();

      // Push new message
      this.messages.push({
        content: this.newMessage,
        role: 'user',
      });

      // Reset message input content and height
      this.newMessage = '';
      this.$refs.newMessage.style.height = '20px';

      // Submit message
      this.sendMessageToGPT();
    },
    /**
     * Sends message to server for AI response
     *
     * @since 3.2.13
     */
    async sendMessageToGPT() {
      const current = this.messages.findIndex((item) => item.welcome === true);

      // Locates welcome message before sending to AI
      if (current > -1) {
        delete this.messages[current].welcome;
      }

      const stringMessages = JSON.stringify(this.messages);
      const key = this.returnKey;
      this.error = false;

      if (current > -1) {
        this.messages[current].welcome = true;
      }

      this.thinking = true;

      //Build form data for fetch request
      let formData = new FormData();
      formData.append('action', 'uip_send_message_to_gpt');
      formData.append('security', uip_ajax.security);
      formData.append('messages', stringMessages);
      formData.append('key', key);
      formData.append('model', this.returnModel);

      // Send request to server
      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      // Handle error
      if (response.error) {
        this.error = true;
        this.errorMessage = response.message;
        this.thinking = false;
        return;
      }

      const error = this.hasNestedPath(response, ['message', 'error']);
      if (error) {
        this.error = true;
        this.errorMessage = error.message + ' - error code: ' + error.code;
        this.thinking = false;
        return;
      }

      // Update messages from response
      let choices = this.hasNestedPath(response, ['message', 'choices']);
      if (Array.isArray(choices)) {
        let mess = choices[0].message;
        mess.content = marked.parse(mess.content);
        this.messages.push(mess);
      }
      this.thinking = false;
    },
  },
  template: `
              <div class="uip-flex uip-flex-column uip-ai-block  uip-position-relative">
                
                <component is="style" scoped>
                  .uip-ai-block pre{
                    max-width: 100%;
                    overflow: auto; 
                  }
                  .uip-ai-block p{
                    margin-top: 0 !important;
                    margin-bottom:1rem !important;
                  }
                  .uip-typing-animation circle {
                    fill: grey;
                    animation: typing-fill 1.4s linear infinite;
                  }
                  .uip-typing-animation circle:nth-child(2) {
                    animation-delay: 0.2s;
                  }
                  .uip-typing-animation circle:nth-child(3) {
                    animation-delay: 0.5s;
                  }
                  
                  @keyframes typing-fill {
                    0% {
                      fill: grey;
                    }
                    50% {
                      fill: black;
                    }
                    100% {
                      fill: grey;
                    }
                  }
                </component>
              
                <div class="uip-flex-grow uip-flex uip-flex-column uip-row-gap-s uip-w-300 uip-chat-area uip-overflow-auto uip-h-600 uip-padding-bottom-l">
                
                  <div v-if="!returnKey" class="uip-background-orange-wash uip-border-rounder uip-padding-s">
                    {{strings.apiKeyMissing}}
                  </div>
                  <template v-else v-for="message in messages">
                  
                    <div v-if="message.role != 'system'" :class="{'uip-flex-right uip-padding-left-m' : message.role == 'user', 'uip-flex-left uip-padding-right-m' : message.role == 'assistant'}" class="uip-flex uip-scale-in uip-max-w-100p">
                      <div class="uip-border-rounder uip-padding-xs uip-max-w-100p"
                      :class="{'uip-background-primary uip-text-inverse uip-user-message' : message.role == 'user','uip-background-muted uip-bot-message' : message.role == 'assistant'}"
                      v-html="message.content">
                      </div>
                    </div>
                  
                  </template>
                  
                  <div v-if="thinking" class="uip-flex uip-flex-left uip-fade-in">
                    <div class="uip-background-muted uip-margin-right-m uip-text-l uip-border-rounder uip-padding-xs">
                    
                        <svg class="uip-typing-animation" height="10" width="28">
                          <circle  cx="4" cy="4" r="4"/>
                          <circle cx="14" cy="4" r="4"/>
                          <circle cx="24" cy="4" r="4"/>
                        </svg>
                        
                    </div>
                  </div>
                  
                  <div v-if="error" class="uip-background-red-wash uip-border-rounder uip-padding-s">
                    {{errorMessage}}
                  </div>
                </div>
                
                <div class="uip-shadow uip-overflow-hidden uip-border-rounder uip-background-default uip-padding-xs uip-flex uip-gap-xs uip-flex-center uip-chat-input 
                uip-position-absolute uip-left-16 uip-right-16 uip-bottom-16">
                
                  <textarea ref="newMessage" v-model="newMessage" @keyup.enter.prevent="submiteNewMessage($event)"
                  class="uip-no-resize uip-blank-input uip-min-h-20 uip-h-20 uip-overflow-hidden uip-flex-grow" :placeholder="strings.sendAmessage" @input="resizeTextarea($event)"></textarea>
                  
                  <div class="uip-icon uip-padding-xxs uip-border-rounder hover:uip-background-muted uip-transition-all uip-text-xl"
                  :class="{'uip-text-accent' : newMessage.length > 0, 'uip-text-muted' : newMessage.length == 0, }" @click="submiteNewMessage($event)">send</div>
                  
                </div>
              </div>
              `,
};
