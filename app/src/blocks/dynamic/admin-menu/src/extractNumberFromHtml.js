/**
 * Extracts a number from a given html string
 *
 * @param {node} html
 *
 * @return {number|null} number on success, null on failure
 * @since 3.2.13
 */
export const extractNumberFromHtml = (node) => {
  if (!node || typeof DOMParser === "undefined") {
    return null;
  }

  const nodes = node.getElementsByTagName("*"); // get all elements

  for (let node of nodes) {
    const nodeValue = node.textContent.trim();
    if (!isNaN(nodeValue)) {
      return parseInt(nodeValue, 10);
    }
  }

  return null;
};
