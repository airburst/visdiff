export * from "./compareImages.js";
export * from "./makeFilename.js";
export * from "./scrollFullPage.js";
export * from "./emptyFolders.js";
export * from "./runBatch.js";
export * from "./isPasswordProtected.js";
export { default as Timer } from "./timer.js";

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));
