///IMPORT TRANSLATIONS
const { __, _x, _n, _nx } = wp.i18n;

export function getSettings(globalDynamic, context) {
  return {
    trueFalse: {
      value: false,
      component: 'switch-select',
      renderStyle(value) {
        return value;
      },
    },
    customMenu: {
      value: 'none',
      component: 'custom-menu-select',
      renderStyle(value) {
        return value;
      },
    },
    title: {
      value: {
        string: __('Press me', 'uipress-lite'),
      },
      component: 'uip-dynamic-input',
      type: String,
      dynamic: true,
    },
    textField: {
      value: '',
      component: 'uip-input',
      type: String,
      dynamic: false,
    },
    textArea: {
      value: '',
      component: 'uip-textarea',
      type: String,
      dynamic: false,
    },
    paragraph: {
      value: __('I am a paragraph', 'uipress-lite'),
      component: 'uip-paragraph-input',
      type: String,
    },
    classes: {
      value: '',
      component: 'uip-classes',
      type: 'classes',
      renderStyle(value) {
        return value;
      },
    },

    imageSelect: {
      dark: true,
      component: 'inline-image-select',
      type: 'option',
      renderStyle(value) {
        return '';
      },
    },
    responsive: {
      value: {
        mobile: false,
        tablet: false,
        desktop: false,
      },
      dark: true,
      component: 'hidden-responsive',
      type: 'style',
      renderStyle(value, windowWidth) {
        let style = '';

        if (value.mobile) {
          if (value.mobile == true && windowWidth < 699) {
            style += 'display:none; ';
          }
        }
        if (value.tablet) {
          if (value.tablet == true && windowWidth < 990 && windowWidth >= 699) {
            style += 'display:none; ';
          }
        }

        if (value.desktop) {
          if (value.desktop == true && windowWidth > 990) {
            style += 'display:none; ';
          }
        }
        return style;
      },
    },
    choiceSelect: {
      value: {},
      component: 'choice-select',
      type: 'style',
      group: __('Style', 'uipress-lite'),
      label: __('Text alignment', 'uipress-lite'),
      renderStyle(value) {
        return '';
      },
    },
    textFormat: {
      args: { modes: ['solid', 'variables'] },
      dark: true,
      component: 'text-format',
      type: 'style',
      renderStyle(value) {
        let style = '';

        //Check for preset
        if (value.size.preset != '' && value.size.preset != 'custom') {
          if (value.size.preset == 'xs') {
            style = 'font-size: var(--uip-text-xs);';
          }
          if (value.size.preset == 'small' || value.size.preset == 'S') {
            style = 'font-size: var(--uip-text-s);';
          }
          if (value.size.preset == 'medium' || value.size.preset == 'M') {
            style = 'font-size: var(--uip-text-m);';
          }
          if (value.size.preset == 'large' || value.size.preset == 'L') {
            style = 'font-size: var(--uip-text-l);';
          }
          if (value.size.preset == 'xl' || value.size.preset == 'XL') {
            style = 'font-size: var(--uip-text-xl);';
          }
        } else if (value.size.value != '') {
          style += 'font-size: ' + value.size.value + value.size.units + ';';
        }
        if (value.lineHeight && value.lineHeight.value != '') {
          style += 'line-height: ' + value.lineHeight.value + value.lineHeight.units + ';';
        }

        if (value.align != '') {
          style += 'text-align: ' + value.align + ';';
        }
        if (value.bold) {
          style += 'font-weight: bold;';
        }
        if (value.italic || value.decoration == 'italic') {
          style += 'font-style: italic;';
        }
        if (value.underline || value.decoration == 'underline') {
          style += 'text-decoration: underline;';
        }
        if (value.strikethrough || value.decoration == 'strikethrough') {
          style += 'text-decoration: line-through;';
        }

        if (value.weight && value.weight != '' && value.weight != 'inherit') {
          style += 'font-weight: ' + value.weight + ';';
        }
        if (value.transform && value.transform != '') {
          style += 'text-transform: ' + value.transform + ';';
        }
        if (value.font && value.font != '') {
          if (value.font != 'custom') {
            style += 'font-family: ' + value.font + ';';
          } else {
            style += 'font-family: ' + value.customName + ';';

            if (value.customURL) {
              ///Create new style import for the custom font
              let exists = document.querySelectorAll(`[uip-font-url="${value.customURL}"]`);
              if (exists.length < 1) {
                const style = document.createElement('style');
                style.setAttribute('uip-font-url', value.customURL);
                style.textContent = `@import url('${value.customURL}');`;
                document.head.appendChild(style);
              }
            }
          }
        }

        let actualValue = value.color.value;
        if (value.color.type == 'variable') {
          actualValue = 'var(' + actualValue + ');';
        }

        if (actualValue != '') {
          style += 'color:  ' + actualValue + ';';
        }
        return style;
      },
    },
    flexLayout: {
      value: {},
      component: 'flex-layout',
      type: 'style',
      renderStyle(value) {
        let style = '';
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
          if (value.type == 'grid') {
            if (!value.responsive) {
              style += `display:grid;`;
              style += `grid-template-columns: repeat(${value.columns}, minmax(${value.columnWidth.value}${value.columnWidth.units}, 1fr));`;
              style += `justify-content: center;`;
              style += `grid-auto-rows: minmax(0, 1fr);`;
              style += `grid-template-rows: repeat(${value.rows}, minmax(0, 1fr));`;
              if ('gap' in value) {
                style += `gap: ${value.gap.value}${value.gap.units};`;
              }
            } else {
              style += `--grid-layout-gap: ${value.gap.value}${value.gap.units};`;
              style += `--grid-column-count:${value.columns};`;
              style += `--grid-item--min-width: ${value.minColumnWidth.value}${value.minColumnWidth.units};`;

              style += '--gap-count: calc(var(--grid-column-count) - 1);';
              style += '--total-gap-width: calc(var(--gap-count) * var(--grid-layout-gap));';
              style += '--grid-item--max-width: calc((100% - var(--total-gap-width)) / var(--grid-column-count));';

              style += 'display:grid;';
              style += 'grid-template-columns: repeat(auto-fill, minmax(max(var(--grid-item--min-width), var(--grid-item--max-width)), 1fr));';
              style += 'grid-gap: var(--grid-layout-gap);grid-auto-rows: min-content;';
            }
          } else if (value.type == 'stack') {
            style += `display:flex;`;
            style += `flex-direction: ${value.direction};`;
            style += `justify-content: ${value.distribute};`;
            style += `align-items: ${value.align};`;
            style += `flex-wrap: ${value.wrap};`;
            style += `align-content: ${value.placeContent};`;
            if ('gap' in value) {
              style += `gap: ${value.gap.value}${value.gap.units};`;
            }
          }
        }
        return style;
      },
    },
    flexWrap: {
      value: {
        value: 'wrap',
      },
      args: {
        options: [
          {
            value: 'wrap',
            label: __('Wrap', 'uipress-lite'),
            icon: 'wrap_text',
          },
          {
            value: 'wrap-reverse',
            label: __('Wrap reverse', 'uipress-lite'),
            icon: 'wrap_text',
            iconRotate: '-180',
          },
        ],
      },
      component: 'icon-choice-select',
      type: 'style',
      renderStyle(value) {
        if (value.value == 'noWrap') {
          return 'flex-wrap: nowrap;';
        }
        if (value.value == 'wrap') {
          return 'flex-wrap: wrap;';
        }
        if (value.value == 'wrap-reverse') {
          return 'flex-wrap: wrap-reverse;';
        }
        return '';
      },
    },
    flexGrow: {
      value: {
        value: 'none',
      },
      args: {
        options: [
          {
            value: 'grow',
            label: __('Grow', 'uipress-lite'),
            icon: 'expand',
          },
          {
            value: 'shrink',
            label: __('Shrink', 'uipress-lite'),
            icon: 'compress',
          },
        ],
      },
      component: 'icon-choice-select',
      type: 'style',
      renderStyle(value) {
        if (value.value == 'grow') {
          return 'flex-grow: 1;';
        }
        if (value.value == 'shrink') {
          return 'flex-shrink: 1;';
        }
        if (value.value == 'none') {
          return '';
        }
        return '';
      },
    },
    flexAlignSelf: {
      value: '',
      args: {
        options: [
          {
            value: 'baseline',
            label: __('Baseline', 'uipress-lite'),
            icon: 'align_vertical_top',
          },
          {
            value: 'center',
            label: __('Center', 'uipress-lite'),
            icon: 'align_vertical_center',
          },
          {
            value: 'end',
            label: __('End', 'uipress-lite'),
            icon: 'align_vertical_bottom',
          },
          {
            value: 'stretch',
            label: __('Stretch', 'uipress-lite'),
            icon: 'expand',
          },
        ],
      },
      component: 'icon-choice-select',
      type: 'style',
      renderStyle(value) {
        if (typeof value === 'undefined') {
          return '';
        }
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
          return 'align-self: ' + value.value + ';';
        }
        if (value != '') {
          return 'align-self: ' + value + ';';
        }
        return '';
      },
    },
    defaultSelect: {
      value: {
        value: '',
      },
      args: { options: [] },
      component: 'default-select',
      type: 'blockOption',
      renderStyle(value) {
        return '';
      },
    },
    flexDirection: {
      value: '',
      args: {
        options: [
          {
            value: 'row',
            label: __('Row', 'uipress-lite'),
            icon: 'view_column_2',
          },
          {
            value: 'column',
            label: __('Column', 'uipress-lite'),
            icon: 'view_column_2',
            iconRotate: '90',
          },
          {
            value: 'row-reverse',
            label: __('Row reverse', 'uipress-lite'),
            icon: 'sync_alt',
          },
          {
            value: 'column-reverse',
            label: __('Column reverse', 'uipress-lite'),
            icon: 'sync_alt',
            iconRotate: '90',
          },
        ],
      },
      component: 'icon-choice-select',
      type: 'style',
      renderStyle(value) {
        if (typeof value === 'undefined') {
          return '';
        }
        let optionValue;
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
          optionValue = value.value;
        } else {
          optionValue = value;
        }

        if (optionValue == 'row') {
          return 'flex-direction: row;';
        }
        if (optionValue == 'column') {
          return 'flex-direction: column;';
        }
        if (optionValue == 'row-reverse') {
          return 'flex-direction: row-reverse;';
        }
        if (optionValue == 'column-reverse') {
          return 'flex-direction: column-reverse;';
        }
        return '';
      },
    },
    stretchDirection: {
      value: {
        value: '',
      },
      args: {
        options: [
          {
            value: 'row',
            label: __('Vertical', 'uipress-lite'),
            icon: 'unfold_more',
          },
          {
            value: 'column',
            label: __('Horizontal', 'uipress-lite'),
            icon: 'unfold_more',
            iconRotate: '90',
          },
        ],
      },
      component: 'icon-choice-select',
      type: 'style',
      renderStyle(value) {
        if (value.value == 'row') {
          return 'flex-direction: row;';
        }
        if (value.value == 'column') {
          return 'flex-direction: column;';
        }
        return '';
      },
    },
    flexJustifyContent: {
      value: '',
      args: {
        options: [
          {
            value: 'left',
            label: __('Start', 'uipress-lite'),
            icon: 'align_horizontal_left',
          },
          {
            value: 'center',
            label: __('Center', 'uipress-lite'),
            icon: 'align_horizontal_center',
          },
          {
            value: 'right',
            label: __('End', 'uipress-lite'),
            icon: 'align_horizontal_right',
          },
          {
            value: 'spaceAround',
            label: __('Space around', 'uipress-lite'),
            icon: 'horizontal_distribute',
          },
          {
            value: 'spaceBetween',
            label: __('Space between', 'uipress-lite'),
            icon: 'expand',
            iconRotate: '90',
          },
          {
            value: 'spaceEvenly',
            label: __('Space evenly', 'uipress-lite'),
            icon: 'horizontal_distribute',
          },
        ],
      },
      component: 'icon-choice-select',
      type: 'style',
      renderStyle(value) {
        if (typeof value === 'undefined') {
          return '';
        }
        let optionValue;
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
          optionValue = value.value;
        } else {
          optionValue = value;
        }
        if (optionValue == 'left') {
          return 'justify-content: start;';
        }
        if (optionValue == 'right') {
          return 'justify-content: end;';
        }
        if (optionValue == 'center') {
          return 'justify-content: center;';
        }
        if (optionValue == 'spaceAround') {
          return 'justify-content: space-around;';
        }
        if (optionValue == 'spaceBetween') {
          return 'justify-content: space-between;';
        }
        if (optionValue == 'spaceBetween') {
          return 'justify-content: space-evenly;';
        }
        return '';
      },
    },
    flexAlignItems: {
      value: 'flex-start',
      args: {
        options: [
          {
            value: 'flex-start',
            label: __('Start', 'uipress-lite'),
            icon: 'align_vertical_top',
          },
          {
            value: 'center',
            label: __('Center', 'uipress-lite'),
            icon: 'align_vertical_center',
          },
          {
            value: 'end',
            label: __('End', 'uipress-lite'),
            icon: 'align_vertical_bottom',
          },
          {
            value: 'stretch',
            label: __('Stretch', 'uipress-lite'),
            icon: 'expand',
          },
        ],
      },
      component: 'icon-choice-select',
      type: 'style',
      renderStyle(value) {
        if (typeof value === 'undefined') {
          return '';
        }
        let optionValue;
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
          optionValue = value.value;
        } else {
          optionValue = value;
        }
        if (optionValue != '') {
          return 'align-items: ' + optionValue + ';';
        }
        return '';
      },
    },

    overFlow: {
      value: '',
      args: {
        options: [
          {
            value: 'auto',
            label: __('Auto', 'uipress-lite'),
          },
          {
            value: 'hidden',
            label: __('Hidden', 'uipress-lite'),
          },
          {
            value: 'scroll',
            label: __('Scroll', 'uipress-lite'),
          },
          {
            value: 'overlay',
            label: __('Overlay', 'uipress-lite'),
          },
          {
            value: 'visible',
            label: __('Visible', 'uipress-lite'),
          },
        ],
      },
      component: 'default-select',
      type: 'style',
      renderStyle(value) {
        if (typeof value !== 'undefined' && value != '') {
          return 'overflow:' + value + ';';
        }

        return '';
      },
    },
    headingType: {
      value: {
        value: 'h2',
      },
      args: {
        options: [
          {
            value: 'h1',
            label: __('H1', 'uipress-lite'),
          },
          {
            value: 'h2',
            label: __('H2', 'uipress-lite'),
          },
          {
            value: 'h3',
            label: __('H3', 'uipress-lite'),
          },
          {
            value: 'h4',
            label: __('H4', 'uipress-lite'),
          },
          {
            value: 'h5',
            label: __('H5', 'uipress-lite'),
          },
          {
            value: 'p',
            label: __('p', 'uipress-lite'),
          },
        ],
      },
      component: 'default-select',
      type: 'blockOption',
      renderStyle(value) {
        if (value == '') {
          return 'h1';
        } else {
          return value;
        }
        return '';
      },
    },
    postTypeSelect: {
      value: ['post'],
      component: 'post-types',
      type: 'blockOption',
      renderStyle(value) {
        return '';
      },
    },
    postMetaSelect: {
      value: [],
      component: 'post-meta',
      type: 'blockOption',
      renderStyle(value) {
        return '';
      },
    },
    valueUnits: {
      value: {
        value: '',
        units: '%',
      },
      component: 'value-units',
      type: 'blockOptions',
      renderStyle(value) {
        return value;
      },
    },
    number: {
      value: '',
      component: 'uip-number',
      type: 'blockOptions',
      renderStyle(value) {
        return value;
      },
    },
    columnGap: {
      value: {
        value: '',
        units: '%',
      },
      component: 'value-units',
      type: 'style',
      renderStyle(value) {
        if (value.value != '') {
          return 'column-gap: ' + value.value + value.units + ';';
        }
        return '';
      },
    },
    tabCreator: {
      value: {
        tabs: [
          { name: __('Tab', 'uipress-lite'), id: '' },
          { name: __('Another tab', 'uipress-lite'), id: '' },
        ],
      },
      component: 'tab-builder',
      type: 'blockSpecific',
      renderStyle(value) {
        return value;
      },
    },
    rowGap: {
      value: {
        value: '',
        units: '%',
      },
      component: 'value-units',
      type: 'style',
      renderStyle(value) {
        if (value.value != '') {
          return 'row-gap: ' + value.value + value.units + ';';
        }
        return '';
      },
    },
    subMenuStyle: {
      value: {
        value: 'dynamic',
      },
      args: {
        options: [
          {
            value: 'inline',
            label: __('Inline', 'uipress-lite'),
          },
          {
            value: 'hover',
            label: __('Hover', 'uipress-lite'),
          },
          {
            value: 'dynamic',
            label: __('Dynamic', 'uipress-lite'),
          },
        ],
      },
      component: 'choice-select',
      type: 'blockOption',
      renderStyle(value) {
        return '';
      },
    },
    multiSelect: {
      value: [],
      component: 'multi-select-option',
      type: 'blockOption',
      renderStyle(value) {
        return '';
      },
    },
    customCode: {
      value: '',
      component: 'code-editor',
      type: 'blockOption',
      renderStyle(value) {
        return '';
      },
    },
    hiddenMenuItems: {
      value: [],
      component: 'hiden-menu-items-select',
      type: 'adminMenuOption',
      renderStyle(value) {
        return '';
      },
    },
    hiddenToolbarItems: {
      value: [],
      component: 'hiden-toolbar-items-select',
      type: 'toolbarOption',
      renderStyle(value) {
        return '';
      },
    },
    editToolbarItems: {
      value: {},
      component: 'edit-toolbar-items',
      type: 'toolbarOption',
      renderStyle(value) {
        return '';
      },
    },
    editMenuItems: {
      value: {},
      component: 'edit-menu-items',
      type: 'menuOption',
      renderStyle(value) {
        return '';
      },
    },
    horizontalAlign: {
      value: {
        value: '',
      },
      args: {
        options: [
          {
            value: 'left',
            label: __('Left', 'uipress-lite'),
            icon: 'align_horizontal_left',
          },
          {
            value: 'center',
            label: __('Center', 'uipress-lite'),
            icon: 'align_horizontal_center',
          },
          {
            value: 'right',
            label: __('Right', 'uipress-lite'),
            icon: 'align_horizontal_right',
          },
        ],
      },
      component: 'icon-choice-select',
      type: 'style',
      renderStyle(value) {
        if (value.value == 'left') {
          return 'margin-right:auto;';
        }
        if (value.value == 'right') {
          return 'margin-left:auto;align-self: flex-end;';
        }
        if (value.value == 'center') {
          return 'margin-right:auto;margin-left:auto;align-self: center;';
        }
        return '';
      },
    },
    verticalAlign: {
      value: {
        value: '',
      },
      args: {
        options: [
          {
            value: 'top',
            label: __('Top', 'uipress-lite'),
            icon: 'align_vertical_top',
          },
          {
            value: 'center',
            label: __('Center', 'uipress-lite'),
            icon: 'align_vertical_center',
          },
          {
            value: 'bottom',
            label: __('Bottom', 'uipress-lite'),
            icon: 'align_vertical_bottom',
          },
        ],
      },
      component: 'icon-choice-select',
      type: 'style',
      renderStyle(value) {
        if (value.value == 'top') {
          return 'margin-bottom: auto;';
        }
        if (value.value == 'bottom') {
          return 'margin-top: auto;';
        }
        if (value.value == 'center') {
          return 'margin-top: auto;margin-bottom: auto;';
        }
        return '';
      },
    },
    dimensions: {
      component: 'dimensions',
      type: 'style',
      renderStyle(value) {
        let style = '';

        if (typeof value === 'undefined') {
          return '';
        }

        let width = uipcheckNestedValue(value, ['width', 'value']);
        let widthUnits = uipcheckNestedValue(value, ['width', 'units']);
        if (width && widthUnits) {
          style += `width:${width}${widthUnits};`;
        }

        let maxWidth = uipcheckNestedValue(value, ['maxWidth', 'value']);
        let maxWidthUnits = uipcheckNestedValue(value, ['maxWidth', 'units']);
        if (maxWidth && maxWidthUnits) {
          style += `max-width:${maxWidth}${maxWidthUnits};`;
        }

        let minWidth = uipcheckNestedValue(value, ['minWidth', 'value']);
        let minWidthUnits = uipcheckNestedValue(value, ['minWidth', 'units']);
        if (minWidth && minWidthUnits) {
          style += `min-width:${minWidth}${minWidthUnits};`;
        }

        let height = uipcheckNestedValue(value, ['height', 'value']);
        let heightUnits = uipcheckNestedValue(value, ['height', 'units']);
        if (height && heightUnits) {
          style += `height:${height}${heightUnits};`;
        }

        let minHeight = uipcheckNestedValue(value, ['minHeight', 'value']);
        let minHeightUnits = uipcheckNestedValue(value, ['minHeight', 'units']);
        if (minHeight && minHeightUnits) {
          style += `min-height:${minHeight}${minHeightUnits};`;
        }

        let maxHeight = uipcheckNestedValue(value, ['maxHeight', 'value']);
        let maxHeightUnits = uipcheckNestedValue(value, ['maxHeight', 'units']);
        if (maxHeight && maxHeightUnits) {
          style += `max-height:${maxHeight}${maxHeightUnits};`;
        }

        let grow = uipcheckNestedValue(value, ['grow']);
        if (grow == 'grow') {
          style += `flex-grow:1;`;
        }

        let shrink = uipcheckNestedValue(value, ['flexShrink']);
        if (shrink == 'shrink') {
          style += `flex-shrink:1;`;
        }
        if (shrink == 'none') {
          style += `flex-shrink:0;`;
        }

        return style;
      },
    },
    backgroundPosition: {
      component: 'background-position',
      type: 'style',
      renderStyle(value) {
        let style = '';

        if (typeof value === 'undefined') {
          return '';
        }

        if ('position' in value) {
          if (value.position != '') {
            style += 'background-position: ' + value.position + ';';
          }
        }
        if ('repeat' in value) {
          if (value.repeat != '') {
            style += 'background-repeat: ' + value.repeat + ';';
          }
        }
        if ('size' in value) {
          if (value.size != '') {
            style += 'background-size: ' + value.size + ';';
          }
        }
        return style;
      },
    },
    styles: {
      component: 'style-designer',
      type: 'style',
      renderStyle(value) {
        //uipcheckNestedValue(Option, [''])

        if (typeof value === undefined) {
          return;
        }

        let style = '';
        let opacity = uipcheckNestedValue(value, ['opacity']);
        let overflow = uipcheckNestedValue(value, ['overflow']);
        let fill = uipcheckNestedValue(value, ['fill']);
        let fillColour = uipcheckNestedValue(value, ['fill', 'value']);
        let imgUrl = uipcheckNestedValue(value, ['backgroundImage', 'url']);
        let img = uipcheckNestedValue(value, ['backgroundImage']);
        let borders = uipcheckNestedValue(value, ['borders']);
        let shadows = uipcheckNestedValue(value, ['shadows']);
        let bgPosition = uipcheckNestedValue(value, ['backgroundImage', 'sizing', 'position']);
        let bgRepeat = uipcheckNestedValue(value, ['backgroundImage', 'sizing', 'repeat']);
        let bgSize = uipcheckNestedValue(value, ['backgroundImage', 'sizing', 'size']);
        let masterBorderRadius = uipcheckNestedValue(value, ['radius']);

        let outlineStyle = uipcheckNestedValue(value, ['outline', 'style']);
        let outlineWidth = uipcheckNestedValue(value, ['outline', 'width', 'value']);
        let outlineWidthUnits = uipcheckNestedValue(value, ['outline', 'width', 'units']);
        let outlineOffset = uipcheckNestedValue(value, ['outline', 'offset', 'value']);
        let outlineOffsetUnits = uipcheckNestedValue(value, ['outline', 'offset', 'units']);
        let outlineColor = uipcheckNestedValue(value, ['outline', 'color', 'value']);
        let outlineColorType = uipcheckNestedValue(value, ['outline', 'color', 'type']);

        if (outlineStyle && outlineWidth && outlineColor) {
          let outlineCol = outlineColor;
          if (outlineColorType == 'variable') {
            outlineCol = 'var(' + outlineColor + ');';
          }

          style += `outline:${outlineWidth}${outlineWidthUnits} ${outlineStyle} ${outlineCol};`;

          if (outlineOffset) {
            style += `outline-offset:${outlineOffset}${outlineOffsetUnits};`;
          }
        }

        //Opacity
        if (opacity) {
          style += `opacity: ${opacity};`;
        }

        //Overflow
        if (overflow) {
          style += `overflow: ${overflow};`;
        }

        //Background colour
        if (fillColour) {
          if (fill.type == 'variable') {
            fillColour = 'var(' + fillColour + ');';
          }

          if (fill.type == 'gradient' || fill.type == 'linear' || fill.type == 'radial' || fillColour.includes('gradient')) {
            style += 'background:  ' + fillColour + ';';
          } else {
            style += 'background-color:  ' + fillColour + ';';
          }
        }

        //BackgroundImage
        if (imgUrl) {
          //Get dynamic key
          if (img.dynamic) {
            if (img.dynamicKey in globalDynamic) {
              imgUrl = globalDynamic[img.dynamicKey].value;
            }
          }
          style += `background-image: url(${imgUrl});`;

          if (bgPosition) {
            style += `background-position:${bgPosition};`;
          }
          if (bgRepeat) {
            style += `background-repeat: ${bgRepeat};`;
          }
          if (bgSize) {
            style += `background-size: ${bgSize};`;
          } else {
            style += `background-size: contain;`;
          }
        }

        //Borders
        if (borders) {
          if (Array.isArray(borders)) {
            for (const border of borders) {
              let borderColor = uipcheckNestedValue(border, ['color', 'value']);
              let borderColorType = uipcheckNestedValue(border, ['color', 'type']);
              let borderPosition = uipcheckNestedValue(border, ['position']);
              let borderStyle = uipcheckNestedValue(border, ['style']);
              let borderWidth = uipcheckNestedValue(border, ['width', 'value']);
              let borderUnits = uipcheckNestedValue(border, ['width', 'units']);
              let borderRadius = uipcheckNestedValue(border, ['radius', 'value']);

              //If there is a border color then output border
              if (borderColor && borderWidth && borderUnits) {
                let borderPos;
                if (borderPosition == 'solid') {
                  borderPos = 'border:';
                }
                if (borderPosition == 'left') {
                  borderPos = 'border-left:';
                }
                if (borderPosition == 'right') {
                  borderPos = 'border-right:';
                }
                if (borderPosition == 'top') {
                  borderPos = 'border-top:';
                }
                if (borderPosition == 'bottom') {
                  borderPos = 'border-bottom:';
                }

                if (borderColorType == 'variable') {
                  borderColor = 'var(' + borderColor + ');';
                }

                style += borderPos + borderWidth + borderUnits + ' ' + borderStyle + ' ' + borderColor + ';';
              }

              //Border radius
              if (borderRadius) {
                if (borderRadius.sync && borderRadius.topleft != '') {
                  style += 'border-radius: ' + borderRadius.topleft + borderRadius.units + ';';
                } else {
                  if (borderRadius.topleft) {
                    style +=
                      'border-radius: ' +
                      borderRadius.topleft +
                      borderRadius.units +
                      ' ' +
                      borderRadius.topright +
                      borderRadius.units +
                      ' ' +
                      borderRadius.bottomright +
                      borderRadius.units +
                      ' ' +
                      borderRadius.bottomleft +
                      borderRadius.units +
                      ';';
                  }
                }
              }
              //End border radius
            }
          }
        }

        //Master Border radius
        if (masterBorderRadius) {
          if (masterBorderRadius.sync && masterBorderRadius.topleft != '') {
            style += 'border-radius: ' + masterBorderRadius.topleft + masterBorderRadius.units + ';';
          } else {
            if (masterBorderRadius.topleft) {
              style +=
                'border-radius: ' +
                masterBorderRadius.topleft +
                masterBorderRadius.units +
                ' ' +
                masterBorderRadius.topright +
                masterBorderRadius.units +
                ' ' +
                masterBorderRadius.bottomright +
                masterBorderRadius.units +
                ' ' +
                masterBorderRadius.bottomleft +
                masterBorderRadius.units +
                ';';
            }
          }
        }
        //End Master border radius

        //Shadows
        let formattedShadows = '';
        let formattedInsideShadows = [];
        if (shadows) {
          if (Array.isArray(shadows)) {
            for (const shadow of shadows) {
              let shadowColour = uipcheckNestedValue(shadow, ['color', 'value']);
              let shadowColourType = uipcheckNestedValue(shadow, ['color', 'type']);
              let horiz = uipcheckNestedValue(shadow, ['verticalDistance', 'value']);
              let vert = uipcheckNestedValue(shadow, ['verticalDistance', 'value']);
              let blur = uipcheckNestedValue(shadow, ['blur', 'value']);
              let position = uipcheckNestedValue(shadow, ['position']);

              if (shadowColour) {
                if (!horiz || !vert || !blur) {
                  continue;
                }

                if (shadowColourType == 'variable') {
                  shadowColour = 'var(' + shadowColour + ')';
                }

                if (position == 'inside') {
                  formattedInsideShadows.push(`inset ${horiz}px ${vert}px ${blur}px 0 ${shadowColour}`);
                } else {
                  formattedShadows += `drop-shadow(${horiz}px ${vert}px ${blur}px ${shadowColour}) `;
                }
              }
              //End border radius
            }
            if (formattedShadows != '') {
              style += '-webkit-filter:' + formattedShadows + ';';
              style += 'filter:' + formattedShadows + ';';
            }

            if (formattedInsideShadows.length > 0) {
              style += 'box-shadow:' + formattedInsideShadows.join(',');
            }
          }
        }

        return style;
      },
    },
    padding: {
      component: 'uip-padding',
      type: 'style',
      renderStyle(value) {
        let style = '';
        //Presets
        if (value.preset != '' && value.preset != 'custom') {
          if (value.preset == 'remove') {
            style = 'padding: 0;';
          }
          if (value.preset == 'xs') {
            style = 'padding: var(--uip-padding-xxs);';
          }
          if (value.preset == 'small') {
            style = 'padding: var(--uip-padding-xs);';
          }
          if (value.preset == 'medium') {
            style = 'padding: var(--uip-padding-s);';
          }
          if (value.preset == 'large') {
            style = 'padding: var(--uip-padding-m);';
          }
          if (value.preset == 'xl') {
            style = 'padding: var(--uip-padding-l);';
          }
        }
        //Custom
        if (value.preset != '' && value.preset == 'custom' && value.sync != false) {
          style = 'padding:' + value.left + value.units + ';';
        }
        //Custom per side
        if (value.preset != '' && value.preset == 'custom' && value.sync != true) {
          if (!isNaN(parseFloat(value.left)) && isFinite(value.left)) {
            style += 'padding-left:' + value.left + value.units + ';';
          }
          if (!isNaN(parseFloat(value.right)) && isFinite(value.right)) {
            style += 'padding-right:' + value.right + value.units + ';';
          }
          if (!isNaN(parseFloat(value.top)) && isFinite(value.top)) {
            style += 'padding-top:' + value.top + value.units + ';';
          }
          if (!isNaN(parseFloat(value.bottom)) && isFinite(value.bottom)) {
            style += 'padding-bottom:' + value.bottom + value.units + ';';
          }
        }

        return style;
      },
    },
    spacing: {
      component: 'uip-spacing',
      type: 'style',
      renderStyle(value) {
        let stylePad = '';
        let styleMar = '';
        let padding = value.padding;
        let margin = value.margin;

        //Padding
        if (padding) {
          if (padding.preset != '' && padding.preset != 'custom') {
            if (padding.preset == '0') stylePad = 'padding: 0;';

            if (padding.preset == 'XS') stylePad = 'padding: var(--uip-padding-xxs);';

            if (padding.preset == 'S') stylePad = 'padding: var(--uip-padding-xs);';

            if (padding.preset == 'M') stylePad = 'padding: var(--uip-padding-s);';

            if (padding.preset == 'L') stylePad = 'padding: var(--uip-padding-m);';

            if (padding.preset == 'XL') stylePad = 'padding: var(--uip-padding-l);';
          }
          //Custom
          if (padding.preset != '' && padding.preset == 'custom' && padding.sync != false) {
            stylePad = 'padding:' + padding.left + padding.units + ';';
          }
          //Custom per side
          if (padding.preset != '' && padding.preset == 'custom' && padding.sync != true) {
            if (!isNaN(parseFloat(padding.left)) && isFinite(padding.left)) {
              stylePad += 'padding-left:' + padding.left + padding.units + ';';
            }
            if (!isNaN(parseFloat(padding.right)) && isFinite(padding.right)) {
              stylePad += 'padding-right:' + padding.right + padding.units + ';';
            }
            if (!isNaN(parseFloat(padding.top)) && isFinite(padding.top)) {
              stylePad += 'padding-top:' + padding.top + padding.units + ';';
            }
            if (!isNaN(parseFloat(padding.bottom)) && isFinite(padding.bottom)) {
              stylePad += 'padding-bottom:' + padding.bottom + padding.units + ';';
            }
          }
        }

        //Margin
        if (margin) {
          if (margin.preset != '' && margin.preset != 'custom') {
            if (margin.preset == '0') styleMar = 'margin: 0;';

            if (margin.preset == 'XS') styleMar = 'margin: var(--uip-margin-xxs);';

            if (margin.preset == 'S') styleMar = 'margin: var(--uip-margin-xs);';

            if (margin.preset == 'M') styleMar = 'margin: var(--uip-margin-s);';

            if (margin.preset == 'L') styleMar = 'margin: var(--uip-margin-m);';

            if (margin.preset == 'XL') styleMar = 'margin: var(--uip-margin-l);';
          }
          //Custom
          if (margin.preset != '' && margin.preset == 'custom' && margin.sync != false) {
            styleMar = 'margin:' + margin.left + margin.units + ';';
          }
          //Custom per side
          if (margin.preset != '' && margin.preset == 'custom' && margin.sync != true) {
            if (!isNaN(parseFloat(margin.left)) && isFinite(margin.left)) {
              styleMar += 'margin-left:' + margin.left + margin.units + ';';
            }
            if (!isNaN(parseFloat(margin.right)) && isFinite(margin.right)) {
              styleMar += 'margin-right:' + margin.right + margin.units + ';';
            }
            if (!isNaN(parseFloat(margin.top)) && isFinite(margin.top)) {
              styleMar += 'margin-top:' + margin.top + margin.units + ';';
            }
            if (!isNaN(parseFloat(margin.bottom)) && isFinite(margin.bottom)) {
              styleMar += 'margin-bottom:' + margin.bottom + margin.units + ';';
            }
          }
        }
        let fullStyle = stylePad + styleMar;
        return fullStyle;
      },
    },
    margin: {
      component: 'uip-margin',
      type: 'style',
      renderStyle(value) {
        let style = '';
        //Presets
        if (value.preset != '' && value.preset != 'custom') {
          if (value.preset == 'remove') {
            style = 'margin: 0;';
          }
          if (value.preset == 'xs') {
            style = 'margin: var(--uip-margin-xxs);';
          }
          if (value.preset == 'small') {
            style = 'margin: var(--uip-margin-xs);';
          }
          if (value.preset == 'medium') {
            style = 'margin: var(--uip-margin-s);';
          }
          if (value.preset == 'large') {
            style = 'margin: var(--uip-margin-m);';
          }
          if (value.preset == 'xl') {
            style = 'margin: var(--uip-margin-l);';
          }
        }
        //Custom
        if (value.preset != '' && value.preset == 'custom' && value.sync != false) {
          style = 'margin:' + value.left + value.units + ';';
        }
        //Custom per side
        if (value.preset != '' && value.preset == 'custom' && value.sync != true) {
          style += 'margin-left:' + value.left + value.units + ';';
          style += 'margin-right:' + value.right + value.units + ';';
          style += 'margin-top:' + value.top + value.units + ';';
          style += 'margin-bottom:' + value.bottom + value.units + ';';
        }

        return style;
      },
    },
    colorSelect: {
      args: { modes: ['solid', 'gradient', 'variables'] },
      dark: true,
      component: 'color-select',
      type: 'style',
      renderStyle(value) {
        let actualValue = value.value;

        if (typeof actualValue === 'undefined') {
          return;
        }

        if (value.type == 'variable') {
          actualValue = 'var(' + actualValue + ')';
        }

        if (actualValue == '') {
          return '';
        }

        if (value.type == 'gradient' || value.type == 'linear' || value.type == 'radial' || actualValue.includes('gradient')) {
          return 'background:  ' + actualValue + ';';
        }

        if (actualValue != '' && value.type != 'gradient') {
          return 'background-color:  ' + actualValue + ';';
        }
        return '';
      },
    },
    simpleColorPicker: {
      component: 'simple-color-picker',
      type: 'blockOption',
      renderStyle(value) {
        return '';
      },
    },
    iconSelect: {
      component: 'icon-select',
      renderStyle(value) {
        return value.value;
      },
    },

    linkSelect: {
      component: 'link-select',
      renderStyle(value) {
        return value;
      },
    },
    iconPosition: {
      args: {
        options: {
          left: {
            value: 'left',
            label: __('Left', 'uipress-lite'),
          },
          right: {
            value: 'right',
            label: __('Right', 'uipress-lite'),
          },
        },
      },
      component: 'choice-select',
      renderStyle(value) {
        return value.value;
      },
    },
    positionDesigner: {
      component: 'position-designer',
      type: 'style',
      renderStyle(value) {
        if (typeof value === undefined) {
          return;
        }

        let style = '';
        let position = uipcheckNestedValue(value, ['position']);
        let display = uipcheckNestedValue(value, ['display']);
        let offsetLeft = uipcheckNestedValue(value, ['offset', 'left']);
        let offsetRight = uipcheckNestedValue(value, ['offset', 'right']);
        let offsetTop = uipcheckNestedValue(value, ['offset', 'top']);
        let offsetBottom = uipcheckNestedValue(value, ['offset', 'bottom']);
        let offsetUnits = uipcheckNestedValue(value, ['offset', 'units']);
        let verticalAlign = uipcheckNestedValue(value, ['verticalAlign']);
        let horizontalAlign = uipcheckNestedValue(value, ['horizontalAlign']);
        let zIndex = uipcheckNestedValue(value, ['zIndex']);

        if (position) {
          style += 'position:' + position + ';';
        }
        if (display) {
          style += 'display:' + display + ';';
        }

        if (zIndex || zIndex === '0') {
          style += 'z-index:' + zIndex + ';';
        }

        if (offsetUnits) {
          if (offsetLeft) {
            style += 'left:' + offsetLeft + offsetUnits + ';';
          }

          if (offsetRight) {
            style += 'right:' + offsetRight + offsetUnits + ';';
          }

          if (offsetTop) {
            style += 'top:' + offsetTop + offsetUnits + ';';
          }

          if (offsetBottom) {
            style += 'bottom:' + offsetBottom + offsetUnits + ';';
          }
        }

        if (verticalAlign) {
          if (verticalAlign == 'top') {
            style += 'margin-bottom: auto;';
          }
          if (verticalAlign == 'bottom') {
            style += 'margin-top: auto;';
          }
          if (verticalAlign == 'center') {
            style += 'margin-top: auto;margin-bottom: auto;';
          }
        }
        if (horizontalAlign) {
          if (horizontalAlign == 'left') {
            style += 'margin-right:auto;';
          }
          if (horizontalAlign == 'right') {
            style += 'margin-left:auto;align-self: flex-end;';
          }
          if (horizontalAlign == 'center') {
            style += 'margin-right:auto;margin-left:auto;align-self: center;';
          }
        }

        return style;
      },
    },
    effectsDesigner: {
      component: 'uip-effects',
      type: 'style',
      renderStyle(value) {
        if (typeof value === undefined) {
          return;
        }

        let style = '';
        let transform = '';
        let filters = '';

        let translateX = uipcheckNestedValue(value, ['transform', 'translateX', 'value']);
        let translateXunits = uipcheckNestedValue(value, ['transform', 'translateX', 'units']);
        if (translateX && translateXunits) {
          transform += `translateX(${translateX}${translateXunits}) `;
        }

        let translateY = uipcheckNestedValue(value, ['transform', 'translateY', 'value']);
        let translateYunits = uipcheckNestedValue(value, ['transform', 'translateY', 'units']);
        if (translateY && translateYunits) {
          transform += `translateY(${translateY}${translateYunits}) `;
        }

        let scaleX = uipcheckNestedValue(value, ['transform', 'scaleX']);
        if (scaleX) {
          transform += `scaleX(${scaleX}) `;
        }

        let scaleY = uipcheckNestedValue(value, ['transform', 'scaleY']);
        if (scaleY) {
          transform += `scaleY(${scaleY}) `;
        }

        let rotateX = uipcheckNestedValue(value, ['transform', 'rotateX']);
        if (rotateX) {
          transform += `rotateX(${rotateX}deg) `;
        }

        let rotateY = uipcheckNestedValue(value, ['transform', 'rotateY']);
        if (rotateY) {
          transform += `rotateY(${rotateY}deg) `;
        }

        let rotateZ = uipcheckNestedValue(value, ['transform', 'rotateZ']);
        if (rotateZ) {
          transform += `rotateZ(${rotateZ}deg) `;
        }

        let skewX = uipcheckNestedValue(value, ['transform', 'skewX']);
        if (skewX) {
          transform += `skewX(${skewX}deg) `;
        }

        let skewY = uipcheckNestedValue(value, ['transform', 'skewY']);
        if (skewY) {
          transform += `skewY(${skewY}deg) `;
        }

        if (transform != '') {
          style += `transform:${transform};`;
        }

        //mixBlendMode
        let mixBlendMode = uipcheckNestedValue(value, ['filters', 'mixBlendMode']);
        if (mixBlendMode) {
          style += `mix-blend-mode:${mixBlendMode};`;
        }

        //grayscale
        let grayscale = uipcheckNestedValue(value, ['filters', 'grayscale']);
        if (grayscale) {
          filters += `grayscale(${grayscale}) `;
        }

        //blur
        let blur = uipcheckNestedValue(value, ['filters', 'blur']);
        if (blur) {
          filters += `blur(${blur}px) `;
        }

        //saturate
        let saturate = uipcheckNestedValue(value, ['filters', 'saturate']);
        if (saturate) {
          filters += `saturate(${saturate}) `;
        }

        //contrast
        let contrast = uipcheckNestedValue(value, ['filters', 'contrast']);
        if (contrast) {
          filters += `contrast(${contrast}) `;
        }

        //backdropBlur
        let backdropBlur = uipcheckNestedValue(value, ['filters', 'backdropBlur']);
        if (backdropBlur) {
          style += `backdrop-filter:blur(${backdropBlur}px);`;
        }

        if (filters != '') {
          style += `filter:${filters};`;
        }

        //Transition animations
        let transitionType = uipcheckNestedValue(value, ['transitionType']);
        let transitionTime = uipcheckNestedValue(value, ['transitionTime']);
        let transitionDelay = uipcheckNestedValue(value, ['transitionDelay']);
        let cursor = uipcheckNestedValue(value, ['cursor']);
        if (transitionType && transitionTime) {
          style += `transition:all ${transitionType} ${transitionTime}s;`;
        }
        if (transitionDelay) {
          style += `transition-delay: ${transitionDelay}s;`;
        }
        if (cursor) {
          style += `cursor: ${cursor};`;
        }

        return style;
      },
    },

    border: {
      component: 'border-designer',
      type: 'style',
      dark: true,
      renderStyle(value) {
        let style = '';
        let borderPos = '';

        if (value.color.value != '') {
          if (value.position == 'solid') {
            borderPos = 'border:';
          }
          if (value.position == 'left') {
            borderPos = 'border-left:';
          }
          if (value.position == 'right') {
            borderPos = 'border-right:';
          }
          if (value.position == 'top') {
            borderPos = 'border-top:';
          }
          if (value.position == 'bottom') {
            borderPos = 'border-bottom:';
          }
        }

        if (value.radius.value) {
          if (value.radius.value.sync && value.radius.value.topleft != '') {
            style += 'border-radius: ' + value.radius.value.topleft + value.radius.value.units + ';';
          } else {
            if (value.radius.value) {
              if (value.radius.value.topleft) {
                style +=
                  'border-radius: ' +
                  value.radius.value.topleft +
                  value.radius.value.units +
                  ' ' +
                  value.radius.value.topright +
                  value.radius.value.units +
                  ' ' +
                  value.radius.value.bottomright +
                  value.radius.value.units +
                  ' ' +
                  value.radius.value.bottomleft +
                  value.radius.value.units +
                  ';';
              }
            }
          }
        }

        let actualValue = value.color.value;
        if (value.color.type == 'variable') {
          actualValue = 'var(' + actualValue + ');';
        }

        if (value.width.value && value.width.units && value.style && value.color.value) {
          style += borderPos + value.width.value + value.width.units + ' ' + value.style + ' ' + actualValue + ';';
        }

        return style;
      },
    },
    shadow: {
      dark: true,
      component: 'shadow-designer',
      type: 'style',
      group: __('Shadow', 'uipress-lite'),
      label: __('Box shadow', 'uipress-lite'),
      renderStyle(value) {
        return;
        let style = '';
        let borderPos = '';

        if (value.color.value != '') {
          let horiz = value.horizDistance.value;
          let vert = value.verticalDistance.value;
          let blur = value.blur.value;

          if (typeof horiz === 'undefined' || typeof vert === 'undefined' || typeof blur === 'undefined') {
            return '';
          }

          let actualColor = value.color.value + ';';
          if (value.color.type == 'variable') {
            actualColor = 'var(' + value.color.value + ');';
          }

          style += 'box-shadow: ' + value.horizDistance.value + value.horizDistance.units;
          style += ' ' + value.verticalDistance.value + value.verticalDistance.units;
          style += ' ' + value.blur.value + value.blur.units;
          style += ' ' + value.spread.value + value.spread.units;
          style += ' ' + actualColor + ';';
        }
        return style;
      },
    },
    submitAction: {
      value: {
        action: '',
        emailAddress: '',
        emailSubject: '',
        emailTemplate: '',
        siteOptionName: '',
        phpFunction: '',
        objectOrSingle: '',
        userMetaObjectKey: '',
        redirectURL: [],
      },
      component: 'submit-actions',
      type: 'blockOption',
      renderStyle(value) {
        return;
      },
    },
    selectOptionCreator: {
      value: {
        options: [
          { label: __('Option 1', 'uipress-lite'), name: '' },
          { label: __('Option 2', 'uipress-lite'), name: '' },
        ],
      },
      component: 'select-option-builder',
      type: 'blockSpecific',
      renderStyle(value) {
        return value;
      },
    },
  };
}

/**
 * Helper classes for checking deep nested values
 * @since 3.0.0
 */

function uipcheckNestedValue(option, values) {
  let holder = option;

  for (const nest of values) {
    if (!uipisObject(holder)) {
      return false;
    }

    if (holder[nest]) {
      holder = holder[nest];
    } else {
      return false;
    }
  }

  return holder;
}

/**
 * Checks if given item is object
 * @since 3.0.0
 * Accepts anything
 */
function uipisObject(obj) {
  if (obj && typeof obj === 'object' && obj.constructor === Object) {
    return true;
  }
  return false;
}
