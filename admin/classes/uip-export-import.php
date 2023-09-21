<?php
if (!defined('ABSPATH')) {
  exit();
}

class uip_export_import
{
  //Functions for setting up remote site sync and pushing to rest API
  public function host_site_setup()
  {
    $this->push_to_rest();
  }

  public function cron_auto_import()
  {
    $utils = new uip_util();
    $options = $utils->get_uip_option('remote-sync');
    $syncOptions = $options['syncOptions'];

    $response = $this->get_remote_import($syncOptions);

    if (isset($response['error'])) {
      error_log('Unable to automatically sync uipress settings: ' . $response['message']);
    } else {
      error_log('uiPress settings automatically synced successfully');
    }
  }

  public function get_remote_import($options)
  {
    $types = $options->importOptions;
    $path = $options->path;
    $key = $options->key;

    if (!$path || !$key || !is_object($types)) {
      $returndata['error'] = true;
      $returndata['message'] = __('Missing data required for import', 'uipress-lite');
      return $returndata;
    }

    $url = $path . '?key=' . $key . '&sync_options=' . json_encode($types);

    $response = wp_remote_get($url);

    if (is_array($response) && !is_wp_error($response) && 200 === wp_remote_retrieve_response_code($response)) {
      $headers = $response['headers']; // array of http header lines
      $body = $response['body']; // use the content
      error_log($body);
    } else {
      $returndata['error'] = true;
      $returndata['message'] = __('Unable to connect to host site', 'uipress-lite');
      return $returndata;
    }

    if (is_object(json_decode($body))) {
      $content = json_decode($body);

      if (property_exists($content, 'error')) {
        $returndata['error'] = true;
        $returndata['message'] = $content->message;
        return $returndata;
      }

      //Templates
      if (property_exists($content, 'templates')) {
        $this->import_templates($content->templates);
      }

      //Settings
      if (property_exists($content, 'siteSettings')) {
        $this->import_settings($content->siteSettings);
      }

      //Menus
      if (property_exists($content, 'menus')) {
        $this->import_menus($content->menus);
      }

      $returndata['success'] = true;
      $returndata['message'] = __('Improted', 'uipress-lite');
      return $returndata;
    }
  }

  public function push_to_rest()
  {
    add_action('rest_api_init', function () {
      register_rest_route('uipress/v1', '/export', [
        'methods' => 'GET',
        'callback' => [$this, 'uip_rest_export_response'],
        'args' => [
          'key' => [
            'validate_callback' => function ($param, $request, $key) {
              return is_string($param);
            },
          ],
          'sync_options' => [
            'validate_callback' => function ($param, $request, $key) {
              return is_object(json_decode($param));
            },
          ],
        ],
      ]);
    });
  }

  public function uip_rest_export_response($request)
  {
    $utils = new uip_util();
    $options = $utils->clean_ajax_input_width_code(json_decode(stripslashes($request->get_param('sync_options'))));
    $key = sanitize_text_field($request->get_param('key'));

    $utils = new uip_util();

    $siteOptions = $utils->get_uip_option('remote-sync');

    if (!$key || !$options || !isset($siteOptions['key'])) {
      $returndata = [];
      $returndata['error'] = true;
      $returndata['message'] = __('Incorrect key', 'uipress-lite');
      return new WP_REST_Response($returndata, 200);
    }

    if ($siteOptions['key'] != $key) {
      $returndata = [];
      $returndata['error'] = true;
      $returndata['message'] = __('Incorrect key', 'uipress-lite');
      return new WP_REST_Response($returndata, 200);
    }

    $export = $this->format_export($options);

    $returndata = [];
    $returndata['success'] = true;
    $returndata['message'] = 'Success';
    $returndata['export'] = $export;

    // Return the response.
    return new WP_REST_Response($export, 200);
  }

  //Formats exports from options object
  public function format_export($options)
  {
    $templates = [];
    if ($options->templates) {
      $templates = $this->get_all_templates_for_export();
    }

    $siteSettings = [];
    if ($options->siteSettings || $options->themeStyles) {
      $siteSettings = $this->get_site_settings();
    }

    if (!$options->themeStyles) {
      if (isset($siteSettings['theme-styles'])) {
        unset($siteSettings['theme-styles']);
      }
    }

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
      $menus = $this->get_admin_menus();
    }

    $returndata = [];
    $returndata['templates'] = $templates;
    $returndata['siteSettings'] = $siteSettings;
    $returndata['menus'] = $menus;

    return $returndata;
  }

  //Import settings from global import
  public function import_settings($settings)
  {
    if (!$settings || !is_object($settings)) {
      return;
    }
    $currentOptions = get_option('uip-global-settings');
    if (!$currentOptions) {
      $currentOptions = [];
    }
    foreach ($settings as $key => $value) {
      if ($key != 'theme-styles') {
        $value = (array) $value;
      }
      $currentOptions[$key] = $value;
    }

    update_option('uip-global-settings', $currentOptions);
  }

  //Import menus from global import
  public function import_menus($menus)
  {
    if (!$menus || !is_array($menus)) {
      return;
    }

    foreach ($menus as $menu) {
      $tempID = false;
      //Check to see if the template already exists and therefor should be updated
      if (property_exists($menu, 'uid') && $menu->uid) {
        $args = [
          'post_type' => 'uip-admin-menu',
          'posts_per_page' => 1,
          'post_status' => ['publish', 'draft'],
          'meta_query' => [
            [
              'key' => 'uip-uid',
              'value' => $menu->uid,
              'compare' => '=',
            ],
          ],
        ];

        $query = new WP_Query($args);
        $foundTemplates = $query->get_posts();
        if (count($foundTemplates) > 0) {
          $tempID = $foundTemplates[0]->ID;
        }
      }

      $args = [
        'post_title' => wp_strip_all_tags($menu->name),
        'post_status' => $menu->status,
        'post_type' => 'uip-admin-menu',
      ];

      if ($tempID) {
        $args['ID'] = $tempID;
        wp_update_post($args);
      } else {
        $tempID = wp_insert_post($args);
      }

      if (!$tempID) {
        continue;
      }

      if (property_exists($menu, 'uid') && $menu->uid) {
        update_post_meta($tempID, 'uip-uid', $menu->uid);
      }

      update_post_meta($tempID, 'uip_menu_settings', $menu->settings);
    }
  }
  //Import templates from global import
  public function import_templates($templates)
  {
    if (!$templates || !is_array($templates)) {
      return;
    }

    foreach ($templates as $template) {
      $tempID = false;
      //Check to see if the template already exists and therefor should be updated
      if (property_exists($template, 'uid') && $template->uid) {
        $args = [
          'post_type' => 'uip-ui-template',
          'posts_per_page' => 1,
          'post_status' => ['publish', 'draft'],
          'meta_query' => [
            [
              'key' => 'uip-uid',
              'value' => $template->uid,
              'compare' => '=',
            ],
          ],
        ];

        $query = new WP_Query($args);
        $foundTemplates = $query->get_posts();
        if (count($foundTemplates) > 0) {
          $tempID = $foundTemplates[0]->ID;
        }
      }

      $args = [
        'post_title' => wp_strip_all_tags($template->name),
        'post_status' => $template->status,
        'post_type' => 'uip-ui-template',
      ];

      if ($tempID) {
        $args['ID'] = $tempID;
        wp_update_post($args);
      } else {
        $tempID = wp_insert_post($args);
      }

      if (!$tempID) {
        continue;
      }

      update_post_meta($tempID, 'uip-template-settings', $template->settings);
      update_post_meta($tempID, 'uip-template-type', $template->type);
      update_post_meta($tempID, 'uip-ui-template', $template->content);
      update_post_meta($tempID, 'uip-ui-template', $template->content);

      if (property_exists($template, 'uid') && $template->uid) {
        update_post_meta($tempID, 'uip-uid', $template->uid);
      }

      update_post_meta($tempID, 'uip-template-for-roles', $template->forRoles);
      update_post_meta($tempID, 'uip-template-for-users', $template->forUsers);
      update_post_meta($tempID, 'uip-template-excludes-roles', $template->excludesRoles);
      update_post_meta($tempID, 'uip-template-excludes-users', $template->excludesUsers);
      update_post_meta($tempID, 'uip-template-subsites', $template->subsites);
    }
  }

  public function get_all_templates_for_export()
  {
    //Get template
    $args = [
      'post_type' => 'uip-ui-template',
      'posts_per_page' => -1,
      'post_status' => ['publish', 'draft'],
    ];

    $query = new WP_Query($args);
    $totalFound = $query->found_posts;
    $foundPosts = $query->get_posts();

    $formattedTemplates = [];

    foreach ($foundPosts as $item) {
      $template = get_post_meta($item->ID, 'uip-ui-template', true);
      $settings = get_post_meta($item->ID, 'uip-template-settings', true);
      $type = get_post_meta($item->ID, 'uip-template-type', true);

      $forRoles = get_post_meta($item->ID, 'uip-template-for-roles', true);
      $forUsers = get_post_meta($item->ID, 'uip-template-for-users', true);
      $excludesRoles = get_post_meta($item->ID, 'uip-template-excludes-roles', true);
      $excludesUsers = get_post_meta($item->ID, 'uip-template-excludes-users', true);
      $subsites = get_post_meta($item->ID, 'uip-template-subsites', true);

      $uid = get_post_meta($item->ID, 'uip-uid', true);
      if (!$uid) {
        $uid = uniqid('uip-', true);
        update_post_meta($item->ID, 'uip-uid', $uid);
      }

      //Return data to app
      $returndata = [];
      $returndata['name'] = get_the_title($item->ID);
      $returndata['content'] = $template;
      $returndata['settings'] = $settings;
      $returndata['type'] = $type;
      $returndata['forRoles'] = $forRoles;
      $returndata['forUsers'] = $forUsers;
      $returndata['excludesRoles'] = $excludesRoles;
      $returndata['excludesUsers'] = $excludesUsers;
      $returndata['subsites'] = $subsites;
      $returndata['uid'] = $uid;
      $returndata['status'] = get_post_status($item->ID);

      $formattedTemplates[] = $returndata;
    }

    return $formattedTemplates;
  }

  public function get_admin_menus()
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

  public function get_site_settings()
  {
    $options = get_option('uip-global-settings');

    if ($options['uip_pro']) {
      unset($options['uip_pro']);
    }
    if ($options['remote-sync']) {
      unset($options['remote-sync']);
    }

    return $options;
  }
}
