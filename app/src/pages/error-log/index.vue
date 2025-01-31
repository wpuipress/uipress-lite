<script setup>
import { ref, computed, getCurrentInstance, watch } from "vue";
const { __ } = wp.i18n;
import { useRouter } from "vue-router";

// Comps
import AppTable from "@/components/table/index.vue";
import Confirm from "@/components/confirm/index.vue";

// Import funcs
import { sendServerRequest, formatDateString } from "@/utility/functions.js";

// Refs
const errors = ref([]);
const currentError = ref(null);
const offcanvas = ref(null);
const loading = ref(true);
const confirmModal = ref(null);
const router = useRouter();
const { appContext } = getCurrentInstance();
const pagination = ref({ search: "", per_page: 15, page: 1, total: 0, pages: 0, status: "any", context: "edit" });

// Setup table columns
const columns = ref([
  { key: "time", label: __("Time", "uipress-lite") },
  { key: "status", label: __("Status", "uipress-lite") },
  { key: "message", label: __("Message", "uipress-lite") },
  { key: "date", label: __("Date", "uipress-lite") },
]);

/**
 * Get's errors from server
 */
const getErrors = async (suppressLoading) => {
  const { uipApp } = appContext.config.globalProperties;

  loading.value = true;

  const { per_page, search, page } = pagination.value;
  const endpoint = `${uip_ajax.rest_url}uipress/v1/errorlog?per_page=${per_page}&search=${search}&page=${page}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: uip_ajax.rest_headers,
  });

  // Finish loading
  loading.value = false;

  // Throw error if failed
  if (!response.ok) {
    uipApp.notifications.notify(__("Unable to fetch error list right now"), "", "error", true);
    return;
  }

  const responseData = await response.json();

  // Throw error if failed
  if (response.error) {
    uipApp.notifications.notify(__("Unable to fetch error list right now"), "", "error", true);
    return;
  }

  pagination.value.total = response.headers.get("X-WP-Total");
  pagination.value.pages = response.headers.get("X-WP-TotalPages");

  errors.value = responseData;
};

const maybeStringify = (message) => {
  try {
    return JSON.stringify(JSON.parse(message), undefined, 2);
  } catch (err) {
    return message;
  }
};

/**
 * Handles previous page
 */
const handlePreviousPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--;
    getErrors(true);
  }
};

/**
 * Handles next page
 */
const handleNextPage = () => {
  if (pagination.value.page < pagination.value.pages) {
    pagination.value.page++;
    getErrors(true);
  }
};

/**
 * Opens the template
 */
const openError = (evt, index) => {
  currentError.value = errors.value[index];

  if (!currentError.value) return;

  offcanvas.value.show();
};

const returnStatusClass = (status) => {
  if (status == "MESSAGE") return "uip-border-green uip-text-green";
  if (status == "FATAL") return "uip-border-red uip-text-red";
  if (status == "WARNING") return "uip-border-orange uip-text-orange";
  return "uip-border uip-text-muted";
};

// Watch for empty search and reset query
watch(
  () => pagination.value.search,
  (newval, oldval) => {
    if (!newval && oldval) getErrors();
  }
);

getErrors();
</script>

<template>
  <AppTable
    :pagination="pagination"
    :columns="columns"
    :data="errors"
    :fetching="loading"
    @previous="handlePreviousPage"
    @next="handleNextPage"
    @search="getErrors(true)"
    :rowClick="openError"
    :hideSelect="true"
  >
    <!-- Right actions -->

    <!-- Name-->
    <template v-slot:row-time="{ row }">
      <div class="inline-flex uip-text-muted">@{{ row.time }}</div>
    </template>

    <!-- Satus-->
    <template v-slot:row-status="{ row }">
      <div class="uip-inline-flex uip-text-s uip-padding-left-xxs uip-padding-right-xxs uip-border uip-border-round uip-font-mono" :class="returnStatusClass(row.type)">
        {{ row.type }}
      </div>
    </template>

    <!-- Type-->
    <template v-slot:row-message="{ row }">
      <div class="uip-max-w-200 uip-overflow-hidden uip-text-ellipsis uip-no-wrap">
        {{ row.message }}
      </div>
    </template>

    <!-- Modified-->
    <template v-slot:row-date="{ row }">
      <div class="inline-flex uip-text-muted">
        {{ row.date }}
      </div>
    </template>
  </AppTable>

  <component is="style">
    .gap-4 { gap: 1rem; } .grid-cols-6 { grid-template-columns: repeat(6, minmax(0px, 1fr)); } .grid { display: grid; }.col-span-5 { grid-column: span 5 / span 5; } .col-span-6 { grid-column: span 6 /
    span 6; } .text-pretty { text-wrap: pretty; }</component
  >

  <uip-offcanvas ref="offcanvas" style="width: 560px">
    <template v-slot:content>
      <div class="uip-flex uip-flex-column uip-gap-s">
        <!-- Details-->
        <div class="grid grid-cols-6 gap-4">
          <!--Staus-->
          <div class="uip-text-muted">{{ __("Status", "uipress-lite") }}</div>
          <div class="col-span-5 flex flex-row place-content-between">
            <div class="uip-inline-flex uip-text-s uip-padding-left-xxs uip-padding-right-xxs uip-border uip-border-round uip-font-mono" :class="returnStatusClass(currentError.type)">
              {{ currentError.type }}
            </div>
          </div>
          <div class="uip-border-top col-span-6"></div>
          <!--File-->
          <template v-if="currentError.file">
            <div class="uip-text-muted">
              <div>{{ __("File", "uipress-lite") }}</div>
            </div>
            <div class="col-span-5">{{ currentError.file }}</div>
            <div class="uip-border-top col-span-6"></div>
          </template>

          <!--Line-->
          <template v-if="currentError.line">
            <div class="uip-text-muted">{{ __("Line", "uipress-lite") }}</div>
            <div class="col-span-5">@{{ currentError.line }}</div>
            <div class="uip-border-top col-span-6"></div>
          </template>

          <!--Date-->
          <div class="uip-text-muted">{{ __("Date", "uipress-lite") }}</div>
          <div class="col-span-5">{{ formatDateString(currentError.date) }}</div>
          <div class="uip-border-top col-span-6"></div>

          <!--Time-->
          <div class="uip-text-muted">{{ __("Time", "uipress-lite") }}</div>
          <div class="col-span-5">@{{ currentError.time }}</div>
          <div class="uip-border-top col-span-6"></div>

          <!--Message-->
          <div class="uip-text-muted">
            <div>{{ __("Message", "uipress-lite") }}</div>
          </div>
          <div class="col-span-5">
            <pre v-html="maybeStringify(currentError.message)" class="text-pretty" style="margin: 0"></pre>
          </div>
          <div class="uip-border-top col-span-6"></div>

          <!--Message-->
          <template v-if="currentError.stackTrace.length">
            <div class="uip-text-muted">
              <div>{{ __("Stack trace", "uipress-lite") }}</div>
            </div>
            <div class="col-span-5 uip-flex uip-flex-column uip-gap-s">
              <div v-for="(stack, index) in currentError.stackTrace">{{ stack }}</div>
            </div>
            <div class="uip-border-top col-span-6"></div>
          </template>
        </div>
      </div>
    </template>
  </uip-offcanvas>
</template>
