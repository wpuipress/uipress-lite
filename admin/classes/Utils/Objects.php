<?php
namespace UipressLite\Classes\Utils;

!defined('ABSPATH') ? exit() : '';

class Objects
{
  /**
   * Ensure that the specified nested structure exists within the settings array.
   *
   * Iterates through each key specified in `$keys`, checking for the existence of
   * each key within the nested structure of `$settings`. If a key does not exist,
   * it creates a new stdClass object at that level of the structure.
   *
   * @param stdClass[] &$settings Reference to the settings array to check and modify.
   * @param string[]   $keys An array of keys specifying the nested structure to ensure.
   *
   * @return void
   */
  public static function ensureNested(&$settings, $keys)
  {
    $currentLevel = &$settings;
    foreach ($keys as $key) {
      if (!isset($currentLevel->$key)) {
        $currentLevel->$key = new \stdClass();
      }
      $currentLevel = &$currentLevel->$key;
    }
  }
}
