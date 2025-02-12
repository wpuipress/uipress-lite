<?php

use UipressLite\Classes\Utils\URL;
use UipressLite\Classes\Utils\Sanitize;
use UipressLite\Classes\Utils\Objects;
use UipressLite\Classes\App\UipOptions;
use UipressLite\Classes\ImportExport\Import;
use UipressLite\Classes\ImportExport\Export;
use UipressLite\Classes\Scripts\UipScripts;

!defined("ABSPATH") ? exit() : "";

/**
 * Adds filter to watch for auto import for site sync
 *
 * @since 3.2.13
 */
add_action("uip_auto_site_sync", ["UipressLite\Classes\App\Import", "cron_auto_import"]);

class uip_site_settings
{
  public $uip_site_settings_object = false;

  /**
   * Hooks main actions into plugins_load hook
   *
   * @return void
   * @since 3.2.13
   */
  public function run()
  {
    add_action("plugins_loaded", [$this, "set_site_settings"], 1);
  }

  /**
   * Loads uipress global site settings and declares as PHP global
   * @since 3.0.92
   */
  public function set_site_settings()
  {
    // Catch for yootheme
    if (isset($_GET["action"]) && $_GET["action"] === "kernel" && isset($_GET["p"]) && $_GET["p"] === "customizer") {
      return;
    }

    // Get global options
    $options = UipOptions::get(null, true);

    // Return of no settings available
    if (!$options || !is_array($options)) {
      return;
    }

    // Handle site sync specific options
    $this->handle_site_sync_options($options);

    // If site settings don't exist then exit now
    if (!isset($options["site-settings"])) {
      return;
    }

    // Define settings object globally
    $this->uip_site_settings_object = $options["site-settings"];
    define("uip_site_settings", wp_json_encode($options["site-settings"]));

    //Post and page table actions
    $this->post_table_actions();
    $this->plugin_table_actions();
    $this->admin_theme_actions();
    $this->dynamic_loading();

    // jQuery Migrate
    add_action("wp_default_scripts", [$this, "dequeue_jquery_migrate"]);
    add_action("admin_bar_menu", [$this, "uip_logo_actions"], 0);
    add_action("login_init", [$this, "login_actions"]);

    //Check for user page disables: uipDisabledFor
    $this->uip_disabled_on_page();
    //Check for user page disables: uipFullscreenFor
    $this->uip_fullscreen_on_page();
  }

  /**
   * Handles site sync options
   *
   * @param array $options options array
   *
   * @return void
   * @since 3.2.13
   */
  private function handle_site_sync_options($options)
  {
    // Handle remote sync options
    if (isset($options["remote-sync"])) {
      // Push remote sync to rest
      if (isset($options["remote-sync"]["hostEnabled"]) && $options["remote-sync"]["hostEnabled"] == "uiptrue") {
        add_action("rest_api_init", ["UipressLite\Classes\ImportExport\Export", "push_to_rest"]);
      }

      // Handle auto site sync
      if (is_main_site() && isset($options["remote-sync"]["syncOptions"]) && property_exists($options["remote-sync"]["syncOptions"], "keepUpToDate")) {
        if ($options["remote-sync"]["syncOptions"]->keepUpToDate == "uiptrue") {
          // Schedule site sync
          if (!wp_next_scheduled("uip_auto_site_sync")) {
            wp_schedule_event(time(), "twicedaily", "uip_auto_site_sync");
          }
        }
      }
    }
  }

  /**
   * Checks for user fullscreen option and exports as a javascript var
   *
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

    $parts = explode(",", $uipFullscreenFor);

    // No pages for fullscreen on
    if (!is_array($parts)) {
      return;
    }

    $formatted = [];
    foreach ($parts as $part) {
      $trimmed = trim($part);
      $formatted[] = $trimmed;
    }

    $fullscreenJSON = wp_json_encode($formatted);
    add_action("admin_head", function () use ($fullscreenJSON) {
      $variableFormatter = "const UIPFullscreenUserPages = {$fullscreenJSON};";
      wp_print_inline_script_tag($variableFormatter, ["id" => "uip-dynamic"]);
    });
  }

  /**
   * Checks for user disabled pages option and exports as a javascript var
   *
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

    $parts = explode(",", $disabledList);

    //No pages for disabling on
    if (!is_array($parts)) {
      return;
    }

    $url = URL::current();

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

    $disbaledJSON = wp_json_encode($formatted);
    add_action("admin_head", function () use ($disbaledJSON) {
      $variableFormatter = "const UIPdisableUserPages = {$disbaledJSON};";
      wp_print_inline_script_tag($variableFormatter, ["id" => "uip-dynamic"]);
    });

    if ($disabled) {
      define("uip_app_running", false);
    }
  }

  /**
   * Checks for user dynamic loading and front end option and exports as a javascript var
   *
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

    if ($dynamicDis == "uiptrue") {
      add_action("admin_head", function () {
        $variableFormatter = "
      const UIPdisableDynamicLoading = true;";
        wp_print_inline_script_tag($variableFormatter, ["id" => "uip-dynamic"]);
      });

      add_action("wp_head", function () {
        $variableFormatter = "
      const UIPdisableDynamicLoading = true;";
        wp_print_inline_script_tag($variableFormatter, ["id" => "uip-dynamic"]);
      });
    }

    if ($frontEndReload == "uiptrue") {
      add_action("admin_head", function () {
        $variableFormatter = "
      const UIPfrontEndReload = true;";
        wp_print_inline_script_tag($variableFormatter, ["id" => "uip-dynamic"]);
      });

      add_action("wp_head", function () {
        $variableFormatter = "
      const UIPfrontEndReload = true;";
        wp_print_inline_script_tag($variableFormatter, ["id" => "uip-dynamic"]);
      });
    }
  }

  /**
   * Loads up admin theme actions
   *
   * @since 3.0.96
   */
  public function admin_theme_actions()
  {
    $adminTheme = false;
    if (isset($this->uip_site_settings_object->theme->themeEnabled)) {
      $adminTheme = $this->uip_site_settings_object->theme->themeEnabled;
    }

    if ($adminTheme != "uiptrue") {
      return;
    }

    // Don't load theme if using a uiTemplate
    if (isset($_GET["uip-framed-page"])) {
      if ($_GET["uip-framed-page"] == "1") {
        return;
      }
    }

    //Load up theme styles
    add_action("admin_enqueue_scripts", function () {
      if (defined("uip_app_running")) {
        if (uip_app_running) {
          return;
        }
      }

      wp_register_style("uip-app", uip_plugin_url . "assets/css/uip-app.css", [], uip_plugin_version);
      wp_enqueue_style("uip-app");
      wp_register_style("uip-theme-basic", uip_plugin_url . "assets/css/modules/uip-theme-basic.css", [], uip_plugin_version);
      wp_enqueue_style("uip-theme-basic");
      wp_register_style("uip-app-icons", uip_plugin_url . "assets/css/uip-icons.css", [], uip_plugin_version);
      wp_enqueue_style("uip-app-icons");
    });

    //Add user logo to the admin menu
    add_action("admin_head", function () {
      if (defined("uip_app_running")) {
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
      if (!isset($logo->url) || $logo->url == "" || $logo->url == "uipblank") {
        return;
      }

      global $allowedposttags;
      $allowed_atts = [
        "type" => [],
      ];
      $allowedposttags["style"] = $allowed_atts;
      $tag = "<style type='text/css'>
          #adminmenu::before {
              background-image: url({$logo->url}) !important;
          }
      </style>";
      echo wp_kses($tag, $allowedposttags);
    });

    add_action("admin_xml_ns", [$this, "html_attributes_admin_theme"]);
    add_action("admin_footer", [$this, "print_theme_variables"]);
  }

  /**
   * Outputs a style area for basic admin theme pages
   *
   * @since 2.2.8
   */
  public function print_theme_variables()
  {
    if (defined("uip_app_running") && uip_app_running) {
      return;
    }

    if (isset($_GET["page"]) && $_GET["page"] == "uip-ui-builder") {
      return;
    }

    $styles = UipOptions::get("theme-styles");

    if (!$styles || !is_object($styles)) {
      $styles = [];
    }
    ob_start();
    ?>
    <style id="uip-theme-styles">
      html[uip-admin-theme="true"]{
        <?php foreach ($styles as $key => $value) {
          if (isset($value->value) && $value->value != "" && $value->value != "uipblank") {
            echo esc_html($key . ":" . $value->value . ";");
          }
        } ?>
    }
    </style>
    <?php
    $safe_css = ob_get_clean();
    echo wp_kses($safe_css, ["style" => ["id" => []]]);
  }

  /**
   * Outputs html attributes for basic admin theme
   *
   * @return void
   * @since 3.2.13
   */
  public function html_attributes_admin_theme()
  {
    if (defined("uip_app_running") && uip_app_running) {
      return;
    }

    $data = 'uip-admin-theme="true" ';
    $data .= 'uip-theme-basic="true" ';
    echo wp_kses_post($data);
  }

  /**
   * Outputs login actions
   *
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
      add_action("login_enqueue_scripts", [$this, "outputLoginLogo"]);
      add_filter("login_headerurl", [$this, "login_logo_url"]);
    }

    if ($theme == "uiptrue") {
      add_action("login_enqueue_scripts", [$this, "add_login_scripts_and_styles"]);
      add_action("login_header", [$this, "uip_start_login_wrapper"]);
      add_action("login_footer", [$this, "uip_end_login_wrapper"]);
      add_filter("login_body_class", [$this, "add_login_body_classes"]);
    }

    $langSelec = false;
    if (isset($this->uip_site_settings_object->login->hideLanguage)) {
      $langSelec = $this->uip_site_settings_object->login->hideLanguage;
    }

    if ($langSelec == "uiptrue") {
      add_filter("login_display_language_dropdown", "__return_false");
    }
  }

  /**
   * Adds a wrap to the login page for when the login theme is enabled
   *
   * @since 2.2.9.2
   */
  public function uip_start_login_wrapper()
  {
    $this->print_login_styles_area();

    $darkMode = false;
    if (isset($this->uip_site_settings_object->login->darkMode)) {
      $darkMode = $this->uip_site_settings_object->login->darkMode;
    }

    if ($darkMode != "uiptrue") {
      $wrapper = '
      <div id="uip-login-wrap" data-theme="light">
      <div id="uip-login-form-wrap">
      <div id="uip-login-form">
    ';
    } else {
      $wrapper = '
      <div id="uip-login-wrap" data-theme="dark">
      <div id="uip-login-form-wrap">
      <div id="uip-login-form">';
    }

    echo wp_kses_post($wrapper);
  }

  /**
   * Outputs a style area for login pages
   *
   * @since 3.0.96
   */
  public function print_login_styles_area()
  {
    if (isset($_GET["page"]) && $_GET["page"] == "uip-ui-builder") {
      return;
    }

    $styles = UipOptions::get("theme-styles");

    if (!$styles || !is_object($styles)) {
      $styles = [];
    }

    $css = "";
    if (isset($_GET["uipid"]) && $_GET["uipid"] != "" && is_numeric(sanitize_text_field($_GET["uipid"]))) {
      $templateID = sanitize_text_field($_GET["uipid"]);

      //If this is a multisite template we need to get the css from the primary site network template
      $multiSiteActive = false;
      if (is_multisite() && is_plugin_active_for_network(uip_plugin_path_name . "/uipress-lite.php") && !is_main_site()) {
        $mainSiteId = get_main_site_id();
        switch_to_blog($mainSiteId);
        $multiSiteActive = true;
      }

      $settings = get_post_meta($templateID, "uip-template-settings", true);

      if ($multiSiteActive) {
        restore_current_blog();
      }

      // Get custom css
      if ($settings && is_object($settings)) {
        Objects::ensureNested($settings, ["options", "advanced"]);
        $css = isset($settings->options->advanced->css) ? html_entity_decode($settings->options->advanced->css) : "";
      }
    }

    ob_start();
    ?>
    <style id="uip-theme-styles">
      [data-theme="light"]{
        <?php foreach ($styles as $key => $value) {
          if (isset($value->value) && $value->value != "uipblank" && $value->value) {
            echo esc_html($key . ":" . $value->value . ";");
          }
        } ?>
    }
    [data-theme="dark"]{
        <?php foreach ($styles as $key => $value) {
          if (isset($value->darkValue) && $value->darkValue != "uipblank" && $value->darkValue) {
            echo esc_html($key . ":" . $value->darkValue . ";");
          }
        } ?>
    }
    <?php echo htmlspecialchars_decode(esc_html($css)); ?>
    </style>
    <?php
    $safe_css = ob_get_clean();
    echo wp_kses($safe_css, ["style" => ["id" => []]]);
  }

  /**
   * Adds a wrap to the login page
   *
   * @since 2.2.9.2
   */
  public function uip_end_login_wrapper()
  {
    $hideBranding = false;
    if (isset($this->uip_site_settings_object->login->removeBranding)) {
      $hideBranding = $this->uip_site_settings_object->login->removeBranding;
    }

    $customHTML = "";
    if (isset($this->uip_site_settings_object->login->panelHTML)) {
      $customHTML = $this->uip_site_settings_object->login->panelHTML;
    }

    $customHTML = html_entity_decode($customHTML);
    $customHTML = Sanitize::clean_input_with_code($customHTML);

    if ($customHTML == "uipblank") {
      $customHTML = "";
    }

    if ($hideBranding != "uiptrue") {
      echo wp_kses_post('<a class="uip-link-muted uip-no-underline" href="https://uipress.co?utm_source=uipresslogin&utm_medium=referral" target="_BLANK">Powered by uipress</a>');
    }
    echo wp_kses_post("</div></div><div id='uip-login-panel'>{$customHTML}</div></div><!-- END OF UIP WRAP -->");

    $customCSS = "";
    if (isset($this->uip_site_settings_object->login->loginCSS)) {
      $customCSS = $this->uip_site_settings_object->login->loginCSS;

      $customCSS = html_entity_decode($customCSS);
      $customCSS = Sanitize::clean_input_with_code($customCSS);

      if ($customCSS != "" && $customCSS != "uipblank") {
        echo wp_kses_post("<style type='text/css'>{$customCSS}</style>");
      }
    }
  }

  /**
   * Adds a uip body class to the login page
   *
   * @since 2.2
   */
  public function add_login_body_classes($classes)
  {
    $align = "left";
    Objects::ensureNested($this->uip_site_settings_object, ["login", "login_form_alignment"]);
    if (isset($this->uip_site_settings_object->login->login_form_alignment->value)) {
      $align = $this->uip_site_settings_object->login->login_form_alignment->value;
    }

    if ($align == "left") {
      $classes[] = "uip-login-left";
    }
    if ($align == "right") {
      $classes[] = "uip-login-right";
    }
    if ($align == "center") {
      $classes[] = "uip-login-center";
    }
    return $classes;
  }

  /**
   * Loads required scripts and styles for uipress login pages
   *
   * @since 3.0.0
   */
  public function add_login_scripts_and_styles()
  {
    UipScripts::add_uipress_styles();

    wp_register_style("uip-login-default", uip_plugin_url . "assets/css/modules/uip-login-default.css", [], uip_plugin_version);
    wp_enqueue_style("uip-login-default");
  }

  /**
   * Outputs login logo
   *
   * @since 3.0.96
   */
  public function outputLoginLogo()
  {
    $logo = $this->uip_site_settings_object->login->logo;
    $background = $this->uip_site_settings_object->login->background_image;
    $align = "left";
    if (isset($this->uip_site_settings_object->login->logo_alignment)) {
      if (isset($this->uip_site_settings_object->login->logo_alignment->value)) {
        $align = $this->uip_site_settings_object->login->logo_alignment->value;
      }
    }

    if (!is_object($logo)) {
      return;
    }
    if (!isset($logo->url) || $logo->url == "" || $logo->url == "uipblank") {
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
    if (!isset($background->url) || $background->url == "" || $background->url == "uipblank") {
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
   *
   * @since 2.2
   */
  public function login_logo_url($url)
  {
    return get_home_url();
  }

  /**
   * Outputs head actions for site settings
   *
   * @since 3.0.94
   */
  public function uip_logo_actions($admin_bar)
  {
    // This stopped working in a recent wordpress update and there is no longer a visible way of hiding the 'howdy' message
    if (isset($this->uip_site_settings_object->whiteLabel->hideWelcomeMessage) && 1 == 2) {
      $message = $this->uip_site_settings_object->whiteLabel->hideWelcomeMessage;
      if ($message == "uiptrue") {
        $my_account = $admin_bar->get_node("my-account");
        $parts = explode(",", $my_account->title);
        $current = $parts[0] . ",";
        $greeting = str_replace($current, "", $my_account->title);
        $admin_bar->add_node([
          "id" => "my-account",
          "title" => $greeting,
        ]);
      }
    }
    if (isset($this->uip_site_settings_object->whiteLabel->welcomeMessage) && 1 == 2) {
      $message = $this->uip_site_settings_object->whiteLabel->welcomeMessage;
      if ($message != "" && $message != "uipblank") {
        $my_account = $admin_bar->get_node("my-account");
        $parts = explode(",", $my_account->title);
        $current = $parts[0] . ",";
        $greeting = str_replace($current, $message, $my_account->title);
        $admin_bar->add_node([
          "id" => "my-account",
          "title" => $greeting,
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
    if (!isset($logo->url) || $logo->url == "" || $logo->url == "uipblank") {
      return;
    }

    add_action("wp_before_admin_bar_render", [$this, "remove_toolbar_logo"]);

    $image = esc_url($logo->url);
    $data = "<img style='height:20px;max-height:20px;margin-top:6px;vertical-align:baseline;' src='{$image}' >";

    $args = [
      "id" => "app-logo",
      "title" => $data,
      "href" => esc_url(admin_url()),
    ];
    $admin_bar->add_node($args);

    //echo $style;
  }

  /**
   * Removes toolbar logo from admin bar
   *
   * @return
   * @since 3.2.13
   */
  public function remove_toolbar_logo()
  {
    global $wp_admin_bar;
    $wp_admin_bar->remove_menu("wp-logo");
  }

  /**
   * Returns settings value for child dependancies
   *
   * @since 3.0.92
   */
  public function returnCurrentSettings()
  {
    return $this->uip_site_settings_object;
  }

  /**
   * Removes jQuery migrate dependancy
   *
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

    if ($front == "uiptrue") {
      if (!is_admin() && !empty($scripts->registered["jquery"])) {
        $scripts->registered["jquery"]->deps = array_diff($scripts->registered["jquery"]->deps, ["jquery-migrate"]);
      }
    }
    if ($back == "uiptrue") {
      if (is_admin() && !empty($scripts->registered["jquery"])) {
        $scripts->registered["jquery"]->deps = array_diff($scripts->registered["jquery"]->deps, ["jquery-migrate"]);
      }
    }
  }

  /**
   * Hooks plugin table actions
   *
   * @since 3.0.92
   */
  public function plugin_table_actions()
  {
    if (isset($this->uip_site_settings_object->plugins) && isset($this->uip_site_settings_object->plugins->displayPluginStatus)) {
      $showStatus = $this->uip_site_settings_object->plugins->displayPluginStatus;
      if ($showStatus == "uiptrue") {
        add_action("admin_head", [$this, "push_plugin_status"]);
      }
    }
  }

  /**
   * Add's plugin status to plugins table
   *
   * @since 3.2.0
   */
  public function push_plugin_status()
  {
    $active = __("Active", "uipress-lite");
    $inactive = __("Inactive", "uipress-lite");

    $style = "[uip-admin-theme='true'] td.plugin-title strong::after{content:'{$active}'}";
    $style .= "[uip-admin-theme='true'] tbody tr.inactive td.plugin-title strong::after {content:'{$inactive}'}";

    $safe_css = "<style>" . Sanitize::clean_input_with_code($style) . "</style>";
    echo wp_kses($safe_css, ["style" => ["id" => []]]);
  }

  /**
   * Add's sticky headers to plugin and post tables
   *
   * @since 3.2.0
   */
  public function push_sticky_headers()
  {
    $style = "table.wp-list-table thead{position:sticky;top:32px;background-color:white;z-index:2;}";
    $style .= "[uip-framed-page='true'] table.wp-list-table thead{top:0px;background:var(--uip-color-base-0);}";

    $safe_css = "<style>" . Sanitize::clean_input_with_code($style) . "</style>";
    echo wp_kses($safe_css, ["style" => ["id" => []]]);
  }

  /**
   * Hooks post and table actions
   *
   * @since 3.0.92
   */
  public function post_table_actions()
  {
    $stickyHeaders = Objects::get_nested_property($this->uip_site_settings_object, ["postsPages", "stickyHeaders"]) ?? false;
    if ($stickyHeaders == "uiptrue") {
      add_action("admin_head", [$this, "push_sticky_headers"]);
    }

    if (!isset($this->uip_site_settings_object->postsPages) || !isset($this->uip_site_settings_object->postsPages->postIDs)) {
      return;
    }
    $showModified = false;
    if (isset($this->uip_site_settings_object->postsPages->displayLastModified)) {
      $showModified = $this->uip_site_settings_object->postsPages->displayLastModified;
    }

    $showIDS = $this->uip_site_settings_object->postsPages->postIDs;

    if ($showIDS == "uiptrue" || $showModified == "uiptrue") {
      //Get post types
      $args = [
        "show_ui" => true,
      ];
      $post_types = get_post_types($args, "names");
    }

    //Add post modified date
    if ($showModified == "uiptrue") {
      //Posts
      add_filter("manage_posts_columns", [$this, "posts_columns_modified"], 5);
      add_action("manage_posts_custom_column", [$this, "posts_custom_modified_columns"], 5, 2);
      //Pages
      add_filter("manage_pages_columns", [$this, "posts_columns_modified"], 5);
      add_action("manage_pages_custom_column", [$this, "posts_custom_modified_columns"], 5, 2);
      //Media
      add_filter("manage_media_columns", [$this, "posts_columns_modified"], 5);
      add_action("manage_media_custom_column", [$this, "posts_custom_modified_columns"], 5, 2);

      //Loop through
      foreach ($post_types as $post_type) {
        add_action("manage_edit-" . $post_type . "_columns", [$this, "posts_columns_modified"]);
        add_filter("manage_" . $post_type . "_custom_column", [$this, "posts_custom_modified_columns"], 10, 3);
      }
    }

    if ($showIDS == "uiptrue") {
      //Posts
      add_filter("manage_posts_columns", [$this, "posts_columns_id"], 5);
      add_action("manage_posts_custom_column", [$this, "posts_custom_id_columns"], 5, 2);
      //Pages
      add_filter("manage_pages_columns", [$this, "posts_columns_id"], 5);
      add_action("manage_pages_custom_column", [$this, "posts_custom_id_columns"], 5, 2);
      //Media
      add_filter("manage_media_columns", [$this, "posts_columns_id"], 5);
      add_action("manage_media_custom_column", [$this, "posts_custom_id_columns"], 5, 2);

      //Loop through
      foreach ($post_types as $post_type) {
        add_action("manage_edit-" . $post_type . "_columns", [$this, "posts_columns_id"]);
        add_filter("manage_" . $post_type . "_custom_column", [$this, "posts_custom_id_columns"], 10, 3);
      }
    }
  }

  /**
   * Adds post id column to table
   *
   * @since 3.0.92
   */
  public function posts_columns_modified($defaults)
  {
    $defaults["uip_post_modified"] = __("Last modified", "uipress-lite");
    return $defaults;
  }

  /**
   * Pushes post id to custom column
   *
   * @since 3.0.92
   */
  public function posts_custom_modified_columns($column_name, $id)
  {
    if ($column_name === "uip_post_modified") {
      $modified = get_post_modified_time("U", false, $id);
      $humandate = human_time_diff($modified, strtotime(current_datetime()->format("Y-m-d H:i:s"))) . " " . __("ago", "uipress-lite");
      echo esc_html($humandate);
    }
  }

  /**
   * Adds post id column to table
   *
   * @since 3.0.92
   */
  public function posts_columns_id($defaults)
  {
    $defaults["uip_post_id"] = __("ID", "uipress-lite");
    return $defaults;
  }

  /**
   * Pushes post id to custom column
   *
   * @since 3.0.92
   */
  public function posts_custom_id_columns($column_name, $id)
  {
    if ($column_name === "uip_post_id") {
      echo esc_html($id);
    }
  }
}
