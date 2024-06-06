<script setup>
import { defineProps, ref, computed, watchEffect } from "vue";

const props = defineProps({
  options: {
    default: () => {
      return {
        false: { label: "No", value: false },
        true: { label: "Yes", value: true },
      };
    },
    type: Object,
  },
  autoselect: { default: () => true, type: Boolean },
  allowDeselect: { default: () => false, type: Boolean },
});
const model = defineModel();
const tabRef = ref(null);
const tabContainer = ref(null);
const showBack = ref(true);

const bgStyle = ref({
  width: null,
  left: null,
  right: null,
  ["z-index"]: 1,
  bottom: "0px",
});

/**
 * Returns background style of back
 */
const setBgStyle = () => {
  if (tabRef.value === null) return;

  let val = String(model.value); // Convert boolean values to strings

  const keys = Object.keys(props.options);
  const index = keys.findIndex((item) => item == val);

  // No index so bail
  if (index < 0) return (showBack.value = false);

  const activeKey = keys[index];

  const target = tabRef.value[index];

  const rect = target.getBoundingClientRect();
  const containerRect = tabContainer.value.getBoundingClientRect();
  const left = rect.left - containerRect.left;

  showBack.value = true;

  bgStyle.value.width = `${rect.width}px`;
  bgStyle.value.left = `${left}px`;
};

const returnActiveClass = (item) => {
  return item.value === model.value ? "uip-text-emphasis" : "uip-text-muted";
};

const setActive = (value) => {
  if (model.value === value && props.allowDeselect) model.value = null;
  else model.value = value;
  setBgStyle();
};

watchEffect(() => {
  // If undefined select first option
  if ((typeof model.value === "undefined" || model.value === null) && props.autoselect) {
    const key = Object.keys(props.options)[0];
    setActive(props.options[key].value);
  } else {
    setBgStyle();
  }
});
</script>

<template>
  <div ref="tabContainer" class="uip-position-relative uip-flex uip-border-bottom uip-max-w-100p uip-gap-xs" style="overflow-x: auto">
    <div v-if="showBack" class="uip-position-absolute uip-transition-all uip-border-bottom-primary" :style="bgStyle"></div>

    <template v-for="(item, index) in options">
      <a
        ref="tabRef"
        type="button"
        class="uip-padding-top-s uip-padding-bottom-s uip-padding-left-xs uip-padding-right-xs uip-text-center uip-cursor-pointer uip-transition-all uip-select-none"
        style="z-index: 2"
        :class="returnActiveClass(item)"
        @click="setActive(item.value)"
      >
        <div class="uip-no-wrap">{{ item.label }}</div>
      </a>
    </template>
  </div>
</template>
