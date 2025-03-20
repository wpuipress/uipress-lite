<?php
namespace UipressLite\Classes\Pages;
use UipressLite\Classes\Utils\URL;
use UipressLite\Classes\Utils\Sanitize;
use UipressLite\Classes\App\UserPreferences;
use UipressLite\Classes\Scripts\ToolBar;
use UipressLite\Classes\Scripts\AdminMenu;
use UipressLite\Classes\PostTypes\UiTemplates;
use UipressLite\Classes\Scripts\UipScripts;

!defined("ABSPATH") ? exit() : "";

class AdminPage
{
  /**
   * Hooks into admin_init to start actions required to handle admin pages
   *
   * @return void
   */
  private static $isFramedPage = false;
  public static function start($isFramedPage)
  {
    self::$isFramedPage = $isFramedPage;
    add_action("plugins_loaded", ["UipressLite\Classes\Pages\AdminPage", "actions"], 10);
  }

  /**
   * Handles admin page actions
   *
   * @return void
   * @since 3.2.13
   */
  public static function actions()
  {
    if (!is_admin() || !is_user_logged_in()) {
      return;
    }

    $user_id = get_current_user_id();
    $cache_key = UipScripts::get_cache_key();
    $cache_option_name = "uipress-cached-templates-{$user_id}";
    $cached_pages = get_option($cache_option_name, false);

    if ($cached_pages && isset($cached_pages["cache_key"]) && $cached_pages["cache_key"] === $cache_key) {
      $templates = $cached_pages["templates"];
    } else {
      $templates = UiTemplates::get_template_for_user("ui-admin-page", -1);
      $templates = self::process_pages($templates);

      $cache_data = [
        "cache_key" => $cache_key,
        "templates" => $templates,
      ];

      update_option($cache_option_name, $cache_data);
    }

    // No templates so exit
    if (!count($templates)) {
      return;
    }

    $handler = function () use ($templates) {
      self::add_menu_pages($templates);
    };

    add_action("admin_menu", $handler, 1);
    add_action("admin_footer", ["UipressLite\Classes\Pages\AdminPage", "add_wp_menu_icons"]);
  }

  /**
   * Adds menu pages for each admin page
   *
   * @param array $templates - array of admin pages
   *
   * @return void
   * @since 3.2.13
   */
  private static function add_menu_pages($templates)
  {
    foreach ($templates as $uiPage) {
      $passData = $uiPage["passData"];
      $multisite = $passData->fromMainSite ? true : false;

      // Build a handler function for page loads
      $handler = function () use ($passData, $multisite) {
        self::output_template($passData, $multisite);
      };

      // Check if we are adding as submenu or top level
      if ($uiPage["parent"] != "" && $uiPage["parent"] != "uipblank") {
        $parent_slug = str_replace("admin.php?page=", "", $uiPage["parent"]);
        //$sub_url = strpos($uiPage["url"], "admin.php?page=") !== false ? $uiPage["url"] : "admin.php?page=" . $uiPage["url"];
        $hook_suffix = add_submenu_page($parent_slug, $uiPage["pageName"], $uiPage["pageName"], "read", $uiPage["url"], $handler);
      } else {
        $hook_suffix = add_menu_page($uiPage["pageName"], $uiPage["pageName"], "read", $uiPage["url"], $handler, $uiPage["icon"], 1);
      }

      add_action("admin_print_scripts-{$hook_suffix}", ["UipressLite\Classes\Pages\AdminPage", "add_hooks"]);
      add_action("admin_print_scripts-{$hook_suffix}", ["UipressLite\Classes\Scripts\UipScripts", "add_translations"]);
      add_action("admin_print_scripts-{$hook_suffix}", ["UipressLite\Classes\Scripts\UipScripts", "add_uipress_styles"]);
    }
  }

  /**
   * When admin pages have been added and we are using the default admin area, this will format custom admin page menu icons
   *
   * @return void
   * @since 3.2.13
   */
  public static function add_wp_menu_icons()
  {
    $iconPath = uip_plugin_url . "assets/icons/";

    $variableFormatter = "
      let menuItems = document.getElementsByClassName('wp-menu-image');
      if(menuItems[0]){
        for (let item of menuItems){
            let classList = item.classList;
            for (let classItem of classList){
              if(classItem.includes('dashicons-uip-icon-')){
                let icon = classItem.replace('dashicons-uip-icon-', '');
                if(icon == 'uipblank'){icon = 'favorite'};
                let iconPath = '{$iconPath}' + icon + '.svg';
                item.classList.add('uipress-data-icon-' + icon);
                item.classList.remove(classItem);
                item.innerHTML = '<span class=\"uip-background-icon\" style=\"display: flex;align-items: center;justify-items: center;height: 100%;justify-content: center;margin-left:auto;margin-right:auto;mask:url(' + iconPath + ') center center / contain no-repeat\"></span>';
              }
            }
        }
      }";
    wp_print_inline_script_tag($variableFormatter, ["id" => "uip-format-icons"]);
  }

  /**
   * Process templates list and returns array
   *
   * @param array $templates - array of admin pages
   *
   * @return array
   * @since 3.2.13
   */
  private static function process_pages($templates)
  {
    // Switch to primary network site if multisite
    $multiSiteActive = false;
    if (is_multisite() && is_plugin_active_for_network(uip_plugin_path_name . "/uipress-lite.php") && !is_main_site()) {
      switch_to_blog(get_main_site_id());
      $multiSiteActive = true;
    }

    $processed = [];
    foreach ($templates as $uiPage) {
      $temp = [];
      $pageName = get_the_title($uiPage->ID);
      $settings = get_post_meta($uiPage->ID, "uip-template-settings", true);

      $optionIcon = "uip-admin-page-icon article";
      if (isset($settings->menuIcon) && isset($settings->menuIcon->value) && $settings->menuIcon->value != "") {
        $optionIcon = "dashicons-uip-icon-" . $settings->menuIcon->value;
      }

      // Get slug
      $slug = isset($settings->slug) && $settings->slug != "" && $settings->slug != "uipblank" && !is_null($settings->slug) ? $settings->slug : null;

      $passData = new \stdClass();
      $passData->ID = $uiPage->ID;
      $passData->fromMainSite = $multiSiteActive;
      $adminPageURL = !is_null($slug) && $slug ? $slug : URL::urlSafe($pageName, "-") . "-uiptp-" . $uiPage->ID;

      $temp["url"] = $adminPageURL;
      $temp["pageName"] = $pageName;
      $temp["passData"] = $passData;
      $temp["icon"] = $optionIcon;
      $temp["icon"] = $optionIcon;

      if (isset($settings->menuParent)) {
        $temp["parent"] = $settings->menuParent;
      } else {
        $temp["parent"] = false;
      }

      $processed[] = $temp;
    }

    // Switch back to main blog if multisite
    if ($multiSiteActive) {
      restore_current_blog();
    }

    return $processed;
  }

  /**
   * Adds hooks for front end templates
   *
   * @return void
   * @since 3.2.13
   */
  public static function add_hooks()
  {
    do_action("uipress/app/start");

    return;
    // If the app is running then the this page will be loaded in a frame
    if (defined("uip_app_running") && uip_app_running) {
      return;
    }

    //ToolBar::capture();
    //AdminMenu::capture();
  }

  /**
   * Outputs template to javascript variable
   *
   * @param object $template - the template post object
   * @return void
   */
  private static function output_template($template, $multisite = false)
  {
    $templateObject = [];
    $templateObject["id"] = $template->ID;

    $app = "
      <style>#wpcontent{padding-left: 0;}#wpbody-content{padding-bottom:0px;}@media screen and (max-width: 782px) {.auto-fold #wpcontent { padding: 0 !important;}}</style>
      <div id='uip-admin-page' class='uip-flex uip-w-100p uip-h-viewport uip-text-normal'></div>
      ";

    echo wp_kses_post($app);

    // Trigger pro actions
    do_action("uip_import_pro_front");
    add_action(
      "admin_footer",
      function () use ($templateObject) {
        UipScripts::add_uip_app("ui-admin-page", $templateObject["id"]);
      },
      2
    );
    add_action(
      "admin_footer",
      function () use ($templateObject) {
        self::load_uip_script($templateObject["id"]);
      },
      2
    );
  }

  /**
   * Loads the main script for the build
   *
   * @return void
   */
  public static function load_uip_script($templateID)
  {
    $script_name = UipScripts::get_base_script_path("uipadminpage");

    if (!$script_name) {
      return;
    }

    wp_print_script_tag([
      "id" => "uip-adminpage-js",
      "src" => uip_plugin_url . "app/dist/{$script_name}?template-id={$templateID}&template-type=ui-admin-page",
      "type" => "module",
    ]);
  }
}
