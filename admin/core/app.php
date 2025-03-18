<?php

use UipressLite\Classes\Scripts\UipScripts;
use UipressLite\Classes\Pages\FramedPages;
use UipressLite\Classes\Pages\FrontEnd;
use UipressLite\Classes\Pages\BackEnd;
use UipressLite\Classes\Pages\AdminPage;
use UipressLite\Classes\Rest\ErrorLog;
use UipressLite\Classes\Rest\MultisiteTemplateHandler;

// Exit if accessed directly
!defined("ABSPATH") ? exit() : "";

/**
 * Main uipress class. Loads scripts and styles and builds the main admin framework
 *
 * @since 3.0.0
 */
class uip_app
{
  /**
   * Starts uipress functions
   *
   * @since 3.0.0
   */
  public function run()
  {
    $this->add_hooks();

    // Start the error log rest endpoint
    new ErrorLog();
    new MultisiteTemplateHandler();
  }

  /**
   * Adds required hooks for uiPress
   *
   * @return void
   * @since 3.2.13
   */
  private function add_hooks()
  {
    add_filter("plugin_action_links_uipress-lite/uipress-lite.php", ["UipressLite\Classes\Tables\PluginsTable", "add_builder_link"]);
    add_action("plugins_loaded", [$this, "start_uipress_app"], 1);
    add_filter("register_post_type_args", [$this, "ensure_rest_for_admin_menus"], 10, 2);
    add_filter("rest_api_init", [$this, "ensure_rest_fields_for_admin_menus"]);
    add_action("admin_menu", [$this, "push_menu_ids_to_dom"], 999);
  }

  public static function ensure_rest_for_admin_menus($args, $post_type)
  {
    if ($post_type === "uip-admin-menu") {
      $args["show_in_rest"] = true;

      // Optionally configure REST API settings
      $args["rest_base"] = "uip-admin-menu"; // The base URL in REST API
      $args["rest_controller_class"] = "WP_REST_Posts_Controller";
    }

    return $args;
  }

  public static function ensure_rest_fields_for_admin_menus()
  {
    register_rest_field("uip-admin-menu", "uipress", [
      "get_callback" => function ($post) {
        $settings = get_post_meta($post["id"], "uip_menu_settings", true);
        $json_encoded = json_encode($settings);
        $decoded = html_entity_decode($json_encoded, ENT_QUOTES | ENT_HTML5, "UTF-8");

        return [
          "settings" => json_decode($decoded),
          "forRoles" => get_post_meta($post["id"], "uip-menu-for-roles", true),
          "forUsers" => get_post_meta($post["id"], "uip-menu-for-users", true),
          "excludesRoles" => get_post_meta($post["id"], "uip-menu-excludes-roles", true),
          "excludesUsers" => get_post_meta($post["id"], "uip-menu-excludes-users", true),
        ];
      },
    ]);
  }

  function push_menu_ids_to_dom()
  {
    global $menu, $submenu;

    if (is_array($menu)) {
      foreach ($menu as $priority => $item) {
        if (!isset($item[5])) {
          continue;
        }

        $current_title = $item[0];
        $id = $item[5];
        $id_holder = "<span style='display:none' class='uip-id-holder'>{$id}</span>";
        $menu[$priority][0] = $current_title . $id_holder;
      }
    }

    if (!is_array($submenu)) {
      return;
    }

    // Loop through each submenu
    foreach ($submenu as $parent_slug => $menu_items) {
      foreach ($menu_items as $priority => $menu_item) {
        $current_title = $submenu[$parent_slug][$priority][0];
        $id = $submenu[$parent_slug][$priority][2];
        $id_holder = "<span style='display:none' class='uip-id-holder'>{$id}</span>";
        $submenu[$parent_slug][$priority][0] = $current_title . $id_holder;
      }
    }
  }

  private static function decode_settings_object($settings)
  {
    // If settings is a string (JSON)
    if (is_string($settings)) {
      $settings = json_decode($settings, true);
    }

    // Recursive function to decode all values in the array/object
    function decode_array_values(&$array)
    {
      foreach ($array as &$value) {
        if (is_array($value)) {
          decode_array_values($value);
        } elseif (is_string($value)) {
          $value = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, "UTF-8");
        }
      }
    }

    // Decode the settings
    decode_array_values($settings);
    return $settings;
  }

  /**
   * Adds required actions and filters depending if we are on admin page, login page or uipress framed page
   *
   * @since 3.0.0
   */
  public function start_uipress_app()
  {
    // Define app constants
    $this->define_constants();

    // Checks if the app should be running at all
    if ($this->should_we_exit()) {
      return;
    }

    // White list uiPress scripts / styles with other plugins
    UipScripts::whitelist_plugins();

    // Check if we are in the builder / iframe
    if (self::is_framed_page()) {
      FramedPages::start();
      AdminPage::start(true);
      return;
    }

    $this->start_apps();

    add_action("admin_footer", ["UipressLite\Classes\Scripts\UipScripts", "output_user_styles"], 0);
  }

  /**
   * Checks if we are in a framed page
   *
   * @return boolean
   */
  private static function is_framed_page()
  {
    return isset($_SERVER["HTTP_SEC_FETCH_DEST"]) && strtolower($_SERVER["HTTP_SEC_FETCH_DEST"]) === "iframe";
  }

  /**
   * Starts up uipress apps
   *
   * @return void
   * @since 3.2.13
   */
  private function start_apps()
  {
    // Triggers pro actions for builder
    do_action("uipress/app/start");

    FrontEnd::start();
    BackEnd::start();
    AdminPage::start(false);
  }

  /**
   * Defines plugin constants
   *
   * @since 3.2.13
   */
  private function define_constants()
  {
    //define("uip_plugin_url", plugins_url("uipress-lite/"));
  }

  /**
   * Returns whether the plugin should be running.
   *
   * True if it shouldn't be, false otherwise
   *
   * @return boolean
   * @since 3.2.13
   */
  private function should_we_exit()
  {
    global $pagenow;

    return $pagenow === "customize.php" || $pagenow === "site-editor.php" || wp_doing_cron() || wp_doing_ajax() || (defined("REST_REQUEST") && REST_REQUEST);
  }
}
