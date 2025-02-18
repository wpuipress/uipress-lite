import { extractNumberFromHtml } from "./extractNumberFromHtml.js";

/**
 * Processes the submenu items of a given link node.
 * @param {HTMLElement} linknode - The parent link node containing submenu items.
 * @returns {Array|undefined} An array of submenu items or undefined if no submenu items are found.
 */
export const processSubmenu = (linknode) => {
  const submenuitems = linknode.querySelectorAll(":scope .wp-submenu > li");

  // No submenu items so bail
  if (!submenuitems) return;

  let submenu = [];

  for (let li of submenuitems) {
    const sublink = li.querySelector(":scope > a");
    const sublink_id = li.querySelector(":scope .uip-id-holder");

    let original_id = "";
    if (sublink_id) {
      original_id = sublink_id.textContent.trim();
    }

    // No sub link
    if (!sublink) continue;

    const url = sublink.getAttribute("href");
    const target = sublink.getAttribute("target");

    let active = false;
    if (sublink.classList.contains("current") || li.classList.contains("current")) {
      active = true;
    }

    // Handle naming
    let name = sublink.innerHTML;
    const nameParts = name.split("<");
    const strippedName = nameParts[0] !== "" ? nameParts[0] : name;

    // Extract notifications
    const notifications = extractNumberFromHtml(sublink);
    const parentid = linknode.getAttribute("id");
    const id = `${parentid}-${url}`;
    const sub_id = sublink.getAttribute("id");
    const og_node = sublink;

    submenu.push({ name: strippedName, url, target, active, id, notifications, sub_id, og_node, original_id });
  }

  return submenu;
};
