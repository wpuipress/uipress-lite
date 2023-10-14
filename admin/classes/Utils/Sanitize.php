<?php
namespace UipressLite\Classes\Utils;

!defined('ABSPATH') ? exit() : '';

class Sanitize
{
  /**
   * Sanitises and strips tags of input from user without losing code
   *
   * @param mixed $values - input value to clean
   * @return mixed - returns cleaned input value
   * @since 3.2.13
   */
  public static function clean_input_with_code($values)
  {
    $allowedposttags = self::get_allowed_tags();

    if (is_object($values)) {
      $values = self::clean_object($values, $allowedposttags);
    } elseif (is_array($values)) {
      $values = self::clean_array($values, $allowedposttags);
    } else {
      $values = self::clean_value($values, $allowedposttags);
    }

    return $values;
  }
  /**
   * Returns list of allowed attributes for wp_kses
   *
   * @return Array
   * @since 3.2.13
   */
  private static function return_allowed_attributes()
  {
    return [
      'align' => [],
      'class' => [],
      'data' => [],
      'type' => [],
      'id' => [],
      'dir' => [],
      'lang' => [],
      'style' => [],
      'xml:lang' => [],
      'src' => [],
      'alt' => [],
      'href' => [],
      'rel' => [],
      'rev' => [],
      'data-plop' => [],
      'target' => [],
      'novalidate' => [],
      'type' => [],
      'value' => [],
      'name' => [],
      'tabindex' => [],
      'action' => [],
      'method' => [],
      'for' => [],
      'width' => [],
      'height' => [],
      'data' => [],
      'title' => [],
      'script' => [],
      'data-theme' => [],
      'data-height' => [],
      'crossorigin' => [],
    ];
  }

  /**
   * Returns list of allowed attributes for
   *
   * @return Array
   * @since 3.2.13
   */
  private static function get_allowed_tags()
  {
    $allowed_atts = self::return_allowed_attributes();
    global $allowedposttags;
    $allowedposttags['data'] = $allowed_atts;
    $allowedposttags['form'] = $allowed_atts;
    $allowedposttags['label'] = $allowed_atts;
    $allowedposttags['input'] = $allowed_atts;
    $allowedposttags['textarea'] = $allowed_atts;
    $allowedposttags['iframe'] = $allowed_atts;
    $allowedposttags['script'] = $allowed_atts;
    $allowedposttags['style'] = $allowed_atts;
    $allowedposttags['strong'] = $allowed_atts;
    $allowedposttags['small'] = $allowed_atts;
    $allowedposttags['table'] = $allowed_atts;
    $allowedposttags['span'] = $allowed_atts;
    $allowedposttags['abbr'] = $allowed_atts;
    $allowedposttags['code'] = $allowed_atts;
    $allowedposttags['pre'] = $allowed_atts;
    $allowedposttags['div'] = $allowed_atts;
    $allowedposttags['img'] = $allowed_atts;
    $allowedposttags['h1'] = $allowed_atts;
    $allowedposttags['h2'] = $allowed_atts;
    $allowedposttags['h3'] = $allowed_atts;
    $allowedposttags['h4'] = $allowed_atts;
    $allowedposttags['h5'] = $allowed_atts;
    $allowedposttags['h6'] = $allowed_atts;
    $allowedposttags['ol'] = $allowed_atts;
    $allowedposttags['ul'] = $allowed_atts;
    $allowedposttags['li'] = $allowed_atts;
    $allowedposttags['em'] = $allowed_atts;
    $allowedposttags['hr'] = $allowed_atts;
    $allowedposttags['br'] = $allowed_atts;
    $allowedposttags['tr'] = $allowed_atts;
    $allowedposttags['td'] = $allowed_atts;
    $allowedposttags['p'] = $allowed_atts;
    $allowedposttags['a'] = $allowed_atts;
    $allowedposttags['b'] = $allowed_atts;
    $allowedposttags['i'] = $allowed_atts;
    $allowedposttags['link'] = $allowed_atts;
    $allowedposttags['source'] = $allowed_atts;
    return $allowedposttags;
  }

  /**
   * Clean properties of an object recursively.
   *
   * @param object $object          Object to clean.
   * @param array  $allowedposttags Allowed tags for `wp_kses`.
   *
   * @return object Cleaned object.
   * @since 3.2.13
   */
  private static function clean_object($object, $allowedposttags)
  {
    foreach ($object as $index => $in) {
      $object->$index = self::determine_and_clean($in, $allowedposttags);
    }
    return $object;
  }

  /**
   * Clean elements of an array recursively.
   *
   * @param array $array            Array to clean.
   * @param array $allowedposttags  Allowed tags for `wp_kses`.
   *
   * @return array Cleaned array.
   * @since 3.2.13
   */
  private static function clean_array($array, $allowedposttags)
  {
    foreach ($array as $index => $in) {
      $array[$index] = self::determine_and_clean($in, $allowedposttags);
    }
    return $array;
  }

  /**
   * Determine the type of the input and dispatch to the appropriate cleaning method.
   *
   * @param mixed $input            Input to clean.
   * @param array $allowedposttags  Allowed tags for `wp_kses`.
   *
   * @return mixed Cleaned input.
   * @since 3.2.13
   */
  private static function determine_and_clean($input, $allowedposttags)
  {
    if (is_object($input)) {
      return self::clean_object($input, $allowedposttags);
    } elseif (is_array($input)) {
      return self::clean_array($input, $allowedposttags);
    } else {
      return self::clean_value($input, $allowedposttags);
    }
  }

  /**
   * Clean a single value using `wp_kses`.
   *
   * @param mixed $value            Value to clean.
   * @param array $allowedposttags  Allowed tags for `wp_kses`.
   *
   * @return mixed Cleaned value.
   * @since 3.2.13
   */
  private static function clean_value($value, $allowedposttags)
  {
    return $value && !is_null($value) ? wp_kses($value, $allowedposttags) : $value;
  }
}
