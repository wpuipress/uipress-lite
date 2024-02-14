=== UiPress lite | Effortless custom dashboards, admin themes and pages ===
Contributors: uipress
Tags: admin theme, custom dashboard, google analytics, woocommerce analytics, white label, user management, role editor, order kanban, admin pages, page builder, ui press
Requires at least: 6.0
Requires PHP: 7.4
Tested up to: 6.4.3
Stable tag: 3.3.1
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

= 3.3.093 =
*Release Date 21 November 2023*

* Fixed issue where color picker input block was not showing on the front end
* Fixed issue with canvas layout in RTL
* Fixed issue with inline image select input that was not showing on front end
* Fixed issue that was causing the menu headers not to maintain or show active state

= 3.3.092 =
*Release Date 15 November 2023*

* Fixed issue with responsive preview in uiBuilder
* Fixed issue with inset style input validation 
* Fixed issue with code editor input validation 
* fixed issue with toggle switch in RTL

= 3.3.091 =
*Release Date 14 November 2023*

* Fixed issue that could cause seps to have hover effect in drilldown menu
* Fixed issue that could cause incorrect menu links for some items (eg woocommerce attributes)
* Added catch for pushing 'about:blank' to history state
* Fixed responsive hidden options when window resizes
* Fixed issue that could cause subsites to load ajax calls from main site
* Added new menu collapse block

= 3.3.09 =
*Release Date 11 November 2023*

* Fixed issue that was causing the canvas preview to be an incorrect ratio
* Fixed input validation with responsive options and value units
* Fixed bug that cause alignment issues in the uiBuilder canvas
* Fixed incorrect link issues with some menu items (woocommerce analytics etc)
* Fixed issue preventing the menu from showing custom menu classes
* Fixed issue that could cause uipress pro to be disabled but not able to update
* Fixed potential fatal when using mailpoet
* Fixed separators display in drilldown menu where they would show as empty menu items

= 3.3.08 =
*Release Date 9 November 2023*

* Fixed static menu retrieval on subsites for users other than admin

= 3.3.07 =
*Release Date 9 November 2023*

* Fixed auto load on menu block
* Fix issue with starting zoom always being fixed
* Fixed issue with hashchange within frame that could cause some pages to be broken
* Fixed issue with static menus on multisite
* Corrected menu auto load issue
* Fixed start zoom level in builder
* Fixed issue with ajax referer check
* Fixed issue with abspath check

= 3.3.06 =
*Release Date 3 November 2023*

* Fixed issue that could cause some older templates to break and result in white screen
* Fixed issue that would cause all toolbar items to flash before removing hidden items
* fixed issues with site query vars and pagination
* Fixed issues with setup wizard

= 3.3.05 =
*Release Date 2 November 2023*

* Fixed issue with query builder

= 3.3.04 =
*Release Date 2 November 2023*

* Fixed toolbar block where it wasn't showing on the front end
* Fixed editing of toolbar items in builder
* Fixed styling issue with gravity forms dropdowns
* Fixed issue with multisite site settings not applying to subsites
* Fixed issue with multisite menus not applying 
* Fixed block export from context menu

= 3.3.03 =
*Release Date 1 November 2023*

* Fixed dropdown positions in RTL
* Fix to dark mode styles not applying outside the frame
* Fixed issue with custom styles on multisite subsites
* Fixed setup wizard importer
* Fixed issues with closing media library close buttons
* Fixed issue where background sizing wasn't applied unless background position was set
* Fixed color picker input validation

= 3.3.02 =
*Release Date 31 October 2023*

* Fixed issue with forms set as email flagging there is no email template
* Fixed issues with form input required fields not updating as expected.
* Fixed issue with layout of canvas on entry when template had several frames
* Fixed bug with shadows / borders not updating when switching states
* Fixed issue with searching of styles in colour picker
* Fixed layout shift when switching template type
* Fixed issue with custom block js getting custom css added

= 3.3.01 =
*Release Date 26 October 2023*

* Added fix for google sitekit connection
* Fixed with menus where custom menu names and icons where not showing
* Fixed issue with php warnings for undefined indexes with custom menus
* Fixed several issues where user styles where not being loaded or displayed
* Fixed issue with download button on library themes where it would not add template
* Fixed issue with drilldown menu type not showing the correct go back text

= 3.3.00 =
*Release Date 24 October 2023*

* Fixed issue with groundhogg plugin when adding new emails in a modal
* Fixed issue with code for head where link tags were getting filtered out
* Fixed sorting icons issue on post tables
* New history system for the uiBuilder
* New image library
* Layers now highlight when hovering over the relevant block on the canvas
* New canvas with better scrolling / zoom and block highlighting
* New and improved block contextmenu (right click)
* Reworked block styles
* New colour picker and improved colour variable support
* New gradient picker
* Added dvh units to the units selector
* Overhauled the theme styles editor and added auto save
* Theme styles changes preview immediately within the frame 
* Added new admin page title dynamic value
* Fixed continuous reload issue on some pages
* Added slug option for admin pages
* Added static menu option to the admin menu block
* Fixed issue that could stop uipress menus and uitemplates from loading on elementor template pages
* Huge performance improvements across all apps
* Added new site option to add sticky headers to post tables


For older changelog entries, please see https://uipress.co/uipresschangelog/


== Screenshots ==

1. Customise everything in the admin

2. An overview of the builder

3. An image showing the mobile preview in the builder

4. A view of the plugin area with a custom ui template active

