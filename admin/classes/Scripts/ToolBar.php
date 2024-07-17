<?php
namespace UipressLite\Classes\Scripts;
use UipressLite\Classes\Utils\Sanitize;

!defined('ABSPATH') ? exit() : '';

class ToolBar
{
  /**
   * Captures toolbar object
   *
   * @return
   * @since 3.2.13
   */
  public static function capture()
  {
    add_action('wp_before_admin_bar_render', ['UipressLite\Classes\Scripts\ToolBar', 'capture_wp_toolbar'], PHP_INT_MAX);
  }

  /**
   * Captures the admin menu array
   *
   * @param array $scripts array of scripts / styles
   *
   * @since 3.2.13
   */
  public static function capture_wp_toolbar($parent_file)
  {
    global $wp_admin_bar;
    $items = $wp_admin_bar->get_nodes();
    $children = new \stdClass();

    // Check for toolbar items
    $items = $items ?? new \stdClass();

    $categories = new \stdClass();
    foreach ($items as $id => $item) {
      if ($item->parent == '' || $item->parent == false) {
        $categories->{$id} = clone $item;

        $categories->{$id}->submenu = self::getToolBarSubMenuItems($id, $items);
      }
    }

    if (property_exists($categories, 'menu-toggle')) {
      unset($categories->{'menu-toggle'});
    }
    if (property_exists($categories, 'site-name')) {
      unset($categories->{'site-name'});
    }
    if (property_exists($categories, 'wp-logo')) {
      unset($categories->{'wp-logo'});
    }
    if (property_exists($categories, 'top-secondary')) {
      unset($categories->{'top-secondary'});
    }
    if (property_exists($categories, 'app-logo')) {
      unset($categories->{'app-logo'});
    }

    self::output_toolbar($categories);

    return $parent_file;
  }

  /**
   * Formats an anonymous function to output the menu as json string
   *
   * @param array $menu - admin menu
   *
   * @return void
   * @since 3.2.13
   */
  private static function output_toolbar($toolbar)
  {
    // Create anonymous function so we can use the captured menu at runtime
    $outputter = function () use ($toolbar) {
      $toolbar = Sanitize::clean_input_with_code($toolbar);
      $toolbarString = wp_json_encode($toolbar);
      $toolbarString = $toolbarString ?? wp_json_encode([]);

      wp_print_inline_script_tag('', ['id' => 'uip-admin-toolbar', 'data-toolbar' => $toolbarString]);
    };
    add_action('admin_footer', $outputter, 0);
    add_action('wp_footer', $outputter, 0);
  }

  /**
   * Loops through toolbar items to find children
   *
   * @since 3.0.0
   */
  private static function getToolBarSubMenuItems($id, $items)
  {
    $temp = new \stdClass();
    foreach ($items as $token => $item) {
      if ($item->parent == $id) {
        $temp->{$item->id} = clone $item;
      }
    }

    $secondLevel = new \stdClass();
    foreach ($temp as $token => $item) {
      $secondLevel->{$item->id} = clone $item;
      $secondLevel->{$item->id}->submenu = self::getToolBarSubSubMenuItems($item->id, $items);
    }

    return $secondLevel;
  }

  /**
   * Loops through toolbar items to find children of children
   *
   * @since 3.0.0
   */
  private static function getToolBarSubSubMenuItems($id, $items)
  {
    $temp = new \stdClass();
    foreach ($items as $token => $item) {
      if ($item->parent == $id) {
        $temp->{$item->id} = clone $item;
      }
    }

    return $temp;
  }
}
