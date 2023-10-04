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
    $userid = get_current_user_id();
    $userPreferences = get_user_meta($userid, 'uip-prefs', true);

    // If key was not defined, return all prefs
    if (!isset($key)) {
      return $userPreferences;
    }

    // key doesn't exist in prefs
    if (!isset($userPreferences[$key])) {
      return false;
    }

    $currentValue = $userPreferences[$key] ? $userPreferences[$key] : false;

    if ($currentValue === 'uiptrue') {
      $currentValue = true;
    }
    if ($currentValue === 'uipfalse') {
      $currentValue = false;
    }

    return $currentValue;
  }
}
