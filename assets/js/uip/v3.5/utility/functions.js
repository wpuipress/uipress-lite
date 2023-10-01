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
 * Checks if a nested object exists. Returns false if not, object value if so
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
export function isObject(obj) {
  return obj !== null && typeof obj === 'object' && obj.constructor === Object;
}

/**
 * Checks whether an item is defined and not empty
 *
 * @param {*} value - The item to check
 * @returns {boolean} - True if value undefined, otherwise false
 * @since 3.2.13
 */
export function isUnDefined(value) {
  return typeof value === 'undefined' || value === null || value === '';
}

/**
 * Gets a block setting
 *
 * @param {Object} block - the block to get the setting for
 * @param {String} group - the setting group
 * @param {String} key - the setting key
 * @since 3.0.0
 */
export function get_block_option(block, group, key) {
  // Check required basics
  if (isUnDefined(block.settings)) return false;
  if (!(group in block.settings)) return false;
  if (!isObject(block.settings[group])) return false;
  if (!('options' in block.settings[group])) return false;

  const optionGroup = block.settings[group].options;
  if (!isObject(optionGroup[key])) return false;
  if (!('value' in optionGroup[key])) return false;

  // Set return value;
  let value = optionGroup[key].value;

  // Undefined value so return false
  if (isUnDefined(value)) return false;

  return value;
}
