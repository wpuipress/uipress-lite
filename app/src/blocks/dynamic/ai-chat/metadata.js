import { __ } from "@wordpress/i18n";
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Ai chat", "uipress-lite"),
  moduleName: "uip-ai-chat",
  description: __("This block allows you to add an ai chat to your templates. OpenAi (chatGPT) API key is required.", "uipress-lite"),
  group: "dynamic",
  path: "./blocks/dynamic/ai-chat.min.js",
  icon: "magic_button",
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [
        {
          option: "textField",
          componentName: "uip-input",
          uniqueKey: "apiKey",
          label: __("openAI API key", "uipress-lite"),
          args: { password: true },
        },
        {
          option: "textField",
          componentName: "uip-input",
          uniqueKey: "welcomeMessage",
          label: __("Welcome message", "uipress-lite"),
          args: { password: false },
        },
        {
          option: "textField",
          componentName: "uip-input",
          uniqueKey: "systemMessage",
          label: __("System message", "uipress-lite"),
          args: { password: false },
          help: __(
            "The system message helps set the behavior of the assistant. For example, you can modify the personality of the assistant or provide specific instructions about how it should behave throughout the conversation.",
            "uipress-lite"
          ),
        },
        {
          option: "defaultSelect",
          componentName: "default-select",
          uniqueKey: "chatModel",
          args: {
            options: [
              {
                value: "gpt-3.5-turbo",
                label: "gpt-3.5-turbo",
              },
              {
                value: "gpt-3.5-turbo-16k",
                label: "gpt-3.5-turbo-16k",
              },
              {
                value: "gpt-4",
                label: "gpt-4",
              },
              {
                value: "gpt-4-32k",
                label: "gpt-4-32k",
              },
            ],
          },
          value: "gpt-3.5-turbo",
          label: __("Chat model", "uipress-lite"),
        },
      ],
    },

    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },

    {
      name: "messagesArea",
      label: __("Messages area", "uipress-lite"),
      icon: "forum",
      styleType: "style",
      class: ".uip-chat-area",
      presets: {
        flexLayout: {
          direction: "column",
          distribute: "start",
          align: "stretch",
          wrap: "nowrap",
          type: "stack",
          placeContent: "normal",
          gap: {
            value: 12,
            units: "px",
          },
        },
      },
    },

    {
      name: "botMessage",
      label: __("Bot message", "uipress-lite"),
      icon: "sms",
      styleType: "style",
      class: ".uip-bot-message",
    },
    {
      name: "userMessage",
      label: __("User message", "uipress-lite"),
      icon: "sms",
      styleType: "style",
      class: ".uip-user-message",
    },

    {
      name: "chatInput",
      label: __("Chat input", "uipress-lite"),
      icon: "input",
      styleType: "style",
      class: ".uip-chat-input",
    },
  ],
};
