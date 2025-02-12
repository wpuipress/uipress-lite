import {
  ensureNestedObject,
  hasNestedPath,
  prepareJSON,
  deepClone,
  copyToClipboard,
  isObject,
  isUnDefined,
  get_block_option,
  createUID,
  sendServerRequest,
  updateAppPage,
  saveUserPreference,
  updateActiveLink,
  uipParseJson,
} from "@/utility/functions.js";

/**
 * registerGlobalProperties
 *
 * @param {vueapp} app
 */
export const registerGlobalProperties = (app) => {
  app.config.globalProperties.ensureNestedObject = ensureNestedObject;
  app.config.globalProperties.hasNestedPath = hasNestedPath;
  app.config.globalProperties.prepareJSON = prepareJSON;
  app.config.globalProperties.deepClone = deepClone;
  app.config.globalProperties.copyToClipboard = copyToClipboard;
  app.config.globalProperties.isObject = isObject;
  app.config.globalProperties.isUnDefined = isUnDefined;
  app.config.globalProperties.get_block_option = get_block_option;
  app.config.globalProperties.createUID = createUID;
  app.config.globalProperties.sendServerRequest = sendServerRequest;
  app.config.globalProperties.updateAppPage = updateAppPage.bind({ adminURL: uip_ajax.uipAppData?.options?.adminURL, isBuilder: false });
  app.config.globalProperties.updateActiveLink = updateActiveLink.bind({ adminURL: uip_ajax.uipAppData?.options?.adminURL, isBuilder: false });
  app.config.globalProperties.saveUserPreference = saveUserPreference;
  app.config.globalProperties.uipParseJson = uipParseJson;
};
