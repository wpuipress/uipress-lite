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

    self::output_template();
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
    //ToolBar::capture();
    //UipScripts::remove_admin_bar_style();

    add_action("wp_enqueue_scripts", ["UipressLite\Classes\Scripts\UipScripts", "add_translations"]);
    add_filter("language_attributes", ['UipressLite\Classes\Pages\frontEnd', "add_dark_mode"]);
    add_action("wp_enqueue_scripts", ["UipressLite\Classes\Scripts\UipScripts", "add_uipress_styles"]);
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
  private static function output_template()
  {
    // Create anonymous function so we can use the template string at runtime
    $outputter = function () {
      //$app = "<style>#wpadminbar{opacity:0}</style>";

      echo "<style id='uip-front-end-hider'>#wpadminbar{opacity:0;transition:opacity 0.3s ease-in-out}</style>";

      // Trigger pro actions
      do_action("uip_import_pro_front");
    };

    // Output template after admin bar render
    add_action("wp_after_admin_bar_render", $outputter, 0);
    add_action(
      "wp_footer",
      function () {
        UipScripts::add_uip_app("ui-front-template", null);
      },
      2
    );
    add_action("wp_footer", ["UipressLite\Classes\Pages\FrontEnd", "load_uip_script"], 3);
  }

  /**
   * Loads the main script for the build
   *
   * @return void
   */
  public static function load_uip_script()
  {
    $script_name = UipScripts::get_base_script_path("uipfrontend");

    if (!$script_name) {
      return;
    }

    wp_print_script_tag([
      "id" => "uip-frontend-js",
      "src" => uip_plugin_url . "app/dist/{$script_name}",
      "type" => "module",
    ]);
  }
}
