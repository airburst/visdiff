export const makeFileName = (url) =>
  url.replaceAll(/https:\/\//g, "").replaceAll(/\//g, "-");
