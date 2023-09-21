const { __, _x, _n, _nx } = wp.i18n;
import { uipMediaLibrary } from '../classes/uip-media-library.min.js';
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
        loading: true,
        hasPositioning: true,
        img: {
          url: '',
          dynamic: false,
          dynamicKey: '',
          loading: false,
          sizing: {},
        },
        dynamics: this.uipData.dynamicOptions,
        maxUpload: this.uipData.options.maxUpload,
        fileTypes: this.uipData.options.uploadTypes,
        fileType: '',
        manualURL: '',
        uploading: false,
        strings: {
          dynamicData: __('Dynamic data', 'uipress-lite'),
          currentValue: __('Current value', 'uipress-lite'),
          select: __('select', 'uipress-lite'),
          dataPos: __('Dynamic data position', 'uipress-lite'),
          replace: __('Replace', 'uipress-lite'),
          edit: __('Edit', 'uipress-lite'),
          upload: __('Upload', 'uipress-lite'),
          uploading: __('Uploading', 'uipress-lite'),
          library: __('Library', 'uipress-lite'),
          dynamic: __('Dynamic', 'uipress-lite'),
          chooseImage: __('Add image', 'uipress-lite'),
          backgroundImage: __('Image', 'uipress-lite'),
          addImage: __('Add image', 'uipress-lite'),
          url: __('URL', 'uipress-lite'),
        },
      };
    },
    inject: ['uipData', 'uipress'],
    watch: {
      img: {
        handler(newValue, oldValue) {
          this.returnData(this.img);
        },
        deep: true,
      },
      manualURL: {
        handler(newValue, oldValue) {
          if (newValue != '') {
            this.removeDynamicItem();
            this.img.url = newValue;
          }
        },
      },
    },
    mounted: function () {
      this.formatInput(this.value);

      if (this.args) {
        if (this.uipress.isObject(this.args)) {
          if ('hasPositioning' in this.args) {
            this.hasPositioning = this.args.hasPositioning;
          }
        }
      }
    },
    computed: {
      returnValue() {
        return this.value;
      },
      imgReset() {
        return {
          url: '',
          dynamic: false,
          dynamicKey: '',
          loading: false,
          sizing: {},
        };
      },
    },
    methods: {
      formatInput(value) {
        if (typeof value === 'undefined') {
          return;
        }
        if (this.uipress.isObject(value)) {
          this.img = { ...this.img, ...this.returnValue };
          return;
        }
      },
      chooseImage(theOption) {
        let self = this;
        let args = {
          multiple: false,
          style: 'modal',
          features: ['stock', 'upload', 'delete'],
          fileTypes: ['image/*'],
        };
        let imageEditor = new uipMediaLibrary(args);
        imageEditor.create();

        imageEditor.on('uip_media_selected', function (evt) {
          if (evt.detail.files) {
            self.removeDynamicItem();
            self.img.url = evt.detail.files.url;
          }
        });
      },
      chooseItem(item) {
        this.img.dynamic = true;
        this.img.dynamicType = 'img';
        this.img.dynamicKey = item.key;
        this.img.url = item.value;

        this.returnData({ url: this.img.value, dynamic: this.img.dynamic, dynamicKey: this.img.dynamicKey, dynamicPos: this.img.dynamicPos });
      },
      removeDynamicItem() {
        this.img.dynamic = false;
        this.img.dynamicKey = '';
        this.img.url = '';

        this.returnData({ url: this.img.value, dynamic: this.img.dynamic, dynamicKey: this.img.dynamicKey, dynamicPos: this.img.dynamicPos });
      },
      get_url_extension(url) {
        return url.split(/[#?]/)[0].split('.').pop().trim();
      },
      getFileTypeFromUrl(url) {
        let self = this;
        if (!url || url == '') {
          self.fileType = '';
          return;
        }

        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);

        xhr.onreadystatechange = function () {
          // Wait for header to become available.
          let contentType = xhr.getResponseHeader('Content-Type');
          if (contentType) {
            // Stop downloading, the headers are all we need.
            xhr.abort();
            self.fileType = contentType;
          }
        };

        xhr.send();
      },
      recieveDynamic(data) {
        this.img.dynamic = true;
        this.img.dynamicKey = data.key;
        this.img.dynamicType = 'img';
        this.img.url = data.value;

        this.returnData({ url: this.img.value, dynamic: this.img.dynamic, dynamicKey: this.img.dynamicKey, dynamicPos: this.img.dynamicPos });
      },
      uploadImage() {
        let self = this;
        let notiID = self.uipress.notify(__('Uploading image', 'uipress-lite'), '', 'default', false, true);
        self.uploading = true;

        let fileInput = document.getElementById('uip-image-upload');
        let thefile = fileInput.files[0];

        //fileTypes
        if (!this.fileTypes.includes(thefile.type)) {
          self.uipress.notify(__('Unable to upload this file type', 'uipress-lite'), '', 'error', true, false);
          self.uipress.destroy_notification(notiID);
          self.uploading = false;
          return;
        }

        if (thefile.size > self.maxUpload) {
          self.uipress.notify(__('Image exceeds max upload size', 'uipress-lite'), '', 'error', true, false);
          self.uipress.destroy_notification(notiID);
          self.uploading = false;
          return;
        }

        let formData = new FormData();
        formData.append('action', 'uip_upload_image');
        formData.append('security', uip_ajax.security);
        formData.append('image', thefile);
        formData.append('file', thefile);

        fetch(uip_ajax.ajax_url, {
          method: 'POST',
          body: formData,
          ContentType: false,
          processData: false,
          headers: {
            'processData': false,
            'process-Data': false,
          },
        })
          .then((res) => res.text())
          .then((data) => {
            let response = self.uipress.uipParsJson(data);
            if (response.success) {
              self.removeDynamicItem();
              self.img.url = response.url;
              self.uipress.destroy_notification(notiID);
              self.uipress.notify(__('Image uploaded', 'uipress-lite'), '', 'success', true, false);
              self.uploading = false;
            } else {
              self.uipress.notify(__('Unable to handle upload', 'uipress-lite'), '', 'error', true, false);
              self.uploading = false;
            }
          })
          .catch((err) => {
            self.uipress.notify(err, '', 'error');
            self.uipress.destroy_notification(notiID);
            self.uploading = false;
          });
      },
      returnBackgroundImage() {
        let img = this.img.url;
        if (img) {
          return `background-image: url(${img})`;
        }
        return '';
      },
    },
    template: `
      <div class="uip-w-100p uip-flex uip-gap-xs">
      
        <dropdown pos="left center" triggerClass="uip-flex uip-flex-grow uip-w-100p" containerClass="uip-flex uip-flex-grow uip-w-100p" :dontAnimate="true">
          <template v-slot:trigger>
            <div class="uip-background-muted uip-border-rounder uip-padding-xxs uip-flex uip-gap-xs uip-w-100p">
              <div class="uip-border uip-border-round uip-w-18 uip-ratio-1-1 uip-flex uip-background-cover" :style="returnBackgroundImage()"></div>
              <div class="uip-text-capitalize">
                <div v-if="img.url" class="uip-overflow-hidden uip-no-wrap uip-text-ellipsis uip-max-w-100 uip-flex-no-grow uip-text-lowercase">{{img.url}}</div>
                <div v-else class="uip-text-muted">{{strings.addImage}}...</div>
              </div>
            </div>
          </template>
          <template v-slot:content>
            <div class="uip-padding-s uip-border-bottom uip-text-bold">
              {{strings.backgroundImage}}
            </div>
            <div class="uip-padding-s uip-flex uip-flex-column uip-row-gap-s">
              
              <div class="uip-background-muted uip-border-rounder uip-flex uip-flex-center uip-flex-middle uip-position-relative uip-scale-in-center uip-h-120 uip-w-240 uip-background-contain uip-background-no-repeat  uip-background-center" :style="returnBackgroundImage()">
                
                <dropdown pos="bottom left">
                  <template v-slot:trigger>
                  
                  <div class="uip-button-default">
                    <div v-if="img.url" class="uip-link-default uip-text-bold">{{strings.replace}}</div>
                    <div v-if="!img.url" class="uip-flex uip-gap-xxs uip-flex-center">
                      <div class="uip-icon uip-icon-medium">add</div>
                      <div class="uip-link-default uip-text-bold">{{strings.chooseImage}}</div>
                    </div>
                  </div>  
                  </template>
                  <template v-slot:content>
                    <div class="uip-padding-xs uip-flex uip-flex-column uip-row-gap-xxs uip-w-100 uip-overflow-hidden">
                      <label class="">
                        <div class="uip-flex uip-flex-row uip-gap-xs uip-link-default uip-flex-center">
                          <div v-if="!uploading" class="uip-icon uip-text-l uip-icon-medium">file_upload</div>
                          <div v-if="uploading" class="uip-load-spinner-dark"></div>
                          <div v-if="!uploading" class="">{{strings.upload}}</div>
                          <div v-if="uploading" class="">{{strings.uploading}}</div>
                        </div>
                        <input hidden :accept="fileTypes.toString()" type="file" single="" id="uip-image-upload" @change="uploadImage()">
                      </label>
                      <div class="uip-flex uip-flex-row uip-gap-xs uip-link-default uip-flex-center" @click="chooseImage()">
                        <div class="uip-icon uip-text-l uip-icon-medium">photo_library</div>
                        <div class="">{{strings.library}}</div>
                      </div>
                      <dropdown v-if="img.dynamic" pos="bottom left">
                        <template v-slot:trigger>
                          <div class="uip-flex uip-flex-row uip-gap-xs uip-link-default uip-flex-center">
                            <div class="uip-icon uip-text-l uip-icon-medium">database</div>
                            <div class="">{{strings.dynamic}}</div>
                          </div>
                        </template>
                        <template v-slot:content>
                          <dynamic-data-list type="image" :returnData="recieveDynamic"></dynamic-data-list>
                        </template>
                      </dropdown>
                    </div>
                  </template>
                </dropdown>
                
                
                <div v-if="img.dynamic" class="uip-position-absolute uip-top-0 uip-left-0 uip-padding-xs">
                  <div class="uip-padding-left-xxs uip-padding-right-xxs uip-background-primary uip-border-round uip-flex uip-gap-xxs uip-flex-center uip-text-inverse uip-cursor-pointer">
                    <span class="uip-icon uip-icon uip-text-l">database</span>
                    <span class="uip-text-xs">{{img.dynamicKey}}</span>
                    <span @click="removeDynamicItem()" class="uip-icon uip-text-l">backspace</span>
                  </div>
                </div>
              </div>
              
              
              <!--Tooltip text -->
              <div class="uip-grid-col-1-3">
              
                <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.url}}</span></div>
                  
                <input class="uip-input uip-input-small" type="text" v-model="img.url">
                
              </div>
              
              
              <background-position v-if="hasPositioning" :value="img.sizing" :returnData="function(d){img.sizing = d}"></background-position>
              
            </div>
            
          </template>
        </dropdown>
        
        <button class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted" @click="img = imgReset">close</button>
        
        
        
      </div>`,
  };
}
