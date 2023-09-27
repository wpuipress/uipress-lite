const { __, _x, _n, _nx } = wp.i18n;

export class uip {
  constructor(enviroment) {
    this.getRequiredVars();
    this.uipBlocks = [];
    this.activeLink = '';
    this.windowWidth = window.innerWidth;
    this.uipAppData = {
      translations: this.uipTranslations,
      options: this.uipOptions,
      blocks: [],
      templateDarkMode: false,
      darkMode: false,
      userPrefs: this.userPrefs,
      adminMenu: this.adminmenu,
      toolbar: this.toolbar,
    };
    this.modalResolve;
    if (enviroment) {
      this.enviroment = enviroment;
    }

    this.attachWidthListener();
  }

  /**
   *Watches for width changes to the window.
   * @since 3.0.0
   */
  attachWidthListener() {
    let self = this;
    window.addEventListener('resize', function () {
      self.windowWidth = window.innerWidth;
    });
  }
  /**
   *Defines uipress vars for app. These are output from PHP. On occasion they may not exist so this function will create blank ones when this happens
   * @since 3.0.0
   */
  getRequiredVars() {
    if (typeof uipMasterMenu == 'undefined') {
      const uipMasterMenu = { menu: [] };
      this.adminmenu = uipMasterMenu;
    } else {
      this.adminmenu = uipMasterMenu;
    }
    if (typeof uipMasterToolbar == 'undefined') {
      const uipMasterToolbar = [];
      this.toolbar = uipMasterToolbar;
    } else {
      this.toolbar = uipMasterToolbar;
    }

    this.uipOptions = uip_ajax.uipAppData.options;
    this.userPrefs = uip_ajax.uipAppData.userPrefs;
  }

  /**
   * Parses data and converts specific true false values to Boolean
   * @since 3.0.0
   */
  uipParsJson(data) {
    return JSON.parse(data, (k, v) => (v === 'uiptrue' ? true : v === 'uipfalse' ? false : v === 'uipblank' ? '' : v));
  }

  /**
   * Parses data and converts specific true false values to Boolean
   * @since 3.0.0
   */
  uipEncodeJson(data) {
    return JSON.stringify(data, (k, v) => (v === 'true' ? 'uiptrue' : v === true ? 'uiptrue' : v === 'false' ? 'uipfalse' : v === false ? 'uipfalse' : v === '' ? 'uipblank' : v));
  }
  /**
   * Main fetch action for the app
   * @since 3.0.0
   */
  async callServer(url, data, suppressMessages) {
    const self = this;
    const myHeaders = new Headers();
    //data.length.toString()
    myHeaders.append('Content-Length', 0);

    return fetch(url, {
      method: 'POST',
      headers: myHeaders,
      body: data,
    })
      .then((res) => res.text())
      .then((data) => {
        try {
          let parsedData = self.uipParsJson(data);
          if (!parsedData) {
            return { error: true, message: __('Bad request', 'uipress-lite') };
          }
          return parsedData;
        } catch (error) {
          if (!suppressMessages) {
            self.notify(__('Parse error', 'uipress-lite'), __('Unable to parse JSON response', 'uipress-lite'), 'error');
            return error;
          } else {
            return true;
          }
        }
      })
      .catch((err) => {
        if (!suppressMessages) {
          self.notify(err, '', 'error');

          return err;
        } else {
          return true;
        }
      });
  }

  /**
   * Registers new block for ui builder
   * @since 3.0.0
   * Accepts array
   */
  register_new_blocks(args) {
    wp.hooks.addFilter('uip-register-blocks', 'child', function (blocklist) {
      for (let newBlock of args) {
        //Check if we have already registered a block with the same module name
        let index = blocklist.find((block) => block.moduleName === newBlock.moduleName);

        if (!index) {
          blocklist.push(newBlock);
        }
      }
      return blocklist;
    });
  }

  /**
   * Waits for the array filter to finish and returns found object
   * @since 3.0.0
   * Accepts array
   */
  async searchForBlock(data, needle) {
    let self = this;
    let searchList = data.map(async (block) => {
      let status = await self.findBYuid(block, needle);
      if (this.isObject(status)) {
        return status;
      } else {
        return false;
      }
    });
    return Promise.all(searchList).then((completed) => {
      if (Array.isArray(completed)) {
        let found = false;
        for (const response of completed) {
          if (this.isObject(response)) {
            found = response;
          }
        }
        return found;
      }
      if (this.isObject(completed)) {
        return completed;
      }
      return false;
    });
  }
  /**
   * Filters through array of unspecified amount of objects / arrays and returns when it finds the item with correct uid.
   * @since 3.0.0
   * Accepts array
   */
  async findBYuid(item, needle) {
    let self = this;

    if (item.uid == needle) {
      return item;
    }

    if (item.content) {
      let searchList = item.content.map(async (block) => {
        return await self.findBYuid(block, needle);
      });
      return Promise.all(searchList).then((completed) => {
        let found = false;
        for (const response of completed) {
          if (this.isObject(response)) {
            found = response;
          }
        }
        if (!found) {
          return false;
        } else {
          return found;
        }
      });
    }
    return false;
  }

  /**
   * Gets the current active block id and opens it's parents in the layer panel
   * @since 3.0.0
   * Accepts array
   */
  openTreeViewlayers(data, needle) {
    let self = this;
    let index = 0;

    if (Array.isArray(data)) {
      for (const item of data) {
        if (Array.isArray(item)) {
          self.openTreeViewlayers(item, needle);
        }
        if (item && item.uid && item.uid === needle) {
          item.tabOpen = true;
        } else if (item && item.content && item.content) {
          if (JSON.stringify(item.content).includes(needle)) {
            item.tabOpen = true;
          }
          self.openTreeViewlayers(item.content, needle);
        } else if (typeof item === 'object' && item.constructor === Object) {
          self.openTreeViewlayers(item, needle);
        }
        ++index;
      }
    } else if (data && typeof data === 'object' && data.constructor === Object) {
      for (const key in data) {
        if (data[key] && data[key].uid && data[key].uid === needle) {
          item.tabOpen = true;
        } else if (data[key] && data[key].content) {
          if (JSON.stringify(item.data[key].content).includes(needle)) {
            item.tabOpen = true;
          }
          self.openTreeViewlayers(data[key].content, needle);
        } else {
          self.openTreeViewlayers(data[key], needle);
        }
      }
    }
  }

  /**
   * Filters through array of unspecified amount of objects / arrays and deletes when it finds the item with correct uid.
   * @since 3.0.0
   * Accepts array
   */
  findBYmodnameAndReturn(data, needle, holder) {
    let self = this;
    let index = 0;

    if (Array.isArray(data)) {
      for (const item of data) {
        if (Array.isArray(item)) {
          self.findBYmodnameAndReturn(item, needle, holder);
        }
        if (item && item.moduleName && needle.includes(item.moduleName)) {
          holder.push(item);
        } else if (item && item.content && item.content) {
          self.findBYmodnameAndReturn(item.content, needle, holder);
        } else if (item && typeof item === 'object' && item.constructor === Object) {
          self.findBYmodnameAndReturn(item, needle, holder);
        }
        ++index;
      }
    } else if (data && typeof data === 'object' && data.constructor === Object) {
      for (const key in data) {
        if (data[key] && data[key].moduleName && needle.includes(data[key].moduleName)) {
          holder.push(data[key]);
        } else if (data[key] && data[key].content) {
          self.findBYmodnameAndReturn(data[key].content, needle, holder);
        } else {
          self.findBYmodnameAndReturn(data[key], needle, holder);
        }
      }
    }
  }

  /**
   * Filters through array of unspecified amount of objects / arrays and finds old block settings for formatting
   * @since 3.0.0
   * Accepts array
   */
  findOutdatedBlocks(data, holder) {
    let self = this;
    let index = 0;

    if (Array.isArray(data)) {
      for (const item of data) {
        if (Array.isArray(item)) {
          self.findOutdatedBlocks(item, holder);
        }
        if (this.checkNestedValue(item, ['settings', 'container'])) {
          holder.push(item);
        }
        if (item && item.content && item.content) {
          self.findOutdatedBlocks(item.content, holder);
        } else if (item && typeof item === 'object' && item.constructor === Object) {
          self.findOutdatedBlocks(item, holder);
        }
        ++index;
      }
    } else if (data && typeof data === 'object' && data.constructor === Object) {
      for (const key in data) {
        if (this.checkNestedValue(data[key], ['settings', 'container'])) {
          holder.push(data[key]);
        }
        if (data[key] && data[key].content) {
          self.findOutdatedBlocks(data[key].content, holder);
        } else {
          self.findOutdatedBlocks(data[key], holder);
        }
      }
    }
  }

  /**
   * Deletes post / CPT / page by ID -Does relevant capability checks on the back end.
   * @since 3.0.0
   * Accepts single ID or array
   */
  async deletePost(postID) {
    if (!postID || postID == '') {
      return;
    }

    let files;
    if (Array.isArray(postID)) {
      files = JSON.stringify(postID);
    } else {
      files = JSON.stringify([postID]);
    }

    let self = this;

    return await this.confirm(__('Are you sure?', 'uipress-lite'), __("Are you sure you want to delete this? Once deleted this item can't be recovered"), __('Delete', 'uipress-lite')).then(
      (response) => {
        if (response) {
          let formData = new FormData();
          formData.append('action', 'uip_delete_post');
          formData.append('security', uip_ajax.security);
          formData.append('id', files);

          return self.callServer(uip_ajax.ajax_url, formData).then((response) => {
            if (response.error) {
              self.notify(response.message, 'uipress-lite', '', 'error', true);
              return false;
            }
            if (response.success) {
              self.notify(__('Item deleted', 'uipress-lite'), response.errorCount + ' errors', 'success', true);
              return true;
            }
          });
        } else {
          return false;
        }
      }
    );
  }

  /**
   * Waits for response of function to find and delete block by uid
   * @since 3.0.0
   * Accepts array
   */
  async deleteByUID(data, needle) {
    return await new Promise((resolve) => {
      this.findBYuidAndDelete(data, needle, resolve);
    });
  }

  /**
   * Filters through array of unspecified amount of objects / arrays and deletes when it finds the item with correct uid.
   * @since 3.0.0
   * Accepts array
   */
  async findBYuidAndDelete(data, needle, resolve) {
    let self = this;
    let found = false;
    let index = 0;

    if (Array.isArray(data)) {
      for (const item of data) {
        if (Array.isArray(item)) {
          self.findBYuidAndDelete(item, needle, resolve);
        }

        if (typeof item === 'undefined') {
          continue;
        }

        if (item.uid && item.uid === needle) {
          data.splice(index, 1);
          resolve(true);
        } else if (item.content && item.content) {
          self.findBYuidAndDelete(item.content, needle, resolve);
        } else if (item && typeof item === 'object' && item.constructor === Object) {
          self.findBYuidAndDelete(item, needle, resolve);
        }
        ++index;
      }
    } else if (data && typeof data === 'object' && data.constructor === Object) {
      for (const key in data) {
        if (typeof data[key] === 'undefined') {
          continue;
        }

        if (data[key].uid && data[key].uid === needle) {
          delete data[key];
          resolve(true);
        } else if (data[key].content) {
          self.findBYuidAndDelete(data[key].content, needle, resolve);
        } else {
          self.findBYuidAndDelete(data[key], needle, resolve);
        }
      }
    }
  }

  /**
   * Waits for response of function to find and delete block by uid
   * @since 3.0.0
   * Accepts array
   */
  async getParentByUID(data, needle) {
    return await new Promise((resolve) => {
      this.findBYuidAndGetParent(data, needle, resolve);
    });
  }
  /**
   * Filters through array of unspecified amount of objects / arrays and deletes when it finds the item with correct uid.
   * @since 3.0.0
   * Accepts array
   */
  async findBYuidAndGetParent(data, needle, resolve) {
    let self = this;
    let found = false;

    if (Array.isArray(data)) {
      for (const item of data) {
        if (Array.isArray(item)) {
          self.findBYuidAndDelete(item, needle, resolve);
        }

        if (item.uid && item.uid === needle) {
          //Found - return parent
          resolve(data);
        } else if (item.content && item.content) {
          self.findBYuidAndGetParent(item.content, needle, resolve);
        } else if (item && typeof item === 'object' && item.constructor === Object) {
          self.findBYuidAndGetParent(item, needle, resolve);
        }
      }
    } else if (data && typeof data === 'object' && data.constructor === Object) {
      for (const key in data) {
        if (data[key].uid && data[key].uid === needle) {
          //Found - return parent
          resolve(data);
        } else if (data[key].content) {
          self.findBYuidAndGetParent(data[key].content, needle, resolve);
        } else {
          self.findBYuidAndGetParent(data[key], needle, resolve);
        }
      }
    }
  }

  /**
   * Formats block settings into usable styles / classes
   * @since 3.0.0
   * Accepts array
   */
  explodeBlockSettings(options, type, previewDark, windowWidth) {
    let style = '';
    let self = this;
    let allOptions = this.uipAppData.settings;

    let templateAndAppDark = false;

    if (this.userPrefs.darkTheme) {
      templateAndAppDark = true;
    }

    if (previewDark) {
      templateAndAppDark = true;
    }

    let screenwidth = self.windowWidth;
    if (windowWidth) {
      screenwidth = windowWidth;
    }

    for (let [key, value] of Object.entries(options)) {
      let OGsettingName = options[key].settingName;
      let OGsettingValue = options[key].value;
      let OGsetting = allOptions[OGsettingName];

      //Check if we are exploding the correct style
      if (OGsetting && OGsetting.type == type) {
        if (!typeof OGsettingValue === 'undefined') {
          style += OGsetting.renderStyle(OGsettingValue, screenwidth);
        }

        if ('darkValue' in options[key] && templateAndAppDark) {
          if (!typeof options[key].darkValue === 'undefined') {
            style += OGsetting.renderStyle(options[key].darkValue, screenwidth);
          }
        }
      }
    }

    if (typeof style === undefined) {
      return '';
    }
    return style;
  }

  /**
   * Formats specific block settings into usable styles / classes
   * @since 3.0.0
   * Accepts array
   */
  explodeSpecificBlockSettings(options, type, previewDark, windowWidth, key) {
    let style = '';
    let self = this;
    let allOptions = this.uipAppData.settings;

    if (typeof options[key] === 'undefined') {
      return '';
    }

    let templateAndAppDark = false;

    if (this.userPrefs.darkTheme) {
      templateAndAppDark = true;
    }

    if (previewDark) {
      templateAndAppDark = true;
    }

    let screenwidth = self.windowWidth;
    if (windowWidth) {
      screenwidth = windowWidth;
    }

    let OGsettingName = options[key].settingName;
    let OGsettingValue = options[key].value;
    let OGsetting = allOptions[OGsettingName];

    //Check if we are exploding the correct style
    if (OGsetting && OGsetting.type == type) {
      if (typeof OGsettingValue != 'undefined') {
        style += OGsetting.renderStyle(OGsettingValue, screenwidth);
      }

      if ('darkValue' in options[key] && templateAndAppDark) {
        if (typeof options[key].darkValue != 'undefined') {
          style += OGsetting.renderStyle(options[key].darkValue, screenwidth);
        }
      }
    }

    if (typeof style === undefined) {
      return '';
    }

    return style;
  }

  /**
   * Loops through new data and injects any items one by into to current object to reactivity
   * @since 3.0.0
   * Accepts array
   */
  assignBlockValues(current, newdata) {
    if (typeof newdata === 'undefined') {
      return;
    }

    if (this.isObject(newdata)) {
      for (const property in newdata) {
        let value = newdata[property];

        if (typeof value === 'undefined') {
          continue;
        }

        //Create property in current if it doesn't exist
        if (!(property in current)) {
          current[property] = {};
        }

        if (this.isObject(value)) {
          this.assignBlockValues(current[property], value);
        } else {
          current[property] = value;
        }
      }
    }
    return current;
  }
  /**
   * Explodes all block settings
   * @since 3.0.0
   * Accepts array
   */
  render_block_styles(block, uid, previewDark, windowWidth) {
    //No settings in block
    if (!this.isObject(block)) {
      return false;
    }

    //No settings in block
    if (!this.isObject(block.settings)) {
      return false;
    }

    let self = this;
    let options = block.settings;
    let formattedStyles = '';

    //Get defaults

    //Get dark mode and window width
    let allOptions = this.uipAppData.settings;
    let templateAndAppDark = false;

    if (this.userPrefs.darkTheme) {
      templateAndAppDark = true;
    }

    if (previewDark) {
      templateAndAppDark = true;
    }

    let screenwidth = self.windowWidth;
    if (windowWidth) {
      screenwidth = windowWidth;
    }

    //Loop through settings groups
    for (const groupKey in options) {
      let group = options[groupKey];

      if (!group) {
        continue;
      }

      let selector = '#' + uid;

      //We no longer have a seperate container selector but this is hear to minimise the disruption caused by removing it
      if (groupKey == 'container') {
        selector = '#' + uid;
      }

      //Format selector
      if (group.styleType == 'style') {
        if (group.class) {
          if (group.class != '') {
            selector += ' ' + group.class;
          }
        }
      } else if (group.styleType == 'pseudo') {
        selector += group.class;
      }

      let groupOptions = group.options;
      let preset = this.checkNestedValue(group, ['preset']);
      if (preset) {
        if (preset != '') {
          preset = this.checkNestedValue(this.uipAppData.options, ['block_preset_styles', preset]);
          if (preset && this.isObject(preset)) {
            groupOptions = preset.preset.options;
          }
        }
      }

      let formatted = '';
      formatted = self.render_option_styles(groupOptions, templateAndAppDark, screenwidth, allOptions);

      if (formatted && typeof formatted != undefined && formatted != 'undefined') {
        formattedStyles += selector + '{' + formatted + '}';
      }

      ///Handle Psuedo styles
      let hover = self.render_option_styles(groupOptions, templateAndAppDark, screenwidth, allOptions, ':hover');
      if (hover) {
        formattedStyles += selector + ':hover{' + hover + '}';
      }
      let active = self.render_option_styles(groupOptions, templateAndAppDark, screenwidth, allOptions, ':active');
      if (active) {
        formattedStyles += selector + ':active,' + selector + '[active="true"]{' + active + '}';
      }
      let visited = self.render_option_styles(groupOptions, templateAndAppDark, screenwidth, allOptions, ':visited');
      if (visited) {
        formattedStyles += selector + ':visited{' + visited + '}';
      }
      let focus = self.render_option_styles(groupOptions, templateAndAppDark, screenwidth, allOptions, ':focus');
      if (focus) {
        formattedStyles += selector + ':focus{' + focus + '}';
      }
      let before = self.render_option_styles(groupOptions, templateAndAppDark, screenwidth, allOptions, '::before');
      if (before) {
        let content = '';
        if (group.beforeContent != '' && typeof group.beforeContent != 'undefined') {
          content = `content:'${group.beforeContent}';`;
        }

        formattedStyles += selector + `::before{${before}${content}}`;
      }
      let after = self.render_option_styles(groupOptions, templateAndAppDark, screenwidth, allOptions, '::after');
      if (before) {
        let content = '';
        if (group.afterContent != '' && typeof group.afterContent != 'undefined') {
          content = `content:'${group.afterContent}';`;
        }
        formattedStyles += selector + `::after{${after}${content}}`;
      }
      let menuCollapsed = self.render_option_styles(groupOptions, templateAndAppDark, screenwidth, allOptions, ':menu-collapsed');
      if (menuCollapsed) {
        formattedStyles += `html[uip-menu-collapsed='true'] ${selector} {${menuCollapsed}}`;
      }
      let tabletStyles = self.render_option_styles(groupOptions, templateAndAppDark, screenwidth, allOptions, 'tablet');
      if (tabletStyles) {
        formattedStyles += `.uip-tablet-view ${selector} {${tabletStyles}}`;
      }
      let mobileStyles = self.render_option_styles(groupOptions, templateAndAppDark, screenwidth, allOptions, 'mobile');
      if (mobileStyles) {
        formattedStyles += `.uip-phone-view ${selector} {${mobileStyles}}`;
      }
    }

    return formattedStyles;
  }

  render_option_styles(options, templateAndAppDark, screenwidth, allOptions, psuedo) {
    let style = '';
    for (let [key, value] of Object.entries(options)) {
      if (typeof options[key] === 'undefined') {
        continue;
      }

      let OGsettingName = options[key].settingName;
      let OGsettingValue = options[key].value;
      let OGsetting = allOptions[OGsettingName];

      //Check if we are exploding the correct style
      if (OGsetting && OGsetting.type == 'style') {
        //Get defaults if no key is set
        if (!psuedo) {
          if (typeof OGsettingValue !== 'undefined') {
            let lightStyle = OGsetting.renderStyle(OGsettingValue, screenwidth);
            if (lightStyle && typeof lightStyle != 'undefined') {
              style += lightStyle;
            }
          }

          if ('darkValue' in options[key] && templateAndAppDark) {
            if (typeof options[key].darkValue !== 'undefined') {
              let darkStyle = OGsetting.renderStyle(options[key].darkValue, screenwidth);
              if (darkStyle && typeof darkStyle != 'undefined') {
                style += darkStyle;
              }
            }
          }
        }

        //Get specific psuedo if it's set
        if (psuedo) {
          if ('pseudo' in options[key]) {
            let lightPsuedo = this.checkNestedValue(options[key], ['pseudo', 'light', psuedo]);
            let darkPsuedo = this.checkNestedValue(options[key], ['pseudo', 'dark', psuedo]);

            if (lightPsuedo) {
              let psuedoStyle = OGsetting.renderStyle(lightPsuedo, screenwidth);
              if (psuedoStyle && typeof psuedoStyle != 'undefined') {
                style += psuedoStyle;
              }
            }

            if (darkPsuedo && templateAndAppDark) {
              let psuedoStyle = OGsetting.renderStyle(darkPsuedo, screenwidth);
              if (psuedoStyle && typeof psuedoStyle != 'undefined') {
                style += psuedoStyle;
              }
            }
          }
        }
      }
    }

    if (typeof style === undefined) {
      return '';
    }

    return style;
  }

  /**
   * Checks if given item is object
   * @since 3.0.0
   * Accepts anything
   */
  isObject(obj) {
    if (typeof obj === 'undefined') {
      return false;
    }
    if (obj && typeof obj === 'object' && obj.constructor === Object) {
      return true;
    }
    return false;
  }

  /**
   * Checks if given item is empty object
   * @since 3.0.0
   * Accepts anything
   */
  isEmptyObject(obj) {
    if (obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Creates a unique ID - primarily used for blocks in the ui builder
   * @since 3.0.0
   * Accepts array
   */
  createUID() {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return 'uip-' + S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
  }

  /**
   * Registers global components
   * @since 3.0.6
   * Accepts array
   */
  register_global_components(args) {
    wp.hooks.addFilter('uip-register-global-components', 'child', function (settings) {
      for (let value of args) {
        settings.push = value;
      }
      return settings;
    });
  }

  /**
   * Fires register blocks filter and returns results
   * @since 3.0.0
   */
  loadBlocks() {
    let UIPblocks = [];
    return wp.hooks.applyFilters('uip-register-blocks', UIPblocks);
  }

  /**
   * Registers new settings for blocks for ui builder
   * @since 3.0.0
   * Accepts array
   */
  register_new_block_settings(args) {
    wp.hooks.addFilter('uip-register-block-settings', 'child', function (settings) {
      for (let [key, value] of Object.entries(args)) {
        settings[key] = value;
      }
      return settings;
    });
  }

  /**
   * Fires register block settings filter and returns settings
   * @since 3.0.0
   */
  loadSettings() {
    let UIPsettings = {};
    return wp.hooks.applyFilters('uip-register-block-settings', UIPsettings);
  }

  /**
   * Registers new settings for blocks for ui builder
   * @since 3.0.0
   * Accepts array
   */
  register_new_dynamic_settings(args) {
    wp.hooks.addFilter('uip-register-dynamic-inputs', 'child', function (settings) {
      for (let [key, value] of Object.entries(args)) {
        settings[key] = value;
      }
      return settings;
    });
  }

  /**
   * Fires register block settings filter and returns settings
   * @since 3.0.0
   */
  loadDynamics() {
    let UIPsettings = {};
    return wp.hooks.applyFilters('uip-register-dynamic-inputs', UIPsettings);
  }

  /**
   * Registers new block settings groups for the builder
   * @since 3.0.0
   * Accepts array
   */
  register_new_block_groups(args) {
    wp.hooks.addFilter('uip-register-block-groups', 'child', function (settings) {
      for (let [key, value] of Object.entries(args)) {
        settings[key] = value;
      }
      return settings;
    });
  }

  /**
   * Registers new template setting groups for the builder
   * @since 3.0.0
   * Accepts array
   */
  register_new_template_groups(args) {
    wp.hooks.addFilter('uip-register-template-settings-groups', 'child', function (settings) {
      for (let [key, value] of Object.entries(args)) {
        settings[key] = value;
      }
      return settings;
    });
  }

  /**
   * Registers new settings for the template settings groups
   * @since 3.0.3
   * Accepts array
   */
  register_new_template_groups_options(args) {
    wp.hooks.addFilter('uip-register-template-settings-groups-options', 'child', function (settings) {
      for (let value of args) {
        settings.push(value);
      }
      return settings;
    });
  }

  /**
   * Registers new global setting groups for the builder
   * @since 3.0.0
   * Accepts array
   */
  register_new_global_groups(args) {
    wp.hooks.addFilter('uip-register-global-settings-groups', 'child', function (settings) {
      for (let [key, value] of Object.entries(args)) {
        settings[key] = value;
      }
      return settings;
    });
  }

  /**
   * Registers new settings for the global settings groups
   * @since 3.0.3
   * Accepts array
   */
  register_new_global_groups_options(args) {
    wp.hooks.addFilter('uip-register-global-settings-groups-options', 'child', function (settings) {
      for (let value of args) {
        settings.push(value);
      }
      return settings;
    });
  }

  /**
   * Fires register template group settings and returns settings object
   * @since 3.0.3
   */
  loadTemplateGroups() {
    let builderGroupsettings = {};
    let groups = wp.hooks.applyFilters('uip-register-template-settings-groups', builderGroupsettings);
    let options = wp.hooks.applyFilters('uip-register-template-settings-groups-options', []);
    for (let [key, value] of Object.entries(groups)) {
      let groupSettings = options.filter((option) => option.group === key);
      groups[key].settings = groupSettings;
    }

    return groups;
  }

  /**
   * Fires register global group settings and returns settings object
   * @since 3.0.3
   */
  loadGlobalGroups() {
    let builderGroupsettings = {};
    let groups = wp.hooks.applyFilters('uip-register-global-settings-groups', builderGroupsettings);
    let options = wp.hooks.applyFilters('uip-register-global-settings-groups-options', []);
    for (let [key, value] of Object.entries(groups)) {
      let groupSettings = options.filter((option) => option.group === key);
      let holder = [];

      for (let opt of groupSettings) {
        if (holder.includes(opt.group + opt.uniqueKey)) {
          continue;
        }

        if (!('settings' in groups[key])) {
          groups[key].settings = [];
        }

        groups[key].settings.push(opt);
        holder.push(opt.group + opt.uniqueKey);
      }
      if (!('settings' in groups[key])) {
        groups[key].settings = [];
      } else {
        groups[key].settings.sort((a, b) => a.order - b.order);
      }
    }

    return this.reverseObject(groups);
  }

  /**
   * Fires register global group settings and returns settings object
   * @since 3.0.3
   */
  reverseObject(obj) {
    let new_obj = {};
    let rev_obj = Object.keys(obj).reverse();
    rev_obj.forEach(function (i) {
      new_obj[i] = obj[i];
    });
    return new_obj;
  }

  /**
   * Fires register template group settings and returns settings onject
   * @since 3.0.3
   */
  loadBlockGroups() {
    let blockgroups = {};
    let groups = wp.hooks.applyFilters('uip-register-block-groups', blockgroups);
    return groups;
  }

  /**
   * Registers new plugins for the builder
   * @since 3.0.3
   * Accepts array
   */
  register_new_builder_plugins(args) {
    wp.hooks.addFilter('uip-register-builder-plugins', 'child', function (settings) {
      for (let value of args) {
        settings.push(value);
      }
      return settings;
    });
  }

  /**
   * Fires register plugins and returns plugins list
   * @since 3.0.3
   */
  loadPlugins() {
    return wp.hooks.applyFilters('uip-register-builder-plugins', []);
  }

  /**
   * Registers new template group options for the ui
   * @since 3.0.0
   * Accepts array
   */
  register_new_theme_styles(args) {
    wp.hooks.addFilter('uip-register-theme-styles', 'child', function (settings) {
      for (let [key, value] of Object.entries(args)) {
        settings[value.name] = value;
      }
      return settings;
    });
  }

  /**
   * Fires register theme styles and returns styles onject
   * @since 3.0.0
   */
  loadThemeStyles() {
    let uiThemes = {};
    return wp.hooks.applyFilters('uip-register-theme-styles', uiThemes);
  }

  /**
   * Dynamically imports and awaits file imports
   * @since 3.0.0
   */
  async dynamicImport(blocks, app) {
    const self = this;
    let registered = [];
    return await Promise.all(
      blocks.map(async (amodule) => {
        if ('path' in amodule) {
          if (!registered.includes(amodule.moduleName)) {
            let theModule = await import(amodule.path + '?ver=' + this.uipAppData.options.uipVersion);
            let activated = await app.component(amodule.moduleName, theModule.moduleData());
            registered.push(amodule.moduleName);
          }
        }
      })
    )
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log(err);
        //self.notify(err, '', 'error', true);
        return true;
      });
  }

  /**
   * Dynamically imports and registers plugins
   * @since 3.0.0
   */
  async importPlugins(plugins, app) {
    return await Promise.all(
      plugins.map(async (amodule) => {
        if ('path' in amodule) {
          let theModule = await import(amodule.path + '?ver=' + this.uipAppData.options.uipVersion);
          await app.component(amodule.component, theModule.moduleData());
        }
      })
    )
      .then(() => {
        return true;
      })
      .catch((err) => {
        //self.notify(err, '', 'error', true);
        return true;
      });
  }

  /**
   * Creates a modal for a custom confirm
   * @since 3.0.0
   */
  async confirm(title, message, confirmButton) {
    let self = this;

    return await new Promise(function (resolve, reject) {
      let uipConfirm = true;
      if (uipConfirm) {
        self.createModal(title, message, confirmButton);
        self.modalResolve = resolve;
      } else {
        resolve(null);
      }
    }).then(function (decision) {
      return decision;
      //addItem(flag);
    });
  }

  /**
   * Global method for updating iframe page
   * @since 3.0.0
   */
  updatePage(newURL, reloadPage) {
    let absoluteCheck = new RegExp('^(?:[a-z+]+:)?//', 'i');

    newURL = newURL.replace(/&amp;/g, '&');
    //Dispatch link change event
    let shortURL = newURL;
    if (absoluteCheck.test(newURL)) {
      if (newURL.includes(this.uipAppData.dynamicOptions.viewadmin.value)) {
        shortURL = newURL.replace(this.uipAppData.dynamicOptions.viewadmin.value, '');
      }
    }

    this.activeLink = shortURL;
    let self = this;
    this.uipActiveLinkChange = new CustomEvent('uip_page_change', { detail: { url: this.stripUIPparams(self.activeLink) } });
    document.dispatchEvent(this.uipActiveLinkChange);

    if (!absoluteCheck.test(newURL)) {
      newURL = this.uipAppData.dynamicOptions.viewadmin.value + newURL;
    }

    let url = new URL(newURL);

    if (typeof UIPdisableUserPages != 'undefined') {
      if (UIPdisableUserPages) {
        if (this.enviroment != 'builder') {
          if (Array.isArray(UIPdisableUserPages)) {
            for (let part of UIPdisableUserPages) {
              if (url.href == part || url.href.includes(part)) {
                window.location.assign(url);
                return;
              }
            }
          }
        }
      }
    }

    if (typeof UIPdisableDynamicLoading != 'undefined') {
      if (UIPdisableDynamicLoading) {
        if (this.enviroment != 'builder') {
          window.location.assign(url);
          return;
        }
      }
    }

    if (typeof UIPfrontEndReload != 'undefined') {
      if (UIPfrontEndReload) {
        if (this.enviroment != 'builder') {
          if (!url.href.includes(this.uipAppData.dynamicOptions.viewadmin.value)) {
            window.location.assign(url);
            return;
          }
        }
      }
    }

    this.forceReload(url);

    //Force a page reload (used for navigation between subsites)
    if (reloadPage) {
      url.searchParams.set('uip-framed-page', 0);
      if (this.enviroment != 'builder') {
        window.location.assign(url);
      }
      return;
    }

    this.uipUpdateFrame = new CustomEvent('uip_update_frame_url', { detail: { url: url } });
    document.dispatchEvent(this.uipUpdateFrame);

    let frames = document.getElementsByClassName('uip-page-content-frame');
    if (!frames[0]) {
      //There is no iframe to update so we are going to refresh the page manually
      if (this.enviroment != 'builder') {
        window.location.assign(url);
      }
    }
  }

  /**
   * Checks whether the current screen is incompatible with uipress frames and reloads the whole page
   * @since 3.0.92
   */
  forceReload(url) {
    //bricks
    if (url.searchParams.get('bricks')) {
      if (url.searchParams.get('bricks') == 'run') {
        window.location.assign(url);
        return;
      }
    }
    //motion.page
    if (url.searchParams.get('page')) {
      if (url.searchParams.get('page') == 'motionpage') {
        url.searchParams.set('uip-framed-page', 1);
        window.location.assign(url);
        return;
      }
    }
    //Elementor
    if (url.searchParams.get('action')) {
      if (url.searchParams.get('action') == 'elementor') {
        url.searchParams.set('uip-framed-page', 1);
        window.location.assign(url);
        return;
      }
    }
    if (url.searchParams.get('page')) {
      if (url.searchParams.get('page') == 'elementor-app') {
        url.searchParams.set('uip-framed-page', 1);
        window.location.assign(url);
        return;
      }
    }
    //Breakdance
    if (url.searchParams.get('breakdance')) {
      if (url.searchParams.get('breakdance') == 'builder') {
        url.searchParams.set('uip-framed-page', 1);
        window.location.assign(url);
        return;
      }
    }
    //Oxygen
    if (url.searchParams.get('ct_builder')) {
      if (url.searchParams.get('ct_builder') == 'true') {
        url.searchParams.set('uip-framed-page', 1);
        window.location.assign(url);
        return;
      }
    }
    //Piotnet forms
    if (url.searchParams.get('page')) {
      if (url.searchParams.get('page') == 'piotnetforms' && url.searchParams.get('post')) {
        url.searchParams.set('uip-framed-page', 1);
        window.location.assign(url);
        return;
      }
    }
    //Zion builder
    if (url.searchParams.get('action')) {
      if (url.searchParams.get('action') == 'zion_builder_active') {
        url.searchParams.set('uip-framed-page', 1);
        window.location.assign(url);
        return;
      }
    }

    //Divi builder
    if (url.searchParams.get('et_fb')) {
      if (url.searchParams.get('et_fb') == '1') {
        url.searchParams.set('uip-framed-page', 1);
        window.location.assign(url);
        return;
      }
    }
  }

  stripUIPparams(link) {
    let absoluteCheck = new RegExp('^(?:[a-z+]+:)?//', 'i');

    let url = '';
    if (!absoluteCheck.test(link)) {
      url = new URL(this.uipAppData.dynamicOptions.viewadmin.value + link);
    } else {
      url = new URL(link);
    }

    url.searchParams.delete('uip-framed-page', 1);
    url.searchParams.delete('uip-hide-screen-options', 1);
    url.searchParams.delete('uip-hide-help-tab', 1);
    url.searchParams.delete('uip-default-theme', 1);
    url.searchParams.delete('uip-hide-notices', 1);
    url.searchParams.delete('uipid', 1);

    return url.href.replace(this.uipAppData.dynamicOptions.viewadmin.value, '');
  }

  /**
   * Updates active link without changing page
   * @since 3.0.0
   */
  updateActiveLink(newURL) {
    let absoluteCheck = new RegExp('^(?:[a-z+]+:)?//', 'i');

    //Dispatch link change event
    let shortURL = newURL;
    let fullURL = newURL;
    if (absoluteCheck.test(newURL)) {
      if (newURL.includes(this.uipAppData.dynamicOptions.viewadmin.value)) {
        shortURL = newURL.replace(this.uipAppData.dynamicOptions.viewadmin.value, '');
      }
    } else {
      fullURL = this.uipAppData.dynamicOptions.viewadmin.value + newURL;
    }

    fullURL = fullURL.replace('about:blank', '');
    shortURL = shortURL.replace('about:blank', '');

    this.activeLink = shortURL;
    let self = this;

    if (self.activeLink == this.uipActiveLinkChange) {
      return;
    }

    let url = new URL(fullURL);
    url.searchParams.delete('uip-framed-page', 1);
    url.searchParams.delete('uip-hide-screen-options', 1);
    url.searchParams.delete('uip-hide-help-tab', 1);
    url.searchParams.delete('uip-default-theme', 1);
    url.searchParams.delete('uip-hide-notices', 1);
    url.searchParams.delete('uipid', 1);

    this.forceReload(url);

    //Only update window history if we are in production
    if (this.enviroment != 'builder') {
      //history.pushState({}, null, url);
    }

    this.uipActiveLinkChange = new CustomEvent('uip_page_change', { detail: { url: this.stripUIPparams(self.activeLink) } });
    document.dispatchEvent(this.uipActiveLinkChange);
  }

  /**
   * Recursively goes over template and sends content for housekeeping
   * @since 3.0.0
   */
  async cleanTemplate(content) {
    let self = this;
    let freshList = content.map(async (block) => {
      return await self.blockHouseKeeping(block);
    });
    return Promise.all(freshList).then((completed) => {
      return completed;
    });
  }
  /**
   * Cleans blocs and content for uinessecary params
   * @since 3.0.0
   */
  async blockHouseKeeping(block) {
    let self = this;
    if ('category' in block) {
      delete block.category;
    }
    if ('description' in block) {
      delete block.description;
    }
    if ('optionsEnabled' in block) {
      delete block.optionsEnabled;
    }
    if ('path' in block) {
      delete block.path;
    }
    if ('tabOpen' in block) {
      delete block.tabOpen;
    }

    //Clean out args from options
    if ('settings' in block) {
      for (let property in block.settings) {
        let optionGroups = block.settings[property].options;

        for (let optname in optionGroups) {
          if ('args' in optionGroups[optname]) {
            delete optionGroups[optname].args;
          }
        }
      }
    }
    if ('content' in block) {
      let newList = block.content.map(async (block) => {
        return await self.blockHouseKeeping(block);
      });
      return Promise.all(newList).then((completed) => {
        return block;
      });
    } else {
      return block;
    }
  }

  /**
   * Recursively goes over template and checks for required fields. Used for validating imported templates & patterns
   * @since 3.0.0
   */
  async validDateTemplate(content, keepUID) {
    let self = this;

    let freshList = content.map(async (block) => {
      return await self.validateBlock(block, keepUID);
    });

    return Promise.all(freshList).then((completed) => {
      return completed;
    });
  }
  /**
   * Validates a block from an imported template
   * @since 3.0.0
   */
  async validateBlock(block, keepUID) {
    let self = this;
    if (!('name' in block)) {
      return false;
    }
    if (!('moduleName' in block)) {
      return false;
    }
    if (!('settings' in block)) {
      return false;
    }

    //Update UID to avoid duplicates
    if (!keepUID) {
      block.uid = this.createUID();
    }

    if ('content' in block) {
      let newList = block.content.map(async (block) => {
        return await self.validateBlock(block, keepUID);
      });
      return Promise.all(newList).then((completed) => {
        if (completed.includes(false)) {
          return false;
        } else {
          return true;
        }
      });
    } else {
      return true;
    }
  }

  /**
   * Save user preference
   * @since 3.0.0
   */
  async saveUserPreference(key, value, notification) {
    let formData = new FormData();
    let self = this;
    if (value == true) {
      value = 'uiptrue';
    }
    if (value == false) {
      value = 'uipfalse';
    }

    value = this.uipEncodeJson(value);
    formData.append('action', 'uip_save_user_preference');
    formData.append('security', uip_ajax.security);
    formData.append('key', key);
    formData.append('value', value);

    return await self.callServer(uip_ajax.ajax_url, formData).then((response) => {
      if (response.error) {
        self.notify(response.message, '', 'error', true);
        return false;
      } else {
        if (notification) {
          self.notify(__('Preference updated', 'uipress-lite'), '', 'success', true);
        }
        //success
        return true;
      }
    });
  }

  /**
   * Save user preference
   * @since 3.0.0
   */
  async getUserPreference(key) {
    let formData = new FormData();
    let self = this;
    formData.append('action', 'uip_get_user_preference');
    formData.append('security', uip_ajax.security);
    formData.append('key', key);

    return await self.callServer(uip_ajax.ajax_url, formData).then((response) => {
      if (response.error) {
        self.notify(response.message, '', 'error', true);
        return false;
      } else {
        //success
        return response.value;
      }
    });
  }

  /**
   * Builds the modal dom object
   * @since 3.0.0
   */
  createModal(title, message, confirmButton) {
    let self = this;
    if (!confirmButton || confirmButton == '') {
      confirmButton = __('Yes', 'uipress-lite');
    }
    let modal =
      '<div class="uip-position-fixed uip-top-0 uip-left-0 uip-h-viewport uip-w-vw uip-background-black-wash uip-flex uip-flex-center uip-flex-middle uip-fade-in uip-text-normal uip-z-index-9999" tabindex="1" id="uip-modal-confirm">\
    <div class="uip-background-default uip-border uip-padding-m uip-flex uip-flex-column uip-row-gap-s uip-scale-in uip-min-w-350 uip-z-index-9999" style="border-radius: calc(var(--uip-border-radius-large) + var(--uip-padding-xs));">\
      <div class="uip-text-bold uip-text-l uip-text-emphasis">' +
      title +
      '</div>\
      <div class="uip-text-muted uip-max-w-300">' +
      message +
      '</div>\
      <div class="uip-flex uip-gap-xs">\
        <button id="uip-confirm-cancel" class="uip-button-default uip-flex uip-gap-xxs uip-flex-center">' +
      '<span>' +
      __('Cancel', 'uipress-lite') +
      '</span>\
      <span class="uip-text-s uip-text-muted uip-border uip-border-round" style="padding:1px;">\
      esc\
      </span>\
      </button>\
        <button id="uip-confirm-yes" class="uip-button-primary uip-flex uip-gap-xxs uip-flex-center">' +
      '<span>' +
      confirmButton +
      '</span>\
          <span class="uip-icon uip-border uip-border-round" >\
          keyboard_return\
          </span>\
      </button>\
      </div>\
    </div>';

    let elem = document.createElement('div');
    elem.innerHTML = modal;
    elem.setAttribute('tabindex', '1');
    elem.classList.add('uip-z-index-9999');
    elem.classList.add('uip-position-relative');
    let domModal = document.body.appendChild(elem);
    domModal.focus();

    let keyHandler = function (e) {
      if (e.key === 'Enter') {
        self.modalResolve(true);
        this.removeEventListener('keydown', keyHandler);
        domModal.remove();
      }
      if (e.key === 'Escape') {
        self.modalResolve(false);
        this.removeEventListener('keydown', keyHandler);
        domModal.remove();
      }
    };
    domModal.addEventListener('keydown', keyHandler);

    //Attache event listeners
    document.getElementById('uip-confirm-cancel').addEventListener('click', function () {
      self.modalResolve(false);
      domModal.remove();
    });
    document.getElementById('uip-confirm-yes').addEventListener('click', function () {
      self.modalResolve(true);
      domModal.remove();
    });
  }
  /**
   * Creates toast like notifications
   * Types: 'error', 'default', 'success', 'warning'
   * @since 3.0.0
   */
  notify(title, message, type, dismissible, loader) {
    let classer = 'uip-default';
    let icon = 'info';
    if (type) {
      classer = 'uip-' + type;
      if (type == 'success') {
        icon = 'done';
      }
      if (type == 'error') {
        icon = 'close';
      }
      if (type == 'warning') {
        icon = 'priority_high';
      }
    }

    if (type) {
    }

    let notiArea = document.getElementById('notification-drop');
    if (!notiArea) {
      notiArea = document.createElement('div');
      notiArea.setAttribute('id', 'notification-drop');
      notiArea.setAttribute('class', 'notification-drop uip-dark-mode');
      document.body.appendChild(notiArea);
    }

    let content = `
    <div class="uip-flex uip-gap-s uip-flex-center">
      <div class="uip-border-rounder uip-notification-status uip-flex uip-flex-middle uip-padding-xxxs uip-flex-center">
        <span class="uip-icon uip-text-inverse uip-text-center">${icon}</span>
      </div>
      <div class="uip-flex-grow uip-column-gap-xs">
        <div class="uip-text-emphasis uip-text-inverse">${title}</div>
        <div class="uip-text-s uip-text-muted uip-max-w-500">${message}</div>
      </div>`;

    if (loader == true) {
      content += `
      <div class="uip-position-relative" >
        <span class="uip-load-spinner" ></span>
      </div>
    `;
    }

    if (dismissible != false) {
      content += `
        <div class="uip-icon uip-link-muted uip-background-default uip-padding-xxs uip-border-rounder" onclick="this.closest('.uip-notification').remove();">close</div>
        `;
    }

    content += `</div>`;

    let elemDiv = document.createElement('div');
    let uid = this.createUID();
    elemDiv.setAttribute('id', uid);
    elemDiv.classList.add('uip-notification');
    elemDiv.classList.add('uip-border');
    elemDiv.classList.add('uip-slide-in-left');
    elemDiv.classList.add(classer);
    elemDiv.innerHTML = content;
    notiArea.appendChild(elemDiv);
    if (dismissible != false) {
      setTimeout(function () {
        elemDiv.style.transition = '0.6s';
        elemDiv.style.opacity = 0;

        setTimeout(function () {
          elemDiv.remove();
        }, 600);
      }, 8000);
    }

    return uid;
  }

  /**
   * Deletes notification by id
   * Types: 'error', 'default', 'success', 'warning'
   * @since 3.0.0
   */
  destroy_notification(notificationID) {
    if (document.getElementById(notificationID)) {
      document.getElementById(notificationID).remove();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Gets a block setting
   * @since 3.0.0
   */
  get_block_option(block, group, key, process) {
    let self = this;

    if (!(group in block.settings)) {
      return false;
    }
    if (!('options' in block.settings[group])) {
      return false;
    }

    let optionGroup = block.settings[group].options;
    let value = false;
    if (key in optionGroup) {
      if ('value' in optionGroup[key]) {
        value = optionGroup[key].value;

        if (typeof value === 'undefined') {
          return false;
        }

        //If process wasn't set, return the full value
        if (!process) {
          if (this.isObject(value)) {
            if (Object.keys(value).length === 0) {
              return false;
            }
          }
          return value;
        }
        //Dynamic text
        if (optionGroup[key].value.dynamic && optionGroup[key].value.dynamicType == 'text') {
          let dynkey = optionGroup[key].value.dynamicKey;
          let pos = optionGroup[key].value.dynamicPos;

          if (self.uipOptions.dynamicData[dynkey]) {
            let dynValue = self.uipOptions.dynamicData[dynkey].value;

            let userinput = '';
            if (typeof value.string !== 'undefined') {
              userinput = value.string;
            }
            if (pos == 'left') {
              value = dynValue + userinput;
            } else if (pos == 'right') {
              value = userinput + dynValue;
            } else {
              value = dynValue + userinput;
            }
          }
        }
        //Dynamic Links
        if (optionGroup[key].value.dynamic && optionGroup[key].value.dynamicType == 'link') {
          let dynkey = optionGroup[key].value.dynamicKey;

          if (self.uipOptions.dynamicData[dynkey]) {
            let dynValue = self.uipOptions.dynamicData[dynkey].value;
            return dynValue;
          }
        }
        //Dynamic Images
        if (optionGroup[key].value.dynamic && optionGroup[key].value.dynamicType == 'img') {
          let dynkey = optionGroup[key].value.dynamicKey;

          if (self.uipOptions.dynamicData[dynkey]) {
            let dynValue = self.uipOptions.dynamicData[dynkey].value;
            return dynValue;
          }
        }
      }
    }

    if (typeof value === 'undefined') {
      value = false;
    }

    return value;
  }

  /**
   * Takes settings enabled from registered block and builds a functional settings object
   * @since 3.0.0
   */
  inject_block_presets(block, currentSettings) {
    let self = this;
    let optionsEnabled = block.optionsEnabled;
    let allOptions = this.uipAppData.settings;

    for (var i = 0; i < optionsEnabled.length; i++) {
      let group = optionsEnabled[i];

      let groupOptions = group.options;

      self.format_block_presets(groupOptions, currentSettings, group);
    }
    delete block.optionsEnabled;
    return currentSettings;
  }

  /**
   * Formats an individual block option and injects set values
   * Types: 'error', 'default', 'success', 'warning'
   * @since 3.0.0
   */
  async format_block_presets(optionsEnabled, currentSettings, group) {
    let self = this;
    let allOptions = this.uipAppData.settings;
    let settings = {};

    //Loop through options enabled
    for (var i = 0; i < optionsEnabled.length; i++) {
      //Pull group options
      let optionKey = group.name;

      if (!(i in optionsEnabled)) {
        continue;
      }

      if (!optionsEnabled[i]) {
        continue;
      }

      let moduleName = optionsEnabled[i].option;
      let help = optionsEnabled[i].help;

      let label = optionsEnabled[i].label;

      let uniqueKey = optionsEnabled[i].option;
      if ('uniqueKey' in optionsEnabled[i]) {
        uniqueKey = optionsEnabled[i].uniqueKey;
      }

      //Check for current settings
      if (!currentSettings[optionKey]) {
        currentSettings[optionKey] = {};
      }

      //Check for current setting values
      if (!currentSettings[optionKey].options) {
        currentSettings[optionKey].options = {};
      }

      //Check for current setting values
      if (!currentSettings[optionKey].options[uniqueKey]) {
        currentSettings[optionKey].options[uniqueKey] = {};
      }

      //Option mod doesn't exist
      if (!(moduleName in allOptions)) {
        currentSettings[optionKey].options[uniqueKey].component = moduleName;
        currentSettings[optionKey].options[uniqueKey].label = label;
        continue;
      }

      let actualModule = allOptions.moduleName;

      //Check if value was set in options Enabled for light value
      if (!('value' in currentSettings[optionKey].options[uniqueKey])) {
        if ('value' in optionsEnabled[i]) {
          currentSettings[optionKey].options[uniqueKey].value = JSON.parse(JSON.stringify(optionsEnabled[i].value));
        }
      }

      //Check if value was set in options Enabled for dark value
      if (!('darkValue' in currentSettings[optionKey].options[uniqueKey])) {
        if ('darkValue' in optionsEnabled[i]) {
          currentSettings[optionKey].options[uniqueKey].darkValue = JSON.parse(JSON.stringify(optionsEnabled[i].darkValue));
        }
      }

      //Inject defaults if nothing has been set
      if (!('value' in currentSettings[optionKey].options[uniqueKey])) {
        currentSettings[optionKey].options[uniqueKey].value = structuredClone(allOptions[moduleName].value);
      }
      if (!('darkValue' in currentSettings[optionKey].options[uniqueKey])) {
        if ('darkValue' in allOptions[moduleName]) {
          currentSettings[optionKey].options[uniqueKey].darkValue = structuredClone(allOptions[moduleName].darkValue);
        }
      }
      currentSettings[optionKey].styleType = group.styleType;
      currentSettings[optionKey].class = group.class;
      currentSettings[optionKey].options[uniqueKey].settingName = moduleName;
      if (help) {
        currentSettings[optionKey].options[uniqueKey].help = help;
      }
      currentSettings[optionKey].name = group.name;
    }

    return true;
  }

  /**
   * Formats an individual block option and injects set values
   * Types: 'error', 'default', 'success', 'warning'
   * @since 3.0.0
   */
  async format_block_option(group, currentSettings, formattedOptions) {
    let self = this;
    let allOptions = self.uipAppData.settings;
    let optionsEnabled = group.options;

    let settings = {};
    //Loop through options enabled
    for (var i = 0; i < optionsEnabled.length; i++) {
      //Pull group options
      let optionKey = group.name;

      if (!(i in optionsEnabled)) {
        continue;
      }

      if (!optionsEnabled[i]) {
        continue;
      }

      let moduleName = optionsEnabled[i].option;
      let label = optionsEnabled[i].label;
      let help = optionsEnabled[i].help;

      let uniqueKey = optionsEnabled[i].option;
      if ('uniqueKey' in optionsEnabled[i]) {
        uniqueKey = optionsEnabled[i].uniqueKey;
      }

      //Check for current settings
      if (!formattedOptions[optionKey]) {
        formattedOptions[optionKey] = {};
      }

      //Check for current setting values
      if (!formattedOptions[optionKey].options) {
        formattedOptions[optionKey].options = {};
      }

      //Check for current setting values
      if (!formattedOptions[optionKey].options[uniqueKey]) {
        formattedOptions[optionKey].options[uniqueKey] = {};
      }

      //Option mod doesn't exist
      if (!(moduleName in allOptions)) {
        formattedOptions[optionKey].options[uniqueKey].component = moduleName;
        formattedOptions[optionKey].options[uniqueKey].label = label;
        continue;
      }

      let actualModule = allOptions.moduleName;

      //Inject pseudo values already set by user
      if (uniqueKey in currentSettings.options) {
        if ('pseudo' in currentSettings.options[uniqueKey]) {
          let pseudo = currentSettings.options[uniqueKey].pseudo;
          if (typeof pseudo !== 'undefined') {
            formattedOptions[optionKey].options[uniqueKey].pseudo = JSON.parse(JSON.stringify(pseudo));
          }
        }
      }

      //Inject light values already set by user
      if (uniqueKey in currentSettings.options) {
        if ('value' in currentSettings.options[uniqueKey]) {
          let lightValue = currentSettings.options[uniqueKey].value;
          if (typeof lightValue !== 'undefined') {
            formattedOptions[optionKey].options[uniqueKey].value = JSON.parse(JSON.stringify(lightValue));
          }
        }
      } else {
        //Check if value was set in options Enabled
        if ('value' in optionsEnabled[i]) {
          formattedOptions[optionKey].options[uniqueKey].value = JSON.parse(JSON.stringify(optionsEnabled[i].value));
        }
      }

      //Inject dark values already set by users
      if (uniqueKey in currentSettings.options) {
        if ('darkValue' in currentSettings.options[uniqueKey]) {
          let darkValue = currentSettings.options[uniqueKey].darkValue;
          if (typeof darkValue !== 'undefined') {
            formattedOptions[optionKey].options[uniqueKey].darkValue = JSON.parse(JSON.stringify(currentSettings.options[uniqueKey].darkValue));
          }
        }
      } else {
        //Check if value was set in options Enabled
        if ('darkValue' in optionsEnabled[i]) {
          formattedOptions[optionKey].options[uniqueKey].darkValue = JSON.parse(JSON.stringify(optionsEnabled[i].darkValue));
        }
      }

      if ('dark' in allOptions[moduleName]) {
        formattedOptions[optionKey].options[uniqueKey].dark = structuredClone(allOptions[moduleName].dark);
      }

      //Check for args and push them
      if ('args' in allOptions[moduleName]) {
        formattedOptions[optionKey].options[uniqueKey].args = structuredClone(allOptions[moduleName].args);
      }
      if ('args' in optionsEnabled[i]) {
        formattedOptions[optionKey].options[uniqueKey].args = optionsEnabled[i].args;
      }

      formattedOptions[optionKey].label = group.label;
      formattedOptions[optionKey].icon = group.icon;
      formattedOptions[optionKey].name = group.name;
      formattedOptions[optionKey].styleType = group.styleType;
      formattedOptions[optionKey].class = group.class;
      formattedOptions[optionKey].options[uniqueKey].settingName = moduleName;
      formattedOptions[optionKey].options[uniqueKey].component = allOptions[moduleName].component;
      formattedOptions[optionKey].options[uniqueKey].label = label;

      if (help) {
        formattedOptions[optionKey].options[uniqueKey].help = help;
      }

      if ('beforeContent' in currentSettings) {
        formattedOptions[optionKey].beforeContent = currentSettings.beforeContent;
      }
      if ('afterContent' in currentSettings) {
        formattedOptions[optionKey].afterContent = currentSettings.afterContent;
      }
      if ('preset' in currentSettings) {
        formattedOptions[optionKey].preset = currentSettings.preset;
      }
    }
    return formattedOptions;
  }

  /**
   * Formats an individual block option and injects set values
   * Types: 'error', 'default', 'success', 'warning'
   * @since 3.0.0
   */
  async format_block_option_old(optionsEnabled, currentSettings, group) {
    let self = this;
    let allOptions = this.uipAppData.settings;
    let settings = {};
    //Loop through options enabled
    for (var i = 0; i < optionsEnabled.length; i++) {
      //Pull group options
      let optionKey = group.name;

      let moduleName = optionsEnabled[i].option;
      let label = optionsEnabled[i].label;

      let uniqueKey = optionsEnabled[i].option;
      if ('uniqueKey' in optionsEnabled[i]) {
        uniqueKey = optionsEnabled[i].uniqueKey;
      }

      //Check for current settings
      if (!currentSettings[optionKey]) {
        currentSettings[optionKey] = {};
      }

      //Check for current setting values
      if (!currentSettings[optionKey].options) {
        currentSettings[optionKey].options = {};
      }

      //Check for current setting values
      if (!currentSettings[optionKey].options[uniqueKey]) {
        currentSettings[optionKey].options[uniqueKey] = {};
      }

      //Option mod doesn't exist
      if (!(moduleName in allOptions)) {
        currentSettings[optionKey].options[uniqueKey].component = moduleName;
        currentSettings[optionKey].options[uniqueKey].label = label;
        continue;
      }

      let actualModule = allOptions.moduleName;

      //Check if value was set in options Enabled
      if (!('value' in currentSettings[optionKey].options[uniqueKey])) {
        if ('value' in optionsEnabled[i]) {
          currentSettings[optionKey].options[uniqueKey].value = JSON.parse(JSON.stringify(optionsEnabled[i].value));
        }
      }

      //Check if value was set in options Enabled
      if (!('darkValue' in currentSettings[optionKey].options[uniqueKey])) {
        if ('darkValue' in optionsEnabled[i]) {
          currentSettings[optionKey].options[uniqueKey].darkValue = JSON.parse(JSON.stringify(optionsEnabled[i].darkValue));
        }
      }

      //Inject defaults if nothing has been set
      if (!('value' in currentSettings[optionKey].options[uniqueKey])) {
        currentSettings[optionKey].options[uniqueKey].value = structuredClone(allOptions[moduleName].value);
      }
      if (!('darkValue' in currentSettings[optionKey].options[uniqueKey])) {
        if ('darkValue' in allOptions[moduleName]) {
          currentSettings[optionKey].options[uniqueKey].darkValue = structuredClone(allOptions[moduleName].darkValue);
        }
      }
      if ('dark' in allOptions[moduleName]) {
        currentSettings[optionKey].options[uniqueKey].dark = structuredClone(allOptions[moduleName].dark);
      }

      //Check for args and push them
      if ('args' in allOptions[moduleName]) {
        currentSettings[optionKey].options[uniqueKey].args = structuredClone(allOptions[moduleName].args);
      }
      if ('args' in optionsEnabled[i]) {
        currentSettings[optionKey].options[uniqueKey].args = optionsEnabled[i].args;
      }

      currentSettings[optionKey].label = group.label;
      currentSettings[optionKey].icon = group.icon;
      currentSettings[optionKey].name = group.name;
      currentSettings[optionKey].styleType = group.styleType;
      currentSettings[optionKey].class = group.class;
      currentSettings[optionKey].options[uniqueKey].settingName = moduleName;
      currentSettings[optionKey].options[uniqueKey].component = allOptions[moduleName].component;
      currentSettings[optionKey].options[uniqueKey].label = label;
    }
    return currentSettings;
  }

  /**
   * Formats a key chain into a visible shortcut
   * Types: 'error', 'default', 'success', 'warning'
   * @since 3.0.0
   */
  renderKeyShortCut(keys) {
    const shortcutKeys = [
      'Enter', // Enter
      ' ', // Space
      'ArrowLeft', // Left Arrow
      'ArrowUp', // Up Arrow
      'ArrowRight', // Right Arrow
      'ArrowDown', // Down Arrow
    ];
    const shortcutKeysIcons = [
      { key: 'Enter', icon: 'keyboard_return' }, // Enter
      { key: ' ', icon: 'space_bar' }, // Space
      { key: 'ArrowLeft', icon: 'keyboard_arrow_left' }, // Left Arrow
      { key: 'ArrowUp', icon: 'keyboard_arrow_up' }, // Up Arrow
      { key: 'ArrowRight', icon: 'keyboard_arrow_right' }, // Right Arrow
      { key: 'ArrowDown', icon: 'keyboard_arrow_down' }, // Down Arrow
    ];

    let format = '';

    for (let key of keys) {
      if (key == 'Meta') {
        format += '<span class="uip-command-icon uip-text-muted"></span>';
      } else if (key == 'Alt') {
        format += '<span class="uip-alt-icon uip-text-muted"></span>';
      } else if (key == 'Shift') {
        format += '<span class="uip-shift-icon uip-text-muted"></span>';
      } else if (key == 'Control') {
        format += '<span class="uip-icon uip-text-muted">keyboard_control_key</span>';
      } else if (key == 'Backspace') {
        format += '<span class="uip-icon uip-text-muted">backspace</span>';
      } else if (shortcutKeys.includes(key)) {
        let keyicon = shortcutKeysIcons.find((x) => x.key == key);
        format += `<span class="uip-icon uip-text-muted">${keyicon.icon}</span>`;
      } else {
        format += `<span class="uip-text-muted uip-text-uppercase" style="line-height: 16px;font-size: 11px;">${key}</span>`;
      }
    }

    return format;
  }

  /**
   * Helper classes for checking deep nested values
   * @since 3.0.0
   */

  checkNestedValue(option, values) {
    let holder = option;

    for (const nest of values) {
      if (!this.isObject(holder)) {
        return false;
      }

      if (holder[nest]) {
        holder = holder[nest];
      } else {
        return false;
      }
    }

    return holder;
  }

  /**
   * Helper classes for checking deep nested values
   * @since 3.0.0
   */

  createNestedObject(option, values) {
    for (const nest of values) {
      option = option[nest] = option[nest] || {};
    }

    return option;
  }

  /**
   * Helper classes that updates blocks to work with the new builder changes introduced in v3.1.2
   * @since 3.1.2
   */

  async updateBlocksV312(template) {
    if (!Array.isArray(template)) {
      return [];
    }

    return await this.processBlockListUpdate(template);
  }

  async processBlockListUpdate(blocks) {
    if (!Array.isArray(blocks)) {
      return;
    }
    let newBlocks = [];
    for (const block of blocks) {
      let temp = await this.updateSingleBlockV312(block);

      //if ('content' in temp) {
      //temp.content = await this.processBlockListUpdate(temp.content);
      //}

      newBlocks.push(temp);
    }
    return newBlocks;
  }

  async updateSingleBlockV312(block) {
    //If there is no container block then we don't need to update the block because it's new
    if (!this.checkNestedValue(block, ['settings', 'container'])) {
      return block;
    }

    if (block.moduleName == 'uip-container') {
      //Remove container width if set
      let containerWidth = this.checkNestedValue(block, ['settings', 'container', 'options', 'dimensions', 'value', 'width']);
      let styleWidth = this.checkNestedValue(block, ['settings', 'style', 'options', 'dimensions', 'value', 'width']);
      if (containerWidth) {
        if (!containerWidth.value) {
          this.createNestedObject(block, ['settings', 'style', 'options', 'dimensions', 'value', 'width']);
          block.settings.style.options.dimensions.value.width = {
            value: ' ',
            units: 'auto',
          };
        } else {
          this.createNestedObject(block, ['settings', 'style', 'options', 'dimensions', 'value', 'width']);
          block.settings.style.options.dimensions.value.width = containerWidth;
        }
      }
    }

    //update flex options
    let settings = this.checkNestedValue(block, ['settings', 'block', 'options']);
    let flexSettings = {};

    //Check if block has flex settings applied already
    if (this.isObject(settings)) {
      //alignItems
      let flexAlign = this.checkNestedValue(settings, ['flexAlignItems', 'value']);
      if (flexAlign) {
        delete block.settings.block.options.flexAlignItems;
        if (this.isObject(flexAlign)) {
          flexAlign = flexAlign.value;
        } else {
          flexAlign = flexAlign;
        }
        if (flexAlign) {
          if (flexAlign == 'left') {
            flexSettings.align = 'flex-start';
          } else {
            flexSettings.align = flexAlign;
          }
        }
      }

      //flexDirection
      let flexDirection = this.checkNestedValue(settings, ['flexDirection', 'value']);
      if (flexDirection) {
        delete block.settings.block.options.flexDirection;
        if (this.isObject(flexDirection)) {
          flexSettings.direction = flexDirection.value;
        } else {
          flexSettings.direction = flexDirection;
        }
        if (flexSettings.direction == 'left') {
          flexSettings.direction = 'row';
        }
      }

      //Gap
      let flexGapSet = false;
      let flexGap = this.checkNestedValue(settings, ['columnGap', 'value']);
      if (flexGap) {
        if (this.isObject(flexGap)) {
          if (flexGap.value != 0 && flexGap.value != '' && typeof flexGap.value != 'undefined') {
            flexSettings.gap = {
              value: flexGap.value,
              units: flexGap.units,
            };
            flexGapSet = true;
          }
        }

        delete block.settings.block.options.columnGap;
      }

      let rowGap = this.checkNestedValue(settings, ['rowGap', 'value']);
      if (rowGap && !flexGapSet) {
        if (this.isObject(rowGap)) {
          if (rowGap.value != 0 && rowGap.value != '' && typeof rowGap.value != 'undefined') {
            flexSettings.gap = {
              value: rowGap.value,
              units: rowGap.units,
            };
          }
        }

        delete block.settings.block.options.rowGap;
      }

      //flexDirection
      let flexJustifyContent = this.checkNestedValue(settings, ['flexJustifyContent', 'value']);
      if (flexJustifyContent) {
        if (this.isObject(flexJustifyContent)) {
          flexJustifyContent = flexJustifyContent.value;
        }
        if (flexJustifyContent) {
          if (flexJustifyContent == 'left') {
            flexSettings.distribute = 'start';
          }
          if (flexJustifyContent == 'right') {
            flexSettings.distribute = 'end';
          }
          if (flexJustifyContent == 'center') {
            flexSettings.distribute = 'center';
          }
          if (flexJustifyContent == 'spaceAround') {
            flexSettings.distribute = 'space-around';
          }
          if (flexJustifyContent == 'spaceBetween') {
            flexSettings.distribute = 'space-between';
          }
          if (flexJustifyContent == 'spaceEvenly') {
            flexSettings.distribute = 'space-evenly';
          }
        }
      }

      //Flexwrap
      let flexWrap = this.checkNestedValue(block, ['settings', 'block', 'options', 'flexWrap', 'value', 'value']);
      if (flexWrap) {
        if (flexWrap == 'noWrap') {
          flexWrap = flexWrap.toLowerCase();
        }
        flexSettings.wrap = flexWrap;
      }

      flexSettings.type = 'stack';

      this.createNestedObject(block, ['settings', 'style', 'options', 'flexLayout']);
      block.settings.style.options.flexLayout = {
        value: flexSettings,
        settingName: 'flexLayout',
      };
      block.settings.style.options.flexLayout.settingName = 'flexLayout';
    }

    if (settings) {
      delete block.settings.block.options.flexAlignItems;
      delete block.settings.block.options.flexAlignSelf;
      delete block.settings.block.options.flexJustifyContent;
      delete block.settings.block.options.flexWrap;
    }

    //Move container options
    let flexGrow = this.checkNestedValue(block, ['settings', 'container', 'options', 'flexGrow', 'value', 'value']);
    let overflow = this.checkNestedValue(block, ['settings', 'container', 'options', 'overFlow', 'value']);
    let horizontalAlign = this.checkNestedValue(block, ['settings', 'container', 'options', 'horizontalAlign', 'value', 'value']);
    let verticalAlign = this.checkNestedValue(block, ['settings', 'container', 'options', 'verticalAlign', 'value', 'value']);
    let currentDimensions = this.checkNestedValue(block, ['settings', 'style', 'options', 'dimensions', 'value']);

    if (!this.isObject(currentDimensions)) {
      currentDimensions = {};
    }
    if (flexGrow == 'grow') {
      currentDimensions.grow = 'grow';
    }

    this.createNestedObject(block, ['settings', 'style', 'options', 'dimensions', 'value']);
    block.settings.style.options.dimensions.value = { ...block.settings.style.options.dimensions.value, ...currentDimensions };

    if (overflow) {
      this.createNestedObject(block, ['settings', 'style', 'options', 'styles', 'value', 'overflow']);
      block.settings.style.options.styles.value.overflow = overflow;
    }

    if (horizontalAlign) {
      this.createNestedObject(block, ['settings', 'style', 'options', 'positionDesigner', 'value', 'horizontalAlign']);
      block.settings.style.options.positionDesigner.value.horizontalAlign = horizontalAlign;
    }

    if (verticalAlign) {
      this.createNestedObject(block, ['settings', 'style', 'options', 'positionDesigner', 'value', 'verticalAlign']);
      block.settings.style.options.positionDesigner.value.verticalAlign = verticalAlign;
    }

    delete block.settings.container;

    for (const [key, value] of Object.entries(block.settings)) {
      //these settings do not need to be updated / changed
      if (key == 'advanced' || key == 'block' || key == 'container') {
        continue;
      }

      //Block parts
      let padding = this.checkNestedValue(block, ['settings', key, 'options', 'padding', 'value']);
      let margin = this.checkNestedValue(block, ['settings', key, 'options', 'margin', 'value']);
      let backgroundColor = this.checkNestedValue(block, ['settings', key, 'options', 'colorSelect', 'value']);
      let border = this.checkNestedValue(block, ['settings', key, 'options', 'border', 'value']);
      let shadow = this.checkNestedValue(block, ['settings', key, 'options', 'shadow', 'value']);
      let backgroundImage = this.checkNestedValue(block, ['settings', key, 'options', 'imageSelect', 'value']);
      let backgroundPosition = this.checkNestedValue(block, ['settings', key, 'options', 'backgroundPosition', 'value']);

      if (this.isObject(padding)) {
        this.createNestedObject(block, ['settings', key, 'options', 'spacing', 'value', 'padding']);

        if (padding.preset == 'remove') padding.preset = '0';
        if (padding.preset == 'small') padding.preset = 'S';
        if (padding.preset == 'medium') padding.preset = 'M';
        if (padding.preset == 'large') padding.preset = 'L';
        if (padding.preset == 'xlarge') padding.preset = 'XL';

        block.settings[key].options.spacing.value.padding = padding;
        delete block.settings[key].options.padding;
      }
      if (this.isObject(margin)) {
        this.createNestedObject(block, ['settings', key, 'options', 'spacing', 'value', 'margin']);

        if (margin.preset == 'remove') margin.preset = '0';
        if (margin.preset == 'small') margin.preset = 'S';
        if (margin.preset == 'medium') margin.preset = 'M';
        if (margin.preset == 'large') margin.preset = 'L';
        if (margin.preset == 'xlarge') margin.preset = 'XL';

        block.settings[key].options.spacing.value.margin = margin;
        delete block.settings[key].options.margin;
      }
      if (backgroundColor) {
        this.createNestedObject(block, ['settings', key, 'options', 'styles', 'value', 'fill']);
        block.settings[key].options.styles.value.fill = backgroundColor;
        delete block.settings[key].options.colorSelect;
      }
      if (border) {
        this.createNestedObject(block, ['settings', key, 'options', 'styles', 'value', 'borders']);
        block.settings[key].options.styles.value.borders = [border];
        delete block.settings[key].options.border;
      }
      if (shadow) {
        this.createNestedObject(block, ['settings', key, 'options', 'styles', 'value', 'shadows']);
        block.settings[key].options.styles.value.shadows = [shadow];
        delete block.settings[key].options.shadow;
      }
      if (backgroundImage) {
        this.createNestedObject(block, ['settings', key, 'options', 'styles', 'value', 'backgroundImage']);
        block.settings[key].options.styles.value.backgroundImage = backgroundImage;
        delete block.settings[key].options.imageSelect;
      }
      if (backgroundPosition) {
        this.createNestedObject(block, ['settings', key, 'options', 'styles', 'value', 'backgroundImage', 'sizing']);
        block.settings[key].options.styles.value.backgroundImage.sizing = backgroundPosition;
        delete block.settings[key].options.backgroundPosition;
      }

      //Set option names
      this.createNestedObject(block, ['settings', key, 'options', 'styles', 'settingName']);
      block.settings[key].options.styles.settingName = 'styles';

      this.createNestedObject(block, ['settings', key, 'options', 'spacing', 'settingName']);
      block.settings[key].options.spacing.settingName = 'spacing';
    }

    return block;
  }

  /**
   * Helper classes for block options
   * @since 3.0.0
   */

  returnDefaultOptions(hasContent, fullwidth, presets) {
    let options = [];

    if (hasContent) {
      let flexer = { option: 'flexLayout', label: __('Layout', 'uipress-lite') };
      if (presets) {
        if ('flexLayout' in presets) {
          flexer.value = presets.flexLayout;
        }
      }
      options.push(flexer);
    }
    if (fullwidth) {
      options.push({
        option: 'dimensions',
        label: __('Size', 'uipress-lite'),
        value: {
          width: {
            value: '100',
            units: '%',
          },
        },
      });
    } else {
      options.push({
        option: 'dimensions',
        label: __('Size', 'uipress-lite'),
      });
    }

    let styles = { option: 'styles', label: __('Style', 'uipress-lite') };
    if (presets) {
      if ('styles' in presets) {
        styles.value = presets.styles;
      }
    }
    options.push(styles);

    let spacing = { option: 'spacing', label: __('Spacing', 'uipress-lite') };
    if (presets) {
      if ('spacing' in presets) {
        spacing.value = presets.spacing;
      }
    }
    options.push(spacing);

    options.push({ option: 'textFormat', label: __('Text', 'uipress-lite') });
    options.push({ option: 'positionDesigner', label: __('Position', 'uipress-lite') });
    options.push({ option: 'effectsDesigner', label: __('Effects', 'uipress-lite') });

    return options;
  }

  returnBlockConatinerOptions() {
    return [
      { option: 'verticalAlign', label: __('Vertical align', 'uipress-lite') },
      { option: 'horizontalAlign', label: __('Horizontal align', 'uipress-lite') },
      { option: 'flexGrow', label: __('Grow or shrink', 'uipress-lite'), value: { value: 'none' } },
      {
        option: 'stretchDirection',
        label: __('Stretch direction', 'uipress-lite'),
        value: { value: 'none' },
      },
      { option: 'dimensions', label: __('Container dimensions', 'uipress-lite') },
      { option: 'overFlow', label: __('Overflow', 'uipress-lite') },
    ];
  }

  returnFlexOptions() {
    return [
      { option: 'flexJustifyContent', label: __('Justify content', 'uipress-lite') },
      { option: 'flexAlignItems', label: __('Align content', 'uipress-lite') },
      { option: 'flexDirection', label: __('Content direction', 'uipress-lite') },
      { option: 'flexWrap', label: __('Content wrap', 'uipress-lite') },
      { option: 'columnGap', label: __('Column gap', 'uipress-lite') },
      { option: 'rowGap', label: __('Row gap', 'uipress-lite') },
    ];
  }
  returnAdvancedOptions() {
    return [
      { option: 'classes', label: __('Classes', 'uipress-lite') },
      {
        option: 'conditions',
        label: __('Conditions', 'uipress-lite'),
        help: __('Conditions allow you to control who sees this block. If all conditions are not met then this block will not be loaded for the user.', 'uipress-lite'),
      },
      {
        option: 'customCode',
        uniqueKey: 'css',
        label: __('css', 'uipress-lite'),
        args: {
          language: 'css',
        },
      },
      {
        option: 'customCode',
        uniqueKey: 'js',
        label: __('JavaScript', 'uipress-lite'),
        args: {
          language: 'javascript',
        },
      },
    ];
  }
}
