/**
 * Retrieves the Dashicon class from an element's class list.
 * @param {HTMLElement} element - The element to check for Dashicon classes.
 * @returns {string|null} The Dashicon class if found, null otherwise.
 */
export const getDashiconClass = (element) => {
  // Get the list of classes
  const classes = element.classList;

  // Check for dashicons-* class
  for (let className of classes) {
    if (className.startsWith("dashicons-") && className !== "dashicons-before") {
      return className;
    }
  }

  // Return null if no matching class is found
  return null;
};
