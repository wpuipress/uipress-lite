<?php
namespace UipressLite\Classes\ImportExport;
use UipressLite\Classes\PostTypes\UiTemplates;
use UipressLite\Classes\App\UipOptions;

!defined("ABSPATH") ? exit() : "";

class Import
{
  /**
   * handles cron auto import function
   *
   * @return void
   * @since 3.2.13
   */
  public function cron_auto_import()
  {
    $options = UipOptions::get("remote-sync");
    $syncOptions = $options["syncOptions"];

    $response = self::get_remote($syncOptions);

    if (isset($response["error"])) {
      error_log("Unable to automatically sync uipress settings: " . $response["message"]);
    } else {
      error_log("uiPress settings automatically synced successfully");
    }
  }
  /**
   * Handles uipress imports from a remote URL
   *
   * @param object $options
   *
   * @return  object | whether the import was successful or not
   * @since 3.2.1.3
   */
  public static function get_remote($options)
  {
    $types = $options->importOptions;
    $path = $options->path;
    $key = $options->key;

    // Missing required params
    if (!$path || !$key || !is_object($types)) {
      $returndata["error"] = true;
      $returndata["message"] = __("Missing data required for import", "uipress-lite");
      return $returndata;
    }

    $url = $path . "?key=" . $key . "&sync_options=" . wp_json_encode($types);

    $response = wp_remote_get($url);

    if (is_array($response) && !is_wp_error($response) && 200 === wp_remote_retrieve_response_code($response)) {
      $headers = $response["headers"]; // array of http header lines
      $body = $response["body"]; // use the content
    } else {
      $returndata["error"] = true;
      $returndata["message"] = __("Unable to connect to host site", "uipress-lite");
      return $returndata;
    }

    // Unable to decode response
    if (!is_object(json_decode($body))) {
      $returndata["error"] = true;
      $returndata["message"] = __("Unable to connect to host site", "uipress-lite");
      return $returndata;
    }

    $content = json_decode($body);

    if (property_exists($content, "error")) {
      $returndata["error"] = true;
      $returndata["message"] = $content->message;
      return $returndata;
    }

    //Templates
    if (property_exists($content, "templates")) {
      self::templates($content->templates);
    }

    //Settings
    if (property_exists($content, "siteSettings")) {
      self::settings($content->siteSettings);
    }

    //Menus
    if (property_exists($content, "menus")) {
      self::menus($content->menus);
    }

    $returndata["success"] = true;
    $returndata["message"] = __("Improted", "uipress-lite");
    return $returndata;
  }

  /**
   * Imports templates
   *
   * @param array $templates - array of templates to import
   *
   * @return void
   * @since 3.2.13
   */
  public static function templates($templates)
  {
    // Exit early if $templates are not an array
    if (!is_array($templates)) {
      return;
    }

    foreach ($templates as $template) {
      $existingID = false;

      // Check to see if the template already exists and therefor should be updated
      if (property_exists($template, "uid") && $template->uid) {
        $existingID = UiTemplates::get_by_uid($template->uid);
      }

      $name = wp_strip_all_tags($template->name);
      $status = $template->status;

      $args = [
        "post_title" => $name,
        "post_status" => $status,
        "post_type" => "uip-ui-template",
      ];

      // Update post if template already exists
      if ($existingID) {
        $args["ID"] = $existingID;
        wp_update_post($args);
      } else {
        $existingID = wp_insert_post($args);
      }

      // Failed to import
      if (!$existingID) {
        continue;
      }

      UiTemplates::update_settings($existingID, $template->settings, $template->type, $template->subsites, $template->content);

      if (property_exists($template, "uid") && $template->uid) {
        update_post_meta($existingID, "uip-uid", $template->uid);
      }

      update_post_meta($existingID, "uip-template-for-roles", $template->forRoles);
      update_post_meta($existingID, "uip-template-for-users", $template->forUsers);
      update_post_meta($existingID, "uip-template-excludes-roles", $template->excludesRoles);
      update_post_meta($existingID, "uip-template-excludes-users", $template->excludesUsers);
    }
  }

  /**
   * Import settings from global import
   *
   * @param object $settings the settings object to update to
   *
   * @return void
   * @since 3.1.13
   */
  public static function settings($settings)
  {
    // Settings don't exist so exit early
    if (!$settings || !is_object($settings)) {
      return;
    }

    // Get global options
    $currentOptions = UipOptions::get();
    if (!$currentOptions) {
      $currentOptions = [];
    }

    // Skim out unnecessary keys
    foreach ($settings as $key => $value) {
      if ($key != "theme-styles") {
        $value = (array) $value;
      }
      $currentOptions[$key] = $value;
    }

    UipOptions::update(null, $currentOptions);
  }

  /**
   * Import menus from global import
   *
   * @param array $menus
   *
   * @return void
   * @since 3.2.13
   */
  public static function menus($menus)
  {
    // Exit early if not an array
    if (!is_array($menus)) {
      return;
    }

    foreach ($menus as $menu) {
      $tempID = false;

      // Check to see if the template already exists and therefor should be updated
      if (property_exists($menu, "uid") && $menu->uid) {
        $args = [
          "post_type" => "uip-admin-menu",
          "posts_per_page" => 1,
          "post_status" => ["publish", "draft"],
          "meta_query" => [
            [
              "key" => "uip-uid",
              "value" => $menu->uid,
              "compare" => "=",
            ],
          ],
        ];

        $query = new \WP_Query($args);
        $foundTemplates = $query->get_posts();
        if (count($foundTemplates) > 0) {
          $tempID = $foundTemplates[0]->ID;
        }
      }

      $args = [
        "post_title" => wp_strip_all_tags($menu->name),
        "post_status" => $menu->status,
        "post_type" => "uip-admin-menu",
      ];

      if ($tempID) {
        $args["ID"] = $tempID;
        wp_update_post($args);
      } else {
        $tempID = wp_insert_post($args);
      }

      if (!$tempID) {
        continue;
      }

      if (property_exists($menu, "uid") && $menu->uid) {
        update_post_meta($tempID, "uip-uid", $menu->uid);
      }

      update_post_meta($tempID, "uip_menu_settings", $menu->settings);
    }
  }
}
