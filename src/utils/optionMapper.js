export const optionMapper = (
  arr = [],
  key = "",
  value = "",
  disabledText = "Select",
  disabledTextValue = ""
) => {
  let requiredArray = arr?.map((val) => {
    return { optionKey: val[key], optionValue: val[value] };
  });
  console.log('requiredArray', requiredArray)
  requiredArray = [
    {
      optionKey: disabledText,
      optionValue: disabledTextValue,
    },
    ...requiredArray,
  ];

  return requiredArray;
};

export const optionMapperFns = (
  arr = [],
  getKey = () => {},
  getValue = () => {},
  disabledText = "Select",
  disabledTextValue = ""
) => {
  let requiredArray = arr?.map((val) => {
    return { optionKey: getKey(val), optionValue: getValue(val) };
  });
  requiredArray = [
    {
      optionKey: disabledText,
      optionValue: disabledTextValue,
    },
    ...requiredArray,
  ];

  return requiredArray;
}
