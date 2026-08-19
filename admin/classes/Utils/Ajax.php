<?php
namespace UipressLite\Classes\Utils;

!defined("ABSPATH") ? exit() : "";

class Ajax
{
  /**
   * Checks whether ajax is running, validates the security nonce, and optionally verifies capability
   *
   * @param string|null $capability Optional capability required to perform the action
   * @return void
   * @since 3.2.13
   */
  public static function check_referer($capability = null)
  {
    $doingAjax = defined("DOING_AJAX") && DOING_AJAX ? true : false;
    $referer = check_ajax_referer("uip-security-nonce", "security") > 0 ? true : false;
    $result = $doingAjax && $referer ? true : false;

    // Abort if not doing ajax or bad referer
    if (!$result) {
      $message = __("Unable to perform action", "uipress-lite");
      self::error($message);
    }

    // Abort if a capability was required and the current user does not have it
    if ($capability && !current_user_can($capability)) {
      self::error(__("You do not have permission to perform this action", "uipress-lite"));
    }
  }

  /**
   * Rate limits an action for the current user
   *
   * @param string $action Action identifier
   * @param int    $max    Maximum attempts in the window
   * @param int    $window Window length in seconds
   * @return void
   * @since 3.5.11
   */
  public static function rate_limit($action, $max = 5, $window = 900)
  {
    $user_id = get_current_user_id();
    $key = "uip_rl_" . sanitize_key($action) . "_" . $user_id;
    $count = (int) get_transient($key);

    if ($count >= $max) {
      self::error(__("Too many requests. Please try again later.", "uipress-lite"));
    }

    set_transient($key, $count + 1, $window);
  }

  /**
   * Returns a new error to the application and kills the process
   *
   * @param string $message - the message to display
   * @return void
   * @since 3.2.13
   */
  public static function error(string $message)
  {
    $returndata["error"] = true;
    $returndata["message"] = $message;
    wp_send_json($returndata);
  }
}
