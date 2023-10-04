<?php
namespace UipressLite\Classes\Pages;
use UipressLite\Classes\Scripts\AdminMenu;
use UipressLite\Classes\Scripts\ToolBar;
use UipressLite\Classes\Utils\UserPreferences;

!defined('ABSPATH') ? exit() : '';

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
    AdminMenu::capture();
    ToolBar::capture();

    self::add_hooks();
  }

  /**
   * Adds required hooks
   *
   * since 3.2.13
   */
  private static function add_hooks()
  {
    add_action('admin_enqueue_scripts', ['UipressLite\Classes\Scripts\UipScripts', 'add_uipress_styles']);
    add_action('admin_enqueue_scripts', ['UipressLite\Classes\Scripts\UipScripts', 'add_frame_styles']);
    add_action('admin_enqueue_scripts', ['UipressLite\Classes\Scripts\UipScripts', 'add_icons']);
    add_action('wp_enqueue_scripts', ['UipressLite\Classes\Scripts\UipScripts', 'add_frame_styles']);

    add_action('admin_xml_ns', ['UipressLite\Classes\Pages\FramedPages', 'html_attributes']);
    add_action('admin_bar_init', ['UipressLite\Classes\Scripts\UipScripts', 'remove_admin_bar_style']);
    add_action('admin_footer', ['UipressLite\Classes\Scripts\UipScripts', 'output_user_styles'], 0);
    add_filter('admin_body_class', ['UipressLite\Classes\Pages\FramedPages', 'push_body_class']);
    add_action('admin_head-profile.php', ['UipressLite\Classes\Pages\FramedPages', 'remove_admin_color_scheme']);
  }

  /**
   * Adds filter to remove admin color scheme
   *
   * @return void
   * @since 3.2.13
   */
  public static function remove_admin_color_scheme()
  {
    remove_action('admin_color_scheme_picker', 'admin_color_scheme_picker');
  }

  /**
   * Pushes a class to body to framed pages
   *
   * @since 2.2.8
   */
  public static function push_body_class($classes)
  {
    $classes .= ' uip-user-frame';
    return $classes;
  }

  /**
   * Adds data attributes to the html tag
   *
   * @since 3.0.0
   */
  public static function html_attributes()
  {
    $data = '';
    $data .= 'uip-framed-page="true" ';

    // Check if screenOptions are disabled
    $screenOptions = isset($_GET['uip-hide-screen-options']) ? $_GET['uip-hide-screen-options'] : false;
    $data .= $screenOptions == '1' ? 'uip-hide-screen-options="true" ' : '';

    $helpTab = isset($_GET['uip-hide-help-tab']) ? $_GET['uip-hide-help-tab'] : false;
    $data .= $helpTab == '1' ? 'uip-hide-help-tab="true" ' : '';

    $notices = isset($_GET['uip-hide-notices']) ? $_GET['uip-hide-notices'] : false;
    $data .= $notices == '1' ? 'uip-hide-notices="true" ' : '';

    $theme = isset($_GET['uip-default-theme']) ? $_GET['uip-default-theme'] : false;
    $data .= $theme == '1' ? 'uip-admin-theme="false" ' : 'uip-admin-theme="true" ';

    $darkTheme = UserPreferences::get('darkTheme');
    $data .= $darkTheme ? 'data-theme="dark" ' : 'data-theme="light" ';

    echo wp_kses_post($data);
  }
}