<?php
use UipressLite\Classes\Utils\Ajax;
use UipressLite\Classes\Utils\Sanitize;
use UipressLite\Classes\App\UipOptions;
use UipressLite\Classes\ImportExport\Import;
use UipressLite\Classes\ImportExport\Export;
use UipressLite\Classes\App\BlockQuery;
use UipressLite\Classes\Utils\Posts;
use UipressLite\Classes\App\UserPreferences;
use UipressLite\Classes\Utils\Users;
use UipressLite\Classes\Utils\Objects;
use UipressLite\Classes\Scripts\AdminMenu;

!defined("ABSPATH") ? exit() : "";

/**
 * Main uipress ajax class. Loads all ajax functions for the main uipress functionality
 *
 * @since 3.0.0
 */

class uip_ajax
{
  public function load_ajax()
  {
    $function_names = [
      "uip_get_users_and_roles",
      "uip_get_post_types",
      "uip_get_recent_posts",
      "uip_get_posts_for_table",
      "uip_get_post_table_columns",
      "uip_delete_post",
      "uip_save_user_preference",
      "uip_get_user_preference",
      "uip_search_content",
      "uip_process_form_input",
      "uip_send_form_email",
      "uip_save_form_as_option",
      "uip_save_form_as_user_option",
      "uip_pre_populate_form_data",
      "uip_create_frame_switch",
      "uip_get_sync_options",
      "uip_refresh_sync_key",
      "uip_save_sync_options",
      "uip_start_site_sync",
      "uip_check_for_template_updates",
      "uip_process_block_query",
      "uip_save_site_option",
      "uip_send_message_to_gpt",
      "uip_global_export",
      "uip_global_import",
      "uip_push_new_custom_menu_items",
      "uip_remove_custom_menu_items",
    ];

    // Push ajax actions
    foreach ($function_names as $name) {
      add_action("wp_ajax_{$name}", [$this, $name]);
    }
  }

  /**
   * Updates given menu with new items from auto detect
   *
   * @since 3.3.095
   */
  public function uip_push_new_custom_menu_items()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $menuItems = json_decode(stripslashes($_POST["new_items"]));
    $menuItems = Sanitize::clean_input_with_code($menuItems);
    $menuid = sanitize_text_field($_POST["menu_id"]);

    if (!$menuid || !is_array($menuItems)) {
      $message = __("Unable to update menu", "uipress-lite");
      Ajax::error($message);
    }

    $menuSettings = get_post_meta($menuid, "uip_menu_settings", true);
    $customMenu = Objects::get_nested_property($menuSettings, ["menu", "menu"]);
    if (!is_array($customMenu)) {
      $message = __("No valid menu discovered", "uipress-lite");
      Ajax::error($message);
    }

    $customMenu = [...$customMenu, ...$menuItems];
    $menuSettings->menu->menu = $customMenu;

    update_post_meta($menuid, "uip_menu_settings", $menuSettings);

    $returndata = [];
    $returndata["success"] = true;
    $returndata["message"] = "Success";

    wp_send_json($returndata);
  }

  /**
   * Updates given menu with new items from auto detect
   *
   * @since 3.3.095
   */
  public function uip_remove_custom_menu_items()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $menuItems = json_decode(stripslashes($_POST["new_items"]));
    $menuItems = Sanitize::clean_input_with_code($menuItems);
    $menuid = sanitize_text_field($_POST["menu_id"]);

    if (!$menuid || !is_array($menuItems)) {
      $message = __("Unable to update menu", "uipress-lite");
      Ajax::error($message);
    }

    $menuSettings = get_post_meta($menuid, "uip_menu_settings", true);
    $customMenu = Objects::get_nested_property($menuSettings, ["menu", "menu"]);
    if (!is_array($customMenu)) {
      $message = __("No valid menu discovered", "uipress-lite");
      Ajax::error($message);
    }

    // Filter out menu items
    $uidsToRemove = array_map(function ($obj) {
      return $obj->uip_uid;
    }, $menuItems);

    // Filter out objects from sourceArray whose uip_uid is in uidsToRemove
    $customMenu = array_filter($customMenu, function ($obj) use ($uidsToRemove) {
      return !in_array($obj->uip_uid, $uidsToRemove);
    });

    $menuSettings->menu->menu = $customMenu;

    update_post_meta($menuid, "uip_menu_settings", $menuSettings);

    $returndata = [];
    $returndata["success"] = true;
    $returndata["message"] = "Success";

    wp_send_json($returndata);
  }

  /**
   * Starts remote site sync
   *
   * @since 3.2.08
   */
  public function uip_start_site_sync()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $options = json_decode(stripslashes($_POST["options"]));
    $options = Sanitize::clean_input_with_code($options);

    if (is_null($options) || !is_object($options)) {
      $message = __("Unable to get import options", "uipress-lite");
      Ajax::error($message);
    }

    $import = Import::get_remote($options);

    if (isset($import["error"])) {
      Ajax::error($import["message"]);
    }

    $returndata = [];
    $returndata["success"] = true;
    $returndata["message"] = "Success";

    wp_send_json($returndata);
  }

  /**
   * Gets new site sync key and returns to app
   * @since 3.2.08
   */
  public function uip_refresh_sync_key()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    // Get new key
    $options = UipOptions::get("remote-sync");
    $options["key"] = uniqid("uip-", true);
    UipOptions::update("remote-sync", $options);

    $returndata = [];
    $returndata["success"] = true;
    $returndata["message"] = "Success";
    $returndata["options"] = $options;

    wp_send_json($returndata);
  }

  /**
   * Saves site sync options from front end
   *
   * @since 3.2.08
   */
  public function uip_save_sync_options()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $options = json_decode(stripslashes($_POST["options"]));
    $options = Sanitize::clean_input_with_code($options);

    $syncOptions = json_decode(stripslashes($_POST["syncOptions"]));
    $syncOptions = Sanitize::clean_input_with_code($syncOptions);

    if (!$options || !is_object($options) || !$syncOptions || !is_object($syncOptions)) {
      $message = __("Unable to save site sync options", "uipress-lite");
      Ajax::error($message);
    }

    $update = UipOptions::get("remote-sync");
    $update["hostEnabled"] = $options->hostEnabled;
    $update["syncOptions"] = $syncOptions;

    UipOptions::update("remote-sync", $update);

    $returndata = [];
    $returndata["success"] = true;
    $returndata["message"] = "Success";

    wp_send_json($returndata);
  }

  /**
   * Get site sync options for frontend app
   *
   * @since 3.2.08
   */
  public function uip_get_sync_options()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $options = UipOptions::get("remote-sync");

    if (!$options || !is_array($options)) {
      $options = [];
      $options["key"] = uniqid("uip-", true);
      UipOptions::update("remote-sync", $options);
    }

    $returndata = [];
    $returndata["success"] = true;
    $returndata["message"] = "Success";
    $returndata["options"] = $options;
    $returndata["restURL"] = get_rest_url(null, "/uipress/v1/export");

    wp_send_json($returndata);
  }

  /**
   * Handles global import from app
   *
   * @since 3.2.13
   */
  public function uip_global_import()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $content = json_decode(stripslashes($_POST["content"]));
    $content = Sanitize::clean_input_with_code($content);

    // Exit early if options are not object
    if (is_null($content) || !is_object($content)) {
      $message = __("Unable to get import options", "uipress-lite");
      Ajax::error($message);
    }

    // Templates
    if (property_exists($content, "templates")) {
      Import::templates($content->templates);
    }

    // Settings
    if (property_exists($content, "siteSettings")) {
      Import::settings($content->siteSettings);
    }

    // Menus
    if (property_exists($content, "menus")) {
      Import::menus($content->menus);
    }

    $returndata = [];
    $returndata["success"] = true;
    $returndata["message"] = "Success";

    wp_send_json($returndata);
  }

  /**
   * Handles global export of uipress settings, templates and menus
   *
   * @since 3.0.0
   */
  public function uip_global_export()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $options = json_decode(stripslashes($_POST["options"]));
    $options = Sanitize::clean_input_with_code($options);

    // No options to exit early
    if (is_null($options) || !is_object($options)) {
      $message = __("Unable to get export options", "uipress-lite");
      Ajax::error($message);
    }

    $export = Export::get($options);

    $returndata = [];
    $returndata["success"] = true;
    $returndata["message"] = "Success";
    $returndata["export"] = $export;

    wp_send_json($returndata);
  }

  /**
   * Sends messages to open ai server
   *
   * @since 3.2.13
   */
  public function uip_send_message_to_gpt()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $messages = json_decode(stripslashes($_POST["messages"]));
    $messages = Sanitize::clean_input_with_code($messages);

    $key = sanitize_text_field($_POST["key"]);
    $model = sanitize_text_field($_POST["model"]);

    // No messages
    if (is_null($messages) || !is_array($messages)) {
      $message = __("Unable to send message to chat", "uipress-lite");
      Ajax::error($message);
    }

    // No open ai api key
    if (!$key) {
      $message = __("No valid API key provided", "uipress-lite");
      Ajax::error($message);
    }

    $url = "https://api.openai.com/v1/chat/completions";
    $model = $model ?? "gpt-3.5-turbo";

    $args = [
      "headers" => [
        "Authorization" => "Bearer {$key}",
        "Content-Type" => "application/json",
      ],
      "body" => wp_json_encode([
        "messages" => $messages,
        "model" => $model,
      ]),
      "timeout" => 45,
    ];

    $response = wp_remote_post($url, $args);

    if (is_wp_error($response)) {
      $error_message = $response->get_error_message();
      $returndata["error"] = true;
      $returndata["message"] = $error_message;
      wp_send_json($returndata);
    } else {
      $body = json_decode(wp_remote_retrieve_body($response), true);
      //Return data to app
      $returndata = [];
      $returndata["success"] = true;
      $returndata["message"] = $body;
      wp_send_json($returndata);
    }
  }

  /**
   * Saves site option from app
   *
   * @since 3.2.13
   */
  public function uip_save_site_option()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $option = json_decode(stripslashes($_POST["option"]));
    $option = Sanitize::clean_input_with_code($option);
    $optionName = sanitize_text_field($_POST["optionName"]);

    if (!$optionName) {
      Ajax::error(__("No option name specified", "uipress-lite"));
    }

    UipOptions::update($optionName, $option);

    $returndata["success"] = true;
    $returndata["message"] = __("Option saved", "uipress-lite");
    wp_send_json($returndata);
  }

  /**
   * Runs a block query
   * @since 3.0.0
   */
  public function uip_process_block_query()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $query = json_decode(stripslashes($_POST["query"]));
    $query = Sanitize::clean_input_with_code($query);

    $blockString = sanitize_text_field($_POST["blockString"]);
    $page = sanitize_text_field($_POST["page"]);
    $search = sanitize_text_field($_POST["search"]);

    if (!is_object($query)) {
      Ajax::error(__("Corrupt query. Unable to loop posts", "uipress-lite"));
    }

    $formattedQuery = BlockQuery::run($query, $blockString, $page, $search);
    wp_send_json($formattedQuery);
  }

  /**
   * Checks for the last updated time of the current template
   * @since 3.0.96
   */
  public function uip_check_for_template_updates()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $templateID = sanitize_text_field($_POST["template_id"]);

    // No id so exit early
    if (!$templateID) {
      Ajax::error(__("Unable to get last updated for template", "uipress-lite"));
    }
    $updated = get_the_modified_date("U", $templateID);

    $returndata = [];
    $returndata["updated"] = $updated;
    $returndata["status"] = get_post_status($templateID);
    $returndata["success"] = true;
    wp_send_json($returndata);
  }

  /**
   * Creates a temporary transient for disabling uipress
   *
   * @since 3.0.6
   */
  public function uip_create_frame_switch()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $uid = sanitize_text_field($_POST["uid"]);

    if (!$uid) {
      Ajax::error(__("Unable to create temporary frame", "uipress-lite"));
    }

    set_transient(str_replace($uid, "-", "_"), "uiptrue", 30);

    $returndata["success"] = true;
    $returndata["message"] = __("Transient created", "uipress-lite");
    wp_send_json($returndata);
  }

  /**
   * Processes data from a form and saves as a user meta
   * @since 3.0.0
   */
  public function uip_save_form_as_user_option()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $data = json_decode(stripslashes($_POST["formData"]));
    $data = Sanitize::clean_input_with_code($data);

    $objectOrSingle = sanitize_text_field($_POST["objectOrSingle"]);

    $userMetaObjectKey = sanitize_key($_POST["userMetaObjectKey"]);

    // If not object or key then exit
    if ($objectOrSingle == "object" && !$userMetaObjectKey) {
      Ajax::error(__("Config error: You need to specifiy a meta key to save the meta data to", "uipress-lite"));
    }

    $userID = get_current_user_id();

    // save as object
    if ($objectOrSingle == "object") {
      update_user_meta($userID, $userMetaObjectKey, $data);
    }

    // Save as keys
    if ($objectOrSingle == "single") {
      foreach ($data as $key => $value) {
        update_user_meta($userID, $key, $value);
      }
    }

    $returndata = [];
    $returndata["success"] = true;
    wp_send_json($returndata);
  }

  /**
   * DEPRECIATED: Processes data from a form and saves as a site option
   *
   * @since 3.0.0
   */
  public function uip_save_form_as_option()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    // Ensure user is logged in
    if (!is_user_logged_in()) {
      Ajax::error(__("You must be logged in to submit this form", "uipress-lite"));
    }

    // Discontinued feature to ensure security
    Ajax::error(__("It's no longer possible to save form data as site options. Please contact your site admin.", "uipress-lite"));
    return;
  }

  /**
   * Processes data from a form to an email
   *
   * @since 3.0.0
   */
  public function uip_send_form_email()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $data = json_decode(stripslashes($_POST["formData"]));
    $data = Sanitize::clean_input_with_code($data);

    $emailTemplate = stripslashes($_POST["emailTemplate"]);
    $emailTemplate = Sanitize::clean_input_with_code($emailTemplate);

    $emailSubject = sanitize_text_field($_POST["emailSubject"]);
    $emailTo = sanitize_email($_POST["emailTo"]);

    // Bail if no email address
    if (!is_email($emailTo)) {
      Ajax::error(__("Config error: Recipient email is not valid", "uipress-lite"));
    }

    // Bail if no email template
    if ($emailTemplate == "") {
      Ajax::error(__("Config error: No email template set", "uipress-lite"));
    }

    // Handle dynamic data
    foreach ($data as $key => $value) {
      $emailTemplate = str_replace("{{" . $key . "}}", $value, $emailTemplate);
    }

    $subject = $emailSubject;
    $content = $emailTemplate;
    $replyTo = $emailTo;
    $blogname = get_bloginfo("name");

    $headers[] = "From: {$blogname} <{$emailTo}>";
    $headers[] = "Reply-To: {$emailTo}";
    $headers[] = "Content-Type: text/html; charset=UTF-8";

    $wrap = '<table style="box-sizing:border-box;border-color:inherit;text-indent:0;padding:0;margin:64px auto;width:464px"><tbody>';
    $wrapend = "</tbody></table>";
    $formatted = $wrap . $content . $wrapend;

    $status = wp_mail($emailTo, $subject, $formatted, $headers);

    // Failed to send email
    if (!$status) {
      Ajax::error(__("Unable to send mail at this time", "uipress-lite"));
    }

    $returndata = [];
    $returndata["success"] = true;
    wp_send_json($returndata);
  }

  /**
   * Processes form data and pre-populates the data
   *
   * @since 3.0.0
   */
  public function uip_pre_populate_form_data()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $formKeys = json_decode(stripslashes($_POST["formKeys"]));
    $formKeys = Sanitize::clean_input_with_code($formKeys);

    $saveType = sanitize_text_field($_POST["saveType"]);
    $objectOrSingle = sanitize_text_field($_POST["objectOrSingle"]);
    $userMetaObjectKey = sanitize_key($_POST["userMetaObjectKey"]);
    $siteOptionName = sanitize_key($_POST["siteOptionName"]);

    $data = [];

    // Handle user meta population
    if ($saveType == "userMeta") {
      // Saving as an object but no key give so exit early
      if (($objectOrSingle == "object" && !$userMetaObjectKey) || !is_array($formKeys)) {
        wp_send_json([]);
      }

      $userID = get_current_user_id();

      if ($objectOrSingle == "single") {
        foreach ($formKeys as $key) {
          $value = get_user_meta($userID, $key, true);
          $data[$key] = $value;
        }
      }

      if ($objectOrSingle == "object") {
        $userdata = get_user_meta($userID, $userMetaObjectKey, true);

        if (is_array($userdata)) {
          foreach ($formKeys as $key) {
            if (isset($userdata[$key])) {
              $data[$key] = $userdata[$key];
            }
          }
        }
        if (is_object($userdata)) {
          foreach ($formKeys as $key) {
            if (isset($userdata->$key)) {
              $data[$key] = $userdata->$key;
            }
          }
        }
      }
    }
    //Site option
    if ($saveType == "siteOption") {
      // Bail if no site option name or form keys
      if (!$siteOptionName || !is_array($formKeys)) {
        wp_send_json([]);
      }

      // Force prefix the option key with uip_form_
      $siteOptionName = sanitize_key("uip_form_" . $siteOptionName);
      $sitedata = get_site_option($siteOptionName);

      if (is_array($sitedata)) {
        foreach ($formKeys as $key) {
          if (isset($sitedata[$key])) {
            $data[$key] = $sitedata[$key];
          }
        }
      }
      if (is_object($sitedata)) {
        foreach ($formKeys as $key) {
          if (isset($sitedata->$key)) {
            $data[$key] = $sitedata->$key;
          }
        }
      }
    }
    $returndata = [];
    $returndata["success"] = true;
    $returndata["formValues"] = $data;
    wp_send_json($returndata);
  }

  /**
   * Processes data from a form to user supplied function
   * @since 3.0.0
   */
  public function uip_process_form_input()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $data = json_decode(stripslashes($_POST["formData"]));
    $data = Sanitize::clean_input_with_code($data);

    $userFunction = sanitize_text_field($_POST["userFunction"]);

    if (!function_exists($userFunction)) {
      Ajax::error(__('Passed function doesn\'t exist', "uipress-lite"));
    }

    // Try to start user supplied function
    try {
      $userFunction($data);
    } catch (Exception $e) {
      // Catch function error
      Ajax::error($e->getMessage());
    }

    $returndata = [];
    $returndata["success"] = true;
    wp_send_json($returndata);
  }

  /**
   * Searches posts and pages by passed search string for the search block
   *
   * @since 3.0.0
   */
  public function uip_search_content()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $postTypes = json_decode(stripslashes($_POST["postTypes"]));
    $postTypes = Sanitize::clean_input_with_code($postTypes);

    $searchString = sanitize_text_field($_POST["search"]);
    $page = sanitize_option("page_for_posts", $_POST["page"]);
    $authorLimit = sanitize_text_field($_POST["limitToauthor"]);
    $filter = sanitize_text_field($_POST["filter"]);

    if (!is_array($postTypes) || empty($postTypes)) {
      $types = "post";
    } else {
      $types = $postTypes;
    }

    if ($filter && $filter != "" && $filter != "all") {
      $types = $filter;
    }

    $args = ["perPage" => 10, "search" => $searchString, "post_type" => $types, "page" => $page];
    $query = Posts::search($args, $authorLimit);

    $totalFound = $query->found_posts;
    $foundPosts = $query->get_posts();

    $formattedPosts = [];
    $types = [];
    $typesHolder = [];

    foreach ($foundPosts as $item) {
      $temp = [];

      $modified = get_the_modified_date("U", $item->ID);
      $humandate = human_time_diff($modified, strtotime(gmdate("Y-D-M"))) . " " . __("ago", "uipress-lite");
      $author_id = get_post_field("post_author", $item->ID);
      $user = get_user_by("id", $author_id);
      $username = $user->user_login;

      $pt = get_post_type($item->ID);
      $post_type_obj = get_post_type_object($pt);

      $temp["name"] = get_the_title($item->ID);
      $temp["link"] = get_permalink($item->ID);
      $temp["editLink"] = get_edit_post_link($item->ID, "&");
      $temp["modified"] = $humandate;
      $temp["type"] = $post_type_obj->labels->singular_name;
      $temp["author"] = $username;

      $icon = "article";
      if ($pt == "attachment") {
        $icon = wp_get_attachment_thumb_url($item->ID);
      } else {
        $thumb = get_the_post_thumbnail_url($item->ID);

        if ($thumb) {
          $icon = $thumb;
        }
      }

      $temp["icon"] = $icon;

      $formattedPosts[] = $temp;

      if (!in_array($post_type_obj->labels->singular_name, $typesHolder)) {
        $typesHolder[] = $post_type_obj->labels->singular_name;
        $temp = [];
        $temp["name"] = $pt;
        $temp["label"] = $post_type_obj->labels->singular_name;
        $types[] = $temp;
      }
    }

    //Return data to app
    $returndata = [];
    $returndata["success"] = true;
    $returndata["posts"] = $formattedPosts;
    $returndata["totalPages"] = $query->max_num_pages;
    $returndata["totalFound"] = $totalFound;
    $returndata["types"] = $types;
    wp_send_json($returndata);
  }

  /**
   * Gets user preference by key
   *
   * @since 3.0.0
   */
  public function uip_get_user_preference()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $key = sanitize_text_field($_POST["key"]);

    $userid = get_current_user_id();
    $value = UserPreferences::get($key);

    $returndata["success"] = true;
    $returndata["value"] = $value;
    wp_send_json($returndata);
  }

  /**
   * Updates user preference by key
   *
   * @since 3.0.0
   */

  public function uip_save_user_preference()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $key = sanitize_text_field($_POST["key"]);

    $newValue = json_decode(stripslashes($_POST["value"]));
    $newValue = Sanitize::clean_input_with_code($newValue);

    UserPreferences::update($key, $newValue);

    $returndata["success"] = true;
    $returndata["message"] = __("Preference updated", "uipress-lite");
    wp_send_json($returndata);
  }

  /**
   * Deletes posts by ID
   *
   * Accepts single ID or array of IDS
   *
   * @since 3.0.0
   */

  public function uip_delete_post()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $ids = json_decode(stripslashes($_POST["id"]));
    $ids = Sanitize::clean_input_with_code($ids);

    if (!is_array($ids)) {
      Ajax::error(__("Unable to read post ids to delete", "uipress-lite"));
    }

    $errorcount = 0;
    foreach ($ids as $id) {
      // Id does not exists
      if (!$id || $id == "" || !is_numeric($id)) {
        $errorcount += 1;
        continue;
      }

      // Unable to delete this posts
      if (!current_user_can("delete_post", $id)) {
        $errorcount += 1;
        continue;
      }

      $data = wp_delete_post($id, true);

      if (!$data) {
        $errorcount += 1;
      }
    }

    $returndata["success"] = true;
    $returndata["message"] = __("Item deleted", "uipress-lite");
    $returndata["errorCount"] = $errorcount;
    wp_send_json($returndata);
  }

  /**
   * Returns list of posts for recent posts blocks
   *
   * @since 3.0.0
   */

  public function uip_get_posts_for_table()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $types = json_decode(stripslashes($_POST["postTypes"]));
    $types = Sanitize::clean_input_with_code($types);

    $userCols = json_decode(stripslashes($_POST["columns"]));
    $userCols = Sanitize::clean_input_with_code($userCols);

    $actions = json_decode(stripslashes($_POST["actions"]));
    $actions = Sanitize::clean_input_with_code($actions);

    $page = sanitize_option("page_for_posts", $_POST["page"]);
    $perPage = sanitize_option("page_for_posts", $_POST["perPage"]);
    $limitToAuthor = sanitize_text_field($_POST["limitToAuthor"]);
    $string = sanitize_text_field($_POST["search"]);

    if (!$userCols || empty($userCols)) {
      $userCols = false;
    }
    if (!$actions || empty($actions)) {
      $actions = false;
    }

    if (!$perPage || $perPage == "") {
      $perPage = 10;
    }

    if (!is_array($types) || empty($types)) {
      $types = "post";
    }
    //Get template
    $args = [
      "post_type" => $types,
      "posts_per_page" => $perPage,
      "paged" => $page,
      "post_status" => "any",
      "s" => $string,
    ];

    if ($limitToAuthor == "true") {
      $args["author"] = get_current_user_id();
    }

    $query = new WP_Query($args);
    $totalFound = $query->found_posts;
    $foundPosts = $query->get_posts();

    $formattedPosts = [];
    $columns = [];

    foreach ($foundPosts as $item) {
      $temp = [];

      $modified = get_the_modified_date("U", $item->ID);
      $humandate = human_time_diff($modified, strtotime(gmdate("Y-D-M"))) . " " . __("ago", "uipress-lite");
      $author_id = get_post_field("post_author", $item->ID);
      $user = get_user_by("id", $author_id);
      $username = $user->user_login;
      $pt = get_post_type($item->ID);

      $post_type_obj = get_post_type_object(get_post_type($item->ID));

      //Get post categories
      $post_categories = wp_get_post_categories($item->ID);
      $cats = [];
      foreach ($post_categories as $c) {
        $cat = get_category($c);
        $cats[] = ["name" => $cat->name, "slug" => $cat->slug];
      }

      //Get post tags
      $post_tags = wp_get_post_tags($item->ID);
      $tags = [];
      foreach ($post_tags as $tag) {
        $tags[] = ["name" => $tag->name, "slug" => $tag->slug];
      }

      $link = get_permalink($item->ID);
      $editLink = get_edit_post_link($item->ID, "&");

      if ($pt == "attachment") {
        $image = wp_get_attachment_image_url($item->ID);
      } else {
        $image = get_the_post_thumbnail_url($item->ID, "post-thumbnail");
      }

      $temp["name"] = get_the_title($item->ID);
      $temp["link"] = $link;
      $temp["editLink"] = $editLink;
      $temp["modified"] = $humandate;
      $temp["type"] = $post_type_obj->labels->singular_name;
      $temp["author"] = $username;
      $temp["img"] = $image;
      $temp["authorLink"] = get_author_posts_url($author_id);
      $temp["excerpt"] = substr(get_the_excerpt($item->ID), 0, 60);
      $temp["categories"] = $cats;
      $temp["tags"] = $tags;
      $temp["id"] = $item->ID;

      if ($userCols) {
        foreach ($userCols as $col) {
          if ($col->type == "meta") {
            $temp[$col->name] = get_post_meta($item->ID, $col->name, true);
          }
        }
      }

      $allActions = [
        "view" => ["name" => "view", "label" => __("View", "uipress-lite"), "icon" => "visibility", "link" => $link, "type" => "link", "ID" => $item->ID],
        "edit" => ["name" => "edit", "label" => __("Edit", "uipress-lite"), "icon" => "edit_document", "link" => $editLink, "type" => "link", "ID" => $item->ID],
        "delete" => ["name" => "delete", "label" => __("Delete", "uipress-lite"), "icon" => "delete", "link" => "", "type" => "link", "ID" => $item->ID],
      ];

      $temp["actions"] = [];
      if ($actions) {
        foreach ($actions as $action) {
          $temp["actions"][] = $allActions[$action];
        }
      } else {
        $temp["actions"] = $allActions;
      }

      $formattedPosts[] = $temp;
    }

    if (!$userCols) {
      $columns = [
        [
          "name" => "name",
          "label" => __("Title", "uipress-lite"),
          "active" => true,
        ],
        [
          "name" => "author",
          "label" => __("Author", "uipress-lite"),
          "active" => false,
        ],
        [
          "name" => "type",
          "label" => __("Type", "uipress-lite"),
          "active" => true,
        ],
        [
          "name" => "modified",
          "label" => __("Date", "uipress-lite"),
          "active" => false,
        ],
        [
          "name" => "categories",
          "label" => __("Categories", "uipress-lite"),
          "active" => true,
        ],
        [
          "name" => "tags",
          "label" => __("Tags", "uipress-lite"),
          "active" => true,
        ],
        [
          "name" => "id",
          "label" => __("ID", "uipress-lite"),
          "active" => false,
        ],
        [
          "name" => "actions",
          "label" => __("Actions", "uipress-lite"),
          "active" => true,
        ],
      ];
    } else {
      $columns = $userCols;
    }

    //Return data to app
    $returndata = [];
    $returndata["success"] = true;
    $returndata["posts"] = $formattedPosts;
    $returndata["columns"] = $columns;
    $returndata["totalPages"] = $query->max_num_pages;
    $returndata["total"] = $totalFound;
    wp_send_json($returndata);
  }

  /**
   * Returns list of posts for recebt posts blocks
   * @since 3.0.0
   */

  public function uip_get_recent_posts()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $types = json_decode(stripslashes($_POST["postTypes"]));
    $types = Sanitize::clean_input_with_code($types);

    $page = sanitize_option("page_for_posts", $_POST["page"]);
    $perPage = sanitize_option("page_for_posts", $_POST["perPage"]);
    $limitToAuthor = sanitize_text_field($_POST["limitToAuthor"]);

    $perPage = $perPage ?? 10;
    $types = is_array($types) && !empty($types) ? $types : "post";

    $args = ["perPage" => $perPage, "search" => "", "post_type" => $types, "page" => $page];
    $query = Posts::search($args, $limitToAuthor);

    $totalFound = $query->found_posts;
    $foundPosts = $query->get_posts();

    $formattedPosts = [];

    foreach ($foundPosts as $item) {
      $temp = [];

      $modified = get_the_modified_date("U", $item->ID);
      $humandate = human_time_diff($modified, strtotime(gmdate("Y-D-M"))) . " " . __("ago", "uipress-lite");
      $author_id = get_post_field("post_author", $item->ID);
      $user = get_user_by("id", $author_id);
      $username = $user->user_login;

      $post_type_obj = get_post_type_object(get_post_type($item->ID));

      $temp["name"] = get_the_title($item->ID);
      $temp["link"] = get_permalink($item->ID);
      $temp["editLink"] = get_edit_post_link($item->ID, "&");
      $temp["modified"] = $humandate;
      $temp["type"] = $post_type_obj->labels->singular_name;
      $temp["author"] = $username;
      $formattedPosts[] = $temp;
    }

    //Return data to app
    $returndata = [];
    $returndata["success"] = true;
    $returndata["posts"] = $formattedPosts;
    $returndata["totalPages"] = $query->max_num_pages;
    wp_send_json($returndata);
  }

  /**
   * Returns list of available columns for tables including meta fields
   *
   * @since 3.0.0
   */
  public function uip_get_post_table_columns()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $keys = Posts::get_meta_keys_for_post_type("post");

    $returndata["keys"] = $keys;
    wp_send_json($returndata);
  }

  /**
   * Returns list of available post types
   *
   * @since 3.0.0
   */
  public function uip_get_post_types()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $multi = false;
    $returndata = [];
    $args = [];
    $output = "objects";
    $operator = "and";

    $post_types = get_post_types($args, $output, $operator);

    $formatted = [];

    foreach ($post_types as $type) {
      $temp = [];
      $temp["name"] = $type->name;
      $temp["label"] = $type->labels->singular_name;

      $formatted[] = $temp;
    }

    $returndata["postTypes"] = $formatted;

    wp_send_json($returndata);
  }

  /**
   * Returns list of roles and users
   *
   * @since 3.0.0
   */
  public function uip_get_users_and_roles()
  {
    // Check security nonce and 'DOING_AJAX' global
    Ajax::check_referer();

    $term = sanitize_text_field($_POST["searchString"]);
    $page = isset($_POST["page"]) ? sanitize_text_field($_POST["page"]) : 1;

    $users = Users::get_users($term, $page);
    $roles = Users::get_roles($term);

    $returndata["success"] = true;
    $returndata["roles"] = $roles;
    $returndata["users"] = $users["users"];
    $returndata["total_users"] = $users["total"];

    wp_send_json($returndata);
  }
}
