<script>
const { __ } = wp.i18n;
export default {
  props: {
    returnData: Function,
    value: Array,
  },
  data() {
    return {
      items: this.value,
      strings: {
        addNew: __("New item", "uipress-lite"),
      },
    };
  },

  watch: {
    /**
     * Watches for changes to the items and returns the value
     *
     * @since 3.2.13
     */
    items: {
      handler(newValue, oldValue) {
        this.returnData(this.items);
      },
      deep: true,
    },
  },
  computed: {
    /**
     * Returns array list
     *
     * @since 3.2.13
     */
    returnItems() {
      return this.items;
    },
  },
  methods: {
    /**
     * Deletes an item from the list
     *
     * @param {Number} index - the index of the item
     * @since 3.2.13
     */
    deleteTab(index) {
      this.items.splice(index, 1);
    },

    /**
     * Creates a new item
     *
     * @since 3.2.13
     */
    newTab() {
      this.items.push({ value: "", id: this.createUID() });
    },
  },
};
</script>

<template>
  <div class="uip-flex uip-flex-column uip-row-gap-xs">
    <VueDraggableNext
      v-if="items.length > 0"
      :list="items"
      class="uip-flex uip-flex-column uip-row-gap-xs uip-w-100p"
      :group="{ name: 'tabs', pull: false, put: false }"
      animation="300"
      handle=".uip-cursor-drag"
      @start="drag = true"
      @end="drag = false"
      :sort="true"
      itemKey="id"
    >
      <template v-for="(element, index) in items" :key="element.value" :index="index">
        <div class="uip-flex uip-flex-row uip-gap-xs uip-flex-center">
          <AppIcon @click="deleteTab(index)" icon="drag_indicator" class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-cursor-drag" />

          <input type="text" v-model="element.value" class="uip-input-small uip-flex-grow" placeholder="/path/to/file" />

          <AppIcon @click="deleteTab(index)" icon="close" class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted" />
        </div>
      </template>
    </VueDraggableNext>

    <button @click="newTab()" class="uip-button-default uip-border-rounder uip-padding-xxs uip-w-100p"><AppIcon icon="add" class="uip-icon" /></button>
  </div>
</template>
