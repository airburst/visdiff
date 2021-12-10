import { chromium } from "playwright";
import chalk from "chalk";
import log from "./logger.js";
import {
  compareImages,
  makeFileName,
  scrollFullPage,
  emptyFolders,
  Timer,
  chunk,
} from "./utils/index.js";
import { FOLDERS, VIEWPORTS, BATCH_SIZE } from "./constants.js";
// import urlList from "./urlList.js";

const urlList = [
  "https://preview-stagingwwwsimplybusinessc19589.gtsb.io/cs/welcome/yoga-insurance/",
];

// Take a page snapshot for a given url and size
const takeSnapshot = ({ browser, url, viewport, isGolden, timer }) =>
  new Promise(async (resolve) => {
    const page = await browser.newPage();

    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    try {
      await page.goto(url, { waitUntil: "domcontentloaded" });

      // Test whether this page is password-protected

      await scrollFullPage(page);

      const filename = `${makeFileName(url)}-${viewport.width}.png`;
      const path = isGolden
        ? `./${FOLDERS.GOLDEN}/${filename}`
        : `./${FOLDERS.SCREENSHOTS}/${filename}`;

      await page.screenshot({ path, fullPage: true });

      let message = `Created ${isGolden ? "golden " : ""}snapshot ${chalk.cyan(
        filename
      )}`;

      if (!isGolden) {
        const numberOfDiffs = await compareImages(filename);
        const colour = numberOfDiffs > 0 ? chalk.yellow : chalk.green;
        message += colour(` (${numberOfDiffs} diffs)`);
      }
      message += chalk.white(` ${timer.getElapsed()}s`);
      log.info(message);
      resolve();
    } catch (error) {
      if (error.message.indexOf("invalid URL") > -1) {
        log.error(chalk.red(`${url}: URL does not exist`));
      } else {
        log.error(chalk.red(`${filename}: ${error.message}`));
      }
      resolve();
    }
  });

(async () => {
  // handle args
  const args = process.argv.slice(2);
  const isGolden = args?.[0] === "--golden";
  const timer = new Timer();

  await emptyFolders(isGolden);
  log.info(`Generating ${isGolden ? "golden " : ""}snapshots...`);

  const browser = await chromium.launch();

  // Walk through batches of urls
  const batches = chunk(urlList, BATCH_SIZE);

  for (const batch of batches) {
    const batchPromises = batch.flatMap((url) =>
      VIEWPORTS.map((viewport) =>
        takeSnapshot({ browser, url, viewport, isGolden, timer })
      )
    );

    await Promise.all(batchPromises);
  }

  // Clean up
  await browser.close();
  log.info("Snapshots complete");
})();
