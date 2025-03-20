<?php
namespace UipressLite\Classes\Rest;

// Prevent direct access to this file
defined("ABSPATH") || exit();

/**
 * Class MultisiteTemplateHandler
 *
 * Handles uipress content fetching for multisite subsites using hooks
 * Supports both uip-ui-template and uip-admin-menu post types
 */
class MultisiteTemplateHandler
{
  /**
   * Track if we're currently in a switched state
   */
  private static $switched = false;

  /**
   * Track main site ID
   */
  private static $main_site_id = null;

  /**
   * Track main site ID
   */
  private static $current_site_id = null;

  /**
   * Constructor - registers hooks
   */
  public function __construct()
  {
    // Only register hooks if we're on a multisite subsite
    if (is_multisite() && !is_main_site()) {
      // Store main site ID
      self::$main_site_id = get_main_site_id();

      // Store $current_site_id
      self::$current_site_id = get_current_blog_id();

      // Hook before the query runs for REST requests
      add_filter("rest_pre_dispatch", [$this, "maybe_switch_to_main_site"], 10, 3);

      // Hook after the query runs to restore the site
      add_filter("rest_request_after_callbacks", [$this, "maybe_restore_current_site"], 10, 3);
    }
  }

  /**
   * Check if this is a template request and switch to main site if needed
   *
   * @param mixed $result Response to replace the requested version with
   * @param WP_REST_Server $server Server instance
   * @param WP_REST_Request $request Request used to generate the response
   * @return mixed The original result (we're just using this filter as a hook)
   */
  public function maybe_switch_to_main_site($result, $server, $request)
  {
    // Check if this is a uip-ui-template endpoint
    $route = $request->get_route();

    // Handle both uip-ui-template and uip-admin-menu endpoints
    if (strpos($route, "/wp/v2/uip-ui-template") === 0 || strpos($route, "/wp/v2/uip-admin-menu") === 0) {
      // Switch to the main site
      switch_to_blog(self::$main_site_id);
      self::$switched = true;
    }

    return $result;
  }

  /**
   * Restore to the current site after the request is processed
   *
   * @param mixed $result Response to be returned
   * @param WP_REST_Server $server Server instance
   * @param WP_REST_Request $request Request used to generate the response
   * @return mixed The original result (unmodified)
   */
  public function maybe_restore_current_site($result, $server, $request)
  {
    // If we switched to the main site, restore the current site
    if (self::$switched) {
      switch_to_blog(self::$current_site_id);
      self::$switched = false;
    }

    return $result;
  }
}
