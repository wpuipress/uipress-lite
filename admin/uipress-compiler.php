<?php

!defined("ABSPATH") ?? exit();

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
    if (!$role) {
      global $current_user;
      $user_roles = $current_user->roles;
      $user_role = array_shift($user_roles);
      $role = get_role($user_role);
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
}

?>
