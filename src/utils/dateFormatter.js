export const dateFormatter = (date) => {
  return date?.split("/").reverse()?.join("-");
};

export const dateFormatterForTimeZone = (date) => {
  if (!date) return null;
  return date?.split("T")[0].replaceAll("/", "-");
};

export function formatDateToDDMMYYYY(date) {
  if (!date) return null;
  const [yyyy, mm, dd] = date?.split("-");
  return `${dd}/${mm}/${yyyy}`;
}