<?php
namespace UipressLite\Classes\Utils;

!defined("ABSPATH") ? exit() : "";

class URL
{
  /**
   * Returns the current URL
   *
   * @return string
   * @since 3.2.13
   */
  public static function current()
  {
    //Clean input
    $uri = sanitize_url($_SERVER["REQUEST_URI"]);
    $host_s = "";
    if (isset($_SERVER["HTTPS"])) {
      $host_s = sanitize_url($_SERVER["HTTPS"]);
    }
    $port = "";
    if (isset($_SERVER["SERVER_PORT"])) {
      $port = sanitize_url($_SERVER["SERVER_PORT"]);
    }
    $http_host = "";
    if (isset($_SERVER["HTTP_HOST"])) {
      $http_host = sanitize_url($_SERVER["HTTP_HOST"]);
    }

    //Build protocol
    $protocol = (!empty($host_s) && $host_s != "off") || $port == 443 ? "https://" : "http://";
    $url = $protocol . $http_host . $uri;

    return $url;
  }

  /**
   * Converts string to url safe slug
   *
   * @since 3.0.0
   * Credit: from https://stackoverflow.com/questions/2955251/php-function-to-make-slug-url-string
   */
  public static function urlSafe($text, $divider = "-")
  {
    // replace non letter or digits by divider
    $text = preg_replace("~[^\pL\d]+~u", $divider, $text);

    // transliterate
    $text = function_exists("iconv") ? iconv("utf-8", "us-ascii//TRANSLIT", $text) : $text;

    // remove unwanted characters
    $text = preg_replace("~[^-\w]+~", "", $text);

    // trim
    $text = trim($text, $divider);

    // remove duplicate divider
    $text = preg_replace("~-+~", $divider, $text);

    // lowercase
    $text = strtolower($text);

    if (empty($text)) {
      return "n-a";
    }

    return $text;
  }
}
