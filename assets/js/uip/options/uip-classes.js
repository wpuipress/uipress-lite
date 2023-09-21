export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: String,
      placeHolder: String,
      args: Object,
      size: String,
    },
    inject: ['uipData', 'uipress'],
    data: function () {
      return {
        option: this.value,
        userInput: '',
        selected: [],
        rendered: false,
        search: '',
        allRules: [],
        strings: {
          manualPlaceHolder: __('Enter classes seperated by a space', 'uipress-lite'),
          searchClasses: __('Search classess', 'uipress-lite'),
        },
      };
    },
    watch: {
      option: {
        handler(newValue, oldValue) {
          this.returnData(this.option);

          if (!this.args) {
            return;
          }
        },
        deep: true,
      },
      userInput: {
        handler(newValue, oldValue) {
          if (!newValue || !this.rendered) return;
          if (!newValue.includes(' ')) return;
          let parts = newValue.split(' ');
          for (const userClass of parts) {
            if (userClass) {
              this.selected.push(userClass);
            }
          }
          this.userInput = '';
        },
      },
      selected: {
        handler(newValue, oldValue) {
          this.returnData(this.selected.join(' '));
        },
        deep: true,
      },
    },
    created: function () {
      if (!this.option || !this.option.includes(' ')) {
        if (this.option != '') {
          this.selected.push(this.option);
        }
        this.rendered = true;
        this.getClassNames();
        return;
      }
      let parts = this.option.split(' ');
      for (const userClass of parts) {
        if (userClass) {
          this.selected.push(userClass);
        }
      }
      this.rendered = true;

      this.getClassNames();
    },
    computed: {
      allClasses() {
        return this.allRules;
      },
    },
    methods: {
      submiteNewClass(evt) {
        let newValue = this.userInput;

        if (!newValue || !this.rendered) return;
        if (!newValue.includes(' ')) {
          this.selected.push(newValue);
          this.userInput = '';
          return;
        }
        let parts = newValue.split(' ');
        for (const userClass of parts) {
          if (userClass) {
            this.selected.push(userClass);
          }
        }
        this.userInput = '';
      },
      getClassNames() {
        let tempRules = [];
        let sSheetList = document.styleSheets;
        for (let sSheet = 0; sSheet < sSheetList.length; sSheet++) {
          let ruleList = {};
          try {
            ruleList = document.styleSheets[sSheet].cssRules;
          } catch (err) {
            continue;
          }
          for (let rule in ruleList) {
            let selector = ruleList[rule].selectorText;
            if (!selector) continue;
            if (
              selector.includes('::') ||
              selector.includes(' ') ||
              selector.includes('[') ||
              selector.includes('>') ||
              selector.includes(':') ||
              selector.includes('~') ||
              selector.includes('#') ||
              !selector.includes('.')
            ) {
              continue;
            }

            if (selector[0] != '.') continue;

            let className = selector.replace('.', '');
            if (className.includes('.')) continue;
            tempRules.push(className);
          }
        }

        tempRules.sort();
        let userClasses = this.uipData.options.customClasses;
        if (userClasses) {
          if (Array.isArray(userClasses)) {
            userClasses.sort();
            tempRules = [].concat(userClasses, tempRules);
          }
        }
        this.allRules = [...new Set(tempRules)];
      },
      removeSelected(index) {
        this.selected.splice(index, 1);
      },
      inSearch(className) {
        if (!this.search) return true;

        let lc = className.toLowerCase();
        let slc = this.search.toLowerCase();

        if (lc.includes(slc)) {
          return true;
        }

        return false;
      },
    },
    template: `
    <div class="uip-flex uip-flex-column uip-gap-xs uip-w-100p">
      <div class="uip-flex uip-gap-xxs uip-w-100p uip-flex-wrap">
      
        <dropdown pos="left center">
          <template v-slot:trigger>
            <div class="uip-button-default uip-border-rounder uip-icon uip-padding-xxs uip-link-muted">search</div>
          </template>
          
          <template v-slot:content>
          
            <div class="uip-padding-xs uip-flex uip-flex-column uip-row-gap-xs">
            
              <input type="text" class="uip-input uip-input-small" autofocus v-model="search" :placeholder="strings.searchClasses">
              
              <div class="uip-flex uip-flex-column uip-row-gap-xxxs uip-max-h-400 uip-overflow-auto uip-padding-xxs">
              
                <template v-for="className in allClasses">
                  <div  v-if="inSearch(className)" class="uip-link-muted uip-flex-between uip-flex uip-padding-xxxs uip-border-rounder hover:uip-background-muted uip-flex-center"
                  @click="selected.push(className)">
                    <div class="">{{className}}</div>
                    <div class="uip-icon">add</div>
                  </div>
                </template>
              
              </div>
              
            </div>
          
          </template>
        </dropdown>
        
        
        <input type="text" class="uip-input-small uip-flex-grow" v-model="userInput" @keyup.enter.prevent="submiteNewClass($event)" :placeholder="strings.manualPlaceHolder">
        
      </div>  
        
      <div class="uip-flex uip-gap-xxs uip-w-100p uip-flex-wrap">  
        <template v-for="(item, index) in selected">
          <div class="uip-padding-left-xxs uip-padding-right-xxs uip-background-muted uip-border-rounder hover:uip-background-grey uip-flex uip-gap-xxs uip-flex-center">
            <span class="uip-text-s">{{item}}</span>
            <a class="uip-link-muted uip-no-underline uip-icon" @click="removeSelected(index)">close</a>
          </div>
        </template>
      </div>
        
      </div>
    `,
  };
}
