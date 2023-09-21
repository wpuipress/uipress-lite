///IMPORT TRANSLATIONS
const { __, _x, _n, _nx } = wp.i18n;
///Groups
export function fetchGroups() {
  return {
    //Primary
    elements: {
      label: __('Elements', 'uipress-lite'),
      name: 'elements',
    },
    layout: {
      label: __('Layout', 'uipress-lite'),
      name: 'layout',
    },
    dynamic: {
      label: __('Dynamic', 'uipress-lite'),
      name: 'dynamic',
    },
    form: {
      label: __('Form', 'uipress-lite'),
      name: 'form',
    },
    analytics: {
      label: __('Visitor Analytics', 'uipress-lite'),
      name: 'analytics',
    },
    storeanalytics: {
      label: __('Store Analytics', 'uipress-lite'),
      name: 'storeanalytics',
    },
  };
}
