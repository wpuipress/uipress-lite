<script setup>
import { ref, computed, getCurrentInstance } from "vue";
import { __ } from "@wordpress/i18n";
import { useRouter } from "vue-router";

// Comps
import AppTable from "@/components/table/index.vue";
import Confirm from "@/components/confirm/index.vue";

// Import funcs
import { sendServerRequest } from "@/utility/functions.js";

// Refs
const templates = ref([]);
const loading = ref(true);
const confirmModal = ref(null);
const router = useRouter();
const templateContextMenu = ref(null);
const activeTemplateID = ref(null);
const { appContext } = getCurrentInstance();
const pagination = ref({ search: "", per_page: 30, page: 1, total: 0, pages: 0, status: "any", context: "edit" });

// Setup table columns
const columns = ref([
  { key: "name", label: __("Name", "uipress-lite") },
  { key: "status", label: __("Status", "uipress-lite") },
  { key: "type", label: __("Type", "uipress-lite") },
  { key: "modified", label: __("Modified", "uipress-lite") },
  { key: "actions", width: "30px" },
]);

// Setup table columns
const templateLinks = computed(() => {
  return [
    { name: __("Edit", "uipress-lite"), icon: "edit", type: "link", url: `/uibuilder/${activeTemplateID.value}` },
    { name: __("Duplicate", "uipress-lite"), icon: "content_copy", type: "action", action: () => duplicateTemplate(activeTemplateID.value) },
    { type: "divider" },
    { name: __("Delete", "uipress-lite"), icon: "delete", type: "action", action: () => confirmDelete(activeTemplateID.value), danger: true },
  ];
});

/**
 * Get's templates from server
 */
const getTemplates = async (suppressLoading) => {
  if (!suppressLoading) loading.value = true;

  let formData = new FormData();
  formData.append("action", "uip_get_ui_templates");
  formData.append("security", uip_ajax.security);
  formData.append("page", pagination.value.page);
  formData.append("search", pagination.value.search);
  formData.append("filter", "all");

  const response = await sendServerRequest(uip_ajax.ajax_url, formData);

  console.log(response);

  // Finish loading
  loading.value = false;

  // Error
  if (!response) return;

  templates.value = response.templates;
};

/**
 * Handles previous page
 */
const handlePreviousPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--;
    getTemplates(true);
  }
};

/**
 * Handles next page
 */
const handleNextPage = () => {
  if (pagination.value.page < pagination.value.pages) {
    pagination.value.page++;
    getTemplates(true);
  }
};

/**
 * Opens the template
 */
const openTemplate = (evt, index) => {
  const template = returnTemplates.value[index];

  if (!template) return;

  router.push(`/uibuilder/${template.id}`);
};

/**
 * Returns translatable status
 */
const returnFormattedStatus = () => {
  if (status == "publish") return __("Published", "uipress-lite");
  return __("Draft", "uipress-lite");
};

const returnTemplates = computed(() => {
  const searchTerm = pagination.value.search.toLowerCase();
  return templates.value.filter((template) => template.name.toLowerCase().includes(searchTerm));
});

/**
 * Set's current template id and shows context menu
 */
const handleRightClick = (evt, index) => {
  const template = returnTemplates.value[index];

  if (!template) return;

  activeTemplateID.value = template.id;

  templateContextMenu.value.show(evt);
};

/**
 * Re-ads default toolbar styling
 *
 * @since 3.2.0
 */
const enqueueAdminBarStyles = () => {
  let styleblock = document.querySelector('link[href*="load-styles.php?"]');
  if (!styleblock) return;

  // Stylesheet already has admin styles enqueued
  if (styleblock.href.includes("admin-bar,")) return;

  const newLink = styleblock.href.replace("admin-menu,", "admin-menu,admin-bar,");
  const link = document.createElement("link");
  link.href = newLink;
  link.setAttribute("rel", "stylesheet");

  // Event listener function
  const onLoad = () => {
    styleblock.remove();
    link.removeEventListener("load", onLoad); // Remove the event listener
  };

  const head = document.head;
  if (head.firstChild) {
    head.insertBefore(link, head.firstChild);
  } else {
    head.appendChild(link);
  }

  // Add the event listener
  link.addEventListener("load", onLoad);
};

/**
 * Duplicates a template
 *
 * @param {Number} id - template id to duplicate
 * @returns {Promise}
 * @since 3.2.13
 */
const duplicateTemplate = async (id) => {
  const { uipApp } = appContext.config.globalProperties;

  let formData = new FormData();
  formData.append("action", "uip_duplicate_ui_template");
  formData.append("security", uip_ajax.security);
  formData.append("id", id);

  const response = await sendServerRequest(uip_ajax.ajax_url, formData);

  // Catch error
  if (response.error) {
    uipApp.notifications.notify(response.message, "", "error", true);
    return;
  }

  // Template duplicated
  uipApp.notifications.notify(__("Template duplicated", "uipress-lite"), "", "success", true);
  getTemplates(true);
};

/**
 * Confirms the deletion of template
 *
 * @param {Number} id - id of template to delete
 * @since 3.0.0
 */
const confirmDelete = async (id) => {
  const confirm = await confirmModal.value.show({
    title: __("Delete template", "uipress-lite"),
    message: __("Deleted templates can't be recovered", "uipress-lite"),
    okButton: __("Delete", "uipress-lite"),
  });
  if (!confirm) return;
  deleteTemplate(id);
};

/**
 * Deletes templates by ids
 *
 * @param {Array} ids - array of templates to delete
 * @returns {Promise}
 * @since 3.0.0
 */
const deleteTemplate = async (ids) => {
  const { uipApp } = appContext.config.globalProperties;

  let formData = new FormData();
  formData.append("action", "uip_delete_ui_template");
  formData.append("security", uip_ajax.security);
  formData.append("templateids", ids);

  const response = await sendServerRequest(uip_ajax.ajax_url, formData);

  // Handle error
  if (response.error) {
    uipApp.notifications.notify(response.message, "", "error", true);
    return;
  }

  // Success message
  uipApp.notifications.notify(response.message, "", "success", true);
  getTemplates(true);
};

/**
 * Creates new draft ui template
 *
 * @since 3.0.0
 */
const createNewUI = async (templateType) => {
  let formData = new FormData();
  formData.append("action", "uip_create_new_ui_template");
  formData.append("security", uip_ajax.security);
  formData.append("templateType", templateType);

  const response = await sendServerRequest(uip_ajax.ajax_url, formData);

  // Catch error
  if (!response) return;

  router.push(`/uibuilder/${response.id}/`);
};

/**
 * Runs link action and closes context
 */
const handleLinkAction = (link) => {
  link.action();
  templateContextMenu.value.close();
};

if (window.parent) {
  window.parent.postMessage({ eventName: "uip_exit_fullscreen" }, "*");
}

getTemplates();
enqueueAdminBarStyles();
</script>

<template>
  <AppTable
    :pagination="pagination"
    :columns="columns"
    :data="returnTemplates"
    :fetching="loading"
    @previous="handlePreviousPage"
    @next="handleNextPage"
    :rowClick="openTemplate"
    :rowRightClick="handleRightClick"
    :hideSelect="true"
  >
    <!-- Right actions -->

    <template v-slot:right-actions>
      <!-- New template -->
      <button class="uip-button-primary uip-flex uip-flex-row uip-gap-xxs uip-flex-center uip-text-s" @click="createNewUI('ui-template')">
        {{ __("New template", "uipress-lite") }}
      </button>
    </template>

    <!-- Name-->
    <template v-slot:row-name="{ row }">
      <div class="inline-flex">
        {{ row.name }}
      </div>
    </template>

    <!-- Satus-->
    <template v-slot:row-status="{ row }">
      <div
        class="uip-inline-flex uip-text-s uip-padding-left-xxs uip-padding-right-xxs uip-border uip-border-round"
        :class="row.status === 'publish' ? 'uip-border-green uip-text-green' : 'uip-border-orange uip-text-orange'"
      >
        {{ returnFormattedStatus(row.status) }}
      </div>
    </template>

    <!-- Type-->
    <template v-slot:row-type="{ row }">
      <div class="uip-inline-flex uip-text-s uip-padding-left-xxs uip-padding-right-xxs uip-border uip-border-round uip-background-muted">
        {{ row.type }}
      </div>
    </template>

    <!-- Modified-->
    <template v-slot:row-modified="{ row }">
      <div class="inline-flex uip-text-muted">
        {{ row.modified }}
      </div>
    </template>

    <!-- Actions -->
    <template v-slot:row-actions="{ row }">
      <div class="inline-flex uip-text-muted">
        <AppIcon
          icon="more_horiz"
          @click.stop.prevent="
            ($event) => {
              activeTemplateID = row.id;
              templateContextMenu.show($event);
            }
          "
        />
      </div>
    </template>
  </AppTable>

  <contextmenu ref="templateContextMenu">
    <div class="uip-padding-xs uip-flex uip-flex-column uip-text-weight-normal">
      <template v-for="link in templateLinks">
        <div v-if="link.type == 'divider'" class="uip-border-top uip-margin-top-xs uip-margin-bottom-xs"></div>

        <RouterLink
          v-else-if="link.type == 'link'"
          :to="link.url"
          class="uip-link-muted uip-flex uip-flex-center uip-flex-between uip-gap-m uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-no-underline"
        >
          <span class="">{{ link.name }}</span>
          <AppIcon :icon="link.icon" class="uip-icon" />
        </RouterLink>

        <a
          v-else
          @click="handleLinkAction(link)"
          class="uip-flex uip-flex-center uip-flex-between uip-gap-m uip-padding-xxs hover:uip-background-muted uip-border-rounder uip-no-underline"
          :class="link.danger ? 'uip-link-danger' : 'uip-link-muted'"
        >
          <span class="">{{ link.name }}</span>
          <AppIcon :icon="link.icon" class="uip-icon" />
        </a>
      </template>
    </div>
  </contextmenu>

  <Confirm ref="confirmModal" />
</template>
