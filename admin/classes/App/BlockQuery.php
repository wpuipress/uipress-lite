<?php
namespace UipressLite\Classes\App;

!defined("ABSPATH") ? exit() : "";

class BlockQuery
{
  /**
   * Runs main block query
   *
   * @return array
   * @since 3.2.13
   */
  public static function run($query, $blockString, $page, $search)
  {
    $queryArgs = self::build_query($query, $page, $search);

    // Post type query
    if ($query->type == "post") {
      $postQuery = new \WP_Query($queryArgs);
      $totalFound = $postQuery->found_posts;
      $foundPosts = $postQuery->get_posts();
      $totalPages = $postQuery->max_num_pages;
    }

    // User type query
    if ($query->type == "user") {
      $userQuery = new \WP_User_Query($queryArgs);
      $totalFound = $userQuery->get_total();
      $foundPosts = $userQuery->get_results();
      $totalPages = ceil($totalFound / $query->perPage);
    }

    // Site (subsite) based query
    if ($query->type == "site") {
      $siteQuery = new \WP_Site_Query($queryArgs);
      $totalFound = $siteQuery->found_sites;
      $foundPosts = $siteQuery->get_sites();
      $totalPages = ceil($totalFound / $query->perPage);
    }

    $pattern = "/{{(.*?)}}/";
    preg_match_all($pattern, $blockString, $matches);

    $matchDynamic = $matches[0];
    $matchValues = $matches[1];

    $formattedVars = [];
    // Loop through query
    foreach ($foundPosts as $item) {
      // Update users lists
      if ($query->type == "user") {
        $allUsers[] = $item->data;
        $item = $item->data;
      }

      // Update sites list
      if ($query->type == "site") {
        $item->ID = $item->blog_id;
        $allSites[] = $item;
      }

      $formattedMatches = [];
      //Loop matches for relevant content
      if (is_array($matchValues)) {
        foreach ($matchValues as $key => $match) {
          $temp = [];
          $temp["match"] = $matchDynamic[$key];
          $dynamic = $match;

          $temp["replace"] = self::handle_matches($dynamic, $item);
          $formattedMatches[] = $temp;
        }
      }

      $formattedVars[$item->ID] = $formattedMatches;
    }

    $returndata["items"] = [];
    $returndata["items"]["found"] = $totalFound;
    $returndata["items"]["totalPages"] = $totalPages;
    $returndata["items"]["list"] = $foundPosts;
    $returndata["items"]["matches"] = $formattedVars;

    if ($query->type == "user") {
      $returndata["items"]["list"] = $allUsers;
    }
    if ($query->type == "site") {
      $returndata["items"]["list"] = $allSites;
    }

    $returndata["success"] = true;
    $returndata["message"] = __("Query fetched", "uipress-lite");
    $returndata["args"] = $queryArgs;

    return $returndata;
  }

  /**
   * Handles dynamic match replacement
   *
   * @param string $dynamic - match key
   * @param object $item - current post object
   *
   * @return match replacement
   * @since 3.2.13
   */
  private static function handle_matches($dynamic, $item)
  {
    // Handle Meta box key
    if (strpos($dynamic, "mb_meta:") !== false) {
      $parts = explode(":", $dynamic);
      if (!isset($parts[1]) || !function_exists("rwmb_get_value")) {
        return;
      }
      $key = $parts[1];

      if ($key && $key != "") {
        return rwmb_get_value($key, [], $item->ID);
      }
    }

    // Handle acf_meta key
    if (strpos($dynamic, "acf_meta:") !== false) {
      $parts = explode(":", $dynamic);

      if (!isset($parts[1]) || !function_exists("get_field")) {
        return;
      }
      $key = $parts[1];
      if (!$key || $key == "") {
        return;
      }
      if ($query->type == "post") {
        return get_field($key, $item->ID, true);
      }
      if ($query->type == "user") {
        return get_field($key, "user_" . $item->ID, true);
      }
    }

    // Handle ACF User meta
    if (strpos($dynamic, "acf_user_meta:") !== false) {
      $parts = explode(":", $dynamic);
      if (!isset($parts[1]) || !function_exists("get_field")) {
        return;
      }
      $key = $parts[1];

      if ($key && $key != "") {
        if ($query->type == "user") {
          return get_field($key, "user_" . $item->ID, true);
        }
      }
    }

    // Handle regular meta
    if (strpos($dynamic, "meta:") !== false) {
      $parts = explode(":", $dynamic);
      if (!isset($parts[1])) {
        return;
      }
      $key = $parts[1];

      if ($key && $key != "") {
        if ($query->type == "post") {
          return get_post_meta($item->ID, $key, true);
        }
        if ($query->type == "user") {
          return get_user_meta($item->ID, $key, true);
        }
        if ($query->type == "site") {
          return get_site_meta($item->blog_id, $key, true);
        }
      }
    }

    // Standard 'post_title' key etc
    if (property_exists($item, $dynamic) && !property_exists($item, "blog_id")) {
      $replacer = $item->{$dynamic};
      if ($dynamic == "post_title") {
        return $item->post_title;
      }
      if ($dynamic == "post_date") {
        return gmdate(get_option("date_format", strtotime($replacer)));
      }
      if ($dynamic == "post_author") {
        return get_user_by("id", $replacer)->user_login;
      }
      if ($dynamic == "post_content") {
        return apply_filters("the_content", get_the_content(null, null, $item->ID));
      }
      if ($dynamic == "user_registered") {
        return gmdate(get_option("date_format", strtotime($replacer)));
      }
      if ($dynamic == "last_updated") {
        return gmdate(get_option("date_format", strtotime($replacer)));
      }
      if ($dynamic == "registered") {
        return gmdate(get_option("date_format", strtotime($replacer)));
      }
    } else {
      $replacer = "";

      if ($dynamic == "post_link") {
        return get_permalink($item->ID);
      }
      if ($dynamic == "post_edit_link") {
        return get_edit_post_link($item->ID, "&");
      }
      if ($dynamic == "post_featured_image") {
        return get_the_post_thumbnail_url($item->ID, "full");
      }
      if ($dynamic == "attachment_image") {
        return wp_get_attachment_image_url($item->ID);
      }

      if ($dynamic == "user_avatar") {
        return get_avatar_url($item->ID);
      }

      // Sites query

      if (property_exists($item, "blog_id")) {
        if ($dynamic == "site_name") {
          $current_blog_details = get_blog_details(["blog_id" => $item->blog_id]);
          return $current_blog_details->blogname;
        }
        if ($dynamic == "site_home_url") {
          return get_site_url($item->blog_id);
        }
        if ($dynamic == "site_dashboard_url") {
          return get_admin_url($item->blog_id);
        }
        if ($dynamic == "blog_id") {
          return $item->blog_id;
        }
        if ($dynamic == "registered") {
          $current_blog_details = get_blog_details(["blog_id" => $item->blog_id]);
          $registered = $current_blog_details->registered;
          $date_format = get_option("date_format");
          return $registered ? date_i18n($date_format, strtotime($registered)) : "";
        }
        if ($dynamic == "domain") {
          $current_blog_details = get_blog_details(["blog_id" => $item->blog_id]);
          return $current_blog_details->domain;
        }
        if ($dynamic == "last_updated") {
          return $wpdb->get_var($wpdb->prepare("SELECT last_updated FROM $wpdb->blogs WHERE blog_id = %d", $item->blog_id));
        }
        if ($dynamic == "path") {
          $current_blog_details = get_blog_details(["blog_id" => $item->blog_id]);
          return $current_blog_details->path;
        }
      }
    }
  }

  /**
   * Builds main query args for given block query
   *
   * @param object $query - query options from app
   * @param number $page - the current page of the query
   * @param string $search - the search for query
   *
   * @return query array
   * @since 3.2.13
   */
  private static function build_query($query, $page, $search)
  {
    if (!is_numeric($page)) {
      $page = 1;
    }

    $queryDefaults = self::return_query_defaults();

    // Merge defaults
    $query = (object) array_merge((array) $queryDefaults, (array) $query);

    if ($query->type == "post") {
      $args = [
        "post_type" => $query->postType,
        "posts_per_page" => $query->perPage,
        "paged" => $page,
        "post_status" => $query->status,
        "order" => $query->order,
        "orderby" => $query->orderBy,
      ];
      if ($search) {
        $args["s"] = $search;
      }
    }
    if ($query->type == "user" || $query->type == "site") {
      $args = [
        "number" => $query->perPage,
        "paged" => $page,
        "order" => $query->order,
        "orderby" => $query->orderBy,
        "fields" => "all",
      ];
      if ($search) {
        $args["search"] = $search;
      }

      if ($query->roles && $query->type == "user") {
        $roles = [];
        foreach ($query->roles as $role) {
          $roles[] = $role->name;
        }
        $args["role__in"] = $roles;
      }
    }

    if (property_exists($query, "offset") && $query->offset) {
      $args["offset"] = $query->offset;
    }

    if (property_exists($query, "limitToAuthor") && $query->limitToAuthor) {
      $args["author"] = get_current_user_id();
    }

    if ($query->orderBy == "meta_value") {
      $args["meta_key"] = $query->orderBykEY;
    }

    // Add meta queries
    if (property_exists($query, "metaQuery") && is_array($query->metaQuery)) {
      $args["meta_query"] = self::add_meta_query($query->metaQuery, $query->relation);
    }

    if (property_exists($query, "taxQuery") && is_array($query->taxQuery)) {
      $args["tax_query"] = self::add_tax_query($query->taxQuery, $query->taxRelation);
    }

    return $args;
  }

  /**
   * Loops through tax query and returns formatted
   *
   * @param array $taxes array of tax queries
   *
   * @return formatted query
   * @since 3.2.13
   */
  private static function add_tax_query($taxes, $relation)
  {
    $taxQuery = [];
    $taxQuery["relation"] = $relation;

    foreach ($taxes as $opt) {
      $temp = [];

      if ($opt->value == "") {
        continue;
      }

      $terms = $opt->value;
      if (strpos($opt->value, ",") !== false) {
        $parts = explode(",", $opt->value);
        $formatted = [];
        if (is_array($temp)) {
          foreach ($parts as $part) {
            $formatted[] = trim($part);
          }

          $terms = $formatted;
        }
      }

      $temp["taxonomy"] = $opt->taxonomy;
      $temp["terms"] = $terms;
      $temp["field"] = $opt->fieldType;
      $temp["include_children"] = $opt->includeChildren;
      $temp["operator"] = $opt->compare;

      $taxQuery[] = $temp;
    }

    return $taxQuery;
  }

  /**
   * Loops through meta query and returns formatted
   *
   * @param array $queries array of meta queries
   *
   * @return formatted query
   * @since 3.2.13
   */
  private static function add_meta_query($queries, $relation)
  {
    $metaQuery = [];
    $metaQuery["relation"] = $relation;

    foreach ($queries as $opt) {
      $temp = [];

      if ($opt->key == "") {
        continue;
      }
      $temp["key"] = $opt->key;
      $temp["value"] = $opt->value;
      $temp["compare"] = $opt->compare;
      $temp["type"] = $opt->type;

      $metaQuery[] = $temp;
    }

    return $metaQuery;
  }

  /**
   * Returns defaults for query
   *
   * @return array of query options
   * @since 3.2.23
   */
  private static function return_query_defaults()
  {
    return (object) [
      "postType" => "page",
      "perPage" => 20,
      "status" => "publish",
      "order" => "DESC",
      "orderBy" => "date",
    ];
  }
}
