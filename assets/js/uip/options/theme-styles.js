///IMPORT TRANSLATIONS
const { __, _x, _n, _nx } = wp.i18n;
const list = {
  '--uip-color-primary': {
    label: __('Primary color', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-color-primary-darker': {
    label: __('Primary color darker', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-color-primary-lighter': {
    label: __('Primary color lighter', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-color-accent': {
    label: __('Accent color', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-color-accent-darker': {
    label: __('Accent color darker', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-color-accent-lighter': {
    label: __('Accent color lighter', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-color-green': {
    label: __('Success color', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-color-green-darker': {
    label: __('Success color darker', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-color-green-lighter': {
    label: __('Success color lighter', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-color-orange': {
    label: __('Warning color', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-color-orange-darker': {
    label: __('Warning color darker', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-color-orange-lighter': {
    label: __('Warning color lighter', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-color-red': {
    label: __('Danger color', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-color-red-darker': {
    label: __('Danger color darker', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-color-red-lighter': {
    label: __('Danger color lighter', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-color-base-0': {
    label: __('Base', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-color-base-1': {
    label: __('Base 1', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-color-base-2': {
    label: __('Base 2', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-text-color-base': {
    label: __('Text color base', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-text-color-emphasis': {
    label: __('Text color emphasis', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-text-color-muted': {
    label: __('Text color muted', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-text-color-inverse': {
    label: __('Text color inverted', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
  '--uip-border-color': {
    label: __('Border color', 'uipress-lite'),
    type: 'color',
    value: '',
    darkValue: '',
  },
};

Object.keys(list).forEach((key) => {
  list[key].name = key;
});

export default list;
