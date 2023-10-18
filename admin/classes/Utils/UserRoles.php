<?php
namespace UipressLite\Classes\Utils;

!defined('ABSPATH') ? exit() : '';

class UserRoles
{
  /**
   * Gets capabilities from exisitng roles
   * Original code modified from members plugin by Justin Tadlock
   * @since 2.3.5
   */
  public static function get_all_role_capabilities()
  {
    // Set up an empty capabilities array.
    $categories = [
      'all' => [
        'shortname' => 'all',
        'name' => __('All', 'uipress-lite'),
        'caps' => [],
        'icon' => 'apps',
      ],
      'read' => [
        'shortname' => 'read',
        'name' => __('Read', 'uipress-lite'),
        'caps' => [],
        'icon' => 'bookmark',
      ],
      'edit' => [
        'shortname' => 'edit',
        'name' => __('Edit', 'uipress-lite'),
        'caps' => [],
        'icon' => 'edit_note',
      ],
      'publish' => [
        'shortname' => 'publish',
        'name' => __('Publish', 'uipress-lite'),
        'caps' => [],
        'icon' => 'publish',
      ],
      'create' => [
        'shortname' => 'create',
        'name' => __('Create', 'uipress-lite'),
        'caps' => [],
        'icon' => 'add_circle',
      ],
      'delete' => [
        'shortname' => 'delete',
        'name' => __('Delete', 'uipress-lite'),
        'caps' => [],
        'icon' => 'delete',
      ],
      'view' => [
        'shortname' => 'view',
        'name' => __('View', 'uipress-lite'),
        'caps' => [],
        'icon' => 'visibility',
      ],
      'manage' => [
        'shortname' => 'manage',
        'name' => __('Manage', 'uipress-lite'),
        'caps' => [],
        'icon' => 'tune',
      ],
      'export' => [
        'shortname' => 'export',
        'name' => __('Export', 'uipress-lite'),
        'caps' => [],
        'icon' => 'file_download',
      ],
      'import' => [
        'shortname' => 'import',
        'name' => __('Import', 'uipress-lite'),
        'caps' => [],
        'icon' => 'file_upload',
      ],
      'custom' => [
        'shortname' => 'custom',
        'name' => __('Custom', 'uipress-lite'),
        'caps' => [],
        'icon' => 'settings',
      ],
    ];
    $capabilities = [];

    global $wp_roles;

    $usercaps = [];
    // Loop through each role object because we need to get the caps.
    foreach ($wp_roles->role_objects as $key => $role) {
      // Make sure that the role has caps.
      if (is_array($role->capabilities)) {
        // Add each of the role's caps (both granted and denied) to the array.
        foreach ($role->capabilities as $cap => $grant) {
          $usercaps[] = $cap;
        }
      }
    }

    $postypeCaps = self::uip_post_type_caps();

    $allcaps = array_merge($usercaps, $postypeCaps);
    $allcaps = array_unique($allcaps);

    foreach ($allcaps as $cap) {
      $categories['all']['caps'][] = $cap;
      if (strpos($cap, 'view') !== false) {
        $categories['view']['caps'][] = $cap;
      } elseif (strpos($cap, 'read') !== false) {
        $categories['read']['caps'][] = $cap;
      } elseif (strpos($cap, 'edit') !== false) {
        $categories['edit']['caps'][] = $cap;
      } elseif (strpos($cap, 'delete') !== false || strpos($cap, 'remove') !== false) {
        $categories['delete']['caps'][] = $cap;
      } elseif (
        strpos($cap, 'manage') !== false ||
        strpos($cap, 'install') !== false ||
        strpos($cap, 'update') !== false ||
        strpos($cap, 'switch') !== false ||
        strpos($cap, 'moderate') !== false ||
        strpos($cap, 'activate') !== false
      ) {
        $categories['manage']['caps'][] = $cap;
      } elseif (strpos($cap, 'export') !== false) {
        $categories['export']['caps'][] = $cap;
      } elseif (strpos($cap, 'import') !== false) {
        $categories['import']['caps'][] = $cap;
      } elseif (strpos($cap, 'publish') !== false) {
        $categories['publish']['caps'][] = $cap;
      } elseif (strpos($cap, 'create') !== false || strpos($cap, 'upload') !== false) {
        $categories['create']['caps'][] = $cap;
      } else {
        $categories['custom']['caps'][] = $cap;
      }
    }

    // Return the capabilities array, making sure there are no duplicates.
    return $categories;
  }

  /**
   * Gets capabilities for post types
   *
   * Original code modified from members plugin by Justin Tadlock
   * @since 2.3.5
   */
  private static function uip_post_type_caps()
  {
    $postypecaps = [];
    foreach (get_post_types([], 'objects') as $type) {
      // Skip revisions and nave menu items.
      if (in_array($type->name, ['revision', 'nav_menu_item', 'custom_css', 'customize_changeset'])) {
        continue;
      }

      $post_type = $type->name;
      // Get the post type caps.
      $caps = (array) get_post_type_object($post_type)->cap;

      // remove meta caps.
      unset($caps['edit_post']);
      unset($caps['read_post']);
      unset($caps['delete_post']);

      // Get the cap names only.
      $caps = array_values($caps);

      // If this is not a core post/page post type.
      if (!in_array($post_type, ['post', 'page'])) {
        // Get the post and page caps.
        $post_caps = array_values((array) get_post_type_object('post')->cap);
        $page_caps = array_values((array) get_post_type_object('page')->cap);

        // Remove post/page caps from the current post type caps.
        $caps = array_diff($caps, $post_caps, $page_caps);
      }

      // If attachment post type, add the `unfiltered_upload` cap.
      if ('attachment' === $post_type) {
        $caps[] = 'unfiltered_upload';
      }

      if (is_array($caps)) {
        foreach ($caps as $cap) {
          $postypecaps[] = $cap;
        }
      }
    }

    // Make sure there are no duplicates and return.
    return array_unique($postypecaps);
  }
}
