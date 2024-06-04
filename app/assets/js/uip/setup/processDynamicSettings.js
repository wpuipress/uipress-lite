/**
 * processDynamicSettings.js
 * uipress-lite
 *
 * @since 0.0.1
 */
export function processDynamicSettings(dynamicData) {
  return Object.entries(dynamicData).reduce((acc, [key, currentOption]) => {
    acc[key] = {
      label: currentOption.label,
      value: currentOption.value,
      type: currentOption.type,
      key,
      name: key,
    };
    return acc;
  }, {});
}
