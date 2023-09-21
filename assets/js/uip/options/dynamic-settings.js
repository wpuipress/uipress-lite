///IMPORT TRANSLATIONS
const { __, _x, _n, _nx } = wp.i18n;
export function fetchSettings(uipress) {
  let dynamicSettings = {};
  for (let key in uipress.uipAppData.options.dynamicData) {
    let currentOption = uipress.uipAppData.options.dynamicData[key];

    dynamicSettings[key] = {};
    dynamicSettings[key].label = currentOption.label;
    dynamicSettings[key].value = currentOption.value;
    dynamicSettings[key].type = currentOption.type;
    dynamicSettings[key].key = key;
    dynamicSettings[key].name = key;
  }
  return dynamicSettings;

  return {
    username: {
      label: __('Username', 'uipress-lite'),
      name: 'username',
      key: 'username',
      type: 'text',
      value: uipress.uipAppData.options.dynamicData['username'],
    },
    firstname: {
      label: __('User first name', 'uipress-lite'),
      name: 'firstname',
      key: 'firstname',
      type: 'text',
      value: uipress.uipAppData.options.dynamicData['firstname'],
    },
    lastname: {
      label: __('User last name', 'uipress-lite'),
      name: 'lastname',
      key: 'lastname',
      type: 'text',
      value: uipress.uipAppData.options.dynamicData['lastname'],
    },
    fullname: {
      label: __('User full name', 'uipress-lite'),
      name: 'fullname',
      key: 'fullname',
      type: 'text',
      value: uipress.uipAppData.options.dynamicData['fullname'],
    },
    displayname: {
      label: __('User display name', 'uipress-lite'),
      name: 'displayname',
      key: 'displayname',
      type: 'text',
      value: uipress.uipAppData.options.dynamicData['displayname'],
    },
    useremail: {
      label: __('User email', 'uipress-lite'),
      name: 'useremail',
      key: 'useremail',
      type: 'text',
      value: uipress.uipAppData.options.dynamicData['useremail'],
    },
    userinitials: {
      label: __('User initials', 'uipress-lite'),
      name: 'userinitials',
      key: 'userinitials',
      type: 'text',
      value: uipress.uipAppData.options.dynamicData['userinitials'],
    },
    sitetitle: {
      label: __('Site name', 'uipress-lite'),
      name: 'sitetitle',
      key: 'sitetitle',
      type: 'text',
      value: uipress.uipAppData.options.dynamicData['sitetitle'],
    },
    userimage: {
      label: __('User profile image', 'uipress-lite'),
      name: 'userimage',
      key: 'userimage',
      type: 'image',
      value: uipress.uipAppData.options.dynamicData['userimage'],
    },
    logout: {
      label: __('Logout link', 'uipress-lite'),
      name: 'logout',
      key: 'logout',
      type: 'link',
      value: uipress.uipAppData.options.dynamicData['logout'],
    },
    viewsite: {
      label: __('View site link', 'uipress-lite'),
      name: 'viewsite',
      key: 'viewsite',
      type: 'link',
      value: uipress.uipAppData.options.dynamicData['viewsite'],
    },
    viewadmin: {
      label: __('View admin link', 'uipress-lite'),
      name: 'viewadmin',
      key: 'viewadmin',
      type: 'link',
      value: uipress.uipAppData.options.dynamicData['viewadmin'],
    },
    viewprofile: {
      label: __('View profile link', 'uipress-lite'),
      name: 'viewprofile',
      key: 'viewprofile',
      type: 'link',
      value: uipress.uipAppData.options.dynamicData['viewprofile'],
    },
    date: {
      label: __('Current Date', 'uipress-lite'),
      name: 'date',
      key: 'date',
      type: 'text',
      value: uipress.uipAppData.options.dynamicData['date'],
    },
    phpversion: {
      label: __('PHP Version', 'uipress-lite'),
      name: 'phpversion',
      key: 'phpversion',
      type: 'text',
      value: uipress.uipAppData.options.dynamicData['phpversion'],
    },
    wpversion: {
      label: __('WordPress Version', 'uipress-lite'),
      name: 'wpversion',
      key: 'wpversion',
      type: 'text',
      value: uipress.uipAppData.options.dynamicData['wpversion'],
    },
    activePlugins: {
      label: __('Count of active plugins', 'uipress-lite'),
      name: 'activePlugins',
      key: 'activePlugins',
      type: 'text',
      value: uipress.uipAppData.options.dynamicData['activePlugins'],
    },
    inactivePlugins: {
      label: __('Count of inactive plugins', 'uipress-lite'),
      name: 'inactivePlugins',
      key: 'inactivePlugins',
      type: 'text',
      value: uipress.uipAppData.options.dynamicData['inactivePlugins'],
    },
    installedThemes: {
      label: __('Count of installed themes', 'uipress-lite'),
      name: 'wpversion',
      key: 'wpversion',
      type: 'text',
      value: uipress.uipAppData.options.dynamicData['installedThemes'],
    },
    newPost: {
      label: __('New post link', 'uipress-lite'),
      name: 'newPost',
      key: 'newPost',
      type: 'link',
      value: uipress.uipAppData.options.dynamicData['newPost'],
    },
    newPage: {
      label: __('New page link', 'uipress-lite'),
      name: 'newPage',
      key: 'newPage',
      type: 'link',
      value: uipress.uipAppData.options.dynamicData['newPage'],
    },
  };
}
