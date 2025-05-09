///IMPORT TRANSLATIONS
const { __ } = wp.i18n;

/**
 * Processes global groups, associates settings with them, and returns a reversed version of the groups.
 *
 * This function iterates over the provided groups, filters the settings that belong to a particular group,
 * ensures that they are unique, and sorts them based on their order. Finally, it returns a reversed
 * version of the processed groups.
 *
 * @param {Object} groups - The initial groups object.
 * @param {Array} options - Array of settings options that belong to groups.
 * @returns {Object} A reversed and processed version of the groups object.
 */
export function processGlobalGroups(groups, options) {
  const processedGroups = { ...groups }; // create a copy to avoid mutating the original groups object

  for (let [key] of Object.entries(processedGroups)) {
    const groupSettings = uniqueGroupSettings(options, key);

    const seenKeys = new Set(); // a set to ensure uniqueness
    processedGroups[key].settings = processedGroups[key].settings || [];

    for (let opt of groupSettings) {
      const uniqueKey = opt.group + opt.uniqueKey;

      const exists = processedGroups[key].settings.find((item) => item.uniqueKey === opt.uniqueKey);

      // Bail if already added
      if (exists) {
        continue;
      }

      // Check if there is a pro version that should be added instead
      const proVersion = options.find((item) => item.uniqueKey === opt.uniqueKey && !item.proOption);

      if (proVersion) {
        processedGroups[key].settings.push(proVersion);
      } else {
        processedGroups[key].settings.push(opt);
      }

      //else if (!opt.proOption) {
      //const foundIndex = processedGroups[key].settings.findIndex((item) => item.uniqueKey === opt.uniqueKey);

      //processedGroups[key].settings[foundIndex] = { ...processedGroups[key].settings[foundIndex], ...opt };
      //}
    }

    processedGroups[key].settings.sort((a, b) => a.order - b.order);
  }

  // Reverse groups order
  const reverseObject = (obj) => {
    let new_obj = {};
    let rev_obj = Object.keys(obj).reverse();
    rev_obj.forEach(function (i) {
      new_obj[i] = processedGroups[i];
    });
    return new_obj;
  };

  return reverseObject(processedGroups);
}

const uniqueGroupSettings = (options, key) => {
  return options
    .filter((option) => option.group === key)
    .reduce((acc, current) => {
      const existingItem = acc.find((item) => item.uniqueKey === current.uniqueKey);

      if (!existingItem) {
        // If item doesn't exist yet, add it
        return [...acc, current];
      }

      // If current item doesn't have proOption but existing one does,
      // replace the existing item
      if (!current.proOption && existingItem.proOption) {
        return acc.map((item) => (item.uniqueKey === current.uniqueKey ? current : item));
      }

      // Otherwise keep existing item
      return acc;
    }, []);
};

///Groups
export const globalSettingsGroups = {
  //Primary
  advanced: {
    label: __("Advanced", "uipress-pro"),
    name: "advanced",
    icon: "code",
  },
  whiteLabel: {
    label: __("White label", "uipress-pro"),
    name: "whiteLabel",
    icon: "branding_watermark",
  },
  theme: {
    label: __("Theme", "uipress-lite"),
    name: "theme",
    icon: "palette",
  },
  login: {
    label: __("Login", "uipress-lite"),
    name: "login",
    icon: "login",
  },
  postsPages: {
    label: __("Posts", "uipress-lite"),
    name: "postsPages",
    icon: "article",
  },
  media: {
    label: __("Media", "uipress-lite"),
    name: "media",
    icon: "photo_library",
  },
  plugins: {
    label: __("Plugins", "uipress-lite"),
    name: "plugins",
    icon: "extension",
  },
  general: {
    label: __("General", "uipress-lite"),
    name: "general",
    icon: "language",
  },
  extensions: {
    label: __("Extensions", "uipress-pro"),
    name: "extensions",
    icon: "extension",
  },
};

//Group options
export const globalSettings = [
  //Posts and pages
  {
    component: "inline-image-select",
    args: { hasPositioning: false },
    group: "general",
    uniqueKey: "globalLogo",
    label: __("Site logo", "uipress-lite"),
    help: __("This will replace the WordPress logo with your own. The logo will also become available in the dynamic options in the builder.", "uipress-lite"),
    accepts: Boolean,
  },
  {
    component: "inline-image-select",
    args: { hasPositioning: false },
    group: "general",
    uniqueKey: "globalLogoDarkMode",
    label: __("Site logo dark mode", "uipress-lite"),
    help: __("This will replace the WordPress logo with your own. The logo will also become available in the dynamic options in the builder.", "uipress-lite"),
    accepts: Boolean,
  },
  {
    component: "switch-select",
    args: { asText: true },
    group: "general",
    uniqueKey: "jqueryMigrate",
    label: __("Remove jQuery Migrate front end", "uipress-lite"),
    help: __("Removes jQuery migrate script from all front end pages.", "uipress-lite"),
    accepts: Boolean,
  },
  {
    component: "switch-select",
    args: { asText: true },
    group: "general",
    uniqueKey: "jqueryMigrateBack",
    label: __("Remove jQuery Migrate back end", "uipress-lite"),
    help: __("Removes jQuery migrate script from all back end pages. This may break some functions in the back end", "uipress-lite"),
    accepts: Boolean,
  },
  {
    component: "switch-select",
    args: { asText: true },
    group: "postsPages",
    uniqueKey: "postIDs",
    label: __("Add post ID to table", "uipress-lite"),
    help: __("Adds the post ID to each row in a table. Works for posts, custom post types, pages and users.", "uipress-lite"),
    accepts: Boolean,
  },
  {
    component: "switch-select",
    args: { asText: true },
    group: "postsPages",
    uniqueKey: "displayLastModified",
    label: __("Disply last modified in table", "uipress-lite"),
    help: __("Adds a last modified column to post tables. Works for posts, custom post types and pages.", "uipress-lite"),
    accepts: Boolean,
  },
  {
    component: "switch-select",
    args: { asText: true },
    group: "plugins",
    uniqueKey: "displayPluginStatus",
    label: __("Add plugin status", "uipress-lite"),
    help: __("Adds a plugin status column to the plugin table", "uipress-lite"),
    accepts: Boolean,
  },
  {
    component: "inline-image-select",
    args: { hasPositioning: false },
    group: "login",
    uniqueKey: "logo",
    label: __("Logo", "uipress-lite"),
    help: __("This will replace the WordPress logo with your own on the login page.", "uipress-lite"),
    accepts: Boolean,
    order: 1,
  },
  {
    component: "choice-select",
    group: "login",
    uniqueKey: "logo_alignment",
    label: __("Logo alignment", "uipress-lite"),
    help: __("Sets the logo alignment.", "uipress-lite"),
    accepts: Boolean,
    order: 2,
    args: {
      options: {
        left: {
          value: "left",
          label: __("Left", "uipress-lite"),
        },
        center: {
          value: "center",
          label: __("Center", "uipress-lite"),
        },
        right: {
          value: "right",
          label: __("Right", "uipress-lite"),
        },
      },
    },
  },
  {
    component: "switch-select",
    args: {
      asText: true,
      options: {
        false: {
          value: false,
          label: __("Disabled", "uipress-lite"),
        },
        true: {
          value: true,
          label: __("Enabled", "uipress-lite"),
        },
      },
    },
    group: "login",
    uniqueKey: "loginTheme",
    label: __("Theme", "uipress-lite"),
    help: __("Adds a modern theme to the login page", "uipress-lite"),
    accepts: Boolean,
    order: 3,
  },
  {
    component: "choice-select",
    group: "login",
    uniqueKey: "login_form_alignment",
    label: __("Form alignment", "uipress-lite"),
    help: __("Sets the position of the login form.", "uipress-lite"),
    accepts: Boolean,
    order: 4,
    args: {
      options: {
        left: {
          value: "left",
          label: __("Left", "uipress-lite"),
        },
        center: {
          value: "center",
          label: __("Center", "uipress-lite"),
        },
        right: {
          value: "right",
          label: __("Right", "uipress-lite"),
        },
      },
    },
  },
  {
    component: "inline-image-select",
    group: "login",
    args: { hasPositioning: false },
    uniqueKey: "background_image",
    label: __("Background image", "uipress-lite"),
    help: __("Adds a background image to the login page.", "uipress-lite"),
    accepts: Boolean,
    order: 5,
  },

  ////PRO OPTIONS
  {
    component: "switch-select",
    args: { asText: true },
    group: "login",
    uniqueKey: "darkMode",
    label: __("Dark mode", "uipress-lite"),
    help: __("Forces dark mode on the login page", "uipress-lite"),
    accepts: Boolean,
    proOption: true,
    order: 6,
  },
  {
    component: "switch-select",
    args: { asText: true },
    group: "login",
    uniqueKey: "hideLanguage",
    label: __("Disable language selector", "uipress-lite"),
    help: __("Disables the language selector on the login page", "uipress-lite"),
    proOption: true,
    accepts: Boolean,
    order: 7,
  },
  {
    component: "switch-select",
    args: { asText: true },
    group: "login",
    uniqueKey: "removeBranding",
    label: __("Remove UiPress link", "uipress-lite"),
    help: __("Removes the powered by uipress link", "uipress-lite"),
    proOption: true,
    accepts: Boolean,
    order: 8,
  },
  {
    component: "CodeEditor",
    group: "login",
    uniqueKey: "panelHTML",
    label: __("Custom HTML", "uipress-lite"),
    help: __("HTML to be added to the side panel of the login page. Only works when the login theme is enabled and not using the centered form.", "uipress-lite"),
    accepts: String,
    proOption: true,
    order: 9,
    args: {
      language: "html",
    },
  },
  {
    component: "CodeEditor",
    group: "login",
    uniqueKey: "loginCSS",
    label: __("Custom CSS", "uipress-lite"),
    help: __("CSS to be added to the login page", "uipress-lite"),
    accepts: String,
    proOption: true,
    order: 10,
    args: {
      language: "css",
    },
  },
  ///White label
  ///
  {
    component: "switch-select",
    args: { asText: true },
    group: "whiteLabel",
    uniqueKey: "hidePlugins",
    label: __("Hide UiPress from plugin table", "uipress-lite"),
    help: __("If enabled, both UiPress lite and pro (if installed) will be hidden from the plugins table", "uipress-lite"),
    accepts: Boolean,
    proOption: true,
  },

  {
    component: "uip-input",
    args: { asText: true },
    group: "whiteLabel",
    uniqueKey: "welcomeMessage",
    label: __("Change Howdy message", "uipress-lite"),
    help: __("Replaces the Howdy message in the toolbar with one of your choosing", "uipress-lite"),
    accepts: String,
  },
  {
    component: "switch-select",
    args: { asText: true },
    group: "whiteLabel",
    args: {
      asText: true,
      options: {
        false: {
          value: false,
          label: __("Show", "uipress-lite"),
        },
        true: {
          value: true,
          label: __("Hide", "uipress-lite"),
        },
      },
    },
    uniqueKey: "hideWelcomeMessage",
    label: __("Howdy message", "uipress-lite"),
    help: __("Removes the Howdy message in the toolbar", "uipress-lite"),
    accepts: Boolean,
  },

  //Advanced
  {
    component: "switch-select",
    args: { asText: true },
    group: "advanced",
    uniqueKey: "addRoleToBody",
    label: __("Add user roles as body class", "uipress-lite"),
    help: __("If enabled, the current user roles will be added as classes to the admin body tag. This can give you more flexibility in your css for role based conditions", "uipress-lite"),
    accepts: Boolean,
    proOption: true,
  },

  {
    component: "array-list",
    args: { asText: true },
    group: "advanced",
    uniqueKey: "enqueueStyles",
    label: __("Enqueue styles", "uipress-lite"),
    help: __("Add stylesheets to the head of every admin page", "uipress-lite"),
    accepts: Array,
    proOption: true,
  },
  //Advanced
  {
    component: "array-list",
    args: { asText: true },
    group: "advanced",
    uniqueKey: "enqueueScripts",
    label: __("Enqueue scripts", "uipress-lite"),
    help: __("Add scripts to the head of every admin page", "uipress-lite"),
    accepts: Array,
    proOption: true,
  },

  //Advanced
  {
    component: "CodeEditor",
    args: { asText: true },
    group: "advanced",
    uniqueKey: "htmlHead",
    label: __("HTML for head", "uipress-lite"),
    help: __("Add HTML here to be added to every admin page head section", "uipress-lite"),
    accepts: String,
    proOption: true,
    args: {
      language: "html",
    },
  },

  //Advanced
  {
    component: "uip-textarea",
    args: { asText: true },
    group: "advanced",
    uniqueKey: "uipDisabledFor",
    label: __("Disable uipress on pages", "uipress-lite"),
    help: __("Add URLs of pages here that you wish uiPress to be disabled on, separated by a comma. The URL can be an absolute URL, partial path or a query paramater.", "uipress-lite"),
    accepts: String,
  },

  ///Theme
  {
    component: "switch-select",
    args: { asText: true },
    group: "theme",
    uniqueKey: "themeEnabled",
    label: __("Admin theme", "uipress-lite"),
    help: __("If enabled, a simple modernised theme will be applied to the admin area. This is an alternative to using the builder for your UI", "uipress-lite"),
    accepts: Boolean,
  },

  ///Media
  {
    component: "switch-select",
    args: { asText: true },
    group: "media",
    uniqueKey: "privateLibrary",
    label: __("Private library", "uipress-lite"),
    help: __("If enabled, users will only be able to view their own media in the media library. This does not apply to administrators", "uipress-lite"),
    accepts: Boolean,
    proOption: true,
  },

  ///Media
  {
    component: "switch-select",
    args: { asText: true },
    group: "postsPages",
    uniqueKey: "stickyHeaders",
    label: __("Sticky headers", "uipress-lite"),
    help: __("If enabled, posts & pages table headers will become sticky on scroll", "uipress-lite"),
    accepts: Boolean,
    proOption: false,
  },

  {
    component: "switch-select",
    args: { asText: true },
    group: "postsPages",
    uniqueKey: "privatePosts",
    label: __("Private posts", "uipress-lite"),
    help: __("If enabled, users will only be able to view their own posts and pages in the post tables. This does not apply to administrators", "uipress-lite"),
    accepts: Boolean,
    proOption: true,
  },

  ///Extensions
  {
    component: "switch-select",
    args: { asText: true },
    group: "extensions",
    uniqueKey: "menuCreatorEnabled",
    label: __("Menu builder", "uipress-lite"),
    help: __("The menu builder allows you to create custom admin menus for roles and users", "uipress-lite"),
    accepts: Boolean,
    proOption: true,
  },

  {
    component: "switch-select",
    args: { asText: true },
    group: "extensions",
    uniqueKey: "userManagementEnabled",
    label: __("User management", "uipress-lite"),
    help: __("The user management page allows you manage your users, roles and user activity all in one place", "uipress-lite"),
    accepts: Boolean,
    proOption: true,
  },

  {
    component: "switch-select",
    args: { asText: true },
    group: "extensions",
    uniqueKey: "foldersEnabled",
    label: __("Content folders", "uipress-pro"),
    help: __("Enables a folder system for posts, pages, custom post types and media", "uipress-pro"),
    accepts: Boolean,
    proOption: Boolean,
  },
];
