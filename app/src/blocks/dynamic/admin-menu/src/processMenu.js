import { ref } from "vue";
import { dashIconsList } from "./constants.js";
import { processSubmenu } from "./processSubmenu.js";
import { extractNumberFromHtml } from "./extractNumberFromHtml.js";
import { getBeforeContent } from "./getBeforeContent.js";
import { getDashiconClass } from "./getDashiconClass.js";

const loading = ref(false);

/**
 * Parses the admin menu from the DOM and sets the menu state.
 * @async
 * @param {HTMLElement} menuNode - The root node of the admin menu.
 */
export const processMenu = async (menuNode) => {
  if (menuNode) menuNode = menuNode.querySelector("#adminmenu");

  // There is no menu node so bail
  if (!menuNode) return (loading.value = false);

  const topLevelItems = menuNode.children;
  const menuHolder = [];
  dashIconsList.value = [];

  for (let item of topLevelItems) {
    // Separator
    if (item.classList.contains("wp-menu-separator")) {
      const seps = menuHolder.filter((sep) => sep.type == "separator");
      const id = `separator-${seps.length}`;
      menuHolder.push({ type: "separator", id });
      continue;
    }

    const linkNode = item.querySelector(":scope > a");
    const nameNode = item.querySelector(":scope .wp-menu-name");
    const image = item.querySelector(":scope .wp-menu-image");
    const image_as_icon = image ? image.querySelector(":scope img") : false;

    // Probably a separator
    if (!linkNode) continue;

    const id = item.getAttribute("id");
    const url = linkNode.getAttribute("href");
    const target = linkNode.getAttribute("target");
    const notifications = extractNumberFromHtml(nameNode);

    // Check for current link
    let active = false;
    if (linkNode.classList.contains("current") || linkNode.getAttribute("aria-current") == "page" || item.classList.contains("wp-menu-open")) {
      active = true;
    }

    // Handle naming
    let name = nameNode.innerHTML;
    const nameParts = name.split("<");
    const strippedName = nameParts[0] !== "" ? nameParts[0] : name;

    // Get icon classes
    let classes = image.classList ? [...image.classList] : [];
    //classes = classes.filter((subclass) => !subclass.includes("wp-menu-image"));
    let iconStyles = classes.includes("svg") ? image.getAttribute("style") : "";

    if (image_as_icon) {
      let href = image_as_icon.getAttribute("src");
      iconStyles = href ? `background-image: url("${href}");height:1.2rem;background-size:contain;` : "";
    }

    const { content, font, backGroundImage } = getBeforeContent(image);

    const dashClass = getDashiconClass(image);
    if (dashClass) dashIconsList.value.push({ class: `.${dashClass}`, before: content, font, backGroundImage });

    if (!dashClass && (backGroundImage || content)) dashIconsList.value.push({ class: `#${id} .wp-menu-image`, before: content, font, backGroundImage });

    const submenu = processSubmenu(item);
    let settings = {};
    for (let subImageClass of classes) {
      if (!subImageClass.includes("uipress-data-icon-")) continue;
      const icon_string = subImageClass.replace("uipress-data-icon-", "");
      settings.icon = icon_string;
    }

    // Push to menu
    menuHolder.push({ url, target, name: strippedName, notifications, imageClasses: classes, iconStyles, submenu, active, id, settings });
  }

  return { processedMenu: [...menuHolder], dashIcons: dashIconsList.value };
};
