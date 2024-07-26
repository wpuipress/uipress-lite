<?php
namespace UipressLite\Classes\Templates;

// Prevent direct access to this file
defined("ABSPATH") || exit();

/**
 * Class Interface
 *
 * Main class for initialising the uipress interfaces.
 */
class UipInterface
{
  /**
   * woobase constructor.
   *
   * Initialises the main app.
   */
  public function __construct()
  {
    add_action("init", ["UipressLite\Classes\Templates\UipInterface", "woobase_languages_loader"]);
  }

  /**
   * Loads translation files
   *
   * @since 1.0.8
   */
  public static function woobase_languages_loader()
  {
    load_plugin_textdomain("uipress-lite", false, dirname(dirname(plugin_basename(__FILE__))) . "/languages");

    add_action("wp_enqueue_scripts", ["UipressLite\Classes\Templates\UipInterface", "load_base_script"]);
  }

  /**
   * Triggers actions for plugins
   *
   * Allows plugins to hook into woobase pages
   */
  public static function start_uipress()
  {
    // Triggers pro actions for builder
    do_action("uipress/app/start");
  }

  /**
   * woobase styles.
   *
   * Loads main lp styles
   */
  public static function load_styles()
  {
    // Get plugin url
    $url = plugins_url("woobase/");
    $style = $url . "app/dist/assets/styles/style.css";
    wp_enqueue_style("woobase", $style, []);
  }

  /**
   * woobase scripts.
   *
   * Loads main lp scripts
   */
  public static function load_base_script()
  {
    // Get plugin url
    $url = plugins_url("uipress-lite/");
    $script_name = self::get_base_script_path();

    if (!$script_name) {
      return;
    }

    wp_register_script_module("uipress-lite", $url . "app/dist/{$script_name}", ["wp-i18n"], null);
    wp_enqueue_script_module("uipress-lite");

    self::output_script_attributes();

    // Set up translations
    wp_enqueue_script("uipress-lite", $url . "assets/js/uip-translations.js", ["wp-i18n"], false);
    wp_set_script_translations("uipress-lite", "uipress-lite", woobase_plugin_path . "/languages/");
  }

  /**
   * Get the path of the Vite-built base script.
   *
   * This function reads the Vite manifest file and finds the compiled filename
   * for the 'woobase.js' entry point. It uses WordPress file reading functions
   * for better compatibility and security.
   *
   * @return string|null The filename of the compiled base script, or null if not found.
   */
  private static function get_base_script_path()
  {
    $manifest_path = uip_plugin_path . "app/dist/.vite/manifest.json";

    if (!file_exists($manifest_path)) {
      return null;
    }

    $manifest_content = file_get_contents($manifest_path);
    if ($manifest_content === false) {
      return null;
    }

    $manifest = json_decode($manifest_content, true);
    if (!is_array($manifest)) {
      return null;
    }

    foreach ($manifest as $key => $value) {
      if (isset($value["src"]) && $value["src"] === "uipinterface.js") {
        return $value["file"];
      }
    }

    return null;
  }

  /**
   * Adds custom attributes to a custom woobase script tag
   *
   * @return string
   */
  public static function output_script_attributes()
  {
    // Get plugin url
    $url = plugins_url("woobase/");
    $rest_base = get_rest_url();
    $rest_nonce = wp_create_nonce("wp_rest");
    $admin_url = get_admin_url();

    // User
    // Get the current user object
    $current_user = wp_get_current_user();
    $first_name = $current_user->first_name;

    // If first name is empty, fall back to display name
    if (empty($first_name)) {
      $first_name = $current_user->display_name;
    }

    // Get the user's email
    $email = $current_user->user_email;

    $frontPage = is_admin() ? "false" : "true";

    $manageOptions = current_user_can("manage_options") ? "true" : "false";

    $options = get_site_option("woobase_settings", false);
    $options = !$options ? [] : $options;
    // Remove the 'license_key' key
    unset($options["license_key"]);
    unset($options["instance_id"]);

    $currency = "";
    if (function_exists("get_woocommerce_currency")) {
      $currency = get_woocommerce_currency();
    }

    // Allow plugins to inject styles to woobase
    $styles = ["woobase"];
    $styles = apply_filters("woobase/app/styles", $styles);

    $reviews_enabled = false;
    if (function_exists("wc_reviews_enabled")) {
      $reviews_enabled = wc_reviews_enabled();
    }

    // Setup script object
    $builderScript = [
      "plugin-base" => esc_url($url),
      "rest-base" => esc_url($rest_base),
      "rest-nonce" => esc_attr($rest_nonce),
      "admin-url" => esc_url($admin_url),
      "user-id" => esc_attr(get_current_user_id()),
      "user-name" => esc_attr($first_name),
      "user-email" => esc_attr($email),
      "site-url" => esc_url(get_home_url()),
      "front-page" => esc_attr($frontPage),
      "can-manage-options" => $manageOptions ? "true" : "false",
      "is-shop-manager" => self::is_shop_manager() ? "true" : "false",
      "woobase-settings" => esc_attr(json_encode($options)),
      "wc-currency" => $currency,
      "styles" => esc_attr(json_encode($styles)),
      "plugins" => esc_attr(json_encode(self::get_active_plugin_names())),
      "reviews_enabled" => $reviews_enabled ? "true" : "false",
      "id" => "woobase-js",
    ];

    wp_print_script_tag($builderScript);
  }

  /**
   * Get an array of active plugin names in WordPress
   *
   * @return array An array of active plugin names
   */
  private static function get_active_plugin_names()
  {
    $active_plugins = get_option("active_plugins");
    $plugin_names = [];
    $required_plugins = ["wp-seopress"];

    foreach ($active_plugins as $plugin) {
      $plugin_data = get_plugin_data(WP_PLUGIN_DIR . "/" . $plugin);
      if (in_array($plugin_data["TextDomain"], $required_plugins)) {
        $plugin_names[] = $plugin_data["TextDomain"];
      }
    }

    return $plugin_names;
  }
}
