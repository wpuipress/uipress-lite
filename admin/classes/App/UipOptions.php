<?php
namespace UipressLite\Classes\App;

!defined("ABSPATH") ? exit() : "";

class UipOptions
{
  /**
   * Returns the chosen options from the uip-site options
   *
   * @return Mixed
   * @since 3.2.13
   */
  public static function get($key = null, $multisite = false)
  {
    $multiSiteActive = false;
    $isMultisite = is_multisite();
    $pluginActiveNetwork = true;
    if (function_exists("is_plugin_active_for_network")) {
      $pluginActiveNetwork = is_plugin_active_for_network(uip_plugin_path_name . "/uipress-lite.php");
    }
    $isMainSite = is_main_site();

    // If multisite and network activated and not the main site, switch to main site
    if ($multisite && $isMultisite && $pluginActiveNetwork && !$isMainSite) {
      $mainSiteId = get_main_site_id();
      switch_to_blog($mainSiteId);
      $multiSiteActive = true;
    }

    $options = get_option("uip-global-settings");

    if ($multiSiteActive) {
      restore_current_blog();
    }

    // If key is specified return
    if (isset($key)) {
      $result = isset($options[$key]) ? $options[$key] : false;
    }
    // No key so return entire object
    else {
      $result = $options ?? [];
    }

    return $result;
  }

  /**
   * Updates the given uipress option
   *
   * @param string $key
   * @param mixed $newValue
   *
   * @return void
   * @since 3.2.13
   */
  public static function update($key = null, $newValue = false)
  {
    $options = get_option("uip-global-settings");
    $options = $options ? $options : [];

    if (isset($key)) {
      $options[$key] = $newValue;
    } else {
      $options = $newValue;
    }

    update_option("uip-global-settings", $options);
  }
}
