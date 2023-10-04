<?php
namespace UipressLite\Classes\Utils;

!defined('ABSPATH') ? exit() : '';

class Posts
{
  /**
   * Searches posts and returns query
   *
   * @param Array $options query options
   *
   * @return Object wp_query
   * @since 3.2.13
   */
  public static function search(array $options)
  {
    $defaults = ['perPage' => 10, 'search' => '', 'post_type' => 'any'];
    $defaults = [...$options, ...$defaults];

    //Get template
    $args = [
      'post_type' => $options['post_type'],
      's' => $options['search'],
      'posts_per_page' => $options['per_page'],
    ];

    $query = new \WP_Query($args);
    return $query;
  }
  /**
   * Duplicates a post and it's meta.
   *
   * @param int $postID The ID of the post to duplicate.
   * @return WP_Post|false The copied post object on success, false on failure.
   * @throws Exception If there is an error during duplication.
   * @since 3.2.13
   */
  public static function duplicate($postID)
  {
    // No id or post doesn't exist so exit
    if (!$postID || !get_post_status($postID)) {
      return false;
    }

    global $wpdb;
    $post = get_post($postID);

    $args = [
      'comment_status' => $post->comment_status,
      'ping_status' => $post->ping_status,
      'post_author' => get_current_user_id(),
      'post_content' => $post->post_content,
      'post_excerpt' => $post->post_excerpt,
      'post_name' => $post->post_name,
      'post_parent' => $post->post_parent,
      'post_password' => $post->post_password,
      'post_status' => 'draft',
      'post_title' => $post->post_title . ' (' . __('copy', 'uipress-pro') . ')',
      'post_type' => $post->post_type,
      'to_ping' => $post->to_ping,
      'menu_order' => $post->menu_order,
    ];

    $new_post_id = wp_insert_post($args);

    if (!$new_post_id) {
      return false;
    }

    $taxonomies = get_object_taxonomies($post->post_type);

    foreach ($taxonomies as $taxonomy) {
      $post_terms = wp_get_object_terms($postID, $taxonomy, ['fields' => 'slugs']);
      wp_set_object_terms($new_post_id, $post_terms, $taxonomy, false);
    }

    $post_meta_infos = $wpdb->get_results("SELECT meta_key, meta_value FROM $wpdb->postmeta WHERE post_id=$postID");
    if (count($post_meta_infos) != 0) {
      $sql_query = "INSERT INTO $wpdb->postmeta (post_id, meta_key, meta_value) ";
      foreach ($post_meta_infos as $meta_info) {
        $meta_key = $meta_info->meta_key;
        if ($meta_key == '_wp_old_slug') {
          continue;
        }
        $meta_value = addslashes($meta_info->meta_value);
        $sql_query_sel[] = "SELECT $new_post_id, '$meta_key', '$meta_value'";
      }

      $sql_query .= implode(' UNION ALL ', $sql_query_sel);
      $wpdb->query($sql_query);
    }

    // Get the newly copied post.
    return get_post($new_post_id);
  }
}