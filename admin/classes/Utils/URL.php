<?php
namespace UipressLite\Classes\Utils;

!defined('ABSPATH') ? exit() : '';

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
    $uri = sanitize_url($_SERVER['REQUEST_URI']);
    $host_s = '';
    if (isset($_SERVER['HTTPS'])) {
      $host_s = sanitize_url($_SERVER['HTTPS']);
    }
    $port = '';
    if (isset($_SERVER['SERVER_PORT'])) {
      $port = sanitize_url($_SERVER['SERVER_PORT']);
    }
    $http_host = '';
    if (isset($_SERVER['HTTP_HOST'])) {
      $http_host = sanitize_url($_SERVER['HTTP_HOST']);
    }

    //Build protocol
    $protocol = (!empty($host_s) && $host_s != 'off') || $port == 443 ? 'https://' : 'http://';
    $url = $protocol . $http_host . $uri;

    return $url;
  }
}
