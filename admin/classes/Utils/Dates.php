<?php
namespace UipressLite\Classes\Utils;

!defined("ABSPATH") ? exit() : "";

class Dates
{
  /**
   * Gets human readable modified date.
   *
   * @param int $postId The post ID.
   * @return string Human readable date.
   * @since 3.2.13
   */
  public static function getHumanDate(int $postId): string
  {
    $modified = get_the_modified_date("U", $postId);
    return human_time_diff($modified, strtotime(gmdate("Y-D-M"))) . " " . __("ago", "uipress-lite");
  }
}
