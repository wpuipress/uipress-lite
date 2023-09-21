<?php
/*
Plugin Name: UiPress Lite
Plugin URI: https://uipress.co
Description: UiPress is an all in one solution for tailoring your WordPress admin. From custom dashboards, profile pages to entire admin frameworks, the uiBuilder can do it all. Pre-made intuitive blocks and a library of professional templates make it super easy to transform the way your site users interact with your content.
Version: 3.2.12
Author: Admin 2020
Text Domain: uipress-lite
Domain Path: /languages/
*/

// If this file is called directly, abort.
if (!defined('ABSPATH')) {
  exit();
}

define('uip_plugin_version', '3.2.12');
define('uip_plugin_name', 'UiPress Lite');
define('uip_plugin_path_name', 'uipress-lite');
define('uip_plugin_shortname', 'uip');
define('uip_plugin_url', plugin_dir_url(__FILE__));
define('uip_plugin_path', plugin_dir_path(__FILE__));

require uip_plugin_path . 'admin/uipress-compiler.php';

$uipress = new uipress_compiler();
$uipress->run();

//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);
