import { DOMAINS } from "../constants.js";

const { PPC, NON_PPC } = DOMAINS;

// A page is password protected if it has a PREVIEW domain URI
export const isPasswordProtected = (url = "") => {
  if (url.indexOf(PPC.PREVIEW) > -1 || url.indexOf(NON_PPC.PREVIEW) > -1) {
    return true;
  }
  return false;
};
