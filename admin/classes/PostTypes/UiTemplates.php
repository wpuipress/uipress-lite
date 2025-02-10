<?php
namespace UipressLite\Classes\PostTypes;
use UipressLite\Classes\Utils\Dates;
use UipressLite\Classes\Utils\Objects;

!defined("ABSPATH") ? exit() : "";

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
    register_post_type("uip-ui-template", $postTypeArgs);
    self::uip_register_template_meta_fields();
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
      "name" => _x("UI Template", "post type general name", "uipress-lite"),
      "singular_name" => _x("UI Template", "post type singular name", "uipress-lite"),
      "menu_name" => _x("UI Templates", "admin menu", "uipress-lite"),
      "name_admin_bar" => _x("UI Template", "add new on admin bar", "uipress-lite"),
      "add_new" => _x("Add New", "Template", "uipress-lite"),
      "add_new_item" => __("Add New UI Template", "uipress-lite"),
      "new_item" => __("New UI Template", "uipress-lite"),
      "edit_item" => __("Edit UI Template", "uipress-lite"),
      "view_item" => __("View UI Template", "uipress-lite"),
      "all_items" => __("All UI Templates", "uipress-lite"),
      "search_items" => __("Search UI Templates", "uipress-lite"),
      "not_found" => __("No UI Templates found.", "uipress-lite"),
      "not_found_in_trash" => __("No UI Templates found in Trash.", "uipress-lite"),
    ];
    $args = [
      "labels" => $labels,
      "description" => __("Post type used for the uipress UI builder", "uipress-lite"),
      "public" => false,
      "publicly_queryable" => false,
      "show_ui" => false,
      "show_in_menu" => false,
      "query_var" => false,
      "has_archive" => false,
      "hierarchical" => false,
      "supports" => ["title", "custom-fields"],
      "show_in_rest" => true,
    ];

    return $args;
  }

  /**
   * Registers custom REST field for uip-ui-template post type
   *
   * @return void
   */
  public static function uip_register_template_meta_fields()
  {
    register_rest_field("uip-ui-template", "uipress", [
      "get_callback" => function ($post) {
        return [
          "template" => get_post_meta($post["id"], "uip-ui-template", true),
          "settings" => get_post_meta($post["id"], "uip-template-settings", true),
          "type" => get_post_meta($post["id"], "uip-template-type", true),
          "forRoles" => get_post_meta($post["id"], "uip-template-for-roles", true),
          "forUsers" => get_post_meta($post["id"], "uip-template-for-users", true),
          "excludesRoles" => get_post_meta($post["id"], "uip-template-excludes-roles", true),
          "excludesUsers" => get_post_meta($post["id"], "uip-template-excludes-users", true),
          "subsites" => get_post_meta($post["id"], "uip-template-subsites", true),
        ];
      },
      "update_callback" => function ($value, $post) {
        if (!current_user_can("edit_posts")) {
          return false;
        }

        if (isset($value["template"])) {
          update_post_meta($post->ID, "uip-ui-template", $value["template"]);
        }
        if (isset($value["settings"])) {
          update_post_meta($post->ID, "uip-template-settings", $value["settings"]);
        }
        if (isset($value["type"])) {
          update_post_meta($post->ID, "uip-template-type", $value["type"]);
        }
        if (isset($value["forRoles"])) {
          update_post_meta($post->ID, "uip-template-for-roles", $value["forRoles"]);
        }
        if (isset($value["forUsers"])) {
          update_post_meta($post->ID, "uip-template-for-users", $value["forUsers"]);
        }
        if (isset($value["excludesRoles"])) {
          update_post_meta($post->ID, "uip-template-excludes-roles", $value["excludesRoles"]);
        }
        if (isset($value["excludesUsers"])) {
          update_post_meta($post->ID, "uip-template-excludes-users", $value["excludesUsers"]);
        }
        if (isset($value["subsites"])) {
          update_post_meta($post->ID, "uip-template-subsites", $value["subsites"]);
        }

        return true;
      },
      "schema" => [
        "description" => __("UIPress template data", "uipress-lite"),
        "type" => "object",
        "properties" => [
          "template" => [
            "type" => "object",
            "description" => "UI Template Data",
          ],
          "settings" => [
            "type" => "object",
            "description" => "Template Settings",
          ],
          "type" => [
            "type" => "string",
            "description" => "Template Type",
          ],
          "forRoles" => [
            "type" => "array",
            "description" => "Roles With Access",
          ],
          "forUsers" => [
            "type" => "array",
            "description" => "Users With Access",
          ],
          "excludesRoles" => [
            "type" => "array",
            "description" => "Excluded Roles",
          ],
          "excludesUsers" => [
            "type" => "array",
            "description" => "Excluded Users",
          ],
          "subsites" => [
            "type" => "boolean",
            "description" => "Subsite Settings",
          ],
        ],
      ],
    ]);
  }

  /**
   * Queries ui templates and returns query object
   *
   * @param Array $options args array
   * @since 3.2.13
   */
  public static function list($options = ["perPage" => 10, "search" => ""])
  {
    self::order_by_status();

    $args = [
      "post_type" => "uip-ui-template",
      "post_status" => ["publish", "draft"],
      "posts_per_page" => $options["perPage"],
      "s" => $options["search"],
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
    add_filter("posts_orderby", function ($orderby) {
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
      if (!is_object($item) || !property_exists($item, "ID")) {
        continue;
      }

      $temp = [];
      $temp["name"] = get_the_title($item->ID);
      $temp["id"] = $item->ID;
      $temp["modified"] = Dates::getHumanDate($item->ID);
      $temp["actualType"] = get_post_meta($item->ID, "uip-template-type", true);
      $temp["type"] = self::getTemplateType($temp["actualType"]);
      $temp["status"] = get_post_status($item->ID);

      $settings = get_post_meta($item->ID, "uip-template-settings", true);
      if (is_object($settings)) {
        $temp["for"] = property_exists($settings, "rolesAndUsers") ? $settings->rolesAndUsers : [];
        $temp["excludes"] = property_exists($settings, "excludesRolesAndUsers") ? $settings->excludesRolesAndUsers : [];
      } else {
        $temp["for"] = [];
        $temp["excludes"] = [];
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
      "ui-template" => __("UI template", "uipress-lite"),
      "ui-admin-page" => __("Admin page", "uipress-lite"),
      "ui-login-page" => __("Login page", "uipress-lite"),
      "ui-front-template" => __("Frontend toolbar", "uipress-lite"),
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
    $defaults = ["type" => "ui-template", "name" => __("UI Template (Draft)", "uipress-lite")];
    $defaults = array_merge($defaults, $options);

    $my_post = [
      "post_title" => $defaults["name"],
      "post_status" => "draft",
      "post_type" => "uip-ui-template",
    ];

    // Insert the post into the database.
    $templateID = wp_insert_post($my_post);

    // Failed to create post type so exit
    if (!$templateID) {
      return false;
    }

    update_post_meta($templateID, "uip-template-type", $defaults["type"]);

    return $templateID;
  }

  /**
   * Returna a template object
   *
   * @param number $templateID - template options
   * @return template object on success, false on failure
   * @since 3.2.13
   */
  public static function get($templateID)
  {
    // Get template
    $postObject = get_post($templateID);

    if (is_null($postObject)) {
      return false;
    }

    $template = get_post_meta($templateID, "uip-ui-template", true);

    // Check if template exists and isn't empty
    if (!is_array($template)) {
      $template = [];
    }

    $settings = get_post_meta($templateID, "uip-template-settings");
    $type = get_post_meta($templateID, "uip-template-type", true);

    return [
      "template" => json_decode(html_entity_decode(wp_json_encode($template))),
      "settings" => json_decode(html_entity_decode(wp_json_encode($settings))),
      "type" => $type,
    ];
  }

  /**
   * Returna a template object by uid
   *
   * @param number $uid - template uid
   * @return template id on success, false on failure
   * @since 3.2.13
   */
  public static function get_by_uid(string $uid)
  {
    // Exit early if no uid
    if (!$uid) {
      return false;
    }

    // Build query
    $args = [
      "post_type" => "uip-ui-template",
      "posts_per_page" => 1,
      "post_status" => ["publish", "draft"],
      "meta_query" => [
        [
          "key" => "uip-uid",
          "value" => $uid,
          "compare" => "=",
        ],
      ],
    ];

    $query = new \WP_Query($args);
    $foundTemplates = $query->get_posts();

    // No templates found so abort
    if (empty($foundTemplates)) {
      return false;
    }

    return $foundTemplates[0]->ID;
  }

  /**
   * Deletes uiTemplate
   *
   * @param array $templateIDs - array of template ids to delete
   * @return template true on success, false on failure
   * @since 3.2.13
   */
  public static function delete($templateIDs)
  {
    $userID = get_current_user_id();

    // Check permissions
    if (!user_can($userID, "uip_delete_ui")) {
      return false;
    }

    // Check permissions
    if (!is_array($templateIDs)) {
      return false;
    }

    foreach ($templateIDs as $id) {
      $postType = get_post_type($id);
      if ($postType == "uip-ui-template") {
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

    $newStatus = $status == "publish" ? "uiptrue" : "uipfalse";
    $settings->status = $newStatus;
    self::update_settings($templateID, $settings);

    $updateArgs = [
      "ID" => $templateID,
      "post_status" => $status,
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
    // Update Cache key to invalidate local storage cached templates
    $cache_key = bin2hex(random_bytes(6));
    update_option("uipress-cache-key", $cache_key);

    // Get template
    $postObject = get_post($templateID);

    // Template doesn't exist
    if (is_null($postObject)) {
      return false;
    }

    $name = $template->globalSettings->name;
    $status = $template->globalSettings->status == "uipfalse" ? "draft" : "publish";

    $updateArgs = [
      "post_title" => wp_strip_all_tags($name),
      "post_status" => $status,
      "ID" => $templateID,
    ];

    $updated = wp_update_post($updateArgs);

    // Failed to update post
    if (!$updated) {
      return false;
    }

    $multisite = $template->globalSettings->applyToSubsites ?? false;

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
      if ($item->type == "User") {
        $users[] = $item->id;
      }

      if ($item->type == "Role") {
        $roles[] = $item->name;
      }
    }

    update_post_meta($templateID, "uip-template-for-roles", $roles);
    update_post_meta($templateID, "uip-template-for-users", $users);
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
      if ($item->type == "User") {
        $users[] = $item->id;
      }

      if ($item->type == "Role") {
        $roles[] = $item->name;
      }
    }

    update_post_meta($templateID, "uip-template-excludes-roles", $roles);
    update_post_meta($templateID, "uip-template-excludes-users", $users);
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
    $settings = get_post_meta($templateID, "uip-template-settings", true);
    return is_object($settings) ? $settings : new \stdClass();
  }

  /**
   * Get's a templates content
   *
   * @param array $templateIDs - template id
   * @return settings object
   * @since 3.2.13
   */
  public static function get_content($templateID)
  {
    // Get template
    $template = get_post_meta($templateID, "uip-ui-template", true);
    return is_array($template) ? $template : [];
  }

  /**
   * Get's a templates settings
   *
   * @param string $templateIDs - template id
   * @param object $newSettings
   * @return void
   * @since 3.2.13
   */
  public static function update_settings($templateID, $newSettings = null, $type = null, $subsites = null, $content = null)
  {
    // Update settings
    if (isset($newSettings)) {
      update_post_meta($templateID, "uip-template-settings", $newSettings);
    }

    if (isset($type)) {
      update_post_meta($templateID, "uip-template-type", $type);
    }
    if (isset($subsites)) {
      update_post_meta($templateID, "uip-template-subsites", $subsites);
    }
    if (isset($content)) {
      update_post_meta($templateID, "uip-ui-template", $content);
    }
  }

  /**
   * Fetches an active template for current user
   *
   * @param string $type - the template type to check
   * @param number $amount - the amount of templates to return
   */
  public static function get_template_for_user($type, $amount)
  {
    // Current user
    $current_user = wp_get_current_user();
    $username = $current_user->user_login;

    // Push super admin role
    $roles = $current_user->ID == 1 ? ["Super Admin"] : [];

    //Get current roles
    $user = new \WP_User($current_user->ID);
    if (!empty($user->roles) && is_array($user->roles)) {
      foreach ($user->roles as $role) {
        $roles[] = $role;
      }
    }

    $idAsString = strval($current_user->ID);

    // Loop through roles and build query
    $roleQuery = [];
    $roleQuery["relation"] = "AND";
    //First level
    $roleQuery[] = [
      "key" => "uip-template-type",
      "value" => $type,
      "compare" => "=",
    ];
    //Check user id is not excluded
    $roleQuery[] = [
      "key" => "uip-template-excludes-users",
      "value" => serialize($idAsString),
      "compare" => "NOT LIKE",
    ];
    //Check rolename is not excluded
    foreach ($roles as $role) {
      $roleQuery[] = [
        "key" => "uip-template-excludes-roles",
        "value" => serialize($role),
        "compare" => "NOT LIKE",
      ];
    }

    // Check at least one option (roles or users) has a value
    $secondLevel = [];
    $secondLevel["relation"] = "OR";
    $secondLevel[] = [
      "key" => "uip-template-for-users",
      "value" => serialize([]),
      "compare" => "!=",
    ];
    $secondLevel[] = [
      "key" => "uip-template-for-roles",
      "value" => serialize([]),
      "compare" => "!=",
    ];

    //Check user if user id is in selected
    $thirdLevel = [];
    $thirdLevel["relation"] = "OR";
    $thirdLevel[] = [
      "key" => "uip-template-for-users",
      "value" => serialize($idAsString),
      "compare" => "LIKE",
    ];

    foreach ($roles as $role) {
      $thirdLevel[] = [
        "key" => "uip-template-for-roles",
        "value" => serialize($role),
        "compare" => "LIKE",
      ];
    }

    //Push to meta query
    $roleQuery[] = $secondLevel;
    $roleQuery[] = $thirdLevel;

    // Fetch templates from primary multsite installation Multisite
    $multiSiteActive = false;
    if (is_multisite() && is_plugin_active_for_network(uip_plugin_path_name . "/uipress-lite.php") && !is_main_site()) {
      $mainSiteId = get_main_site_id();
      switch_to_blog($mainSiteId);
      $multiSiteActive = true;

      $roleQuery[] = [
        "key" => "uip-template-subsites",
        "value" => "uiptrue",
        "compare" => "==",
      ];
    }

    // Build query
    $args = [
      "post_type" => "uip-ui-template",
      "posts_per_page" => $amount,
      "post_status" => "publish",
      "meta_query" => $roleQuery,
      "suppress_filters" => true,
    ];

    // Hook into parse query to remove elementors query args
    self::maybe_remove_elementor_args();

    $query = new \WP_Query($args);

    $foundTemplates = $query->get_posts();

    if ($multiSiteActive) {
      restore_current_blog();
    }

    return $foundTemplates;
  }

  /**
   * Loops through wp_filters to find if elementor hook is added and removes it
   *
   * Stops elementor from polluting uipress query on template pages with 'parse_query'
   *
   * @since 3.3.0
   */
  private static function maybe_remove_elementor_args()
  {
    global $wp_filter;
    if (!isset($wp_filter["parse_query"])) {
      return;
    }
    $callbacks = Objects::get_nested_property($wp_filter["parse_query"], ["callbacks"]);

    if (!$callbacks || !isset($callbacks[10]) || !is_array($callbacks[10])) {
      return;
    }

    foreach ($callbacks[10] as $callback_key => $callback) {
      if (!isset($callback["function"]) || !is_array($callback["function"])) {
        return;
      }
      if ($callback["function"][1] == "admin_query_filter_types") {
        remove_action("parse_query", $callback["function"], 10);
      }
    }
  }

  /**
   * Formats a given template for export
   *
   * returns object
   * @since 3.2.13
   */
  public static function format_for_export($template)
  {
    $templateID = $template->ID;

    $template = get_post_meta($templateID, "uip-ui-template", true);
    $settings = get_post_meta($templateID, "uip-template-settings", true);
    $type = get_post_meta($templateID, "uip-template-type", true);
    $forRoles = get_post_meta($templateID, "uip-template-for-roles", true);
    $forUsers = get_post_meta($templateID, "uip-template-for-users", true);
    $excludesRoles = get_post_meta($templateID, "uip-template-excludes-roles", true);
    $excludesUsers = get_post_meta($templateID, "uip-template-excludes-users", true);
    $subsites = get_post_meta($templateID, "uip-template-subsites", true);

    // Ensures a unique ID
    $uid = get_post_meta($templateID, "uip-uid", true);
    if (!$uid) {
      $uid = uniqid("uip-", true);
      update_post_meta($templateID, "uip-uid", $uid);
    }

    //Return data to app
    $returndata = [];
    $returndata["name"] = get_the_title($templateID);
    $returndata["content"] = $template;
    $returndata["settings"] = $settings;
    $returndata["type"] = $type;
    $returndata["forRoles"] = $forRoles;
    $returndata["forUsers"] = $forUsers;
    $returndata["excludesRoles"] = $excludesRoles;
    $returndata["excludesUsers"] = $excludesUsers;
    $returndata["subsites"] = $subsites;
    $returndata["uid"] = $uid;
    $returndata["status"] = get_post_status($templateID);

    return $returndata;
  }
}
