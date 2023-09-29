/**
 * Checks if a nested object exists. if not, it creates each step
 *
 * @param {Object} obj - the object to check against
 * @param {Array} keys - The nested keys to check
 * @since 3.2.13
 */
export function ensureNestedObject(obj, ...keys) {
  keys.reduce((acc, key, index, arr) => {
    if (!acc[key]) acc[key] = {};
    return acc[key];
  }, obj);
}

/**
 * Checks if a nested object exists. Returns false if not, true if so
 *
 * @param {Object} obj - the object to check against
 * @param {Array} keys - The nested keys to check
 * @returns {Boolean | Mixed} - returns false on path doesn't exist. Returns value otherwise
 * @since 3.2.13
 */
export function hasNestedPath(obj, ...keys) {
  for (let key of keys) {
    if (obj.hasOwnProperty(key)) {
      obj = obj[key];
    } else {
      return false; // or undefined, or any other suitable value to indicate "not found"
    }
  }
  return obj;
}

/**
 * Preps JSON data for saving to db
 *
 * @param {Object | Array} data - the data to prepare
 * @since 3.2.13
 */
export function prepareJSON(data) {
  const handler = (k, v) => {
    if (v === 'true' || v === true) return 'uiptrue';
    if (v === 'false' || v === false) return 'uipfalse';
    if (v === '') return 'uipblank';
    return v;
  };
  return JSON.stringify(data, handler);
}

/**
 * Preps JSON data for saving to db
 *
 * @param {Object | Array} data - the data to prepare
 * @since 3.2.13
 */
export function deepClone(data) {
  const string = JSON.stringify(data);
  return JSON.parse(string);
}

/**
 * Copies text to clipboard
 *
 * @param {String} textToCopy - The text to copy
 * @since 3.2.13
 */
export async function copyToClipboard(textToCopy) {
  // Navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(textToCopy);
  } else {
    // Use the 'out of viewport hidden text area' trick
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;

    // Move textarea out of the viewport so it's not visible
    textArea.style.position = 'absolute';
    textArea.style.left = '-999999px';

    document.body.prepend(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (error) {
      console.error(error);
    } finally {
      textArea.remove();
    }
  }
}

/**
 * Checks if given item is a plain object
 *
 * @param {*} obj - The item to check
 * @returns {boolean} - True if obj is a plain object, otherwise false
 * @since 3.0.0
 */
function isObject(obj) {
  return obj !== null && typeof obj === 'object' && obj.constructor === Object;
}
