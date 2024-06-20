<script setup>
// Import from vue
import { ref, computed, defineExpose, defineEmits, watch } from "vue";
const { __ } = wp.i18n;

// Import comps
import TableLoader from "@/components/table-loader/index.vue";

// Define emits
const emit = defineEmits(["previous", "next", "search", "selected", "griddragenter", "griddragover", "griddragleave", "griddrop"]);

// Define props and data
const props = defineProps({
  columns: { default: () => [], type: Array },
  data: { default: () => [], type: Array },
  rowRightClick: { type: Function },
  rowClick: { type: Function },
  pagination: { type: Object },
  fetching: { type: Boolean },
  defaultMode: { default: () => "list", type: String },
  onlyMode: { type: String },
  hideSelect: { type: Boolean },
  hasBorders: { type: Boolean },
});

// Set mode
const mode = ref(props.defaultMode);

// Selected
const selected = ref([]);

// Watch for changes to selected
watch(
  selected,
  (newValue, oldValue) => {
    emit("selected", newValue);
  },
  { deep: true }
);

const returnTdClass = (data, index) => {
  let classes = props.hideSelect && index === 0 ? ["rounded-tl-xl", "rounded-bl-xl"] : [];
  if (index == props.columns.length - 1) {
    classes.push("rounded-tr-xl");
    classes.push("rounded-br-xl");
  }

  if (props.hasBorders) {
    classes = ["border-b", "border-slate-200"];
  }

  return classes.join(" ");
};

const toggleAllSelection = (evt) => {
  const value = evt.target.checked;
  if (value) {
    props.data.forEach((item) => {
      selected.value.push(item.id);
    });
  } else {
    selected.value = [];
  }
};

const toggleSelected = (value, post) => {
  const alreadySelected = selected.value.findIndex((item) => item.id === post.id);

  // Selected
  if (value && !selected.value.includes(post.id)) {
    selected.value.push(post.id);
  }

  // Deselected
  if (!value && selected.value.includes(post.id)) {
    selected.value.splice(alreadySelected, 1);
  }
};

/**
 * Returns delay for row
 */
const returnTransitionDelay = (index) => {
  let time = index / 30;
  time = time > 0.6 ? 0.6 : time;
  return `${time.toFixed(3)}s`;
};

/**
 * Handles right clicks on rows
 */
const handleRightClick = (evt, index) => {
  if (!props.rowRightClick) return;
  evt.preventDefault();
  props.rowRightClick(evt, index);
};

/**
 * Handles right clicks on rows
 */
const handleClick = (evt, index) => {
  if (!props.rowClick) return;
  evt.preventDefault();
  props.rowClick(evt, index);
};

/**
 * Returns col width when set
 */
const returnColumnWidth = (col) => {
  if (!col.width) return;
  return `width:${col.width}`;
};

/**
 * Returns current mode
 */
const returnMode = computed(() => {
  return mode.value;
});

// Expose method
defineExpose({
  returnMode,
});
</script>

<template>
  <div class="flex flex-col gap-6 w-full">
    <div class="flex flex-row gap-4 items-center w-full">
      <!-- 
    * Search 
    *
    * Main search input for data
    -->
      <div class="flex-grow">
        <div class="relative w-1/3">
          <AppIcon icon="search" class="text-slate-400 absolute left-4 top-1/2 translate-y-[-50%] text-lg"></AppIcon>
          <input
            v-model="pagination.search"
            @keyup.enter="emit('search')"
            type="text"
            class="py-2 px-0 pl-16 bg-transparent border border-transparent w-full items-center transition-all outline-none focus:outline-none"
            placeholder="Search..."
          />
          <Transition>
            <AppIcon v-if="pagination.search" icon="return" class="text-slate-400 absolute right-2 top-1/2 translate-y-[-50%] text-lg"></AppIcon>
          </Transition>
        </div>
      </div>

      <!-- 
    * Right actions 
    *
    * Provides the slot for extra filters etc
    -->
      <div class="flex gap-3 items-center">
        <slot name="right-actions"></slot>
      </div>
    </div>

    <!-- 
  * Grid mode
  *
  * Main loop for data in group mode
  -->
    <div
      v-if="mode === 'grid' && (!onlyMode || onlyMode === 'grid')"
      @dragenter.prevent="emit('griddragenter', $event)"
      @dragover.prevent
      @dragleave="emit('griddragleave', $event)"
      @drop.prevent="emit('griddrop', $event)"
      class="flex-col flex gap-3 @container/grid"
    >
      <div
        ref="gridHolder"
        class="grid gap-10 h-auto @4xl/grid:grid-cols-12 @3xl/grid:grid-cols-8 @xl/grid:grid-cols-6 @lg/grid:grid-cols-4 @md/grid:grid-cols-4 @sm/grid:grid-cols-2"
        style="grid-auto-rows: calc(100vw / 12"
      >
        <GridLoader v-if="fetching" v-for="count in pagination.per_page" />
        <TransitionGroup v-else>
          <template v-for="(row, index) in data" :index="index">
            <slot :name="'grid-template'" :row="row" :index="index" />
          </template>
        </TransitionGroup>
      </div>

      <!-- 
    * Section: Empty data 
    *
    * Provides the slot for when there is no data
    -->
      <div class="animate-fadeIn">
        <slot v-if="!data.length && !pagination.search.length && !fetching" name="empty"></slot>
      </div>

      <!-- 
    * Empty query data 
    *
    * Shows message when nothing found for search term
    -->
      <div v-if="!data.length && pagination.search.length && !fetching" class="animate-fadeIn">
        <EmptyTable title="Nothing found" :description="`Nothing found for search term '${pagination.search}'`" />
      </div>
    </div>

    <!-- 
   * Table section
   *
   * Handler for data when in table mode
   -->
    <table v-if="mode === 'list' && (!onlyMode || onlyMode === 'list')" class="table-auto w-full border-separate border-spacing-0">
      <thead>
        <tr class="text-left font-medium">
          <th v-if="!hideSelect" class="font-normal text-slate-400 w-1 p-4 border-t border-b border-slate-200/80">
            <uiCheckbox @updated="toggleSelection" />
          </th>
          <th v-for="(column, index) in columns" :key="column.key" class="font-normal text-slate-400 p-4 border-t border-b border-slate-200 text-sm" :style="returnColumnWidth(column)">
            <!-- Use scoped slot for custom cell rendering -->
            <slot :name="'head-' + column.key" :column="column">
              {{ column.label }}
            </slot>
          </th>
        </tr>
      </thead>

      <!-- 
     * Table body
     *
     * Handles table body data
     -->
      <tbody v-if="fetching">
        <TableLoader :columns="columns.length" :rows="10" />
      </tbody>
      <TransitionGroup tag="tbody" name="tableitem" v-else :css="false">
        <!-- 
    * Empty data
    *
    * Provides slot for empty data
    -->
        <tr v-if="!data.length && !pagination.search.length && !fetching" key="emptydata">
          <td :colspan="columns.length"><slot name="empty"></slot></td>
        </tr>
        <!-- 
    * Empty query data
    *
    * Shows nothing found message for when there is a search term
    -->
        <tr v-if="!data.length && pagination.search.length && !fetching" key="emptyquery">
          <td :colspan="columns.length">
            <EmptyTable title="Nothing found" :description="`Nothing found for search term: '${pagination.search}'`" />
          </td>
        </tr>

        <!-- 
    * Spacer
    *
    * Provides empty space
    -->
        <tr v-if="!hasBorders">
          <td :colspan="columns.length"><div class="h-4"></div></td>
        </tr>

        <!-- 
        * Loop
        *
        * Main data loop for table body
        -->
        <tr
          v-for="(row, index) in data"
          :key="row.id ? row.id : index"
          :style="`transition-delay:${returnTransitionDelay(index)}`"
          @contextmenu="handleRightClick($event, index)"
          @click="handleClick($event, index)"
          class="group"
        >
          <td v-if="!hideSelect" class="px-4 py-3 group-hover:bg-slate-50 transition-all cursor-pointer rounded-tl-xl rounded-bl-xl w-1">
            <uiCheckbox :value="selected.includes(row.id) ? true : false" @updated="(d) => toggleSelected(d, row)" />
          </td>
          <td class="px-4 py-3 group-hover:bg-slate-50 transition-all cursor-pointer" v-for="(column, colindex) in columns" :key="column.key" :class="returnTdClass(column, colindex)">
            <!-- Use scoped slot for custom cell rendering -->
            <slot :name="'row-' + column.key" :row="row" :index="index" />
          </td>
        </tr>
      </TransitionGroup>

      <!-- 
    * Main pagination
    *
    * Pagination for tables with more than one page
    -->
      <tfoot>
        <tr>
          <td :colspan="columns.length + 1">
            <div v-if="pagination && data.length && pagination.pages > 1" class="flex flex-row gap-6 place-content-between items-center p-4 w-full">
              <span class="text-slate-400 text-sm">{{ pagination.per_page }} of {{ pagination.total }}</span>
              <div class="flex gap-3 items-center">
                <span class="text-slate-400 text-sm">{{ pagination.page }} of {{ pagination.pages }}</span>
                <uiButton :disabled="pagination.page === 1" @click="emit('previous')" type="transparent">
                  <AppIcon icon="chevron_left" />
                </uiButton>
                <uiButton @click="emit('next')" :disabled="pagination.page === pagination.pages" type="transparent">
                  <AppIcon icon="chevron_right" />
                </uiButton>
              </div>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style>
.tableitem-move,
.tableitem-enter-active,
.tableitem-leave-active {
  transition: all 0.5s ease;
}
.tableitem-enter-from,
.tableitem-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
