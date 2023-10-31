const { __, _x, _n, _nx } = wp.i18n;
import { getUserPreference } from "../../v3.5/utility/functions.min.js";
export default {
  props: {
    display: String,
    name: String,
    block: Object,
  },
  data() {
    return {
      todoList: [],
      loading: false,
      queued: false,
      strings: {
        newToDo: __("Add todo", "uipress-lite"),
        whatwouldyoulike: __("What would you like to do?", "uipress-lite"),
        title: __("Title", "uipress-lite"),
        description: __("Add a description..."),
      },
      activeTab: "all",
      tabs: [
        {
          name: "all",
          label: __("All", "uipress-lite"),
        },
        {
          name: "todo",
          label: __("Todo", "uipress-lite"),
        },
        {
          name: "completed",
          label: __("Completed", "uipress-lite"),
        },
      ],
      newToDo: {
        name: "",
        description: "",
        done: false,
      },
    };
  },

  mounted() {
    this.getToDoList();
  },
  watch: {
    /**
     * Watches changes to the todo list and saves. There is a large timeout as this fires on every change
     *
     * @since 3.2.13
     */
    todoList: {
      handler(newValue, oldValue) {
        let self = this;

        if (this.queued) {
          return;
        }

        this.queued = true;
        setTimeout(() => {
          this.queued = false;
          this.saveUserPreference("uip-todo-list", newValue, false);
        }, 8000);
      },
      deep: true,
    },
  },
  computed: {
    /**
     * Returns the list of to dos based on the current tab
     *
     * @since 3.2.13
     */
    returnToDos() {
      switch (this.activeTab) {
        case "all":
          return this.todoList;

        case "todo":
          return this.todoList.filter((el) => el.done === false);

        case "completed":
          return this.todoList.filter((el) => el.done === true);

        default:
          return []; // This will return an empty array if none of the above conditions match
      }
    },
  },
  methods: {
    /**
     * Adds a new todo item to the list
     *
     * @since 3.2.13
     */
    addNewToDo() {
      let newItem = Object.assign({}, this.newToDo);
      this.todoList.push(newItem);

      // Reset new todo
      this.newToDo = { name: "", description: "", done: false };
    },

    /**
     * Gets the todo list
     *
     * @since 3.2.13
     */
    async getToDoList() {
      this.loading = true;

      // Get users list
      const response = await getUserPreference("uip-todo-list");

      this.loading = false;

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "", "error", true);
        return;
      }

      // Handle success
      if (response && Array.isArray(response)) {
        this.todoList = response;
      }
    },

    /**
     * Deletes a todo item
     *
     * @param {Number} index - The current index to delete
     * @since 3.2.13
     */
    deleteItem(index) {
      this.todoList.splice(index, 1);
    },

    /**
     * Duplicates a todo item
     *
     * @param {Object} item - the todo item to duplicate
     * @since 3.2.13
     */
    duplicateItem(item) {
      let newItem = Object.assign({}, item);
      this.todoList.push(newItem);
    },

    /**
     * Resizes the textarea automatically to stop scrolling
     *
     * @param {Object} event - the keyup event
     * @since 3.2.13
     */
    resizeTextarea(event) {
      const newHeight = Math.min(event.target.scrollHeight, 500);

      event.target.style.height = "";
      event.target.style.height = newHeight + "px";

      const overflow = newHeight == 500 ? "auto" : "hidden";
      event.target.style.overflow = overflow;
    },
  },
  template: `
            
            <div class="uip-flex uip-flex-column uip-row-gap-s uip-flex-no-wrap" >
            
              <component is="style" scoped>
                .list-enter-active,
                .list-leave-active {
                  transition: all 0.5s ease;
                }
                .list-enter-from,
                .list-leave-to {
                  opacity: 0;
                  transform: translateX(30px);
                }
              </component>
            
              <!--NEW TODO -->
              <div class="uip-flex uip-flex-row uip-gap-xs">
                <div class="uip-flex uip-padding-xxs uip-border uip-search-block uip-border-round uip-flex-center uip-flex-grow">
                  <span class="uip-icon uip-text-muted uip-margin-right-xs uip-text-l uip-icon uip-icon-medium">check_box</span>
                  <input class="uip-blank-input uip-flex-grow uip-text-s" type="text" :placeholder="strings.whatwouldyoulike" v-model="newToDo.name">
                </div>
                <button @click="addNewToDo()" class="uip-button-default uip-text-s uip-padding-xs uip-add-todo">{{strings.newToDo}}</button>
              </div>
              
              <!--END TODO -->
              
              
              <!--VIEWS-->
              <div class="uip-flex uip-flex-row uip-gap-s uip-padding-xxs uip-tabs">
                <template v-for="tab in tabs">
                  <div class="uip-link-muted uip-padding-bottom-xs uip-tab" :class="{'uip-border-bottom-primary uip-text-bold uip-text-emphasis uip-tab-active' : activeTab == tab.name}" @click="activeTab = tab.name">{{tab.label}}</div>
                </template>
              </div>
              <!-- END OF VIEWS-->
              
              
              <!--TODO LIST-->
              <div v-if="loading" class="uip-padding-m uip-flex uip-flex-center uip-flex-middle"><loading-chart></loading-chart></div>
              <div v-if="!loading" class="uip-flex uip-flex-column uip-row-gap-s uip-padding-xxs uip-list-area">
                <TransitionGroup name="list" >
                      <div v-for="(item, index) in returnToDos" class="uip-flex uip-flex-row uip-gap-xs" :key="item" :data-index="index">
                        <div >
                          <input type="checkbox" class="uip-checkbox uip-checkbox-round" v-model="item.done">
                        </div>
                        <div class="uip-flex uip-flex-column uip-row-gap-xxxs uip-flex-grow">
                          <input class="uip-blank-input uip-text-bold uip-list-item-title uip-text-emphasis" v-model="item.name" type="text" :placeholder="strings.title">
                          <textarea v-model="item.description" class="uip-input uip-text-s uip-text-muted uip-no-resize uip-blank-input uip-list-item-description uip-min-h-20 uip-overflow-hidden"  :placeholder="strings.description" @input="resizeTextarea($event)"></textarea>
                        </div>
                        <div class="uip-w-50 uip-flex uip-flex-right uip-padding-xxs uip-flex-middle">
                          <dropdown pos="left center">
                            <template v-slot:trigger>
                              <div  class="uip-icon uip-link-muted uip-icon-muted uip-text-l uip-icon-medium" >more_vert</div>
                            </template>
                            <template v-slot:content>
                              <div class="uip-padding-xxs uip-flex uip-flex-row uip-gap-xxs">
                                <div class="uip-icon uip-link-danger uip-icon-muted uip-text-l" @click="deleteItem(index)">delete</div>
                                <div class="uip-icon uip-link-muted uip-icon-muted uip-text-l" @click="duplicateItem(item)">content_copy</div>
                              </div>
                            </template>
                          </dropdown>
                        </div>
                      </div>
                </TransitionGroup>
              </div>
              
            </div>
          `,
};
