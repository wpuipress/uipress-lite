<?php
namespace UipressLite\Classes\Scripts;
use UipressLite\Classes\Utils\UipOptions;
use UipressLite\Classes\Utils\Objects;
use UipressLite\Classes\Utils\Sanitize;
use UipressLite\Classes\Utils\UserPreferences;
use UipressLite\Classes\PostTypes\UiTemplates;
use UipressLite\Classes\Pages\App;

!defined('ABSPATH') ? exit() : '';

class UipScripts
{
  /**
   * Enqueues uipress icons
   *
   * @return void
   */
  public static function add_icons()
  {
    wp_register_style('uip-app-icons', uip_plugin_url . 'assets/css/uip-icons.css', [], uip_plugin_version);
    wp_enqueue_style('uip-app-icons');
  }

  /**
   * Loads translations script
   *
   * @return void
   */
  public static function add_translations()
  {
    wp_enqueue_script('uip-translations', uip_plugin_url . 'assets/js/uip/uip-translations.min.js', ['wp-i18n'], uip_plugin_version);
    wp_set_script_translations('uip-translations', 'uipress-lite', dirname(dirname(plugin_dir_path(__FILE__))) . '/languages/');
  }

  /**
   * Removes non standard styles from the app page
   *
   * @since 3.1.1
   */
  public static function remove_non_standard_styles()
  {
    global $wp_styles;
    if (isset($wp_styles->registered['admin-bar'])) {
      $wp_styles->registered['admin-bar']->src = uip_plugin_url . 'assets/css/modules/uip-blank.css';
    }
  }

  /**
   * Enqueues uipress stylesheet
   *
   * @return void
   */
  public static function add_uipress_styles()
  {
    if (is_rtl()) {
      wp_register_style('uip-app-rtl', uip_plugin_url . 'assets/css/uip-app-rtl.css', [], uip_plugin_version);
      wp_enqueue_style('uip-app-rtl');
    } else {
      wp_register_style('uip-app', uip_plugin_url . 'assets/css/uip-app.css', [], uip_plugin_version);
      wp_enqueue_style('uip-app');
    }
  }

  /**
   * Loads a small stylesheet specific for framed pages
   *
   * @since 3.0.8
   */
  public static function add_frame_styles()
  {
    wp_register_style('uip-frame', uip_plugin_url . 'assets/css/modules/uip-frame.css', [], uip_plugin_version);
    wp_enqueue_style('uip-frame');
  }

  /**
   * White lists uipress with plugins that normally strip styles
   *
   * @since 3.0.6
   */
  public static function whitelist_plugins()
  {
    //Mailpoet
    add_filter('mailpoet_conflict_resolver_whitelist_style', ['UipressLite\Classes\Scripts\UipScripts', 'handle_script_whitelist']);
    add_filter('mailpoet_conflict_resolver_whitelist_script', ['UipressLite\Classes\Scripts\UipScripts', 'handle_script_whitelist']);

    add_filter('fluentform_skip_no_conflict', fn() => false);
    add_filter('fluentcrm_skip_no_conflict', fn() => false);
    add_filter('fluent_crm/skip_no_conflict', fn() => false);
    add_filter('fluent_form/skip_no_conflict', fn() => false);
  }

  /**
   * Mailpoet white list functions
   *
   * @param array $scripts array of scripts / styles
   *
   * @return array
   * @since 3.2.13
   */
  private static function handle_script_whitelist($scripts)
  {
    $scripts[] = 'uipress-lite'; // plugin name to whitelist
    return $scripts;
  }

  /**
   * Removes style set for admin bar on front end
   *
   * @since 3.0.2
   */
  public static function remove_admin_bar_style()
  {
    remove_action('wp_head', '_admin_bar_bump_cb');
    add_filter('body_class', function ($classes) {
      return array_merge($classes, ['uip-no-admin-bar']);
    });
  }

  /**
   * Loads the main uip app
   *
   * @since 3.0.0
   */

  public static function add_uip_app()
  {
    $nonce = wp_create_nonce('uip-security-nonce');
    $ajaxURL = admin_url('admin-ajax.php');

    $options = [
      'options' => Sanitize::clean_input_with_code(App::get_options()),
      'userPrefs' => Sanitize::clean_input_with_code(UserPreferences::get()),
    ];

    $scriptData = [
      'id' => 'uip-app-data',
      'uip_ajax' => json_encode([
        'ajax_url' => $ajaxURL,
        'security' => $nonce,
        'uipAppData' => $options,
      ]),
    ];
    wp_print_script_tag($scriptData);

    //Check if the main app is running, if it is then we don't need to re-add ajax and required script data
    $variableFormatter = "
      var ajaxHolder = document.getElementById('uip-app-data');
      var ajaxData = ajaxHolder.getAttribute('uip_ajax');
      var uip_ajax = JSON.parse(ajaxData, (k, v) => (v === 'uiptrue' ? true : v === 'uipfalse' ? false : v === 'uipblank' ? '' : v));";
    wp_print_inline_script_tag($variableFormatter, ['id' => 'uip-format-vars']);

    wp_print_script_tag([
      'id' => 'uip-app-js',
      'src' => uip_plugin_url . 'assets/js/uip/uipApp.min.js?ver=' . uip_plugin_version,
      'type' => 'module',
    ]);
  }

  /**
   * Outputs user styles, custom css and variables
   *
   * @since 3.2.13
   */
  public static function output_user_styles()
  {
    // Check if we are on multisite, if we are then switch to primary blog
    $multiSiteActive = false;
    if (is_multisite() && is_plugin_active_for_network(uip_plugin_path_name . '/uipress-lite.php') && !is_main_site()) {
      $mainSiteId = get_main_site_id();
      switch_to_blog($mainSiteId);
      $multiSiteActive = true;
    }

    // Get theme styles
    $styles = UipOptions::get('theme-styles');
    $styles = is_object($styles) ? $styles : new \stdClass();

    // Handle url requested styles
    $templateID = isset($_GET['uipid']) ? sanitize_text_field($_GET['uipid']) : false;
    if (is_numeric($templateID)) {
      $settings = UiTemplates::get_settings($templateID);

      // Ensure object exists before checking
      Objects::ensureNested($settings, ['options', 'advanced']);
      $userCSS = isset($settings->options->advanced->css) ? html_entity_decode($settings->options->advanced->css) : '';
    }

    $userCSS = $userCSS ?? '';

    // Restore current blog if multisite is active
    !$multiSiteActive ?? restore_current_blog();

    // Process light styles
    $lightStyles = '';
    foreach ($styles as $key => $value) {
      if (!isset($value->value) || !$value->value) {
        continue;
      }
      $lightStyles .= "{$key}:{$value->value};";
    }

    // Process dark styles
    $darkStyles = '';
    foreach ($styles as $key => $value) {
      if (!isset($value->darkValue) || !$value->darkValue) {
        continue;
      }
      $darkStyles .= "{$key}:{$value->darkValue};";
    }

    $allStyles = "
	html[data-theme='light']{{$lightStyles}}
	html[data-theme='dark']{{$darkStyles}}
	{$userCSS}
	";

    $cleaned = htmlspecialchars_decode(esc_html($styleHTML));
    $allStyles = " <style id='uip-theme-styles'>{$cleaned}</style>";

    // Output code
    echo $allStyles;
  }
}