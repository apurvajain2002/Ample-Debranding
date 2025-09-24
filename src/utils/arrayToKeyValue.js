export const arrayToKeyValue = (
  arr = [],
  disabledText = "Select",
  disabledTextValue = ""
) => {
  let requiredArray = arr?.map((val) => {
    return { optionKey: val, optionValue: val };
  });
  requiredArray = [
    {
      optionKey: disabledText,
      optionValue: disabledTextValue,
    },
    ...requiredArray,
  ];
  return requiredArray;
};
