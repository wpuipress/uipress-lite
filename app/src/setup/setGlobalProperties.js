export const setGlobalProperties = (appStore) => {
  // Get script tag
  const scriptTag = document.querySelector("#uip-app-data");

  // Bail if no script tag
  if (!scriptTag) return;

  // Get data attributes
  const restBase = scriptTag.getAttribute("rest-base");
  const restNonce = scriptTag.getAttribute("rest-nonce");
  const cacheKey = scriptTag.getAttribute("cache-key");
  const pluginBase = scriptTag.getAttribute("plugin-base");
  const adminUrl = scriptTag.getAttribute("admin-url");
  let roles = scriptTag.getAttribute("user-roles");

  roles = JSON.parse(roles);

  // Update store properties
  appStore.updateState("restBase", restBase);
  appStore.updateState("restNonce", restNonce);
  appStore.updateState("userRoles", roles);
  appStore.updateState("cacheKey", cacheKey);
  appStore.updateState("pluginBase", pluginBase);
  appStore.updateState("adminUrl", adminUrl);
  appStore.updateState("teleportPoint", "body");
};
