const { __, _x, _n, _nx } = wp.i18n;
import '../../../libs/marked.min.js';
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
    },
    data: function () {
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
    inject: ['uipData', 'uipress', 'uiTemplate'],
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
    created: function () {
      let self = this;

      this.setMessages();
    },
    computed: {
      returnKey() {
        let key = this.uipress.get_block_option(this.block, 'block', 'apiKey');
        return key;
      },
      returnWelcome() {
        let welcome = this.uipress.get_block_option(this.block, 'block', 'welcomeMessage');
        return welcome;
      },
      returnSystem() {
        let system = this.uipress.get_block_option(this.block, 'block', 'systemMessage');
        return system;
      },
      returnModel() {
        let model = this.uipress.get_block_option(this.block, 'block', 'chatModel');
        if (!model) {
          return 'gpt-3.5-turbo';
        }
        return model;
      },
    },
    methods: {
      setMessages() {
        if (this.returnSystem) {
          let current = this.messages.findIndex((item) => item.role === 'system');
          if (current) {
            this.messages[current].content = this.returnSystem;
          } else {
            this.messages.push({ role: 'system', content: this.returnSystem });
          }
        }

        if (this.returnWelcome) {
          let current = this.messages.findIndex((item) => item.welcome === true);
          if (current > -1) {
            this.messages[current].content = this.returnWelcome;
          } else {
            this.messages.push({ role: 'assistant', content: this.returnWelcome, welcome: true });
          }
        }
      },
      resizeTextarea(event) {
        event.target.style.height = '';
        let newHeight = Math.min(event.target.scrollHeight, 500);
        event.target.style.height = newHeight + 'px';

        if (newHeight == 500) {
          event.target.style.overflow = 'auto';
        } else {
          event.target.style.overflow = 'hidden';
        }
      },
      submiteNewMessage(e) {
        if (e.shiftKey || e.metaKey) {
          return;
        } else {
          e.preventDefault();
        }

        if (!this.returnKey) {
          return;
        }
        let self = this;
        if (self.newMessage.trim() == '') {
          return;
        }

        self.messages.push({
          content: this.newMessage,
          role: 'user',
        });

        self.newMessage = '';
        self.$refs.newMessage.style.height = '20px';

        self.sendMessageToGPT();
      },
      sendMessageToGPT() {
        let self = this;

        let current = this.messages.findIndex((item) => item.welcome === true);
        if (current > -1) {
          delete this.messages[current].welcome;
        }

        let stringMessages = JSON.stringify(self.messages);
        let key = self.returnKey;
        self.error = false;

        if (current > -1) {
          this.messages[current].welcome = true;
        }

        self.thinking = true;

        //Build form data for fetch request
        let formData = new FormData();
        formData.append('action', 'uip_send_message_to_gpt');
        formData.append('security', uip_ajax.security);
        formData.append('messages', stringMessages);
        formData.append('key', key);
        formData.append('model', this.returnModel);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          if (response.error) {
            self.error = true;
            self.errorMessage = response.message;
            self.thinking = false;
            return;
          }

          let error = self.uipress.checkNestedValue(response, ['message', 'error']);
          if (error) {
            self.error = true;
            self.errorMessage = error.message + ' - error code: ' + error.code;
            self.thinking = false;
            return;
          }

          let choices = self.uipress.checkNestedValue(response, ['message', 'choices']);
          if (Array.isArray(choices)) {
            let mess = choices[0].message;
            mess.content = marked.parse(mess.content);
            self.messages.push(mess);
          }
          self.thinking = false;
        });
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
}
