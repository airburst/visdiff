import fs from "fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { FOLDERS } from "../constants.js";

export const compareImages = (filename) => {
  if (!filename) {
    return false;
  }
  let goldenImage, currentImage;

  try {
    goldenImage = PNG.sync.read(
      fs.readFileSync(`./${FOLDERS.GOLDEN}/${filename}`)
    );
  } catch (goldenError) {
    throw Error(`Cannot read golden snapshot`);
  }
  try {
    currentImage = PNG.sync.read(
      fs.readFileSync(`./${FOLDERS.SCREENSHOTS}/${filename}`)
    );
  } catch (currentError) {
    throw Error(`Cannot read curren snapshot`);
  }

  const { width, height } = goldenImage;
  const diff = new PNG({ width, height });
  const numberOfDiffs = pixelmatch(
    goldenImage.data,
    currentImage.data,
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
