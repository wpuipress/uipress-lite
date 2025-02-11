<?php
namespace UipressLite\Classes\Pages;
use UipressLite\Classes\Scripts\AdminMenu;
use UipressLite\Classes\Scripts\ToolBar;
use UipressLite\Classes\App\UserPreferences;

!defined("ABSPATH") ? exit() : "";

class FramedPages
{
  /**
   * Starts actions required to handle framed pages
   *
   * @return void
   */
  public static function start()
  {
    // Capture toolbar and menu objects
    //AdminMenu::capture();
    //ToolBar::capture();

    self::add_hooks();
  }

  /**
   * Adds required hooks
   *
   * since 3.2.13
   */
  private static function add_hooks()
  {
    add_action("admin_enqueue_scripts", ["UipressLite\Classes\Scripts\UipScripts", "add_uipress_styles"]);
    add_action("admin_enqueue_scripts", ["UipressLite\Classes\Scripts\UipScripts", "add_frame_styles"]);
    add_action("wp_enqueue_scripts", ["UipressLite\Classes\Scripts\UipScripts", "add_frame_styles"]);

    add_action("admin_xml_ns", ["UipressLite\Classes\Pages\FramedPages", "html_attributes"]);
    add_action("admin_bar_init", ["UipressLite\Classes\Scripts\UipScripts", "remove_admin_bar_style"]);
    add_filter("admin_body_class", ["UipressLite\Classes\Pages\FramedPages", "push_body_class"]);
    add_action("admin_head-profile.php", ["UipressLite\Classes\Pages\FramedPages", "remove_admin_color_scheme"]);

    // Push admin page title
    add_action("admin_head", ["UipressLite\Classes\Pages\FramedPages", "push_admin_page_title"]);
  }

  /**
   * Pushes the current admin page title to script attribute
   *
   * @return void  description
   */
  public static function push_admin_page_title()
  {
    $title = get_admin_page_title();
    wp_print_inline_script_tag("", ["id" => "uip-admin-page-title", "data-title" => $title]);
  }

  /**
   * Adds filter to remove admin color scheme
   *
   * @return void
   * @since 3.2.13
   */
  public static function remove_admin_color_scheme()
  {
    remove_action("admin_color_scheme_picker", "admin_color_scheme_picker");
  }

  /**
   * Pushes a class to body to framed pages
   *
   * @since 2.2.8
   */
  public static function push_body_class($classes)
  {
    $classes .= " uip-user-frame";
    return $classes;
  }

  /**
   * Adds data attributes to the html tag
   *
   * @since 3.0.0
   */
  public static function html_attributes()
  {
    $data = "";
    $data .= 'uip-framed-page="true" uip-core-app="true"';

    // Get active template ID
    $user_id = get_current_user_id();
    $activeTemplateID = get_transient("uip_template_active_" . $user_id);

    // Get settings
    $settings = get_post_meta($activeTemplateID, "uip-template-settings", true);
    $settings = is_object($settings) ? $settings : new \stdClass();

    // Check if screenOptions are disabled
    $screenOptions = property_exists($settings, "screenOptions") ? $settings->screenOptions : false;
    $data .= $screenOptions == "uiptrue" ? "" : 'uip-hide-screen-options="true" ';

    $helpTab = property_exists($settings, "helpTab") ? $settings->helpTab : false;
    $data .= $helpTab == "uiptrue" ? "" : 'uip-hide-help-tab="true" ';

    $notices = property_exists($settings, "pluginNotices") ? $settings->pluginNotices : false;
    $data .= $notices == "uiptrue" ? "" : 'uip-hide-notices="true" ';

    $theme = property_exists($settings, "contentTheme") ? $settings->contentTheme : false;
    $data .= $theme == "uipfalse" ? 'uip-admin-theme="false" ' : 'uip-admin-theme="true" ';

    $darkTheme = UserPreferences::get("darkTheme");
    $data .= $darkTheme ? 'data-theme="dark" ' : 'data-theme="light" ';

    echo wp_kses_post($data);
  }
}
