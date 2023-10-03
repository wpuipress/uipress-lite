<?php
namespace UipressLite\Classes\Utils;

!defined('ABSPATH') ? exit() : '';

class Ajax
{
  /**
   * Checks whether ajax is running as well as checking the security nonce
   *
   * @return Boolean
   * @since 3.2.13
   */
  public static function check_referer()
  {
    $doingAjax = defined('DOING_AJAX') && DOING_AJAX ? true : false;
    $referer = check_ajax_referer('uip-security-nonce', 'security') > 0 ? true : false;
    $result = $doingAjax && $referer ? true : false;
    return $result;
  }
}
