<?php
if (!defined('ABSPATH')) {
  exit();
}

/**
 * Builds the uipress ui builder
 * @since 3.0.0
 */
class uip_frontend extends uip_app
{
  public function __construct()
  {
    $loginTemplateID = false;
  }

  /**
   * Starts ui builder functions
   * @since 3.0.0
   */
  public function run()
  {
    if (uip_stop_plugin) {
      return;
    }

    if (!is_admin_bar_showing()) {
      return;
    }

    $this->get_ui_front();

    if (!uip_front_running) {
      return;
    }
    //Trigger pro actions / scripts
    do_action('uip_trigger_pro_front');

    add_filter('language_attributes', function ($attr) {
      $utils = new uip_util();
      $darkTheme = $utils->get_user_preference('darkTheme');

      if ($darkTheme) {
        $data = ' data-theme="dark" ';
      } else {
        $data = ' data-theme="light" ';
      }
      return $attr . $data;
    });

    add_action('wp_before_admin_bar_render', [$this, 'capture_wp_toolbar'], PHP_INT_MAX);
    add_action('admin_bar_init', [$this, 'remove_admin_bar_style']);
    add_action('wp_enqueue_scripts', [$this, 'add_front_scripts_and_styles']);
    add_action('wp_after_admin_bar_render', [$this, 'outputTemplate'], 1);
    add_action('wp_enqueue_scripts', [$this, 'remove_non_standard_styles'], 1);
    //add_action('wp_footer', [$this, 'add_footer_scripts']);
  }

  /**
   * Checks for admin pages apply to current user
   * @since 3.0.0
   */
  public function get_ui_front()
  {
    //Don't run during ajax requests
    if (defined('DOING_AJAX') && DOING_AJAX) {
      define('uip_app_running', false);
      return;
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
      'value' => 'ui-front-template',
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

    $query = new WP_Query($args);
    $totalFound = $query->found_posts;
    $foundPosts = $query->get_posts();

    if ($multiSiteActive) {
      restore_current_blog();
    }

    if ($totalFound > 0) {
      define('uip_front_running', true);
    } else {
      define('uip_front_running', false);
      return;
    }
    $this->loginTemplateID = $foundPosts[0]->ID;
  }

  /**
   * outputs template to page
   * @since 3.0.96
   */
  public function outputTemplate()
  {
    if (!uip_front_running) {
      return;
    }

    $this->add_head_scripts();

    $utils = new uip_util();

    $tools = $this->uipMasterToolbar;
    $tools = htmlspecialchars_decode(json_encode($utils->clean_ajax_input_width_code($tools)));
    if (!$tools) {
      $tools = [];
      $tools['menu'] = [];
      error_log('Admin toolbar corrupted: UiPress');
    }

    //Fetch templates from primary multsite installation Multisite
    $multiSiteActive = false;
    if (is_multisite() && is_plugin_active_for_network(uip_plugin_path_name . '/uipress-lite.php') && !is_main_site()) {
      $mainSiteId = get_main_site_id();
      switch_to_blog($mainSiteId);
      $multiSiteActive = true;
    }

    $settings = get_post_meta($this->loginTemplateID, 'uip-template-settings', true);
    $content = get_post_meta($this->loginTemplateID, 'uip-ui-template', true);

    if ($multiSiteActive) {
      restore_current_blog();
    }
    //Check if template exists and isn't empty
    if ((!isset($content) && !is_array($content)) || !$content || count($content) < 1) {
      $content = [];
    }

    $template = [];
    $template['settings'] = $settings;
    $template['content'] = $content;
    $template['id'] = $this->loginTemplateID;
    $template['updated'] = get_the_modified_date('U', $this->loginTemplateID);

    $templateString = html_entity_decode(json_encode($utils->clean_ajax_input_width_code($template)));

    $styles = $utils->get_uip_option('theme-styles');
    $stylesString = html_entity_decode(json_encode($utils->clean_ajax_input_width_code($styles)));

    $variableFormatter = "
      var uipUserTemplate = {$templateString};
      var uipUserStyles = {$stylesString};
      var uipMasterToolbar = {$tools};";
    wp_print_inline_script_tag($variableFormatter, ['id' => 'uip-ui-login-page']);
    //Output standard css and app container

    $app = "<style>#wpadminbar{display:none !important;}</style>
    <div id='uip-ui-app' class='uip-flex uip-w-100p uip-text-normal' style='font-size:13px'>
    </div>";

    echo wp_kses_post($app);

    do_action('uip_import_pro_front');

    $this->add_footer_scripts();
  }

  /**
   * Loads required scripts and styles for uipress login pages
   * @since 3.0.0
   */
  public function add_front_scripts_and_styles()
  {
    if (!uip_front_running) {
      return;
    }

    $this->add_icons();
    //Load translations
    wp_enqueue_script('uip-translations', uip_plugin_url . 'assets/js/uip/uip-translations.min.js', ['wp-i18n'], uip_plugin_version);
    wp_set_script_translations('uip-translations', 'uipress-lite', dirname(dirname(plugin_dir_path(__FILE__))) . '/languages/');
    //Import vue and router
    //wp_enqueue_script('uip-vue', uip_plugin_url . 'assets/js/libs/vuejs.min.js', ['wp-i18n'], uip_plugin_version);
    //wp_enqueue_script('uip-vue', uip_plugin_url . 'assets/js/libs/vue-dev.js', ['wp-i18n'], uip_plugin_version);
    //wp_enqueue_script('uip-vue-router', uip_plugin_url . 'assets/js/libs/vue-router.min.js', ['uip-vue'], uip_plugin_version);

    ///Main app css
    if (is_rtl()) {
      wp_register_style('uip-app-rtl', uip_plugin_url . 'assets/css/uip-app-rtl.css', [], uip_plugin_version);
      wp_enqueue_style('uip-app-rtl');
    } else {
      wp_register_style('uip-app', uip_plugin_url . 'assets/css/uip-app.css', [], uip_plugin_version);
      wp_enqueue_style('uip-app');
    }

    $this->print_front_styles_area();
  }

  /**
   * Outputs a style area for front pages
   * @since 2.2.8
   */
  public function print_front_styles_area()
  {
    $utils = new uip_util();
    $multiSiteActive = false;
    $templateID = $this->loginTemplateID;

    if (is_multisite() && is_plugin_active_for_network(uip_plugin_path_name . '/uipress-lite.php') && !is_main_site()) {
      $mainSiteId = get_main_site_id();
      switch_to_blog($mainSiteId);
      $multiSiteActive = true;
    }

    $styles = $utils->get_uip_option('theme-styles');
    $settings = get_post_meta($templateID, 'uip-template-settings', true);

    if ($multiSiteActive) {
      restore_current_blog();
    }

    if (!$styles || !is_object($styles)) {
      $styles = [];
    }

    $css = '';

    if ($settings && is_object($settings)) {
      if (property_exists($settings, 'options')) {
        if (property_exists($settings->options, 'advanced')) {
          if (property_exists($settings->options->advanced, 'css')) {
            $css = html_entity_decode($settings->options->advanced->css);
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
    <?php echo htmlspecialchars_decode(esc_html($css)); ?>
    </style>
    <?php print ob_get_clean();
  }
}
