// A page is password protected if it has a PREVIEW domain URI
export const isPasswordProtected = (url = "") => url.indexOf("gtsb.io") > -1;
