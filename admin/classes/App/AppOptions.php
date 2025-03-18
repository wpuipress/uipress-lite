<?php
namespace UipressLite\Classes\App;
use UipressLite\Classes\App\UipOptions;

!defined("ABSPATH") ? exit() : "";

class AppOptions
{
  /**
   * Returns app options
   *
   * @return array
   * @since 3.2.13
   */
  public static function get_options()
  {
    // Get mime types
    $all_mimes = get_allowed_mime_types();
    $types = array_diff($all_mimes, []);
    $cleanTypes = [];
    foreach ($types as $mime) {
      $cleanTypes[] = $mime;
    }

    // Set up app url
    $adminURL = get_admin_url();
    if (is_multisite()) {
      if (is_network_admin()) {
        $adminURL = network_admin_url("");
      }
    }
    $homeURL = get_home_url();
    $adminPath = str_replace($homeURL, "", $adminURL);

    // Sometime this is called on the frontend and get_plugins may not exist
    if (!function_exists("get_plugins")) {
      require_once ABSPATH . "wp-admin/includes/plugin.php";
    }

    $all_plugins = get_plugins();

    $formattedPlugins = [];
    foreach ($all_plugins as $key => $value) {
      $formattedPlugins[] = $key;
    }

    $formattedPostStatus = [];
    $postStatuses = get_post_stati([], "objects");
    foreach ($postStatuses as $status) {
      $temp = [];
      $temp["name"] = $status->name;
      $temp["label"] = $status->label;
      $formattedPostStatus[] = $temp;
    }

    $customClasses = [];
    $customClasses = apply_filters("uip_register_custom_class", false, $customClasses);

    $args = [
      "public" => true,
      "_builtin" => true,
    ];
    $output = "objects"; // or objects
    $operator = "and"; // 'and' or 'or'
    $taxonomies = get_taxonomies($args, $output, $operator);

    // Get locally activated plugins
    $active_plugins = get_option("active_plugins");

    // Get network activated plugins (if in multisite)
    $network_plugins = [];
    if (is_multisite()) {
      $network_plugins = get_site_option("active_sitewide_plugins");
      $network_plugins = array_keys($network_plugins);
    }

    $options["pluginURL"] = uip_plugin_url;
    $options["uipVersion"] = uip_plugin_version;
    $options["adminURL"] = $adminURL;
    $options["adminPath"] = $adminPath;
    $options["domain"] = get_home_url();
    $options["dynamicData"] = self::getDynamicData();
    $options["maxUpload"] = wp_max_upload_size();
    $options["uploadTypes"] = $cleanTypes;
    $options["locale"] = str_replace("_", "-", get_locale());
    $options["multisite"] = is_multisite();
    $options["networkActivated"] = is_plugin_active_for_network(uip_plugin_path_name . "/uipress-lite.php");
    $options["primarySite"] = is_main_site();
    $options["installedPlugins"] = $formattedPlugins;
    $options["activePlugins"] = array_unique(array_merge($active_plugins, $network_plugins));
    $options["post_statuses"] = $formattedPostStatus;
    $options["block_preset_styles"] = UipOptions::get("block_preset_styles");
    $options["site_name"] = get_bloginfo("name");
    $options["customClasses"] = $customClasses;
    $options["taxonomies"] = $taxonomies;

    return $options;
  }

  /**
   * Fetches dynamic data variable values
   *
   * @since 3.0.0
   */
  public static function getDynamicData()
  {
    $current_user = wp_get_current_user();

    $initials = "";
    if ($current_user->user_firstname != "") {
      $initials .= mb_substr($current_user->user_firstname, 0, 1);
    }
    if ($current_user->user_lastname != "") {
      $initials .= mb_substr($current_user->user_lastname, 0, 1);
    }

    if ($initials == "") {
      $initials .= mb_substr($current_user->user_login, 0, 1);
    }

    $plugins = get_plugins();
    $activePlugins = get_option("active_plugins");
    $inactive = count($plugins) - count($activePlugins);

    $adminURL = get_admin_url();
    if (is_multisite()) {
      if (is_network_admin()) {
        $adminURL = network_admin_url("");
      }
    }

    $loginPage = false;
    if (defined("uip_login_running")) {
      if (uip_login_running) {
        $loginPage = true;
      }
    }

    if (!$loginPage) {
      $options["userid"] = [
        "label" => __("User id", "uipress-lite"),
        "value" => $current_user->ID,
        "type" => "text",
      ];
      $options["userroles"] = [
        "label" => __("User roles", "uipress-lite"),
        "value" => $current_user->roles,
        "type" => "array",
      ];
      $options["username"] = [
        "label" => __("Username", "uipress-lite"),
        "value" => $current_user->user_login,
        "type" => "text",
      ];
      $options["firstname"] = [
        "label" => __("User first name", "uipress-lite"),
        "value" => $current_user->user_firstname,
        "type" => "text",
      ];
      $options["lastname"] = [
        "label" => __("User last name", "uipress-lite"),
        "value" => $current_user->user_lastname,
        "type" => "text",
      ];
      $options["fullname"] = [
        "label" => __("User full name", "uipress-lite"),
        "value" => $current_user->user_firstname . " " . $current_user->user_lastname,
        "type" => "text",
      ];
      $options["displayname"] = [
        "label" => __("User display name", "uipress-lite"),
        "value" => $current_user->user_firstname . " " . $current_user->user_lastname,
        "type" => "text",
      ];
      $options["useremail"] = [
        "label" => __("User email", "uipress-lite"),
        "value" => $current_user->user_email,
        "type" => "text",
      ];
      $options["userinitials"] = [
        "label" => __("User initials", "uipress-lite"),
        "value" => $initials,
        "type" => "text",
      ];
      $options["userimage"] = [
        "label" => __("User profile", "uipress-lite"),
        "value" => get_avatar_url($current_user->ID),
        "type" => "image",
      ];
    }
    $options["sitetitle"] = [
      "label" => __("Site title", "uipress-lite"),
      "value" => get_bloginfo("name"),
      "type" => "text",
    ];

    $options["adminPageTitle"] = [
      "label" => __("Admin page title", "uipress-lite"),
      "value" => "",
      "type" => "text",
    ];

    $options["logout"] = [
      "label" => __("Logout link", "uipress-lite"),
      "value" => wp_logout_url(),
      "type" => "link",
    ];
    $options["viewsite"] = [
      "label" => __("View site", "uipress-lite"),
      "value" => get_home_url(),
      "type" => "link",
    ];
    $options["viewadmin"] = [
      "label" => __("Admin home", "uipress-lite"),
      "value" => $adminURL,
      "type" => "link",
    ];
    $options["viewprofile"] = [
      "label" => __("View profile", "uipress-lite"),
      "value" => get_edit_profile_url(),
      "type" => "link",
    ];
    $options["date"] = [
      "label" => __("Current date", "uipress-lite"),
      "value" => date_i18n(get_option("date_format")),
      "type" => "text",
    ];
    $options["phpversion"] = [
      "label" => __("PHP version", "uipress-lite"),
      "value" => phpversion(),
      "type" => "text",
    ];
    $options["wpversion"] = [
      "label" => __("WordPress version", "uipress-lite"),
      "value" => get_bloginfo("version"),
      "type" => "text",
    ];
    $options["notificationCount"] = [
      "label" => __("Notification count", "uipress-lite"),
      "value" => "0",
      "type" => "text",
    ];
    $options["activePlugins"] = [
      "label" => __("Active plugins", "uipress-lite"),
      "value" => count(get_option("active_plugins")),
      "type" => "text",
    ];
    $options["inactivePlugins"] = [
      "label" => __("Inactive plugins", "uipress-lite"),
      "value" => $inactive,
      "type" => "text",
    ];
    $options["installedThemes"] = [
      "label" => __("Installed themes", "uipress-lite"),
      "value" => count(wp_get_themes()),
      "type" => "text",
    ];
    $options["newPost"] = [
      "label" => __("New post", "uipress-lite"),
      "value" => admin_url("post-new.php"),
      "type" => "link",
    ];
    $options["newPage"] = [
      "label" => __("New page", "uipress-lite"),
      "value" => admin_url("post-new.php?post_type=page"),
      "type" => "link",
    ];

    //Check for site option dynamics
    if (defined("uip_site_settings")) {
      $globalOptions = json_decode(uip_site_settings);

      if (isset($globalOptions->general)) {
        //Light mode logo
        if (isset($globalOptions->general->globalLogo)) {
          $logo = $globalOptions->general->globalLogo;

          if (is_object($logo) && isset($logo->url) && $logo->url != "" && $logo->url != "uipblank") {
            $options["siteLogo"] = [
              "label" => __("Site logo", "uipress-lite"),
              "value" => $logo->url,
              "type" => "image",
            ];
          }
        }

        //Dark mode logo
        if (isset($globalOptions->general->globalLogoDarkMode)) {
          $logo = $globalOptions->general->globalLogoDarkMode;

          if (is_object($logo) && isset($logo->url) && $logo->url != "" && $logo->url != "uipblank") {
            $options["siteLogoDarkMode"] = [
              "label" => __("Site logo dark mode", "uipress-lite"),
              "value" => $logo->url,
              "type" => "image",
            ];
          }
        }
      }
    }

    if ($loginPage) {
      return $options;
    }
    //All user meta

    //Get ACF user fields
    if (function_exists("get_fields")) {
      $fields = get_fields("user_" . $current_user->ID);

      if (is_array($fields)) {
        foreach ($fields as $name => $value) {
          try {
            $formatted = $name . " (ACF user meta)";
            $options[$name] = [
              "label" => $formatted,
              "value" => $value,
              "type" => "text",
            ];
          } catch (Exception $e) {
            //error_log('Caught exception: ', $e->getMessage());
          }
        }
      }

      $ACFoptions = get_fields("options");

      if (is_array($ACFoptions)) {
        foreach ($ACFoptions as $name => $value) {
          try {
            $formatted = $name . " (ACF options)";
            $options[$name] = [
              "label" => $formatted,
              "value" => $value,
              "type" => "text",
            ];
          } catch (Exception $e) {
            //error_log('Caught exception: ', $e->getMessage());
          }
        }
      }
    }

    return $options;
  }
}
