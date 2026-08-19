<?php
namespace UipressLite\Classes\Utils;

!defined("ABSPATH") ? exit() : "";

class URL
{
  /**
   * Returns whether a remote URL is safe to request (blocks private/loopback hosts)
   *
   * @param string $url URL to validate
   * @return bool
   * @since 3.5.11
   */
  public static function is_safe_remote_url($url)
  {
    $url = esc_url_raw($url);
    $parts = wp_parse_url($url);

    if (empty($parts["scheme"]) || empty($parts["host"])) {
      return false;
    }

    if (!in_array($parts["scheme"], ["http", "https"], true)) {
      return false;
    }

    $host = strtolower($parts["host"]);
    if (in_array($host, ["localhost", "127.0.0.1", "::1", "0.0.0.0"], true)) {
      return false;
    }

    if (preg_match("/\.(local|internal|localhost|lan|home)$/", $host)) {
      return false;
    }

    $ips = [];
    if (filter_var($host, FILTER_VALIDATE_IP)) {
      $ips[] = $host;
    } else {
      $resolved = gethostbynamel($host);
      if (is_array($resolved)) {
        $ips = $resolved;
      }
    }

    foreach ($ips as $ip) {
      if (self::is_private_ip($ip)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Returns whether an IP address is private, reserved, or link-local
   *
   * @param string $ip IPv4 or IPv6 address
   * @return bool
   * @since 3.5.11
   */
  private static function is_private_ip($ip)
  {
    return false === filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE);
  }

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
