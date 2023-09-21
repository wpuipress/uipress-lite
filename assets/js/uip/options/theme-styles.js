///IMPORT TRANSLATIONS
const { __, _x, _n, _nx } = wp.i18n;
export function fetchSettings(uipress) {
  return [
    //Primary
    {
      label: __('Primary color', 'uipress-lite'),
      name: '--uip-color-primary',
      type: 'color',
      value: '',
      darkValue: '',
    },
    {
      label: __('Primary color darker', 'uipress-lite'),
      name: '--uip-color-primary-darker',
      type: 'color',
      value: '',
      darkValue: '',
    },
    {
      label: __('Primary color lighter', 'uipress-lite'),
      name: '--uip-color-primary-lighter',
      type: 'color',
      value: '',
      darkValue: '',
    },
    //Primary
    {
      label: __('Accent color', 'uipress-lite'),
      name: '--uip-color-accent',
      type: 'color',
      value: '',
      darkValue: '',
    },
    {
      label: __('Accent color darker', 'uipress-lite'),
      name: '--uip-color-accent-darker',
      type: 'color',
      value: '',
      darkValue: '',
    },
    {
      label: __('Accent color lighter', 'uipress-lite'),
      name: '--uip-color-accent-lighter',
      type: 'color',
      value: '',
      darkValue: '',
    },
    //Green
    {
      label: __('Success color', 'uipress-lite'),
      name: '--uip-color-green',
      type: 'color',
      value: '',
      darkValue: '',
    },
    {
      label: __('Success color darker', 'uipress-lite'),
      name: '--uip-color-green-darker',
      type: 'color',
      value: '',
      darkValue: '',
    },
    {
      label: __('Success color lighter', 'uipress-lite'),
      name: '--uip-color-green-lighter',
      type: 'color',
      value: '',
      darkValue: '',
    },
    //Orange
    {
      label: __('Warning color', 'uipress-lite'),
      name: '--uip-color-orange',
      type: 'color',
      value: '',
      darkValue: '',
    },
    {
      label: __('Warning color darker', 'uipress-lite'),
      name: '--uip-color-orange-darker',
      type: 'color',
      value: '',
      darkValue: '',
    },
    {
      label: __('Warning color lighter', 'uipress-lite'),
      name: '--uip-color-orange-lighter',
      type: 'color',
      value: '',
      darkValue: '',
    },
    //Orange
    {
      label: __('Danger color', 'uipress-lite'),
      name: '--uip-color-red',
      type: 'color',
      value: '',
      darkValue: '',
    },
    {
      label: __('Danger color darker', 'uipress-lite'),
      name: '--uip-color-red-darker',
      type: 'color',
      value: '',
      darkValue: '',
    },
    {
      label: __('Danger color lighter', 'uipress-lite'),
      name: '--uip-color-red-lighter',
      type: 'color',
      value: '',
      darkValue: '',
    },
    //Base
    {
      label: __('Base', 'uipress-lite'),
      name: '--uip-color-base-0',
      type: 'color',
      value: '',
      darkValue: '',
    },
    {
      label: __('Base 1', 'uipress-lite'),
      name: '--uip-color-base-1',
      type: 'color',
      value: '',
      darkValue: '',
    },
    {
      label: __('Base 2', 'uipress-lite'),
      name: '--uip-color-base-2',
      type: 'color',
      value: '',
      darkValue: '',
    },
    //Text color
    {
      label: __('Text color base', 'uipress-lite'),
      name: '--uip-text-color-base',
      type: 'color',
      value: '',
      darkValue: '',
    },
    {
      label: __('Text color emphasis', 'uipress-lite'),
      name: '--uip-text-color-emphasis',
      type: 'color',
      value: '',
      darkValue: '',
    },
    {
      label: __('Text color muted', 'uipress-lite'),
      name: '--uip-text-color-muted',
      type: 'color',
      value: '',
      darkValue: '',
    },
    {
      label: __('Text color inverted', 'uipress-lite'),
      name: '--uip-text-color-inverse',
      type: 'color',
      value: '',
      darkValue: '',
    },
  ];
}
