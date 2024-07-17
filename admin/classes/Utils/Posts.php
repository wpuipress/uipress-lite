<?php
namespace UipressLite\Classes\Utils;

!defined("ABSPATH") ? exit() : "";

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
  public static function search(array $options, $limitToAuthor = false)
  {
    $defaults = ["perPage" => 10, "search" => "", "post_type" => "any", "page" => 1];
    $defaults = array_merge($defaults, $options);

    //Get template
    $args = [
      "post_type" => $defaults["post_type"],
      "s" => $defaults["search"],
      "paged" => $defaults["page"],
      "posts_per_page" => $defaults["per_page"],
    ];

    // Limit results to current user
    if ($limitToAuthor == "true") {
      $args["author"] = get_current_user_id();
    }

    $query = new \WP_Query($args);
    return $query;
  }

  /**
   * Insert post meta with prepared statements
   *
   * @param int $new_post_id The ID of the new post
   * @param array $post_meta_infos Array of meta information
   */
  public static function insert_post_meta($new_post_id, $post_meta_infos)
  {
    global $wpdb;

    if (empty($post_meta_infos)) {
      return;
    }

    $values = [];
    $place_holders = [];
    $query = "INSERT INTO $wpdb->postmeta (post_id, meta_key, meta_value) VALUES ";

    foreach ($post_meta_infos as $meta_info) {
      $meta_key = $meta_info->meta_key;
      if ($meta_key === "_wp_old_slug") {
        continue;
      }
      $meta_value = $meta_info->meta_value;
      array_push($values, $new_post_id, $meta_key, $meta_value);
      $place_holders[] = "(%d, %s, %s)";
    }

    $query .= implode(", ", $place_holders);

    $prepared_query = $wpdb->prepare($query, $values);
    $wpdb->query($prepared_query);
  }

  /**
   * Duplicates a post and its meta.
   *
   * @param int $postID The ID of the post to duplicate.
   * @return WP_Post|false The copied post object on success, false on failure.
   * @throws Exception If there is an error during duplication.
   * @since 3.2.13
   */
  public static function duplicate($postID)
  {
    // Sanitize and validate input
    $postID = absint($postID);
    if (!$postID || !get_post_status($postID)) {
      return false;
    }
    global $wpdb;
    $post = get_post($postID);
    $args = [
      "comment_status" => $post->comment_status,
      "ping_status" => $post->ping_status,
      "post_author" => get_current_user_id(),
      "post_content" => $post->post_content,
      "post_excerpt" => $post->post_excerpt,
      "post_name" => $post->post_name,
      "post_parent" => $post->post_parent,
      "post_password" => $post->post_password,
      "post_status" => "draft",
      "post_title" => $post->post_title . " (" . __("copy", "uipress-pro") . ")",
      "post_type" => $post->post_type,
      "to_ping" => $post->to_ping,
      "menu_order" => $post->menu_order,
    ];
    $new_post_id = wp_insert_post($args);
    if (!$new_post_id) {
      return false;
    }
    $taxonomies = get_object_taxonomies($post->post_type);
    foreach ($taxonomies as $taxonomy) {
      $post_terms = wp_get_object_terms($postID, $taxonomy, ["fields" => "slugs"]);
      wp_set_object_terms($new_post_id, $post_terms, $taxonomy, false);
    }

    // Fetch post meta
    $post_meta_infos = $wpdb->get_results($wpdb->prepare("SELECT meta_key, meta_value FROM $wpdb->postmeta WHERE post_id = %d", $postID));

    // Insert post meta
    self::insert_post_meta($new_post_id, $post_meta_infos);

    // Get the newly copied post.
    return get_post($new_post_id);
  }

  /**
   * Central function for retrieving global meta keys for post type
   *
   * @param string $post_type - name of post type
   * @since 3.0.0
   */
  public static function get_meta_keys_for_post_type($post_type)
  {
    $args = [];

    $output = "objects";
    $operator = "and";

    $post_types = get_post_types($args, $output, $operator);

    $formatted = [];
    $meta_keys = [];

    // Loop through post types and get meta keys
    foreach ($post_types as $type) {
      $posts = get_posts(["post_type" => $type->name, "limit" => 1]);

      foreach ($posts as $post) {
        $post_meta_keys = get_post_custom_keys($post->ID);
        if ($post_meta_keys) {
          $meta_keys = array_merge($meta_keys, $post_meta_keys);
        }
      }
    }
    $foundColumns = array_values(array_unique($meta_keys));
    $defaultColumns = $this->get_default_columns();
    $formatted = [];

    foreach ($foundColumns as $col) {
      //Keep uipress meta keys out of list
      if (strpos($col, "uip-") === false) {
        $temp = [];
        $temp["name"] = $col;
        $temp["label"] = $col;
        $temp["active"] = true;
        $temp["type"] = "meta";
        $formatted[$col] = $temp;
      }
    }

    $allColumns = array_merge($defaultColumns, $formatted);

    return $allColumns;
  }
}
