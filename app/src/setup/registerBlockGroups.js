import { blockGroups } from "@/setup/blockGroups.js";

/**
 * Imports block groupings and applies filters
 *
 * @since 3.2.13
 */
export const registerBlockGroups = () => {
  wp.hooks.addFilter("uipress.blocks.groups.register", "uipress", (current) => ({ ...current, ...blockGroups }));
  return wp.hooks.applyFilters("uipress.blocks.groups.register", {});
};
