<?php
use UipressLite\Classes\Utils\Sanitize;
use UipressLite\Classes\Utils\Ajax;
use UipressLite\Classes\App\UipOptions;
use UipressLite\Classes\Utils\Posts;
use UipressLite\Classes\Utils\Objects;
use UipressLite\Classes\App\UserPreferences;
use UipressLite\Classes\PostTypes\UiTemplates;
use UipressLite\Classes\PostTypes\UiPatterns;
use UipressLite\Classes\Scripts\AdminMenu;
use UipressLite\Classes\Scripts\ToolBar;
use UipressLite\Classes\Scripts\UipScripts;
use UipressLite\Classes\App\AppOptions;

// Exit if accessed directly
!defined("ABSPATH") ? exit() : "";

/**
 * Builds the uipress ui builder
 * @since 3.0.0
 */
class uip_ui_builder extends uip_app
{
  /**
   * Starts ui builder functions
   *
   * @return
   * @since 3.2.13
   */
  public function run()
  {
    $this->add_hooks();
    $this->add_ajax_fuctions();
  }

  /**
   * Hooks into plugins loaded and init
   *
   * @return void
   * @since 3.2.13
   */
  private function add_hooks()
  {
    add_action("plugins_loaded", [$this, "add_ui_builder_actions"], 2);
    add_action("init", [$this, "create_builder_post_types"]);
    add_action("rest_init", [$this, "create_builder_post_types"]);
    add_filter("kses_allowed_protocols", [$this, "allow_data_in_kses"]);
  }

  /**
   * Adds required ajax functions
   *
   * @return void
   * @since 3.2.13
   */
  private function add_ajax_fuctions()
  {
    $functions = [
      "uip_create_new_ui_template",
      "uip_get_ui_template",
      "uip_save_ui_template",
      "uip_save_user_styles",
      "uip_search_posts_pages",
      "uip_get_ui_templates",
      "uip_duplicate_ui_template",
      "uip_delete_ui_template",
      "uip_save_ui_pattern",
      "uip_get_ui_patterns_list",
      "uip_sync_ui_pattern",
      "uip_get_global_settings",
      "uip_save_global_settings",
      "uip_save_from_wizard",
      "uip_update_ui_template_status",
      "uip_get_ui_styles",
    ];

    // Loop and add functions
    foreach ($functions as $func) {
      add_action("wp_ajax_{$func}", [$this, $func]);
    }
  }

  /**
   * Adds data to the allowed KSES function
   *
   * @since 3.0.8
   */
  public function allow_data_in_kses($protocols)
  {
    $protocols[] = "data";
    return $protocols;
  }

  /**
   * Adds all actions for uipress ui builder
   *
   * @since 3.0.0
   */
  public function add_ui_builder_actions()
  {
    // Stop processing if 'uip_stop_plugin' is true
    defined("uip_stop_plugin") && uip_stop_plugin ? exit() : true;
    $hook_suffix = add_action("admin_menu", [$this, "add_ui_builder_to_menu"]);

    $builderName = uip_plugin_shortname . "-ui-builder";
    $page = isset($_GET["page"]) ? sanitize_text_field($_GET["page"]) : false;
    $onBuilderPage = $page == $builderName ? true : false;

    // Exit if not on builder page
    if (!$onBuilderPage) {
      return;
    }

    // Triggers pro actions for builder
    do_action("uipress/app/start");

    // Capture toolbar and menu
    //AdminMenu::capture();
    //ToolBar::capture();

    //add_action("admin_enqueue_scripts", [$this, "add_scripts_and_styles"]);
    //add_action("admin_footer", [$this, "add_footer_scripts"], 9);
  }

  /**
   * Adds ui builder and ui settings to the admin menu
   *
   * @since 3.0.0
   */
  public function add_ui_builder_to_menu()
  {
    // Only add the page on the primary network site if on multisite
    $notNetworkSite = is_multisite() && !is_main_site() && is_plugin_active_for_network(uip_plugin_path_name . "/uipress-lite.php") ? true : false;
    if ($notNetworkSite) {
      return;
    }

    $hook_suffix = add_options_page("uiPress", "uiPress", "manage_options", uip_plugin_shortname . "-ui-builder", [$this, "build_uibuilder_page"]);

    add_action("admin_head-{$hook_suffix}", [$this, "add_scripts_and_styles"]);
    add_action("admin_footer-{$hook_suffix}", [$this, "add_footer_scripts"]);
  }

  /**
   * Loads required scripts and styles for uipress ui builder
   *
   * @since 3.0.0
   */

  public function add_scripts_and_styles()
  {
    UipScripts::add_translations();
    UipScripts::add_uipress_styles();

    //wp_register_style("uip-builder-styles", uip_plugin_url . "app/dist/assets/styles/style.css", [], uip_plugin_version);
    //wp_enqueue_style("uip-builder-styles");
  }

  /**
   * Loads main uiBuilder app script and adds a required data objects
   *
   * @since 3.0.0
   */
  public function add_footer_scripts()
  {
    $script_name = UipScripts::get_base_script_path("builder");

    if (!$script_name) {
      return;
    }

    $builderScript = [
      "id" => "uip-ui-builder-js",
      "src" => uip_plugin_url . "app/dist/{$script_name}",
      "type" => "module",
    ];

    $path = plugins_url("uipress-lite/");

    $variableFormatter = "
      const uipressLitePath = '{$path}';";

    wp_print_inline_script_tag($variableFormatter, ["id" => "uip-format-vars"]);
    wp_print_script_tag($builderScript);
  }

  /**
   * Output base builder styles and app mount point
   *
   * @since 3.0.0
   */
  public function build_uibuilder_page()
  {
    ?>
    <style>
      #wpfooter{display:none;}
      #wpcontent{ padding:0;}
      #wpbody-content{padding-bottom: 0;}
      .notice{display: none !important;}
      
      @media screen and (max-width: 782px){
        .auto-fold #wpcontent {
            padding-left: 0px;
        }
      }
    </style>
    
    <div id="uip-ui-builder" ></div>
    <?php
  }

  /**
   * Creates required post types
   *
   * @since 3.0.0
   */
  public function create_builder_post_types()
  {
    UiTemplates::create();
    UiPatterns::create();
  }

  /**
   * Saves settings from wizard
   *
   * @since 3.0.92
   */
  public function uip_save_from_wizard()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $options = json_decode(stripslashes($_POST["settings"]));
    $options = Sanitize::clean_input_with_code($options);

    $template = false;

    if (!is_object($options)) {
      Ajax::error(__("Unable to save site settings. Data corrupted", "uipress-lite"));
    }

    // Get and decode template
    $template = false;
    if (isset($options->templateJSON)) {
      if ($options->templateJSON && $options->templateJSON != "" && $options->templateJSON != "uipblank") {
        $template = json_decode($options->templateJSON);
        $name = __("Admin theme", "uipress-lite");

        $newTemplateOptions = (object) [
          "globalSettings" => (object) [
            "rolesAndUsers" => $options->appliesTo,
            "excludesRolesAndUsers" => $options->excludes,
            "type" => "ui-template",
            "status" => "uiptrue",
            "name" => $name,
          ],
          "content" => $template,
        ];

        $newTemplateID = UiTemplates::new(["type" => "ui-template", "name" => $name]);
        UiTemplates::save($newTemplateID, $newTemplateOptions);
      }
    }

    //Get site settings

    $globalSettings = UipOptions::get();

    // Global settings doesn't exist so create it
    if (!$globalSettings || is_null($globalSettings)) {
      $globalSettings = [];
      $globalSettings["site-settings"] = new \stdClass();
    }

    // Global settings doesn't exist so create it
    if (!isset($globalSettings["site-settings"]) || !is_object($globalSettings["site-settings"])) {
      $globalSettings["site-settings"] = new \stdClass();
    }

    // Ensure nested paths exists
    Objects::ensureNested($globalSettings["site-settings"], ["general", "globalLogo"]);
    Objects::ensureNested($globalSettings["site-settings"], ["general", "globalLogoDarkMode"]);
    Objects::ensureNested($globalSettings["site-settings"], ["login", "logo"]);
    Objects::ensureNested($globalSettings["site-settings"], ["login", "background_image"]);
    Objects::ensureNested($globalSettings["site-settings"], ["login", "loginTheme"]);
    $siteSettings = $globalSettings["site-settings"];

    // Save light logo
    if (isset($options->logo) && is_object($options->logo)) {
      if ($options->logo->url != "" && $options->logo->url != "uipblank") {
        $siteSettings->general->globalLogo = $options->logo;
      }
    }
    // Save dark logo
    if (isset($options->darkLogo) && $options->darkLogo && is_object($options->darkLogo)) {
      if ($options->darkLogo->url != "" && $options->darkLogo->url != "uipblank") {
        $siteSettings->general->globalLogoDarkMode = $options->darkLogo;
      }
    }

    // Save login logo
    if (isset($options->loginLogo) && $options->loginLogo && is_object($options->loginLogo)) {
      if ($options->loginLogo->url != "" && $options->loginLogo->url != "uipblank") {
        $siteSettings->login->logo = $options->loginLogo;
      }
    }

    // Save login background
    if (isset($options->loginBackground) && $options->loginBackground && is_object($options->loginBackground)) {
      if ($options->loginBackground->url != "" && $options->loginBackground->url != "uipblank") {
        $siteSettings->login->background_image = $options->loginBackground;
      }
    }

    // Save login theme
    if (isset($options->enableLoginTheme) && $options->enableLoginTheme) {
      $siteSettings->login->loginTheme = $options->enableLoginTheme;
    }

    $globalSettings["site-settings"] = $siteSettings;

    UipOptions::update(null, $globalSettings);

    $returndata["success"] = true;
    wp_send_json($returndata);
  }

  /**
   * Saves global settings object
   *
   * @since 3.0.92
   */
  public function uip_save_global_settings()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $decoded = json_decode(stripslashes($_POST["settings"]));
    $options = Sanitize::clean_input_with_code($decoded);

    // Bail if options are not in correct format
    if (!is_object($options)) {
      $returndata["error"] = true;
      $returndata["message"] = __("Unable to save site settings. Data corrupted", "uipress-lite");
      wp_send_json($returndata);
    }

    // Update site option
    UipOptions::update("site-settings", $options);

    $returndata["success"] = true;
    wp_send_json($returndata);
  }

  /**
   * Gets global settings object
   *
   * @since 3.0.92
   */
  public function uip_get_global_settings()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    // Get site settings
    $options = UipOptions::get("site-settings");
    $options = $options ? $options : new stdClass();

    $returndata["success"] = true;
    $returndata["options"] = json_decode(html_entity_decode(wp_json_encode($options)));

    wp_send_json($returndata);
  }

  /**
   * Creates new ui template
   *
   * @since 3.0.0
   */
  public function uip_create_new_ui_template()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    // The type of ui-template to create
    $type = sanitize_text_field($_POST["templateType"]);

    $draftName = __("UI Template (Draft)", "uipress-lite");
    $templateID = UiTemplates::new(["type" => $type, "name" => $draftName]);

    $succesMessage = __("Template created", "uipress-lite");
    $errorMessage = __("Unable to create template", "uipress-lite");
    $message = $templateID ? $succesMessage : $errorMessage;
    $error = $templateID ? false : true;
    $succes = $templateID ? true : false;

    $returndata = [];
    $returndata["success"] = $succes;
    $returndata["error"] = $error;
    $returndata["id"] = $templateID;
    $returndata["message"] = $message;

    wp_send_json($returndata);
  }

  /**
   * Gets ui templates list and returns
   *
   * @since 3.0.0
   */
  public function uip_get_ui_templates()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $search = sanitize_text_field($_POST["search"]);

    $options = ["perPage" => -1, "search" => $search];
    $templateQuery = UiTemplates::list($options);
    $templates = UiTemplates::format($templateQuery->get_posts());

    $totalFound = $templateQuery->found_posts;
    $maxPages = $templateQuery->max_num_pages;

    // Format data
    $returndata = [];
    $returndata["success"] = true;
    $returndata["templates"] = $templates;
    $returndata["totalFound"] = $totalFound;
    $returndata["totalPages"] = $maxPages;

    // Return data to app
    wp_send_json($returndata);
  }

  /**
   * Gets ui template
   * @since 3.0.0
   */
  public function uip_get_ui_template()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $templateID = sanitize_text_field($_POST["templateID"]);

    $template = UiTemplates::get($templateID);

    // Handle template error
    if (!$template) {
      $returndata["error"] = true;
      $returndata["message"] = __("Unable to fetch template", "uipress-lite");
      wp_send_json($returndata);
    }

    $message = __("Succesfully fetched Ui template", "uipress-lite");

    // Get patterns list
    $options = ["perPage" => -1, "search" => ""];
    $patternQuery = UiPatterns::list($options);
    $patterns = UiPatterns::format($patternQuery->get_posts());

    $styles = UipOptions::get("theme-styles");
    $styles = is_object($styles) ? $styles : new stdClass();
    $styles = json_decode(html_entity_decode(wp_json_encode($styles)));

    //Return data to app
    $returndata = [];
    $returndata["success"] = true;
    $returndata["message"] = $message;
    $returndata["content"] = $template["template"];
    $returndata["settings"] = $template["settings"];
    $returndata["type"] = $template["type"];
    $returndata["patterns"] = $patterns;
    $returndata["styles"] = $styles;

    wp_send_json($returndata);
  }

  /**
   * Gets ui styles
   * @since 3.0.98
   */
  public function uip_get_ui_styles()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $styles = UipOptions::get("theme-styles");
    $styles = is_object($styles) ? $styles : new stdClass();
    $styles = json_decode(html_entity_decode(wp_json_encode($styles)));

    //Return data to app
    $returndata = [];
    $returndata["success"] = true;
    $returndata["styles"] = $styles;
    wp_send_json($returndata);
  }

  /**
   * Deletes templates: accepts either single id or array of ids
   *
   * @since 3.0.0
   */
  public function uip_delete_ui_template()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    // Update Cache key to invalidate local storage cached templates
    $cache_key = bin2hex(random_bytes(6));
    update_option("uipress-cache-key", $cache_key);

    $templateIDs = json_decode(stripslashes($_POST["templateids"]));
    $templateIDs = Sanitize::clean_input_with_code($templateIDs);
    $templateIDs = is_array($templateIDs) ? $templateIDs : [$templateIDs];

    $status = UiTemplates::delete($templateIDs);

    if (!$status) {
      $returndata["error"] = true;
      $returndata["message"] = __("Unable to delete templates at this time", "uipress-lite");
      wp_send_json($returndata);
    }

    $message = count($templateIDs) > 1 ? __("Templates deleted", "uipress-lite") : __("Template deleted", "uipress-lite");

    $returndata["success"] = true;
    $returndata["message"] = $message;
    wp_send_json($returndata);
  }

  /**
   * Updates template status from the table
   * @since 3.0.98
   */
  public function uip_update_ui_template_status()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $templateID = sanitize_text_field($_POST["templateid"]);
    $status = sanitize_text_field($_POST["status"]);

    $templateFor = json_decode(stripslashes($_POST["templatefor"]));
    $templateFor = Sanitize::clean_input_with_code($templateFor);

    if (!$templateID || !$status) {
      $returndata["error"] = true;
      $returndata["message"] = __("Unable to update template status", "uipress-lite");
      wp_send_json($returndata);
    }

    if (!current_user_can("edit_post", $templateID)) {
      $returndata["error"] = true;
      $returndata["message"] = __("You don't have the correct permissions to edit this template", "uipress-pro");
      wp_send_json($returndata);
    }

    UiTemplates::update_status($templateID, $status);
    UiTemplates::update_template_for($templateID, $templateFor);

    $returndata = [];
    $returndata["success"] = true;
    $returndata["message"] = __("Template updated", "uipress-lite");
    wp_send_json($returndata);
  }

  /**
   * Duplicates ui template
   *
   * @since 3.0.0
   */
  public function uip_duplicate_ui_template()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    // Update Cache key to invalidate local storage cached templates
    $cache_key = bin2hex(random_bytes(6));
    update_option("uipress-cache-key", $cache_key);

    // Sanitize and validate the ID
    $templateID = absint($_POST["id"]);

    // Ensure the ID is not zero after sanitization
    if ($templateID > 0) {
      $newPost = Posts::duplicate($templateID);
    } else {
      $returndata["error"] = true;
      $returndata["message"] = __("Unable to duplicate template", "uipress-lite");
      wp_send_json($returndata);
    }

    if (!$newPost) {
      $returndata["error"] = true;
      $returndata["message"] = __("Unable to duplicate template", "uipress-lite");
      wp_send_json($returndata);
    }

    //Return data to app
    $returndata = [];
    $returndata["success"] = true;
    $returndata["message"] = __("Template duplicated", "uipress-lite");
    wp_send_json($returndata);
  }

  /**
   * Saves ui template
   *
   * @since 3.0.0
   */
  public function uip_save_ui_template()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    // Sanitise inputs
    $template = json_decode(stripslashes($_POST["template"]));
    $template = Sanitize::clean_input_with_code($template);
    $templateID = sanitize_text_field($_POST["templateID"]);

    $response = UiTemplates::save($templateID, $template);

    if (!$response) {
      $returndata["error"] = true;
      $returndata["message"] = __("Unable to save template", "uipress-lite");
      wp_send_json($returndata);
    }

    // Return data to app
    $returndata = [];
    $returndata["success"] = true;
    $returndata["message"] = __("Template saved", "uipress-lite");
    wp_send_json($returndata);
  }

  /**
   * Saves user styles vars
   *
   * @return void
   * @since 3.2.13
   */
  public function uip_save_user_styles()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $styles = json_decode(stripslashes($_POST["styles"]));
    $styles = Sanitize::clean_input_with_code($styles);

    if ($styles && is_object($styles)) {
      UipOptions::update("theme-styles", $styles);
    }

    //Return data to app
    $returndata = [];
    $returndata["success"] = true;
    $returndata["message"] = __("Styles saved", "uipress-lite");
    wp_send_json($returndata);
  }

  /**
   * syncs uiPattern accross all templates
   *
   * @since 3.0.0
   */
  public function uip_sync_ui_pattern()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $pattern = json_decode(stripslashes($_POST["pattern"]));
    $pattern = Sanitize::clean_input_with_code($pattern);
    $patternID = sanitize_text_field($_POST["patternID"]);
    $currentTemplateID = sanitize_text_field($_POST["templateID"]);

    $newPatternID = false;
    $newTemplate = [];

    // Pattern does not exist so create it
    if (!get_post_status($patternID)) {
      $newPatternID = UiPatterns::new($pattern->name, $pattern, "layout", "", "category");
      $pattern->patternID = $newPatternID;
      UiPatterns::update_template($newPatternID, $pattern);
    } else {
      //Update existing pattern
      UiPatterns::update_template($patternID, $pattern);
    }

    $options = ["perPage" => -1, "search" => ""];
    $templateQuery = UiTemplates::list($options);
    $allTemplates = $templateQuery->get_posts();

    foreach ($allTemplates as $template) {
      //Don't edit current template
      $blocks = get_post_meta($template->ID, "uip-ui-template", true);

      // Empty template so continue
      if (!is_array($blocks)) {
        continue;
      }

      // Update pattern in blocks
      $newTemplate = UiPatterns::sync_template_patterns($blocks, $pattern, $patternID, $newPatternID);
      UiTemplates::update_settings($template->ID, null, null, null, $newTemplate);

      // If this template is the current template being edited then return the updated value toi frontend
      if ($currentTemplateID == $template->ID) {
        $returnTemplate = $newTemplate;
      }
    }

    // Get patterns list
    $options = ["perPage" => -1, "search" => ""];
    $patternQuery = UiPatterns::list($options);
    $patterns = UiPatterns::format($patternQuery->get_posts());

    // Return data to app
    $returndata = [];
    $returndata["success"] = true;
    $returndata["message"] = __("Patterns synced", "uipress-lite");
    $returndata["newPattern"] = $newPatternID;
    $returndata["patterns"] = $patterns;
    $returndata["newTemplate"] = $returnTemplate;
    wp_send_json($returndata);
  }

  /**
   * Saves ui patern
   *
   * @since 3.2.13
   * @since 3.0.0
   */
  public function uip_save_ui_pattern()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $pattern = json_decode(stripslashes($_POST["pattern"]));
    $pattern = Sanitize::clean_input_with_code($pattern);

    $name = sanitize_text_field($_POST["name"]);
    $type = sanitize_text_field($_POST["type"]);
    $des = sanitize_text_field($_POST["description"]);
    $icon = sanitize_text_field($_POST["icon"]);

    $patternID = UiPatterns::new($name, $pattern, $type, $des, $icon);

    // Exit if no id
    if (!$patternID) {
      $returndata["error"] = true;
      $returndata["message"] = __("Unable to save pattern", "uipress-lite");
      wp_send_json($returndata);
    }

    // Get patterns list
    $options = ["perPage" => -1, "search" => ""];
    $patternQuery = UiPatterns::list($options);
    $patterns = UiPatterns::format($patternQuery->get_posts());

    //Return data to app
    $returndata = [];
    $returndata["success"] = true;
    $returndata["message"] = __("Pattern saved", "uipress-lite");
    $returndata["patterns"] = $patterns;
    $returndata["patternid"] = $post;
    wp_send_json($returndata);
  }

  /**
   * Searches posts and pages by pass search string (query)
   *
   * @since 3.0.0
   */
  public function uip_search_posts_pages()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    // Sanitise search
    $string = sanitize_text_field($_POST["searchStr"]);

    $postsQuery = Posts::search(["perPage" => 20, "search" => $string, "post_type" => "any"]);
    $totalFound = $postsQuery->found_posts;
    $foundPosts = $postsQuery->get_posts();

    $formattedPosts = [];

    foreach ($foundPosts as $item) {
      $temp = [];
      $temp["name"] = get_the_title($item->ID);
      $temp["link"] = get_permalink($item->ID);
      $formattedPosts[] = $temp;
    }

    //Return data to app
    $returndata = [];
    $returndata["success"] = true;
    $returndata["posts"] = $formattedPosts;
    wp_send_json($returndata);
  }

  /**
   * Gets patterns for the builder form ajax
   *
   * @since 3.0.0
   */

  public function uip_get_ui_patterns_list()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    // Get patterns list
    $options = ["perPage" => -1, "search" => ""];
    $patternQuery = UiPatterns::list($options);
    $patterns = UiPatterns::format($patternQuery->get_posts());

    $returndata["success"] = true;
    $returndata["message"] = __("Columns fetched", "uipress-lite");
    $returndata["patterns"] = $patterns;
    wp_send_json($returndata);
  }
}
