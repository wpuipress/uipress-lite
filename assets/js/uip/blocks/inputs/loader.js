const { __, _x, _n, _nx } = wp.i18n;

/**
 * Form block
 *
 * @since 3.2.13
 */
const Form = {
  name: __('Form', 'uipress-lite'),
  moduleName: 'form-block',
  description: __('Form elements can be dragged into this block to create custom forms', 'uipress-lite'),
  group: 'form',
  path: './blocks/inputs/form-block.min.js',
  icon: 'edit_note',
  content: [],
  optionsEnabled: [
    //Block options group
    {
      name: 'block',
      label: __('Block options', 'uipress-lite'),
      icon: 'check_box_outline_blank',
      options: [
        {
          option: 'title',
          componentName: 'uip-dynamic-input',
          uniqueKey: 'submitText',
          label: __('Submit text', 'uipress-lite'),
          value: {
            string: __('Send', 'uipress-lite'),
            dynamic: false,
            dynamicKey: '',
            dynamicPos: 'left',
          },
        },
        {
          option: 'choiceSelect',
          componentName: 'choice-select',
          uniqueKey: 'prePopulate',
          args: {
            options: {
              false: {
                value: false,
                label: __('No', 'uipress-lite'),
              },
              true: {
                value: true,
                label: __('Yes', 'uipress-lite'),
              },
            },
          },
          label: __('Prefill data', 'uipress-lite'),
          value: { value: false },
        },
        {
          option: 'submitAction',
          componentName: 'submit-actions',
          label: '',
          args: { fullWidth: true },
        },
        {
          option: 'paragraph',
          componentName: 'uip-paragraph-input',
          uniqueKey: 'successMessage',
          label: __('Success message', 'uipress-lite'),
          args: { fullWidth: true },
          value: __('Form sent successfully!', 'uipress-lite'),
        },
      ],
    },
    {
      name: 'style',
      label: __('Style', 'uipress-lite'),
      icon: 'palette',
      styleType: 'style',
    },
    {
      name: 'formArea',
      label: __('Form area', 'uipress-lite'),
      icon: 'sort',
      styleType: 'style',
      class: '.uip-form-area',
    },
    {
      name: 'submitButton',
      label: __('Submit button', 'uipress-lite'),
      icon: 'smart_button',
      styleType: 'style',
      class: '.uip-submit-button',
    },
  ],
};

/**
 * Text input block
 *
 * @since 3.2.13
 */
const TextInput = {
  name: __('Text input', 'uipress-lite'),
  moduleName: 'text-input',
  description: __('A simple text input for use with the form block', 'uipress-lite'),
  group: 'form',
  path: './blocks/inputs/text-input.min.js',
  icon: 'input',
  optionsEnabled: [
    //Block options group
    {
      name: 'block',
      label: __('Block options', 'uipress-lite'),
      icon: 'check_box_outline_blank',
      options: [
        {
          option: 'title',
          componentName: 'uip-dynamic-input',
          uniqueKey: 'inputLabel',
          label: __('Label', 'uipress-lite'),
          value: {
            string: __('Text input', 'uipress-lite'),
          },
        },
        {
          option: 'textField',
          componentName: 'uip-input',
          uniqueKey: 'inputName',
          label: __('Meta key', 'uipress-lite'),
          args: { metaKey: true },
        },
        {
          option: 'title',
          componentName: 'uip-dynamic-input',
          uniqueKey: 'inputPlaceHolder',
          label: __('Placeholder', 'uipress-lite'),
          value: {
            string: __('Placeholder text...', 'uipress-lite'),
          },
        },
        {
          option: 'defaultSelect',
          componentName: 'default-select',
          uniqueKey: 'inputType',
          label: __('Inut type', 'uipress-lite'),
          args: {
            options: [
              {
                value: 'text',
                label: __('Text', 'uipress-lite'),
              },
              {
                value: 'number',
                label: __('Number', 'uipress-lite'),
              },
              {
                value: 'email',
                label: __('Email', 'uipress-lite'),
              },
              {
                value: 'tel',
                label: __('Phone number', 'uipress-lite'),
              },
              {
                value: 'password',
                label: __('Password', 'uipress-lite'),
              },
            ],
          },
          value: 'text',
        },

        {
          option: 'choiceSelect',
          componentName: 'choice-select',
          uniqueKey: 'inputRequired',
          args: {
            options: {
              false: {
                value: false,
                label: __('No', 'uipress-lite'),
              },
              true: {
                value: true,
                label: __('Yes', 'uipress-lite'),
              },
            },
          },
          label: __('Required field', 'uipress-lite'),
          value: { value: false },
        },
      ],
    },

    {
      name: 'style',
      label: __('Style', 'uipress-lite'),
      icon: 'palette',
      styleType: 'style',
    },
    {
      name: 'inputStyle',
      label: __('Input style', 'uipress-lite'),
      icon: 'input',
      styleType: 'style',
      class: '.uip-input',
    },
    {
      name: 'label',
      label: __('Label', 'uipress-lite'),
      icon: 'label',
      styleType: 'style',
      class: '.uip-input-label',
    },
  ],
};

/**
 * Text area block
 *
 * @since 3.2.13
 */
const TextArea = {
  name: __('Text area', 'uipress-lite'),
  moduleName: 'text-area',
  description: __('A simple textarea input for use with the form block', 'uipress-lite'),
  group: 'form',
  path: './blocks/inputs/text-area.min.js',
  icon: 'segment',
  optionsEnabled: [
    //Block options group
    {
      name: 'block',
      label: __('Block options', 'uipress-lite'),
      icon: 'check_box_outline_blank',
      options: [
        {
          option: 'title',
          componentName: 'uip-dynamic-input',
          uniqueKey: 'inputLabel',
          label: __('Label', 'uipress-lite'),
          value: {
            string: __('Text input', 'uipress-lite'),
          },
        },
        {
          option: 'textField',
          componentName: 'uip-input',
          uniqueKey: 'inputName',
          label: __('Meta key', 'uipress-lite'),
          args: { metaKey: true },
        },
        {
          option: 'title',
          componentName: 'uip-dynamic-input',
          uniqueKey: 'inputPlaceHolder',
          label: __('Placeholder', 'uipress-lite'),
          value: {
            string: __('Placeholder text...', 'uipress-lite'),
          },
        },
        {
          option: 'choiceSelect',
          componentName: 'choice-select',
          uniqueKey: 'inputRequired',
          args: {
            options: {
              false: {
                value: false,
                label: __('No', 'uipress-lite'),
              },
              true: {
                value: true,
                label: __('Yes', 'uipress-lite'),
              },
            },
          },
          label: __('Required field', 'uipress-lite'),
          value: { value: false },
        },
      ],
    },

    {
      name: 'style',
      label: __('Style', 'uipress-lite'),
      icon: 'palette',
      styleType: 'style',
    },
    {
      name: 'inputStyle',
      label: __('Textarea style', 'uipress-lite'),
      icon: 'input',
      styleType: 'style',
      class: '.uip-input',
    },
    {
      name: 'label',
      label: __('Label', 'uipress-lite'),
      icon: 'label',
      styleType: 'style',
      class: '.uip-input-label',
    },
  ],
};

/**
 * Select input block
 *
 * @since 3.2.13
 */
const Select = {
  name: __('Select', 'uipress-lite'),
  moduleName: 'select-input',
  description: __('A simple textarea input for use with the form block', 'uipress-lite'),
  group: 'form',
  path: './blocks/inputs/select-input.min.js',
  icon: 'fact_check',
  optionsEnabled: [
    //Block options group
    {
      name: 'block',
      label: __('Block options', 'uipress-lite'),
      icon: 'check_box_outline_blank',
      options: [
        {
          option: 'title',
          componentName: 'uip-dynamic-input',
          uniqueKey: 'inputLabel',
          label: __('Label', 'uipress-lite'),
          value: {
            string: __('Select', 'uipress-lite'),
          },
        },
        {
          option: 'textField',
          componentName: 'uip-input',
          uniqueKey: 'inputName',
          label: __('Meta key', 'uipress-lite'),
          args: { metaKey: true },
        },

        {
          option: 'selectOptionCreator',
          componentName: 'select-option-builder',
          value: {
            options: [
              { label: __('Option 1', 'uipress-lite'), name: '' },
              { label: __('Option 2', 'uipress-lite'), name: '' },
            ],
          },
          uniqueKey: 'selectOptions',
          label: __('Select options', 'uipress-lite'),
        },

        {
          option: 'choiceSelect',
          componentName: 'choice-select',
          uniqueKey: 'inputRequired',
          args: {
            options: {
              false: {
                value: false,
                label: __('No', 'uipress-lite'),
              },
              true: {
                value: true,
                label: __('Yes', 'uipress-lite'),
              },
            },
          },
          label: __('Required field', 'uipress-lite'),
          value: { value: false },
        },
      ],
    },

    {
      name: 'style',
      label: __('Style', 'uipress-lite'),
      icon: 'palette',
      styleType: 'style',
    },
    {
      name: 'inputStyle',
      label: __('Select style', 'uipress-lite'),
      icon: 'input',
      styleType: 'style',
      class: '.uip-input',
    },
    {
      name: 'label',
      label: __('Label', 'uipress-lite'),
      icon: 'label',
      styleType: 'style',
      class: '.uip-input-label',
    },
  ],
};

/**
 * Pro placeholders
 *
 * @since 3.2.13
 */
const Radio = {
  name: __('Radio', 'uipress-lite'),
  moduleName: 'uip-radio-input',
  description: __('Outputs a radio type input', 'uipress-lite'),
  group: 'form',
  icon: 'radio_button_checked',
};
const CheckBox = {
  name: __('Checkbox', 'uipress-lite'),
  moduleName: 'uip-checkbox-input',
  description: __('Outputs a checkbox type input', 'uipress-lite'),
  group: 'form',
  icon: 'check_box',
};
const ImageSelect = {
  name: __('Image select', 'uipress-lite'),
  moduleName: 'uip-image-select-input',
  description: __('Outputs a image select input', 'uipress-lite'),
  group: 'form',
  icon: 'image',
};
const DateRange = {
  name: __('Date range', 'uipress-lite'),
  moduleName: 'uip-date-range',
  description: __('Outputs a date range input. Can be a single date, date range, or a comparison date range', 'uipress-lite'),
  group: 'form',
  icon: 'date_range',
};
const ColorSelect = {
  name: __('Colour select', 'uipress-lite'),
  moduleName: 'uip-colour-select-input',
  description: __('Outputs a colour select input. For use with the form block', 'uipress-lite'),
  group: 'form',
  icon: 'palette',
};

(function () {
  const blocks = [Form, TextInput, TextArea, Select, Radio, CheckBox, ImageSelect, DateRange, ColorSelect];
  wp.hooks.addFilter('uipress.blocks.register', 'uipress', (currentBlocks) => [...currentBlocks, ...blocks]);
})();
