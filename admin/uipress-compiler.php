<?php
!defined("ABSPATH") ? exit() : "";

class uipress_compiler
{
  /**
   * Loads UiPress Classes and plugins
   *
   * @since 3.0.0
   */
  public function run()
  {
    require_once uip_plugin_path . "admin/core/app.php";
    require_once uip_plugin_path . "admin/core/ajax-functions.php";
    require_once uip_plugin_path . "admin/core/uiBuilder.php";
    require_once uip_plugin_path . "admin/core/site-settings.php";

    $this->check_for_uipress_pro_version();

    // Load main app
    $uip_app = new uip_app();
    $uip_app->run();

    // Load ajax functions
    $uip_ajax = new uip_ajax();
    $uip_ajax->load_ajax();

    // Load uiBuilder
    $uip_ui_builder = new uip_ui_builder();
    $uip_ui_builder->run();

    // Load global settings
    $uip_global_site = new uip_site_settings();
    $uip_global_site->run();

    $this->load_plugin_textdomain();
    $this->activations_hooks();
  }

  /**
   * Adds hooks for activation and deativation of uipress
   *
   * @since 3.0.0
   */
  public function activations_hooks()
  {
    register_activation_hook(uip_plugin_path_name . "/uipress-lite.php", [$this, "add_required_caps"]);
    register_deactivation_hook(uip_plugin_path_name . "/uipress-lite.php", [$this, "remove_required_caps"]);
  }

  /**
   * Adds required caps for uipress
   *
   * @since 3.0.0
   */
  public function add_required_caps()
  {
    $role = get_role("administrator");

    //If current role doesn't have the administrator role
    if (!$role || is_null($role)) {
      global $current_user;
      $user_roles = $current_user->roles;
      $user_role = array_shift($user_roles);
      $role = get_role($user_role);
    }

    if (!$role || is_null($role)) {
      return;
    }

    $role->add_cap("uip_manage_ui", true);
    $role->add_cap("uip_delete_ui", true);
  }

  /**
   * Removes caps when plugin gets deactivated
   *
   * @since 3.0.0
   */
  public function remove_required_caps()
  {
    $role = get_role("administrator");
    //If current role doesn't have the administrator role
    if (!$role) {
      global $current_user;
      $user_roles = $current_user->roles;
      $user_role = array_shift($user_roles);
      $role = get_role($user_role);
    }
    $role->remove_cap("uip_manage_ui", true);
    $role->remove_cap("uip_delete_ui", true);
  }

  /**
   * translation files action
   *
   * @since 1.4
   */
  public function load_plugin_textdomain()
  {
    add_action("init", [$this, "uipress_languages_loader"]);
  }

  /**
   * Loads translation files
   *
   * @since 1.4
   */
  public function uipress_languages_loader()
  {
    load_plugin_textdomain("uipress-lite", false, dirname(dirname(plugin_basename(__FILE__))) . "/languages");
  }

  /**
   * Checks the version of uipress pro and if it's before a specific level deativates the plugin
   *
   * @since 3.3.0
   */
  public function check_for_uipress_pro_version()
  {
    if (!function_exists("get_plugins")) {
      require_once ABSPATH . "wp-admin/includes/plugin.php";
    }
    $all_plugins = get_plugins();

    $plugin_slug = "uipress-pro/uipress-pro.php"; // Replace with the actual plugin file.

    if (isset($all_plugins[$plugin_slug]) && $all_plugins[$plugin_slug]["Version"]) {
      $plugin_version = $all_plugins[$plugin_slug]["Version"];
      $plugin_version = floatval($plugin_version);
      if ($plugin_version < 3.2) {
        deactivate_plugins($plugin_slug);
        $this->require_pro_upgrade_script($plugin_version);
        add_action("admin_head", [$this, "flag_uipress_pro_version_error"], 99);
      }
    }
  }

  /**
   * Requires the pro plugin update script to ensure you can still update
   *
   * @since 3.3.09
   */
  public function require_pro_upgrade_script($plugin_version)
  {
    if (class_exists("uip_pro_update")) {
      return;
    }

    if (!defined("uip_pro_plugin_version")) {
      define("uip_pro_plugin_version", $plugin_version);
    }

    $other_plugin_path = WP_PLUGIN_DIR . "/uipress-pro/admin/classes/uip-update.php";
    if (file_exists($other_plugin_path)) {
      require_once $other_plugin_path;
      $uip_pro_update = new uip_pro_update();
      $uip_pro_update->run();
    }
  }

  /**
   * Flags deactivation of uipress pro
   *
   * @since 3.3.0
   */
  public function flag_uipress_pro_version_error()
  {
    $class = "notice notice-warning";
    $message = __("uiPress Pro needs to be updated to work with version uiPress lite version 3.3", "uipress-pro");

    printf('<div class="%1$s"><p>%2$s</p></div>', esc_attr($class), esc_html($message));
  }
}
