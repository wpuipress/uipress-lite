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

  /**
   * Safely retrieve nested property from an object.
   *
   * @param object $object The base object.
   * @param array  $keys   An array of keys in the order to access nested property.
   *
   * @return mixed The value of the nested property or null if not found.
   */
  public static function get_nested_property($object, array $keys)
  {
    foreach ($keys as $key) {
      if (!is_object($object) || !property_exists($object, $key)) {
        return false;
      }
      $object = $object->$key;
    }
    return $object;
  }
}
