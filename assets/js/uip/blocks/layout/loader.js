const { __, _x, _n, _nx } = wp.i18n;

/**
 * Container block
 *
 * @since 3.2.13
 */
const Container = {
  name: __("Container", "uipress-lite"),
  moduleName: "uip-container",
  description: __("Creates a container block with options for aligning content", "uipress-lite"),
  group: "layout",
  path: "./blocks/layout/container.min.js",
  icon: "crop_free",
  content: [],
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [],
    },
    //Style options group
    {
      name: "style",
      icon: "dashboard_customize",
      styleType: "style",
    },
  ],
};

/**
 * Dropdown block
 *
 * @since 3.2.13
 */
const Dropdown = {
  name: __("Dropdown", "uipress-lite"),
  moduleName: "uip-dropdown",
  description: __("Creates a dropdown with a customisable trigger", "uipress-lite"),
  group: "layout",
  path: "./blocks/layout/dropdown.min.js",
  icon: "expand_circle_down",
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
          uniqueKey: "buttonText",
          label: __("Trigger text", "uipress-lite"),
          value: {
            string: __("Press me", "uipress-lite"),
            dynamic: false,
            dynamicKey: "",
            dynamicPos: "left",
          },
        },
        { option: "iconSelect", componentName: "icon-select", label: __("Icon", "uipress-lite") },
        {
          option: "iconPosition",
          componentName: "choice-select",
          args: {
            options: {
              left: {
                value: "left",
                label: __("Left", "uipress-lite"),
              },
              right: {
                value: "right",
                label: __("Right", "uipress-lite"),
              },
            },
          },
          label: __("Icon position", "uipress-lite"),
          value: { value: "left" },
        },
        {
          option: "choice-select",
          componentName: "choice-select",
          uniqueKey: "openMode",
          args: {
            options: {
              click: {
                value: "click",
                label: __("Click", "uipress-lite"),
              },
              hover: {
                value: "hover",
                label: __("Hover", "uipress-lite"),
              },
            },
          },
          label: __("Mode", "uipress-lite"),
          value: { value: "click" },
        },
        {
          option: "defaultSelect",
          componentName: "default-select",
          uniqueKey: "dropDirection",
          label: __("Dropdown position", "uipress-lite"),
          args: {
            options: [
              {
                value: "bottom center",
                label: __("Bottom center", "uipress-lite"),
              },
              {
                value: "bottom left",
                label: __("Bottom left", "uipress-lite"),
              },
              {
                value: "bottom right",
                label: __("Bottom right", "uipress-lite"),
              },
              {
                value: "top center",
                label: __("Top center", "uipress-lite"),
              },
              {
                value: "top left",
                label: __("Top left", "uipress-lite"),
              },
              {
                value: "top right",
                label: __("Top right", "uipress-lite"),
              },
              {
                value: "left center",
                label: __("Left center", "uipress-lite"),
              },
              {
                value: "left top",
                label: __("Left top", "uipress-lite"),
              },
              {
                value: "left bottom",
                label: __("Left bottom", "uipress-lite"),
              },
              {
                value: "right center",
                label: __("Right center", "uipress-lite"),
              },
              {
                value: "right top",
                label: __("Right top", "uipress-lite"),
              },
              {
                value: "right bottom",
                label: __("Right bottom", "uipress-lite"),
              },
            ],
          },
          value: "bottom-left",
        },
        { option: "keyboardShortcut", componentName: "keyboard-shortcut", label: __("Keyboard shortcut", "uipress-lite") },
      ],
    },

    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },

    {
      name: "trigger",
      label: __("Trigger styles", "uipress-lite"),
      icon: "smart_button",
      styleType: "style",
      class: ".uip-drop-trigger",
    },
    {
      name: "dropdown",
      label: __("Dropdown styles", "uipress-lite"),
      icon: "palette",
      styleType: "style",
      class: ".uip-dropdown-container",
    },
  ],
};

/**
 * Responsive grid block
 *
 * @since 3.2.13
 */
const ResponsiveGrid = {
  name: __("Responsive grid", "uipress-lite"),
  moduleName: "responsive-grid",
  description: __("Outputs a responsive grid", "uipress-lite"),
  group: "layout",
  path: "./blocks/layout/responsive-grid.min.js",
  icon: "grid_view",
  content: [],
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [
        { option: "number", uniqueKey: "columnsNum", label: __("Columns", "uipress-lite"), value: 3 },
        {
          option: "valueUnits",
          componentName: "value-units",
          uniqueKey: "minWidth",
          label: __("Min col width", "uipress-lite"),
          value: { value: 100, units: "px" },
        },
        { option: "valueUnits", componentName: "value-units", uniqueKey: "gridGap", label: __("Grid gap", "uipress-lite"), value: { value: 1, units: "rem" } },
      ],
    },

    {
      name: "style",
      label: __("Content area", "uipress-lite"),
      icon: "dashboard_customize",
      styleType: "style",
    },
  ],
};

/**
 * Slide out block
 *
 * @since 3.2.13
 */
const SlideOut = {
  name: __("Slide out panel", "uipress-lite"),
  moduleName: "uip-slide-out",
  description: __("Creates a slide out panel with a customisable trigger", "uipress-lite"),
  group: "layout",
  path: "./blocks/layout/slide-out-panel.min.js",
  icon: "space_dashboard",
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
          uniqueKey: "buttonText",
          label: __("Trigger text", "uipress-lite"),
          value: {
            string: __("Press me", "uipress-lite"),
            dynamic: false,
            dynamicKey: "",
            dynamicPos: "left",
          },
        },
        { option: "iconSelect", componentName: "icon-select", label: __("Icon", "uipress-lite") },
        {
          option: "iconPosition",
          componentName: "choice-select",
          args: {
            options: {
              left: {
                value: "left",
                label: __("Left", "uipress-lite"),
              },
              right: {
                value: "right",
                label: __("Right", "uipress-lite"),
              },
            },
          },
          label: __("Icon position", "uipress-lite"),
          value: { value: "left" },
        },
        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "panelSide",
          label: __("Panel position", "uipress-lite"),
          args: {
            options: {
              left: {
                value: "left",
                label: __("Left", "uipress-lite"),
              },
              right: {
                value: "right",
                label: __("Right", "uipress-lite"),
              },
            },
          },
          value: {
            value: "right",
          },
        },
        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "overlayStyle",
          label: __("Style", "uipress-lite"),
          args: {
            options: {
              overlay: {
                value: "overlay",
                label: __("Overlay", "uipress-lite"),
              },
              push: {
                value: "push",
                label: __("Push", "uipress-lite"),
              },
            },
          },
          value: {
            value: "overlay",
          },
        },
        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "closeOnPageChange",
          args: {
            options: {
              false: {
                value: false,
                label: __("Disabled", "uipress-lite"),
              },
              true: {
                value: true,
                label: __("Enabled", "uipress-lite"),
              },
            },
          },
          label: __("Close on page change", "uipress-lite"),
        },
        { option: "keyboardShortcut", componentName: "keyboard-shortcut", label: __("Keyboard shortcut", "uipress-lite") },
      ],
    },
    {
      name: "style",
      icon: "dashboard_customize",
      styleType: "style",
    },
    {
      name: "trigger",
      label: __("Trigger style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
      class: ".uip-panel-trigger",
    },
    {
      name: "panel",
      label: __("Panel styles", "uipress-lite"),
      icon: "palette",
      styleType: "style",
      class: ".uip-offcanvas-panel",
    },
  ],
};

/**
 * Pro placeholders
 *
 * @since 3.2.13
 */
const Modal = {
  name: __("Modal", "uipress-lite"),
  moduleName: "uip-block-modal",
  description: __("Outputs a modal block with a customisable trigger", "uipress-lite"),
  group: "layout",
  icon: "open_in_new",
};

(function () {
  const blocks = [Container, Dropdown, ResponsiveGrid, SlideOut, Modal];
  wp.hooks.addFilter("uipress.blocks.register", "uipress", (currentBlocks) => [...currentBlocks, ...blocks]);
})();
