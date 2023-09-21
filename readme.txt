=== UiPress lite | Effortless custom dashboards, admin themes and pages ===
Contributors: uipress
Tags: admin theme, custom dashboard, google analytics, woocommerce analytics, white label, user management, role editor, order kanban, admin pages, page builder, ui press
Requires at least: 6.0
Requires PHP: 7.0
Tested up to: 6.3
Stable tag: 3.2.12
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

= 3.2.12 =
*Release Date 28 August 2023*

* Fixed issue on multisitie occasionally causing links to incorrectly direct to the wrong subsites
* Fixed issue with opening new links from within the frame in a new tab where they would open outside the frame

= 3.2.10 =
*Release Date 14 August 2023*

* Fixed bug with basic theme were the logo would be outputted as a style string instead of applied as an image
* Fixed bug where certain toolbar items were not being added when viewing without the frame
* Fixed bug with buttons in media modal not being the correct height

= 3.2.09 =
*Release Date 5 August 2023*

* Fixed bug certain toolbar items were triggering an error

= 3.2.08 =
*Release Date 2 August 2023*

* Fixed bug were duplicating a block wwould cause the tooltip to become permanently synced with the origin blocks tooltip.
* Fixed submenu issue with WP hide security plugin 
* Added fix for auto backup setting on wp-vivid when updating plugins / core / themes
* Fixed several php 8.3 depreciation notices
* Fixed bug with custom theme styles not applying outside the frame on multisite on subsites
* Fixed bug with style presets not overflowing when the list of presets was long
* Fixed issue where some input's couldn't be styled correctly within the uiBuilder
* Fixed issue with advanced classes in uiBuilder
* Fixed flash of white on page content block when using dark mode
* Added new advanced site option for disabling uipress on specific pages
* Added new advanced site option for automatically setting fullscreen on specific pages
* Fixed bug with colour select where clearing the current colour wouldn't remove the text value
* Added taxonomy options to the query builder
* Fixed depreciated wp_kses warning
* Added new site sync option to allow you to import settings from another site
* Several security improvements and performance enhancements

= 3.2.07 =
*Release Date 20 July 2023*

* Fixed bug with importing templates using the tabs block were the tabs content could be erased
* Added the ability to user acf options pages variables as dynamic data
* Fixed issue with image block where the image was being set as a background image on the img tag as well as the SRC
* Added compatibility for wicked folders plugin
* Added flex shrink option to dimensions style stack
* Fixed bug with navigation from links inside the iframe (content block) where the browser URL wouldn't update
* Fixed bug with analytics connection when using a uiTemplate
* Fixed bug with menu separators when they have been given an icon and then removed
* Added new global import export feature

= 3.2.06 =
*Release Date 13 July 2023*

* Fixed bug toolbar links that would not decode special characters and thus could result in the incorect link
* Fixed bug with advanced > classes were it could show an error if it failed to read the stylesheet
* Fixed bug with theme styles where changing the units values would clear all set
* Refactored the user & role select component for better ux and to added pagination to users query to help with sites with big numbers of users
* Fixed bug that could stop dark mode specific styles from loading up without page reload
* Fixed bug with plugins trying to use the same window for OAuth within the iframe that could cause CORS failures. Eg: social ninja
* Fixed bug with menu builder and separators with names not showing
* Fixed compatibility with atarim plugin
* Fixed bug with the accordion block where it's body layout styles were not applying
* Fixed a bug with block conditions on older templates that could cause blocks not to load
* Fixed bug with toolbar links starting with admin path ('/wp-admin/') that could cause the links to fail

= 3.2.05 =
*Release Date 10 July 2023*

* Fixed bug with query loop where dynamic variables wouldn't work, only query loop specific variables were loading

= 3.2.04 =
*Release Date 10 July 2023*

* Fixed bug with ACF meta key that would stop it loading at times
* Fixed bug with dynamic data within the styles that could cause it to be repeated across a loop instead of unique to each iteration
* Fixed bug with block conditions that could cause them not to apply as expected
* Improved the toolbar block to allow it to pick up items that are added dynamically (elementor, some cache plugins etc)
* Added a new setting to the block styles to allow you to set the cursor
* Fixed bug with todo block descriptions not overflowing as expected.
* To do list now clears the title from the previous todo after adding a new item
* Fixed bug with page content block where hide plugin notices were not working
* Added option to the page content block to allow you to hide the loading bar
* Added new block: page loader which allows you to show a loading bar that is synced with page loads anywhere in the template.
* Fixed bug with dimensions style stack where it was impossible to add an minimum height
* Fixed bug with colour pickers where pasting a colour value directly into the inline input wouldn't update correctly 
* Added a new ai chat block

= 3.2.03 =
*Release Date 5 July 2023*

* Imported admin pages from the library now replace all template content
* Added ACF specific meta options to the dynamic data selector
* Added Meta box specific meta options to the dynamic data selector
* Added option to limit post query to users own content
* Added style for scrollbars in firefox
* If gutenburg / block editor is set to full screen mode then it will now load in fullscreen
* Added a new block part to the search block to allow layout control of the found items
* Fixed woocommerce toggles to use uipress color variables
* Fixed bug that could stop dynamic data from working within block styles (background image for eg)

= 3.2.02 =
*Release Date 3 July 2023*

* Fixed bug with load front end outside frame where it wouldn't work for links within an admin page 
* Improved UX of site settings and stoped the close button from getting in the way of accordions
* Fixed issue with toolbar URLs where they would sometimes contain HTML special characters and as a result lead to the wrong destination
* Fixed bug with ::before and ::after content that would add an unintentional ';' to the content
* Fixed issue with charts that could cause them to disappear
* Added catch for basic admin theme when using a uiTemplate to avoid conflicts
* Block part switcher is now sticky

= 3.2.01 =
*Release Date 28 June 2023*

* Fixed issue with button links set to open in a new tab
* Fixed bug with text and position stacks where their styles could get reset when switching block parts
* Fixed bug with accordions where they don't toggle state on the title icon
* Fixed bug where templates made pre v3.2 wouldn't inherit padding properly
* Fixed bug with where uip_ajax may already defined and cause a crash
* Fixed several other miscellaneous error warnings

= 3.2.0 =
*Release Date 20 June 2023*

* Fixed a bug with the toolbar where the submenu links could not be opened in new tabs / new windows
* Fixed issue with buttons and icons aligned right where custom classes would not be applied properly
* Overhauled the uiBuilder with a much cleaner and easy to use UI
* Performance improvements
* New feature Query builder 
* Any block can now have a link
* New element state style options (mobile, tablet, :hover, menu collapsed etc)
* New feature style presets
* New feature block effects (transforms, filters etc)
* New feature import / export site settings
* Google analytics now uses dummy data in the builder to prevent exhausted quota issues
* Many other improvements and tweaks

For older changelog entries, please see https://uipress.co/uipresschangelog/


== Screenshots ==

1. Customise everything in the admin

2. An overview of the builder

3. An image showing the mobile preview in the builder

4. A view of the plugin area with a custom ui template active

