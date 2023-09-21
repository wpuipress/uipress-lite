<?php
if (!defined('ABSPATH')) {
  exit();
}

add_action('uip_auto_site_sync', 'uip_start_auto_site_sync');
/**
 * Watches for auto sync and imports settings from remote site
 * @since 3.2.08
 */
function uip_start_auto_site_sync()
{
  require_once uip_plugin_path . 'admin/classes/uip-export-import.php';
  $importer = new uip_export_import();
  $importer->cron_auto_import();
}

/**
 * Handles UIP global settings
 * @since 3.0.92
 */
class uip_site_settings extends uip_app
{
  public $uip_site_settings_object = false;
  public function __construct()
  {
  }

  public function run()
  {
    add_action('plugins_loaded', [$this, 'set_site_settings'], 1);
  }

  /**
   * Loads uipress global site settings and declares as PHP global
   * @since 3.0.92
   */
  public function set_site_settings()
  {
    $multiSiteActive = false;
    if (is_multisite() && is_plugin_active_for_network(uip_plugin_path_name . '/uipress-lite.php') && !is_main_site()) {
      $mainSiteId = get_main_site_id();
      switch_to_blog($mainSiteId);
      $multiSiteActive = true;
    }

    $options = get_option('uip-global-settings');

    if ($multiSiteActive) {
      restore_current_blog();
    }

    if (!$options || !is_array($options)) {
      return;
    }

    if (isset($options['remote-sync'])) {
      if (isset($options['remote-sync']['hostEnabled']) && $options['remote-sync']['hostEnabled'] == 'uiptrue') {
        require_once uip_plugin_path . 'admin/classes/uip-export-import.php';
        $uipExport = new uip_export_import();
        $uipExport->host_site_setup();
      }
      if (isset($options['remote-sync']['syncOptions']) && property_exists($options['remote-sync']['syncOptions'], 'keepUpToDate')) {
        if ($options['remote-sync']['syncOptions']->keepUpToDate == 'uiptrue') {
          ///SCHEDULE SITE SYNC
          if (is_multisite() && is_main_site()) {
            if (!wp_next_scheduled('uip_auto_site_sync')) {
              wp_schedule_event(time(), 'twicedaily', 'uip_auto_site_sync');
            }
          }
          if (!is_multisite()) {
            if (!wp_next_scheduled('uip_auto_site_sync')) {
              wp_schedule_event(time(), 'twicedaily', 'uip_auto_site_sync');
            }
          }
        }
      }
    }

    if (!isset($options['site-settings'])) {
      return;
    }

    $this->uip_site_settings_object = $options['site-settings'];
    define('uip_site_settings', json_encode($options['site-settings']));

    //Post and page table actions
    $this->post_table_actions();
    $this->plugin_table_actions();
    $this->admin_theme_actions();
    $this->dynamic_loading();
    //jQuery Migrate
    add_action('wp_default_scripts', [$this, 'dequeue_jquery_migrate']);
    add_action('admin_bar_menu', [$this, 'uip_logo_actions']);
    add_action('login_init', [$this, 'login_actions']);

    //Check for user page disables: uipDisabledFor
    $this->uip_disabled_on_page();
    //Check for user page disables: uipFullscreenFor
    $this->uip_fullscreen_on_page();
  }

  /**
   * Check for user page disables: uipDisabledFor
   * @since 3.2.08
   */
  public function uip_fullscreen_on_page()
  {
    $uipFullscreenFor = false;
    if (isset($this->uip_site_settings_object->advanced->uipFullscreenFor)) {
      $uipFullscreenFor = $this->uip_site_settings_object->advanced->uipFullscreenFor;
    }

    if (!$uipFullscreenFor) {
      return;
    }

    $parts = explode(',', $uipFullscreenFor);

    //No pages for fullscreen on
    if (!is_array($parts)) {
      return;
    }

    $url = $this->get_current_url();

    if (!$url) {
      return;
    }

    $formatted = [];
    foreach ($parts as $part) {
      $trimmed = trim($part);
      $formatted[] = $trimmed;
    }

    $fullscreenJSON = json_encode($formatted);
    add_action('admin_head', function () use ($fullscreenJSON) {
      $variableFormatter = "const UIPFullscreenUserPages = {$fullscreenJSON};";
      wp_print_inline_script_tag($variableFormatter, ['id' => 'uip-dynamic']);
    });
  }

  /**
   * Check for user page disables: uipDisabledFor
   * @since 3.2.08
   */
  public function uip_disabled_on_page()
  {
    $disabledList = false;
    if (isset($this->uip_site_settings_object->advanced->uipDisabledFor)) {
      $disabledList = $this->uip_site_settings_object->advanced->uipDisabledFor;
    }

    if (!$disabledList) {
      return;
    }

    $parts = explode(',', $disabledList);

    //No pages for disabling on
    if (!is_array($parts)) {
      return;
    }

    $url = $this->get_current_url();

    if (!$url) {
      return;
    }

    $disabled = false;
    $formatted = [];
    foreach ($parts as $part) {
      $trimmed = trim($part);
      $formatted[] = $trimmed;
      if ($trimmed == $url || strpos($url, $trimmed) !== false) {
        $disabled = true;
        break;
      }
    }

    $disbaledJSON = json_encode($formatted);
    add_action('admin_head', function () use ($disbaledJSON) {
      $variableFormatter = "const UIPdisableUserPages = {$disbaledJSON};";
      wp_print_inline_script_tag($variableFormatter, ['id' => 'uip-dynamic']);
    });

    if ($disabled) {
      define('uip_app_running', false);
    }
  }

  /**
   * Outputs a global var to define dynamic loading
   * @since 3.0.96
   */
  public function dynamic_loading()
  {
    $dynamicDis = false;
    if (isset($this->uip_site_settings_object->advanced->disableDynamicLoading)) {
      $dynamicDis = $this->uip_site_settings_object->advanced->disableDynamicLoading;
    }

    $frontEndReload = false;
    if (isset($this->uip_site_settings_object->advanced->exitFrameFront)) {
      $frontEndReload = $this->uip_site_settings_object->advanced->exitFrameFront;
    }

    if ($dynamicDis == 'uiptrue') {
      add_action('admin_head', function () {
        $variableFormatter = "
      const UIPdisableDynamicLoading = true;";
        wp_print_inline_script_tag($variableFormatter, ['id' => 'uip-dynamic']);
      });

      add_action('wp_head', function () {
        $variableFormatter = "
      const UIPdisableDynamicLoading = true;";
        wp_print_inline_script_tag($variableFormatter, ['id' => 'uip-dynamic']);
      });
    }

    if ($frontEndReload == 'uiptrue') {
      add_action('admin_head', function () {
        $variableFormatter = "
      const UIPfrontEndReload = true;";
        wp_print_inline_script_tag($variableFormatter, ['id' => 'uip-dynamic']);
      });

      add_action('wp_head', function () {
        $variableFormatter = "
      const UIPfrontEndReload = true;";
        wp_print_inline_script_tag($variableFormatter, ['id' => 'uip-dynamic']);
      });
    }
  }

  /**
   * Loads up admin theme actions
   * @since 3.0.96
   */
  public function admin_theme_actions()
  {
    $utils = new uip_util();
    $adminTheme = false;
    if (isset($this->uip_site_settings_object->theme->themeEnabled)) {
      $adminTheme = $this->uip_site_settings_object->theme->themeEnabled;
    }

    if ($adminTheme != 'uiptrue') {
      return;
    }
    //Don't load theme if using a uiTemplate
    if (isset($_GET['uip-framed-page'])) {
      if ($_GET['uip-framed-page'] == '1') {
        return;
      }
    }

    //Load up theme styles
    add_action('admin_enqueue_scripts', function () {
      if (defined('uip_app_running')) {
        if (uip_app_running) {
          return;
        }
      }

      wp_register_style('uip-app', uip_plugin_url . 'assets/css/uip-app.css', [], uip_plugin_version);
      wp_enqueue_style('uip-app');
      wp_register_style('uip-theme-basic', uip_plugin_url . 'assets/css/modules/uip-theme-basic.css', [], uip_plugin_version);
      wp_enqueue_style('uip-theme-basic');
    });

    //Add user logo to the admin menu
    add_action('admin_head', function () {
      if (defined('uip_app_running')) {
        if (uip_app_running) {
          return;
        }
      }

      if (!isset($this->uip_site_settings_object->general) || !isset($this->uip_site_settings_object->general->globalLogoDarkMode)) {
        return;
      }
      $logo = $this->uip_site_settings_object->general->globalLogoDarkMode;

      if (!is_object($logo)) {
        return;
      }
      if (!isset($logo->url) || $logo->url == '' || $logo->url == 'uipblank') {
        return;
      }

      global $allowedposttags;
      $allowed_atts = [
        'type' => [],
      ];
      $allowedposttags['style'] = $allowed_atts;
      $tag = "<style type='text/css'>
          #adminmenu::before {
              background-image: url({$logo->url}) !important;
          }
      </style>";
      echo wp_kses($tag, $allowedposttags);
    });

    add_action('admin_xml_ns', [$this, 'html_attributes_admin_theme']);
    add_action('admin_footer', [$this, 'print_theme_variables']);
  }

  /**
   * Outputs a style area for framed pages
   * @since 2.2.8
   */
  public function print_theme_variables()
  {
    if (defined('uip_app_running')) {
      if (uip_app_running) {
        return;
      }
    }

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
    ob_start();
    ?>
    <style id="uip-theme-styles">
      html[uip-admin-theme="true"]{
        <?php foreach ($styles as $key => $value) {
          if (isset($value->value)) {
            echo esc_html($key . ':' . $value->value . ';');
          }
        } ?>
    }
    </style>
    <?php print ob_get_clean();
  }

  public function html_attributes_admin_theme()
  {
    if (defined('uip_app_running')) {
      if (uip_app_running) {
        return;
      }
    }

    $data = 'uip-admin-theme="true" ';
    $data .= 'uip-theme-basic="true" ';
    echo wp_kses_post($data);
  }

  /**
   * Outputs login actions
   * @since 3.0.96
   */
  public function login_actions()
  {
    if (!isset($this->uip_site_settings_object->login)) {
      return;
    }

    //Get login logo
    $logo = false;
    if (isset($this->uip_site_settings_object->login->logo)) {
      $logo = $this->uip_site_settings_object->login->logo;
    }

    $theme = false;
    if (isset($this->uip_site_settings_object->login->loginTheme)) {
      $theme = $this->uip_site_settings_object->login->loginTheme;
    }

    if ($logo) {
      add_action('login_enqueue_scripts', [$this, 'outputLoginLogo']);
      add_filter('login_headerurl', [$this, 'login_logo_url']);
    }

    if ($theme == 'uiptrue') {
      add_action('login_enqueue_scripts', [$this, 'add_login_scripts_and_styles']);
      add_action('login_header', [$this, 'uip_start_login_wrapper']);
      add_action('login_footer', [$this, 'uip_end_login_wrapper']);
      add_filter('login_body_class', [$this, 'add_login_body_classes']);
    }

    $langSelec = false;
    if (isset($this->uip_site_settings_object->login->hideLanguage)) {
      $langSelec = $this->uip_site_settings_object->login->hideLanguage;
    }

    if ($langSelec == 'uiptrue') {
      add_filter('login_display_language_dropdown', '__return_false');
    }
  }

  /**
   * Adds a wrap to the login page
   * @since 2.2.9.2
   */

  public function uip_start_login_wrapper()
  {
    $this->print_login_styles_area();

    $darkMode = false;
    if (isset($this->uip_site_settings_object->login->darkMode)) {
      $darkMode = $this->uip_site_settings_object->login->darkMode;
    }

    if ($darkMode != 'uiptrue') {
      $wrapper = '<div id="uip-login-wrap" data-theme="light">
    <div id="uip-login-form-wrap">
    <div id="uip-login-form">';
    } else {
      $wrapper = '<div id="uip-login-wrap" data-theme="dark">
    <div id="uip-login-form-wrap">
    <div id="uip-login-form">';
    }

    echo wp_kses_post($wrapper);
  }

  /**
   * Outputs a style area for login pages
   * @since 3.0.96
   */
  public function print_login_styles_area()
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
      [data-theme="light"]{
        <?php foreach ($styles as $key => $value) {
          if (isset($value->value)) {
            echo esc_html($key . ':' . $value->value . ';');
          }
        } ?>
    }
    [data-theme="dark"]{
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

  /**
   * Adds a wrap to the login page
   * @since 2.2.9.2
   */

  public function uip_end_login_wrapper()
  {
    $utils = new uip_util();

    $hideBranding = false;
    if (isset($this->uip_site_settings_object->login->removeBranding)) {
      $hideBranding = $this->uip_site_settings_object->login->removeBranding;
    }

    $customHTML = '';
    if (isset($this->uip_site_settings_object->login->panelHTML)) {
      $customHTML = $this->uip_site_settings_object->login->panelHTML;
    }

    $customHTML = $utils->clean_ajax_input_width_code(html_entity_decode($customHTML));

    if ($customHTML == 'uipblank') {
      $customHTML = '';
    }

    if ($hideBranding != 'uiptrue') {
      echo wp_kses_post('<a class="uip-link-muted uip-no-underline" href="https://uipress.co?utm_source=uipresslogin&utm_medium=referral" target="_BLANK">Powered by uipress</a>');
    }
    echo wp_kses_post("</div></div><div id='uip-login-panel'>{$customHTML}</div></div><!-- END OF UIP WRAP -->");

    $customCSS = '';
    if (isset($this->uip_site_settings_object->login->loginCSS)) {
      $customCSS = $this->uip_site_settings_object->login->loginCSS;

      $customCSS = $utils->clean_ajax_input_width_code(html_entity_decode($customCSS));

      if ($customCSS != '' && $customCSS != 'uipblank') {
        echo wp_kses_post("<style type='text/css'>{$customCSS}</style>");
      }
    }
  }

  /**
   * Adds a uip body class to the login page
   * @since 2.2
   */

  public function add_login_body_classes($classes)
  {
    $align = 'left';
    if (isset($this->uip_site_settings_object->login->login_form_alignment)) {
      if (isset($this->uip_site_settings_object->login->login_form_alignment->value)) {
        $align = $this->uip_site_settings_object->login->login_form_alignment->value;
      }
    }

    if ($align == 'left') {
      $classes[] = 'uip-login-left';
    }
    if ($align == 'right') {
      $classes[] = 'uip-login-right';
    }
    if ($align == 'center') {
      $classes[] = 'uip-login-center';
    }
    return $classes;
  }

  /**
   * Loads required scripts and styles for uipress login pages
   * @since 3.0.0
   */
  public function add_login_scripts_and_styles()
  {
    ///Main app css
    if (is_rtl()) {
      wp_register_style('uip-app-rtl', uip_plugin_url . 'assets/css/uip-app-rtl.css', [], uip_plugin_version);
      wp_enqueue_style('uip-app-rtl');
    } else {
      wp_register_style('uip-app', uip_plugin_url . 'assets/css/uip-app.css', [], uip_plugin_version);
      wp_enqueue_style('uip-app');
    }

    wp_register_style('uip-login-default', uip_plugin_url . 'assets/css/modules/uip-login-default.css', [], uip_plugin_version);
    wp_enqueue_style('uip-login-default');
  }

  /**
   * Outputs login logo
   * @since 3.0.96
   */
  public function outputLoginLogo()
  {
    $logo = $this->uip_site_settings_object->login->logo;
    $background = $this->uip_site_settings_object->login->background_image;
    $align = 'left';
    if (isset($this->uip_site_settings_object->login->logo_alignment)) {
      if (isset($this->uip_site_settings_object->login->logo_alignment->value)) {
        $align = $this->uip_site_settings_object->login->logo_alignment->value;
      }
    }

    if (!is_object($logo)) {
      return;
    }
    if (!isset($logo->url) || $logo->url == '' || $logo->url == 'uipblank') {
      return;
    }
    ?>
    <style type="text/css">
        #login h1 a, .login h1 a {
            background-image: url(<?php echo esc_html($logo->url); ?>);
            margin-left: 0;
            background-size: contain;
            height: 50px;
            width: auto;
            background-position: <?php echo esc_html($align); ?>;
        }
    </style>
    <?php
    if (!is_object($background)) {
      return;
    }
    if (!isset($background->url) || $background->url == '' || $background->url == 'uipblank') {
      return;
    }
    ?>
    <style type="text/css">
        #uip-login-wrap #uip-login-panel, .uip-login-center #uip-login-form-wrap {
            background-image: url(<?php echo esc_html($background->url); ?>) !important;
            background-size: cover;
        }
    </style>
    <?php
  }

  /**
   * Removes wordpress link on login page
   * @since 2.2
   */
  public function login_logo_url($url)
  {
    return get_home_url();
  }

  /**
   * Outputs head actions for site settings
   * @since 3.0.94
   */
  public function uip_logo_actions($admin_bar)
  {
    if (isset($this->uip_site_settings_object->whiteLabel->hideWelcomeMessage)) {
      $message = $this->uip_site_settings_object->whiteLabel->hideWelcomeMessage;
      if ($message == 'uiptrue') {
        $my_account = $admin_bar->get_node('my-account');
        $parts = explode(',', $my_account->title);
        $current = $parts[0] . ',';
        $greeting = str_replace($current, '', $my_account->title);
        $admin_bar->add_node([
          'id' => 'my-account',
          'title' => $greeting,
        ]);
      }
    }
    if (isset($this->uip_site_settings_object->whiteLabel->welcomeMessage)) {
      $message = $this->uip_site_settings_object->whiteLabel->welcomeMessage;
      if ($message != '' && $message != 'uipblank') {
        $my_account = $admin_bar->get_node('my-account');
        $parts = explode(',', $my_account->title);
        $current = $parts[0] . ',';
        $greeting = str_replace($current, $message, $my_account->title);
        $admin_bar->add_node([
          'id' => 'my-account',
          'title' => $greeting,
        ]);
      }
    }

    if (!isset($this->uip_site_settings_object->general) || !isset($this->uip_site_settings_object->general->globalLogoDarkMode)) {
      return;
    }

    $logo = $this->uip_site_settings_object->general->globalLogoDarkMode;

    if (!is_object($logo)) {
      return;
    }
    if (!isset($logo->url) || $logo->url == '' || $logo->url == 'uipblank') {
      return;
    }

    add_action('wp_before_admin_bar_render', [$this, 'remove_toolbar_logo']);

    $image = esc_url($logo->url);
    $data = "<img style='height:20px;max-height:20px;margin-top:6px;vertical-align:baseline;' src='{$image}' >";

    $args = [
      'id' => 'app-logo',
      'title' => $data,
      'href' => esc_url(admin_url()),
    ];
    $admin_bar->add_node($args);

    //echo $style;
  }

  public function remove_toolbar_logo()
  {
    global $wp_admin_bar;
    $wp_admin_bar->remove_menu('wp-logo');
  }

  /**
   * Returns settings value fr child dependancies
   * @since 3.0.92
   */
  public function returnCurrentSettings()
  {
    return $this->uip_site_settings_object;
  }

  /**
   * Removes jQuery migrate dependancy
   * @since 3.0.92
   */
  public function dequeue_jquery_migrate($scripts)
  {
    if (!isset($this->uip_site_settings_object->general) || !isset($this->uip_site_settings_object->general->jqueryMigrate)) {
      return;
    }

    $front = $this->uip_site_settings_object->general->jqueryMigrate;
    $back = false;

    if (isset($this->uip_site_settings_object->general->jqueryMigrateBack)) {
      $back = $this->uip_site_settings_object->general->jqueryMigrateBack;
    }

    if ($front == 'uiptrue') {
      if (!is_admin() && !empty($scripts->registered['jquery'])) {
        $scripts->registered['jquery']->deps = array_diff($scripts->registered['jquery']->deps, ['jquery-migrate']);
      }
    }
    if ($back == 'uiptrue') {
      if (is_admin() && !empty($scripts->registered['jquery'])) {
        $scripts->registered['jquery']->deps = array_diff($scripts->registered['jquery']->deps, ['jquery-migrate']);
      }
    }
  }

  /**
   * Hooks plugin table actions
   * @since 3.0.92
   */
  public function plugin_table_actions()
  {
    if (isset($this->uip_site_settings_object->plugins) && isset($this->uip_site_settings_object->plugins->displayPluginStatus)) {
      $showStatus = $this->uip_site_settings_object->plugins->displayPluginStatus;

      if ($showStatus == 'uiptrue') {
        add_filter('manage_plugins_columns', [$this, 'add_plugin_status_column']);
        add_filter('manage_plugins-network_columns', [$this, 'add_plugin_status_column']);
        add_action('manage_plugins_custom_column', [$this, 'add_plugin_status'], 10, 3);
      }
    }
  }

  /**
   * Adds columns header to plugin table
   * @since 3.0.92
   */
  public function add_plugin_status_column($columns)
  {
    $newCoumns = [];

    foreach ($columns as $key => $value) {
      $newCoumns[$key] = $value;

      if ($key == 'cb') {
        $newCoumns['uip_status'] = __('Status', 'uipress');
      }
    }

    return $newCoumns;
  }

  /**
   * Adds plugin status to plugins table
   * @since 3.0.92
   */
  public function add_plugin_status($column_name, $plugin_file, $plugin_data)
  {
    if ('uip_status' == $column_name) {
      if (is_plugin_active($plugin_file)) {
        echo wp_kses_post(
          '<span class="uip-padding-left-xxs uip-padding-right-xxs uip-background-green-wash uip-border-round uip-margin-top-xs uip-display-table-cell uip-text-bold uip-text-green">' .
            __('active', 'uipress-lite') .
            '</span>'
        );
      } else {
        echo wp_kses_post(
          '<span class="uip-padding-left-xxs uip-padding-right-xxs uip-background-orange-wash uip-border-round uip-margin-top-xs uip-display-table-cell uip-text-bold uip-text-orange">' .
            __('inactive', 'uipress-lite') .
            '</span>'
        );
      }
    }
  }

  /**
   * Hooks post and table actions
   * @since 3.0.92
   */
  public function post_table_actions()
  {
    if (!isset($this->uip_site_settings_object->postsPages) || !isset($this->uip_site_settings_object->postsPages->postIDs)) {
      return;
    }
    $showModified = false;
    if (isset($this->uip_site_settings_object->postsPages->displayLastModified)) {
      $showModified = $this->uip_site_settings_object->postsPages->displayLastModified;
    }

    $showIDS = $this->uip_site_settings_object->postsPages->postIDs;

    if ($showIDS == 'uiptrue' || $showModified == 'uiptrue') {
      //Get post types
      $args = [
        'show_ui' => true,
      ];
      $post_types = get_post_types($args, 'names');
    }

    //Add post modified date
    if ($showModified == 'uiptrue') {
      //Posts
      add_filter('manage_posts_columns', [$this, 'posts_columns_modified'], 5);
      add_action('manage_posts_custom_column', [$this, 'posts_custom_modified_columns'], 5, 2);
      //Pages
      add_filter('manage_pages_columns', [$this, 'posts_columns_modified'], 5);
      add_action('manage_pages_custom_column', [$this, 'posts_custom_modified_columns'], 5, 2);
      //Media
      add_filter('manage_media_columns', [$this, 'posts_columns_modified'], 5);
      add_action('manage_media_custom_column', [$this, 'posts_custom_modified_columns'], 5, 2);

      //Loop through
      foreach ($post_types as $post_type) {
        add_action('manage_edit-' . $post_type . '_columns', [$this, 'posts_columns_modified']);
        add_filter('manage_' . $post_type . '_custom_column', [$this, 'posts_custom_modified_columns'], 10, 3);
      }
    }

    if ($showIDS == 'uiptrue') {
      //Posts
      add_filter('manage_posts_columns', [$this, 'posts_columns_id'], 5);
      add_action('manage_posts_custom_column', [$this, 'posts_custom_id_columns'], 5, 2);
      //Pages
      add_filter('manage_pages_columns', [$this, 'posts_columns_id'], 5);
      add_action('manage_pages_custom_column', [$this, 'posts_custom_id_columns'], 5, 2);
      //Media
      add_filter('manage_media_columns', [$this, 'posts_columns_id'], 5);
      add_action('manage_media_custom_column', [$this, 'posts_custom_id_columns'], 5, 2);

      //Loop through
      foreach ($post_types as $post_type) {
        add_action('manage_edit-' . $post_type . '_columns', [$this, 'posts_columns_id']);
        add_filter('manage_' . $post_type . '_custom_column', [$this, 'posts_custom_id_columns'], 10, 3);
      }
    }
  }

  /**
   * Adds post id column to table
   * @since 3.0.92
   */
  public function posts_columns_modified($defaults)
  {
    $defaults['uip_post_modified'] = __('Last modified', 'uipress-lite');
    return $defaults;
  }

  /**
   * Pushes post id to custom column
   * @since 3.0.92
   */
  public function posts_custom_modified_columns($column_name, $id)
  {
    if ($column_name === 'uip_post_modified') {
      $modified = get_post_modified_time('U', false, $id);
      $humandate = human_time_diff($modified, strtotime(current_datetime()->format('Y-m-d H:i:s'))) . ' ' . __('ago', 'uipress-lite');
      echo esc_html($humandate);
    }
  }

  /**
   * Adds post id column to table
   * @since 3.0.92
   */
  public function posts_columns_id($defaults)
  {
    $defaults['uip_post_id'] = __('ID', 'uipress-lite');
    return $defaults;
  }

  /**
   * Pushes post id to custom column
   * @since 3.0.92
   */
  public function posts_custom_id_columns($column_name, $id)
  {
    if ($column_name === 'uip_post_id') {
      echo esc_html($id);
    }
  }
}
