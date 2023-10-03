<?php
namespace UipressLite\Classes\PostTypes;
use UipressLite\Classes\Utils\Dates;

!defined('ABSPATH') ? exit() : '';

class UiTemplates
{
  /**
   * Registers ui template post type
   *
   * @return Array
   * @since 3.2.13
   */
  public static function create()
  {
    $postTypeArgs = self::return_post_type_args();
    register_post_type('uip-ui-template', $postTypeArgs);
  }

  /**
   * Returns post type args for uip-ui-template
   *
   * @return Array
   * @since 3.2.13
   */
  public static function return_post_type_args()
  {
    $labels = [
      'name' => _x('UI Template', 'post type general name', 'uipress-lite'),
      'singular_name' => _x('UI Template', 'post type singular name', 'uipress-lite'),
      'menu_name' => _x('UI Templates', 'admin menu', 'uipress-lite'),
      'name_admin_bar' => _x('UI Template', 'add new on admin bar', 'uipress-lite'),
      'add_new' => _x('Add New', 'Template', 'uipress-lite'),
      'add_new_item' => __('Add New UI Template', 'uipress-lite'),
      'new_item' => __('New UI Template', 'uipress-lite'),
      'edit_item' => __('Edit UI Template', 'uipress-lite'),
      'view_item' => __('View UI Template', 'uipress-lite'),
      'all_items' => __('All UI Templates', 'uipress-lite'),
      'search_items' => __('Search UI Templates', 'uipress-lite'),
      'not_found' => __('No UI Templates found.', 'uipress-lite'),
      'not_found_in_trash' => __('No UI Templates found in Trash.', 'uipress-lite'),
    ];
    $args = [
      'labels' => $labels,
      'description' => __('Post type used for the uipress UI builder', 'uipress-lite'),
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
   * Queries ui templates and returns query object
   *
   * @param Array $options args array
   * @since 3.2.13
   */
  public static function list($options = ['perPage' => 10, 'search' => ''])
  {
    self::order_by_status();

    $args = [
      'post_type' => 'uip-ui-template',
      'post_status' => ['publish', 'draft'],
      'posts_per_page' => $options['perPage'],
      's' => $options['search'],
    ];

    $query = new \WP_Query($args);
    return $query;
  }

  /**
   * Adds a filter to order by status
   *
   * @return void
   * @since 3.2.13
   */
  private static function order_by_status()
  {
    add_filter('posts_orderby', function ($orderby) {
      global $wpdb;
      return "{$wpdb->posts}.post_status DESC"; // You can change ASC to DESC if you want descending order
    });
  }

  /**
   * Formats list of template post types and returns as array.
   *
   * @param array $templates Array of templates to format.
   * @since 3.2.13
   */
  public static function format(array $templates = [])
  {
    $formatted = [];

    foreach ($templates as $item) {
      // Ensure $item is an object and has the property ID
      if (!is_object($item) || !property_exists($item, 'ID')) {
        continue;
      }

      $temp = [];
      $temp['name'] = get_the_title($item->ID);
      $temp['id'] = $item->ID;
      $temp['modified'] = Dates::getHumanDate($item->ID);
      $temp['actualType'] = get_post_meta($item->ID, 'uip-template-type', true);
      $temp['type'] = self::getTemplateType($temp['actualType']);
      $temp['status'] = get_post_status($item->ID);

      $settings = get_post_meta($item->ID, 'uip-template-settings', true);
      if (is_object($settings)) {
        $temp['for'] = property_exists($settings, 'rolesAndUsers') ? $settings->rolesAndUsers : [];
        $temp['excludes'] = property_exists($settings, 'excludesRolesAndUsers') ? $settings->excludesRolesAndUsers : [];
      } else {
        $temp['for'] = [];
        $temp['excludes'] = [];
      }

      $formatted[] = $temp;
    }

    return $formatted;
  }

  /**
   * Gets the template type as a string.
   *
   * @param string $type The raw template type.
   * @return string Human readable type.
   * @since 3.2.13
   */
  private static function getTemplateType(string $type)
  {
    $types = [
      'ui-template' => __('UI template', 'uipress-lite'),
      'ui-admin-page' => __('Admin page', 'uipress-lite'),
      'ui-login-page' => __('Login page', 'uipress-lite'),
      'ui-front-template' => __('Frontend toolbar', 'uipress-lite'),
    ];

    return $types[$type] ?? $type;
  }

  /**
   * Creates new uiTemplate
   *
   * @param array $options - template options
   * @return template id on success, false on failure
   * @since 3.2.13
   */
  public static function new(array $options = [])
  {
    $defaults = ['type' => 'ui-template', 'name' => __('UI Template (Draft)', 'uipress-lite')];
    $defaults = [...$options, ...$defaults];

    $my_post = [
      'post_title' => $defaults['name'],
      'post_status' => 'draft',
      'post_type' => 'uip-ui-template',
    ];

    // Insert the post into the database.
    $templateID = wp_insert_post($my_post);

    // Failed to create post type so exit
    if (!$templateID) {
      return false;
    }

    update_post_meta($templateID, 'uip-template-type', $defaults['type']);

    return $templateID;
  }

  /**
   * Creates new uiTemplate
   *
   * @param number $templateID - template options
   * @return template id on success, false on failure
   * @since 3.2.13
   */
  public static function get($templateID)
  {
    // Get template
    $postObject = get_post($templateID);

    if (is_null($postObject)) {
      return false;
    }

    $template = get_post_meta($templateID, 'uip-ui-template', true);

    // Check if template exists and isn't empty
    if (!is_array($template)) {
      $template = [];
    }

    $settings = get_post_meta($templateID, 'uip-template-settings');
    $type = get_post_meta($templateID, 'uip-template-type', true);

    return [
      'template' => json_decode(html_entity_decode(json_encode($template))),
      'settings' => json_decode(html_entity_decode(json_encode($settings))),
      'type' => $type,
    ];
  }

  /**
   * Creates new uiTemplate
   *
   * @param array $templateIDs - array of template ids to delete
   * @return template true on success, false on failure
   * @since 3.2.13
   */
  public static function delete($templateIDs)
  {
    $userID = get_current_user_id();

    // Check permissions
    if (!user_can($userID, 'uip_delete_ui')) {
      return false;
    }

    // Check permissions
    if (!is_array($templateIDs)) {
      return false;
    }

    foreach ($templateIDs as $id) {
      $postType = get_post_type($id);
      if ($postType == 'uip-ui-template') {
        wp_delete_post($id, true);
      }
    }

    return true;
  }

  /**
   * Updates a templates status
   *
   * @param array $templateIDs - template id
   * @param string $status  - the new status
   * @return template id on success, false on failure
   * @since 3.2.13
   */
  public static function update_status($templateID, $status)
  {
    // Update in settings
    $settings = self::get_settings($templateID);

    $newStatus = $status == 'publish' ? 'uiptrue' : 'uipfalse';
    $settings->status = $newStatus;
    self::update_settings($templateID, $settings);

    $updateArgs = [
      'ID' => $templateID,
      'post_status' => $status,
    ];

    return wp_update_post($updateArgs);
  }

  /**
   * Saves a templates
   *
   * @param string $templateIDs - template id
   * @param object $template - the new template settings and content
   * @return true success, false on failure
   * @since 3.2.13
   */
  public static function save($templateID, $template)
  {
    // Get template
    $postObject = get_post($templateID);

    // Template doesn't exist
    if (is_null($postObject)) {
      return false;
    }

    $name = $template->globalSettings->name;
    $status = $template->globalSettings->status == 'uipfalse' ? 'draft' : 'publish';

    $updateArgs = [
      'post_title' => wp_strip_all_tags($name),
      'post_status' => $status,
      'ID' => $templateID,
    ];

    $updated = wp_update_post($updateArgs);

    // Failed to update post
    if (!$updated) {
      return false;
    }

    $multisite = $template->globalSettings->applyToSubsites ?? false;

    error_log(json_encode($template->globalSettings->rolesAndUsers));
    // Update settings

    self::update_template_for($templateID, $template->globalSettings->rolesAndUsers);
    self::update_template_excludes($templateID, $template->globalSettings->excludesRolesAndUsers);
    self::update_settings($templateID, $template->globalSettings, $template->globalSettings->type, $multisite, $template->content);

    return true;
  }

  /**
   * Updates a templates for users and roles option
   *
   * @param array $templateIDs - template id
   * @param array $templateFor - array of users and roles
   * @return void
   * @since 3.2.13
   */
  public static function update_template_for($templateID, $templateFor)
  {
    // Exit early if not array
    if (!is_array($templateFor)) {
      return;
    }

    $settings = self::get_settings($templateID);
    $settings->rolesAndUsers = $templateFor;
    self::update_settings($templateID, $settings);

    // Template for settings
    $roles = [];
    $users = [];
    foreach ($templateFor as $item) {
      if ($item->type == 'User') {
        $users[] = $item->id;
      }

      if ($item->type == 'Role') {
        $roles[] = $item->name;
      }
    }

    update_post_meta($templateID, 'uip-template-for-roles', $roles);
    update_post_meta($templateID, 'uip-template-for-users', $users);
  }

  /**
   * Updates a templates for users and roles option
   *
   * @param array $templateIDs - template id
   * @param array $templateFor - array of users and roles
   * @return void
   * @since 3.2.13
   */
  public static function update_template_excludes($templateID, $templateExcludes)
  {
    // Exit early if not array
    if (!is_array($templateExcludes)) {
      return;
    }

    $settings = self::get_settings($templateID);
    $settings->rolesAndUsers = $templateExcludes;
    self::update_settings($templateID, $settings);

    // Template for settings
    $roles = [];
    $users = [];
    foreach ($templateExcludes as $item) {
      if ($item->type == 'User') {
        $users[] = $item->id;
      }

      if ($item->type == 'Role') {
        $roles[] = $item->name;
      }
    }

    update_post_meta($templateID, 'uip-template-excludes-roles', $roles);
    update_post_meta($templateID, 'uip-template-excludes-users', $users);
  }

  /**
   * Get's a templates settings
   *
   * @param array $templateIDs - template id
   * @return settings object
   * @since 3.2.13
   */
  public static function get_settings($templateID)
  {
    // Get settings
    $settings = get_post_meta($templateID, 'uip-template-settings', true);
    return is_object($settings) ? $settings : new stdClass();
  }

  /**
   * Get's a templates settings
   *
   * @param string $templateIDs - template id
   * @param object $newSettings
   * @return void
   * @since 3.2.13
   */
  public static function update_settings($templateID, $newSettings, $type = null, $subsites = null, $content = null)
  {
    // Update settings
    update_post_meta($templateID, 'uip-template-settings', $newSettings);

    if (isset($type)) {
      update_post_meta($templateID, 'uip-template-type', $type);
    }
    if (isset($subsites)) {
      update_post_meta($templateID, 'uip-template-subsites', $subsites);
    }
    if (isset($content)) {
      update_post_meta($templateID, 'uip-ui-template', $content);
    }
  }
}
