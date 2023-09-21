const { __, _x, _n, _nx } = wp.i18n;
import { uip } from './uip.min.js';
const uipress = new uip('production');
import { createApp, getCurrentInstance, defineComponent } from './../../libs/vue-esm-dev.js';
import * as uipMediaBrowser from '../classes/uip-media-browser.js';
import * as uipTooltip from '../modules/uip-tooltip.min.js';
import * as uipDropdown from '../modules/uip-dropdown.min.js';
import * as uipLoader from '../modules/uip-loading-chart.min.js';

export class uipMediaLibrary {
  constructor(args) {
    this.args = args;
    this.container = false;
    this.events = [];
    this.mainApp = false;
  }
  /**
   * Main function that creates the media library
   * @since 3.0.0
   */
  create() {
    if (this.args.style == 'modal') {
      this.createContainer();
      this.mountApp('#uip-media-library');
      this.eventListeners();
    }
    if (this.args.style == 'inline') {
      if (!this.args.mount) {
        uipress.notify(__('Unable to mount', 'uipress-lite'), __('No element provided to mount to', 'uipress-lite'), 'error');
        return;
      }

      if (this.isElement(this.args.mount)) {
        this.container = this.args.mount;
      } else {
        let items = document.querySelector(this.args.mount);
        if (!items[0]) {
          uipress.notify(__('Unable to mount', 'uipress-lite'), __('No elements found for sleector', 'uipress-lite'), 'error');
          return;
        }
      }
      this.mountApp(this.args.mount);
      this.eventListeners();
    }
  }
  /**
   * Checks if mount is dom element or selector
   * @since 3.0.0
   */

  isElement(element) {
    return element instanceof Element || element instanceof HTMLDocument;
  }
  /**
   * Listens to library events
   * @since 3.0.0
   */
  eventListeners() {
    let self = this;

    //Called when library is close or an item is picked
    function removeLibrary(event) {
      self.destroyLibrary(event, self.container);
    }

    if (this.args.useType != 'browse') {
      document.addEventListener('uip_remove_media_gallery', removeLibrary);
      //document.addEventListener('uip_media_selected', removeLibrary);
    }
  }

  /**
   * Destroys library instance
   * @since 3.0.0
   */
  destroyLibrary(evt, container) {
    let self = this;
    for (let key in this.events) {
      let eventItem = self.events[key];
      document.removeEventListener(eventItem.event, eventItem.func);
    }
    this.mainApp.unmount();
    if (this.args.style != 'inline') {
      this.container.remove();
    }
  }

  on(event, userFunc) {
    this.events.push({ event: event, func: userFunc });
    document.addEventListener(event, userFunc);
  }
  /**
   * When started in modal style, create the modal container
   * @since 3.0.0
   */
  createContainer() {
    let container =
      '\
	  <div class="uip-position-fixed uip-top-0 uip-left-0 uip-h-viewport uip-w-vw uip-background-black-wash uip-flex uip-flex-center uip-flex-middle uip-fade-in" style="z-index:10">\
		  <div class="uip-background-default uip-border-round uip-border uip-padding-s uip-flex uip-flex-column uip-row-gap-xs uip-scale-in uip-min-w-350">\
		    <div id="uip-media-library"></div>\
		  </div>\
	  </div>';

    let elem = document.createElement('div');
    elem.innerHTML = container;
    this.container = document.body.appendChild(elem);
  }

  /**
   * Mounds the media library on the given selector
   * @since 3.0.0
   */
  mountApp(selector) {
    let self = this;

    const uipMediaArgs = {
      data() {
        return {
          args: self.args,
        };
      },
      provide() {
        return {
          uipress: uipress,
        };
      },
      template: '<media-browser :args="args"></media-browser>',
    };

    const uipMediaApp = createApp(uipMediaArgs);
    uipMediaApp.config.errorHandler = function (err, vm, info) {
      uipress.notify(err, '', 'error');
      console.log(err);
    };

    uipMediaApp.component('media-browser', uipMediaBrowser.moduleData());
    uipMediaApp.component('uip-tooltip', uipTooltip.moduleData());
    uipMediaApp.component('uip-loader', uipLoader.moduleData());
    uipMediaApp.component('drop-down', uipDropdown);

    uipMediaApp.mount(selector);

    this.mainApp = uipMediaApp;
  }
}
