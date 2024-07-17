=== UiPress lite | Effortless custom dashboards, admin themes and pages ===
Contributors: uipress
Tags: admin theme, custom dashboard, google analytics, woocommerce analytics, white label
Requires at least: 6.0
Requires PHP: 7.4
Tested up to: 6.6
Stable tag: 3.4.07
License: GPLv2 or later

Effortless custom WordPress admin dashboards.

== Description ==

A block based visual builder for the WordPress admin. Create admin pages, dashboards and WordPress admin themes with no code. From custom dashboards, profile pages to entire admin frameworks, the uiBuilder can do it all. Pre-made intuitive blocks and a library of professional templates make it super easy to transform the way your site users interact with your content.

### Major features in ui press lite include:

* A fast, modern and intuitive block based builder
* Create functional admin pages and ui templates
* Fully responsive templates
* Developer friendly with an extendable API
* Custom forms that can do anything, whether it be sending emails, passing form data to functions or saving the data to site options or user meta, UiPress has you covered.
* Global styles system
* Smart patterns for saving out templates and updating across all your templates
* Over 50+ blocks and counting
* Custom login pages
* Google analytics
* Woocommerce analytics
* User role editor
* Private user posts and media
* Integrated php error log


### A powerful builder that lets you customise everything

With the uiBuilder you are in control, it's easy to use, lightning fast and packed full of features. Creating custom admin pages and UI frameworks that go beyond just the visual has never been so easy.

## Forms that go the extra mile

The form block allows you to create and customise unique forms for any purpose. Whether it be sending emails, passing form data to functions or saving the data to site options or user meta, UiPress has you covered.

## Beautiful login pages

Modernise the login experience for your site users with the ui press login page settings. Match the login page to your brand for a smooth user experience.

## The uiBuilder is a modern web app and is built with Vue.js

UiPress has countless options and customisations built in including the option to override block templates. For those that want to go further we have a well documented and easy to use API for creating custom blocks, options and more.

== Installation ==

Upload the UiPress plugin to your blog, activate it, and then navigate to the uiBuilder page (admin menu > settings > uipress).

1, 2, 3: You're done!

== Changelog ==

= 3.4.07 =
* Release Date 17 July 2024*

* Security patch on duplicate template function that could allow sql injection
* Changed all date functions to gmdate
* Changed all json_encode functions to wp_json_encode
* Updated error log parsing to use WP_Filesystem 

= 3.4.06 =
* Release Date 19 June 2024*

* Fixed issue code editor not showing for HTML block / iframe etc
* Fixed issue code editor not showing for interactions

= 3.4.05 =
* Release Date 19 June 2024*

* Fixed issue with script loadings that could cause cors issues in frame

= 3.4.04 =
* Release Date 18 June 2024*

* Fixed issue with elementor not loading when accessed directly
* Fixed issue with dark mode
* Fixed issue that could cause a blank screen

= 3.4.03 =
* Release Date 17 June 2024*

* Fixed issues with some pages not correctly rendering when dynamic loading is disabled
* Fixed issue with special synbols in site data that could cause uipress to fail to load
* Fixed issue with toolbar items select in builder
* Fixed icon issue with border designer
* Fixed issue with gradient designer

= 3.4.01 =
* Release Date 12 June 2024*

* Fixed issue with toolbar sub items not displaying
* Added empty template list placeholder
* Fixed issue with switch toggles
* Fixed issue with code editor on template settings not displaying
* Fixed issue with older non supported blocks displaying as pro options

= 3.4.0 =
* Release Date 11 June 2024*

* Fixed potential error from undefined index in menu items
* Removed icon font and replaced with SVGS
* Refactored, compiled and split all JS into chunks
* Huge speed improvements accross the whole plugin
* Stability fixes and other bug fixes

= 3.3.101 =
* Release Date 20 May 2024*

* Fixed potential fatal with iconv being undefined
* Fixed issue with failed JSON parses causing app to crash
* Fixed issue with new tab link clicks in drilldown menu
* Date dynamic now respects current site language
* Fixed issue with post type select
* Fixed issue with menu names in custom menus
* Updated loading logic and removed opacity transition

= 3.3.1 =
* Release Date 14 February 2024*

* Fixed issue with disabling uipress on specific pages
* Fixed issue with ACSS tabs
* Fixed issue with remote sync
* Added fix for admin pages as sub menu pages
* Moved screen, help and other content block settings to global template settings
* Updated method for iframe detection allowing for 50% faster page load speeds and less conflicts
* Fixed toolbar items id on frontend
* Added tab index to button for accessibility 
* Added new interactions API
* Added enhanced block conditions
* Fixed choice select update method
* Added new dedicated licence manager to the site settings

= 3.3.094 =
*Release Date 28 November 2023*

* Fixed issue with toolbars showing on subsites
* Fixed issue with cap application on install
* Fixed issue with paragraph input not updating input on block change
* Fixed issue with adding admin pages as submenus of other admin pages
* Added style fixes for: Wicked folders, Groundhogg, Gutenburg dark mode panels, Table text colours
* Fixed input validation on paragraph input
* Fixed media library blank screen bug


For older changelog entries, please see https://uipress.co/uipresschangelog/

To see uncompiled code see: https://github.com/wpuipress/uipress-lite


== Screenshots ==

1. Customise everything in the admin

2. An overview of the builder

3. An image showing the mobile preview in the builder

4. A view of the plugin area with a custom ui template active

