<?php
namespace UipressLite\Classes\Utils;

!defined('ABSPATH') ? exit() : '';

class UserPreferences
{
  /**
   * Returns the chosen key from the uip user prefs
   *
   * @return Mixed
   * @since 3.2.13
   */
  public static function get($key = null)
  {
    $currentValue = false;
    $userid = get_current_user_id();
    $current = get_user_meta($userid, 'uip-prefs', true);

    // If key was not defined, return all prefs
    if (!isset($key)) {
      return $current;
    }

    $currentValue = isset($current[$key]) ? $current[$key] : false;

    if ($currentValue == 'uiptrue') {
      $currentValue = true;
    }
    if ($currentValue == 'uipfalse') {
      $currentValue = false;
    }
    return $currentValue;
  }
}
