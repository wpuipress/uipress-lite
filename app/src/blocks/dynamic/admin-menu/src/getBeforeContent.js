/**
 * Retrieves the content and font-family of an element's :before pseudo-element.
 * @param {HTMLElement} tempElement - The element to check for :before pseudo-element styles.
 * @returns {Object} An object containing the content and font-family of the :before pseudo-element.
 */
export const getBeforeContent = (tempElement) => {
  // Get the computed styles
  const styles = window.getComputedStyle(tempElement, ":before");

  // Get the content
  let content = styles.getPropertyValue("content");
  const font = styles.getPropertyValue("font-family");
  let backGroundImage = styles.getPropertyValue("background-image");
  backGroundImage = backGroundImage != "none" ? backGroundImage : false;

  if (content == "none") content = "";

  // Return the content (removing quotes if present)
  return { content: content.replace(/^["']|["']$/g, ""), font, backGroundImage };
};
