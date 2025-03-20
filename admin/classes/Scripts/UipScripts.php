<?php
namespace UipressLite\Classes\Scripts;
use UipressLite\Classes\App\UipOptions;
use UipressLite\Classes\Utils\Objects;
use UipressLite\Classes\Utils\Sanitize;
use UipressLite\Classes\App\UserPreferences;
use UipressLite\Classes\PostTypes\UiTemplates;
use UipressLite\Classes\App\AppOptions;

!defined("ABSPATH") ? exit() : "";

class UipScripts
{
  /**
   * Loads translations script
   *
   * @return void
   */
  public static function add_translations()
  {
    wp_enqueue_script("uip-translations", uip_plugin_url . "assets/js/uip-translations.js", ["wp-i18n"], uip_plugin_version);
    wp_set_script_translations("uip-translations", "uipress-lite", uip_plugin_path . "/languages/");
  }

  /**
   * Removes non standard styles from the app page
   *
   * @since 3.1.1
   */
  public static function remove_non_standard_styles()
  {
    global $wp_styles;
    if (isset($wp_styles->registered["admin-bar"])) {
      $wp_styles->registered["admin-bar"]->src = uip_plugin_url . "assets/css/modules/uip-blank.css";
    }
  }

  /**
   * Enqueues uipress stylesheet
   *
   * @return void
   */
  public static function add_uipress_styles()
  {
    if (is_rtl()) {
      wp_register_style("uip-app", uip_plugin_url . "assets/css/uip-app-rtl.css", [], uip_plugin_version);
      wp_enqueue_style("uip-app");
    } else {
      wp_register_style("uip-app", uip_plugin_url . "assets/css/uip-app.css", [], uip_plugin_version);
      wp_enqueue_style("uip-app");
    }

    self::replace_admin_bar_styles_for_headless();

    //wp_register_style("uipress-normalize", uip_plugin_url . "app/dist/assets/styles/style.css", [], uip_plugin_version);
    //wp_enqueue_style("uipress-normalize");
  }

  /**
   * Dequeue default admin bar styles and re-enqueue with custom handle
   * for conditional removal in headless setup
   */
  private static function replace_admin_bar_styles_for_headless()
  {
    // Only proceed if admin bar is showing
    if (!is_admin_bar_showing()) {
      return;
    }

    // Get the original admin bar style URL
    global $wp_styles, $wp_version;
    $original_src = "";

    if (isset($wp_styles->registered["admin-bar"])) {
      // Store the original source URL
      $original_src = $wp_styles->registered["admin-bar"]->src;
      $original_deps = $wp_styles->registered["admin-bar"]->deps;
      $original_ver = $wp_styles->registered["admin-bar"]->ver;

      // Dequeue the original admin bar styles
      wp_dequeue_style("admin-bar");
      wp_deregister_style("admin-bar");

      // Build the admin-bar styles URL
      $url = admin_url("load-styles.php");

      // Add query parameters
      $query_params = [
        "c" => 1,
        "dir" => is_rtl() ? "rtl" : "ltr",
        "load" => "admin-bar",
      ];

      // Combine URL and query parameters
      $url = add_query_arg($query_params, $url);

      wp_register_style("uipress-admin-bar", $url, ["dashicons"], $wp_version);
      wp_enqueue_style("uipress-admin-bar");

      // Re-register with custom handle
      //wp_register_style("uipress-admin-bar", $original_src, $original_deps, $original_ver);

      // Enqueue with the new handle
      //wp_enqueue_style("uipress-admin-bar");
    }
  }

  /**
   * Loads a small stylesheet specific for framed pages
   *
   * @since 3.0.8
   */
  public static function add_frame_styles()
  {
    wp_register_style("uip-frame", uip_plugin_url . "assets/css/modules/uip-frame.css", [], uip_plugin_version);
    wp_enqueue_style("uip-frame");
  }

  /**
   * White lists uipress with plugins that normally strip styles
   *
   * @since 3.0.6
   */
  public static function whitelist_plugins()
  {
    //Mailpoet
    add_filter("mailpoet_conflict_resolver_whitelist_style", ["UipressLite\Classes\Scripts\UipScripts", "handle_script_whitelist"]);
    add_filter("mailpoet_conflict_resolver_whitelist_script", ["UipressLite\Classes\Scripts\UipScripts", "handle_script_whitelist"]);

    add_filter("fluentform_skip_no_conflict", fn() => false);
    add_filter("fluentcrm_skip_no_conflict", fn() => false);
    add_filter("fluent_crm/skip_no_conflict", fn() => false);
    add_filter("fluent_form/skip_no_conflict", fn() => false);
  }

  /**
   * Mailpoet white list functions
   *
   * @param array $scripts array of scripts / styles
   *
   * @return array
   * @since 3.2.13
   */
  public static function handle_script_whitelist($scripts)
  {
    $scripts[] = "uipress-lite"; // plugin name to whitelist
    return $scripts;
  }

  /**
   * Removes style set for admin bar on front end
   *
   * @since 3.0.2
   */
  public static function remove_admin_bar_style()
  {
    remove_action("wp_head", "_admin_bar_bump_cb");
    add_filter("body_class", function ($classes) {
      return array_merge($classes, ["uip-no-admin-bar"]);
    });
  }

  public static function get_cache_key()
  {
    $is_multisite = false;
    if (is_multisite() && is_plugin_active_for_network(uip_plugin_path_name . "/uipress-lite.php") && !is_main_site()) {
      $is_multisite = true;
    }

    // Cache key
    $cache_key = get_option("uipress-cache-key", false);

    if ($cache_key === false) {
      $cache_key = bin2hex(random_bytes(6));
      update_option("uipress-cache-key", $cache_key);
    }

    if ($is_multisite) {
      restore_current_blog();
    }

    return $cache_key;
  }

  /**
   * Loads the main uip app
   *
   * @since 3.0.0
   */
  public static function add_uip_app($template_type = "ui-template", $template_id = null)
  {
    $nonce = wp_create_nonce("uip-security-nonce");
    $ajaxURL = admin_url("admin-ajax.php");
    $styles = UipOptions::get("theme-styles", true);
    $styles = is_object($styles) ? $styles : new \stdClass();

    $options = [
      "options" => Sanitize::clean_input_with_code(AppOptions::get_options()),
      "userPrefs" => Sanitize::clean_input_with_code(UserPreferences::get()),
      "themeStyles" => Sanitize::clean_input_with_code($styles),
    ];

    $rest_base = get_rest_url();
    $rest_nonce = wp_create_nonce("wp_rest");
    $base_url = plugins_url("uipress-lite/");
    $admin_url = get_admin_url();
    $site_url = get_home_url();
    $is_admin = is_admin();

    // Get the current user object
    $current_user = wp_get_current_user();
    $first_name = $current_user->first_name;
    $roles = (array) $current_user->roles;
    $roles = array_values($roles);

    // Cache key
    $cache_key = self::get_cache_key();

    $scriptData = [
      "id" => "uip-app-data",
      "rest-base" => esc_url($rest_base),
      "rest-nonce" => esc_attr($rest_nonce),
      "user-roles" => esc_attr(json_encode($roles)),
      "cache-key" => esc_attr($cache_key),
      "plugin-base" => esc_url($base_url),
      "admin-url" => esc_url($admin_url),
      "site-url" => esc_url($site_url),
      "is-admin" => esc_attr($is_admin),
      "template-type" => esc_attr($template_type),
      "template-id" => esc_attr($template_id),
      "user-id" => esc_attr($current_user->ID),
      "user-name" => esc_attr($current_user->user_name),
      "site-id" => esc_attr(get_current_blog_id()),
      "uip_ajax" => wp_json_encode(
        [
          "ajax_url" => $ajaxURL,
          "security" => $nonce,
          "uipAppData" => $options,
          "rest_url" => $rest_base,
          "rest_nonce" => $rest_nonce,
          "rest_headers" => [
            "Content-Type" => "application/json",
            "X-WP-Nonce" => $rest_nonce,
          ],
        ],
        JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
      ),
    ];
    wp_print_script_tag($scriptData);

    //Check if the main app is running, if it is then we don't need to re-add ajax and required script data
    $variableFormatter = '
      var ajaxHolder = document.getElementById("uip-app-data");
      var ajaxData = ajaxHolder.getAttribute("uip_ajax");
      const uip_ajax = JSON.parse(ajaxData, (key, value) => {
        if (value === "1" || value === "true" || value === 1) return true;
        if (value === "0" || value === "false" || value === 0) return false;
        if (typeof value === "string" && !isNaN(value) && value.trim() !== "") {
          return Number(value);
        }
        if (value === "uiptrue") return true;
        if (value === "uipfalse") return false;
        if (value === "uipblank") return "";
        return value;
      });';
    wp_print_inline_script_tag($variableFormatter, ["id" => "uip-format-vars"]);
  }

  /**
   * Outputs user styles, custom css and variables
   *
   * @since 3.2.13
   */
  public static function output_user_styles()
  {
    // Check if we are on multisite, if we are then switch to primary blog
    $multiSiteActive = false;
    $user_id = get_current_user_id();
    $templateID = get_transient("uip_template_active_" . $user_id);

    if (is_multisite() && is_plugin_active_for_network(uip_plugin_path_name . "/uipress-lite.php") && !is_main_site()) {
      $mainSiteId = get_main_site_id();
      switch_to_blog($mainSiteId);
      $multiSiteActive = true;
    }

    // Get theme styles
    $styles = UipOptions::get("theme-styles");
    $styles = is_object($styles) ? $styles : new \stdClass();

    // Handle url requested styles

    if ($templateID && is_numeric($templateID)) {
      $settings = UiTemplates::get_settings($templateID);

      // Ensure object exists before checking
      Objects::ensureNested($settings, ["options", "advanced"]);
      $userCSS = isset($settings->options->advanced->css) ? html_entity_decode($settings->options->advanced->css) : "";
    }

    $userCSS = $userCSS ?? "";

    // Restore current blog if multisite is active
    $multiSiteActive ? restore_current_blog() : "";

    // Process light styles
    $lightStyles = "";
    foreach ($styles as $key => $value) {
      if (!isset($value->value) || !$value->value || $value->value == "uipblank") {
        continue;
      }
      $lightStyles .= "{$key}:{$value->value};";
    }

    // Process dark styles
    $darkStyles = "";
    foreach ($styles as $key => $value) {
      if (!isset($value->darkValue) || !$value->darkValue || $value->darkValue == "uipblank") {
        continue;
      }
      $darkStyles .= "{$key}:{$value->darkValue} !important;";
    }

    $allStyles = "
	html[data-theme='light']{{$lightStyles}}
	[data-theme='dark']{{$darkStyles}}
	{$userCSS}
	";

    $cleaned = htmlspecialchars_decode($allStyles);
    $allStyles = " <style id='uip-theme-styles'>{$cleaned}</style>";

    // Output code
    //echo Sanitize::clean_input_with_code($allStyles);
  }

  /**
   * Get the path of the Vite-built base script.
   *
   * This function reads the Vite manifest file and finds the compiled filename
   * for the 'uixpress.js' entry point. It uses WordPress file reading functions
   * for better compatibility and security.
   *
   * @return string|null The filename of the compiled base script, or null if not found.
   */
  public static function get_base_script_path($filename)
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
      if (isset($value["name"]) && $value["name"] === $filename) {
        return $value["file"];
      }
    }

    return null;
  }
}
