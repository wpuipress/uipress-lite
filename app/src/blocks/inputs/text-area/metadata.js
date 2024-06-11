const { __ } = wp.i18n;
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Text area", "uipress-lite"),
  moduleName: "text-area",
  description: __("A simple textarea input for use with the form block", "uipress-lite"),
  group: "form",
  path: "./blocks/inputs/text-area.min.js",
  icon: "segment",
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
          uniqueKey: "inputLabel",
          label: __("Label", "uipress-lite"),
          value: {
            string: __("Text input", "uipress-lite"),
          },
        },
        {
          option: "textField",
          componentName: "uip-input",
          uniqueKey: "inputName",
          label: __("Meta key", "uipress-lite"),
          args: { metaKey: true },
        },
        {
          option: "title",
          componentName: "uip-dynamic-input",
          uniqueKey: "inputPlaceHolder",
          label: __("Placeholder", "uipress-lite"),
          value: {
            string: __("Placeholder text...", "uipress-lite"),
          },
        },
        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "inputRequired",
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
          label: __("Required field", "uipress-lite"),
          value: { value: false },
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
      name: "inputStyle",
      label: __("Textarea style", "uipress-lite"),
      icon: "input",
      styleType: "style",
      class: ".uip-input",
    },
    {
      name: "label",
      label: __("Label", "uipress-lite"),
      icon: "label",
      styleType: "style",
      class: ".uip-input-label",
    },
  ],
};
