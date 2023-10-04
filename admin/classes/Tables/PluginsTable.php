<?php
namespace UipressLite\Classes\Tables;

!defined('ABSPATH') ? exit() : '';

class PluginsTable
{
  /**
   * Adds a new link to the plugins table under uipress to the builder
   *
   * @return array of links
   * @since 3.2.13
   */
  public static function add_builder_link($links)
  {
    // Build uiBuilder link
    $url = esc_url(add_query_arg('page', 'uip-ui-builder', get_admin_url() . 'options-general.php'));
    $name = 'uiBuilder';
    $settings_link = "<a href='{$url}'>{$name}</a>";
    array_push($links, $settings_link);

    // Build site settings link
    $url = esc_url(add_query_arg('page', 'uip-ui-builder#/site-settings', get_admin_url() . 'options-general.php'));
    $name = __('Site settings', 'uipress-lite');
    $settings_link = "<a href='{$url}'>{$name}</a>";
    array_push($links, $settings_link);

    return $links;
  }
}
