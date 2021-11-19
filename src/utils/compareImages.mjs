import fs from "fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { FOLDERS } from "../constants.mjs";

export const compareImages = (filename) => {
  if (!filename) {
    return false;
  }

  // TODO: throw if no golden image
  const img1 = PNG.sync.read(
    fs.readFileSync(`./${FOLDERS.GOLDEN}/${filename}`)
  );
  const img2 = PNG.sync.read(
    fs.readFileSync(`./${FOLDERS.SCREENSHOTS}/${filename}`)
  );
  const { width, height } = img1;
  const diff = new PNG({ width, height });
  const numberOfDiffs = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    width,
    height,
    {
      threshold: 0.1,
    }
  );

  // Produce a visual diff image if there are any changes
  if (numberOfDiffs > 0) {
    fs.writeFileSync(`./${FOLDERS.DIFFS}/${filename}`, PNG.sync.write(diff));
  }

  return numberOfDiffs;
};
