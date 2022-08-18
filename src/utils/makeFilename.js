const replaceAll = (string, search, replace) => {
  return string.split(search).join(replace);
};

// The Node 16 way
// export const makeFileName = (url) =>
//   url.replaceAll(/https:\/\//g, "").replaceAll(/\//g, "-");

// Uses Node 14 compliant function to replace all
export const makeFileName = (url = "") => {
  if (url === "") {
    return "home";
  }

  const withoutHttps = replaceAll(url, /https:\/\//g, "");
  const withoutLeadingSlash = withoutHttps.slice(1);

  return replaceAll(withoutLeadingSlash, /\//g, "-");
};
