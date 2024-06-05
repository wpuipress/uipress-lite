<script>
import { __ } from '@wordpress/i18n';
import { defineAsyncComponent, nextTick } from "vue";

import PostTypeSelect from "@/js/uip/components/post-type-select/core.vue";
import PostTypeSelectPreview from "@/js/uip/components/post-type-select/preview.vue";

import StatusTypeSelect from "@/js/uip/components/multiselect/core.vue";
import StatusTypeSelectPreview from "@/js/uip/components/multiselect/preview.vue";

import UserRoleSelect from "@/js/uip/components/user-role-multiselect/core.vue";
import UserRoleSelectPreview from "@/js/uip/components/user-role-multiselect/preview.vue";

import Comparisons from "@/js/uip/data/comparisons.js";
import DataTypes from "@/js/uip/data/query_data_types.js";
import FieldTypes from "@/js/uip/data/tax_field_types.js";
import OrderByOptions from "@/js/uip/data/query_orderby.js";
import OrderByOptionsUser from "@/js/uip/data/query_orderby_user.js";
import OrderByOptionsSites from "@/js/uip/data/query_orderby_sites.js";

export default {
  props: {
    returnData: Function,
    value: Object,
  },
  data() {
    return {
      strings: {
        metaKey: __("Meta key", "uipress-lite"),
        metaValue: __("Meta value", "uipress-lite"),
        compare: __("Compare", "uipress-lite"),
        type: __("Type", "uipress-lite"),
      },
      meta: {},
      comparisons: Comparisons,
      dataTypes: DataTypes,
    };
  },
  watch: {
    meta: {
      handler() {
        this.returnData(this.meta);
      },
      deep: true,
    },
  },
  mounted() {
    this.meta = this.value;
  },
};
</script>

<template>
  <div class="uip-grid-col-1-3 uip-padding-left-xs">
    <!--Meta key-->
    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
      <span>{{ strings.metaKey }}</span>
    </div>
    <div class="uip-flex uip-flex-center">
      <input type="text" min="0" class="uip-input uip-remove-steps uip-background-remove uip-padding-xxxs uip-width-100p" v-model="meta.key" />
    </div>

    <!--Meta value-->
    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
      <span>{{ strings.metaValue }}</span>
    </div>
    <div class="uip-flex uip-flex-center">
      <input type="text" min="0" class="uip-input uip-remove-steps uip-background-remove uip-padding-xxxs uip-width-100p" v-model="meta.value" />
    </div>

    <!--Compare-->
    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
      <span>{{ strings.compare }}</span>
    </div>
    <div class="uip-flex uip-flex-center">
      <select
        class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p uip-w-100p uip-border-rounder"
        style="padding-top: 2px; padding-bottom: 2px; border-radius: var(--uip-border-radius-large)"
        v-model="meta.compare"
      >
        <template v-for="item in comparisons">
          <option :value="item.value">{{ item.label }}</option>
        </template>
      </select>
    </div>

    <!--Compare-->
    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
      <span>{{ strings.type }}</span>
    </div>
    <div class="uip-flex uip-flex-center">
      <select
        class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p uip-w-100p uip-border-rounder"
        style="padding-top: 2px; padding-bottom: 2px; border-radius: var(--uip-border-radius-large)"
        v-model="meta.type"
      >
        <template v-for="item in dataTypes">
          <option :value="item.value">{{ item.label }}</option>
        </template>
      </select>
    </div>
  </div>
</template>
