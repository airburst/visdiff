import { chromium } from "playwright";
import chalk from "chalk";
import log from "./logger.js";
import { compareImages, makeFileName, scrollFullPage } from "./utils/index.js";
import { FOLDERS, VIEWPORTS } from "./constants.js";

const urlList = ["https://www.simplybusiness.co.uk"];

// Take a page snapshot for a given url and size
const takeSnapshot = async ({ browser, url, viewport, isGolden }) => {
  const page = await browser.newPage();

  await page.setViewportSize({
    width: viewport.width,
    height: viewport.height,
  });
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await scrollFullPage(page);

  const filename = `${makeFileName(url)}-${viewport.width}.png`;
  const path = isGolden
    ? `./${FOLDERS.GOLDEN}/${filename}`
    : `./${FOLDERS.SCREENSHOTS}/${filename}`;

  try {
    await page.screenshot({ path, fullPage: true });

    let message = `Created ${isGolden ? "golden " : ""}snapshot ${chalk.cyan(
      filename
    )}`;

    if (!isGolden) {
      const numberOfDiffs = await compareImages(filename);
      const colour = numberOfDiffs > 0 ? chalk.yellow : chalk.green;
      message += colour(` - ${numberOfDiffs} diffs`);
    }
    log.info(message);
  } catch (error) {
    log.error(chalk.red(`${filename}: ${error.message}`));
  }
};

(async () => {
  // handle args
  const args = process.argv.slice(2);
  const isGolden = args?.[0] === "--golden";

  log.info(`Generating ${isGolden ? "golden " : ""}snapshots...`);

  const browser = await chromium.launch();

  // Walk through list of urls
  for (const url of urlList) {
    // Take viewport snapshots in parallel
    const snapshotPromises = VIEWPORTS.map((viewport) =>
      takeSnapshot({ browser, url, viewport, isGolden })
    );

    await Promise.all(snapshotPromises);
  }

  // Clean up
  await browser.close();
  log.info("Snapshots complete");
})();
