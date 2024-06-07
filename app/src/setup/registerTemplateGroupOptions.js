import { templategroups, templateSettings } from "@/settings/template-settings-groups.js";

/**
 * registerTemplateGroupOptions
 */
export const registerTemplateGroupOptions = () => {
  wp.hooks.addFilter("uipress.uibuilder.templatesettings.groups.register", "uipress", (current) => ({ ...current, ...templategroups }));
  wp.hooks.addFilter("uipress.uibuilder.templatesettings.options.register", "uipress", (current) => [...current, ...templateSettings]);

  let TemplateGroupOptions = wp.hooks.applyFilters("uipress.uibuilder.templatesettings.groups.register", {});
  let options = wp.hooks.applyFilters("uipress.uibuilder.templatesettings.options.register", []);
  for (let [key, value] of Object.entries(TemplateGroupOptions)) {
    const groupSettings = options.filter((option) => option.group === key);
    TemplateGroupOptions[key].settings = groupSettings;
  }

  return TemplateGroupOptions;
};
