<?php
namespace UipressLite\Classes\Utils;

!defined("ABSPATH") ? exit() : "";

class Users
{
  /**
   * Returns list of formatted users
   *
   * @param string $searchterm - search term
   * @param number $page - the current page
   *
   * @return array
   * @since 3.2.13
   */
  public static function get_users($searchterm, $page)
  {
    $args = self::buildUserQueryArgs($searchterm, $page);

    return self::getFormattedUsers($args);
  }

  /**
   * Builds query arguments for WP_User_Query, using provided term, perPage, and page.
   *
   * @param string $searchterm    The search term.
   * @param int    $page    The page number.
   *
   * @return array The argument array for WP_User_Query.
   *
   * @since 3.2.13
   */
  private static function buildUserQueryArgs($searchterm, $page)
  {
    $args = [
      "fields" => "all",
      "count_total" => true,
      "number" => 10,
      "paged" => $page,
    ];
    if ($searchterm) {
      $args["search"] = "*" . esc_attr(strtolower($searchterm)) . "*";
    }
    if (is_main_site() && is_multisite()) {
      $args["blog_id"] = 0;
    }
    return $args;
  }

  /**
   * Retrieves and formats user data based on provided query arguments.
   *
   * @param array $args The arguments to pass to WP_User_Query.
   *
   * @return array An array of formatted user data.
   *
   * @since 3.2.13
   */
  private static function getFormattedUsers($args)
  {
    $usersQuery = new \WP_User_Query($args);
    $formattedUsers = [];

    foreach ($usersQuery->get_results() as $user) {
      $formattedUsers[] = [
        "name" => $user->display_name,
        "label" => $user->display_name,
        "type" => "User",
        "typeLocal" => __("User", "uipress-lite"),
        "icon" => "person",
        "id" => $user->ID,
      ];
    }

    return ["users" => $formattedUsers, "total" => $usersQuery->get_total()];
  }

  /**
   * Retrieves and formats role data based on an optional search term.
   *
   * @param string $searchterm An optional search term to filter roles.
   *
   * @return array An array of formatted role data.
   *
   * @since 3.2.13
   */
  public static function get_roles($searchterm)
  {
    $searcher = $searchterm ? strtolower($searchterm) : "";
    $editableRoles = self::get_all_multisite_roles();
    $formattedRoles = [];

    foreach ($editableRoles as $role => $details) {
      if (!$searcher || strpos(strtolower($role), $searcher) !== false) {
        $formattedRoles[] = self::buildRoleArray($role);
      }
    }
    if (!$searcher || strpos(strtolower("Super Admin"), $searcher) !== false) {
      $formattedRoles[] = self::buildRoleArray("Super Admin");
    }
    return $formattedRoles;
  }

  private static function get_all_multisite_roles()
  {
    // Check if multisite is enabled
    if (!is_multisite()) {
      return get_editable_roles();
    }

    $all_roles = [];

    // Get all sites
    $sites = get_sites(["fields" => "ids"]);

    foreach ($sites as $site_id) {
      switch_to_blog($site_id);

      // Get roles for current site
      $roles = get_editable_roles();

      foreach ($roles as $role_key => $role) {
        if (!isset($all_roles[$role_key])) {
          $all_roles[$role_key] = $role;
        }
      }

      restore_current_blog();
    }

    return $all_roles;
  }

  /**
   * Constructs and returns an associative array of role data in a specific format.
   *
   * @param string $roleName The name of the role.
   *
   * @return array An associative array containing the formatted role data.
   *
   * @since 3.2.13
   */
  private static function buildRoleArray($roleName)
  {
    return [
      "label" => $roleName,
      "name" => $roleName,
      "type" => "Role",
      "typeLocal" => __("Role", "uipress-lite"),
      "icon" => "badge",
    ];
  }
}
