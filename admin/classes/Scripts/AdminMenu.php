<?php
namespace UipressLite\Classes\Scripts;
use UipressLite\Classes\Utils\Sanitize;

!defined('ABSPATH') ? exit() : '';

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
    add_action('parent_file', ['UipressLite\Classes\Scripts\AdminMenu', 'capture_wp_menu'], 9999);
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

    // Create menu object
    $mastermenu['self'] = $self;
    $mastermenu['parent_file'] = $parent_file;
    $mastermenu['submenu_file'] = $submenu_file;
    $mastermenu['plugin_page'] = $plugin_page;
    $mastermenu['typenow'] = $typenow;
    $mastermenu['menu'] = $menu;
    $mastermenu['submenu'] = $submenu;

    // Format default menu
    $menuOptions = self::uip_format_admin_menu($mastermenu);
    $formattedMenu = $menuOptions['menu'];

    $mastermenu['menu'] = $formattedMenu;
    self::output_menu($mastermenu);

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
  private static function output_menu($menu)
  {
    // Create anonymous function so we can use the captured menu at runtime
    $outputter = function () use ($menu) {
      $menu = Sanitize::clean_input_with_code($menu);
      $menuString = json_encode($menu);
      $menuString = $menuString ?? json_encode([['menu' => []]]);

      // Output menu
      $variableFormatter = "var uipMasterMenu = {$menuString};";
      wp_print_inline_script_tag($variableFormatter, ['id' => 'uip-admin-menu']);
    };
    add_action('admin_footer', $outputter, 0);
    add_action('wp_footer', $outputter, 0);
  }

  /**
   * Processes menu for frontend output
   *
   * This function was mostly pulled from the wordpress admin menu output.
   *
   * @since 2.2
   */
  private static function uip_format_admin_menu($mastermenu, $submenu_as_parent = true)
  {
    $self = $mastermenu['self'];
    $parent_file = $mastermenu['parent_file'];
    $submenu_file = $mastermenu['submenu_file'];
    $plugin_page = $mastermenu['plugin_page'];
    $typenow = $mastermenu['typenow'];
    $menu = $mastermenu['menu'];
    $submenu = $mastermenu['submenu'];

    //error_log(json_encode($submenu));

    $first = true;
    $returnmenu = [];
    $returnsubmenu = [];
    $availableTopItems = [];
    $availableSubItems = [];

    foreach ($menu as $key => $item) {
      $admin_is_parent = false;
      $class = [];
      $aria_attributes = '';
      $aria_hidden = '';
      $is_separator = false;

      if ($first) {
        $class[] = 'wp-first-item';
        $first = false;
      }

      $submenu_items = [];
      if (!empty($submenu[$item[2]])) {
        $class[] = 'wp-has-submenu';
        $submenu_items = $submenu[$item[2]];
      }

      if (($parent_file && $item[2] === $parent_file) || (empty($typenow) && $self === $item[2])) {
        if (!empty($submenu_items)) {
          $class[] = 'wp-has-current-submenu wp-menu-open';
          $item['active'] = false;
        } else {
          $class[] = 'current';
          $aria_attributes .= 'aria-current="page"';
          $item['active'] = false;
        }
      } else {
        $class[] = 'wp-not-current-submenu';
        $item['active'] = false;
        if (!empty($submenu_items)) {
          $aria_attributes .= 'aria-haspopup="true"';
        }
      }

      if (!empty($item[4])) {
        $class[] = esc_attr($item[4]);
      }

      $class = implode(' ', $class);
      $id = !empty($item[5]) ? ' id="' . preg_replace('|[^a-zA-Z0-9_:.]|', '-', $item[5]) . '"' : '';
      $img = '';
      $img_style = '';
      $img_class = ' dashicons-before';

      if (false !== strpos($class, 'wp-menu-separator')) {
        $is_separator = true;
      }

      $title = wptexturize($item[0]);
      $nameParts = explode('<', $item[0]);
      if ($nameParts[0] != '') {
        $strippedName = $nameParts[0];
      } else {
        $strippedName = $item[0];
      }
      $notifications = preg_replace('/[^0-9]/', '', strip_tags($title));
      if (is_numeric($notifications)) {
        $item['notifications'] = $notifications;
      }

      // Hide separators from screen readers.
      if ($is_separator) {
        $aria_hidden = ' aria-hidden="true"';

        $item['type'] = 'sep';

        if (isset($menu_item['name'])) {
          $item['name'] = $strippedName;
        }
      } else {
        $item['id'] = $item[5];
        $item['name'] = html_entity_decode($strippedName);
        $item['icon'] = self::get_menu_icon($item);
        $item['classes'] = $class;
        $item['type'] = 'menu';
      }

      if ($is_separator) {
      } elseif ($submenu_as_parent && !empty($submenu_items)) {
        $submenu_items = array_values($submenu_items); // Re-index.
        $menu_hook = get_plugin_page_hook($submenu_items[0][2], $item[2]);
        $menu_file = $submenu_items[0][2];
        $pos = strpos($menu_file, '?');

        if (false !== $pos) {
          $menu_file = substr($menu_file, 0, $pos);
        }

        if (!empty($menu_hook) || ('index.php' !== $submenu_items[0][2] && file_exists(WP_PLUGIN_DIR . "/$menu_file") && !file_exists(ABSPATH . "/wp-admin/$menu_file"))) {
          $admin_is_parent = true;
          $item['url'] = 'admin.php?page=' . $submenu_items[0][2];
        } else {
          $item['url'] = $submenu_items[0][2];
        }
      } elseif (!empty($item[2]) && current_user_can($item[1])) {
        $menu_hook = get_plugin_page_hook($item[2], 'admin.php');
        $menu_file = $item[2];
        $pos = strpos($menu_file, '?');

        if (false !== $pos) {
          $menu_file = substr($menu_file, 0, $pos);
        }

        if (!empty($menu_hook) || ('index.php' !== $item[2] && file_exists(WP_PLUGIN_DIR . "/$menu_file") && !file_exists(ABSPATH . "/wp-admin/$menu_file"))) {
          $admin_is_parent = true;
          $item['url'] = 'admin.php?page=' . $item[2];
        } else {
          $item['url'] = $item[2];
        }
      }

      if ($is_separator) {
      } else {
        ///CREATE UNIQUE ID FOR MENU ITEMS
        $item['uid'] = hash('ripemd160', $item['id'] . $item['url']);
        array_push($availableTopItems, $item['uid']);
      }

      if (!empty($submenu_items)) {
        $first = true;
        $tempsub = [];

        foreach ($submenu_items as $sub_key => $sub_item) {
          $sub_item['active'] = false;

          if (!current_user_can($sub_item[1])) {
            continue;
          }

          $class = [];
          $aria_attributes = '';

          if ($first) {
            $class[] = 'wp-first-item';
            $first = false;
          }

          $menu_file = $item[2];
          $pos = strpos($menu_file, '?');

          if (false !== $pos) {
            $menu_file = substr($menu_file, 0, $pos);
          }

          // Handle current for post_type=post|page|foo pages, which won't match $self.
          $self_type = !empty($typenow) ? $self . '?post_type=' . $typenow : 'nothing';

          if (isset($submenu_file)) {
            if ($submenu_file === $sub_item[2]) {
              $class[] = 'current';
              $aria_attributes .= ' aria-current="page"';
            }
            // If plugin_page is set the parent must either match the current page or not physically exist.
            // This allows plugin pages with the same hook to exist under different parents.
          } elseif (
            (!isset($plugin_page) && $self === $sub_item[2]) ||
            (isset($plugin_page) && $plugin_page === $sub_item[2] && ($item[2] === $self_type || $item[2] === $self || file_exists($menu_file) === false))
          ) {
            $class[] = 'current';
            $aria_attributes .= ' aria-current="page"';
          }

          if (!empty($sub_item[4])) {
            $class[] = esc_attr($sub_item[4]);
          }

          $class = $class ? ' class="' . implode(' ', $class) . '"' : '';

          $menu_hook = get_plugin_page_hook($sub_item[2], $item[2]);
          $sub_file = $sub_item[2];
          $pos = strpos($sub_file, '?');
          if (false !== $pos) {
            $sub_file = substr($sub_file, 0, $pos);
          }

          $title = wptexturize($sub_item[0]);

          if ($aria_attributes != '') {
            $sub_item['active'] = false;
          }

          if (!empty($menu_hook) || ('index.php' !== $sub_item[2] && file_exists(WP_PLUGIN_DIR . "/$sub_file") && !file_exists(ABSPATH . "/wp-admin/$sub_file"))) {
            // If admin.php is the current page or if the parent exists as a file in the plugins or admin directory.
            if ((!$admin_is_parent && file_exists(WP_PLUGIN_DIR . "/$menu_file") && !is_dir(WP_PLUGIN_DIR . "/{$item[2]}")) || file_exists($menu_file)) {
              $sub_item_url = add_query_arg(['page' => $sub_item[2]], $item[2]);
            } else {
              $sub_item_url = add_query_arg(['page' => $sub_item[2]], 'admin.php');
            }

            $sub_item_url = $sub_item_url;
            $sub_item['url'] = $sub_item_url;
          } else {
            $sub_item['url'] = $sub_item[2];
          }

          $title = $sub_item[0];
          $nameParts = explode('<', $sub_item[0]);

          if ($nameParts[0] != '') {
            $strippedName = $nameParts[0];
          } else {
            $strippedName = html_entity_decode(strip_tags($sub_item[0]));
          }

          $notifications = preg_replace('/[^0-9]/', '', strip_tags($title));

          if (is_numeric($notifications)) {
            $sub_item['notifications'] = $notifications;
          }

          $sub_item['name'] = $strippedName;
          $sub_item['id'] = $item['id'] . $sub_item['url'];
          $sub_item['type'] = 'menu';
          $sub_item['uid'] = hash('ripemd160', $sub_item['id'] . $sub_item['url']);
          array_push($availableSubItems, $sub_item['uid']);
          array_push($tempsub, $sub_item);
        }

        $item['submenu'] = $tempsub;
      }
      $submenu_items = [];
      if (!empty($submenu[$item[2]])) {
        $returnsubmenu[$item[2]] = $tempsub;
      }

      array_push($returnmenu, $item);
    }

    $returner['menu'] = $returnmenu;
    $returner['availableTop'] = $availableTopItems;
    $returner['availableSub'] = $availableSubItems;

    return $returner;
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
      'dashicons-dashboard' => 'grid_view',
      'dashicons-admin-post' => 'article',
      'dashicons-database' => 'perm_media',
      'dashicons-admin-media' => 'collections',
      'dashicons-admin-page' => 'description',
      'dashicons-admin-comments' => 'forum',
      'dashicons-admin-appearance' => 'palette',
      'dashicons-admin-plugins' => 'extension',
      'dashicons-admin-users' => 'people',
      'dashicons-admin-tools' => 'build_circle',
      'dashicons-chart-bar' => 'bar_chart',
      'dashicons-admin-settings' => 'tune',
    ];

    // SET MENU ICON
    $theicon = '';
    $wpicon = $menu_item[6];

    if (isset($menu_item['icon'])) {
      if ($menu_item['icon'] != '') {
        return "<span class='uk-icon-button' uk-icon='icon:{$menu_item['icon']};ratio:0.8'></span>";
      }
    }

    if (isset($icons[$wpicon])) {
      return "<span class='uip-icon uip-icon-medium'>{$icons[$wpicon]}</span>";
    }

    if (!$theicon) {
      if (strpos($wpicon, 'dashicons-uip-icon-') !== false) {
        //ICON IS CUSTOM ADMIN PAGE ICON
        $strippedIcon = str_replace('dashicons-uip-icon-', '', $wpicon);

        return "<span class='uip-icon uip-icon-medium'>{$strippedIcon}</span>";
      } elseif (strpos($wpicon, 'http') !== false || strpos($wpicon, 'data:') !== false) {
        ///ICON IS IMAGE

        return "<img src='{$wpicon}' class='uip-icon-image uip-border-round uip-w-16 uip-ratio-1-1 uip-filter-contrast'>";
      } else {
        ///ICON IS ::BEFORE ELEMENT
        return "<div class='wp-menu-image dashicons-before {$wpicon} uip-w-16 uip-ratio-1-1'></div>";
      }
    }
  }
}
