const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: Object,
      args: Object,
    },
    data: function () {
      return {
        open: false,
        link: {
          value: '',
          newTab: 'dynamic',
          dynamic: false,
          dynamicKey: '',
          dynamicType: '',
        },
        hideLinkType: false,
        adminMenu: this.uipData.adminMenu.menu,
        dynamics: this.uipData.dynamicOptions,
        posts: [],
        searchString: '',
        fetchSearchString: '',
        serverActive: false,
        strings: {
          searchLinks: __('Search admin pages', 'uipress-lite'),
          searchPages: __('Search pages and posts', 'uipress-lite'),
          noneFound: __('No posts found for current query', 'uipress-lite'),
          newTab: __('Link mode', 'uipress-lite'),
          linkSelect: __('Link select', 'uipress-lite'),
          currentValue: __('Current value', 'uipress-lite'),
          select: __('select', 'uipress-lite'),
        },
        linkTypes: {
          admin: {
            value: 'admin',
            label: __('Admin', 'uipress-lite'),
          },
          content: {
            value: 'content',
            label: __('Content', 'uipress-lite'),
          },
        },
        linkModes: {
          dynamic: {
            value: 'dynamic',
            label: __('Dynamic', 'uipress-lite'),
            placeHolder: __('Dynamic links will load in the available content frame without page refresh. If none exists then it will perform a normal relead.'),
          },
          default: {
            value: 'default',
            label: __('Default', 'uipress-lite'),
            placeHolder: __('Default links load like a normal link and will refresh the whole page.'),
          },
          newTab: {
            value: 'newTab',
            label: __('New tab', 'uipress-lite'),
            placeHolder: __('New tab links open in a new browser tab.'),
          },
        },
        activeValue: 'admin',
      };
    },
    inject: ['uipData', 'uipress'],
    watch: {
      fetchSearchString: {
        handler(newValue, oldValue) {
          this.searchPosts();
        },
        deep: true,
      },
      link: {
        handler(newValue, oldValue) {
          this.returnData(newValue);
        },
        deep: true,
      },
    },
    mounted: function () {
      this.formatValue(this.value);

      if (this.args) {
        if ('hideLinkType' in this.args) {
          this.hideLinkType = this.args.hideLinkType;
        }
      }

      //Only add this option if it was already as it uses the old dynamic system
      if (this.link.dynamic) {
        this.linkTypes.dynamic = {
          value: 'dynamic',
          label: __('Dynamic', 'uipress-lite'),
        };
      }
    },
    computed: {
      getPosts() {
        return this.posts;
      },
      createOptionObject() {
        let defaultlink = {
          value: '',
          newTab: 'dynamic',
          dynamic: false,
          dynamicKey: '',
        };
        return defaultlink;
      },
    },
    methods: {
      formatValue(value) {
        if (this.uipress.isObject(value)) {
          this.link = { ...this.link, ...value };
        }
      },
      searchPosts() {
        if (this.fetchSearchString == '') {
          return;
        }
        if (this.serverActive) {
          return;
        }
        this.serverActive = true;
        let str = this.fetchSearchString.toLowerCase();

        let self = this;

        //Build form data for fetch request
        let formData = new FormData();
        formData.append('action', 'uip_search_posts_pages');
        formData.append('security', uip_ajax.security);
        formData.append('searchStr', str);
        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          self.posts = response.posts;
          self.serverActive = false;
        });
      },
      chooseLink(option) {
        this.link.value = option;
        this.link.dynamic = false;
        this.link.dynamicKey = '';
        this.returnData(this.link);
      },
      inSearch(menu) {
        if (this.searchString == '') {
          return true;
        }

        if (menu[0] == '') {
          return true;
        }

        let lowStr = this.searchString.toLowerCase();

        if (menu[0].toLowerCase().includes(lowStr) || menu[2].toLowerCase().includes(lowStr)) {
          return true;
        }

        return false;
      },
      chooseItem(item) {
        this.link.dynamic = true;
        this.link.dynamicKey = item.key;
        this.link.value = item.value;
        this.link.dynamicType = 'link';

        this.returnData(this.link);
      },
      removeDynamicItem() {
        this.link.dynamic = false;
        this.link.dynamicKey = '';
        this.link.value = '';
        this.link.dynamicType = '';

        this.returnData(this.link);
      },
    },
    template: `
      <div class="uip-w-100p uip-flex uip-flex-column uip-row-gap-xs">
      
      
        <div class="uip-flex uip-gap-xxs">
      
          <dropdown pos="left center" 
          ref="linkselect"
          :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']">
              <template v-slot:trigger>
                <div class="uip-flex uip-flex-row">
                  
                  <span class="uip-border-rounder uip-text-l uip-flex uip-icon uip-padding-xxxs uip-text-center uip-link-default uip-background-muted"
                  :class="{'uip-background-primary uip-text-inverse' : link.dynamic}">
                    link
                  </span>
                  
                </div>
              </template>
              
              <template v-slot:content>
              
                <div class="uip-flex uip-flex-column uip-row-gap-s uip-padding-s uip-w-240">
                
                  <div class="uip-flex uip-flex-between uip-flex-center">
                    <div class="uip-text-emphasis uip-text-bold uip-text-s">{{strings.linkSelect}}</div>
                    <div @click.prevent.stop="$refs.linkselect.close()"
                    class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
                      <span class="uip-icon">close</span>
                    </div>
                  </div>
                
                
                  <toggle-switch :options="linkTypes" :activeValue="activeValue" :returnValue="function(data){ activeValue = data}"></toggle-switch>
                  
                  <template v-if="activeValue == 'admin'">
                  
                    
                    <input type="text" class="uip-input-small uip-w-100p" v-model="searchString" :placeholder="strings.searchLinks">
                    
                    <div class="uip-flex uip-flex-column uip-max-h-200" style="overflow:auto">
                    
                      <template v-for="(menu, index) in adminMenu">
                      
                         <div v-if="menu[0] != '' && inSearch(menu)" class="uip-border-round hover:uip-background-muted uip-border-round uip-padding-xxs uip-flex uip-cursor-pointer uip-w-100p uip-flex uip-flex-column uip-flex-no-wrap" @click="chooseLink(menu[2])">
                         
                            <div class="uip-text-s uip-text-bold" v-html="menu[0]"></div>
                            <div class="uip-text-s uip-text-muted uip-no-wrap uip-overflow-hidden uip-text-ellipsis uip-max-w-100p">{{menu[2]}}</div>
                           
                         </div>
                         
                        <template v-if="menu.submenu" v-for="sub in menu.submenu">
                        
                          <div v-if="sub[0] != '' && inSearch(sub)" class="uip-border-round hover:uip-background-muted uip-border-round uip-padding-xxs uip-flex uip-cursor-pointer uip-w-100p uip-flex uip-flex-column uip-flex-no-wrap" @click="chooseLink(sub[2])">
                           
                              <div class="uip-text-s uip-text-bold" v-html="sub[0]"></div>
                              <div class="uip-text-s uip-text-muted uip-no-wrap uip-overflow-hidden uip-text-ellipsis uip-max-w-100p">{{sub[2]}}</div>
                             
                           </div>
                           
                        </template>
                        
                      </template>
                      
                    </div>
                  </template>
                  
                  <template v-if="activeValue == 'content'">
                  
                      
                      <input type="text" class="uip-input-small uip-w-100p" v-model="fetchSearchString" :placeholder="strings.searchPages">
                      
                      
                      <div class="uip-flex uip-flex-column uip-max-h-200" style="overflow:auto">
                        <template v-for="post in getPosts">
                         <div class="uip-border-round hover:uip-background-muted uip-border-round uip-padding-xxs uip-flex uip-cursor-pointer" @click="chooseLink(post.link)">
                           <div class="">
                            <div class="uip-text-s uip-text-bold">{{post.name}}</div>
                            <div class="uip-text-s uip-text-muted">{{post.link}}</div>
                           </div>
                         </div>
                        </template>
                        <div v-if="posts.length < 1 && fetchSearchString != ''" class="uip-text-muted uip-text-s uip-padding-xxs">{{strings.noneFound}}</div>
                      </div>
                      
                  </template>
                  
                  <template v-if="activeValue == 'dynamic' && link.dynamic">
                    <div class="uip-flex uip-flex-column uip-row-gap-xxxs uip-w-250 uip-max-h-200 uip-scrollbar uip-overflow-auto">
                      <template v-for="dynamic in dynamics">
                       <div v-if="dynamic.type == 'link'" class="uip-border-round hover:uip-background-muted uip-border-round uip-padding-xxs uip-flex uip-flex-between uip-flex-center uip-flex-middle uip-cursor-pointer"  :class="{'uip-background-primary-wash' : link.dynamicKey == dynamic.key}">
                         <div class="">
                          <div class="uip-text-s uip-text-bold">{{dynamic.label}}</div>
                          <div class="uip-text-xs uip-text-muted uip-flex uip-flex-center uip-gap-s">
                            <span class="uip-no-wrap uip-overflow-hidden uip-text-ellipsis uip-max-w-150">{{dynamic.value}}</span>
                          </div>
                         </div>
                         <span v-if="link.dynamicKey == dynamic.key" @click="removeDynamicItem()"
                         class="uip-padding-xxs uip-border-round uip-background-muted hover:uip-background-grey uip-cursor-pointer uip-flex uip-flex-middle uip-flex-center">
                          <span class="uip-icon">delete</span>
                         </span>
                         <span v-else @click="chooseItem(dynamic)"
                          class="uip-padding-xxs uip-border-round uip-background-muted hover:uip-background-grey uip-cursor-pointer uip-flex uip-flex-middle uip-flex-center">
                           {{strings.select}}
                          </span>
                       </div>
                      </template>
                    </div>
                  </template>
                  
                </div>
                
              </template>
          </dropdown>
          
          <input type="text" class="uip-input-small uip-flex-grow" v-model="link.value">
        
        </div>
        
        
        <div class="uip-flex uip-flex-column uip-row-gap-xxxs" v-if="!hideLinkType && link.value != ''">
        
          <toggle-switch :options="linkModes" :activeValue="link.newTab" :returnValue="function(data){ link.newTab = data}"></toggle-switch>
        
        </div>
        
      </div>`,
  };
}
