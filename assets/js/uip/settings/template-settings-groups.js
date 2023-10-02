///IMPORT TRANSLATIONS
const { __, _x, _n, _nx } = wp.i18n;
///Groups
export const templategroups = {
  //Primary
  advanced: {
    label: __('Advanced', 'uipress-lite'),
    name: 'advanced',
    icon: 'code',
  },
};

//Group options
export const templateSettings = [
  {
    component: 'code-editor',
    group: 'advanced',
    uniqueKey: 'css',
    label: __('CSS', 'uipress-lite'),
    accepts: String,
    args: {
      language: 'css',
    },
  },
  {
    component: 'code-editor',
    group: 'advanced',
    uniqueKey: 'js',
    label: __('JavaScript', 'uipress-lite'),
    accepts: String,
    args: {
      language: 'javascript',
    },
  },
];
