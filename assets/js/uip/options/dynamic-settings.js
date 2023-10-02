export function processSettings(dynamicData) {
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
