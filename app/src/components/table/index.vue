<script setup>
// Import from vue
import { ref, computed, defineExpose, defineEmits, watch } from "vue";
import { __ } from "@wordpress/i18n";

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
  let classes = props.hideSelect && index === 0 ? ["uip-border-round-left"] : [];
  if (index == props.columns.length - 1) {
    classes.push("uip-border-round-right");
  }

  if (props.hasBorders) {
    classes = ["uip-border-bottom", ""];
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
  <div class="uip-flex uip-flex-column uip-gap-m uip-w-100p">
    <div class="uip-flex uip-flex-row gauip-padding-xs uip-flex-center uip-w-100p">
      <!-- 
	  * Search 
	  *
	  * Main search input for data
	  -->
      <div class="uip-flex-grow">
        <div class="uip-position-relative uip-w-100p" style="max-width: 400px">
          <AppIcon icon="search" class="uip-text-muted uip-position-absolute uip-text-l uip-top-50p uip-translateY--50p" style="left: 8px"></AppIcon>
          <input
            v-model="pagination.search"
            @keyup.enter="emit('search')"
            type="text"
            class="uip-input"
            style="background: transparent; padding-left: 36px; padding-right: 36px; width: 100%; border: none"
            :placeholder="__('Search...', 'uipress-lite')"
          />
          <Transition>
            <AppIcon v-if="pagination.search" icon="return" class="uip-text-muted uip-position-absolute uip-text-l uip-top-50p uip-translateY--50p" style="right: 8px" />
          </Transition>
        </div>
      </div>

      <!-- 
	  * Right actions 
	  *
	  * Provides the slot for extra filters etc
	  -->
      <div class="uip-flex uip-gap-xs uip-flex-center">
        <slot name="right-actions"></slot>
      </div>
    </div>

    <!-- 
	 * Table section
	 *
	 * Handler for data when in table mode
	 -->
    <table v-if="mode === 'list' && (!onlyMode || onlyMode === 'list')" class="uip-w-100p uip-border-collapse">
      <thead>
        <tr class="uip-text-left">
          <th v-if="!hideSelect" class="uip-text-muted w-1 uip-padding-s uip-border-top uip-border-bottom uip-w-30">
            <input type="checkbox" class="uip-checkbox" @click="toggleAllSelection" />
          </th>
          <th v-for="(column, index) in columns" :key="column.key" class="uip-text-muted uip-padding-s uip-border-top uip-border-bottom uip-text-weight-normal" :style="returnColumnWidth(column)">
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
        <tr v-if="!hasBorders">
          <td :colspan="columns.length"><div class="uip-h-10"></div></td>
        </tr>
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
          <td :colspan="columns.length"><div class="uip-h-10"></div></td>
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
          class="uip-row-hover"
        >
          <td
            v-if="!hideSelect"
            class="uip-padding-left-s uip-padding-right-s uip-padding-top-xs uip-padding-bottom-xs group-hover:bg-slate-50 transition-all uip-cursor-pointer uip-border-round-left uip-w-30"
          >
            <input type="checkbox" class="uip-checkbox" :checked="selected.includes(row.id) ? true : false" @change="toggleSelected(d, row)" />
          </td>
          <td
            class="uip-padding-left-s uip-padding-right-s uip-padding-top-xs uip-padding-bottom-xs group-hover:bg-slate-50 transition-all uip-cursor-pointer"
            v-for="(column, colindex) in columns"
            :key="column.key"
            :class="returnTdClass(column, colindex)"
          >
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
            <div v-if="pagination && data.length && pagination.pages > 1" class="uip-padding-top-s uip-flex uip-flex-row uip-gap-m uip-flex-between uip-flex-center uip-padding-xs uip-w-100p">
              <span class="uip-text-muted">{{ pagination.per_page }} of {{ pagination.total }}</span>
              <div class="uip-flex uip-gap-s uip-flex-center">
                <span class="uip-text-muted">{{ pagination.page }} of {{ pagination.pages }}</span>
                <button :disabled="pagination.page === 1" @click="emit('previous')" class="uip-button-default">
                  <AppIcon icon="chevron_left" />
                </button>
                <button @click="emit('next')" :disabled="pagination.page === pagination.pages" class="uip-button-default">
                  <AppIcon icon="chevron_right" />
                </button>
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
