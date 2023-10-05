<?php
namespace UipressLite\Classes\Pages;
use UipressLite\Classes\Utils\URL;
use UipressLite\Classes\Utils\Sanitize;
use UipressLite\Classes\App\UserPreferences;
use UipressLite\Classes\Scripts\ToolBar;
use UipressLite\Classes\Scripts\AdminMenu;
use UipressLite\Classes\PostTypes\UiTemplates;

!defined('ABSPATH') ? exit() : '';

class AdminPage
{
  /**
   * Hooks into admin_init to start actions required to handle admin pages
   *
   * @return void
   */
  public static function start()
  {
    add_action('plugins_loaded', ['UipressLite\Classes\Pages\AdminPage', 'actions'], 10);
  }

  /**
   * Handles admin page actions
   *
   * @return void
   * @since 3.2.13
   */
  public static function actions()
  {
    // Get all admin pages applicable to user
    $templates = UiTemplates::get_template_for_user('ui-admin-page', -1);

    // No templates so exit
    if (!count($templates)) {
      return;
    }

    $handler = function () use ($templates) {
      self::add_menu_pages($templates);
    };
    add_action('admin_menu', $handler, 1);
    add_action('admin_footer', ['UipressLite\Classes\Pages\AdminPage', 'add_wp_menu_icons']);

    self::maybe_add_hooks();
  }

  /**
   * Checks whether we are currently on a admin page and adds hooks if so
   *
   * @return void
   * @since 3.2.13
   */
  private static function maybe_add_hooks()
  {
    if (!isset($_GET['page']) || $_GET['page'] == '') {
      return;
    }

    if (strpos($_GET['page'], '-uiptp-') !== false) {
      self::add_hooks();
    }
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
    $processed = self::process_pages($templates);

    foreach ($processed as $uiPage) {
      $passData = $uiPage['passData'];
      $multisite = $passData->fromMainSite ? true : false;

      // Build a handler function for page loads
      $handler = function () use ($passData, $multisite) {
        self::output_template($passData, $multisite);
      };

      // Check if we are adding as submenu or top level
      if ($uiPage['parent'] != '' && $uiPage['parent'] != 'uipblank') {
        add_submenu_page($uiPage['parent'], $uiPage['pageName'], $uiPage['pageName'], 'read', $uiPage['url'], $handler);
      } else {
        add_menu_page($uiPage['pageName'], $uiPage['pageName'], 'read', $uiPage['url'], $handler, $uiPage['icon'], 1);
      }
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
    $variableFormatter = "
      let menuItems = document.getElementsByClassName('wp-menu-image');
      if(menuItems[0]){
        for (let item of menuItems){
            let classList = item.classList;
            for (let classItem of classList){
              if(classItem.includes('dashicons-uip-icon-')){
                let icon = classItem.replace('dashicons-uip-icon-', '');
                item.classList.remove(classItem);
                item.classList.add('uip-icon');
                item.classList.add('uip-icon-medium');
                if(icon == 'uipblank'){icon = 'favorite'};
                item.innerHTML = '<span style=\"display: flex;align-items: center;justify-items: center;height: 100%;justify-content: center;\">' + icon + '</span>';
              }
            }
        }
      }";
    wp_print_inline_script_tag($variableFormatter, ['id' => 'uip-format-icons']);
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
    if (is_multisite() && is_plugin_active_for_network(uip_plugin_path_name . '/uipress-lite.php') && !is_main_site()) {
      switch_to_blog(get_main_site_id());
      $multiSiteActive = true;
    }

    $processed = [];
    foreach ($templates as $uiPage) {
      $temp = [];
      $pageName = get_the_title($uiPage->ID);
      $settings = get_post_meta($uiPage->ID, 'uip-template-settings', true);

      $optionIcon = 'uip-admin-page-icon article';
      if (isset($settings->menuIcon) && isset($settings->menuIcon->value) && $settings->menuIcon->value != '') {
        $optionIcon = 'dashicons-uip-icon-' . $settings->menuIcon->value;
      }

      $passData = new \stdClass();
      $passData->ID = $uiPage->ID;
      $passData->fromMainSite = $multiSiteActive;
      $adminPageURL = URL::urlSafe($pageName, '-') . '-uiptp-' . $uiPage->ID;

      $temp['url'] = $adminPageURL;
      $temp['pageName'] = $pageName;
      $temp['passData'] = $passData;
      $temp['icon'] = $optionIcon;
      $temp['icon'] = $optionIcon;

      if (isset($settings->menuParent)) {
        $temp['parent'] = $settings->menuParent;
      } else {
        $temp['parent'] = false;
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
  private static function add_hooks()
  {
    // If the app is running then the this page will be loaded in a frame
    if (defined('uip_app_running') && uip_app_running) {
      return;
    }

    ToolBar::capture();
    AdminMenu::capture();

    add_action('admin_enqueue_scripts', ['UipressLite\Classes\Scripts\UipScripts', 'add_translations']);
    add_action('admin_enqueue_scripts', ['UipressLite\Classes\Scripts\UipScripts', 'add_uipress_styles']);
  }

  /**
   * Outputs template to javascript variable
   *
   * @param object $template - the template post object
   * @return void
   */
  private static function output_template($template, $multisite = false)
  {
    // If the app is running then the this page will be loaded in a frame
    if (defined('uip_app_running') && uip_app_running) {
      return;
    }

    // Switch to main blog before queries are made
    if ($multisite) {
      switch_to_blog(get_main_site_id());
    }

    $templateSettings = UiTemplates::get_settings($template->ID);
    $templateContent = UiTemplates::get_content($template->ID);

    $templateObject = [];
    $templateObject['settings'] = $templateSettings;
    $templateObject['content'] = $templateContent;
    $templateObject['id'] = $template->ID;
    $templateObject['updated'] = get_the_modified_date('U', $template->ID);

    $templateString = json_encode($templateObject);
    $templateString = Sanitize::clean_input_with_code($templateString);
    $templateString = html_entity_decode($templateString);

    // Switch back to current blog
    if ($multisite) {
      restore_current_blog();
    }

    // Create anonymous function so we can use the template string at runtime
    $outputter = function () use ($templateString) {
      // Output template
      $variableFormatter = "var uipUserTemplate = {$templateString}; var uipMasterMenu = {menu:[]}";
      wp_print_inline_script_tag($variableFormatter, ['id' => 'uip-admin-menu']);

      $app = "
      <style>#wpcontent{padding-left: 0;}#wpbody-content{padding-bottom:0px;}@media screen and (max-width: 782px) {.auto-fold #wpcontent { padding: 0 !important;}}</style>
      <div id='uip-ui-app' class='uip-flex uip-w-100p uip-h-viewport uip-text-normal'></div>
      ";

      echo wp_kses_post($app);

      // Trigger pro actions
      do_action('uip_import_pro_front');
    };

    // Output template after admin bar render
    echo wp_kses_post($outputter());
    add_action('admin_footer', ['UipressLite\Classes\Scripts\UipScripts', 'add_uip_app'], 2);
  }
}
