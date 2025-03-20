=== UiPress lite | Effortless custom dashboards, admin themes and pages ===
Contributors: markuipress
Tags: admin theme, custom dashboard, google analytics, woocommerce analytics, white label
Requires at least: 6.0
Requires PHP: 7.4
Tested up to: 6.7
Stable tag: 3.5.07
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

= 3.5.07 =
* Release Date 20 March 2025*

* Fixed uncaught error on php error log viewer
* Fixed issue on multisite that could cause blogs to switch to main site for new post links etc and other issues.
* Fixed issue with custom menus where custom menu items were not being added to the menu
* Fixed issue where admin toolbar items wouldn't always show on hover

= 3.5.06 =
* Release Date 18 March 2025*

* Fixed broken icons on default toolbar on frontend
* Added forced overflow auto to page content block
* Fixed issue with uiPress network activated wouldn't detect the pro plugin 
* Fixed issue that could stop subsites loading active templates on multisite
* Fixed issue that could stop subsites loading active menus on multisite
* Fixed issue that could stop licence key activation and other pro features from show on multisite

= 3.5.05 =
* Release Date 03 March 2025*

* Fixed issue with menu icons that could render old icon behind updated one.
* Fixed issue that could cause whiteouts on subsites without access to the mainsite
* Fixed issue with acf headers showing unwanted text
* Fixed z-index issue on the block editor
* Fixed fullscreen toggle
* Added style fixes for gravity forms
* Removed form save as site option to enhance security
* Fixed issue with custom styles not loading on frontend
* Fixed issue with dark styles not applying

= 3.5.04 =
* Release Date 20 February 2025*

* Fixed issue where menu collapsed styles were not working correctly in Safari browser
* Fixed issue where dropdowns were not showing in the uiBuilder when no active template was applied
* Fixed issue that could cause subsites on multisite to 404
* Fixed alignment issue with admin menu icons
* Updated templates cache key to better handle multisite enviroments and user switching

= 3.5.03 =
* Release Date 19 February 2025*

* Ammended form submission data (saving as site option) For data saved as a site option is now prepended with 'uip_form_' to prevent possible security breaches.
* Fixed toolbar issue with fluentCRM
* Fixed conflicts with mainwp in the menu and visually issues
* Fixed a potential issue with content folders when loaded too early could cause a plugin conflict.
* Fixed issue where when custom menus were active, the active menu item was never set

= 3.5.02 =
* Release Date 18 February 2025*

* Fixed issue where top left menu would not display in the builder when no active template was set
* Fixed issue where some links became missing from custom admin menus and or links could fail to work
* Fixed issue that could cause a fatal with undefined constant
* Fixed issue on multisite where all available roles were not showing in the role select.

= 3.5.01 =
* Release Date 17 February 2025*

* Fixed issue where custom frontend toolbars could cause style conflicts on front of site.
* Added fix for uipress templates being unable to find stylesheets (could cause whiteout)
* Fixed layout issue on media page
* Fixed issue with roles output that could cause a white out screen

= 3.5.00 =
* Release Date 12 February 2025*

* Refactored app to move away from iFrames which improves stability, speed and compatibility.
* Added dynamic caching for menus, admin pages, templates and other areas drastically improving performance and reducing server resources.

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


For older changelog entries, please see https://uipress.co/uipresschangelog/

To see uncompiled code see: https://github.com/wpuipress/uipress-lite


== Screenshots ==

1. Customise everything in the admin

2. An overview of the builder

3. An image showing the mobile preview in the builder

4. A view of the plugin area with a custom ui template active

