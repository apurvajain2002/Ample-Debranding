export const getInitialResponseTimes = (respType) => {
  switch (respType) {
    case "mcq":
    case "mcr":
      return ["00", "20"];
    case "audio":
    case "codeSnippet":
      return ["02", "00"];
    case "video":
      return ["03", "00"];
    case "probe":
      return ["01", "00"];
    default:
      return ["00", "30"];
  }
};
