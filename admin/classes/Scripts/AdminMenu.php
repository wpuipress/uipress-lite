<?php
namespace UipressLite\Classes\Scripts;
use UipressLite\Classes\Utils\Sanitize;
use UipressLite\Classes\Utils\Objects;

!defined("ABSPATH") ? exit() : "";

class AdminMenu
{
  /**
   * Hooks into the admin menu
   *
   * @return
   * @since 3.2.13
   */
  public static function capture()
  {
    add_action("parent_file", ["UipressLite\Classes\Scripts\AdminMenu", "capture_wp_menu"], 9999);
  }

  /**
   * Captures the admin menu array
   *
   * @param array $scripts array of scripts / styles
   *
   * @since 3.2.13
   */
  public static function capture_wp_menu($parent_file)
  {
    global $menu, $submenu, $self, $parent_file, $submenu_file, $plugin_page, $typenow;

    // Push unique IDs to the menus
    $menu = self::push_unique_ids($menu);
    $submenu = self::push_submenu_unique_ids($submenu);

    $mergedMenu = self::create_merged_menu($menu, $submenu);

    // Create menu object
    $mastermenu["self"] = $self;
    $mastermenu["parent_file"] = $parent_file;
    $mastermenu["submenu_file"] = $submenu_file;
    $mastermenu["plugin_page"] = $plugin_page;
    $mastermenu["typenow"] = $typenow;
    $mastermenu["menu"] = $menu;
    $mastermenu["submenu"] = $submenu;
    $mastermenu["custom"] = false;
    $mastermenu["mergedMenu"] = $mergedMenu;

    set_transient("uip-master-menu", $mastermenu, 12 * HOUR_IN_SECONDS);

    // Format default menu
    $menuOptions = self::format_admin_menu($mastermenu);
    $formattedMenu = $menuOptions["menu"];

    $mastermenu["menu"] = $formattedMenu;
    $mastermenu["menu_id"] = $menuOptions["menu_id"];
    $mastermenu["custom"] = $menuOptions["custom"];
    self::output_menu($mastermenu);

    return $parent_file;
  }

  /**
   * Merges menus into one array to allow for retrieval
   *
   * @param array $menu
   * @param array $submenu
   *
   * @since 3.3.09
   */
  private static function create_merged_menu($menu, $submenu)
  {
    $returner = [];
    foreach ($menu as $item) {
      array_push($returner, $item);

      $id = isset($item[2]) ? $item[2] : false;

      if (!$id) {
        continue;
      }

      $submenu_items = !empty($submenu[$id]) ? (array) $submenu[$id] : [];

      foreach ($submenu_items as $subitem) {
        $subitem["master_parent"] = $id;
        array_push($returner, $subitem);
      }
    }

    return $returner;
  }

  /**
   * Pushes unique IDs to the menu items
   *
   * @return
   * @since 3.2.13
   */
  public static function push_unique_ids($menu)
  {
    $returner = [];

    if (!is_array($menu)) {
      return $returner;
    }

    foreach ($menu as $key => $item) {
      $type = strpos($item[4] ?? "", "wp-menu-separator") !== false ? "sep" : "item";
      $name = $item[2] . ($type === "sep" ? $item[4] : $item[5]);
      $item["uip_uid"] = hash("ripemd160", $name);

      $item[4] .= $item[4] . " uip_uid_" . $item["uip_uid"] . " uip_wp_id_" . $item[1] . " uip_unp_url_" . $item["2"];

      $returner[$key] = $item;
    }

    return $returner;
  }

  /**
   * Pushes unique IDs to the menu items
   *
   * @return
   * @since 3.2.13
   */
  public static function push_submenu_unique_ids($menu)
  {
    $returner = [];

    if (!is_array($menu)) {
      return $returner;
    }

    foreach ($menu as $key => $item) {
      $temp = [];

      foreach ($item as $index => $subitem) {
        $type = strpos($subitem[4] ?? "", "wp-menu-separator") !== false ? "sep" : "item";
        $name = $subitem[2] . ($subitem === "sep" ? $subitem[4] : $subitem[1]);
        $subitem["uip_uid"] = hash("ripemd160", $name);

        $temp[] = $subitem;
      }

      $returner[$key] = $temp;
    }

    return $returner;
  }

  /**
   * Formats an anonymous function to output the menu as json string
   *
   * @param array $menu - admin menu
   *
   * @return void
   * @since 3.2.13
   */
  private static function output_menu($menu)
  {
    // Create anonymous function so we can use the captured menu at runtime
    $outputter = function () use ($menu) {
      //$menu = Sanitize::clean_input_with_code($menu);

      $menuString = wp_json_encode($menu);
      $menuString = $menuString ?? wp_json_encode([["menu" => []]]);

      // Output menu
      wp_print_inline_script_tag("", ["id" => "uip-admin-menu", "data-menu" => $menuString]);
    };
    add_action("admin_footer", $outputter, 0);
    add_action("wp_footer", $outputter, 0);
  }

  /**
   * Extracts a number from a given html string
   *
   * @param string $html
   *
   * @return void number on success, null on failure
   * @since 3.2.13
   */
  private static function extractNumberFromHtml($html)
  {
    if (is_null($html) || !$html || !class_exists("DOMDocument")) {
      return null;
    }

    $dom = new \DOMDocument();

    libxml_use_internal_errors(true);
    $dom->loadHTML($html, LIBXML_NOWARNING | LIBXML_NOERROR);
    libxml_clear_errors();

    $nodes = $dom->getElementsByTagName("*"); // get all elements

    foreach ($nodes as $node) {
      $nodeValue = trim($node->nodeValue);
      if (is_numeric($nodeValue)) {
        return (int) $nodeValue;
      }
    }

    return null;
  }

  /**
   * Looks at all items within the admin menu and updates given item if match is found
   *
   * allows updated counts and name changes
   *
   * @param object $item - the item to update
   * @param object $mastermenu object containing all items
   *
   * @return updated item if match, original item if no match
   * @since 3.2.0
   */
  private static function maybe_replace_item_with_original($item, $mastermenu)
  {
    // If it's not a custom menu we don't need to do this
    if (!isset($mastermenu["mergedMenu"]) || !$mastermenu["custom"] || !is_array($mastermenu["mergedMenu"])) {
      return $item;
    }

    $uidToSearch = $item["uip_uid"];
    $foundItems = array_filter($mastermenu["mergedMenu"], function ($item) use ($uidToSearch) {
      return isset($item["uip_uid"]) && $item["uip_uid"] === $uidToSearch;
    });

    // If you just want the first found item:
    $firstFoundItem = !empty($foundItems) ? reset($foundItems) : false;

    // Nothing found so return item
    if (!$firstFoundItem) {
      return $item;
    }

    $custom = isset($item["custom"]) ? $item["custom"] : new \stdClass();

    $firstFoundItem["custom"] = $custom;
    $firstFoundItem["submenu"] = isset($item["submenu"]) ? $item["submenu"] : false;

    return $firstFoundItem;
  }

  /**
   * Processes menu for frontend output
   *
   * This function was mostly pulled from the wordpress admin menu output.
   *
   * @since 2.2
   */
  public static function format_admin_menu($mastermenu, $submenu_as_parent = true)
  {
    // Add hook to allow custom menu builder to replace menu
    $mastermenu = apply_filters("uipress/admin/menus/update", $mastermenu);

    $menu = $mastermenu["menu"];
    $submenu = $mastermenu["submenu"];

    $first = true;
    $returnmenu = [];
    $returnsubmenu = [];

    // Handle top level items
    foreach ($menu as $key => $item) {
      // Check whether user has access to item, if not continue
      if (!current_user_can($item[1]) && !current_user_can("manage_options")) {
        continue;
      }

      $returnmenu[] = self::handle_top_level_items($item, $mastermenu);
    }

    $returner["menu"] = $returnmenu;
    $returner["menu_id"] = isset($mastermenu["menu_id"]) ? $mastermenu["menu_id"] : false;
    $returner["custom"] = isset($mastermenu["custom"]) ? $mastermenu["custom"] : false;

    return $returner;
  }

  /**
   * Loops through an array of menu items and returns the item matching the ID
   *
   * @param string $id
   * @param array $menu
   *
   * @since 3.3.09
   */
  private static function find_original_menu_parent($id, $menu)
  {
    foreach ($menu as $item) {
      // Check if the key exists and the value matches
      if (isset($item[2]) && $item[2] === $id) {
        return $item; // Return the matching sub-array
      }
    }
    return false; // Return null if no match is found
  }

  /**
   * Processes top level menu items
   *
   * @param object $item
   * @param object $mastermenu
   *
   * @returns formatted item
   * @since 3.2.0
   *
   */
  private static function handle_top_level_items($item, $mastermenu)
  {
    // Set up vars
    $self = $mastermenu["self"];
    $parent_file = $mastermenu["parent_file"];
    $submenu_file = $mastermenu["submenu_file"];
    $plugin_page = $mastermenu["plugin_page"];
    $typenow = $mastermenu["typenow"];
    $menu = $mastermenu["menu"];
    $submenu = (array) $mastermenu["submenu"];

    // Replace the item with original if it exists:
    $item = self::maybe_replace_item_with_original($item, $mastermenu);

    // Check to see if this is a subitem added as a top level item
    $parentID = isset($item["master_parent"]) ? $item["master_parent"] : false;
    if ($parentID) {
      $parentItem = self::find_original_menu_parent($parentID, $menu);
      $processed_as_sub_items = self::process_sub_menu_items([$item], $parentItem, false, $mastermenu);
      if (is_array($processed_as_sub_items) && isset($processed_as_sub_items[0])) {
        return $processed_as_sub_items[0];
      }
    }

    $admin_is_parent = false;
    $class = isset($item[4]) ? $item[4] : "";
    $aria_attributes = "";
    $aria_hidden = "";
    $item["active"] = false;
    $subkey = $item[2];

    $submenu_items = !empty($submenu[$subkey]) ? (array) $submenu[$subkey] : [];

    $id = !empty($item[5]) ? ' id="' . preg_replace("|[^a-zA-Z0-9_:.]|", "-", $item[5]) . '"' : "";

    // Check for sep
    $is_separator = false !== strpos($class, "wp-menu-separator") ? true : false;

    // Set item type
    $item["type"] = $is_separator ? "sep" : "menu";

    // exit early if sep
    if ($is_separator) {
      return $item;
    }

    $title = wptexturize($item[0]);
    $nameParts = explode("<", $item[0]);
    $strippedName = $nameParts[0] != "" ? $nameParts[0] : $item[0];
    $notifications = self::extractNumberFromHtml($title);

    $item[2] = isset($item[2]) && !is_null($item[2]) ? html_entity_decode($item[2]) : "";

    $item["notifications"] = !is_null($notifications) ? $notifications : 0;
    $item["id"] = isset($item[5]) ? $item[5] : "";
    $item["name"] = html_entity_decode($strippedName);
    $item["icon"] = self::get_menu_icon($item);
    $item["classes"] = $class;

    // If has a submenu
    if (!empty($submenu_items)) {
      $submenu_items = array_values($submenu_items); // Re-index.
      $firstSubmenuItem = (array) $submenu_items[0];
      $firstSubmenuKey = $firstSubmenuItem[2];

      $menu_hook = get_plugin_page_hook($firstSubmenuKey, $item[2]);
      $menu_file = $firstSubmenuKey;
      $pos = strpos($menu_file, "?");
      $menu_file = $pos !== false ? substr($menu_file, 0, $pos) : $menu_file;

      $conditions = !empty($menu_hook) || ("index.php" !== $firstSubmenuKey && file_exists(WP_PLUGIN_DIR . "/$menu_file") && !file_exists(ABSPATH . "/wp-admin/$menu_file"));
      $admin_is_parent = $conditions ? true : false;
      $item["url"] = $conditions ? "admin.php?page={$firstSubmenuKey}" : $firstSubmenuKey;

      // Process submenu
      $item["submenu"] = self::process_sub_menu_items($submenu_items, $item, $admin_is_parent, $mastermenu);
    }

    // No submenu
    if (empty($submenu_items) && !empty($item[2])) {
      $menu_hook = get_plugin_page_hook($item[2], "admin.php");
      $menu_file = $item[2];
      $pos = strpos($menu_file, "?");

      $menu_file = $pos !== false ? substr($menu_file, 0, $pos) : $menu_file;
      $conditions = !empty($menu_hook) || ("index.php" !== $item[2] && file_exists(WP_PLUGIN_DIR . "/$menu_file") && !file_exists(ABSPATH . "/wp-admin/$menu_file"));

      $admin_is_parent = $conditions ? true : false;
      $item["url"] = $conditions ? "admin.php?page={$item[2]}" : $item[2];
    }

    return $item;
  }

  /**
   * Handles and processes submenu items
   *
   * @param array $submenu
   * @param boolean $parentItem
   * @param boolean $admin_is_parent
   * @param object $mastermenu
   *
   * @return arrays of subitems
   * @since 3.2.0
   */
  private static function process_sub_menu_items($submenu, $parentItem, $admin_is_parent, $mastermenu)
  {
    $typenow = $mastermenu["typenow"];
    $submenu_file = $mastermenu["submenu_file"];
    $self = $mastermenu["self"];
    $processed = [];

    foreach ($submenu as $sub_key => $sub_item) {
      $sub_item = (array) $sub_item;
      $sub_item[2] = isset($sub_item[2]) && !is_null($sub_item[2]) ? html_entity_decode($sub_item[2]) : "";
      // Cut if no access
      if (!current_user_can($sub_item[1]) && !current_user_can("manage_options")) {
        continue;
      }

      $class = isset($sub_item[4]) ? $sub_item[4] : "";

      // Check for sep
      $is_separator = false !== strpos($class, "wp-menu-separator") ? true : false;

      // exit early if sep
      if ($is_separator) {
        $processed[] = $sub_item;
        continue;
      }

      $sub_item = self::maybe_replace_item_with_original($sub_item, $mastermenu);
      $sub_item["active"] = false;

      $class = [];
      $aria_attributes = "";

      $parent_id = isset($sub_item["master_parent"]) ? $sub_item["master_parent"] : $parentItem[2];

      $pos = strpos($parent_id, "?");
      $menu_file = $pos !== false ? substr($parent_id, 0, $pos) : $parent_id;

      $menu_hook = get_plugin_page_hook($sub_item[2], $parent_id);
      $sub_file = $sub_item[2];
      $pos = strpos($sub_file, "?");
      $sub_file = $pos !== false ? substr($sub_file, 0, $pos) : $sub_file;
      $title = wptexturize($sub_item[0]);

      $conditions = !empty($menu_hook) || ("index.php" !== $sub_item[2] && file_exists(WP_PLUGIN_DIR . "/$sub_file") && !file_exists(ABSPATH . "/wp-admin/$sub_file"));
      if ($conditions) {
        // If admin.php is the current page or if the parent exists as a file in the plugins or admin directory.
        $adminIsParentConditions = (!$admin_is_parent && file_exists(WP_PLUGIN_DIR . "/$menu_file") && !is_dir(WP_PLUGIN_DIR . "/{$parentItem[2]}")) || file_exists($menu_file);
        $sub_item["url"] = $adminIsParentConditions ? add_query_arg(["page" => $sub_item[2]], $parentItem[2]) : add_query_arg(["page" => $sub_item[2]], "admin.php");
      }

      $sub_item["url"] = !$conditions ? $sub_item[2] : $sub_item["url"];

      $title = wptexturize($sub_item[0]);
      $nameParts = $title ? explode("<", $title) : [];
      $strippedName = isset($nameParts[0]) && $nameParts[0] != "" ? $nameParts[0] : $sub_item[0];
      $notifications = self::extractNumberFromHtml($title);
      $sub_item["notifications"] = !is_null($notifications) ? $notifications : 0;

      $sub_item["name"] = $strippedName;
      $sub_item["type"] = "menu";

      // Recursively handle sub subs
      if (isset($sub_item["submenu"]) && !empty($sub_item["submenu"])) {
        $sub_item["submenu"] = self::process_sub_menu_items($sub_item["submenu"], $parentItem, $admin_is_parent, $mastermenu);
      }

      $processed[] = $sub_item;
    }

    return $processed;
  }

  /**
   * Returns correct icon for relevant menu item
   *
   * @return strings
   * @since 3.2.13
   */
  private static function get_menu_icon($menu_item)
  {
    $icons = [
      "dashicons-dashboard" => "grid_view",
      "dashicons-admin-post" => "article",
      "dashicons-database" => "perm_media",
      "dashicons-admin-media" => "collections",
      "dashicons-admin-page" => "description",
      "dashicons-admin-comments" => "forum",
      "dashicons-admin-appearance" => "palette",
      "dashicons-admin-plugins" => "extension",
      "dashicons-admin-users" => "people",
      "dashicons-admin-tools" => "build_circle",
      "dashicons-chart-bar" => "bar_chart",
      "dashicons-admin-settings" => "tune",
    ];

    // SET MENU ICON
    $theicon = "";
    $wpicon = isset($menu_item[6]) ? $menu_item[6] : "";

    if (isset($menu_item["icon"]) && $menu_item["icon"] != "") {
      return "collections";
    }

    if (isset($icons[$wpicon])) {
      return $icons[$wpicon];
    }

    if (!$theicon) {
      if (strpos($wpicon, "dashicons-uip-icon-") !== false) {
        //ICON IS CUSTOM ADMIN PAGE ICON
        $strippedIcon = str_replace("dashicons-uip-icon-", "", $wpicon);

        return $strippedIcon;
      } elseif (strpos($wpicon, "http") !== false || strpos($wpicon, "data:") !== false) {
        ///ICON IS IMAGE
        return "<img src='{$wpicon}' class='uip-icon-image uip-border-round uip-w-16 uip-ratio-1-1 uip-filter-contrast'>";
      } else {
        ///ICON IS ::BEFORE ELEMENT
        return "<div class='wp-menu-image dashicons-before {$wpicon} uip-w-16 uip-ratio-1-1'></div>";
      }
    }
  }
}
