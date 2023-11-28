<?php
/*
Plugin Name: UiPress Lite
Plugin URI: https://uipress.co
Description: UiPress is an all in one solution for tailoring your WordPress admin. From custom dashboards, profile pages to entire admin frameworks, the uiBuilder can do it all. Pre-made intuitive blocks and a library of professional templates make it super easy to transform the way your site users interact with your content.
Version: 3.3.094
Author: Admin 2020
Text Domain: uipress-lite
Domain Path: /languages/
*/

// If this file is called directly, abort.
!defined("ABSPATH") ? exit() : "";

define("uip_plugin_version", "3.3.094");
define("uip_plugin_name", "UiPress Lite");
define("uip_plugin_path_name", "uipress-lite");
define("uip_plugin_shortname", "uip");
define("uip_plugin_path", plugin_dir_path(__FILE__));

require uip_plugin_path . "admin/vendor/autoload.php";
require uip_plugin_path . "admin/uipress-compiler.php";

$uipress = new uipress_compiler();
$uipress->run();
