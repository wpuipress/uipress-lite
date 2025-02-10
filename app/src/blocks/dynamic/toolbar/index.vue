<script setup>
import { ref, computed, watchEffect, onMounted, inject } from "vue";

// Internal deps
import { inSearch, isObject } from "@/utility/functions.js";

// Internal deps
import Loader from "./src/loader.vue";

const loading = ref(true);
const menu = ref([]);
const search = ref("");
const toolbarnode = ref(null);
const uiTemplate = inject("uiTemplate");
const hiddenFrame = ref(null);
const overrideStyles = ref("");
const overrideHTML = ref("");

// get app store
import { useAppStore } from "@/store/app/app.js";
const appStore = useAppStore();

const returnMenuItems = computed(() => {
  return menu.value.filter((item) => inSearch(search.value, item.name, item.url));
});

/**
 * Parses menu from the dom
 */
const setToolbar = async (menuNode, clone) => {
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

  menu.value = [...menuHolder];

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

/**
 * Extracts a number from a given html string
 *
 * @param {node} html
 *
 * @return {number|null} number on success, null on failure
 * @since 3.2.13
 */
function extractNumberFromHtml(node) {
  if (!node || typeof DOMParser === "undefined") {
    return null;
  }

  const nodes = node.getElementsByTagName("*"); // get all elements

  for (let node of nodes) {
    const nodeValue = node.textContent.trim();
    if (!isNaN(nodeValue)) {
      return parseInt(nodeValue, 10);
    }
  }

  return null;
}

const returnIconOverrides = computed(() => {
  if (overrideStyles.value) return overrideStyles.value;

  let style = "";

  const overrides = [
    ["wp-admin-bar-comments", "chat"],
    ["wp-admin-bar-updates", "update"],
    ["wp-admin-bar-new-content", "library_add"],
    ["wp-admin-bar-customize", "palette"],
  ];

  const base = appStore.state.pluginBase;

  for (let override of overrides) {
    const iconurl = `${base}assets/icons/${override[1]}.svg`;

    style += `
    #${override[0]} .ab-icon::before{
    content: '';
    height:1.2rem;
    width:1.2rem;
    min-height:1.2rem;
    min-width:1.2rem;
    background-color:currentColor;
    -webkit-mask: url(${iconurl}) no-repeat center;
    -webkit-mask-size: contain;
    mask: url(${iconurl}) no-repeat center;
    mask-size: contain;
    line-height: 1rem;
        display: block;
    }`;
  }

  style += `
  #wp-admin-bar-customize, #wp-admin-bar-edit{
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  #wp-admin-bar-customize::before, #wp-admin-bar-edit::before{
    content: '';
    height:1.2rem;
    width:1.2rem;
    min-height:1.2rem;
    min-width:1.2rem;
    background-color:currentColor;
    -webkit-mask: url(${base}assets/icons/palette.svg) no-repeat center;
    -webkit-mask-size: contain;
    mask: url(${base}assets/icons/palette.svg) no-repeat center;
    mask-size: contain;
    line-height: 1rem;
    display: block;
    color: rgb(var(--uix-base-500) / var(--tw-text-opacity));
  }
  #wp-admin-bar-edit::before{
    -webkit-mask: url(${base}assets/icons/edit.svg) no-repeat center;
    mask: url(${base}assets/icons/edit.svg) no-repeat center;
  }`;

  return style;
});

const maybeReturnBeforeStyle = (menuitem) => {
  let styles = "";
  /* Before content */
  if (isObject(menuitem.before)) {
    styles += `content: ${menuitem.before.content};`;
    styles += `font-family: ${menuitem.before.fontFamily};`;
    styles += "width: 1.2rem;";
    styles += "min-width: 1.2rem;";
  } else {
    styles += "width: 0rem;";
    styles += "min-width: 0rem;";
  }

  if (menuitem.iconStyle) styles += menuitem.iconStyle;

  return `
  #${menuitem.id} .ab-icon::before{
    content: '';
    ${styles}
    height:1.2rem;
    min-height:1.2rem;
    font-size: 1.2rem;
    line-height: 1.2rem;
    filter: contrast(0.1);
    background-repeat: no-repeat;
    background-size: contain;
  }`;
};

/**
 * Returns menu style
 */
const menuStyle = computed(() => {
  return getBlockOption("subMenuStyle", props.block) || "inline";
});

const initiate = () => {
  setTimeout(() => {
    const menuNode = document.querySelector("#wpadminbar");
    setToolbar(menuNode);
  }, 500);
};

const loadItemsFromIframe = () => {
  return;
  const iframeDoc = hiddenFrame.value.contentDocument || hiddenFrame.value.contentWindow.document;
  const menuNode = iframeDoc.querySelector("#wpadminbar");

  console.log(menuNode);
  toolbarnode.value.replaceChildren();

  setToolbar(menuNode, true);
};

const maybeReturnInnerHTML = computed(() => {
  if (!overrideHTML.value) return "";

  console.log(overrideHTML.value.innerHTML);

  return overrideHTML.value.innerHTML;
});

const buildProductionToolbar = (onlyClone) => {
  const menuNode = document.querySelector("#wpadminbar");

  setToolbar(menuNode, true);

  // Run slightly later to allow for other scripts to update toolbar items
  if (!onlyClone) {
    setTimeout(() => {
      toolbarnode.value.replaceChildren();
      setToolbar(menuNode);
    }, 500);
  }
};

//const menuNode = document.querySelector("#wpadminbar");
//setToolbar(menuNode);
//onMounted(initiate);

const stop = watchEffect(async () => {
  if (!toolbarnode.value) return;

  if (uiTemplate.display != "prod") {
    setTimeout(() => {
      const data = wp.hooks.applyFilters("uipress.app.toolbar.get");

      if (!data) {
        buildProductionToolbar(true);
        return;
      }

      const { returnIconOverrides: borrowedOverrides, menu: borrowedMenu, toolbarnode } = data;
      console.log(borrowedOverrides.value);
      console.log(toolbarnode.value);

      overrideStyles.value = borrowedOverrides.value;
      overrideHTML.value = toolbarnode.value;
      menu.value = borrowedMenu.value;
    }, 1000);
  } else {
    buildProductionToolbar();
  }

  stop();
});

if (uiTemplate.display == "prod") {
  wp.hooks.addFilter("uipress.app.toolbar.get", "uipress", () => {
    return { returnIconOverrides, toolbarnode, menu };
  });
}
</script>

<template>
  <div>
    <ul class="uip-admin-toolbar uip-flex" ref="toolbarnode" :id="uiTemplate.display == 'prod' ? 'wpadminbar' : ''" style="list-style: none" v-html="maybeReturnInnerHTML"></ul>
    <component is="style"> {{ returnIconOverrides }}</component>
    <component is="style">
      <template v-for="item in returnMenuItems">
        {{ maybeReturnBeforeStyle(item) }}
      </template>
    </component>
  </div>
</template>
