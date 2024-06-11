<?php

use UipressLite\Classes\Scripts\UipScripts;
use UipressLite\Classes\Pages\FramedPages;
use UipressLite\Classes\Pages\FrontEnd;
use UipressLite\Classes\Pages\BackEnd;
use UipressLite\Classes\Pages\AdminPage;
use UipressLite\Classes\Rest\ErrorLog;

// Exit if accessed directly
!defined("ABSPATH") ? exit() : "";

/**
 * Main uipress class. Loads scripts and styles and builds the main admin framework
 *
 * @since 3.0.0
 */
class uip_app
{
  /**
   * Starts uipress functions
   *
   * @since 3.0.0
   */
  public function run()
  {
    $this->add_hooks();

    // Start the error log rest endpoint
    new ErrorLog();
  }

  /**
   * Adds required hooks for uiPress
   *
   * @return void
   * @since 3.2.13
   */
  private function add_hooks()
  {
    add_filter("plugin_action_links_uipress-lite/uipress-lite.php", ["UipressLite\Classes\Tables\PluginsTable", "add_builder_link"]);
    add_action("plugins_loaded", [$this, "start_uipress_app"], 1);
  }

  /**
   * Adds required actions and filters depending if we are on admin page, login page or uipress framed page
   *
   * @since 3.0.0
   */
  public function start_uipress_app()
  {
    // Checks if the app should be running at all
    if ($this->should_we_exit()) {
      return;
    }

    // Define app constants
    $this->define_constants();

    // White list uiPress scripts / styles with other plugins
    UipScripts::whitelist_plugins();

    // Checks if we are on a iframe page and if so start framed page actions and exit
    $user_id = get_current_user_id();
    //$activeTransient = get_transient("uip_template_active_" . $user_id);

    $isIframe = isset($_SERVER["HTTP_SEC_FETCH_DEST"]) && strtolower($_SERVER["HTTP_SEC_FETCH_DEST"]) === "iframe";

    // We are loading within the frame
    if ($isIframe) {
      FramedPages::start();
      AdminPage::start(true);
    }
    // Outside the frame
    else {
      $this->start_apps();
    }

    add_action("admin_footer", ["UipressLite\Classes\Scripts\UipScripts", "output_user_styles"], 0);
  }

  /**
   * Starts up uipress apps
   *
   * @return void
   * @since 3.2.13
   */
  private function start_apps()
  {
    // Triggers pro actions for builder
    do_action("uipress/app/start");

    FrontEnd::start();
    BackEnd::start();
    AdminPage::start(false);
  }

  /**
   * Defines plugin constants
   *
   * @since 3.2.13
   */
  private function define_constants()
  {
    define("uip_plugin_url", plugins_url("uipress-lite/"));
  }

  /**
   * Returns whether the plugin should be running.
   *
   * True if it shouldn't be, false otherwise
   *
   * @return boolean
   * @since 3.2.13
   */
  private function should_we_exit()
  {
    return wp_doing_cron() || wp_doing_ajax() || (defined("REST_REQUEST") && REST_REQUEST);
  }
}
