<?php
if (!defined('ABSPATH')) {
  exit();
}

/**
 * Builds the uipress ui builder
 * @since 3.0.0
 */
class uip_ui_builder extends uip_app
{
  public function __construct()
  {
  }

  /**
   * Starts ui builder functions
   * @since 3.0.0
   */
  public function run()
  {
    //Add actions for the uiBuilder page
    add_action('plugins_loaded', [$this, 'add_ui_builder_actions'], 2);
    add_action('init', [$this, 'create_ui_template_cpt']);
    //Add ajax functions
    add_action('wp_ajax_uip_create_new_ui_template', [$this, 'uip_create_new_ui_template']);
    add_action('wp_ajax_uip_get_ui_template', [$this, 'uip_get_ui_template']);
    add_action('wp_ajax_uip_save_ui_template', [$this, 'uip_save_ui_template']);
    add_action('wp_ajax_uip_save_user_styles', [$this, 'uip_save_user_styles']);
    add_action('wp_ajax_uip_search_posts_pages', [$this, 'uip_search_posts_pages']);
    add_action('wp_ajax_uip_get_ui_templates', [$this, 'uip_get_ui_templates']);
    add_action('wp_ajax_uip_duplicate_ui_template', [$this, 'uip_duplicate_ui_template']);
    add_action('wp_ajax_uip_delete_ui_template', [$this, 'uip_delete_ui_template']);
    add_action('wp_ajax_uip_check_template_applies', [$this, 'uip_check_template_applies']);
    add_action('wp_ajax_uip_save_ui_pattern', [$this, 'uip_save_ui_pattern']);
    add_action('wp_ajax_uip_get_ui_patterns_list', [$this, 'uip_get_ui_patterns_list']);
    add_action('wp_ajax_uip_sync_ui_pattern', [$this, 'uip_sync_ui_pattern']);
    add_action('wp_ajax_uip_upload_image', [$this, 'uip_upload_image']);
    add_action('wp_ajax_uip_get_global_settings', [$this, 'uip_get_global_settings']);
    add_action('wp_ajax_uip_save_global_settings', [$this, 'uip_save_global_settings']);
    add_action('wp_ajax_uip_save_from_wizard', [$this, 'uip_save_from_wizard']);
    add_action('wp_ajax_uip_update_ui_template_status', [$this, 'uip_update_ui_template_status']);
    add_action('wp_ajax_uip_get_ui_styles', [$this, 'uip_get_ui_styles']);
  }

  /**
   * Adds all actions for uipress ui builder
   * @since 3.0.0
   */
  public function add_ui_builder_actions()
  {
    if (uip_stop_plugin) {
      return;
    }

    add_action('admin_menu', [$this, 'add_ui_builder_to_menu']);

    //Only load assets on the builder page
    if (isset($_GET['page'])) {
      if ($_GET['page'] == uip_plugin_shortname . '-ui-builder') {
        add_action('admin_enqueue_scripts', [$this, 'add_scripts_and_styles']);
        add_action('admin_footer', [$this, 'add_footer_scripts'], 0);
        add_action('admin_init', [$this, 'check_for_main_app']);
      }
    }
  }

  /**
   * Checks if we should output conditional actions if main app is not running
   * @since 3.0.0
   */
  public function check_for_main_app()
  {
    if (!uip_app_running) {
      $this->capture_wordpress_objects();
      add_action('admin_head', [$this, 'add_head_scripts'], 1);
    }
  }

  /**
   * Adds ui builder to the admin menu
   * @since 3.0.0
   */
  public function add_ui_builder_to_menu()
  {
    //Only add the page on the primary network site
    if (is_multisite()) {
      if (!is_main_site() && is_plugin_active_for_network(uip_plugin_path_name . '/uipress-lite.php')) {
        return;
      }
    }
    add_options_page(__('uiBuilder', 'uipress-lite'), 'uiBuilder', 'uip_manage_ui', uip_plugin_shortname . '-ui-builder', [$this, 'build_uibuilder_page']);
    add_options_page(__('uiSettings', 'uipress-lite'), 'uiSettings', 'uip_manage_ui', uip_plugin_shortname . '-ui-builder#/site-settings', [$this, 'build_uibuilder_page']);
    return;
  }

  /**
   * Loads required scripts and styles for uipress ui builder
   * @since 3.0.0
   */

  public function add_scripts_and_styles()
  {
    //Add vue & router
    if (!uip_app_running) {
      $this->add_required_styles();
      //Loads translator
      wp_enqueue_script('uip-translations', uip_plugin_url . 'assets/js/uip/uip-translations.min.js', ['wp-i18n'], uip_plugin_version);
      wp_set_script_translations('uip-translations', 'uipress-lite', dirname(dirname(plugin_dir_path(__FILE__))) . '/languages/');
    }
  }

  /**
   * Adds scripts to footer
   * @since 3.0.0
   */

  public function add_footer_scripts()
  {
    $utils = new uip_util();
    //Check if the main app is running, if it is then we don't need to re-add ajax and required script data

    if (!uip_app_running) {
      $variableFormatter = "
      let ajaxHolder = document.getElementById('uip-app-data');
      let ajaxData = ajaxHolder.getAttribute('uip_ajax');
      var uip_ajax = JSON.parse(ajaxData, (k, v) => (v === 'uiptrue' ? true : v === 'uipfalse' ? false : v === 'uipblank' ? '' : v));";

      wp_print_script_tag([
        'id' => 'uip-app-data',
        'uip_ajax' => json_encode([
          'ajax_url' => admin_url('admin-ajax.php'),
          'security' => wp_create_nonce('uip-security-nonce'),
          'rest_url' => get_rest_url(),
          'rest_url' => get_rest_url(),
          'rest_headers' => [
            'Content-Type' => 'application/json',
            'X-WP-Nonce' => wp_create_nonce('wp_rest'),
          ],
          'uipAppData' => [
            'options' => $utils->clean_ajax_input_width_code($this->build_app_options()),
            'userPrefs' => $utils->clean_ajax_input_width_code($this->get_user_prefs()),
          ],
        ]),
      ]);
      wp_print_inline_script_tag($variableFormatter, ['id' => 'uip-format-vars']);
    }

    wp_print_script_tag([
      'id' => 'uip-ui-builder-js',
      'src' => uip_plugin_url . 'assets/js/uip/ui-builder.min.js?ver=' . uip_plugin_version,
      'type' => 'module',
    ]);

    //wp_set_script_translations('uip-ui-builder', 'uipress-lite', dirname(dirname(plugin_dir_path(__FILE__))) . '/languages/');
  }

  /**
   * Starts build of uibuilder page
   * @since 3.0.0
   */
  public function build_uibuilder_page()
  {
    ?>
    <style>
      #wpfooter{
        display:none;
      }
      #wpcontent{
        padding:0;
      }
      #wpbody-content{
        padding-bottom: 0;
      }
      .notice{
        display: none !important;
      }
      @media screen and (max-width: 782px){
      .auto-fold #wpcontent {
          padding-left: 0px;
      }
    }
    </style>
    <div id="uip-ui-builder" ></div>
    
   
    <?php
  }

  /**
   * Creates Ui Builder posts type
   * @since 3.0.0
   */
  public function create_ui_template_cpt()
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
    register_post_type('uip-ui-template', $args);

    //Register template patterns view

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
    register_post_type('uip-ui-pattern', $args);
  }

  /**
   * Saves settings from wizard
   * @since 3.0.92
   */
  public function uip_save_from_wizard()
  {
    if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('uip-security-nonce', 'security') > 0) {
      $utils = new uip_util();
      $options = $utils->clean_ajax_input_width_code(json_decode(stripslashes($_POST['settings'])));
      $styles = $utils->clean_ajax_input_width_code(json_decode(stripslashes($_POST['styles'])));
      $template = false;

      //error_log(json_encode($options));

      if (!is_object($options)) {
        $returndata['error'] = true;
        $returndata['message'] = __('Unable to save site settings. Data corrupted', 'uipress-lite');
        wp_send_json($returndata);
      }

      //Get and decode template
      $template = false;
      if (isset($options->templateJSON)) {
        if ($options->templateJSON && $options->templateJSON != '' && $options->templateJSON != 'uipblank') {
          $template = json_decode($options->templateJSON);
          $this->create_new_template($template, $options);
        }
      }

      //Get site settings

      $globalSettings = get_option('uip-global-settings');
      if (!$globalSettings || !is_array($globalSettings)) {
        $globalSettings = [];
      }
      if (!isset($globalSettings['site-settings'])) {
        $globalSettings['site-settings'] = new stdClass();
        $globalSettings['site-settings']->general = new stdClass();
        $globalSettings['site-settings']->login = new stdClass();
      }
      if (!isset($globalSettings['site-settings']->general)) {
        $globalSettings['site-settings']->general = new stdClass();
      }
      if (!isset($globalSettings['site-settings']->login)) {
        $globalSettings['site-settings']->login = new stdClass();
      }

      $siteSettings = $globalSettings['site-settings'];

      //Save light logo
      if (isset($options->logo) && is_object($options->logo)) {
        if (!isset($siteSettings->general->globalLogo)) {
          $siteSettings->general->globalLogo = new stdClass();
        }
        if ($options->logo->url != '' && $options->logo->url != 'uipblank') {
          $siteSettings->general->globalLogo = $options->logo;
          error_log($options->logo->url);
        }
      }
      //Save dark logo
      if (isset($options->darkLogo) && $options->darkLogo && is_object($options->darkLogo)) {
        if (!isset($siteSettings->general->globalLogoDarkMode)) {
          $siteSettings->general->globalLogoDarkMode = new stdClass();
        }
        if ($options->darkLogo->url != '' && $options->darkLogo->url != 'uipblank') {
          $siteSettings->general->globalLogoDarkMode = $options->darkLogo;
          error_log($options->logo->url);
        }
      }

      //Save login logo
      if (isset($options->loginLogo) && $options->loginLogo && is_object($options->loginLogo)) {
        if (!isset($siteSettings->login->logo)) {
          $siteSettings->login->logo = new stdClass();
        }
        if ($options->loginLogo->url != '' && $options->loginLogo->url != 'uipblank') {
          $siteSettings->login->logo = $options->loginLogo;
        }
      }

      //Save login background
      if (isset($options->loginBackground) && $options->loginBackground && is_object($options->loginBackground)) {
        if (!isset($siteSettings->login->background_image)) {
          $siteSettings->login->background_image = new stdClass();
        }
        if ($options->loginBackground->url != '' && $options->loginBackground->url != 'uipblank') {
          $siteSettings->login->background_image = $options->loginBackground;
        }
      }

      //Save login theme
      if (isset($options->enableLoginTheme) && $options->enableLoginTheme) {
        if (!isset($siteSettings->login->loginTheme)) {
          $siteSettings->login->loginTheme = false;
        }
        $siteSettings->login->loginTheme = $options->enableLoginTheme;
      }

      $globalSettings['site-settings'] = $siteSettings;

      if ($styles && is_object($styles)) {
        $globalSettings['theme-styles'] = $styles;
      }

      update_option('uip-global-settings', $globalSettings);

      $returndata['success'] = true;
      wp_send_json($returndata);
    }
  }

  /**
   * Creates a new template from the setup wizard
   * @since 3.0.98
   */
  public function create_new_template($template, $options)
  {
    $my_post = [
      'post_title' => __('Admin theme', 'uipress-lite'),
      'post_status' => 'publish',
      'post_type' => 'uip-ui-template',
    ];

    // Insert the post into the database.
    $postID = wp_insert_post($my_post);

    if ($options->appliesTo && is_array($options->appliesTo)) {
      $rolesAndUsers = $options->appliesTo;
    } else {
      $rolesAndUsers = [];
    }

    $roles = [];
    $users = [];
    foreach ($rolesAndUsers as $item) {
      if ($item->type == 'User') {
        $users[] = $item->id;
      }

      if ($item->type == 'Role') {
        $roles[] = $item->name;
      }
    }
    //Template not for
    if ($options->excludes && is_array($options->excludes)) {
      $excludeRolesAndUsers = $options->excludes;
    } else {
      $excludeRolesAndUsers = [];
    }
    $excludeRoles = [];
    $excludeUsers = [];
    foreach ($excludeRolesAndUsers as $item) {
      if ($item->type == 'User') {
        $excludeUsers[] = $item->id;
      }

      if ($item->type == 'Role') {
        $excludeRoles[] = $item->name;
      }
    }

    //Template for
    $globalSettings = new stdClass();
    $globalSettings->rolesAndUsers = $rolesAndUsers;
    $globalSettings->excludesRolesAndUsers = $excludeRolesAndUsers;

    update_post_meta($postID, 'uip-template-for-roles', $roles);
    update_post_meta($postID, 'uip-template-for-users', $users);
    update_post_meta($postID, 'uip-template-excludes-roles', $excludeRoles);
    update_post_meta($postID, 'uip-template-excludes-users', $excludeUsers);

    update_post_meta($postID, 'uip-template-settings', $globalSettings);
    update_post_meta($postID, 'uip-template-type', 'ui-template');
    update_post_meta($postID, 'uip-template-subsites', 'uiptrue');
    update_post_meta($postID, 'uip-ui-template', $template);
  }

  /**
   * Saves global settings object
   * @since 3.0.92
   */
  public function uip_save_global_settings()
  {
    if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('uip-security-nonce', 'security') > 0) {
      $utils = new uip_util();
      $options = $utils->clean_ajax_input_width_code(json_decode(stripslashes($_POST['settings'])));

      if (!is_object($options)) {
        $returndata['error'] = true;
        $returndata['message'] = __('Unable to save site settings. Data corrupted', 'uipress-lite');
        wp_send_json($returndata);
      }

      $utils->update_uip_option('site-settings', $options);

      $returndata['success'] = true;
      wp_send_json($returndata);
    }
  }

  /**
   * Gets global settings object
   * @since 3.0.92
   */
  public function uip_get_global_settings()
  {
    if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('uip-security-nonce', 'security') > 0) {
      $utils = new uip_util();
      $options = $utils->get_uip_option('site-settings');

      if (!$options) {
        $options = new stdClass();
      }

      $returndata['success'] = true;
      $returndata['options'] = json_decode(html_entity_decode(json_encode($options)));
      wp_send_json($returndata);
    }
  }

  /**
   * Uploads an image from front
   * @since 3.0.0
   */
  public function uip_upload_image()
  {
    if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('uip-security-nonce', 'security') > 0) {
      require_once ABSPATH . 'wp-admin/includes/image.php';
      require_once ABSPATH . 'wp-admin/includes/file.php';

      $utils = new uip_util();
      $file = $utils->clean_ajax_input($_FILES);

      $uploadedfile = $file['file'];
      $upload_overrides = [
        'test_form' => false,
      ];

      $movefile = wp_handle_upload($uploadedfile, $upload_overrides);

      // IF ERROR
      if (is_wp_error($movefile)) {
        $returndata['error'] = true;
        wp_send_json($returndata);
      }
      ////ADD Attachment

      $wp_upload_dir = wp_upload_dir();
      $withoutExt = preg_replace('/\\.[^.\\s]{3,4}$/', '', $uploadedfile['name']);

      $attachment = [
        'guid' => $movefile['url'],
        'post_mime_type' => $movefile['type'],
        'post_title' => $withoutExt,
        'post_content' => '',
        'post_status' => 'published',
      ];

      $id = wp_insert_attachment($attachment, $movefile['file'], 0);

      $attach_data = wp_generate_attachment_metadata($id, $movefile['file']);
      wp_update_attachment_metadata($id, $attach_data);

      $returndata['success'] = true;
      $returndata['url'] = wp_get_attachment_url($id);
      wp_send_json($returndata);
    }
  }

  /**
   * Creates new ui template
   * @since 3.0.0
   */
  public function uip_create_new_ui_template()
  {
    if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('uip-security-nonce', 'security') > 0) {
      $type = sanitize_text_field($_POST['templateType']);

      $my_post = [
        'post_title' => __('UI Template (Draft)', 'uipress-lite'),
        'post_status' => 'draft',
        'post_type' => 'uip-ui-template',
      ];

      // Insert the post into the database.
      $postID = wp_insert_post($my_post);

      if ($postID) {
        update_post_meta($postID, 'uip-template-type', $type);
        $returndata = [];
        $returndata['success'] = true;
        $returndata['id'] = $postID;
        $returndata['message'] = __('Template created', 'uipress-lite');
        wp_send_json($returndata);
      } else {
        $returndata['error'] = true;
        $returndata['message'] = __('Unable to create template', 'uipress-lite');
        wp_send_json($returndata);
      }
    }
    die();
  }

  /**
   * Gets ui template
   * @since 3.0.0
   */
  public function uip_get_ui_templates()
  {
    if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('uip-security-nonce', 'security') > 0) {
      $utils = new uip_util();
      $page = sanitize_option('page_for_posts', $_POST['page']);
      $string = sanitize_text_field($_POST['search']);

      $filter = 'all';
      if (isset($_POST['filter'])) {
        $filter = sanitize_text_field($_POST['filter']);
      }

      add_filter('posts_orderby', function ($orderby) {
        global $wpdb;
        return "{$wpdb->posts}.post_status DESC"; // You can change ASC to DESC if you want descending order
      });

      //Get template
      $args = [
        'post_type' => 'uip-ui-template',
        'posts_per_page' => -1,
        's' => $string,
      ];

      if ($filter == 'drafts') {
        $args['post_status'] = 'draft';
      }
      if ($filter == 'active') {
        $args['post_status'] = 'publish';
      }

      if ($filter == 'templates') {
        $typeQuery['relation'] = 'AND';
        $typeQuery[] = [
          'key' => 'uip-template-type',
          'value' => 'ui-template',
          'compare' => '=',
        ];
        $args['meta_query'] = $typeQuery;
      }
      if ($filter == 'pages') {
        $typeQuery['relation'] = 'AND';
        $typeQuery[] = [
          'key' => 'uip-template-type',
          'value' => 'ui-admin-page',
          'compare' => '=',
        ];
        $args['meta_query'] = $typeQuery;
      }
      if ($filter == 'toolbar') {
        $typeQuery['relation'] = 'AND';
        $typeQuery[] = [
          'key' => 'uip-template-type',
          'value' => 'ui-front-template',
          'compare' => '=',
        ];
        $args['meta_query'] = $typeQuery;
      }

      $query = new WP_Query($args);
      $totalFound = $query->found_posts;
      $foundPosts = $query->get_posts();

      $formattedPosts = [];

      foreach ($foundPosts as $item) {
        $temp = [];

        $modified = get_the_modified_date('U', $item->ID);
        $humandate = human_time_diff($modified, strtotime(date('Y-D-M'))) . ' ' . __('ago', 'uipress-lite');

        $post_type_obj = get_post_type_object(get_post_type($item->ID));

        $type = get_post_meta($item->ID, 'uip-template-type', true);
        $temp['actualType'] = $type;

        if ($type == 'ui-template') {
          $type = __('UI template', 'uipress-lite');
        } elseif ($type == 'ui-admin-page') {
          $type = __('Admin page', 'uipress-lite');
        } elseif ($type == 'ui-login-page') {
          $type = __('Login page', 'uipress-lite');
        } elseif ($type == 'ui-front-template') {
          $type = __('Frontend toolbar', 'uipress-lite');
        }

        $settings = get_post_meta($item->ID, 'uip-template-settings', true);
        if (is_object($settings)) {
          $for = [];
          if (property_exists($settings, 'rolesAndUsers')) {
            $for = $settings->rolesAndUsers;
          }
          $excludes = [];
          if (property_exists($settings, 'excludesRolesAndUsers')) {
            $excludes = $settings->excludesRolesAndUsers;
          }
        } else {
          $for = [];
          $excludes = [];
        }

        $temp['name'] = get_the_title($item->ID);
        $temp['id'] = $item->ID;
        $temp['modified'] = $humandate;
        $temp['for'] = $for;
        $temp['excludes'] = $excludes;
        $temp['type'] = $type;
        $temp['status'] = get_post_status($item->ID);
        $formattedPosts[] = $temp;
      }

      //Return data to app
      $returndata = [];
      $returndata['success'] = true;
      $returndata['templates'] = $formattedPosts;
      $returndata['totalFound'] = $totalFound;
      $returndata['totalPages'] = $query->max_num_pages;
      wp_send_json($returndata);
    }
    die();
  }

  /**
   * Gets ui patterns
   * @since 3.0.0
   */
  public function uip_get_ui_patterns()
  {
    //Get template
    $args = [
      'post_type' => 'uip-ui-pattern',
      'posts_per_page' => -1,
    ];

    $query = new WP_Query($args);
    $foundPosts = $query->get_posts();

    $formattedPosts = [];

    foreach ($foundPosts as $item) {
      $temp = [];

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

      $temp['name'] = $name;
      $temp['id'] = $item->ID;
      $temp['template'] = $template;
      $temp['type'] = $type;
      $temp['description'] = $des;
      $temp['icon'] = $icon;
      $formattedPosts[] = $temp;
    }

    //Return data to app
    return $formattedPosts;
  }

  /**
   * Gets ui template
   * @since 3.0.0
   */
  public function uip_get_ui_template()
  {
    if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('uip-security-nonce', 'security') > 0) {
      $utils = new uip_util();
      $templateID = sanitize_text_field($_POST['templateID']);

      //Get template
      $postObject = get_post($templateID);

      if (is_null($postObject)) {
        $returndata['error'] = true;
        $returndata['message'] = __('Unable to fetch template', 'uipress-lite');
        wp_send_json($returndata);
      }

      //$template['name'] = get_the_title($templateID);
      //$template['status'] = get_post_status($templateID);
      $template = get_post_meta($templateID, 'uip-ui-template', true);

      //Check if template exists and isn't empty
      if (!is_array($template)) {
        $template = [];
      }

      $settings = get_post_meta($templateID, 'uip-template-settings');
      $type = get_post_meta($templateID, 'uip-template-type', true);

      $options = get_option('uip-global-settings');
      $styles = [];
      if ($options && is_array($options) && isset($options['theme-styles']) && is_object($options['theme-styles'])) {
        $styles = $options['theme-styles'];
      }

      $template = json_decode(html_entity_decode(json_encode($template)));
      $settings = json_decode(html_entity_decode(json_encode($settings)));
      $styles = json_decode(html_entity_decode(json_encode($styles)));

      //Return data to app
      $returndata = [];
      $returndata['success'] = true;
      $returndata['content'] = $template;
      $returndata['message'] = __('Succesfully fetched Ui template', 'uipress-lite');
      $returndata['settings'] = $settings;
      $returndata['styles'] = $styles;
      $returndata['type'] = $type;
      $returndata['patterns'] = $this->uip_get_ui_patterns();
      wp_send_json($returndata);
    }
    die();
  }

  /**
   * Gets ui styles
   * @since 3.0.98
   */
  public function uip_get_ui_styles()
  {
    if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('uip-security-nonce', 'security') > 0) {
      $utils = new uip_util();

      $options = get_option('uip-global-settings');
      $styles = [];
      if ($options && is_array($options) && isset($options['theme-styles']) && is_object($options['theme-styles'])) {
        $styles = $options['theme-styles'];
      }

      $styles = json_decode(html_entity_decode(json_encode($styles)));

      //Return data to app
      $returndata = [];
      $returndata['success'] = true;
      $returndata['styles'] = $styles;
      wp_send_json($returndata);
    }
    die();
  }

  /**
   * Checks current template settings to see who template will apply too
   * @since 3.0.0
   */
  public function uip_check_template_applies()
  {
    if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('uip-security-nonce', 'security') > 0) {
      $utils = new uip_util();
      $usersAndRolesFor = $utils->clean_ajax_input(json_decode(stripslashes($_POST['usersFor'])));
      $usersAndRolesExcluded = $utils->clean_ajax_input(json_decode(stripslashes($_POST['usersExcluded'])));

      //Get user details
      $current_user = wp_get_current_user();
      $userId = $current_user->ID;

      $roles = [];
      if ($userId == 1) {
        $roles[] = 'Super Admin';
      }

      //Get current roles
      $user = new WP_User($userId);

      if (!empty($user->roles) && is_array($user->roles)) {
        foreach ($user->roles as $role) {
          $roles[] = $role;
        }
      }

      //Template for
      $rolesFor = [];
      $usersFor = [];
      foreach ($usersAndRolesFor as $item) {
        if ($item->type == 'User') {
          $usersFor[] = $item->id;
        }

        if ($item->type == 'Role') {
          $rolesFor[] = $item->name;
        }
      }

      $rolesAgainst = [];
      $usersAgainst = [];
      foreach ($usersAndRolesExcluded as $item) {
        if ($item->type == 'User') {
          $usersAgainst[] = $item->id;
        }

        if ($item->type == 'Role') {
          $rolesAgainst[] = $item->name;
        }
      }

      $templateAppliesToYou = false;
      //Check user name
      if (in_array($userId, $usersFor)) {
        $templateAppliesToYou = true;
      }
      //Check roles
      foreach ($roles as $role) {
        if (in_array($role, $rolesFor)) {
          $templateAppliesToYou = true;
        }
      }

      foreach ($roles as $role) {
        if (in_array($role, $rolesAgainst)) {
          $templateAppliesToYou = false;
        }
      }
      if (in_array($userId, $usersAgainst)) {
        $templateAppliesToYou = false;
      }

      $returndata = [];
      $returndata['success'] = true;
      $returndata['message'] = __('Templates deleted', 'uipress-lite');
      $returndata['areWeIn'] = $templateAppliesToYou;
      wp_send_json($returndata);
    }
    die();
  }

  /**
   * Deletes templates: accepts either single id or array of ids
   * @since 3.0.0
   */
  public function uip_delete_ui_template()
  {
    if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('uip-security-nonce', 'security') > 0) {
      $utils = new uip_util();
      $templateIDs = $utils->clean_ajax_input(json_decode(stripslashes($_POST['templateids'])));

      if (!user_can(get_current_user_id(), 'uip_delete_ui')) {
        $returndata['error'] = true;
        $returndata['message'] = __('You don\'t have permission to delete UI Templates', 'uipress-lite');
        wp_send_json($returndata);
      }

      if (!is_array($templateIDs) && is_numeric($templateIDs)) {
        wp_delete_post($templateIDs, true);
        $returndata = [];
        $returndata['success'] = true;
        $returndata['message'] = __('Template deleted', 'uipress-lite');
        wp_send_json($returndata);
      }

      if (is_array($templateIDs)) {
        foreach ($templateIDs as $id) {
          wp_delete_post($id, true);
        }

        $returndata = [];
        $returndata['success'] = true;
        $returndata['message'] = __('Templates deleted', 'uipress-lite');
        wp_send_json($returndata);
      }
    }
    die();
  }

  /**
   * Updates tempate status from the table
   * @since 3.0.98
   */
  public function uip_update_ui_template_status()
  {
    if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('uip-security-nonce', 'security') > 0) {
      $utils = new uip_util();
      $templateID = sanitize_text_field($_POST['templateid']);
      $status = sanitize_text_field($_POST['status']);
      $templateFor = $utils->clean_ajax_input(json_decode(stripslashes($_POST['templatefor'])));

      if (!$templateID || !$status) {
        $returndata['error'] = true;
        $returndata['message'] = __('Unable to update template status', 'uipress-lite');
        wp_send_json($returndata);
      }

      if (!current_user_can('edit_post', $templateID)) {
        $returndata['error'] = true;
        $returndata['message'] = __('You don\'t have the correct permissions to edit this template', 'uipress-pro');
        wp_send_json($returndata);
      }

      $updateArgs = [
        'ID' => $templateID,
        'post_status' => $status,
      ];

      $updated = wp_update_post($updateArgs);

      $settings = get_post_meta($templateID, 'uip-template-settings', true);

      if (!is_object($settings)) {
        $settings = new stdClass();
      }
      if ($status == 'publish') {
        $settings->status = 'uiptrue';
      } else {
        $settings->status = 'uipfalse';
      }

      // Update template for items
      if (is_array($templateFor)) {
        $settings->rolesAndUsers = $templateFor;

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

      update_post_meta($templateID, 'uip-template-settings', $settings);

      if (!$updated) {
        $returndata['error'] = true;
        $returndata['message'] = __('Unable to update template status', 'uipress-lite');
        wp_send_json($returndata);
      }

      $returndata = [];
      $returndata['success'] = true;
      $returndata['message'] = __('Template updated', 'uipress-lite');
      wp_send_json($returndata);
    }
    die();
  }

  /**
   * Duplicates ui template
   * @since 3.0.0
   */
  public function uip_duplicate_ui_template()
  {
    if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('uip-security-nonce', 'security') > 0) {
      $utils = new uip_util();
      $templateID = sanitize_text_field($_POST['id']);

      //Get template
      $toDuplicate = get_post($templateID);

      if (is_null($toDuplicate)) {
        $returndata['error'] = true;
        $returndata['message'] = __('Unable to duplicate template', 'uipress-lite');
        wp_send_json($returndata);
      }

      $title = get_the_title($toDuplicate) . ' ' . __('copy', 'uipress-lite');
      $status = 'draft';

      $templateSettings = get_post_meta($toDuplicate->ID, 'uip-template-settings', true);
      $template = get_post_meta($toDuplicate->ID, 'uip-ui-template', true);
      $type = get_post_meta($toDuplicate->ID, 'uip-template-type', true);

      $roles = get_post_meta($toDuplicate->ID, 'uip-template-for-roles', true);
      $users = get_post_meta($toDuplicate->ID, 'uip-template-for-users', true);
      $excludeRoles = get_post_meta($toDuplicate->ID, 'uip-template-excludes-roles', true);
      $excludeUsers = get_post_meta($toDuplicate->ID, 'uip-template-excludes-users', true);
      $multisite = get_post_meta($toDuplicate->ID, 'uip-template-subsites', true);

      $updateArgs = [
        'post_title' => wp_strip_all_tags($title),
        'post_status' => $status,
        'post_type' => 'uip-ui-template',
      ];

      $updated = wp_insert_post($updateArgs);

      if (!$updated) {
        $returndata['error'] = true;
        $returndata['message'] = __('Unable to duplicate template', 'uipress-lite');
        wp_send_json($returndata);
      }

      if (!is_array(json_decode(json_encode($template)))) {
        wp_delete_post($updated, true);
        $returndata['error'] = true;
        $returndata['message'] = __('Unable to duplicate template. Template is corrupted', 'uipress-lite');
        wp_send_json($returndata);
      }

      if (!is_object(json_decode(json_encode($templateSettings)))) {
        wp_delete_post($updated, true);
        $returndata['error'] = true;
        $returndata['message'] = __('Unable to duplicate template. Settings are corrupted', 'uipress-lite');
        wp_send_json($returndata);
      }

      update_post_meta($updated, 'uip-template-settings', $templateSettings);
      update_post_meta($updated, 'uip-ui-template', $template);
      update_post_meta($updated, 'uip-template-type', $type);
      //Roles and users
      update_post_meta($updated, 'uip-template-for-roles', $roles);
      update_post_meta($updated, 'uip-template-for-users', $users);
      update_post_meta($updated, 'uip-template-excludes-roles', $excludeRoles);
      update_post_meta($updated, 'uip-template-excludes-users', $excludeUsers);
      update_post_meta($updated, 'uip-template-subsites', $multisite);

      //Return data to app
      $returndata = [];
      $returndata['success'] = true;
      $returndata['message'] = __('Template duplicated', 'uipress-lite');
      wp_send_json($returndata);
    }
    die();
  }

  /**
   * Saves ui template
   * @since 3.0.0
   */
  public function uip_save_ui_template()
  {
    if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('uip-security-nonce', 'security') > 0) {
      $utils = new uip_util();
      $template = $utils->clean_ajax_input_width_code(json_decode(stripslashes($_POST['template'])));
      $templateID = sanitize_text_field($_POST['templateID']);
      $styles = $utils->clean_ajax_input_width_code(json_decode(stripslashes($_POST['styles'])));

      //Get template
      $postObject = get_post($templateID);

      if (is_null($postObject)) {
        $returndata['error'] = true;
        $returndata['message'] = __('Unable to fetch template', 'uipress-lite');
        wp_send_json($returndata);
      }

      $name = $template->globalSettings->name;

      if ($template->globalSettings->status == 'uipfalse') {
        $status = 'draft';
      } else {
        $status = 'publish';
      }

      $updateArgs = [
        'post_title' => wp_strip_all_tags($name),
        'post_status' => $status,
        'ID' => $templateID,
      ];

      $updated = wp_update_post($updateArgs);

      if (!$updated) {
        $returndata['error'] = true;
        $returndata['message'] = __('Unable to save template', 'uipress-lite');
        wp_send_json($returndata);
      }

      if (!is_array(json_decode(json_encode($template->content)))) {
        $returndata['error'] = true;
        $returndata['message'] = __('Unable to save template. Template is corrupted', 'uipress-lite');
        wp_send_json($returndata);
      }

      if (!is_object(json_decode(json_encode($template->globalSettings)))) {
        $returndata['error'] = true;
        $returndata['message'] = __('Unable to save template. Settings are corrupted', 'uipress-lite');
        wp_send_json($returndata);
      }

      //Template for
      $rolesAndUsers = $template->globalSettings->rolesAndUsers;
      $roles = [];
      $users = [];
      foreach ($rolesAndUsers as $item) {
        if ($item->type == 'User') {
          $users[] = $item->id;
        }

        if ($item->type == 'Role') {
          $roles[] = $item->name;
        }
      }
      //Template not for
      $excludeRolesAndUsers = $template->globalSettings->excludesRolesAndUsers;
      $excludeRoles = [];
      $excludeUsers = [];
      foreach ($excludeRolesAndUsers as $item) {
        if ($item->type == 'User') {
          $excludeUsers[] = $item->id;
        }

        if ($item->type == 'Role') {
          $excludeRoles[] = $item->name;
        }
      }

      $multisite = false;
      if (isset($template->globalSettings->applyToSubsites)) {
        $multisite = $template->globalSettings->applyToSubsites;
      }

      update_post_meta($updated, 'uip-template-for-roles', $roles);
      update_post_meta($updated, 'uip-template-for-users', $users);
      update_post_meta($updated, 'uip-template-excludes-roles', $excludeRoles);
      update_post_meta($updated, 'uip-template-excludes-users', $excludeUsers);

      update_post_meta($updated, 'uip-template-settings', $template->globalSettings);
      update_post_meta($updated, 'uip-template-type', $template->globalSettings->type);
      update_post_meta($updated, 'uip-template-subsites', $multisite);
      update_post_meta($updated, 'uip-ui-template', $template->content);

      if ($styles && is_object($styles)) {
        $options = get_option('uip-global-settings');
        if (!$options || !is_array($options)) {
          $options = [];
        }

        $options['theme-styles'] = $styles;
        update_option('uip-global-settings', $options);
      }

      //Return data to app
      $returndata = [];
      $returndata['success'] = true;
      $returndata['message'] = __('Template saved', 'uipress-lite');
      wp_send_json($returndata);
    }
    die();
  }

  /**
   * Saves user styles vars
   *
   * @return void
   * @since 3.2.13
   */
  public function uip_save_user_styles()
  {
    if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('uip-security-nonce', 'security') > 0) {
      $utils = new uip_util();
      $styles = $utils->clean_ajax_input_width_code(json_decode(stripslashes($_POST['styles'])));

      if ($styles && is_object($styles)) {
        $options = get_option('uip-global-settings');
        if (!$options || !is_array($options)) {
          $options = [];
        }

        $options['theme-styles'] = $styles;
        update_option('uip-global-settings', $options);
      }

      //Return data to app
      $returndata = [];
      $returndata['success'] = true;
      $returndata['message'] = __('Styles saved', 'uipress-lite');
      wp_send_json($returndata);
    }
    die();
  }

  /**
   * syncs ui pattern accross all templates
   * @since 3.0.0
   */
  public function uip_sync_ui_pattern()
  {
    if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('uip-security-nonce', 'security') > 0) {
      $utils = new uip_util();

      $pattern = $utils->clean_ajax_input_width_code(json_decode(stripslashes($_POST['pattern'])));
      $patternID = sanitize_text_field($_POST['patternID']);
      $currentTemplateID = sanitize_text_field($_POST['templateID']);
      $newPatternID = false;
      $newTemplate = [];

      if (!get_post_status($patternID)) {
        //Post doesn't exist
        $newPatternID = $this->create_new_pattern($pattern->name, $pattern, 'layout', '', 'category');
        //Update to the latest pattern ID
        $pattern->patternID = $newPatternID;
        update_post_meta($newPatternID, 'uip-pattern-template', $pattern);
      } else {
        //Update existing pattern
        update_post_meta($patternID, 'uip-pattern-template', $pattern);
      }
      //Get template
      $args = [
        'post_type' => 'uip-ui-template',
        'posts_per_page' => -1,
        'post_status' => 'any',
      ];

      $query = new WP_Query($args);
      $allTemplates = $query->get_posts();

      foreach ($allTemplates as $template) {
        //Don't edit current template
        $tempContent = get_post_meta($template->ID, 'uip-ui-template', true);
        $newTemplate = [];

        if (is_array($tempContent)) {
          //Loop through template content
          foreach ($tempContent as $item) {
            if (property_exists($item, 'patternID')) {
              //Found pattern and update

              if ($item->patternID == $patternID) {
                $item->name = $pattern->name;
                $item->responsive = $pattern->responsive;
                $item->settings = $pattern->settings;
                $item->tooltip = $pattern->tooltip;
                if ($newPatternID) {
                  $item->patternID = $newPatternID;
                }
                if (property_exists($pattern, 'content')) {
                  $item->content = $pattern->content;
                }
              }
            }
            if (property_exists($item, 'content')) {
              if (is_array($item->content) && !empty($item->content)) {
                $item->content = $this->search_and_update_patterns($item->content, $pattern, $patternID, $newPatternID);
              }
            }
            //Push to new template
            $newTemplate[] = $item;
          }
        }

        update_post_meta($template->ID, 'uip-ui-template', $newTemplate);

        if ($currentTemplateID == $template->ID) {
          $returnTemplate = $newTemplate;
        }
      }

      //Return data to app
      $returndata = [];
      $returndata['success'] = true;
      $returndata['message'] = __('Patterns synced', 'uipress-lite');
      if ($newPatternID) {
        $returndata['newPattern'] = $newPatternID;
      }
      $returndata['patterns'] = $this->uip_get_ui_patterns();
      $returndata['newTemplate'] = $returnTemplate;
      wp_send_json($returndata);
    }
    die();
  }

  /**
   * Iterates through content of templates and updates patterns
   * @since 3.0.0
   */
  public function search_and_update_patterns($content, $pattern, $patternID, $newPatternID)
  {
    $newTemplate = [];
    foreach ($content as $item) {
      if (property_exists($item, 'patternID')) {
        //Found pattern and update
        if ($item->patternID == $patternID) {
          $item->name = $pattern->name;
          $item->responsive = $pattern->responsive;
          $item->settings = $pattern->settings;
          $item->tooltip = $pattern->tooltip;
          if ($newPatternID) {
            $item->patternID = $newPatternID;
          }
          if (property_exists($pattern, 'content')) {
            $item->content = $pattern->content;
          }
        }
      }

      if (property_exists($item, 'content')) {
        if (is_array($item->content) && !empty($item->content)) {
          $item->content = $this->search_and_update_patterns($item->content, $pattern, $patternID, $newPatternID);
        }
      }

      $newTemplate[] = $item;
    }

    return $newTemplate;
  }

  /**
   * Saves ui template
   * @since 3.0.0
   */
  public function uip_save_ui_pattern()
  {
    if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('uip-security-nonce', 'security') > 0) {
      $utils = new uip_util();
      $pattern = $utils->clean_ajax_input_width_code(json_decode(stripslashes($_POST['pattern'])));
      $name = sanitize_text_field($_POST['name']);
      $type = sanitize_text_field($_POST['type']);
      $des = sanitize_text_field($_POST['description']);
      $icon = sanitize_text_field($_POST['icon']);

      $post = $this->create_new_pattern($name, $pattern, $type, $des, $icon);

      if (!$post) {
        $returndata['error'] = true;
        $returndata['message'] = __('Unable to save pattern', 'uipress-lite');
        wp_send_json($returndata);
      }

      //Return data to app
      $returndata = [];
      $returndata['success'] = true;
      $returndata['message'] = __('Pattern saved', 'uipress-lite');
      $returndata['patterns'] = $this->uip_get_ui_patterns();
      $returndata['patternid'] = $post;
      wp_send_json($returndata);
    }
    die();
  }

  /**
   * Creates a new ui pattern
   * @since 3.0.0
   */
  public function create_new_pattern($name, $pattern, $type, $des, $icon)
  {
    $updateArgs = [
      'post_title' => wp_strip_all_tags($name),
      'post_status' => 'publish',
      'post_type' => 'uip-ui-pattern',
    ];

    $post = wp_insert_post($updateArgs);

    if (!$post) {
      return false;
    }

    if (!is_object(json_decode(json_encode($pattern)))) {
      wp_delete_post($post, true);
      return false;
    }

    update_post_meta($post, 'uip-pattern-template', $pattern);
    update_post_meta($post, 'uip-pattern-type', $type);
    update_post_meta($post, 'uip-pattern-description', $des);

    if ($icon && $icon != '' && $icon != 'undefined') {
      update_post_meta($post, 'uip-pattern-icon', $icon);
    }

    return $post;
  }

  /**
   * Searches posts and pages by pass search string (query)
   * @since 3.0.0
   */
  public function uip_search_posts_pages()
  {
    if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('uip-security-nonce', 'security') > 0) {
      $utils = new uip_util();
      $string = sanitize_text_field($_POST['searchStr']);

      //Get template
      $args = [
        'post_type' => 'any',
        's' => $string,
        'posts_per_page' => 20,
      ];

      $query = new WP_Query($args);
      $totalFound = $query->found_posts;
      $foundPosts = $query->get_posts();

      $formattedPosts = [];

      foreach ($foundPosts as $item) {
        $temp = [];
        $temp['name'] = get_the_title($item->ID);
        $temp['link'] = get_permalink($item->ID);
        $formattedPosts[] = $temp;
      }

      //Return data to app
      $returndata = [];
      $returndata['success'] = true;
      $returndata['posts'] = $formattedPosts;
      wp_send_json($returndata);
    }
    die();
  }

  /**
   * Gets patterns for the builder form ajax
   * @since 3.0.0
   */

  public function uip_get_ui_patterns_list()
  {
    if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('uip-security-nonce', 'security') > 0) {
      $returndata['success'] = true;
      $returndata['message'] = __('Columns fetched', 'uipress-lite');
      $returndata['patterns'] = $this->uip_get_ui_patterns();
      wp_send_json($returndata);
    }
    die();
  }
}
