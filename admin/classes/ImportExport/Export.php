<?php
namespace UipressLite\Classes\ImportExport;
use UipressLite\Classes\PostTypes\UiTemplates;
use UipressLite\Classes\Utils\UipOptions;

!defined('ABSPATH') ? exit() : '';

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
      if (isset($siteSettings['theme-styles'])) {
        unset($siteSettings['theme-styles']);
      }
    }

    // Remove unselected properties
    if (!$options->siteSettings && $options->themeStyles) {
      if ($siteSettings['theme-styles']) {
        unset($siteSettings['block_preset_styles']);
        unset($siteSettings['google_analytics']);
        unset($siteSettings['role_redirects']);
        unset($siteSettings['site-settings']);
      }
    }

    $menus = [];
    if ($options->adminMenus) {
      $menus = self::admin_menus();
    }

    $returndata = [];
    $returndata['templates'] = $templates;
    $returndata['siteSettings'] = $siteSettings;
    $returndata['menus'] = $menus;

    return $returndata;
  }

  /**
   * Get's all templates for export
   *
   * @return array of templates
   * @since 3.2.13
   */
  private static function templates()
  {
    $query = UiTemplates::list(['perPage' => -1, 'search' => '']);
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

    if ($options['uip_pro']) {
      unset($options['uip_pro']);
    }
    if ($options['remote-sync']) {
      unset($options['remote-sync']);
    }

    return $options;
  }

  /**
   * Exports admin menus
   *
   * @since 3.2.13
   */
  public function admin_menus()
  {
    //Get template
    $args = [
      'post_type' => 'uip-admin-menu',
      'posts_per_page' => -1,
      'post_status' => ['publish', 'draft'],
    ];

    $query = new WP_Query($args);
    $totalFound = $query->found_posts;
    $foundPosts = $query->get_posts();

    $formattedMenus = [];

    foreach ($foundPosts as $item) {
      $menuOptions = get_post_meta($item->ID, 'uip_menu_settings', true);

      $uid = get_post_meta($item->ID, 'uip-uid', true);
      if (!$uid) {
        $uid = uniqid('uip-', true);
        update_post_meta($item->ID, 'uip-uid', $uid);
      }

      //Return data to app
      $returndata = [];
      $returndata['name'] = get_the_title($item->ID);
      $returndata['settings'] = $menuOptions;
      $returndata['status'] = get_post_status($item->ID);
      $returndata['uid'] = $uid;

      $formattedMenus[] = $returndata;
    }
    return $formattedMenus;
  }
}
