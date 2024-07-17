<?php
namespace UipressLite\Classes\PostTypes;

!defined('ABSPATH') ? exit() : '';

class UiPatterns
{
  /**
   * Registers ui pattern post type
   *
   * @return Array
   * @since 3.2.13
   */
  public static function create()
  {
    $postTypeArgs = self::return_post_type_args();
    register_post_type('uip-ui-pattern', $postTypeArgs);
  }

  /**
   * Returns post type args for uip-ui-pattern
   *
   * @return Array
   * @since 3.2.13
   */
  public static function return_post_type_args()
  {
    $labels = [
      'name' => _x('UI Pattern', 'post type general name', 'uipress-lite'),
      'singular_name' => _x('UI Pattern', 'post type singular name', 'uipress-lite'),
      'menu_name' => _x('UI Patterns', 'admin menu', 'uipress-lite'),
      'name_admin_bar' => _x('UI Pattern', 'add new on admin bar', 'uipress-lite'),
      'add_new' => _x('Add New', 'UI Pattern', 'uipress-lite'),
      'add_new_item' => __('Add New UI Pattern', 'uipress-lite'),
      'new_item' => __('New UI Pattern', 'uipress-lite'),
      'edit_item' => __('Edit UI Pattern', 'uipress-lite'),
      'view_item' => __('View UI Patterns', 'uipress-lite'),
      'all_items' => __('All UI Patterns', 'uipress-lite'),
      'search_items' => __('Search UI Patterns', 'uipress-lite'),
      'not_found' => __('No UI Patterns found.', 'uipress-lite'),
      'not_found_in_trash' => __('No UI Patterns found in Trash.', 'uipress-lite'),
    ];
    $args = [
      'labels' => $labels,
      'description' => __('Post type used for the uipress UI builder for storing patterns', 'uipress-lite'),
      'public' => false,
      'publicly_queryable' => false,
      'show_ui' => false,
      'show_in_menu' => false,
      'query_var' => false,
      'has_archive' => false,
      'hierarchical' => false,
      'supports' => ['title'],
      'show_in_rest' => true,
    ];

    return $args;
  }

  /**
   * Queries ui patterns and returns query object
   *
   * @param Array $options args array
   * @since 3.2.13
   */
  public static function list($options = ['perPage' => 10, 'search' => ''])
  {
    $args = [
      'post_type' => 'uip-ui-pattern',
      'post_status' => ['publish', 'draft'],
      'posts_per_page' => $options['perPage'],
      's' => $options['search'],
    ];

    $query = new \WP_Query($args);
    return $query;
  }

  /**
   * Formats list of patterns post types and returns as array.
   *
   * @param array $patterns Array of patterns to format.
   * @since 3.2.13
   */
  public static function format(array $patterns = [])
  {
    $formatted = [];

    foreach ($patterns as $item) {
      // Ensure $item is an object and has the property ID
      if (!is_object($item) || !property_exists($item, 'ID')) {
        continue;
      }

      $template = get_post_meta($item->ID, 'uip-pattern-template', true);
      $type = get_post_meta($item->ID, 'uip-pattern-type', true);
      $des = get_post_meta($item->ID, 'uip-pattern-description', true);
      $icon = get_post_meta($item->ID, 'uip-pattern-icon', true);
      $name = get_the_title($item->ID);

      if (!$template) {
        continue;
      }

      $template->patternID = $item->ID;
      $template->name = $name;

      $temp = [];
      $temp['name'] = $name;
      $temp['id'] = $item->ID;
      $temp['template'] = $template;
      $temp['type'] = $type;
      $temp['description'] = $des;
      $temp['icon'] = $icon;
      $formatted[] = $temp;
    }

    return $formatted;
  }

  /**
   * Creates new uiPattern
   *
   * @param string $name - name of new pattern
   * @param object $pattern - pattern template
   * @param string $type - pattern type
   * @param string $des - pattern description
   * @param string $icon - pattern icon
   * @since 3.2.13
   */
  public static function new($name, $pattern, $type, $des, $icon)
  {
    // No pattern so return
    $decodePattern = json_decode(wp_json_encode($pattern));
    if (!is_object($decodePattern)) {
      return false;
    }

    $updateArgs = [
      'post_title' => wp_strip_all_tags($name),
      'post_status' => 'publish',
      'post_type' => 'uip-ui-pattern',
    ];

    $newPatternID = wp_insert_post($updateArgs);

    if (!$newPatternID) {
      return false;
    }

    update_post_meta($newPatternID, 'uip-pattern-template', $pattern);
    update_post_meta($newPatternID, 'uip-pattern-type', $type);
    update_post_meta($newPatternID, 'uip-pattern-description', $des);

    if ($icon && $icon != '' && $icon != 'undefined') {
      update_post_meta($newPatternID, 'uip-pattern-icon', $icon);
    }

    return $newPatternID;
  }

  /**
   * Updates a patterns template
   *
   * @param string $patternID - id of the pattern to update
   * @param object $template - pattern template
   * @since 3.2.13
   */
  public static function update_template($patternID, $template)
  {
    // No pattern so return
    if (!get_post_status($patternID)) {
      return;
    }

    update_post_meta($patternID, 'uip-pattern-template', $template);
  }

  /**
   * Recursively runs through a template and Updates a patterns template and id
   *
   * @param array $blocks - The list of blocks to loop through
   * @param array | object $pattern - the new pattern template
   * @param string $originalID - the original pattern id
   * @param string | boolean $newPatternID the new pattern id or false if not a new pattern
   *
   * @return void  description
   */
  public static function sync_template_patterns($blocks, $pattern, $originalID, $newPatternID)
  {
    $updatedTemplate = [];

    foreach ($blocks as $item) {
      // Check whether the current block has a pattern
      $currentBlockPatternID = property_exists($item, 'patternID') ? $item->patternID : false;

      // Found pattern and update
      if ($currentBlockPatternID && $item->patternID == $originalID) {
        $item->name = $pattern->name;
        $item->settings = $pattern->settings;
        $item->tooltip = $pattern->tooltip;

        // Update to new ID if it exists
        if ($newPatternID) {
          $item->patternID = $newPatternID;
        }

        // Update pattern children if it exists
        if (property_exists($pattern, 'content')) {
          $item->content = $pattern->content;
        }
      }

      // Check for children in all blocks and continue the search
      if (property_exists($item, 'content')) {
        if (is_array($item->content) && !empty($item->content)) {
          $item->content = self::sync_template_patterns($item->content, $pattern, $originalID, $newPatternID);
        }
      }
      //Push to new template
      $updatedTemplate[] = $item;
    }

    return $updatedTemplate;
  }
}
