const { __ } = wp.i18n;
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Video", "uipress-lite"),
  moduleName: "uip-video",
  description: __("Outputs a video block. Can be a direct URL, media library link or embed", "uipress-lite"),
  group: "elements",
  path: "./blocks/elements/video.min.js",
  icon: "play_arrow",
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [
        { option: "textField", componentName: "uip-input", uniqueKey: "videoURL", label: __("Video URL", "uipress-lite"), value: "https://player.vimeo.com/video/794492622?h=31cc9f209b" },
        { option: "youtubeEmbed", componentName: "CodeEditor", args: { language: "html" }, uniqueKey: "youtube", label: __("Video embed", "uipress-lite") },
      ],
    },

    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },
    {
      name: "video",
      label: __("Video", "uipress-lite"),
      icon: "play_arrow",
      styleType: "style",
      class: ".uip-video",
    },
  ],
};
