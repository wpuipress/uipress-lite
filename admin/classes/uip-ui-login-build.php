<?php
if (!defined('ABSPATH')) {
  exit();
}

/**
 * Builds the uipress ui builder
 * @since 3.0.0
 */
class uip_login extends uip_app
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
    $this->get_ui_login();
    add_action('login_head', [$this, 'outputTemplate'], 1);
    add_action('login_enqueue_scripts', [$this, 'add_login_scripts_and_styles']);
    add_action('login_footer', [$this, 'add_footer_scripts']);
  }

  /**
   * Checks for admin pages apply to current user
   * @since 3.0.0
   */
  public function get_ui_login()
  {
    //Don't run during ajax requests
    if (defined('DOING_AJAX') && DOING_AJAX) {
      define('uip_app_running', false);
      return;
    }

    //Fetch pages from primary multsite installation Multisite
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
      'value' => 'ui-login-page',
      'compare' => '=',
    ];

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
      define('uip_login_running', true);
    } else {
      define('uip_login_running', false);
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
    if (!uip_login_running) {
      return;
    }

    $this->add_head_scripts();

    $utils = new uip_util();

    $settings = get_post_meta($this->loginTemplateID, 'uip-template-settings', true);
    $content = get_post_meta($this->loginTemplateID, 'uip-ui-template', true);
    //Check if template exists and isn't empty
    if ((!isset($content) && !is_array($content)) || !$content || count($content) < 1) {
      $content = [];
    }

    $template = [];
    $template['settings'] = $settings;
    $template['content'] = $content;
    $template['id'] = $this->loginTemplateID;

    $templateString = html_entity_decode(json_encode($utils->clean_ajax_input_width_code($template)));

    $styles = $utils->get_uip_option('theme-styles');
    $stylesString = html_entity_decode(json_encode($utils->clean_ajax_input_width_code($styles)));

    $variableFormatter = "
      var uipUserTemplate = {$templateString};
      var uipUserStyles = {$stylesString};";
    wp_print_inline_script_tag($variableFormatter, ['id' => 'uip-ui-login-page']);
    //Output standard css and app container

    $app = "<style>#wpcontent{padding-left: 0;}#wpbody-content{padding-bottom:0px;}@media screen and (max-width: 782px) {.auto-fold #wpcontent { padding: 0 !important;}}</style>
    <div id='uip-ui-app' class='uip-flex uip-w-100p uip-h-viewport uip-text-normal'>
    </div>";

    echo wp_kses_post($app);
  }

  /**
   * Loads required scripts and styles for uipress login pages
   * @since 3.0.0
   */
  public function add_login_scripts_and_styles()
  {
    if (!uip_login_running) {
      return;
    }
    //Load translations
    wp_enqueue_script('uip-translations', uip_plugin_url . 'assets/js/uip/uip-translations.min.js', ['wp-i18n'], uip_plugin_version);
    wp_set_script_translations('uip-translations', 'uipress-lite', dirname(dirname(plugin_dir_path(__FILE__))) . '/languages/');
    //Import vue and router
    wp_enqueue_script('uip-vue', uip_plugin_url . 'assets/js/libs/vuejs.min.js', ['wp-i18n'], uip_plugin_version);
    wp_enqueue_script('uip-vue-router', uip_plugin_url . 'assets/js/libs/vue-router.min.js', ['uip-vue'], uip_plugin_version);

    ///Main app css
    if (is_rtl()) {
      wp_register_style('uip-app-rtl', uip_plugin_url . 'assets/css/uip-app-rtl.css', [], uip_plugin_version);
      wp_enqueue_style('uip-app-rtl');
    } else {
      wp_register_style('uip-app', uip_plugin_url . 'assets/css/uip-app.css', [], uip_plugin_version);
      wp_enqueue_style('uip-app');
    }
  }
}
