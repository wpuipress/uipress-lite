<script>
const { __ } = wp.i18n;
import { defineAsyncComponent, nextTick } from "vue";

import PostTypeSelect from "@/components/post-type-select/core.vue";
import StatusTypeSelect from "@/components/multiselect/core.vue";
import UserRoleSelect from "@/components/user-role-multiselect/core.vue";
import ScreenControl from "@/components/screen-control/index.vue";

import QueryBuilder from "./QueryBuilder.vue";
import OrderBy from "./OrderBy.vue";
import TaxQuery from "./TaxQuery.vue";
import MetaQuery from "./MetaQuery.vue";

export default {
  components: {
    ScreenControl,
    PostTypeSelect: PostTypeSelect,
    QueryBuilder: QueryBuilder,
    MetaBuilder: MetaQuery,
    TaxBuilder: TaxQuery,
    OrderByBuilder: OrderBy,
    StatusTypeSelect: StatusTypeSelect,
    UserRoleSelect: UserRoleSelect,
  },
  props: {
    returnData: Function,
    value: Object,
    blockSettings: Object,
    block: Object,
  },
  data() {
    return {
      open: false,
      strings: {
        query: __("Query", "uipress-lite"),
        editQuery: __("Edit query", "uipress-lite"),
        add: __("Add", "uipress-lite"),
      },
      enabledDisabled: {
        false: {
          value: false,
          label: __("Disabled", "uipress-lite"),
        },
        true: {
          value: true,
          label: __("Enabled", "uipress-lite"),
        },
      },
    };
  },
  watch: {
    "block.query.enabled": {
      async handler() {
        if (this.block.query.enabled) {
          await nextTick();
          this.$refs.queryBuilder.show();
        }
      },
      deep: true,
    },
  },
  computed: {
    /**
     * Checks if query is enabled
     *
     * @since 3.2.13
     */
    returnQueryVal() {
      if (!("query" in this.block)) {
        this.block.query = {
          enabled: false,
          settings: {},
        };
      }

      return this.block.query.enabled;
    },

    /**
     * Returns the block fill screen
     *
     * @since 3.2.13
     */
    queryFillScreen() {
      return {
        component: "QueryBuilder",
        value: this.block.query.settings,
        label: this.strings.query,
        returnData: (d) => {
          this.block.query.settings = { ...d };
        },
      };
    },

    /**
     * Checks if block has active query
     *
     * @since 3.3.05
     */
    emptyBlockQuery() {
      return !this.returnBlockQueryType && !this.returnBlockQueryPerPage;
    },

    /**
     * Returns query type
     *
     * @since 3.3.05
     */
    returnBlockQueryType() {
      return this.hasNestedPath(this.block, ["query", "settings", "type"]) ? this.block.query.settings.type : false;
    },

    /**
     * Returns query per page
     *
     * @since 3.3.05
     */
    returnBlockQueryPerPage() {
      return this.hasNestedPath(this.block, ["query", "settings", "perPage"]) ? this.block.query.settings.perPage : false;
    },

    /**
     * Returns query preview text
     *
     * @since 3.3.05
     */
    returnQueryPreviewText() {
      if (this.emptyBlockQuery) return this.strings.add;
      return this.returnBlockQueryType + " | " + this.returnBlockQueryPerPage;
    },
  },
};
</script>

<template>
  <div class="uip-grid-col-1-3">
    <!--Enabled / disabled -->
    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-text-s">
      <span>{{ strings.query }}</span>
    </div>
    <toggle-switch
      :options="enabledDisabled"
      :activeValue="returnQueryVal"
      :returnValue="
        (d) => {
          block.query.enabled = d;
        }
      "
    ></toggle-switch>

    <!--Spacer-->
    <div></div>

    <dropdown v-if="returnQueryVal" pos="left center" ref="queryBuilder" :snapX="['#uip-block-settings']" class="uip-w-100p">
      <template #trigger>
        <div class="uip-background-muted uip-border-rounder uip-padding-xxs uip-flex uip-flex-center uip-gap-xs uip-cursor-pointer">
          <div class="uip-background-primary uip-text-inverse uip-border-round uip-padding-xxxs">
            <AppIcon icon="all_inclusive" class="uip-icon" />
          </div>

          <div class="uip-no-wrap uip-flex uip-gap-xxs uip-flex-grow uip-flex-center">
            <span class="uip-text-muted" key="add">{{ returnQueryPreviewText }}</span>
          </div>

          <a @click.prevent.stop="block.query.settings = {}" class="uip-link-muted uip-padding-xxxs uip-border-rounder uip-text-s hover:uip-background-muted uip-icon"><AppIcon icon="close" /></a>
        </div>
      </template>

      <template #content>
        <div class="uip-padding-s uip-w-260">
          <ScreenControl :startScreen="queryFillScreen" :homeScreen="queryFillScreen.component" :closer="$refs.queryBuilder.close" :showNavigation="true">
            <template #componenthandler="{ processScreen, currentScreen, goBack }">
              <KeepAlive>
                <component
                  @tab-change="
                    (d) => {
                      fillTab = d;
                    }
                  "
                  @request-screen="
                    (d) => {
                      processScreen(d);
                    }
                  "
                  @go-back="goBack()"
                  :returnData="currentScreen.returnData"
                  :value="currentScreen.value"
                  :args="currentScreen.args"
                  v-bind="currentScreen.attributes"
                  :is="currentScreen.component"
                />
              </KeepAlive>
            </template>
          </ScreenControl>
        </div>
      </template>
    </dropdown>
  </div>
</template>
