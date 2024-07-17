<?php
namespace UipressLite\Classes\Pages;
use UipressLite\Classes\Utils\URL;
use UipressLite\Classes\Utils\Sanitize;
use UipressLite\Classes\App\UserPreferences;
use UipressLite\Classes\Scripts\ToolBar;
use UipressLite\Classes\PostTypes\UiTemplates;
use UipressLite\Classes\Scripts\UipScripts;

!defined("ABSPATH") ? exit() : "";

class FrontEnd
{
  /**
   * Starts actions required to handle front end pages
   *
   * @return void
   */
  public static function start()
  {
    //Add front end toolbar actions
    add_action("template_redirect", ["UipressLite\Classes\Pages\FrontEnd", "actions"], 10);
  }

  /**
   * Handles front end actions
   *
   * @return void
   * @since 3.2.13
   */
  public static function actions()
  {
    $currentURL = URL::current();
    if (!is_admin() && !is_login() && stripos($currentURL, wp_login_url()) === false && stripos($currentURL, admin_url()) === false) {
      self::load_toolbar();
    }
  }

  /**
   * Loads toolbar
   *
   * @return
   */
  private static function load_toolbar()
  {
    // If admin bar is not showing then exit
    if (!is_admin_bar_showing()) {
      return;
    }

    // get template
    $templates = UiTemplates::get_template_for_user("ui-front-template", 1);

    // No templates
    if (!count($templates)) {
      return;
    }

    self::output_template($templates[0]);
    self::add_hooks();
  }

  /**
   * Adds hooks for front end templates
   *
   * @return void
   * @since 3.2.13
   */
  private static function add_hooks()
  {
    ToolBar::capture();
    UipScripts::remove_admin_bar_style();

    add_action("wp_enqueue_scripts", ["UipressLite\Classes\Scripts\UipScripts", "add_translations"]);
    add_filter("language_attributes", ['UipressLite\Classes\Pages\frontEnd', "add_dark_mode"]);
    add_action("wp_enqueue_scripts", ["UipressLite\Classes\Scripts\UipScripts", "add_uipress_styles"]);
    add_action("wp_enqueue_scripts", ["UipressLite\Classes\Scripts\UipScripts", "remove_non_standard_styles"], 1);
  }

  /**
   * Pushes dark mode attribute to HTML
   *
   * @param string $attr - current attributes
   *
   * @return void
   * @since 3.2.13
   */
  public static function add_dark_mode($attr)
  {
    $darkTheme = UserPreferences::get("darkTheme");
    $attr .= $darkTheme ? ' data-theme="dark" ' : ' data-theme="light" ';
  }

  /**
   * Outputs template to javascript variable
   *
   * @param object $template - the template post object
   * @return void
   */
  private static function output_template($template)
  {
    $multiSiteActive = false;
    if (is_multisite() && is_plugin_active_for_network(uip_plugin_path_name . "/uipress-lite.php") && !is_main_site()) {
      switch_to_blog(get_main_site_id());
      $multiSiteActive = true;
    }

    $templateSettings = UiTemplates::get_settings($template->ID);
    $templateContent = UiTemplates::get_content($template->ID);

    $templateObject = [];
    $templateObject["settings"] = $templateSettings;
    $templateObject["content"] = $templateContent;
    $templateObject["id"] = $template->ID;
    $templateObject["updated"] = get_the_modified_date("U", $template->ID);

    // Switch back to current blog
    if ($multiSiteActive) {
      restore_current_blog();
    }

    $templateString = Sanitize::clean_input_with_code($templateObject);
    $templateString = wp_json_encode($templateString);
    $templateString = html_entity_decode($templateString);

    // Create anonymous function so we can use the template string at runtime
    $outputter = function () use ($templateString) {
      // Output template
      $variableFormatter = "var uipUserTemplate = {$templateString}; var uipMasterMenu = {menu:[]}";
      wp_print_inline_script_tag($variableFormatter, ["id" => "uip-admin-frontend"]);

      $app = "<style>#wpadminbar{display:none !important;}</style>
      <div id='uip-admin-page' class='uip-flex uip-w-100p uip-text-normal' style='font-size:13px'>
      </div>";

      echo wp_kses_post($app);

      // Trigger pro actions
      do_action("uip_import_pro_front");
    };

    // Output template after admin bar render
    add_action("wp_after_admin_bar_render", $outputter, 0);
    add_action("wp_footer", ["UipressLite\Classes\Scripts\UipScripts", "add_uip_app"], 2);
    add_action("wp_footer", ["UipressLite\Classes\Pages\FrontEnd", "load_uip_script"], 3);
  }

  /**
   * Loads the main script for the build
   *
   * @return void
   */
  public static function load_uip_script()
  {
    wp_print_script_tag([
      "id" => "uip-adminpage-js",
      "src" => uip_plugin_url . "app/dist/uipadminpage.build.js?ver=" . uip_plugin_version,
      "type" => "module",
    ]);
  }
}
