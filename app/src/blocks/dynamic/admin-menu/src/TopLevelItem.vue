<script setup>
import { computed, defineProps, defineModel } from "vue";
import { get_block_option, isObject, hasNestedPath } from "@/utility/functions.js";

const link = defineModel();

const props = defineProps({
  maybeFollowLink: Function,
  collapsed: Boolean,
  block: Object,
});

// Computed properties
const subMenuStyle = computed(() => {
  if (props.collapsed) return "hover";

  let style = get_block_option(props.block, "block", "subMenuStyle");
  if (!isObject(style)) return "dynamic";
  if (style.value) return style.value;
  return "dynamic";
});

const subMenuCustomIcon = computed(() => {
  let icon = get_block_option(props.block, "block", "subMenuIcon");
  if (!isObject(icon)) return false;
  if (icon.value) return icon.value;
  return false;
});

const hideIcons = computed(() => {
  if (props.collapsed) return false;

  const icons = hasNestedPath(props.block, ["settings", "block", "options", "hideIcons", "value"]);
  if (isObject(icons)) return icons.value;
  return icons;
});

const itemHiden = computed(() => {
  return hasNestedPath(link.value, "custom", "hidden");
});

const returnName = computed(() => {
  return hasNestedPath(link.value, "custom", "name") ? link.value.custom.name : link.value.name;
});

const returnIcon = computed(() => {
  return hasNestedPath(link.value, "custom", "icon") ? link.value.custom.icon : link.value.icon;
});

const returnItemClasses = computed(() => {
  return hasNestedPath(link.value, "custom", "classes") ? link.value.custom.classes : "";
});

const returnItemHref = computed(() => {
  return hasNestedPath(link.value, "custom", "url") ? link.value.custom.url : link.value.url;
});

const returnItemTarget = computed(() => {
  return hasNestedPath(link.value, "custom", "newTab") ? "_BLANK" : "_SELF";
});

// Methods
const returnTopIcon = (icon) => {
  const status = icon ? icon.includes("uipblank") : false;
  if (status) return icon.replace("uipblank", "favorite");
  return icon;
};

const returnSubIcon = (item) => {
  if (subMenuCustomIcon.value) return subMenuCustomIcon.value;

  if (subMenuStyle.value == "dynamic") return "chevron_right";
  if (subMenuStyle.value == "hover") return "chevron_right";

  if (item.open || item.active) return "expand_more";
  return "chevron_left";
};

const isBasicIcon = (str) => {
  return /^[a-zA-Z0-9_]+$/.test(str);
};
</script>

<template>
  <a
    v-if="!itemHiden"
    :target="returnItemTarget"
    :href="returnItemHref"
    class="uip-no-underline uip-link-default uip-top-level-item"
    :class="returnItemClasses"
    :active="link.active ? true : false"
    :id="link.id"
  >
    <template v-if="!hideIcons">
      <div
        v-if="!link.settings?.icon"
        class="icon uip-menu-icon uip-icon"
        style="width: 1.2em; height: 1.2em; background-size: contain; background-position: center; background-repeat: no-repeat; filter: contrast(0.5)"
        :class="link.imageClasses"
        :style="link.iconStyles"
      ></div>

      <AppIcon v-else :icon="link.settings.icon" class="icon uip-menu-icon uip-icon" />
    </template>

    <template v-if="1 == 3">
      <div v-if="!hideIcons && returnIcon && !isBasicIcon(returnTopIcon(returnIcon))" v-html="returnTopIcon(returnIcon)" class="uip-flex uip-flex-center uip-menu-icon uip-icon uip-icon-medium"></div>

      <AppIcon v-else-if="!hideIcons && returnIcon && isBasicIcon(returnTopIcon(returnIcon))" class="uip-flex-center uip-menu-icon uip-icon" :icon="returnTopIcon(returnIcon)" />
    </template>

    <div v-if="!collapsed" class="uip-flex-grow uip-flex uip-gap-xs uip-flex-center">
      <div class="uip-line-height-1" v-html="returnName"></div>
      <div
        v-if="link.notifications && link.notifications > 0"
        class="uip-border-round uip-h-14 uip-ratio-1-1 uip-background-secondary uip-text-inverse uip-text-xxs uip-text-bold uip-flex uip-flex-center uip-flex-middle uip-menu-notification"
      >
        <span>{{ link.notifications }}</span>
      </div>
    </div>

    <div class="uip-position-relative">
      <AppIcon v-if="link.submenu && link.submenu.length > 0 && !collapsed" class="uip-icon uip-link-muted" :icon="returnSubIcon(link)" />
      <div class="uip-position-absolute" @click.prevent="link.open = !link.open" style="left: -6px; top: -6px; width: calc(100% + 12px); height: calc(100% + 12px)"></div>
    </div>
  </a>
</template>
