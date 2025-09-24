export const makeCommaSeparated = (arr = []) => {
  const res = arr.map((curVal, index) => {
    if (index === 0) return curVal;
    else return ", " + curVal;
  });
  return res;
};
