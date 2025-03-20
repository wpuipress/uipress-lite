<?php
namespace UipressLite\Classes\Pages;
use UipressLite\Classes\Utils\URL;
use UipressLite\Classes\Utils\Sanitize;
use UipressLite\Classes\App\UserPreferences;
use UipressLite\Classes\Scripts\ToolBar;
use UipressLite\Classes\Scripts\AdminMenu;
use UipressLite\Classes\PostTypes\UiTemplates;
use UipressLite\Classes\Scripts\UipScripts;

!defined("ABSPATH") ? exit() : "";

class BackEnd
{
  private static $screen;
  /**
   * Starts actions required to handle back end app
   *
   * @return void
   */
  public static function start()
  {
    add_action("admin_init", ["UipressLite\Classes\Pages\BackEnd", "actions"], 0);
  }

  /**
   * Handles front end actions
   *
   * @return void
   * @since 3.2.13
   */
  public static function actions()
  {
    // Template is missing required blocks so exit
    if (!self::should_uipress_run()) {
      return;
    }

    self::output_template();
    self::add_hooks();
    //add_action("admin_enqueue_scripts", ["UipressLite\Classes\Pages\BackEnd", "remove_scripts"], 100);
    //add_action("script_loader_tag", ["UipressLite\Classes\Pages\BackEnd", "add_type_attribute_to_admin_scripts"], 10, 3);
  }

  /**
   * Returns whether we are on a mainwp page
   *
   */
  private static function is_mainwp_page()
  {
    // Get screen
    self::$screen = get_current_screen();
    return is_object(self::$screen) && isset(self::$screen->id) && strpos(self::$screen->id, "mainwp") !== false;
  }

  /**
   * Checks for specific pages and disables uipress
   *
   * @return boolean
   */
  public static function should_uipress_run()
  {
    if (defined("uip_app_running") && uip_app_running === false) {
      return false;
    }

    return true;
  }

  /**
   * Adds the 'type="text/plain"' attribute to script tags in the WordPress admin area,
   * excluding specific script handles, and preserves the original type attribute in a
   * custom 'data-uip-type' attribute.
   *
   * @param string $tag   The HTML script tag.
   * @param string $handle The script handle.
   * @param string $src   The script source URL.
   *
   * @return string The modified script tag.
   */
  public static function add_type_attribute_to_admin_scripts($tag, $handle, $src)
  {
    $skipTags = [
      "wp-i18n",
      "uip-translations",
      "common",
      "hoverintent-js",
      "admin-bar",
      "jquery-ui-core",
      "jquery-ui-menu",
      "jquery-ui-autocomplete",
      "tags-suggest",
      "inline-edit-post",
      "heartbeat",
      "svg-painter",
    ];

    if (is_admin() && !in_array($handle, $skipTags, true) && strpos($handle, "wp-") !== 0) {
      // Check if the script tag already has a type attribute
      if (strpos($tag, "type=") !== false) {
        // Extract the original type attribute value
        if (preg_match('/type=[\'"]?([^\'" >]+)/', $tag, $matches)) {
          $original_type = $matches[1];
          // Add the original type to the data-uip-type attribute
          $tag = str_replace("<script", '<script data-uip-type="' . htmlspecialchars($original_type, ENT_QUOTES, "UTF-8") . '"', $tag);
          // Replace the existing type attribute with text/plain
          $tag = str_replace("type='{$original_type}'", "type='text/plain'", $tag);
          $tag = str_replace('type="' . $original_type . '"', 'type="text/plain"', $tag);
        }
      } else {
        // Add the type and data-uip-type attributes if they don't exist
        $tag = str_replace("<script", '<script type="text/plain" data-uip-type="empty"', $tag);
      }
    }

    return $tag;
  }

  /**
   * Removes all non-standard scripts
   */
  public static function remove_scripts()
  {
    $defaultScripts = []; // Add any default scripts you want to keep

    // Remove all standard admin scripts
    global $wp_scripts;
    if (isset($wp_scripts->queue)) {
      foreach ($wp_scripts->queue as $handle) {
        // Don't dequeue core scripts
        if (in_array($handle, $defaultScripts)) {
          continue;
        }

        // Don't dequeue specific scripts
        if (strpos($handle, "uip") !== false) {
          continue;
        }

        wp_dequeue_script($handle);
        wp_deregister_script($handle);
      }
    }
  }

  /**
   * Flags non secure connection
   *
   * @since 3.3.1
   */
  public static function secure_connection_flag()
  {
    $class = "notice notice-warning";
    $message = __("uiPress needs a secure connection to load templates. Please ensure site is loaded over HTTPS", "uipress-pro");

    printf('<div class="%1$s"><p>%2$s</p></div>', esc_attr($class), esc_html($message));
  }

  /**
   * Checks for a secure connection
   *
   * @return void
   * @since 3.3.1
   */
  private static function check_for_secure_conection()
  {
    if (!empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off") {
      // The request is using HTTPS
      return true;
    } elseif (isset($_SERVER["HTTP_X_FORWARDED_PROTO"]) && $_SERVER["HTTP_X_FORWARDED_PROTO"] == "https") {
      // Check for HTTP_X_FORWARDED_PROTO headers in case of reverse proxy
      // This header can be set by load balancers or reverse proxies to indicate the original protocol used.
      return true;
    } else {
      // The request is using HTTP
      return false;
    }
  }

  /**
   * Set's active template id as transient
   *
   * @param object $template - the template object
   * @param number $user_id - the current user id
   *
   * @since 3.3.095
   */
  private static function define_active_transient($template, $user_id)
  {
    $transient_name = "uip_template_active_" . $user_id;
    $transient_value = $template->ID;

    set_transient($transient_name, $transient_value, 0);
  }

  /**
   * Adds hooks for front end templates
   *
   * @return void
   * @since 3.2.13
   */
  private static function add_hooks()
  {
    //ToolBar::capture();
    //AdminMenu::capture();

    add_action("admin_enqueue_scripts", ["UipressLite\Classes\Scripts\UipScripts", "add_translations"]);
    add_filter("admin_xml_ns", ["UipressLite\Classes\Pages\BackEnd", "add_dark_mode"]);
    add_action("admin_bar_init", ["UipressLite\Classes\Scripts\UipScripts", "remove_admin_bar_style"]);
    add_action("admin_enqueue_scripts", ["UipressLite\Classes\Scripts\UipScripts", "add_uipress_styles"]);
  }

  /**
   * Pushes dark mode attribute to HTML
   *
   * @param string $attr - current attributes
   *
   * @return void
   * @since 3.2.13
   */
  public static function add_dark_mode()
  {
    $data = ' uip-core-app="true" ';
    $darkTheme = UserPreferences::get("darkTheme");
    $data .= $darkTheme ? ' data-theme="dark" ' : ' data-theme="light" ';
    echo wp_kses_post($data);
  }

  /**
   * Outputs template to javascript variable
   *
   * @param object $template - the template post object
   * @return void
   */
  private static function output_template()
  {
    // Create anonymous function so we can use the template string at runtime
    $outputter = function () {
      do_action("uip_import_pro_front");
    };

    // Output template after admin bar render
    add_action("admin_footer", $outputter, 1);
    add_action("admin_enqueue_scripts", ["UipressLite\Classes\Pages\BackEnd", "output_data_attributes"], 2);
    add_action("admin_enqueue_scripts", ["UipressLite\Classes\Pages\BackEnd", "load_uip_script"], 3);
  }

  public static function output_data_attributes()
  {
    UipScripts::add_uip_app("ui-template", null);
  }

  /**
   * Loads the main script for the build
   *
   * @return void
   */
  public static function load_uip_script()
  {
    // Don't load on mainwp
    if (self::is_mainwp_page()) {
      return;
    }

    $script_name = UipScripts::get_base_script_path("uipinterface");

    if (!$script_name) {
      return;
    }

    wp_print_script_tag([
      "id" => "uip-interface-js",
      "src" => uip_plugin_url . "app/dist/{$script_name}",
      "type" => "module",
    ]);

    $app = "<style id='uipress-body-hider'>body{opacity: 0}html[uip-core-app=true]{padding-top: 0 !important}</style>";

    echo wp_kses_post($app);
  }
}
