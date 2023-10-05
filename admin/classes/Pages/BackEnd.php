<?php
namespace UipressLite\Classes\Pages;
use UipressLite\Classes\Utils\URL;
use UipressLite\Classes\Utils\Sanitize;
use UipressLite\Classes\App\UserPreferences;
use UipressLite\Classes\Scripts\ToolBar;
use UipressLite\Classes\Scripts\AdminMenu;
use UipressLite\Classes\PostTypes\UiTemplates;

!defined('ABSPATH') ?? exit();

class BackEnd
{
  /**
   * Starts actions required to handle back end app
   *
   * @return void
   */
  public static function start()
  {
    add_action('admin_init', ['UipressLite\Classes\Pages\BackEnd', 'actions'], 0);
  }

  /**
   * Handles front end actions
   *
   * @return void
   * @since 3.2.13
   */
  public static function actions()
  {
    // get template
    $templates = UiTemplates::get_template_for_user('ui-template', 1);

    // No templates so exit
    if (!count($templates)) {
      define('uip_app_running', false);
      return;
    }

    // Template is missing required blocks so exit
    if (!self::has_required_blocks($templates[0])) {
      self::output_missing_template_warning();
      return;
    }

    // Define app running constant
    define('uip_app_running', true);

    self::output_template($templates[0]);
    self::add_hooks();
  }

  /**
   * Checks whether a template has the required blocks to run as a uiTemplate
   *
   * @param object $template - the template object
   *
   * @return boolean
   * @since 3.2.13
   */
  private static function has_required_blocks($template)
  {
    $templateContent = UiTemplates::get_content($template->ID);
    $templateAsString = json_encode($templateContent);
    if (strpos($templateAsString, 'uip-content') === false || (strpos($templateAsString, 'uip-admin-menu') === false && strpos($templateAsString, 'uip-content-navigator') === false)) {
      return false;
    }
    return true;
  }

  /**
   * Outputs a notice that the template does not contain the required blocks
   *
   * @return void
   * @since 3.2.13
   */
  private static function output_missing_template_warning()
  {
    add_action('admin_head', function () {
      $class = 'notice notice-warning';
      $title = __('Unable to load UiPress template', 'uipress-lite');
      $message = __(
        'Current active template does not contain a page content block or a site navigation block such as an admin menu or content navigator. These are required to use a ui template',
        'uipress-lite'
      );

      printf('<div class="%1$s"><h3 style="margin-bottom:5px;margin-top:10px;">%2$s</h3><p>%3$s</p></div>', esc_attr($class), esc_html($title), esc_html($message));
    });
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
    AdminMenu::capture();

    add_action('admin_enqueue_scripts', ['UipressLite\Classes\Scripts\UipScripts', 'add_translations']);
    add_filter('admin_xml_ns', ['UipressLite\Classes\Pages\BackEnd', 'add_dark_mode']);
    add_action('admin_bar_init', ['UipressLite\Classes\Scripts\UipScripts', 'remove_admin_bar_style']);
    add_action('admin_enqueue_scripts', ['UipressLite\Classes\Scripts\UipScripts', 'add_uipress_styles']);
    add_action('admin_enqueue_scripts', ['UipressLite\Classes\Scripts\UipScripts', 'remove_non_standard_styles'], 1);
  }

  /**
   * Pushes dark mode attribute to HTML
   *
   * @param string $attr - current attributes
   *
   * @return void
   * @since 3.2.13
   */
  public static function add_dark_mode()
  {
    $data = ' uip-core-app="true" ';
    $darkTheme = UserPreferences::get('darkTheme');
    $data .= $darkTheme ? ' data-theme="dark" ' : ' data-theme="light" ';
    echo wp_kses_post($data);
  }

  /**
   * Outputs template to javascript variable
   *
   * @param object $template - the template post object
   * @return void
   */
  private static function output_template($template)
  {
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

    // Create anonymous function so we can use the template string at runtime
    $outputter = function () use ($templateString) {
      // Output template
      $variableFormatter = "var uipUserTemplate = {$templateString}; var uipMasterMenu = {menu:[]}";
      wp_print_inline_script_tag($variableFormatter, ['id' => 'uip-ui-template']);

      $app = '
      <div class="uip-position-absolute uip-w-100vw uip-h-100p uip-background-default uip-top-0 uip-user-frame" id="uip-app-container" style="display:block !important">
        <div id="uip-ui-app" class="uip-flex uip-h-100vh uip-body-font">
        </div>
      </div>
      ';

      echo wp_kses_post($app);

      // Trigger pro actions
      do_action('uip_import_pro_front');
    };

    // Output template after admin bar render
    add_action('admin_footer', $outputter, 1);
    add_action('admin_footer', ['UipressLite\Classes\Scripts\UipScripts', 'add_uip_app'], 2);
  }
}
