import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export const useAppStore = defineStore("app", () => {
  /**
   * Set's app defaults
   *
   */
  const state = ref({
    loading: false,
    adminUrl: false,
    pluginBase: false,
    restNonce: null,
    restBase: null,
    fullScreen: false,
    currentPageName: "",
    menu_minimised: false,
  });

  /**
   * Handles state update
   *
   * @param {string} key
   * @param {mixed} value
   */
  const updateState = (key, value) => {
    state.value[key] = value;
  };

  /**
   * Checks for menu state
   */
  const menuState = localStorage.getItem("uipc-menu-state");
  if (menuState) {
    state.value.menu_minimised = JSON.parse(menuState);
  }

  watch(
    () => state.value.menu_minimised,
    () => {
      localStorage.setItem("uipc-menu-state", JSON.stringify(state.value.menu_minimised));
    }
  );

  return { state, updateState };
});
