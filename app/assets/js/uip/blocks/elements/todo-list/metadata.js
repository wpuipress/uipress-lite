import { __ } from "@wordpress/i18n";
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("To do list", "uipress-lite"),
  moduleName: "todo-list",
  description: __("Outputs a customisable to do list", "uipress-lite"),
  group: "elements",
  path: "./blocks/elements/todo-list.min.js",
  icon: "task_alt",
  optionsEnabled: [
    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },
    {
      name: "button",
      label: __("Add todo button", "uipress-lite"),
      icon: "smart_button",
      styleType: "style",
      class: ".uip-add-todo",
    },
    {
      name: "tabs",
      label: __("Tabs", "uipress-lite"),
      icon: "tab",
      styleType: "style",
      class: ".uip-tabs",
    },
    {
      name: "tab",
      label: __("Tab", "uipress-lite"),
      icon: "tab",
      styleType: "style",
      class: ".uip-tab",
    },
    {
      name: "tabsactive",
      label: __("Active tab", "uipress-lite"),
      icon: "tab",
      styleType: "style",
      class: ".uip-tab-active",
    },
    {
      name: "listArea",
      label: __("List area", "uipress-lite"),
      icon: "list",
      styleType: "style",
      class: ".uip-list-area",
    },
    {
      name: "itemTitle",
      label: __("Item title", "uipress-lite"),
      icon: "title",
      styleType: "style",
      class: ".uip-list-item-title",
    },
    {
      name: "itemDescription",
      label: __("Item description", "uipress-lite"),
      icon: "description",
      styleType: "style",
      class: ".uip-list-item-description",
    },
  ],
};
