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
        order: __("Order", "uipress-lite"),
        orderBy: __("Order by", "uipress-lite"),
        metaKey: __("Meta key", "uipress-lite"),
      },
      options: {},
      orderByOptions: OrderByOptions,
      orderByOptionsUser: OrderByOptionsUser,
      orderByOptionsSites: OrderByOptionsSites,
    };
  },
  watch: {
    options: {
      handler() {
        this.returnData(this.options);
      },
      deep: true,
    },
  },
  computed: {
    /**
     * Returns dynamic list of order by options depending on type
     *
     * @since 3.2.13
     */
    returnOrderOptions() {
      if (this.options.type == "post") {
        return this.orderByOptions;
      }
      if (this.options.type == "user") {
        return this.orderByOptionsUser;
      }
      if (this.options.type == "site") {
        return this.orderByOptionsSites;
      }
    },
    /**
     * Returns order direction object
     *
     * @since 3.2.13
     */
    orderDirectionsOptions() {
      return {
        DESC: {
          value: "DESC",
          label: __("Descending", "uipress-lite"),
        },
        ASC: {
          value: "ASC",
          label: __("Ascending", "uipress-lite"),
        },
      };
    },
  },
  created() {
    this.options = this.value;
  },
};
</script>

<template>
  <div class="uip-grid-col-1-3 uip-padding-left-xs">
    <!--ORDER-->
    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
      <span>{{ strings.order }}</span>
    </div>
    <div class="uip-position-relative">
      <toggle-switch
        :options="orderDirectionsOptions"
        :activeValue="options.order"
        :returnValue="
          function (data) {
            options.order = data;
          }
        "
      ></toggle-switch>
    </div>

    <!--Orderby-->
    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
      <span>{{ strings.orderBy }}</span>
    </div>
    <div class="uip-position-relative">
      <select
        class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p uip-w-100p uip-border-rounder"
        style="padding-top: 2px; padding-bottom: 2px; border-radius: var(--uip-border-radius-large)"
        v-model="options.orderBy"
      >
        <template v-for="item in returnOrderOptions">
          <option :value="item.value">{{ item.label }}</option>
        </template>
      </select>
    </div>

    <!--Meta key-->
    <template v-if="options.orderBy == 'meta_value'">
      <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
        <span>{{ strings.metaKey }}</span>
      </div>
      <div class="uip-position-relative">
        <input type="text" min="0" class="uip-input uip-remove-steps uip-background-remove uip-padding-xxxs uip-flex-grow" v-model="options.orderBykEY" />
      </div>
    </template>
  </div>
</template>
