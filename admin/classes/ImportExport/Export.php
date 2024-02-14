<?php
namespace UipressLite\Classes\ImportExport;
use UipressLite\Classes\PostTypes\UiTemplates;
use UipressLite\Classes\App\UipOptions;
use UipressLite\Classes\Utils\Sanitize;

!defined("ABSPATH") ? exit() : "";

class Export
{
  /**
   * Gets specific export options and returns result to caller
   *
   * @param object $options
   *
   * @return object
   * @since 3.2.1.3
   */
  public static function get($options)
  {
    $templates = [];
    if ($options->templates) {
      $templates = self::templates();
    }

    $siteSettings = [];
    if ($options->siteSettings || $options->themeStyles) {
      $siteSettings = self::site_settings();
    }

    // Remove unselected properties
    if (!$options->themeStyles) {
      if (isset($siteSettings["theme-styles"])) {
        unset($siteSettings["theme-styles"]);
      }
    }

    // Remove unselected properties
    if (!$options->siteSettings && $options->themeStyles) {
      if ($siteSettings["theme-styles"]) {
        unset($siteSettings["block_preset_styles"]);
        unset($siteSettings["google_analytics"]);
        unset($siteSettings["role_redirects"]);
        unset($siteSettings["site-settings"]);
      }
    }

    $menus = [];
    if ($options->adminMenus) {
      $menus = self::admin_menus();
    }

    $returndata = [];
    $returndata["templates"] = $templates;
    $returndata["siteSettings"] = $siteSettings;
    $returndata["menus"] = $menus;

    return $returndata;
  }

  /**
   * Adds a rest API endpoint for sites with site sync enabled
   *
   * @return void
   * @since 3.2.13
   */
  public static function push_to_rest()
  {
    register_rest_route("uipress/v1", "/export", [
      "methods" => "GET",
      "callback" => ["UipressLite\Classes\ImportExport\Export", "rest_export_response"],
      "permission_callback" => "__return_true",
      "args" => [
        "key" => [
          "validate_callback" => function ($param, $request, $key) {
            return is_string($param);
          },
        ],
        "sync_options" => [
          "validate_callback" => function ($param, $request, $key) {
            return is_object(json_decode($param));
          },
        ],
      ],
    ]);
  }

  /**
   * Handles rest response for site export
   *
   * @param object $request - the rest request
   *
   * @return
   * @since 3.2.13
   */
  public static function rest_export_response($request)
  {
    $options = json_decode(stripslashes($request->get_param("sync_options")));
    $options = Sanitize::clean_input_with_code($options);

    $key = sanitize_text_field($request->get_param("key"));

    $siteOptions = UipOptions::get("remote-sync");

    if (!$key || !$options || !isset($siteOptions["key"])) {
      $returndata = [];
      $returndata["error"] = true;
      $returndata["message"] = __("Incorrect key", "uipress-lite");
      return new \WP_REST_Response($returndata, 200);
    }

    if ($siteOptions["key"] != $key) {
      $returndata = [];
      $returndata["error"] = true;
      $returndata["message"] = __("Incorrect key", "uipress-lite");
      return new \WP_REST_Response($returndata, 200);
    }

    $export = self::get($options);

    $returndata = [];
    $returndata["success"] = true;
    $returndata["message"] = "Success";
    $returndata["export"] = $export;

    // Return the response.
    return new \WP_REST_Response($export, 200);
  }

  /**
   * Get's all templates for export
   *
   * @return array of templates
   * @since 3.2.13
   */
  private static function templates()
  {
    $query = UiTemplates::list(["perPage" => -1, "search" => ""]);
    $totalFound = $query->found_posts;
    $foundPosts = $query->get_posts();

    $formattedTemplates = [];

    foreach ($foundPosts as $item) {
      $formattedTemplates[] = UiTemplates::format_for_export($item);
    }

    return $formattedTemplates;
  }

  /**
   * Exports site settings object
   *
   * @return object settings
   * @since 3.2.13
   */
  private static function site_settings()
  {
    $options = UipOptions::get();

    if ($options["uip_pro"]) {
      unset($options["uip_pro"]);
    }
    if ($options["remote-sync"]) {
      unset($options["remote-sync"]);
    }

    return $options;
  }

  /**
   * Exports admin menus
   *
   * @since 3.2.13
   */
  public static function admin_menus()
  {
    //Get template
    $args = [
      "post_type" => "uip-admin-menu",
      "posts_per_page" => -1,
      "post_status" => ["publish", "draft"],
    ];

    $query = new \WP_Query($args);
    $totalFound = $query->found_posts;
    $foundPosts = $query->get_posts();

    $formattedMenus = [];

    foreach ($foundPosts as $item) {
      $menuOptions = get_post_meta($item->ID, "uip_menu_settings", true);

      $uid = get_post_meta($item->ID, "uip-uid", true);
      if (!$uid) {
        $uid = uniqid("uip-", true);
        update_post_meta($item->ID, "uip-uid", $uid);
      }

      //Return data to app
      $returndata = [];
      $returndata["name"] = get_the_title($item->ID);
      $returndata["settings"] = $menuOptions;
      $returndata["status"] = get_post_status($item->ID);
      $returndata["uid"] = $uid;

      $formattedMenus[] = $returndata;
    }
    return $formattedMenus;
  }
}
