import { ref } from "vue";

const loading = ref(false);
export const toolbarnode = ref(null);
export const toolbarMenu = ref([]);

/**
 * Parses menu from the dom
 */
export const setToolbar = async (menuNode, clone) => {
  loading.value = true;
  const ignoreItems = [
    "wp-admin-bar-site-name",
    "wp-admin-bar-menu-toggle",
    "wp-admin-bar-app-logo",
    "wp-admin-bar-my-account",
    "wp-admin-bar-wp-logo",
    "wp-admin-bar-search",
    "wp-admin-bar-woocommerce-site-visibility-badge",
  ];

  // There is no menu node so bail
  if (!menuNode) return (loading.value = false);

  const rootItems = menuNode.querySelectorAll("#wp-admin-bar-root-default > li");
  const secondaryItems = menuNode.querySelectorAll("#wp-admin-bar-top-secondary > li");

  const topLevelItems = [...rootItems, ...secondaryItems];
  const menuHolder = [];

  for (let item of topLevelItems) {
    /* Get id and check against list of not needed items */
    const id = item.getAttribute("id");
    if (ignoreItems.includes(id)) continue;

    const linkNode = item.querySelector(":scope > .ab-item");
    const screenReader = item.querySelector(":scope > .ab-item > .screen-reader-text");
    const label = item.querySelector(":scope > .ab-item > .ab-label");
    const icon = item.querySelector(":scope > .ab-item > .ab-icon");
    const svglogo = item.querySelector(":scope > .ab-item .svg");

    // Probably a separator
    if (!linkNode) continue;

    const url = linkNode.getAttribute("href");
    const target = linkNode.getAttribute("target");
    const screenReaderName = screenReader ? screenReader.innerText : "";

    let iconStyle;
    if (svglogo) {
      iconStyle = svglogo.getAttribute("style");
    }

    let before;

    // Override for customise icon as it uses a different format
    if (icon) {
      const computedLinkStyles = window.getComputedStyle(icon, "::before");
      if (computedLinkStyles) {
        const { content, fontFamily } = computedLinkStyles;
        before = { content, fontFamily };
      }
      const computedIconStyles = window.getComputedStyle(icon);
      const backGroundImage = computedIconStyles["background-image"] ? computedIconStyles["background-image"] : false;

      if (backGroundImage && backGroundImage != "none") {
        // Inline the style
        icon.style["background-image"] = backGroundImage;
        icon.classList.add("svg");
      }
    }

    // Handle naming
    let strippedName;
    if (label) {
      strippedName = label.innerText;
    } else {
      let name = linkNode.innerHTML;
      const nameParts = name.split("<");
      strippedName = nameParts[0] !== "" ? nameParts[0] : screenReaderName;
    }

    const submenu = processSubmenu(item);

    // Push to menu
    menuHolder.push({ url, target, name: strippedName, id, submenu, screenReaderName, iconStyle, before });

    if (clone) {
      const cloned = item.cloneNode(true);
      toolbarnode.value.appendChild(cloned);
    } else {
      toolbarnode.value.appendChild(item);
    }
  }

  toolbarMenu.value = [...menuHolder];

  const key = `uixpress_toolbar`;
  localStorage.setItem(key, JSON.stringify([...menuHolder]));

  // Finish loading
  loading.value = false;
};

const processSubmenu = (linknode) => {
  const submenuitems = linknode.querySelectorAll(":scope > .ab-sub-wrapper > .ab-submenu > li");

  // No submenu items so bail
  if (!submenuitems) return;

  let submenu = [];

  for (let li of submenuitems) {
    const sublink = li.querySelector(":scope > .ab-item");

    // No sub link
    if (!sublink) continue;

    const url = sublink.getAttribute("href");
    const target = sublink.getAttribute("target");

    // Handle naming
    let strippedName = sublink.innerText;
    const subsubmenu = processSubmenu(li);

    submenu.push({ name: strippedName, url, target, submenu: subsubmenu });
  }

  return submenu;
};
