const replaceAll = (string, search, replace) => {
  return string.split(search).join(replace);
};

// The Node 16 way
// export const makeFileName = (url) =>
//   url.replaceAll(/https:\/\//g, "").replaceAll(/\//g, "-");

// Uses Node 14 compliant function to replace all
export const makeFileName = (url) => {
  const withoutHttps = replaceAll(url, /https:\/\//g, "");

  return replaceAll(withoutHttps, /\//g, "-");
};
