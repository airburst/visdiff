import fsExtra from "fs-extra";
import { FOLDERS } from "../constants.js";

export const emptyFolders = (isGolden) => {
  fsExtra.emptyDirSync(FOLDERS.SCREENSHOTS);
  fsExtra.emptyDirSync(FOLDERS.DIFFS);
  if (isGolden) {
    fsExtra.emptyDirSync(FOLDERS.GOLDEN);
  }
};
