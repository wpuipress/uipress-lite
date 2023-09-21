<?php
if (!defined('ABSPATH')) {
  exit();
}
#[AllowDynamicProperties]
class uip_util
{
  public function get_user_preference($key)
  {
    if (!$key) {
      return false;
    }
    $currentValue = false;
    $userid = get_current_user_id();
    $current = get_user_meta($userid, 'uip-prefs', true);
    $currentValue = false;

    if (isset($current[$key])) {
      $currentValue = $current[$key];
    }

    if ($currentValue == 'uiptrue') {
      return true;
    }
    if ($currentValue == 'uipfalse') {
      return false;
    }
    return $currentValue;
  }

  public function save_user_preference($key, $newValue)
  {
    if (!$key) {
      return false;
    }
    $currentValue = false;
    $userid = get_current_user_id();
    $current = get_user_meta($userid, 'uip-prefs', true);
    $currentValue = false;

    if (!is_array($current)) {
      $current = [];
    }

    $current[$key] = $newValue;

    update_user_meta($userid, 'uip-prefs', $current);
    return true;
  }
  /**
   * Sanitises and strips tags of input from ajax
   * @since 1.4
   * @modified 3.0.2
   * @variables $values = item to clean (array or string)
   */
  public function clean_ajax_input($values)
  {
    if (is_object($values)) {
      foreach ($values as $index => $in) {
        if (is_object($in)) {
          $values->$index = $this->clean_ajax_input($in);
        } elseif (is_array($in)) {
          $values->$index = $this->clean_ajax_input($in);
        } else {
          if (!$in) {
            $values->$index = $in;
          } else {
            $values->$index = wp_kses($in, []);
          }
        }
      }
    } elseif (is_array($values)) {
      foreach ($values as $index => $in) {
        if (is_object($in)) {
          $values[$index] = $this->clean_ajax_input($in);
        } elseif (is_array($in)) {
          $values[$index] = $this->clean_ajax_input($in);
        } else {
          if (!$in) {
            $values[$index] = $in;
          } else {
            $values[$index] = wp_kses($in, []);
          }
        }
      }
    } else {
      if ($values) {
        $values = wp_kses($values, []);
      }
    }

    return $values;
  }

  /**
   * Sanitises and strips tags of input from ajax
   * @since 1.4
   * @variables $values = item to clean (array or string)
   */
  public function clean_slashes_input($values)
  {
    if (is_object($values)) {
      foreach ($values as $index => $in) {
        if (is_object($in)) {
          $values->$index = $this->clean_slashes_input($in);
        } elseif (is_array($in)) {
          $values->$index = $this->clean_slashes_input($in);
        } else {
          $values->$index = stripslashes($in);
        }
      }
    } elseif (is_array($values)) {
      foreach ($values as $index => $in) {
        if (is_object($in)) {
          $values[$index] = $this->clean_slashes_input($in);
        } elseif (is_array($in)) {
          $values[$index] = $this->clean_slashes_input($in);
        } else {
          $values[$index] = stripslashes($in);
        }
      }
    } else {
      $values = stripslashes($values);
    }

    return $values;
  }

  /**
   * Central function for retrieving global settings
   * @since 3.0.0
   * @variables $option = (string) name of option with 'uip_global_settings'
   */
  public function get_uip_option($option, $multisite = null)
  {
    $multiSiteActive = false;
    if ($multisite && is_multisite() && is_plugin_active_for_network(uip_plugin_path_name . '/uipress-lite.php') && !is_main_site()) {
      $mainSiteId = get_main_site_id();
      switch_to_blog($mainSiteId);
      $multiSiteActive = true;
    }
    $options = get_option('uip-global-settings');

    if ($multiSiteActive) {
      restore_current_blog();
    }

    if (isset($options[$option])) {
      return $options[$option];
    }

    return false;
  }

  /**
   * Central function for updating global settings
   * @since 3.0.0
   * @variables $option = (string) name of option with 'uip_global_settings'
   */
  public function update_uip_option($option, $value)
  {
    $options = get_option('uip-global-settings');

    $options[$option] = $value;

    update_option('uip-global-settings', $options);

    return true;
  }

  /**
   * Central function for retrieving global meta keys for post type
   * @since 3.0.0
   * @variables $post_type = (string) name of post type
   */
  public function get_meta_keys_for_post_types($post_type)
  {
    $args = [];

    $output = 'objects';
    $operator = 'and';

    $post_types = get_post_types($args, $output, $operator);

    $formatted = [];
    $meta_keys = [];

    // Loop through post types and get meta keys
    foreach ($post_types as $type) {
      $posts = get_posts(['post_type' => $type->name, 'limit' => 1]);

      foreach ($posts as $post) {
        $post_meta_keys = get_post_custom_keys($post->ID);
        if ($post_meta_keys) {
          $meta_keys = array_merge($meta_keys, $post_meta_keys);
        }
      }
    }
    $foundColumns = array_values(array_unique($meta_keys));
    $defaultColumns = $this->get_default_columns();
    $formatted = [];

    foreach ($foundColumns as $col) {
      //Keep uipress meta keys out of list
      if (strpos($col, 'uip-') === false) {
        $temp = [];
        $temp['name'] = $col;
        $temp['label'] = $col;
        $temp['active'] = true;
        $temp['type'] = 'meta';
        $formatted[$col] = $temp;
      }
    }

    $allColumns = array_merge($defaultColumns, $formatted);

    return $allColumns;
  }

  public function get_default_columns()
  {
    $columns = [
      'name' => [
        'name' => 'name',
        'label' => __('Title', 'uipress-lite'),
        'active' => true,
        'type' => 'default',
      ],
      'author' => [
        'name' => 'author',
        'label' => __('Author', 'uipress-lite'),
        'active' => true,
        'type' => 'default',
      ],
      'type' => [
        'name' => 'type',
        'label' => __('Type', 'uipress-lite'),
        'active' => true,
        'type' => 'default',
      ],
      'modified' => [
        'name' => 'modified',
        'label' => __('Date', 'uipress-lite'),
        'active' => true,
        'type' => 'default',
      ],
      'categories' => [
        'name' => 'categories',
        'label' => __('Categories', 'uipress-lite'),
        'active' => true,
        'type' => 'default',
      ],
      'tags' => [
        'name' => 'tags',
        'label' => __('Tags', 'uipress-lite'),
        'active' => true,
        'type' => 'default',
      ],
      'id' => [
        'name' => 'id',
        'label' => __('ID', 'uipress-lite'),
        'active' => true,
        'type' => 'default',
      ],
      'actions' => [
        'name' => 'actions',
        'label' => __('Actions', 'uipress-lite'),
        'active' => true,
        'type' => 'default',
      ],
    ];

    return $columns;
  }

  /**
   * Sanitises and strips tags of input from ajax without losing code
   * @since 1.4
   * @variables $values = item to clean (array or string)
   */
  public function clean_ajax_input_width_code($values)
  {
    global $allowedposttags;
    $allowed_atts = [
      'align' => [],
      'class' => [],
      'data' => [],
      'type' => [],
      'id' => [],
      'dir' => [],
      'lang' => [],
      'style' => [],
      'xml:lang' => [],
      'src' => [],
      'alt' => [],
      'href' => [],
      'rel' => [],
      'rev' => [],
      'data-plop' => [],
      'target' => [],
      'novalidate' => [],
      'type' => [],
      'value' => [],
      'name' => [],
      'tabindex' => [],
      'action' => [],
      'method' => [],
      'for' => [],
      'width' => [],
      'height' => [],
      'data' => [],
      'title' => [],
      'script' => [],
      'data-theme' => [],
      'data-height' => [],
      'crossorigin' => [],
    ];
    $allowedposttags['data'] = $allowed_atts;
    $allowedposttags['form'] = $allowed_atts;
    $allowedposttags['label'] = $allowed_atts;
    $allowedposttags['input'] = $allowed_atts;
    $allowedposttags['textarea'] = $allowed_atts;
    $allowedposttags['iframe'] = $allowed_atts;
    $allowedposttags['script'] = $allowed_atts;
    $allowedposttags['style'] = $allowed_atts;
    $allowedposttags['strong'] = $allowed_atts;
    $allowedposttags['small'] = $allowed_atts;
    $allowedposttags['table'] = $allowed_atts;
    $allowedposttags['span'] = $allowed_atts;
    $allowedposttags['abbr'] = $allowed_atts;
    $allowedposttags['code'] = $allowed_atts;
    $allowedposttags['pre'] = $allowed_atts;
    $allowedposttags['div'] = $allowed_atts;
    $allowedposttags['img'] = $allowed_atts;
    $allowedposttags['h1'] = $allowed_atts;
    $allowedposttags['h2'] = $allowed_atts;
    $allowedposttags['h3'] = $allowed_atts;
    $allowedposttags['h4'] = $allowed_atts;
    $allowedposttags['h5'] = $allowed_atts;
    $allowedposttags['h6'] = $allowed_atts;
    $allowedposttags['ol'] = $allowed_atts;
    $allowedposttags['ul'] = $allowed_atts;
    $allowedposttags['li'] = $allowed_atts;
    $allowedposttags['em'] = $allowed_atts;
    $allowedposttags['hr'] = $allowed_atts;
    $allowedposttags['br'] = $allowed_atts;
    $allowedposttags['tr'] = $allowed_atts;
    $allowedposttags['td'] = $allowed_atts;
    $allowedposttags['p'] = $allowed_atts;
    $allowedposttags['a'] = $allowed_atts;
    $allowedposttags['b'] = $allowed_atts;
    $allowedposttags['i'] = $allowed_atts;
    $allowedposttags['link'] = $allowed_atts;

    if (is_object($values)) {
      foreach ($values as $index => $in) {
        if (is_object($in)) {
          try {
            $values->$index = $this->clean_ajax_input_width_code($in);
          } catch (Exception $e) {
            $values->$index = new stdClass();
          }
        } elseif (is_array($in)) {
          try {
            $values->$index = $this->clean_ajax_input_width_code($in);
          } catch (Exception $e) {
            $values->$index = [];
          }
        } else {
          try {
            if ($in) {
              $values->$index = wp_kses($in, $allowedposttags);
            } else {
              $values->$index = $in;
            }
          } catch (Exception $e) {
            $values->$index = '';
          }
        }
      }
    } elseif (is_array($values)) {
      foreach ($values as $index => $in) {
        if (is_object($in)) {
          try {
            $values[$index] = $this->clean_ajax_input_width_code($in);
          } catch (Exception $e) {
            $values[$index] = new stdClass();
          }
        } elseif (is_array($in)) {
          try {
            $values[$index] = $this->clean_ajax_input_width_code($in);
          } catch (Exception $e) {
            $values[$index] = [];
          }
        } else {
          try {
            if ($in) {
              $values[$index] = wp_kses($in, $allowedposttags);
            } else {
              $values[$index] = $in;
            }
          } catch (Exception $e) {
            $values[$index] = '';
          }
        }
      }
    } else {
      if ($values) {
        $values = wp_kses($values, $allowedposttags);
      }
    }

    return $values;
  }

  /**
   * Processes menu for frontend output
   * This function was mostly pulled from the wordpress admin menu output.
   * @since 2.2
   */
  public function uip_format_admin_menu($mastermenu, $submenu_as_parent = true)
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
        $item['icon'] = $this->get_menu_icon($item);
        $item['classes'] = $class;
        $item['type'] = 'menu';
      }

      //$classes = $this->get_menu_clases($menu_item,$thesubmenu);

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
   * Gets menu icon
   * @since 2.2
   */

  public function get_menu_icon($menu_item)
  {
    /// LIST OF AVAILABLE MENU ICONS
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

  /**
   * Parses error log files
   * @since 3.0.92
   * Original code from https://stackoverflow.com/questions/35693581/how-to-parse-php-error-log
   */

  public function getParsedLogFile($logFilePath)
  {
    $parsedLogs = [];
    $logFileHandle = fopen($logFilePath, 'rb');
    $key = -1;

    while (!feof($logFileHandle)) {
      $currentLine = str_replace(PHP_EOL, '', fgets($logFileHandle));

      if (!isset($currentLine[0])) {
        continue;
      }

      // Normal error log line starts with the date & time in []
      if ('[' === $currentLine[0] && !preg_match('/Stack trace/', $currentLine) && !preg_match('/.*PHP.*[0-9]\. /', $currentLine)) {
        $key += 1;
        // Get the datetime when the error occurred and convert it to formatted
        try {
          $dateArr = [];
          preg_match('~^\[(.*?)\]~', $currentLine, $dateArr);
          $currentLine = str_replace($dateArr[0], '', $currentLine);
          $currentLine = trim($currentLine);

          $errorDate = date(get_option('date_format'), strtotime($dateArr[1]));
          $errorTime = date(get_option('time_format'), strtotime($dateArr[1]));
        } catch (\Exception $e) {
          $errorDate = 'unknown date';
          $errorTime = 'unknown time';
        }

        // Get the type of the error
        if (false !== strpos($currentLine, 'PHP Warning')) {
          $currentLine = str_replace('PHP Warning:', '', $currentLine);
          $currentLine = trim($currentLine);
          $errorType = 'WARNING';
        } elseif (false !== strpos($currentLine, 'PHP Notice')) {
          $currentLine = str_replace('PHP Notice:', '', $currentLine);
          $currentLine = trim($currentLine);
          $errorType = 'NOTICE';
        } elseif (false !== strpos($currentLine, 'PHP Fatal error')) {
          $currentLine = str_replace('PHP Fatal error:', '', $currentLine);
          $currentLine = trim($currentLine);
          $errorType = 'FATAL';
        } elseif (false !== strpos($currentLine, 'PHP Parse error')) {
          $currentLine = str_replace('PHP Parse error:', '', $currentLine);
          $currentLine = trim($currentLine);
          $errorType = 'SYNTAX';
        } elseif (false !== strpos($currentLine, 'PHP Exception')) {
          $currentLine = str_replace('PHP Exception:', '', $currentLine);
          $currentLine = trim($currentLine);
          $errorType = 'EXCEPTION';
        } else {
          $errorType = 'UNKNOWN';
        }

        if (false !== strpos($currentLine, ' on line ')) {
          $errorLine = explode(' on line ', $currentLine);
          $errorLine = trim($errorLine[1]);
          $currentLine = str_replace(' on line ' . $errorLine, '', $currentLine);
        } else {
          $errorLine = substr($currentLine, strrpos($currentLine, ':') + 1);
          $currentLine = str_replace(':' . $errorLine, '', $currentLine);
        }

        $errorFile = explode(' in /', $currentLine);

        if (isset($errorFile[1])) {
          $errorFile = '/' . trim($errorFile[1]);
        } else {
          $errorFile = '';
        }
        $currentLine = str_replace(' in ' . $errorFile, '', $currentLine);

        // The message of the error
        $errorMessage = trim($currentLine);

        $parsedLogs[] = [
          'date' => $errorDate,
          'time' => $errorTime,
          'type' => $errorType,
          'file' => $errorFile,
          'line' => (int) $errorLine,
          'message' => $errorMessage,
          'stackTrace' => [],
        ];
      }
      // Stack trace beginning line
      elseif (preg_match('/Stack trace:/', $currentLine)) {
        continue;
      } elseif ('#' === $currentLine[0]) {
        if (preg_match('/#[0-9]\s/', $currentLine, $matches)) {
          $pieces = explode($matches[0], $currentLine);
          $currentLine = $pieces[1];
          $parsedLogs[$key]['stackTrace'][] = trim($currentLine);
        }
      } elseif (preg_match('/.*PHP.*[0-9]\. /', $currentLine, $matches)) {
        $pieces = explode($matches[0], $currentLine);
        $currentLine = $pieces[1];
        $parsedLogs[$key]['stackTrace'][] = trim($currentLine);
      }
    }

    yield $parsedLogs;
  }

  /**
   * Gets capabilities from exisitng roles
   * Original code modified from members plugin by Justin Tadlock
   * @since 2.3.5
   */

  public function get_all_role_capabilities()
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

    $postypeCaps = $this->uip_post_type_caps();

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
   * Original code modified from members plugin by Justin Tadlock
   * @since 2.3.5
   */

  public function uip_post_type_caps()
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

  /**
   * Gets capabilities for post types
   * @since 3.1.2
   */

  public function return_global_option_value($group, $settingName)
  {
    if (!defined('uip_site_settings')) {
      return false;
    }
    $this->uip_site_settings_object = json_decode(uip_site_settings);
    //Folders
    if (!isset($this->uip_site_settings_object->{$group}) || !isset($this->uip_site_settings_object->{$group}->{$settingName})) {
      $returner = false;
    } else {
      $returner = $this->uip_site_settings_object->{$group}->{$settingName};
    }

    if ($returner == 'uiptrue') {
      return true;
    }
    if ($returner == 'uipfalse') {
      return false;
    }
    if ($returner == 'uipblank') {
      return '';
    }
    return $returner;
  }
}
