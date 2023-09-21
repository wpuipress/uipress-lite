const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      args: Object,
    },
    data: function () {
      return {
        files: [],
        remoteFiles: [],
        maxUpload: this.uipress.uipAppData.options.maxUpload,
        modalOpen: false,
        fileTypes: this.uipress.uipAppData.options.uploadTypes,
        query: {
          page: 0,
          search: '',
        },
        totalPages: 0,
        loading: false,
        ui: {
          uploadEnabled: true,
          deleteEnabled: true,
          dropping: false,
          activeTab: 'library',
          view: 'grid',
          tabs: [
            {
              name: 'library',
              label: __('Library', 'uipress-lite'),
            },
            {
              name: 'stock',
              label: 'Unsplash',
            },
          ],
          strings: {
            searchMedia: __('Search media', 'uipress-lite'),
            gridView: __('Grid view', 'uipress-lite'),
            listView: __('List view', 'uipress-lite'),
            listView: __('List view', 'uipress-lite'),
            add: __('Choose image', 'uipress-lite'),
            full: __('Full size', 'uipress-lite'),
            regular: __('Medium', 'uipress-lite'),
            small: __('Small', 'uipress-lite'),
            thumb: __('Thumbnail', 'uipress-lite'),
            upload: __('Upload', 'uipress-lite'),
            delete: __('Delete', 'uipress-lite'),
            photoBy: __('Photo by', 'uipress-lite'),
            on: __('on', 'uipress-lite'),
          },
        },
      };
    },
    inject: ['uipress'],
    watch: {
      'query.page': {
        handler(newValue, oldValue) {
          this.getImages();
        },
        deep: true,
      },
      'query.search': {
        handler(newValue, oldValue) {
          if (newValue == '') {
            this.query.page = 0;
            this.files = [];
            this.getImages();
          }
        },
        deep: true,
      },
      'ui.activeTab': {
        handler(newValue, oldValue) {
          this.getImages();
        },
        deep: true,
      },
    },
    mounted: function () {
      this.getImages();
      this.enableFeatures();
      requestAnimationFrame(() => {
        document.documentElement.addEventListener('click', this.onClickOutside, false);
      });
    },
    computed: {
      selected() {
        let files = [];

        if (this.ui.activeTab == 'library') {
          for (const img of this.files) {
            if (img.selected) {
              files.push(img);
            }
          }
        }
        if (this.ui.activeTab == 'stock') {
          for (const img of this.remoteFiles) {
            if (img.selected) {
              files.push(img);
            }
          }
        }

        files[0];

        return files;
      },
      selectedIDS() {
        let files = [];

        if (this.ui.activeTab == 'library') {
          for (const img of this.files) {
            if (img.selected) {
              files.push(img.id);
            }
          }
        }

        return files;
      },
    },
    methods: {
      enableFeatures() {
        if (!this.args) {
          return;
        }
        if (!this.uipress.isObject(this.args)) {
          return;
        }

        if (!Array.isArray(this.args.features)) {
          return;
        }

        if (!this.args.features.includes('stock')) {
          this.ui.tabs.splice(1, 1);
        }
        if (!this.args.features.includes('upload')) {
          this.ui.uploadEnabled = false;
        }
        if (!this.args.features.includes('delete')) {
          this.ui.deleteEnabled = false;
        }
      },
      searchLibrary() {
        this.query.page = 0;
        this.files = [];
        this.remoteFiles = [];
        this.getImages();
      },
      watchScroll({ target: { scrollTop, clientHeight, scrollHeight } }) {
        if (scrollTop + clientHeight >= scrollHeight) {
          if (this.query.page < this.totalPages) {
            this.query.page += 1;
          }
        }
      },
      onClickOutside() {
        if (this.args.style == 'inline') {
          return;
        }
        if (!this.$refs.uipMedia) {
          return;
        }
        if (this.modalOpen) {
          return;
        }
        const path = event.path || (event.composedPath ? event.composedPath() : undefined);
        // check if the MouseClick occurs inside the component
        if (path && !path.includes(this.$refs.uipMedia) && !this.$refs.uipMedia.contains(event.target)) {
          this.destroyGallery(); // whatever method which close your component
        }
      },
      getImages(uploading, deleting) {
        let self = this;
        self.loading = true;

        if (self.ui.activeTab == 'stock') {
          this.fetchRemote();
          return;
        }

        if (deleting) {
          self.query.page = 1;
        }

        let authorLimit = false;
        if (self.args.limitToAuthor) {
          authorLimit = true;
        }

        let perPage = 20;
        if ('perPage' in self.args) {
          if (self.args.perPage != '' || self.args.perPage > 0) {
            perPage = self.args.perPage;
          }
        }

        //Build form data for fetch request
        let formData = new FormData();
        formData.append('action', 'uip_get_media');
        formData.append('security', uip_ajax.security);
        formData.append('search', self.query.search);
        formData.append('page', self.query.page);
        formData.append('limitToAuthor', authorLimit);
        formData.append('perPage', perPage);
        if (self.args.fileTypes) {
          let files = JSON.stringify(self.args.fileTypes);
          formData.append('fileTypes', files);
        }

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          if (response.error) {
            self.uipress.notify(response.message, 'uipress-lite', '', 'error', true);
            self.loading = false;
          }
          if (response.success) {
            if (uploading) {
              self.files = response.media;
            } else {
              self.files = self.files.concat(response.media);
            }
            self.totalPages = response.totalPages;
            self.loading = false;
          }
        });
      },
      fetchRemote() {
        let self = this;

        if (self.remoteFiles.length > 0 && self.query.search == '') {
          self.loading = false;
          return;
        }
        let formData = new FormData();
        let search = self.query.search;
        let URL = 'https://api.uipress.co/unsplash/?key=0e49uptg-aw[e0ifjhiljsoevjhbsoe8gilplhirlvi&s=' + search;

        self.uipress.callServer(URL, formData).then((response) => {
          if (response.error) {
            self.uipress.notify(response.message, 'uipress-lite', '', 'error', true);
            self.loading = false;
          }
          self.loading = false;
          self.remoteFiles = response;
        });
      },
      selectImage(image) {
        if (this.args.multiple == false) {
          if (this.ui.activeTab == 'library') {
            for (const img of this.files) {
              if (img.id != image.id) {
                img.selected = false;
              }
            }
          }
          if (this.ui.activeTab == 'stock') {
            for (const img of this.remoteFiles) {
              if (img.id != image.id) {
                img.selected = false;
              }
            }
          }
        }

        image.selected = !image.selected;
      },

      destroyGallery() {
        let removeLibrary = new CustomEvent('uip_remove_media_gallery');
        document.dispatchEvent(removeLibrary);
        document.documentElement.removeEventListener('click', this.onClickOutside, false);
      },
      chooseImage(size) {
        let self = this;
        let files = this.selected;

        if (!this.args.multiple) {
          files = files[0];

          if ('alt_description' in files) {
            files = {
              name: files.alt_description,
              url: files.urls[size],
            };
          } else {
            files.url = files.urls[size];
          }
        }
        //We are using unsplash and need to trigger a download event
        if ('links' in this.selected[0]) {
          let photoID = this.selected[0].id;

          let formData = new FormData();
          let URL = 'https://api.uipress.co/unsplash/download.php?key=0e49uptg-aw[e0ifjhiljsoevjhbsoe8gilplhirlvi&id=' + photoID;

          self.uipress.callServer(URL, formData).then((response) => {});
        }
        let setImages = new CustomEvent('uip_media_selected', { detail: { files: files } });
        document.dispatchEvent(setImages);

        this.destroyGallery();
      },
      formatDate(dateString) {
        let date = new Date('2011-04-11T10:20:30Z');

        let mm = date.getMonth() + 1; // Months start at 0!
        let dd = date.getDate();
        let yy = date.getFullYear();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        return dd + '/' + mm + '/' + yy;
      },
      getfilesFromInput() {
        if (!this.ui.uploadEnabled) {
          return;
        }
        let thefiles = this.$refs.manualFileUpload.files;
        if (thefiles.length > 0) {
          let evt = {};
          evt.dataTransfer = {};
          evt.dataTransfer.files = thefiles;
          this.uploadImages(evt);
        }
      },
      uploadImages(evt) {
        if (!this.ui.uploadEnabled) {
          return;
        }
        let self = this;
        self.loading = true;
        this.ui.dropping = false;
        let files = evt.dataTransfer.files;
        let notiID = self.uipress.notify(__('Uploading files', 'uipress-lite'), '', 'default', false, true);

        let uploadList = Array.from(files).map(async (file) => {
          return await self.uploadImage(file);
        });
        Promise.all(uploadList).then((completed) => {
          self.loading = false;
          self.getImages(true);
          let failedCount = completed.filter((x) => x == false).length;
          self.uipress.notify(__('Upload finsihed', 'uipress-lite'), failedCount + __(' errors', 'uipress-lite'), 'success', true, false);
          self.uipress.destroy_notification(notiID);
        });
      },
      highlightDrop() {
        if (this.ui.uploadEnabled) {
          this.ui.dropping = true;
        }
      },
      dragEnd() {
        this.ui.dropping = false;
      },
      async uploadImage(thefile) {
        let self = this;

        if (thefile.size > self.maxUpload) {
          self.uipress.notify(__('File exceeds max upload size', 'uipress-lite'), thefile.name, 'error', true, false);
          self.uploading = false;
          return false;
        }

        //fileTypes
        if (!self.fileTypes.includes(thefile.type)) {
          self.uipress.notify(__('Unable to upload this file type', 'uipress-lite'), '', 'error', true, false);
          self.uploading = false;
          return false;
        }

        let formData = new FormData();
        formData.append('action', 'uip_upload_image');
        formData.append('security', uip_ajax.security);
        formData.append('image', thefile);
        formData.append('file', thefile);

        return await fetch(uip_ajax.ajax_url, {
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
              self.uipress.notify(__('File uploaded', 'uipress-lite'), thefile.name, 'success', true, false);
              return true;
            } else {
              self.uipress.notify(__('Unable to handle upload', 'uipress-lite'), thefile.name, 'error', true, false);
              return false;
            }
          })
          .catch((err) => {
            self.uipress.notify(err, '', 'error');
            return false;
          });
      },
      deleteSelected() {
        let self = this;
        let files = this.selectedIDS;
        self.modalOpen = true;
        files = JSON.stringify(files);

        self.uipress
          .confirm(__('Are you sure?', 'uipress-lite'), __("Are you sure you want to delete this? Once deleted this item can't be recovered"), __('Delete', 'uipress-lite'))
          .then((response) => {
            if (response) {
              let notiID = self.uipress.notify(__('Deleting selected files', 'uipress-lite'), '', 'default', false, true);
              self.loading = true;
              let formData = new FormData();
              formData.append('action', 'uip_delete_post');
              formData.append('security', uip_ajax.security);
              formData.append('id', files);

              self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
                if (response.error) {
                  self.uipress.notify(response.message, 'uipress-lite', '', 'error', true);
                  self.loading = false;
                  self.uipress.destroy_notification(notiID);
                  self.modalOpen = false;
                }
                if (response.success) {
                  self.uipress.notify(__('Items deleted', 'uipress-lite'), response.errorCount + ' errors', 'success', true);
                  self.loading = false;
                  //self.getImages(true, true);
                  self.uipress.destroy_notification(notiID);
                  self.modalOpen = false;

                  for (let id of JSON.parse(files)) {
                    let index = self.files.findIndex((object) => {
                      return object.id == id;
                    });

                    self.files.splice(index, 1);
                  }
                }
              });
            }
          });
      },
      ifMimeType(types, type) {
        for (const mimetype of types) {
          if (type.includes(mimetype)) {
            return true;
          }
        }
        return false;
      },
    },
    template: `
	<div ref="uipMedia" class="uip-max-w-100p uip-position-relative uip-text-normal" :class="{'uip-w-700' : args.style != 'inline'}">
		<div class="uip-flex uip-flex-row uip-flex-between">
			<div class="uip-flex uip-flex-row uip-gap-s uip-margin-bottom-s">
				<template v-for="tab in ui.tabs">
					<div class="uip-link-muted uip-padding-bottom-s" :class="{'uip-border-bottom-primary uip-text-bold uip-text-emphasis' : ui.activeTab == tab.name}" @click="ui.activeTab = tab.name">{{tab.label}}</div>
				</template>
				<label v-if="ui.uploadEnabled">
					<div class="uip-flex uip-gap-xxs uip-padding-bottom-s uip-flex uip-flex-center">
						<div class="uip-icon uip-icon-medium uip-link-default">file_upload</div>
						<div class="uip-link-muted">{{ui.strings.upload}}</div>
						<input hidden :accept="fileTypes.toString()" type="file"  ref="manualFileUpload" @change="getfilesFromInput()" multiple>
					</div>
				</label>
			</div>
			<div v-if="args.style != 'inline'" class="uip-link-muted uip-text-l uip-icon uip-icon-medium" @click="destroyGallery()">close</div>
		</div>
		<div class="">
			<!--TOOLBAR -->
			<div class="uip-flex uip-flex-row uip-flex-between">
				<div class="uip-flex uip-padding-xxs uip-border uip-search-block uip-border-round uip-margin-bottom-s">
					<span class="uip-icon uip-text-muted uip-margin-right-xs uip-text-l uip-icon uip-icon-medium">search</span>
					<input class="uip-blank-input uip-flex-grow uip-text-s" type="text" :placeholder="ui.strings.searchMedia" v-model="query.search" v-on:keyup.enter="searchLibrary()">
					<span class="uip-icon uip-text-muted uip-icon uip-icon-medium uip-padding-xxxs uip-border-round uip-border">keyboard_return</span>
				</div>
				<div class="uip-flex uip-flex-row uip-flex-gap-s">
					<uip-tooltip :message="ui.strings.gridView" :delay="400">
						<div class="uip-icon uip-icon-medium uip-text-l uip-link-default uip-padding-xxs" @click="ui.view = 'grid'"
						:class="{'uip-border-bottom-primary uip-text-emphasis' : ui.view == 'grid'}">grid_view</div>
					</uip-tooltip>
					<uip-tooltip :message="ui.strings.listView" :delay="400">
						<div class="uip-icon uip-icon-medium uip-text-l uip-link-default uip-padding-xxs" @click="ui.view = 'list'"
						:class="{'uip-border-bottom-primary uip-text-emphasis' : ui.view == 'list'}" >sort</div>
					</uip-tooltip>
				</div>
			</div>
			<!--END TOOLBAR -->
		</div>
		<!--Library -->
		<div v-if="ui.activeTab == 'library'" class="uip-position-relative uip-w-100p">
			<div class="uip-ajax-loader" v-if="loading">
			  <div class="uip-loader-bar"></div>
			</div>
			<div ref="dropArea" @drop.prevent="uploadImages" @dragenter.prevent="highlightDrop" @dragover.prevent="highlightDrop">
				<div @dragenter.prevent="highlightDrop" @dragover.prevent="highlightDrop" @dragleave.prevent="dragEnd" @dragend.prevent="dragEnd"
				class="uip-position-absolute uip-top-0 uip-bottom-0 uip-left-0 uip-right-0 uip-background-primary-wash uip-flex uip-flex-middle uip-flex-center uip-z-index-3" v-if="ui.dropping">
					<div class="uip-icon uip-text-xl uip-icon-medium">file_upload</div>
				</div>
				<div ref="mediaList" class="uip-flex uip-flex-wrap uip-flex-start uip-row-gap-xs uip-gap-xs uip-flex-row uip-max-h-500 uip-overflow-auto uip-scrollbar uip-padding-bottom-l uip-attachment-area" id="media-list" @scroll="watchScroll">
					<template v-if="ui.view == 'grid'" v-for="image in files">
						<div @click="selectImage(image)" :class="{'uip-active-outline' : image.selected}"
						@mouseenter="image.hover = true" @mouseleave="image.hover = false"
						class="uip-cursor-pointer uip-flex uip-flex-column uip-row-gap-xs uip-flex-start uip-position-relative">
            <!--preview area-->
              <!--image-->
							<img v-if="image.type.includes('image')" :style="'aspect-ratio:' + image.ratio" :src="image.preview" :alt="image.name" class="uip-max-h-100 uip-h-100 uip-w-auto">
              <!--View-->
              <video v-else-if="image.type.includes('video')" :style="'aspect-ratio:' + image.ratio" :src="image.preview" :alt="image.name" class="uip-max-h-100 uip-h-100 uip-w-auto"></video>
              <!--PDF-->
              <img v-else-if="image.type.includes('pdf')" :style="'aspect-ratio:' + image.ratio" :src="image.preview" :alt="image.name" class="uip-max-h-100 uip-h-100 uip-w-auto">
              <!--ZIP / TAR-->
              <div v-else-if="ifMimeType(['zip', 'tar', 'gzip'], image.type)" class="uip-max-h-100 uip-h-100 uip-w-100 uip-flex uip-flex-center uip-flex-middle uip-background-grey"><span class="uip-icon uip-text-xxl">archive</span></div>
              <!--CODE-->
              <div v-else-if="ifMimeType(['php', 'css', 'js', 'html', 'json'], image.type)" class="uip-max-h-100 uip-h-100 uip-w-100 uip-flex uip-flex-center uip-flex-middle uip-background-grey"><span class="uip-icon uip-text-xxl">code</span></div>
              <!--CSV-->
              <div v-else-if="ifMimeType(['csv'], image.type)" class="uip-max-h-100 uip-h-100 uip-w-100 uip-flex uip-flex-center uip-flex-middle uip-background-grey"><span class="uip-icon uip-text-xxl">formatted_list_numbered</span></div>
              <!--preview area-->
              <!--CSV-->
              <div v-else-if="ifMimeType(['audio'], image.type)" class="uip-max-h-100 uip-h-100 uip-w-100 uip-flex uip-flex-center uip-flex-middle uip-background-grey"><span class="uip-icon uip-text-xxl">play_circle</span></div>
              <!--Others-->
              <div v-else class="uip-max-h-100 uip-h-100 uip-w-100 uip-flex uip-flex-center uip-flex-middle uip-background-grey"><span class="uip-icon uip-text-xxl">description</span></div>
            <!--preview area-->
							<div class="uip-position-absolute uip-padding-xs uip-flex uip-flex-row uip-bottom-0 uip-top-0 uip-left-0 uip-right-0 uip-gradient-dark uip-gap-xs uip-text-inverse uip-flex-end" v-if="image.hover || image.selected">
								<div><input type="checkbox" class="uip-checkbox" v-model="image.selected"></div>
								<div class="uip-text-s uip-overflow-hidden uip-text-ellipsis uip-no-wrap">{{image.name}}</div>
							</div>
						</div>
					</template>
					<div class="uip-w-100p uip-flex uip-flex-column uip-attachment-area uip-max-w-100p uip-overflow-auto uip-scrollbar" v-if="ui.view == 'list'">
						<table class="uip-border-collapse uip-min-w-500">
							<tbody>
								<template v-for="image in files">
									<tr class="uip-cursor-pointer hover:uip-background-muted" @click="selectImage(image)">
										<td class="uip-padding-xxs"><img :style="'aspect-ratio:' + image.ratio" :src="image.preview" :alt="image.name" class="uip-max-w-60"></td>
										<td class="uip-text-bold uip-padding-xxxs">{{image.name}}</td>
										<td class="uip-padding-xxs">{{image.type}}</td>
										<td class="uip-padding-xxs">{{image.modified}}</td>
										<td><input type="checkbox" class="uip-checkbox" v-model="image.selected"></td>
									</tr>
								</template>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<!--Unsplash Library -->
		<div class="" v-if="ui.activeTab == 'stock'">
			<div class="uip-ajax-loader" v-if="loading">
			  <div class="uip-loader-bar"></div>
			</div>
			<div ref="mediaList" class="uip-flex uip-flex-wrap uip-flex-start uip-row-gap-xs uip-gap-xs uip-flex-row uip-max-h-500 uip-overflow-auto uip-scrollbar uip-padding-bottom-l uip-attachment-area" id="media-list">
				<template v-if="ui.view == 'grid'" v-for="image in remoteFiles">
					<div @click="selectImage(image)" :class="{'uip-active-outline' : image.selected}"
					@mouseenter="image.hover = true" @mouseleave="image.hover = false"
					class="uip-cursor-pointer uip-flex uip-flex-column uip-row-gap-xs uip-flex-start uip-position-relative">
						<img :src="image.urls.small" :alt="image.alt_description" class="uip-max-h-100 uip-h-100 uip-w-auto">
						<div class="uip-position-absolute uip-padding-xs uip-flex uip-flex-row uip-bottom-0 uip-top-0 uip-left-0 uip-right-0 uip-gradient-dark uip-gap-xs uip-text-inverse uip-flex-end uip-flex-left" v-if="image.hover || image.selected">
							<div><input type="checkbox" class="uip-checkbox" v-model="image.selected"></div>
							<div class="uip-text-s uip-overflow-hidden uip-text-ellipsis uip-no-wrap">
              <a class="uip-link-inverse" :href="image.user.portfolio_url" target="_BLANK">{{image.user.username}}</a>
              </div>
						</div>
					</div>
				</template>
				<div class="uip-w-100p uip-flex uip-flex-column uip-attachment-area uip-overflow-auto uip-scrollbar" v-if="ui.view == 'list'">
					<table class="uip-border-collapse uip-min-w-500">
						<tbody>
							<template v-for="image in remoteFiles">
								<tr class="uip-cursor-pointer hover:uip-background-muted" @click="selectImage(image)">
									<td class="uip-padding-xxs"><img :src="image.urls.small" :alt="image.alt_description" class="uip-max-w-60"></td>
									<td class="uip-text-bold uip-padding-xxxs">{{image.alt_description}}</td>
									<td class="uip-padding-xxs"><a class="uip-link-muted" :href="image.user.links.html" target="_BLANK">{{image.user.username}}</a></td>
									<td class="uip-padding-xxs">{{formatDate(image.updated_at)}}</td>
									<td><input type="checkbox" class="uip-checkbox" v-model="image.selected"></td>
								</tr>
							</template>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<!--End unsplash Library -->
		<div class="uip-padding-top-s uip-background-default uip-flex uip-flex-between uip-bottom-0 uip-left-0 uip-right-0 uip-position-absolute" v-if="selected.length > 0">
			<button v-if="ui.activeTab != 'stock' && ui.deleteEnabled" class="uip-button-danger" @click="deleteSelected()">{{ui.strings.delete}}</button>
      <div v-if="ui.activeTab == 'stock' && selected.length > 0">
        <div>
          {{ui.strings.photoBy}} 
          <a class="uip-link-primary" :href="selected[0].user.links.html + '?utm_source=uipress&utm_medium=referral'" target="_BLANK">{{selected[0].user.username}}</a>
          {{ui.strings.on}} 
          <a class="uip-link-primary" href="https://unsplash.com/?utm_source=uipress&utm_medium=referral" target="_BLANK">Unsplash</a>
        </div>
        <div class="uip-text-muted uip-text-s">{{selected[0].alt_description}}</div>
      </div>
			<dropdown pos="bottom right" v-if="args.useType != 'browse'">
				<template v-slot:trigger>
					<button class="uip-button-primary">{{ui.strings.add}}</button>
				</template>
				<template v-slot:content>
					<div class="uip-padding-xs uip-flex uip-flex-column uip-row-gap-xs uip-text-right">
						<template v-for="(size, index) in selected[0].urls">
							<div class="uip-link-muted" @click="chooseImage(index)">{{ui.strings[index]}}</div>
						</template>
					</div>
				</template>
			</dropdown>
		</div>
	</div>`,
  };
}
