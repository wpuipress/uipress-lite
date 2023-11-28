import Axios from "../libs/axios.min.js";
const { __, _x, _n, _nx } = wp.i18n;

import { defineAsyncComponent } from "../../../libs/vue-esm.js";

export const MediaLibrary = {
  emits: ["image-selected", "cancel-select"],
  data() {
    return {
      loading: true,
      strings: {
        mediaLibrary: __("Media library", "uipress-lite"),
        select: __("Select", "uipress-lite"),
        cancel: __("Cancel", "uipress-lite"),
        search: __("Search", "uipress-lite"),
        nothingFound: __("Nothing found for search term", "uipress-lite"),
        altText: __("Alt text", "uipress-lite"),
        caption: __("Caption", "uipress-lite"),
        aNicePhoto: __("A nice image", "uipress-lite"),
        aNicePhotoDescription: __("A image caption", "uipress-lite"),
        title: __("Title", "uipress-lite"),
        imageTitle: __("Image title", "uipress-lite"),
        photoBy: __("Photo by", "uipress-lite"),
        on: __("on", "uipress-lite"),
        size: __("Size", "uipress-lite"),
      },
      returnSize: "full",
      activeTab: "library",
      tabs: {
        library: {
          value: "library",
          label: __("Library", "uipress-lite"),
        },
        unsplash: {
          value: "unsplash",
          label: __("Unsplash", "uipress-lite"),
        },
        upload: {
          value: "upload",
          label: __("Upload", "uipress-lite"),
        },
      },
      media: [],
      unsplashMedia: [],
      restUrl: uip_ajax.rest_url,
      search: "",
      total: 0,
      perPage: 20,
      selected: false,
      validDrop: false,
    };
  },
  watch: {
    /**
     * Ensures no spaces or capitals are placed in slug
     * post (Object) rest base (string)
     * @since 3.2.13
     */
    activeTab: {
      handler(newValue, oldValue) {
        this.maybeGetMedia();
      },
      deep: true,
    },
    /**
     * Ensures no spaces or capitals are placed in slug
     * post (Object) rest base (string)
     * @since 3.2.13
     */
    selected: {
      handler(newValue, oldValue) {
        if (newValue) {
          if ("caption" in this.selected) {
            this.selected.caption.rendered = this.stripHTML(this.selected.caption.rendered);
          }
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.maybeGetMedia();
  },
  computed: {
    /**
     * Checks if an item is selected
     * no args
     * @since 3.2.13
     */
    ifDisabled() {
      if (!this.selected) return true;
      return false;
    },
  },
  methods: {
    /**
     * Gets media from unsplash or library
     * hideloading (Boolean)
     * @since 3.2.13
     */
    maybeGetMedia(hideLoading) {
      if (this.activeTab == "unsplash") this.getUnsplashMedia(hideLoading);
      if (this.activeTab == "library") this.getMedia(hideLoading);
    },
    /**
     * Gets media from unsplash
     * postType (Object)
     * @since 3.2.13
     */
    async getUnsplashMedia(hideLoading) {
      let path = "https://api.uipress.co/unsplash/?key=0e49uptg-aw[e0ifjhiljsoevjhbsoe8gilplhirlvi";

      let params = {
        status: "inherit",
        per_page: this.perPage,
        media_type: "image",
      };

      if (this.search) path += `&s=${this.search}`;

      if (!hideLoading) {
        this.loading = true;
      }

      await Axios({
        method: "get",
        url: path,
      })
        .then((response) => {
          this.unsplashMedia = response.data;
          this.loading = false;
        })
        .catch((err) => {
          this.media = [{ error: true, message: err.message, code: err.error }];
          this.total = 0;
          this.loading = false;
        });
    },
    /**
     * Gets media
     * postType (Object)
     * @since 3.2.13
     */
    async getMedia(hideLoading) {
      let path = this.restUrl + `wp/v2/media`;

      let params = {
        status: "inherit",
        per_page: this.perPage,
        media_type: "image",
      };

      if (this.search) params.search = this.search;

      if (!hideLoading) {
        this.loading = true;
      }
      await Axios({
        method: "get",
        url: path,
        headers: uip_ajax.rest_headers,
        params: params,
      })
        .then((response) => {
          this.media = response.data;
          this.total = response.headers["x-wp-total"];
          this.loading = false;
        })
        .catch((err) => {
          this.media = [{ error: true, message: err.message, code: err.error }];
          this.total = 0;
          this.loading = false;
        });
    },

    /**
     * Updates a media item
     * postType (Object)
     * @since 3.2.13
     */
    async updateMedia() {
      let path = this.restUrl + `wp/v2/media/${this.selected.id}`;

      let postData = {
        alt_text: this.selected.alt_text,
        title: this.selected.title.rendered,
        caption: this.selected.caption.rendered,
      };

      Axios({
        method: "post",
        url: path,
        headers: uip_ajax.rest_headers,
        data: postData,
      })
        .then((response) => {
          this.uipApp.notifications.notify(__("Image saved", "uipress-lite"), "", "success", true);
        })
        .catch((err) => {
          this.uipApp.notifications.notify(err.message, "", "error", true);
        });
    },
    /**
     * Uploads files to media library
     * evt (Object) dragged (boolean)
     * @since 3.2.13
     */
    async uploadImages(evt, dragged) {
      this.validDrop = false;
      let path = this.restUrl + `wp/v2/media/`;

      let notiID = this.uipApp.notifications.notify(__("Uploading images", "uipress-lite"), "", "default", true, true);

      let files;
      if (dragged) files = Array.from(evt.dataTransfer.files);
      if (!dragged) files = Array.from(event.target.files);

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file, file.name);

        try {
          await Axios({
            method: "post",
            url: path,
            headers: {
              ...uip_ajax.rest_headers,
              "Content-Disposition": `attachment; filename="${file.name}"`,
              "Content-Type": file.type, // Dynamically set based on file type
            },
            data: formData,
          });
        } catch (error) {
          this.uipApp.notifications.notify(__("Failed to upload", "uipress-lite") + " " + file.name, "", "error", true);
        }
      }

      this.uipApp.notifications.remove(notiID);
      this.uipApp.notifications.notify(__("uploaded complete", "uipress-lite"), "", "success", true);

      this.activeTab = "library";
      this.getMedia();
    },
    /**
     * Imports the image to library before returning
     * no args
     * @since 3.2.13
     */
    importFromUnsplash() {
      let imageURL = this.selected.urls.regular;
      let path = this.restUrl + `wp/v2/media/`;

      //Set notification
      let notiID = this.uipApp.notifications.notify(__("Importing image to library", "uipress-lite"), "", "default", true, true);

      // Fetch the image from the URL
      Axios.get(imageURL, { responseType: "blob" })
        .then((response) => {
          const imageBlob = response.data;

          // Prepare FormData to upload
          const formData = new FormData();
          formData.append("file", imageBlob, this.selected.user.username + ".jpg"); // Replace 'filename.jpg' with the desired filename

          // Upload to WordPress
          return Axios({
            method: "post",
            url: path,
            headers: {
              ...uip_ajax.rest_headers,
              "Content-Disposition": `attachment; filename="${this.selected.user.username}.jpg"`,
              "Content-Type": imageBlob.type, // Dynamically set based on file type
            },
            data: formData,
          });
        })
        .then((uploadResponse) => {
          this.$emit("image-selected", uploadResponse.data);
          this.uipApp.notifications.remove(notiID);
        })
        .catch((error) => {
          this.uipApp.notifications.notify(__("Failed to import image", "uipress-lite"), "", "error", true);
        });
    },
    /**
     * Filters the media items so it can be split into columns
     * offset (Number) - where to start in the array
     * @since 3.2.13
     */
    returnColumnItems(list, offset = 0) {
      return list.filter((_, index) => (index - offset) % 3 === 0);
    },

    /**
     * Confirms and closes modal
     * post (Object) rest base (string)
     * @since 3.2.13
     */
    confirm() {
      if (this.selected.color) {
        this.importFromUnsplash();
      } else {
        this.$emit("image-selected", this.returnImage());
      }
    },

    returnImage() {
      return {
        id: this.selected.id,
        caption: this.selected.caption.rendered,
        alt: this.selected.alt_text,
        height: this.selected.media_details.sizes[this.returnSize].height,
        width: this.selected.media_details.sizes[this.returnSize].width,
        source_url: this.selected.media_details.sizes[this.returnSize].source_url,
      };
    },

    /**
     * Watches for scroll to bottom and loads more media
     * post (Object) rest base (string)
     * @since 3.2.13
     */
    onScrollMedia({ target: { scrollTop, clientHeight, scrollHeight } }) {
      if (scrollTop + clientHeight >= scrollHeight - 1) {
        if (this.total > this.media.length) {
          this.perPage += 20;
          this.getMedia(true);
        }
      }
    },
    /**
     * Removes html tags from a string
     * text (String)
     * @since 3.2.13
     */
    stripHTML(text) {
      if (!text) return;
      text = text.replace(/(<([^>]+)>)/gi, "");
      return text;
    },
    /**
     * Returns a css aspect ratio
     * photo (Object)
     * @since 3.2.13
     */
    returnRatio(photo) {
      return `aspect-ratio: ${photo.width} / ${photo.height}`;
    },
    /**
     * Returns a preview of the image
     *
     * @param {Object} - photo - the photo to preview
     * @since 3.2.13
     */
    returnImagePreview(photo) {
      // No sizes so return full url
      if (!("sizes" in photo.media_details)) return photo.source_url;

      // Get size
      if ("medium" in photo.media_details.sizes) return photo.media_details.sizes.medium.source_url;
      if ("small" in photo.media_details.sizes) return photo.media_details.sizes.small.source_url;
      if ("thumbnail" in photo.media_details.sizes) return photo.media_details.sizes.thumbnail.source_url;
      if ("large" in photo.media_details.sizes) return photo.media_details.sizes.large.source_url;
      if ("full" in photo.media_details.sizes) return photo.media_details.sizes.full.source_url;
    },
  },
  template: `
    
    <div class="uip-flex uip-flex-column uip-row-gap-s uip-flex-grow" style="overflow:hidden">
	
		  
		  <toggle-switch :activeValue="activeTab" :options="tabs" :returnValue="(d) => {activeTab = d}"/>
		  
		  <div v-if="loading" class="uip-padding-s uip-flex uip-flex-middle uip-flex-center uip-flex-grow">
			<loading-chart/>
		  </div>
		  
		  
		  
		  <div v-else-if="activeTab == 'upload'" class="uip-flex-grow">
		  
			<label @drop.prevent="uploadImages($event, true)"
			@dragenter.prevent="validDrop = true"
			@dragleave.prevent="validDrop = false"
			@dragover.prevent="validDrop = true"
			:class="{'uip-background-primary-wash' : validDrop, 'uip-background-muted' : !validDrop,  }"
			class="uip-background-muted uip-border uip-border-rounder uip-padding-m uip-flex uip-flex-middle uip-flex-center uip-transition-all uip-link-muted">
			  
			  <span class="uip-icon uip-text-xl">file_upload</span>
			  <input hidden accept="image/*" type="file" multiple id="uip-import-layout" @change="uploadImages($event)">
			  
			</label>
		  
		  </div>
		  
		  
		  
		  <div v-else-if="activeTab == 'unsplash'" class="uip-flex uip-flex-column uip-row-gap-s uip-flex-grow uip-max-h-100p uip-overflow-hidden">
			
			<div class="uip-background-muted uip-border-rounder uip-padding-xs uip-flex uip-flex-gap-s uip-flex-center">
			  <input class="uip-blank-input uip-flex-grow uip-text-s" type="text" v-model="search" @input="maybeGetMedia(true)" :placeholder="strings.search"> 
			  <span class="uip-icon uip-text-muted uip-text-s">search</span>
			</div>
			
			<div v-if="media.length < 1 && search != '' && activeTab == 'library'" class="uip-text-muted">
			  {{strings.nothingFound}} <strong>{{search}}</strong>
			</div>
			
			<div v-if="unsplashMedia.length < 1 && search != '' && activeTab == 'unsplash'" class="uip-text-muted">
			  {{strings.nothingFound}} <strong>{{search}}</strong>
			</div>
			
			<template v-for="(error, index) in media">
			  <div v-if="error.error" class="uip-border-rounder uip-padding-xs uip-padding-left-xs  uip-background-orange-wash uip-text-s">
				{{error.message}}
			  </div>
			</template>
			
			<div class="uip-grid-col-3 uip-grid-gap-s uip-overflow-auto uip-max-w-100p uip-flex-grow uip-max-h-100p">
			  
			  <!--Column 1-->
			  <div class="uip-flex uip-flex-column uip-row-gap-s">
				<template v-for="(photo, index) in returnColumnItems(unsplashMedia, 0)">
				  <div v-if="!photo.error" 
				  @click="selected = photo"
				  class="uip-flex uip-flex-column uip-flex-no-wrap uip-row-gap-xxs uip-cursor-pointer uip-position-relative">
					
					<img key="image" :src="photo.urls.small" 
					:style="returnRatio(photo)"
					class="uip-w-100p uip-max-w-100p uip-border-rounder" :alt="photo.alt_description"
					:class="{'uip-brightness-05' : photo.id == selected.id}">
					
					<div class="uip-position-absolute uip-padding-xs" v-if="photo.id == selected.id">
					  <div class="uip-border-circle uip-padding-xxxs uip-background-primary uip-active-outline uip-text-xs">
					   <span class="uip-icon uip-text-inverse">done</span>
					  </div> 
					</div>
					
					<span class="uip-text-s uip-text-muted uip-max-w-100p uip-overflow-hidden uip-no-wrap uip-text-ellipsis">{{ photo.user.name }}</span>
				  </div>
				</template>
			  </div>
			  
			  <!--Column 2-->
			  <div class="uip-flex uip-flex-column uip-row-gap-s">
				<template v-for="(photo, index) in returnColumnItems(unsplashMedia, 1)">
				  <div v-if="!photo.error" 
				  @click="selected = photo"
				  class="uip-flex uip-flex-column uip-flex-no-wrap uip-row-gap-xxs uip-cursor-pointer uip-position-relative">
					
					<img key="image" :src="photo.urls.small" 
					:style="returnRatio(photo)"
					class="uip-w-100p uip-max-w-100p uip-border-rounder" :alt="photo.alt_description"
					:class="{'uip-brightness-05' : photo.id == selected.id}">
					
					<div class="uip-position-absolute uip-padding-xs" v-if="photo.id == selected.id">
					  <div class="uip-border-circle uip-padding-xxxs uip-background-primary uip-active-outline uip-text-xs">
					   <span class="uip-icon uip-text-inverse">done</span>
					  </div> 
					</div>
					
					<span class="uip-text-s uip-text-muted uip-max-w-100p uip-overflow-hidden uip-no-wrap uip-text-ellipsis">{{ photo.user.name }}</span>
				  </div>
				</template>
			  </div>
			  
			  <!--Column 3-->
			  <div class="uip-flex uip-flex-column uip-row-gap-s">
				<template v-for="(photo, index) in returnColumnItems(unsplashMedia, 2)">
				  <div v-if="!photo.error" 
				  @click="selected = photo"
				  class="uip-flex uip-flex-column uip-flex-no-wrap uip-row-gap-xxs uip-cursor-pointer uip-position-relative">
					
					<img key="image" :src="photo.urls.small" 
					:style="returnRatio(photo)"
					class="uip-w-100p uip-max-w-100p uip-border-rounder" :alt="photo.alt_description"
					:class="{'uip-brightness-05' : photo.id == selected.id}">
					
					<div class="uip-position-absolute uip-padding-xs" v-if="photo.id == selected.id">
					  <div class="uip-border-circle uip-padding-xxxs uip-background-primary uip-active-outline uip-text-xs">
					   <span class="uip-icon uip-text-inverse">done</span>
					  </div> 
					</div>
					
					<span class="uip-text-s uip-text-muted uip-max-w-100p uip-overflow-hidden uip-no-wrap uip-text-ellipsis">{{ photo.user.name }}</span>
				  </div>
				</template>
			  </div>
			  
			</div>
		  
		  </div>
		  
		  
		  
		  
		  
		  
		  
		  <div v-else-if="activeTab == 'library'" class="uip-flex uip-flex-column uip-row-gap-s uip-flex-grow uip-max-h-100p uip-overflow-hidden">
			
			<div class="uip-background-muted uip-border-rounder uip-padding-xs uip-flex uip-flex-gap-s uip-flex-center">
			  <input class="uip-blank-input uip-flex-grow" type="text" v-model="search" @input="getMedia(true)" :placeholder="strings.search"> 
			  <span class="uip-icon uip-text-muted uip-text-s">search</span>
			</div>
			
			<div v-if="media.length < 1 && search != ''" class="uip-text-muted">
			  {{strings.nothingFound}} <strong>{{search}}</strong>
			</div>
			
			<template v-for="(error, index) in media">
			  <div v-if="error.error" class="uip-border-rounder uip-padding-xs uip-padding-left-xs  uip-background-orange-wash uip-text-s">
				{{error.message}}
			  </div>
			</template>
			
			<div class="uip-grid-col-3 uip-grid-gap-s uip-overflow-auto uip-max-w-100p uip-flex-grow uip-max-h-100p" @scroll="onScrollMedia">
			  
			  <!--Column 1-->
			  <div class="uip-flex uip-flex-column uip-row-gap-s">
				<template v-for="(photo, index) in returnColumnItems(media, 0)">
				  <div v-if="!photo.error" 
				  @click="selected = photo"
				  class="uip-flex uip-flex-column uip-flex-no-wrap uip-row-gap-xxs uip-cursor-pointer uip-position-relative">
					
					<img key="image" :src="returnImagePreview(photo)" 
					:style="'ratio:' + photo.media_details.width / photo.media_details.height"
					class="uip-w-100p uip-max-w-100p uip-border-rounder uip-translate-all" :alt="photo.alt_text"
					:class="{'uip-brightness-05' : photo.id == selected.id}">
					
					<div class="uip-position-absolute uip-padding-xs" v-if="photo.id == selected.id">
					  <div class="uip-border-circle uip-padding-xxxs uip-background-primary uip-active-outline uip-text-xs">
					   <span class="uip-icon uip-text-inverse">done</span>
					  </div> 
					</div>
					
					<span class="uip-text-s uip-text-muted uip-max-w-100p uip-overflow-hidden uip-no-wrap uip-text-ellipsis">{{ photo.title.rendered }}</span>
				  </div>
				</template>
			  </div>
			  
			  <!--Column 2-->
			  <div class="uip-flex uip-flex-column uip-row-gap-s">
				<template v-for="(photo, index) in returnColumnItems(media, 1)">
				  <div v-if="!photo.error" 
				  @click="selected = photo"
				  class="uip-flex uip-flex-column uip-flex-no-wrap uip-row-gap-xxs uip-cursor-pointer uip-position-relative">
					
					<img key="image" :src="returnImagePreview(photo)" 
					:style="'ratio:' + photo.media_details.width / photo.media_details.height"
					class="uip-w-100p uip-max-w-100p uip-border-rounder uip-translate-all" :alt="photo.alt_text"
					:class="{'uip-brightness-05' : photo.id == selected.id}">
					
					<div class="uip-position-absolute uip-padding-xs" v-if="photo.id == selected.id">
					  <div class="uip-border-circle uip-padding-xxxs uip-background-primary uip-active-outline uip-text-xs">
					   <span class="uip-icon uip-text-inverse uip-text-s">done</span>
					  </div> 
					</div>
					
					<span class="uip-text-s uip-text-muted uip-max-w-100p uip-overflow-hidden uip-no-wrap uip-text-ellipsis">{{ photo.title.rendered }}</span>
				  </div>
				</template>
			  </div>
			  
			  <!--Column 3-->
			  <div class="uip-flex uip-flex-column uip-row-gap-s">
				<template v-for="(photo, index) in returnColumnItems(media, 2)">
				  <div v-if="!photo.error" 
				  @click="selected = photo"
				  class="uip-flex uip-flex-column uip-flex-no-wrap uip-row-gap-xxs uip-cursor-pointer uip-position-relative">
					
					<img key="image" :src="returnImagePreview(photo)" 
					:style="'ratio:' + photo.media_details.width / photo.media_details.height"
					class="uip-w-100p uip-max-w-100p uip-border-rounder uip-translate-all" :alt="photo.alt_text"
					:class="{'uip-brightness-05' : photo.id == selected.id}">
					
					<div class="uip-position-absolute uip-padding-xs" v-if="photo.id == selected.id">
					  <div class="uip-border-circle uip-padding-xxxs uip-background-primary uip-active-outline uip-text-xs">
					   <span class="uip-icon uip-text-inverse">done</span>
					  </div> 
					</div>
					
					<span class="uip-text-s uip-text-muted uip-max-w-100p uip-overflow-hidden uip-no-wrap uip-text-ellipsis">{{ photo.title.rendered }}</span>
				  </div>
				</template>
			  </div>
			  
			</div>
		  
		  </div>
		  
		  <div v-if="selected" class="uip-border-box uip-flex uip-gap-m uip-padding-top-xs uip-scale-in-bottom">
			
			<!--WordPress-->
			<div v-if="!selected.color" class="uip-max-w-50p uip-flex uip-flex-middle">
			  <img key="image" :src="returnImagePreview(selected)" 
			  :style="'ratio:' + selected.media_details.width / selected.media_details.height"
			  class="uip-max-w-100p uip-border-rounder uip-max-h-200" :alt="selected.alt_text">
			</div>
			
			<div v-if="!selected.color" class="uip-flex uip-flex-column uip-row-gap-xs uip-flex-grow uip-flex-middle">
			  <form @change="updateMedia" class="uip-flex uip-flex-column uip-row-gap-xs uip-flex-grow uip-flex-middle">
				
				<div class="uip-grid-col-1-3">
				  <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.title}}</span></div>
				  <input class="uip-input uip-flex-grow" type="text" v-model="selected.title.rendered" :placeholder="strings.imageTitle">
				</div>
				
				<div class="uip-grid-col-1-3">
				  <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.altText}}</span></div>
				  <input class="uip-input uip-flex-grow" type="text" v-model="selected.alt_text" :placeholder="strings.aNicePhoto">
				</div>
				
				<div class="uip-grid-col-1-3">
				  <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.caption}}</span></div>
				  <textarea class="uip-input uip-min-h-100" v-model="selected.caption.rendered" v-html="selected.caption.rendered"
				  :placeholder="strings.aNicePhotoDescription"></textarea>
				</div>
				
				
			  </form>
			
			
			  <div class="uip-grid-col-1-3">
				<div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.size}}</span></div>
				<select class="uip-input" v-model="returnSize">
				  <template v-for="(size, key) in selected.media_details.sizes">
					<option :value="key">{{ key }}</option>
				  </template>
				</select>
			  </div>
			
			</div>
			
			
			
			<!--Unsplash-->
			<div v-if="selected.color" class="uip-max-w-50p uip-flex uip-flex-middle">
			  <img key="image" :src="selected.urls.small" 
			  :style="'ratio:' + selected.width / selected.height"
			  class="uip-max-w-100p uip-border-rounder uip-max-h-200" :alt="selected.alt_description">
			</div>
			
			<div v-if="selected.color" class="uip-flex uip-flex-column uip-row-gap-xs uip-flex-grow uip-flex-middle">
			  
				<span>
				  {{strings.photoBy}} 
				  <a class="uip-link-primary" :href="selected.user.links.html + '?utm_source=uipress&utm_medium=referral'" target="_BLANK">{{selected.user.username}}</a>
				</span>
				
				<span>
				  {{strings.on}} 
				  <a class="uip-link-primary" href="https://unsplash.com/?utm_source=uipress&utm_medium=referral" target="_BLANK">Unsplash</a>
				</span>
			  
			</div>
		  
		  </div>
		  
		  
		  <div class="uip-flex uip-gap-s uip-flex-between">
		  
			  <button class="uip-button-default uip-flex uip-gap-xs uip-flex-center" @click="$emit('cancel-select')">
				<span>{{ strings.cancel }}</span>
				<div class="uip-background-grey uip-padding-left-xxs uip-padding-right-xxs uip-border-rounder uip-flex uip-flex-middle">
				  <span class="uip-text-muted uip-text-s">esc</span>
				</div>
			  </button>
			  
			  <button class="uip-button-primary uip-flex uip-gap-s uip-flex-center" @click="confirm" :disabled="ifDisabled">
				<span>{{ strings.select }}</span>
			  </button>
		  </div>
      
    </div>  
		`,
};

export default {
  components: {
    Modal: defineAsyncComponent(() => import("./modal.js")),
    MediaLibrary: MediaLibrary,
  },

  data() {
    return {
      resolvePromise: undefined,
      rejectPromise: undefined,
      strings: {
        mediaLibrary: __("Media library", "uipress-lite"),
      },
    };
  },
  methods: {
    /**
     * Cancels and closes modal
     *
     * @since 3.2.13
     */
    cancel() {
      this.$emit("cancel-select");
      this.$refs.popup.close();
      this.resolvePromise(false);
    },

    /**
     * Shows confirm dialog and sets options
     * opts (Object)
     * @since 3.2.13
     */
    show(opts = {}) {
      this.selected = false;
      this.$refs.popup.open();
      this.resolvePromise = undefined;
      this.rejectPromise = undefined;

      requestAnimationFrame(() => {
        this.$refs.confirmBody.focus();
      });
      // Return promise so the caller can get results
      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve;
        this.rejectPromise = reject;
      });
    },
  },
  template: `
  
    <component is="style">
      .imageload-enter-active,
      .imageload-leave-active {
      transition: all 0.5s ease;
      }
      .imageload-enter-from,
      .imageload-leave-to {
      opacity: 0;
      }
    </component>
  
    <Modal ref="popup">
  
      <div ref="confirmBody" @keydown.escape="cancel()" @click.stop
      class="uip-w-500 uip-flex uip-flex-column uip-row-gap-s uip-padding-m" tabindex="1" 
      style="height:70vh;max-height:80vh" autofocus>
      
        <div class="uip-flex uip-gap-xs uip-flex-start uip-flex-no-wrap uip-max-h-100p">
        
          <h2 class="uip-margin-remove uip-flex-grow">{{ strings.mediaLibrary }}</h2>
          <div @click="cancel()" class="uip-padding-xxs uip-border-rounder hover:uip-background-muted uip-cursor-pointer">
            <span class="uip-icon uip-link-muted">close</span>
          </div>
        
        </div>
        
        <MediaLibrary @image-selected="(d) => {resolvePromise(d);$refs.popup.close();}" 
        @cancel-select="$refs.popup.close();resolvePromise(false);"/>
        
      </div>
    
    </Modal>  
  
  
  `,
};
