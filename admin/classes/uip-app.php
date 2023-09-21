<?php
if (!defined('ABSPATH')) {
  exit();
}

/**
 * Main uipress class. Loads scripts and styles and builds the main admin framework
 * @since 3.0.0
 */

#[AllowDynamicProperties]
class uip_app
{
  public $uiTemplate = [];
  public $userHasTemplate = [];
  public $uipMasterMenu = [];
  public $uipMasterToolbar = [];
  public $footerScriptsBuilt = false;

  public function __construct()
  {
    $this->uipMasterMenu = [];
    $this->uipMasterToolbar = [];
    $this->footerScriptsBuilt = false;
  }

  /**
   * Starts uipress functions
   * @since 3.0.0
   */
  public function run()
  {
    add_action('plugins_loaded', [$this, 'start_uipress_app'], 1);
    add_filter('plugin_action_links_uipress-lite/uipress-lite.php', [$this, 'add_builder_link_to_plugin_settings']);
    $this->add_helper_filters();
  }

  /**
   * Adds various required filters
   * @since 3.0.8
   */
  public function add_helper_filters()
  {
    add_filter('kses_allowed_protocols', function ($protocols) {
      $protocols[] = 'data';
      return $protocols;
    });
  }

  /**
   * Adds a link to the uiBuilder from the plugins tables
   * @since 3.0.0
   */
  public function add_builder_link_to_plugin_settings($links)
  {
    // Build and escape the URL.
    $url = esc_url(add_query_arg('page', 'uip-ui-builder', get_admin_url() . 'options-general.php'));
    // Create the link.
    $settings_link = "<a href='$url'>" . __('uiBuilder', 'uipress-lite') . '</a>';
    // Adds the link to the end of the array.
    array_push($links, $settings_link);
    return $links;
  }
  /**
   * Adds required actions and filters depending if we are on admin page, login page or uipress framed page
   * @since 3.0.0
   */
  public function start_uipress_app()
  {
    //Checks for older versions of uipress and stops this plugin if there are
    $status = $this->check_for_old_uipress();
    if ($status) {
      return;
    }

    if (wp_doing_cron()) {
      return;
    }
    //Get current request
    $currentURL = $this->get_current_url();

    //Check to see if we should run uipress or not
    add_filter('uip_disable_on_page', [$this, 'are_we_disabled'], 1, 2);
    $filter = apply_filters('uip_disable_on_page', false, $currentURL);
    if ($filter) {
      define('uip_app_running', false);
      $this->userHasTemplate = false;
      return true;
    }
    //Fires after uipress has started loading
    apply_filters('uip_started', true, true);
    //Fire this seperately as we may need it even when app isn't running for wp default menu icons
    add_action('admin_enqueue_scripts', [$this, 'add_icons']);
    $this->whitelist_plugins();

    ///Check if we are on a iframe page
    if (isset($_GET['uip-framed-page'])) {
      if ($_GET['uip-framed-page'] == '1') {
        //App not running
        define('uip_app_running', false);

        //
        add_action('admin_head', function () {
          if (defined('uip_admin_page')) {
            if (uip_admin_page) {
              return;
            }
          } ?>
          <script>
            //Small function to prevent same origin errors when browsing in the iframe
            const uipWindowOpenMethod = window.open;
            window.open = function(url, target, windowFeatures){
              
              if(target){
                let tempTarget = target.toLowerCase();
                if(tempTarget == '_blank' || tempTarget == '_top' || tempTarget == '_parent'){
                  uipWindowOpenMethod(url, '_blank', windowFeatures);
                  return;
                }
              }
              
              let origin = window.location.origin;
              let newURL = new URL(url);
              if(newURL.origin != origin){
                uipWindowOpenMethod(url, '_parent', windowFeatures);
              } else{
                uipWindowOpenMethod(url, target, windowFeatures);
              }
            }
          </script>
          <?php
        });
        //Only load required actions for framed pages
        $this->capture_wordpress_objects();
        add_action('admin_enqueue_scripts', [$this, 'add_required_styles']);
        add_action('admin_xml_ns', [$this, 'html_attributes']);
        add_action('admin_bar_init', [$this, 'remove_admin_bar_style']);
        add_action('wp_footer', [$this, 'print_toolbar'], 0);
        add_action('wp_footer', [$this, 'print_styles_area'], 0);
        add_action('admin_footer', [$this, 'print_styles_area'], 0);
        add_filter('admin_body_class', [$this, 'push_body_class']);
        add_action('admin_enqueue_scripts', [$this, 'add_frame_helper']);
        add_action('wp_enqueue_scripts', [$this, 'add_frame_helper']);
        add_action('admin_head-profile.php', function () {
          remove_action('admin_color_scheme_picker', 'admin_color_scheme_picker');
        });

        //Request fullscreen on site editor
        add_action('admin_head', function () {
          if (!function_exists('get_current_screen')) {
            return;
          }
          $currentScreen = get_current_screen();
          if ($currentScreen && property_exists($currentScreen, 'id')) {
            if ($currentScreen->id == 'site-editor') {
              echo "<script>if (window.parent) {window.parent.postMessage({ eventName: 'uip_request_fullscreen' }, '*');}</script>";
            } else {
              echo "<script>if (window.parent) {window.parent.postMessage({ eventName: 'uip_exit_fullscreen' }, '*');}</script>";
            }
          }
        });

        return;
      }
    }

    //Add front end toolbar actions
    add_action('init', [$this, 'front_actions'], 10);

    //Add login actions
    //add_action('login_init', [$this, 'login_actions']);

    //Fetch active ui template
    add_action('admin_init', [$this, 'get_ui_template'], 0);

    //Check if we have a template
    add_action('admin_init', [$this, 'add_conditional_app_actions'], 1);
  }

  /**
   * Loads up login actions
   * @since 3.0.96
   */
  public function front_actions()
  {
    //Get current request
    $currentURL = $this->get_current_url();
    //Checks we are not on a standard admin page, login page and the URL doesn't contain the admin url (/WP-ADMIN/)
    if (!is_admin() && stripos($_SERVER['SCRIPT_NAME'], wp_login_url()) === false && stripos($currentURL, admin_url()) === false) {
      require_once uip_plugin_path . 'admin/classes/uip-ui-front-end.php';
      $uip_front = new uip_frontend();
      $uip_front->run();
    }
  }

  /**
   * Moved to separate function to enqueue frame helper css
   * @since 3.0.8
   */
  public function add_frame_helper()
  {
    wp_register_style('uip-frame', uip_plugin_url . 'assets/css/modules/uip-frame.css', [], uip_plugin_version);
    wp_enqueue_style('uip-frame');
  }

  /**
   * Removes style set for admin bar on front end
   * @since 3.0.6
   */
  public function whitelist_plugins()
  {
    //Mailpoet
    add_filter('mailpoet_conflict_resolver_whitelist_style', function ($whitelistedStyles) {
      $whitelistedStyles[] = 'uipress-lite';
      return $whitelistedStyles;
    });
    add_filter('mailpoet_conflict_resolver_whitelist_script', function ($scripts) {
      $scripts[] = 'uipress-lite'; // plugin name to whitelist
      return $scripts;
    });

    add_filter('fluentform_skip_no_conflict', function () {
      return false;
    });
    add_filter('fluentcrm_skip_no_conflict', function () {
      return false;
    });
    add_filter('fluent_crm/skip_no_conflict', function () {
      return true;
    });
    add_filter('fluent_form/skip_no_conflict', function () {
      return true;
    });
  }

  /**
   * Removes style set for admin bar on front end
   * @since 3.0.2
   */
  public function remove_admin_bar_style()
  {
    remove_action('wp_head', '_admin_bar_bump_cb');
    add_filter('body_class', function ($classes) {
      return array_merge($classes, ['uip-no-admin-bar']);
    });
  }

  /**
   * Checks if older versions of uipress (pre version 3) are active. If so we will stop this plugin
   * @since 3.0.0
   */
  public function check_for_old_uipress()
  {
    if (!function_exists('get_plugins')) {
      require_once ABSPATH . 'wp-admin/includes/plugin.php';
    }
    $all_plugins = get_plugins();

    if (isset($all_plugins['uipress/uipress.php'])) {
      if (is_plugin_active('uipress/uipress.php')) {
        define('uip_stop_plugin', true);
        add_action('admin_head', [$this, 'flag_uipress_version_error']);
        return true;
      }
    }

    define('uip_stop_plugin', false);
    return false;
  }

  /**
   * Outputs error if no uipress
   * @since 1.0
   */
  public function flag_uipress_version_error()
  {
    $class = 'notice notice-error';
    $message = __('You have an older version of uipress active on this site. Please deactivate to use UiPress Lite', 'uipress-lite');

    printf('<div class="%1$s"><p>%2$s</p></div>', esc_attr($class), esc_html($message));
  }

  /**
   * Adds only what is required dependiung on whether user has an active ui template
   * @since 3.0.0
   */
  public function add_conditional_app_actions()
  {
    if (uip_app_running) {
      ///Admin side functions
      add_action('admin_head', [$this, 'add_head_scripts'], 1);
      add_action('admin_enqueue_scripts', [$this, 'remove_non_standard_styles'], 1);
      add_action('admin_enqueue_scripts', [$this, 'remove_non_standard_scripts'], 98);
      add_action('admin_enqueue_scripts', [$this, 'add_scripts_and_styles'], 99);
      add_action('wp_print_scripts', [$this, 'check_for_uipress_scripts'], 99);
      //Output app element to footer
      add_action('admin_footer', [$this, 'output_app'], 10);
      //Output scripts to mount
      add_action('admin_footer', [$this, 'add_footer_scripts'], 11);
    }
  }

  /**
   * Removes non standard scripts from the app page
   * @since 3.1.0
   */
  public function check_for_uipress_scripts()
  {
    if (!is_admin()) {
      return;
    }

    if (!wp_script_is('uip-vue', 'enqueued')) {
      $this->add_scripts_and_styles();
    }
  }

  /**
   * Removes non standard styles from the app page
   * @since 3.1.1
   */
  public function remove_non_standard_styles()
  {
    global $wp_styles;
    if (isset($wp_styles->registered['admin-bar'])) {
      $wp_styles->registered['admin-bar']->src = uip_plugin_url . 'assets/css/modules/uip-blank.css';
    }
  }

  /**
   * Removes non standard scripts from the app page
   * @since 3.1.0
   */
  public function remove_non_standard_scripts()
  {
    global $wp_scripts;

    $standard = ['common', 'admin-bar', 'updates', 'plugin-install', 'thickbox', 'utils', 'svg-painter', 'wp-auth-check'];

    foreach ($wp_scripts->queue as $script) {
      if (!in_array($script, $standard)) {
        wp_dequeue_script($script);
      }
    }

    //Remove toolbar css
    //wp_deregister_style('admin-bar');
    //Replace with blank stylesheet so other plugins can still load their toolbar css
    //wp_register_style('admin-bar', uip_plugin_url . 'assets/css/uip-blank.css', [], uip_plugin_version);
    //wp_enqueue_style('admin-bar');

    //print_r($wp_scripts->queue);
  }

  /**
   * Runs actions to capture wp menu, toolbar and
   * @since 3.0.0
   */
  public function capture_wordpress_objects()
  {
    add_action('parent_file', [$this, 'capture_wp_menu'], 9999);
    add_action('wp_before_admin_bar_render', [$this, 'capture_wp_toolbar'], PHP_INT_MAX);
    add_action('admin_footer', [$this, 'output_vars'], 0);
  }

  /**
   * Checks if current user has an active template, saves for later and returns true if active template found
   * @since 3.0.0
   */
  public function get_ui_template()
  {
    if (defined('uip_app_running')) {
      return;
    }

    //Don't run during ajax requests
    if (defined('DOING_AJAX') && DOING_AJAX) {
      define('uip_app_running', false);
      return;
    }
    if (isset($_GET['uip-framed-page'])) {
      if ($_GET['uip-framed-page'] == '1') {
        define('uip_app_running', false);
        return;
      }
    }

    ///Don't load templates in safe mode
    if (defined('uip_safe_mode_key')) {
      if (isset($_GET['uipsm'])) {
        if ($_GET['uipsm'] == uip_safe_mode_key) {
          define('uip_app_running', false);
          $this->userHasTemplate = false;
          return false;
        }
      }
    }

    if (isset($_GET['uipwf'])) {
      if ($_GET['uipwf'] != '') {
        $key = sanitize_text_field($_GET['uipwf']);
        $key = str_replace($key, '-', '_');
        $val = get_transient($key);
        if ($val == true) {
          define('uip_app_running', false);
          $this->userHasTemplate = false;
          $status = delete_transient($key);
          return false;
        }
      }
    }

    //Don't run on network admin if it's not network activated
    if (is_network_admin() && !is_plugin_active_for_network(uip_plugin_path_name . '/uipress-lite.php')) {
      define('uip_app_running', false);
      $this->userHasTemplate = false;
      return false;
    }

    $current_user = wp_get_current_user();
    $id = $current_user->ID;

    $username = $current_user->user_login;

    $roles = [];
    if ($id == 1) {
      $roles[] = 'Super Admin';
    }

    //Get current roles
    $user = new WP_User($id);

    if (!empty($user->roles) && is_array($user->roles)) {
      foreach ($user->roles as $role) {
        $roles[] = $role;
      }
    }

    $idAsString = strval($id);

    //Fetch templates from primary multsite installation Multisite
    $multiSiteActive = false;
    if (is_multisite() && is_plugin_active_for_network(uip_plugin_path_name . '/uipress-lite.php') && !is_main_site()) {
      $mainSiteId = get_main_site_id();
      switch_to_blog($mainSiteId);
      $multiSiteActive = true;
    }

    //Loop through roles and build query
    $roleQuery = [];
    $roleQuery['relation'] = 'AND';
    //First level
    $roleQuery[] = [
      'key' => 'uip-template-type',
      'value' => 'ui-template',
      'compare' => '=',
    ];
    //Check user id is not excluded
    $roleQuery[] = [
      'key' => 'uip-template-excludes-users',
      'value' => serialize($idAsString),
      'compare' => 'NOT LIKE',
    ];
    //Check rolename is not excluded
    foreach ($roles as $role) {
      $roleQuery[] = [
        'key' => 'uip-template-excludes-roles',
        'value' => serialize($role),
        'compare' => 'NOT LIKE',
      ];
    }

    ////Multisite Only///
    ////Push a check to see if the template is multisite enabled
    ////Multisite only///
    if ($multiSiteActive) {
      $roleQuery[] = [
        'key' => 'uip-template-subsites',
        'value' => 'uiptrue',
        'compare' => '==',
      ];
    }
    //Check at least one option (roles or users) has a value
    $secondLevel = [];
    $secondLevel['relation'] = 'OR';
    $secondLevel[] = [
      'key' => 'uip-template-for-users',
      'value' => serialize([]),
      'compare' => '!=',
    ];
    $secondLevel[] = [
      'key' => 'uip-template-for-roles',
      'value' => serialize([]),
      'compare' => '!=',
    ];

    //Check user if user id is in selected
    $thirdLevel = [];
    $thirdLevel['relation'] = 'OR';
    $thirdLevel[] = [
      'key' => 'uip-template-for-users',
      'value' => serialize($idAsString),
      'compare' => 'LIKE',
    ];

    foreach ($roles as $role) {
      $thirdLevel[] = [
        'key' => 'uip-template-for-roles',
        'value' => serialize($role),
        'compare' => 'LIKE',
      ];
    }

    //Push to meta query
    $roleQuery[] = $secondLevel;
    $roleQuery[] = $thirdLevel;

    //Build query
    $args = [
      'post_type' => 'uip-ui-template',
      'posts_per_page' => 1,
      'post_status' => 'publish',
      'meta_query' => $roleQuery,
    ];

    $templateQuery = new WP_Query($args);
    $totalFound = $templateQuery->found_posts;
    $foundPosts = $templateQuery->get_posts();

    if ($totalFound > 0) {
      $templateID = $foundPosts[0]->ID;

      $settings = get_post_meta($templateID, 'uip-template-settings', true);
      $content = get_post_meta($templateID, 'uip-ui-template', true);
      //Check if template exists and isn't empty
      if ((!isset($content) && !is_array($content)) || !$content || count($content) < 1) {
        $content = [];
      }

      if ($multiSiteActive) {
        restore_current_blog();
      }

      //Check if template meets minimum requirements to be used as a template to prevent site lockout
      $templateAsString = json_encode($content);
      if (strpos($templateAsString, 'uip-content') === false || (strpos($templateAsString, 'uip-admin-menu') === false && strpos($templateAsString, 'uip-content-navigator') === false)) {
        define('uip_app_running', false);
        $this->userHasTemplate = false;

        add_action('admin_head', function () {
          $class = 'notice notice-warning';
          $title = __('Unable to load UiPress template', 'uipress-lite');
          $message = __(
            'Current active template does not contain a page content block or a site navigation block such as an admin menu or content navigator. These are required to use a ui template',
            'uipress-lite'
          );

          printf('<div class="%1$s"><h3 style="margin-bottom:5px;margin-top:10px;">%2$s</h3><p>%3$s</p></div>', esc_attr($class), esc_html($title), esc_html($message));
        });

        return false;
      }

      $template = [];
      $template['settings'] = $settings;
      $template['content'] = $content;
      $template['id'] = $foundPosts[0]->ID;
      $template['updated'] = get_the_modified_date('U', $foundPosts[0]->ID);

      $this->uiTemplate = $template;
      $this->userHasTemplate = true;
      define('uip_app_running', true);
      //Capture WordPress objects like menu, toolbar etc
      $this->capture_wordpress_objects();
      //Add core app attribute to html
      add_action('admin_xml_ns', [$this, 'core_app_html_attributes']);
      return true;
    } else {
      if ($multiSiteActive) {
        restore_current_blog();
      }
    }
    define('uip_app_running', false);
    $this->userHasTemplate = false;
    return false;
  }

  /**
   * Captures tool bar items
   * @since 3.0.0
   */
  public function capture_wp_toolbar()
  {
    global $wp_admin_bar;
    $items = $wp_admin_bar->get_nodes();
    $children = new stdClass();

    if (!$items) {
      $this->uipMasterToolbar = [];
      return;
    }

    $categories = new stdClass();
    foreach ($items as $id => $item) {
      if ($item->parent == '' || $item->parent == false) {
        $categories->{$id} = clone $item;

        $categories->{$id}->submenu = $this->getToolBarSubMenuItems($id, $items);
      }
    }

    if (property_exists($categories, 'menu-toggle')) {
      unset($categories->{'menu-toggle'});
    }
    if (property_exists($categories, 'site-name')) {
      unset($categories->{'site-name'});
    }
    if (property_exists($categories, 'wp-logo')) {
      unset($categories->{'wp-logo'});
    }
    if (property_exists($categories, 'top-secondary')) {
      unset($categories->{'top-secondary'});
    }
    if (property_exists($categories, 'app-logo')) {
      unset($categories->{'app-logo'});
    }

    $this->uipMasterToolbar = $categories;
  }

  /**
   * Loops through toolbar items to find children
   * @since 3.0.0
   */
  public function getToolBarSubMenuItems($id, $items)
  {
    $temp = new stdClass();
    foreach ($items as $token => $item) {
      if ($item->parent == $id) {
        $temp->{$item->id} = clone $item;
      }
    }

    $secondLevel = new stdClass();
    foreach ($temp as $token => $item) {
      $secondLevel->{$item->id} = clone $item;
      $secondLevel->{$item->id}->submenu = $this->getToolBarSubSubMenuItems($item->id, $items);
    }

    return $secondLevel;
  }

  /**
   * Loops through toolbar items to find children of children
   * @since 3.0.0
   */
  public function getToolBarSubSubMenuItems($id, $items)
  {
    $temp = new stdClass();
    foreach ($items as $token => $item) {
      if ($item->parent == $id) {
        $temp->{$item->id} = clone $item;
      }
    }

    return $temp;
  }

  /**
   * This is the only style uip loads in the admin
   * @since 3.0.0
   */
  public function add_icons()
  {
    ///Main app css
    wp_register_style('uip-app-icons', uip_plugin_url . 'assets/css/uip-icons.css', [], uip_plugin_version);
    wp_enqueue_style('uip-app-icons');
  }

  /**
   * Loads only the required styles for framed pages
   * @since 3.0.0
   */
  public function add_required_styles()
  {
    ///Main app css
    if (is_rtl()) {
      wp_register_style('uip-app-rtl', uip_plugin_url . 'assets/css/uip-app-rtl.css', [], uip_plugin_version);
      wp_enqueue_style('uip-app-rtl');
    } else {
      wp_register_style('uip-app', uip_plugin_url . 'assets/css/uip-app.css', [], uip_plugin_version);
      wp_enqueue_style('uip-app');
    }
  }
  /**
   * Loads required scripts and styles for uipress
   * @since 3.0.0
   */
  public function add_scripts_and_styles()
  {
    //Load translations
    wp_enqueue_script('uip-translations', uip_plugin_url . 'assets/js/uip/uip-translations.min.js', ['wp-i18n'], uip_plugin_version);
    wp_set_script_translations('uip-translations', 'uipress-lite', dirname(dirname(plugin_dir_path(__FILE__))) . '/languages/');

    ///Main app css
    if (is_rtl()) {
      wp_register_style('uip-app-rtl', uip_plugin_url . 'assets/css/uip-app-rtl.css', [], uip_plugin_version);
      wp_enqueue_style('uip-app-rtl');
    } else {
      wp_register_style('uip-app', uip_plugin_url . 'assets/css/uip-app.css', [], uip_plugin_version);
      wp_enqueue_style('uip-app');
    }
  }

  /**
   * Adds scripts to head
   * @since 3.0.0
   */

  public function add_head_scripts()
  {
    //Output global uipress class
    $classPath = esc_url(uip_plugin_url . 'assets/js/uip/classes/uip.min.js?ver=' . uip_plugin_version);
    $variableFormatter = "
      import { uip } from '{$classPath}';
      window.uipClass = uip;";
    wp_print_inline_script_tag($variableFormatter, ['id' => 'uip-class-var', 'type' => 'module']);

    //Output global vue class
  }

  /**
   * Adds scripts to footer
   * @since 3.0.0
   */

  public function add_footer_scripts()
  {
    //Checks if we have already output vars and scripts
    if (defined('uip_vars_outputted')) {
      if (uip_vars_outputted) {
        return;
      }
    }

    $utils = new uip_util();
    wp_print_script_tag([
      'id' => 'uip-app-data',
      'uip_ajax' => json_encode([
        'ajax_url' => admin_url('admin-ajax.php'),
        'security' => wp_create_nonce('uip-security-nonce'),
        'uipAppData' => [
          'options' => $utils->clean_ajax_input_width_code($this->build_app_options()),
          'userPrefs' => $utils->clean_ajax_input_width_code($this->get_user_prefs()),
        ],
      ]),
    ]);

    //Check if the main app is running, if it is then we don't need to re-add ajax and required script data
    $variableFormatter = "
      var ajaxHolder = document.getElementById('uip-app-data');
      var ajaxData = ajaxHolder.getAttribute('uip_ajax');
      var uip_ajax = JSON.parse(ajaxData, (k, v) => (v === 'uiptrue' ? true : v === 'uipfalse' ? false : v === 'uipblank' ? '' : v));";
    wp_print_inline_script_tag($variableFormatter, ['id' => 'uip-format-vars']);

    wp_print_script_tag([
      'id' => 'uip-app-js',
      'src' => uip_plugin_url . 'assets/js/uip/uip-app.min.js?ver=' . uip_plugin_version,
      'type' => 'module',
    ]);

    define('uip_vars_outputted', true);
  }

  /**
   * Builds option object for front end app
   * @since 3.0.0
   */

  public function get_user_prefs()
  {
    $userid = get_current_user_id();
    $prefs = get_user_meta($userid, 'uip-prefs', true);

    if (!is_array($prefs)) {
      $prefs = [];
    }

    return $prefs;
  }

  /**
   * Builds option object for front end app
   * @since 3.0.0
   */

  public function build_app_options()
  {
    global $menu, $submenu;
    $processMenu = $menu;
    $utils = new uip_util();

    if (!is_array($menu)) {
      $menu = [];
    }
    foreach ($menu as $key => $value) {
      $link = $value[2];
      if (isset($submenu[$link])) {
        $processMenu[$key]['submenu'] = $submenu[$link];
      }
    }

    $all_mimes = get_allowed_mime_types();
    $types = array_diff($all_mimes, []);
    $cleanTypes = [];
    foreach ($types as $mime) {
      $cleanTypes[] = $mime;
    }

    $adminURL = get_admin_url();
    if (is_multisite()) {
      if (is_network_admin()) {
        $adminURL = network_admin_url('');
      }
    }
    $homeURL = get_home_url();
    $adminPath = str_replace($homeURL, '', $adminURL);

    $all_plugins = get_plugins();
    $formattedPlugins = [];
    foreach ($all_plugins as $key => $value) {
      $formattedPlugins[] = $key;
    }

    $formattedPostStatus = [];
    $postStatuses = get_post_stati([], 'objects');
    foreach ($postStatuses as $status) {
      $temp = [];
      $temp['name'] = $status->name;
      $temp['label'] = $status->label;
      $formattedPostStatus[] = $temp;
    }

    $customClasses = [];
    $customClasses = apply_filters('uip_register_custom_class', false, $customClasses);

    $args = [
      'public' => true,
      '_builtin' => true,
    ];
    $output = 'objects'; // or objects
    $operator = 'and'; // 'and' or 'or'
    $taxonomies = get_taxonomies($args, $output, $operator);

    $options['pluginURL'] = uip_plugin_url;
    $options['uipVersion'] = uip_plugin_version;
    $options['adminURL'] = $adminURL;
    $options['adminPath'] = $adminPath;
    $options['domain'] = get_home_url();
    $options['dynamicData'] = $this->getDynamicData();
    $options['maxUpload'] = wp_max_upload_size();
    $options['uploadTypes'] = $cleanTypes;
    $options['locale'] = str_replace('_', '-', get_locale());
    $options['multisite'] = is_multisite();
    $options['networkActivated'] = is_plugin_active_for_network(uip_plugin_path_name . '/uipress-lite.php');
    $options['primarySite'] = is_main_site();
    $options['installedPlugins'] = $formattedPlugins;
    $options['activePlugins'] = get_option('active_plugins');
    $options['post_statuses'] = $formattedPostStatus;
    $options['block_preset_styles'] = $utils->get_uip_option('block_preset_styles');
    $options['site_name'] = get_bloginfo('name');
    $options['customClasses'] = $customClasses;
    $options['taxonomies'] = $taxonomies;

    return $options;
  }

  public function add_custom($classes)
  {
    if (!is_array($classes)) {
      $classes = [];
    }

    $myCustomClasses = ['custom-background', 'custom-color', 'custom-typeface'];
    return array_merge($classes, $myCustomClasses);
  }

  /**
   * Fetches dynamic data variable values
   * @since 3.0.0
   */
  public function getDynamicData()
  {
    $current_user = wp_get_current_user();

    $initials = '';
    if ($current_user->user_firstname != '') {
      $initials .= mb_substr($current_user->user_firstname, 0, 1);
    }
    if ($current_user->user_lastname != '') {
      $initials .= mb_substr($current_user->user_lastname, 0, 1);
    }

    if ($initials == '') {
      $initials .= mb_substr($current_user->user_login, 0, 1);
    }

    $plugins = get_plugins();
    $activePlugins = get_option('active_plugins');
    $inactive = count($plugins) - count($activePlugins);

    $adminURL = get_admin_url();
    if (is_multisite()) {
      if (is_network_admin()) {
        $adminURL = network_admin_url('');
      }
    }

    $loginPage = false;
    if (defined('uip_login_running')) {
      if (uip_login_running) {
        $loginPage = true;
      }
    }

    if (!$loginPage) {
      $options['userid'] = [
        'label' => __('User id', 'uipress-lite'),
        'value' => $current_user->ID,
        'type' => 'text',
      ];
      $options['userroles'] = [
        'label' => __('User roles', 'uipress-lite'),
        'value' => $current_user->roles,
        'type' => 'array',
      ];
      $options['username'] = [
        'label' => __('Username', 'uipress-lite'),
        'value' => $current_user->user_login,
        'type' => 'text',
      ];
      $options['firstname'] = [
        'label' => __('User first name', 'uipress-lite'),
        'value' => $current_user->user_firstname,
        'type' => 'text',
      ];
      $options['lastname'] = [
        'label' => __('User last name', 'uipress-lite'),
        'value' => $current_user->user_lastname,
        'type' => 'text',
      ];
      $options['fullname'] = [
        'label' => __('User full name', 'uipress-lite'),
        'value' => $current_user->user_firstname . ' ' . $current_user->user_lastname,
        'type' => 'text',
      ];
      $options['displayname'] = [
        'label' => __('User display name', 'uipress-lite'),
        'value' => $current_user->user_firstname . ' ' . $current_user->user_lastname,
        'type' => 'text',
      ];
      $options['useremail'] = [
        'label' => __('User email', 'uipress-lite'),
        'value' => $current_user->user_email,
        'type' => 'text',
      ];
      $options['userinitials'] = [
        'label' => __('User initials', 'uipress-lite'),
        'value' => $initials,
        'type' => 'text',
      ];
      $options['userimage'] = [
        'label' => __('User profile', 'uipress-lite'),
        'value' => get_avatar_url($current_user->ID),
        'type' => 'image',
      ];
    }
    $options['sitetitle'] = [
      'label' => __('Site title', 'uipress-lite'),
      'value' => get_bloginfo('name'),
      'type' => 'text',
    ];

    $options['logout'] = [
      'label' => __('Logout link', 'uipress-lite'),
      'value' => wp_logout_url(),
      'type' => 'link',
    ];
    $options['viewsite'] = [
      'label' => __('View site', 'uipress-lite'),
      'value' => get_home_url(),
      'type' => 'link',
    ];
    $options['viewadmin'] = [
      'label' => __('Admin home', 'uipress-lite'),
      'value' => $adminURL,
      'type' => 'link',
    ];
    $options['viewprofile'] = [
      'label' => __('View profile', 'uipress-lite'),
      'value' => get_edit_profile_url(),
      'type' => 'link',
    ];
    $options['date'] = [
      'label' => __('Current date', 'uipress-lite'),
      'value' => date(get_option('date_format')),
      'type' => 'text',
    ];
    $options['phpversion'] = [
      'label' => __('PHP version', 'uipress-lite'),
      'value' => phpversion(),
      'type' => 'text',
    ];
    $options['wpversion'] = [
      'label' => __('WordPress version', 'uipress-lite'),
      'value' => get_bloginfo('version'),
      'type' => 'text',
    ];
    $options['notificationCount'] = [
      'label' => __('Notification count', 'uipress-lite'),
      'value' => '0',
      'type' => 'text',
    ];
    $options['activePlugins'] = [
      'label' => __('Active plugins', 'uipress-lite'),
      'value' => count(get_option('active_plugins')),
      'type' => 'text',
    ];
    $options['inactivePlugins'] = [
      'label' => __('Inactive plugins', 'uipress-lite'),
      'value' => $inactive,
      'type' => 'text',
    ];
    $options['installedThemes'] = [
      'label' => __('Installed themes', 'uipress-lite'),
      'value' => count(wp_get_themes()),
      'type' => 'text',
    ];
    $options['newPost'] = [
      'label' => __('New post', 'uipress-lite'),
      'value' => admin_url('post-new.php'),
      'type' => 'link',
    ];
    $options['newPage'] = [
      'label' => __('New page', 'uipress-lite'),
      'value' => admin_url('post-new.php?post_type=page'),
      'type' => 'link',
    ];

    //Check for site option dynamics
    if (defined('uip_site_settings')) {
      $globalOptions = json_decode(uip_site_settings);

      if (isset($globalOptions->general)) {
        //Light mode logo
        if (isset($globalOptions->general->globalLogo)) {
          $logo = $globalOptions->general->globalLogo;

          if (is_object($logo) && isset($logo->url) && $logo->url != '' && $logo->url != 'uipblank') {
            $options['siteLogo'] = [
              'label' => __('Site logo', 'uipress-lite'),
              'value' => $logo->url,
              'type' => 'image',
            ];
          }
        }

        //Dark mode logo
        if (isset($globalOptions->general->globalLogoDarkMode)) {
          $logo = $globalOptions->general->globalLogoDarkMode;

          if (is_object($logo) && isset($logo->url) && $logo->url != '' && $logo->url != 'uipblank') {
            $options['siteLogoDarkMode'] = [
              'label' => __('Site logo dark mode', 'uipress-lite'),
              'value' => $logo->url,
              'type' => 'image',
            ];
          }
        }
      }
    }

    if ($loginPage) {
      return $options;
    }
    //All user meta

    //Get ACF user fields
    if (function_exists('get_fields')) {
      $fields = get_fields('user_' . $current_user->ID);

      if (is_array($fields)) {
        foreach ($fields as $name => $value) {
          try {
            $formatted = $name . ' (ACF user meta)';
            $options[$name] = [
              'label' => $formatted,
              'value' => $value,
              'type' => 'text',
            ];
          } catch (Exception $e) {
            //error_log('Caught exception: ', $e->getMessage());
          }
        }
      }

      $ACFoptions = get_fields('options');

      if (is_array($ACFoptions)) {
        foreach ($ACFoptions as $name => $value) {
          try {
            $formatted = $name . ' (ACF options)';
            $options[$name] = [
              'label' => $formatted,
              'value' => $value,
              'type' => 'text',
            ];
          } catch (Exception $e) {
            //error_log('Caught exception: ', $e->getMessage());
          }
        }
      }
    }

    return $options;
  }

  /**
   * Adds data attributes to the html tag
   * @since 3.0.0
   */
  public function html_attributes()
  {
    $data = '';
    ///Check if we are on a iframe page
    if (isset($_GET['uip-framed-page'])) {
      if ($_GET['uip-framed-page'] == '1') {
        $data .= 'uip-framed-page="true" ';
      }
    }
    ///Check if screenOptions are disabled
    if (isset($_GET['uip-hide-screen-options'])) {
      if ($_GET['uip-hide-screen-options'] == '1') {
        $data .= 'uip-hide-screen-options="true" ';
      }
    }
    ///Check if help tab is disabled
    if (isset($_GET['uip-hide-help-tab'])) {
      if ($_GET['uip-hide-help-tab'] == '1') {
        $data .= 'uip-hide-help-tab="true" ';
      }
    }
    ///Check if notices are hidden
    if (isset($_GET['uip-hide-notices'])) {
      if ($_GET['uip-hide-notices'] == '1') {
        $data .= 'uip-hide-notices="true" ';
      }
    }
    ///Check if help tab is disabled
    if (isset($_GET['uip-default-theme'])) {
      if ($_GET['uip-default-theme'] == '1') {
        $data .= 'uip-admin-theme="false" ';
      } else {
        $data .= 'uip-admin-theme="true" ';
      }
    } else {
      $data .= 'uip-admin-theme="true" ';
    }

    $utils = new uip_util();
    $darkTheme = $utils->get_user_preference('darkTheme');

    if ($darkTheme) {
      $data .= 'data-theme="dark" ';
    } else {
      $data .= 'data-theme="light" ';
    }

    echo wp_kses_post($data);
  }

  /**
   * Adds data attributes to the html tag
   * @since 3.0.0
   */
  public function core_app_html_attributes()
  {
    $data = '';
    $data .= 'uip-core-app="true" ';

    $utils = new uip_util();
    $darkTheme = $utils->get_user_preference('darkTheme');

    if ($darkTheme) {
      $data .= 'data-theme="dark" ';
    } else {
      $data .= 'data-theme="light" ';
    }

    echo wp_kses_post($data);
  }

  /**
   * Gets current page URL
   * @since 3.0.0
   */

  public function get_current_url()
  {
    //Clean input
    $uri = sanitize_url($_SERVER['REQUEST_URI']);
    $host_s = '';
    if (isset($_SERVER['HTTPS'])) {
      $host_s = sanitize_url($_SERVER['HTTPS']);
    }
    $port = '';
    if (isset($_SERVER['SERVER_PORT'])) {
      $port = sanitize_url($_SERVER['SERVER_PORT']);
    }
    $http_host = '';
    if (isset($_SERVER['HTTP_HOST'])) {
      $http_host = sanitize_url($_SERVER['HTTP_HOST']);
    }

    //Build protocol
    $protocol = (!empty($host_s) && $host_s != 'off') || $port == 443 ? 'https://' : 'http://';
    $url = $protocol . $http_host . $uri;

    return $url;
  }

  /**
   * Checks if we should be running uipress on a particular page
   * @since 3.0.0
   */

  public function are_we_disabled($state, $url)
  {
    if (isset($_GET['brickspreview'])) {
      return true;
    }

    if (isset($_GET['breakdance_wpuiforbuilder_media'])) {
      if ($_GET['breakdance_wpuiforbuilder_media'] == 'true') {
        return true;
      }
    }

    if (isset($_GET['fluent_forms_pages'])) {
      if ($_GET['fluent_forms_pages'] == '1') {
        return true;
      }
    }

    // Groundhogg catch
    if (isset($_GET['page']) && isset($_GET['action'])) {
      if ($_GET['page'] == 'gh_emails' && $_GET['action'] == 'add') {
        return true;
      }
    }

    // Duplicator catch
    if (isset($_GET['page']) && isset($_GET['tab']) && isset($_GET['retry'])) {
      if ($_GET['page'] == 'duplicator' && $_GET['tab'] == 'new2') {
        return true;
      }
    }

    return false;
  }

  /**
   * Gets wordpress menu and process it, stores in variable for front end app
   * @since 2.2
   */
  public function capture_wp_menu($parent_file)
  {
    $utils = new uip_util();
    ///CHECK FOR CUSTOM MENU FIRST

    ///NO CUSTOM MENU SO PREPARE DEFAULT MENU
    global $menu, $submenu, $self, $parent_file, $submenu_file, $plugin_page, $typenow;
    //CREATE MENU CONSTRUCTOR OBJECT
    $mastermenu['self'] = $self;
    $mastermenu['parent_file'] = $parent_file;
    $mastermenu['submenu_file'] = $submenu_file;
    $mastermenu['plugin_page'] = $plugin_page;
    $mastermenu['typenow'] = $typenow;
    $mastermenu['menu'] = $menu;
    $mastermenu['submenu'] = $submenu;
    ///FORMAT DEFAULT MENU
    $menuOptions = $utils->uip_format_admin_menu($mastermenu);
    $formattedMenu = $menuOptions['menu'];

    $mastermenu['menu'] = $formattedMenu;
    $this->uipMasterMenu = $mastermenu;

    return $parent_file;
  }

  /**
   * Outputs admin menu to js const
   * @since 2.2.8
   */
  public function output_vars()
  {
    if (defined('DOING_AJAX') && DOING_AJAX) {
      return;
    }
    $menu = $this->uipMasterMenu;
    $tools = $this->uipMasterToolbar;
    $utils = new uip_util();

    $tools = htmlspecialchars_decode(json_encode($utils->clean_ajax_input_width_code($tools)));
    if (!$tools) {
      $tools = [];
      $tools['menu'] = [];
      error_log('Admin toolbar corrupted: UiPress');
    }

    $menuString = json_encode($utils->clean_ajax_input_width_code($menu));
    if (!$menuString) {
      $menu = [];
      $menu['menu'] = [];
      error_log('Admin Menu corrupted: UiPress');
    }

    $templateString = html_entity_decode(json_encode($utils->clean_ajax_input_width_code($this->uiTemplate)));

    $noTemplate = false;
    if (!$templateString) {
      $templateString = [];
      $noTemplate = true;
      error_log('User template corrupted: UiPress');
    }

    if (empty($this->uiTemplate)) {
      $noTemplate = true;
    }

    $utils = new uip_util();

    //Patch for multisite
    $multiSiteActive = false;
    if (is_multisite() && is_plugin_active_for_network(uip_plugin_path_name . '/uipress-lite.php') && !is_main_site()) {
      $mainSiteId = get_main_site_id();
      switch_to_blog($mainSiteId);
      $multiSiteActive = true;
    }
    $styles = $utils->get_uip_option('theme-styles');

    if ($multiSiteActive) {
      restore_current_blog();
    }

    $stylesString = html_entity_decode(json_encode($utils->clean_ajax_input_width_code($styles)));

    //Checks if a template is running, if it is then we need to load up that var
    if (!$noTemplate) {
      $variableFormatter = "var uipUserTemplate = {$templateString};";
      wp_print_inline_script_tag($variableFormatter, ['id' => 'uip-master-template']);
    }

    $variableFormatter = "
      var uipMasterMenu = {$menuString};
      var uipMasterToolbar = {$tools};
      var uipUserStyles = {$stylesString};";
    wp_print_inline_script_tag($variableFormatter, ['id' => 'uip-master-app']);
  }

  /**
   * Outputs admin menu to js const
   * @since 2.2.8
   */
  public function output_app()
  {
    ?>
    <div class="uip-position-absolute uip-w-100vw uip-h-100p uip-background-default uip-top-0 uip-user-frame" id="uip-app-container" style="display:block !important">
      <div id="uip-ui-app" class="uip-flex uip-h-100vh uip-body-font">
      </div>
    </div>
    <?php
  }

  /**
   * Outputs admin toolbar object on frontend to js const
   * @since 2.2.8
   */
  public function print_toolbar()
  {
    $tools = $this->uipMasterToolbar;
    $menu = $this->uipMasterMenu;
    $utils = new uip_util();

    $tools = htmlspecialchars_decode(json_encode($utils->clean_ajax_input_width_code($tools)));
    if (!$tools) {
      $tools = [];
      $tools['menu'] = [];
      error_log('Admin toolbar Corrupted: UiPress');
    }

    $menuString = json_encode($utils->clean_ajax_input_width_code($menu));
    if (!$menuString) {
      $menu = [];
      $menu['menu'] = [];
      error_log('Admin Menu corrupted: UiPress');
    }

    $variableFormatter = "
      var uipMasterMenu = {$menuString};
      var uipMasterToolbar = {$tools};";
    wp_print_inline_script_tag($variableFormatter, ['id' => 'uip-admin-consts']);
  }

  /**
   * Outputs a style area for framed pages
   * @since 2.2.8
   */
  public function print_styles_area()
  {
    if (isset($_GET['page']) && $_GET['page'] == 'uip-ui-builder') {
      return;
    }
    $utils = new uip_util();
    $multiSiteActive = false;
    if (is_multisite() && is_plugin_active_for_network(uip_plugin_path_name . '/uipress-lite.php') && !is_main_site()) {
      $mainSiteId = get_main_site_id();
      switch_to_blog($mainSiteId);
      $multiSiteActive = true;
    }
    $styles = $utils->get_uip_option('theme-styles');

    if ($multiSiteActive) {
      restore_current_blog();
    }

    if (!$styles || !is_object($styles)) {
      $styles = [];
    }

    $css = '';
    if (isset($_GET['uipid']) && $_GET['uipid'] != '' && is_numeric(sanitize_text_field($_GET['uipid']))) {
      $templateID = sanitize_text_field($_GET['uipid']);

      //If this is a multisite template we need to get the css from the primary site network template
      $multiSiteActive = false;
      if (is_multisite() && is_plugin_active_for_network(uip_plugin_path_name . '/uipress-lite.php') && !is_main_site()) {
        $mainSiteId = get_main_site_id();
        switch_to_blog($mainSiteId);
        $multiSiteActive = true;
      }

      $settings = get_post_meta($templateID, 'uip-template-settings', true);

      if ($multiSiteActive) {
        restore_current_blog();
      }

      if ($settings && is_object($settings)) {
        if (property_exists($settings, 'options')) {
          if (property_exists($settings->options, 'advanced')) {
            if (property_exists($settings->options->advanced, 'css')) {
              $css = html_entity_decode($settings->options->advanced->css);
            }
          }
        }
      }
    }

    ob_start();
    ?>
    <style id="uip-theme-styles">
      html[data-theme="light"]{
        <?php foreach ($styles as $key => $value) {
          if (isset($value->value)) {
            echo esc_html($key . ':' . $value->value . ';');
          }
        } ?>
    }
    html[data-theme="dark"]{
        <?php foreach ($styles as $key => $value) {
          if (isset($value->darkValue)) {
            echo esc_html($key . ':' . $value->darkValue . ';');
          }
        } ?>
    }
    <?php echo esc_html(htmlspecialchars_decode($css)); ?>
    </style>
    <?php print ob_get_clean();
  }

  /**
   * Pushes a class to body to framed pages
   * @since 2.2.8
   */
  public function push_body_class($classes)
  {
    if (isset($_GET['page']) && $_GET['page'] == 'uip-ui-builder') {
      return $classes;
    }
    $classes .= ' uip-user-frame';
    return $classes;
  }

  /**
   * Builds Translations
   * @since 3.0.0
   */
  public function get_translations()
  {
    ///UI BUILDER TRANSLATIONS
    return [];
  }
}
