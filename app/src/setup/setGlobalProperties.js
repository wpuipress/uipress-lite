import { config } from "@/store/app/constants.js";

export const setGlobalProperties = (appStore) => {
  // Get script tag
  const scriptTag = document.querySelector("#uip-app-data");

  // Bail if no script tag
  if (!scriptTag) return;

  // Get data attributes
  const restBase = scriptTag.getAttribute("rest-base");
  const restNonce = scriptTag.getAttribute("rest-nonce");
  const cacheKey = scriptTag.getAttribute("cache-key");
  const templateType = scriptTag.getAttribute("template-type");
  const templateID = scriptTag.getAttribute("template-id");
  const pluginBase = scriptTag.getAttribute("plugin-base");
  const siteID = scriptTag.getAttribute("site-id");
  const adminUrl = scriptTag.getAttribute("admin-url");
  const siteURL = scriptTag.getAttribute("site-url");
  const userID = scriptTag.getAttribute("user-id");
  const username = scriptTag.getAttribute("user-name");
  let roles = scriptTag.getAttribute("user-roles");

  roles = JSON.parse(roles);

  // Update store properties
  appStore.updateState("restBase", restBase);
  appStore.updateState("restNonce", restNonce);
  appStore.updateState("userRoles", roles);
  appStore.updateState("cacheKey", cacheKey);
  appStore.updateState("pluginBase", pluginBase);
  appStore.updateState("adminUrl", adminUrl);
  appStore.updateState("siteURL", siteURL);
  appStore.updateState("userID", userID);
  appStore.updateState("username", username);
  appStore.updateState("siteID", siteID);
  appStore.updateState("templateType", config.value.templateType || templateType);
  appStore.updateState("templateID", config.value.templateId || templateID);
  appStore.updateState("teleportPoint", "body");
};
