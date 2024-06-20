<script setup>
import { ref, computed, getCurrentInstance } from "vue";
const { __ } = wp.i18n;
import { useRouter } from "vue-router";

// Comps
import AppTable from "@/components/table/index.vue";
import Confirm from "@/components/confirm/index.vue";
import StatusTag from "@/components/status-tag/index.vue";
import AppButton from "@/components/app-button/index.vue";

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
const returnFormattedStatus = (status) => {
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
    class="w-full"
  >
    <!-- Right actions -->

    <template v-slot:right-actions>
      <AppButton type="primary" @click="createNewUI('ui-template')" class="text-sm">{{ __("New template", "uipress-lite") }}</AppButton>
    </template>

    <!-- Empty slot-->
    <template v-slot:empty>
      <div class="flex flex-col gap-4 p-12 items-center">
        <AppIcon icon="folder_open" style="font-size: 60px" />
        <div class="font-bold text-xl text-zinc-900">{{ __("No templates yet", "uipress-lite") }}</div>
        <div class="text-zinc-400">{{ __("When you create new templates they will show up here.", "uipress-lite") }}</div>
        <AppButton type="primary" @click="createNewUI('ui-template')">{{ __("New template", "uipress-lite") }}</AppButton>
      </div>
    </template>

    <!-- Name-->
    <template v-slot:row-name="{ row }">
      <div class="text-zinc-900">
        {{ row.name }}
      </div>
    </template>

    <!-- Satus-->
    <template v-slot:row-status="{ row }">
      <StatusTag :status="row.status === 'publish' ? 'success' : 'warning'" :text="returnFormattedStatus(row.status)" />
    </template>

    <!-- Type-->
    <template v-slot:row-type="{ row }">
      <div class="inline-flex text-s px-2 py-1 border border-zinc-200 rounded-md text-sm bg-zinc-50">
        {{ row.type }}
      </div>
    </template>

    <!-- Modified-->
    <template v-slot:row-modified="{ row }">
      <div class="inline-flex text-zinc-500 text-sm">
        {{ row.modified }}
      </div>
    </template>

    <!-- Actions -->
    <template v-slot:row-actions="{ row }">
      <AppButton type="transparent">
        <AppIcon
          icon="more_horiz"
          @click.stop.prevent="
            ($event) => {
              activeTemplateID = row.id;
              templateContextMenu.show($event);
            }
          "
        />
      </AppButton>
    </template>
  </AppTable>

  <contextmenu ref="templateContextMenu">
    <div class="p-3 flex flex-col">
      <template v-for="link in templateLinks">
        <div v-if="link.type == 'divider'" class="border-t border-zinc-200 my-2"></div>

        <RouterLink v-else-if="link.type == 'link'" :to="link.url" class="flex flex-row gap-6 py-1 px-2 rounded-lg hover:bg-zinc-100 items-center hover:text-zinc-900 transition-all">
          <span class="grow">{{ link.name }}</span>
          <AppIcon :icon="link.icon" />
        </RouterLink>

        <a
          v-else
          @click="handleLinkAction(link)"
          class="flex flex-row gap-6 py-1 px-2 rounded-lg hover:bg-zinc-100 items-center hover:text-zinc-900 transition-all"
          :class="link.danger ? 'text-red-500 hover:text-red-700' : ''"
        >
          <span class="grow">{{ link.name }}</span>
          <AppIcon :icon="link.icon" />
        </a>
      </template>
    </div>
  </contextmenu>

  <Confirm ref="confirmModal" />
</template>
