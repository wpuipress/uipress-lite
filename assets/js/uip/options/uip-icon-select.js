const { __, _x, _n, _nx } = wp.i18n;
import * as allUIPIcons from './uip-icons.min.js';
export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: Object,
    },
    data: function () {
      return {
        open: false,
        icon: {
          value: '',
        },
        allIcons: this.shuffle(allUIPIcons.returnIcons()),
        searchString: '',
        currentPage: 0,
        iconsPerPage: 56,
        totalIcons: 0,
        maxPages: 0,
        strings: {
          searchIcons: __('Search icons', 'uipress-lite'),
          clearIcon: __('Clear icon', 'uipress-lite'),
          chooseIcon: __('Choose icon', 'uipress-lite'),
        },
      };
    },
    inject: ['uipress'],
    watch: {
      icon: {
        handler(newValue, oldValue) {
          this.returnData(newValue);
        },
        deep: true,
      },
    },
    mounted: function () {
      this.formatIcon(this.value);
    },
    computed: {
      iconsPaged() {
        let self = this;
        let masteroptions = self.allIcons;
        let returndata = [];
        let temparray = [];
        let searchinput = self.searchString.toLowerCase();

        if (self.currentPage < 0) {
          self.currentPage = 0;
        }
        self.totalIcons = self.allIcons.length;
        self.maxPages = Math.ceil(self.allIcons.length / this.iconsPerPage);

        if (self.currentPage > self.maxPages) {
          self.currentPage = self.maxPages;
        }

        let startPos = self.currentPage * self.iconsPerPage;
        let endPos = startPos + self.iconsPerPage;

        if (searchinput.length > 0) {
          self.currentPage = 0;

          for (let i = 0; i < masteroptions.length; i++) {
            name = masteroptions[i].toLowerCase();
            if (name.includes(searchinput)) {
              temparray.push(masteroptions[i]);
            }
          }

          returndata = temparray.slice(startPos, endPos);
          self.totalIcons = returndata.length;
          self.maxPages = Math.ceil(returndata.length / this.iconsPerPage);
        } else {
          returndata = this.allIcons.slice(startPos, endPos);
        }
        return returndata;
      },
    },
    methods: {
      shuffle(array) {
        let currentIndex = array.length,
          randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;

          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
      },
      formatIcon(value) {
        if (this.uipress.isObject(value)) {
          this.icon = { ...this.icon, ...value };
        }
      },
      nextPage() {
        this.currentPage = this.currentPage + 1;
      },
      previousPage() {
        this.currentPage = this.currentPage - 1;
      },
      chooseIcon(option) {
        this.icon.value = option;
        this.returnData(this.icon);
      },
    },
    template: `
    
    <div class="uip-w-100p uip-flex uip-gap-xs uip-flex-center">
        <dropdown pos="left center" class="">
            <template v-slot:trigger>
                
                <div class="uip-border-rounder uip-text-l uip-flex uip-icon uip-padding-xxxs uip-text-center uip-link-default uip-background-muted">
                
                    <span v-if="icon.value" class="uip-icon">{{icon.value}}</span>
                    <span class="uip-icon">add</span>
                
                </div>
                
            </template>
            <template v-slot:content>
              <div class="uip-min-w-200 uip-padding-s uip-flex uip-row-gap-s uip-flex-column">
                
                <div class="">
                  <div class="uip-flex  uip-search-block uip-border-round ">
                    <span class="uip-icon uip-text-muted uip-margin-right-xs uip-text-l uip-icon uip-icon-medium" >search</span>
                    <input class="uip-blank-input uip-flex-grow uip-text-s" type="search" :placeholder="strings.searchIcons" v-model="searchString" autofocus="">
                  </div>
                </div>
                
                
                <div class="uip-flex uip-flex-wrap uip-flex-start uip-gap-xs uip-row-gap-xs uip-padding-bottom-remove" style="font-size:14px;max-width:290px;min-width:290px">
                  <template v-for="option in iconsPaged">
                   <span :title="option" class="uip-icon uip-icon-medium uip-text-xl hover:uip-background-muted uip-padding-xxxs uip-border-round hover:uip-background-grey uip-cursor-pointer uip-flex-no-grow uip-max-w-30 uip-overflow-hidden uip-link-default" @click="chooseIcon(option)">
                     {{option}}
                   </span>
                  </template>
                </div>
                
                <div class="uip-flex uip-flex-between uip-flex-right">
                  <div class="uip-flex uip-gap-xs" v-if="totalIcons > iconsPerPage">
                    <button class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs" @click="previousPage()" type="button">chevron_left</button>
                    <button class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs" @click="nextPage()" type="button">chevron_right</button>
                  </div>
                </div>
                
              </div>
            </template>
        </dropdown>
        
        <input type="text" class="uip-input-small uip-w-100p" v-model="icon.value">
        
        <div v-if="icon.value" class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted" @click="icon.value = ''">
        
            <span class="uip-icon">close</span>
        
        </div>
      </div>
      
      `,
  };
}
