<?php
if (!defined('ABSPATH')) {
  exit();
}

/**
 * Builds the uipress ui builder
 * @since 3.0.0
 */
class uip_ui_pages extends uip_app
{
  public function __construct()
  {
  }

  /**
   * Starts ui builder functions
   * @since 3.0.0
   */
  public function run()
  {
    //ADD ACTIOS FOR OVERVIEW PAGE
    add_action('plugins_loaded', [$this, 'add_ui_pages_actions'], 2);
    //Add ajax functions
    //add_action('wp_ajax_uip_create_new_ui_template', [$this, 'uip_create_new_ui_template']);
  }

  /**
   * Adds all actions for uipress ui builder
   * @since 3.0.0
   */
  public function add_ui_pages_actions()
  {
    if (uip_stop_plugin) {
      return;
    }

    add_action('admin_init', [$this, 'check_for_main_app_pages']);
    add_action('admin_menu', [$this, 'get_ui_pages']);
    add_action('admin_footer', [$this, 'add_wp_menu_icons']);

    //Check if we are on an admin page
    if (isset($_GET['page']) && $_GET['page'] != '') {
      if (strpos($_GET['page'], '-uiptp-') !== false) {
        define('uip_admin_page', true);
        $this->build_ui_page_app();
      } else {
        define('uip_admin_page', false);
      }
    } else {
      define('uip_admin_page', false);
    }

    //If we are not framed then load the menu and toolbar vars
    if (!isset($_GET['uip-framed-page']) || $_GET['uip-framed-page'] != '1') {
      add_action('parent_file', [$this, 'capture_wp_menu'], 9999);
      add_action('wp_before_admin_bar_render', [$this, 'capture_wp_toolbar'], PHP_INT_MAX);
    }
  }

  /**
   * Checks if we should output conditional actions if main app is not running
   * @since 3.0.6
   */
  public function check_for_main_app_pages()
  {
    if (!uip_app_running) {
      add_action('admin_head', [$this, 'add_head_scripts'], 1);
    }
  }

  /**
   * When admin pages have been added and we are using the default admin area, this will format custom admin page menu icons
   * @since 3.0.0
   */
  public function add_wp_menu_icons()
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
   * Adds required actions for ui pages
   * @since 3.0.0
   */
  public function build_ui_page_app()
  {
    ///Admin side functions
    add_action('admin_enqueue_scripts', [$this, 'add_scripts_and_styles']);

    add_action('admin_footer', [$this, 'add_footer_scripts']);
    //Add core app attribute to html
  }

  /**
   * Checks for admin pages apply to current user
   * @since 3.0.0
   */
  public function get_ui_pages()
  {
    //Don't run during ajax requests
    if (defined('DOING_AJAX') && DOING_AJAX) {
      define('uip_app_running', false);
      return;
    }

    $current_user = wp_get_current_user();
    $id = $current_user->ID;
    $username = $current_user->user_login;

    $roles = [];
    if ($id == 1) {
      $roles[] = 'Super Admin';
    }

    //Get current roles
    $user = new WP_User($id);

    if (!empty($user->roles) && is_array($user->roles)) {
      foreach ($user->roles as $role) {
        $roles[] = $role;
      }
    }
    $idAsString = strval($id);

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
      'value' => 'ui-admin-page',
      'compare' => '=',
    ];
    //Check user id is not excluded
    $roleQuery[] = [
      'key' => 'uip-template-excludes-users',
      'value' => serialize($idAsString),
      'compare' => 'NOT LIKE',
    ];
    //Check rolename is not excluded
    foreach ($roles as $role) {
      $roleQuery[] = [
        'key' => 'uip-template-excludes-roles',
        'value' => serialize($role),
        'compare' => 'NOT LIKE',
      ];
    }

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

    //Check at least one option (roles or users) has a value
    $secondLevel = [];
    $secondLevel['relation'] = 'OR';
    $secondLevel[] = [
      'key' => 'uip-template-for-users',
      'value' => serialize([]),
      'compare' => '!=',
    ];
    $secondLevel[] = [
      'key' => 'uip-template-for-roles',
      'value' => serialize([]),
      'compare' => '!=',
    ];

    //Check user if user id is in selected
    $thirdLevel = [];
    $thirdLevel['relation'] = 'OR';
    $thirdLevel[] = [
      'key' => 'uip-template-for-users',
      'value' => serialize($idAsString),
      'compare' => 'LIKE',
    ];

    foreach ($roles as $role) {
      $thirdLevel[] = [
        'key' => 'uip-template-for-roles',
        'value' => serialize($role),
        'compare' => 'LIKE',
      ];
    }

    //Push to meta query
    $roleQuery[] = $secondLevel;
    $roleQuery[] = $thirdLevel;

    //Build query
    $args = [
      'post_type' => 'uip-ui-template',
      'posts_per_page' => -1,
      'post_status' => 'publish',
      'meta_query' => $roleQuery,
    ];

    $query = new WP_Query($args);
    $totalFound = $query->found_posts;
    $foundPosts = $query->get_posts();

    $processed = [];
    if ($totalFound > 0) {
      foreach ($foundPosts as $uiPage) {
        $temp = [];
        $pageName = get_the_title($uiPage->ID);
        $settings = get_post_meta($uiPage->ID, 'uip-template-settings', true);

        $optionIcon = 'uip-admin-page-icon article';
        if (isset($settings->menuIcon) && isset($settings->menuIcon->value) && $settings->menuIcon->value != '') {
          $optionIcon = 'dashicons-uip-icon-' . $settings->menuIcon->value;
        }

        $passData['ID'] = $uiPage->ID;
        $passData['fromMainSite'] = $multiSiteActive;
        $adminPageURL = $this->urlSafe($pageName, '-') . '-uiptp-' . $uiPage->ID;

        $temp['url'] = $adminPageURL;
        $temp['pageName'] = $pageName;
        $temp['passData'] = $passData;
        $temp['icon'] = $optionIcon;

        if (isset($settings->menuParent)) {
          $temp['parent'] = $settings->menuParent;
        } else {
          $temp['parent'] = false;
        }

        $processed[] = $temp;
      }
    }

    if ($multiSiteActive) {
      restore_current_blog();
    }

    foreach ($processed as $uiPage) {
      //Check if we are adding as submenu or top level
      $passData = $uiPage['passData'];
      if ($uiPage['parent'] != '' && $uiPage['parent'] != 'uipblank') {
        //
        add_submenu_page($uiPage['parent'], $uiPage['pageName'], $uiPage['pageName'], 'read', $uiPage['url'], function () use ($passData) {
          $this->handle_custom_page_content($passData);
        });
        //
      } else {
        //No parent set
        add_menu_page(
          $uiPage['pageName'],
          $uiPage['pageName'],
          'read',
          $uiPage['url'],
          function () use ($passData) {
            $this->handle_custom_page_content($passData);
          },
          $uiPage['icon'],
          1
        );
        //
      }
    }
  }

  /**
   * Converts ui page name to url safe slug
   * @since 3.0.0
   * Credit: from https://stackoverflow.com/questions/2955251/php-function-to-make-slug-url-string
   */
  public function urlSafe($text, $divider = '-')
  {
    // replace non letter or digits by divider
    $text = preg_replace('~[^\pL\d]+~u', $divider, $text);

    // transliterate
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);

    // remove unwanted characters
    $text = preg_replace('~[^-\w]+~', '', $text);

    // trim
    $text = trim($text, $divider);

    // remove duplicate divider
    $text = preg_replace('~-+~', $divider, $text);

    // lowercase
    $text = strtolower($text);

    if (empty($text)) {
      return 'n-a';
    }

    return $text;
  }

  /**
   * Handles ui page content
   * @since 2.2.9.2
   */
  public function handle_custom_page_content($passData)
  {
    //Don't run if we are actually on the page, the frame will load it
    if (defined('uip_app_running')) {
      if (uip_app_running) {
        return;
      }
    }
    if (!isset($passData['ID']) || $passData['ID'] == '') {
      $templateString = [];
      $string = __('Unable to find page template', 'uipress-lite');
      $message = "<div class='uip-margin-bottom-s uip-background-red-wash uip-border-round uip-text-s uip-padding-xs uip-scale-in-top uip-text-danger'>{$string}</div>";
      echo wp_kses_post($message);
      return;
    }

    $utils = new uip_util();

    if (!property_exists($this, 'uipMasterMenu')) {
      $menu = false;
    } else {
      $menu = $this->uipMasterMenu;
    }

    if (!property_exists($this, 'uipMasterToolbar')) {
      $tools = false;
    } else {
      $tools = $this->uipMasterToolbar;
    }

    //Output toolbar variable if it has been captured
    $variableFormatter = '';
    if ($utils->clean_ajax_input_width_code($tools)) {
      $tools = json_encode($tools);
      $variableFormatter .= "var uipMasterToolbar = {$tools};";
    }
    if ($menu) {
      $menu = json_encode($utils->clean_ajax_input_width_code($menu));
      $variableFormatter .= "var uipMasterMenu = {$menu};";
    }

    if ($variableFormatter != '') {
      wp_print_inline_script_tag($variableFormatter, ['id' => 'uip-ui-page-vars']);
    }

    ////Switch to multiste if template is from main network site
    if ($passData['fromMainSite']) {
      $mainSiteId = get_main_site_id();
      switch_to_blog($mainSiteId);
    }

    $settings = get_post_meta($passData['ID'], 'uip-template-settings', true);
    $content = get_post_meta($passData['ID'], 'uip-ui-template', true);
    //Check if template exists and isn't empty
    if ((!isset($content) && !is_array($content)) || !$content || count($content) < 1) {
      $content = [];
    }

    $template = [];
    $template['settings'] = $settings;
    $template['content'] = $content;
    $template['id'] = $passData['ID'];
    $template['updated'] = get_the_modified_date('U', $passData['ID']);

    $templateString = html_entity_decode(json_encode($utils->clean_ajax_input_width_code($template)));

    if (!$templateString) {
      $templateString = [];
      $string = __('Unable to process page template', 'uipress-lite');
      $message = "<div class='uip-margin-bottom-s uip-background-red-wash uip-border-round uip-text-s uip-padding-xs uip-scale-in-top uip-text-danger'>{$string}</div>";
      echo wp_kses_post($message);
      return;
    }

    $utils = new uip_util();
    $styles = $utils->get_uip_option('theme-styles');
    $stylesString = html_entity_decode(json_encode($utils->clean_ajax_input_width_code($styles)));

    ////Switch to multiste if template is from main network site
    if ($passData['fromMainSite']) {
      restore_current_blog();
    }

    $variableFormatter = "
      var uipUserTemplate = {$templateString};
      var uipUserStyles = {$stylesString};";
    wp_print_inline_script_tag($variableFormatter, ['id' => 'uip-ui-admin-page']);
    //Output standard css and app container

    $app = "<style>#wpcontent{padding-left: 0;}#wpbody-content{padding-bottom:0px;}@media screen and (max-width: 782px) {.auto-fold #wpcontent { padding: 0 !important;}}</style>
    <div id='uip-ui-app' class='uip-flex uip-w-100p uip-h-viewport uip-text-normal'>
    </div>";

    echo wp_kses_post($app);
  }
}
