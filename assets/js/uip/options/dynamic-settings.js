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
}
