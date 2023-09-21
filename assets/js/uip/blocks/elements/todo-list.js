const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
    },
    data: function () {
      return {
        todoList: [],
        loading: false,
        queued: false,
        strings: {
          newToDo: __('Add todo', 'uipress-lite'),
          whatwouldyoulike: __('What would you like to do?', 'uipress-lite'),
          title: __('Title', 'uipress-lite'),
          description: __('Add a description...'),
        },
        activeTab: 'all',
        tabs: [
          {
            name: 'all',
            label: __('All', 'uipress-lite'),
          },
          {
            name: 'todo',
            label: __('Todo', 'uipress-lite'),
          },
          {
            name: 'completed',
            label: __('Completed', 'uipress-lite'),
          },
        ],
        newToDo: {
          name: '',
          description: '',
          done: false,
        },
      };
    },
    inject: ['uipress'],
    mounted: function () {
      this.getToDoList();
    },
    watch: {
      todoList: {
        //This fires every time a list item changes so we only allow a save every 8 seconds maximum.
        handler(newValue, oldValue) {
          let self = this;

          if (self.queued) {
            return;
          }

          self.queued = true;
          setTimeout(function () {
            self.queued = false;
            self.uipress.saveUserPreference('uip-todo-list', newValue, false);
          }, 8000);
        },
        deep: true,
      },
    },
    computed: {
      returnToDos() {
        if (this.activeTab == 'all') {
          return this.todoList;
        }
        if (this.activeTab == 'todo') {
          return this.todoList.filter(function (el) {
            return el.done == false;
          });
        }
        if (this.activeTab == 'completed') {
          return this.todoList.filter(function (el) {
            return el.done == true;
          });
        }
      },
    },
    methods: {
      addNewToDo() {
        let newItem = Object.assign({}, this.newToDo);
        this.todoList.push(newItem);

        this.newToDo = {
          name: '',
          description: '',
          done: false,
        };
      },
      getToDoList() {
        let self = this;
        self.loading = true;
        this.uipress.getUserPreference('uip-todo-list').then((response) => {
          self.loading = false;
          if (response.error) {
            self.uipress.notify(response.message, '', 'error', true);
            return false;
          } else {
            //success
            if (response != false && Array.isArray(response)) {
              self.todoList = response;
            }
          }
        });
      },
      deleteItem(index) {
        this.todoList.splice(index, 1);
      },
      duplicateItem(item) {
        let newItem = Object.assign({}, item);
        this.todoList.push(newItem);
      },
      resizeTextarea(event) {
        event.target.style.height = '';
        let newHeight = Math.min(event.target.scrollHeight, 500);
        event.target.style.height = newHeight + 'px';

        if (newHeight == 500) {
          event.target.style.overflow = 'auto';
        } else {
          event.target.style.overflow = 'hidden';
        }
      },
    },
    template: `
          <div>
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
            <div class="uip-flex uip-flex-column uip-row-gap-s uip-flex-no-wrap" :id="block.uid" :class="block.settings.advanced.options.classes.value">
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
              <div v-if="!loading" class="uip-flex uip-flex-column uip-row-gap-xs uip-padding-xxs uip-list-area">
                <TransitionGroup name="list" >
                      <div v-for="(item, index) in returnToDos" class="uip-flex uip-flex-row uip-gap-xs" :key="item" :data-index="index">
                        <div >
                          <input type="checkbox" class="uip-checkbox uip-checkbox-round" v-model="item.done">
                        </div>
                        <div class="uip-flex uip-flex-column uip-row-gap-xxxs uip-flex-grow">
                          <input class="uip-blank-input uip-text-bold uip-list-item-title" v-model="item.name" type="text" :placeholder="strings.title">
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
          </div>
          `,
  };
}
