/**
 * registerDynamicBlocks.js
 * Applies a filter and registers custom blocks
 *
 * @since 3.4.0
 */
export const registerDynamicBlocks = (app) => {
  //Import dynamic plugins
  const DynamicBlocks = wp.hooks.applyFilters("uipress.blocks.register");
  if (Array.isArray(DynamicBlocks)) {
    const currentBlocks = app.config.globalProperties.uipApp.data.blocks;
    /* Loops new blocks */
    for (let block of DynamicBlocks) {
      /* Delete the render function to remove any vue instance context */
      delete block.component.render;

      /* Check if it's an existing block */
      const key = block.metadata.moduleName;
      const existingIndex = currentBlocks.findIndex((item) => item.metadata.moduleName == key);

      /* We found the placeholder so replace it with the new block */
      if (existingIndex >= 0) {
        currentBlocks.splice(existingIndex, 1, block);
      } else {
        currentBlocks.push(block);
      }
    }
  }
};
