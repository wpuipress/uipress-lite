import { __ } from "@wordpress/i18n";
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Form", "uipress-lite"),
  moduleName: "form-block",
  description: __("Form elements can be dragged into this block to create custom forms", "uipress-lite"),
  group: "form",
  path: "./blocks/inputs/form-block.min.js",
  icon: "edit_note",
  content: [],
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [
        {
          option: "title",
          componentName: "uip-dynamic-input",
          uniqueKey: "submitText",
          label: __("Submit text", "uipress-lite"),
          value: {
            string: __("Send", "uipress-lite"),
            dynamic: false,
            dynamicKey: "",
            dynamicPos: "left",
          },
        },
        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "prePopulate",
          args: {
            options: {
              false: {
                value: false,
                label: __("No", "uipress-lite"),
              },
              true: {
                value: true,
                label: __("Yes", "uipress-lite"),
              },
            },
          },
          label: __("Prefill data", "uipress-lite"),
          value: { value: false },
        },
        {
          option: "submitAction",
          componentName: "submit-actions",
          label: "",
          args: { fullWidth: true },
        },
        {
          option: "paragraph",
          componentName: "uip-paragraph-input",
          uniqueKey: "successMessage",
          label: __("Success message", "uipress-lite"),
          args: { fullWidth: true },
          value: __("Form sent successfully!", "uipress-lite"),
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
      name: "formArea",
      label: __("Form area", "uipress-lite"),
      icon: "sort",
      styleType: "style",
      class: ".uip-form-area",
    },
    {
      name: "submitButton",
      label: __("Submit button", "uipress-lite"),
      icon: "smart_button",
      styleType: "style",
      class: ".uip-submit-button",
    },
  ],
};
