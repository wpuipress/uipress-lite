<script>
import { __ } from '@wordpress/i18n';
import { defineAsyncComponent, nextTick } from "vue";

import PostTypeSelect from "@/components/post-type-select/core.vue";
import PostTypeSelectPreview from "@/components/post-type-select/preview.vue";

import StatusTypeSelect from "@/components/multiselect/core.vue";
import StatusTypeSelectPreview from "@/components/multiselect/preview.vue";

import UserRoleSelect from "@/components/user-role-multiselect/core.vue";
import UserRoleSelectPreview from "@/components/user-role-multiselect/preview.vue";

import Comparisons from "@/data/comparisons.js";
import DataTypes from "@/data/query_data_types.js";
import FieldTypes from "@/data/tax_field_types.js";
import OrderByOptions from "@/data/query_orderby.js";
import OrderByOptionsUser from "@/data/query_orderby_user.js";
import OrderByOptionsSites from "@/data/query_orderby_sites.js";

export default {
  props: {
    returnData: Function,
    value: Object,
  },
  data() {
    return {
      strings: {
        taxonomy: __("Taxonomy", "uipress-lite"),
        taxValue: __("Tax value", "uipress-lite"),
        field: __("Field", "uipress-lite"),
        compare: __("Compare", "uipress-lite"),
        includeChildren: __("Include children"),
      },
      tax: {},
      comparisons: Comparisons,
      dataTypes: DataTypes,
      fieldTypes: FieldTypes,
    };
  },
  watch: {
    tax: {
      handler() {
        this.returnData(this.tax);
      },
      deep: true,
    },
  },
  mounted() {
    this.tax = this.value;
  },
  methods: {
    /**
     * Returns post types as string
     *
     * @param {Array} postTypes - array of post types for conversion
     * @since 3.2.13
     */
    returnTaxPostTypes(postTypes) {
      return postTypes.toString();
    },
  },
};
</script>

<template>
  <div class="uip-grid-col-1-3 uip-padding-left-xs">
    <!--tax key-->
    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
      <span>{{ strings.taxonomy }}</span>
    </div>
    <div class="uip-flex uip-flex-center">
      <select
        class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p uip-w-100p uip-border-rounder"
        style="padding-top: 2px; padding-bottom: 2px; border-radius: var(--uip-border-radius-large)"
        v-model="tax.taxonomy"
      >
        <template v-for="item in uipApp.data.options.taxonomies">
          <option :value="item.name">
            {{ item.label }}
            ({{ returnTaxPostTypes(item.object_type) }})
          </option>
        </template>
      </select>
    </div>

    <!--tax value-->
    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
      <span>{{ strings.taxValue }}</span>
    </div>
    <div class="uip-flex uip-flex-center">
      <input placeholder="term_1, term_2" type="text" min="0" class="uip-input-small uip-w-100p" v-model="tax.value" />
    </div>

    <!--Field type-->
    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
      <span>{{ strings.field }}</span>
    </div>
    <div class="uip-flex uip-flex-center">
      <select
        class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p uip-w-100p uip-border-rounder"
        style="padding-top: 2px; padding-bottom: 2px; border-radius: var(--uip-border-radius-large)"
        v-model="tax.fieldType"
      >
        <template v-for="item in fieldTypes">
          <option :value="item.value">{{ item.label }}</option>
        </template>
      </select>
    </div>

    <!--Compare-->
    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
      <span>{{ strings.compare }}</span>
    </div>
    <div class="uip-flex uip-flex-center">
      <select
        class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p uip-w-100p uip-border-rounder"
        style="padding-top: 2px; padding-bottom: 2px; border-radius: var(--uip-border-radius-large)"
        v-model="tax.compare"
      >
        <template v-for="item in comparisons">
          <option :value="item.value">{{ item.label }}</option>
        </template>
      </select>
    </div>

    <!--Include children-->
    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
      <span>{{ strings.includeChildren }}</span>
    </div>
    <div class="uip-flex uip-flex-center">
      <switch-select
        :args="{ asText: true }"
        :activeValue="tax.includeChildren"
        :returnValue="
          (d) => {
            tax.includeChildren = d;
          }
        "
      />
    </div>
  </div>
</template>
