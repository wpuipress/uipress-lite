const { __, _x, _n, _nx } = wp.i18n;
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
  if (!isObject(obj)) return false;
  // Fill to handle old method of checking nested objects
  if (Array.isArray(keys[0])) {
    keys = keys[0];
  }
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
    if (v === "true" || v === true) return "uiptrue";
    if (v === "false" || v === false) return "uipfalse";
    if (v === "") return "uipblank";
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
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;

    // Move textarea out of the viewport so it's not visible
    textArea.style.position = "absolute";
    textArea.style.left = "-999999px";

    document.body.prepend(textArea);
    textArea.select();

    try {
      document.execCommand("copy");
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
  return obj !== null && typeof obj === "object" && obj.constructor === Object;
}

/**
 * Checks whether an item is defined and not empty
 *
 * @param {*} value - The item to check
 * @returns {boolean} - True if value undefined, otherwise false
 * @since 3.2.13
 */
export function isUnDefined(value) {
  if (typeof value === "undefined") return true;
  return value === null || value === "";
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
  if (!("options" in block.settings[group])) return false;

  const optionGroup = block.settings[group].options;
  if (!isObject(optionGroup[key])) return false;
  if (!("value" in optionGroup[key])) return false;

  // Set return value;
  let value = optionGroup[key].value;

  // Undefined value so return false
  if (isUnDefined(value)) return false;

  return value;
}

/**
 * Creates a unique ID - primarily used for blocks in the ui builder
 *
 * @since 3.2.13
 */
export function createUID() {
  let uniqid = Date.now().toString(16) + Math.random().toString(16).slice(2);
  uniqid += Math.random().toString(16).slice(2) + performance.now().toString(16);
  const forward = generateRandomString(3);
  return (forward + uniqid).substring(0, 24);
}

/**
 * Generates a random string
 *
 * @since 3.2.13
 */
export function generateRandomString(length = 4) {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

/**
 * Main fetch action for the app
 *
 * @param {String} url - the action url
 * @param {Object} data - the post data
 * @since 3.0.0
 */
export async function sendServerRequest(url, data) {
  const errorMessage = __("Bad request", "uipress-lite");
  const emitError = () => {
    this.notify(errorMessage, "", "error");
  };
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Length": "0" },
    body: data,
  });

  // Throw error if failed
  if (!response.ok) {
    errorMessage(errorMessage);
    return { error: true, message: errorMessage };
  }

  const responseData = await response.text();
  const parsedData = uipParseJson(responseData);

  if (!parsedData) {
    errorMessage(errorMessage);
    return { error: true, message: errorMessage };
  }

  return parsedData;
}

/**
 * Parses data and converts specific true false values to Boolean
 *
 * @since 3.0.0
 */
export function uipParseJson(data) {
  return JSON.parse(data, (k, v) => (v === "uiptrue" ? true : v === "uipfalse" ? false : v === "uipblank" ? "" : v));
}

/**
 * Global method for updating iframe page
 *
 * @param {String} newURL - the url to update to
 * @param {Boolean} reloadPage - whether to force reload the page
 * @since 3.0.0
 */
export function updateAppPage(newURL, reloadPage) {
  const absoluteCheck = new RegExp("^(?:[a-z+]+:)?//", "i");
  const adminURL = this.adminURL;

  if (!newURL) return;
  if (newURL.startsWith("#")) return (location.hash = newURL);

  newURL = newURL.replace(/&amp;/g, "&");
  //Dispatch link change event
  let shortURL = newURL;
  if (absoluteCheck.test(newURL)) {
    if (newURL.includes(adminURL)) {
      shortURL = newURL.replace(adminURL, "");
    }
  }

  // Dispatch page change event
  const strippedURL = stripUIPparams(shortURL, adminURL);
  const linkeChangeEvent = new CustomEvent("uipress/app/page/change", { detail: { url: strippedURL } });
  document.dispatchEvent(linkeChangeEvent);

  if (!absoluteCheck.test(newURL)) {
    newURL = adminURL + newURL;
  }

  let url = new URL(newURL);

  const isBuilder = this.isBuilder;

  // Check if we are disabling uipress on given page
  const handleDisabledPages = (pages) => {
    if (!Array.isArray(pages) || isBuilder) return;
    for (let page of pages) {
      if (url.href != page && !url.href.includes(page)) continue;
      window.location.assign(url);
    }
  };
  if (typeof UIPdisableUserPages !== "undefined") {
    handleDisabledPages(UIPdisableUserPages);
  }

  // If dynamic loading is disabled reload the whole page
  if (typeof UIPdisableDynamicLoading !== "undefined") {
    const disabledDynamicLoading = !isUnDefined(UIPdisableDynamicLoading) && !isBuilder ? true : false;
    if (disabledDynamicLoading) return window.location.assign(url);
  }

  // Check for front end load without frame and reload
  if (typeof UIPfrontEndReload !== "undefined") {
    const frontEndReload = !isUnDefined(UIPfrontEndReload) && !isBuilder ? true : false;
    if (frontEndReload) {
      if (!url.href.includes(adminURL)) {
        return window.location.assign(url);
      }
    }
  }

  maybeForceReload(url);

  // Force a page reload (used for navigation between subsites)
  if (reloadPage && !isBuilder) {
    return window.location.assign(url);
  }

  // Dispatch page updating event
  const uipUpdateFrame = new CustomEvent("uip_update_frame_url", { detail: { url: url } });
  document.dispatchEvent(uipUpdateFrame);

  const frame = document.querySelector(".uip-page-content-frame");
  // There is no iframe to update so we are going to refresh the page manually
  if (!frame && !isBuilder) {
    window.location.assign(url);
  }
}

/**
 * Updates active link without changing page
 *
 * @param {String} url
 *
 * @since 3.0.0
 */
export function updateActiveLink(newURL) {
  const adminURL = this.adminURL;
  let absoluteCheck = new RegExp("^(?:[a-z+]+:)?//", "i");

  //Dispatch link change event
  let shortURL = absoluteCheck.test(newURL) && newURL.includes(adminURL) ? newURL.replace(adminURL, "") : newURL;
  let fullURL = !absoluteCheck.test(newURL) ? adminURL + newURL : newURL;

  fullURL = fullURL.replace("about:blank", "");
  shortURL = shortURL.replace("about:blank", "");

  let url = new URL(fullURL);
  url.searchParams.delete("uip-framed-page", 1);
  url.searchParams.delete("uip-hide-screen-options", 1);
  url.searchParams.delete("uip-hide-help-tab", 1);
  url.searchParams.delete("uip-default-theme", 1);
  url.searchParams.delete("uip-hide-notices", 1);
  url.searchParams.delete("uipid", 1);

  maybeForceReload(url);

  //Only update window history if we are in production
  //if (!this.isBuilder) history.pushState({}, null, url);

  const uipActiveLinkChange = new CustomEvent("uipress/app/page/change", { detail: { url: stripUIPparams(shortURL, adminURL) } });
  document.dispatchEvent(uipActiveLinkChange);
}

/**
 * Removes uiPress based params from a url
 *
 * @param {String} link - the url to strip
 * @param {String} adminURL - the sites admin url
 * @since 3.0.0
 */
export function stripUIPparams(link, adminURL) {
  if (!link) return link;

  const absoluteCheck = new RegExp("^(?:[a-z+]+:)?//", "i");

  let url = absoluteCheck.test(link) ? new URL(link) : new URL(adminURL + link);

  url.searchParams.delete("uip-framed-page");
  url.searchParams.delete("uip-hide-screen-options");
  url.searchParams.delete("uip-hide-help-tab");
  url.searchParams.delete("uip-default-theme");
  url.searchParams.delete("uip-hide-notices");
  url.searchParams.delete("uipid");

  return url.href.replace(adminURL, "");
}

/**
 * Checks whether the current screen is incompatible with uipress frames and reloads the whole page
 *
 * @since 3.0.92
 */
export function maybeForceReload(url) {
  // bricks
  if (url.searchParams.get("bricks") == "run") {
    return window.location.assign(url);
  }

  // motion.page
  if (url.searchParams.get("page") == "motionpage") {
    url.searchParams.set("uip-framed-page", 1);
    return window.location.assign(url);
  }

  //Elementor
  if (url.searchParams.get("action") == "elementor") {
    url.searchParams.set("uip-framed-page", 1);
    return window.location.assign(url);
  }

  // Elementor
  if (url.searchParams.get("page") == "elementor-app") {
    url.searchParams.set("uip-framed-page", 1);
    return window.location.assign(url);
  }

  // Breakdance
  if (url.searchParams.get("breakdance") == "builder") {
    url.searchParams.set("uip-framed-page", 1);
    return window.location.assign(url);
  }

  // Oxygen
  if (url.searchParams.get("ct_builder") == "true") {
    url.searchParams.set("uip-framed-page", 1);
    return window.location.assign(url);
  }

  // Piotnet forms
  if (url.searchParams.get("page") == "piotnetforms" && url.searchParams.get("post")) {
    url.searchParams.set("uip-framed-page", 1);
    return window.location.assign(url);
  }

  // Zion builder
  if (url.searchParams.get("action") == "zion_builder_active") {
    url.searchParams.set("uip-framed-page", 1);
    return window.location.assign(url);
  }

  // Divi builder
  if (url.searchParams.get("et_fb") == "1") {
    url.searchParams.set("uip-framed-page", 1);
    return window.location.assign(url);
  }
}

/**
 * Save user preference
 *
 * @param {String} key - the preference meta key
 * @param {*} value - the new value for the preference
 * @param {Boolean} notification = whether to show a success notification
 * @since 3.0.0
 */
export async function saveUserPreference(key, value, notification) {
  let formData = new FormData();

  // Format value
  value = value == true ? "uiptrue" : value;
  value = value == false ? "uipfalse" : value;
  value = prepareJSON(value);

  formData.append("action", "uip_save_user_preference");
  formData.append("security", uip_ajax.security);
  formData.append("key", key);
  formData.append("value", value);

  const response = await sendServerRequest(uip_ajax.ajax_url, formData);

  if (response.error) {
    //this.notify(response.message, '', 'error', true);
    return false;
  }

  if (notification) {
    //this.notify(__('Preference updated', 'uipress-lite'), '', 'success', true);
  }
  //success
  return true;
}

/**
 * Recursively goes over template and checks for required fields.
 * Used for validating imported templates & patterns
 *
 * @param {Array} content - The template array for checking
 * @param {Boolean} keepUID - whether to keep block IDS
 * @since 3.0.0
 */
export async function validDateTemplate(content, keepUID) {
  return Promise.all(content.map((block) => validateBlock(block, keepUID)));
}

/**
 * Validates a block from an imported template
 *
 * @param {Object} block - the block to check
 * @param {Boolean} keepUID - whether to keep block IDS
 * @since 3.0.0
 */
async function validateBlock(block, keepUID) {
  if (!block.name || !block.moduleName) return false;

  // Update UID to avoid duplicates
  if (!keepUID) block.uid = createUID();

  // No children, so return true
  if (!block.content) return true;

  // Ensure every child block is valid
  return (await Promise.all(block.content.map((childBlock) => validateBlock(childBlock, keepUID)))).every((result) => result);
}

/**
 * Formats a key chain into a visible shortcut
 *
 * @param {Array} keys - the array of shortcut keys
 * @since 3.0.0
 */
export function renderKeyShortCut(keys) {
  const shortcutKeys = [
    "Enter", // Enter
    " ", // Space
    "ArrowLeft", // Left Arrow
    "ArrowUp", // Up Arrow
    "ArrowRight", // Right Arrow
    "ArrowDown", // Down Arrow
  ];
  const shortcutKeysIcons = [
    { key: "Enter", icon: "keyboard_return" }, // Enter
    { key: " ", icon: "space_bar" }, // Space
    { key: "ArrowLeft", icon: "keyboard_arrow_left" }, // Left Arrow
    { key: "ArrowUp", icon: "keyboard_arrow_up" }, // Up Arrow
    { key: "ArrowRight", icon: "keyboard_arrow_right" }, // Right Arrow
    { key: "ArrowDown", icon: "keyboard_arrow_down" }, // Down Arrow
  ];

  let format = "";

  for (let key of keys) {
    if (key == "Meta") {
      format += '<span class="uip-command-icon uip-text-muted"></span>';
    } else if (key == "Alt") {
      format += '<span class="uip-alt-icon uip-text-muted"></span>';
    } else if (key == "Shift") {
      format += '<span class="uip-shift-icon uip-text-muted"></span>';
    } else if (key == "Control") {
      format += '<span class="uip-icon uip-text-muted">keyboard_control_key</span>';
    } else if (key == "Backspace") {
      format += '<span class="uip-icon uip-text-muted">backspace</span>';
    } else if (shortcutKeys.includes(key)) {
      let keyicon = shortcutKeysIcons.find((x) => x.key == key);
      format += `<span class="uip-icon uip-text-muted">${keyicon.icon}</span>`;
    } else {
      format += `<span class="uip-text-muted uip-text-uppercase" style="line-height: 16px;font-size: 11px;">${key}</span>`;
    }
  }

  return format;
}

/**
 * Deletes post / CPT / page by ID -Does relevant capability checks on the back end.
 *
 * Accepts single ID or array
 * @param {Array | Number} postID - array of ids or single post id
 * @since 3.0.0
 */
export async function deleteRemotePost(postID) {
  if (!postID) return;

  let files = Array.isArray(postID) ? JSON.stringify(postID) : JSON.stringify([postID]);

  let self = this;

  let formData = new FormData();
  formData.append("action", "uip_delete_post");
  formData.append("security", uip_ajax.security);
  formData.append("id", files);

  const response = await sendServerRequest(uip_ajax.ajax_url, formData);

  if (response.error) return false;

  if (response.success) return true;
}

/**
 * Get's user preference for given key
 *
 *
 * @param {String} key - the key to fetch
 * @since 3.0.0
 */
export async function getUserPreference(key) {
  let formData = new FormData();
  formData.append("action", "uip_get_user_preference");
  formData.append("security", uip_ajax.security);
  formData.append("key", key);

  const response = await sendServerRequest(uip_ajax.ajax_url, formData);
  if (response.error) return false;
  return response.value;
}
