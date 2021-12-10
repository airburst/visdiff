import chalk from "chalk";
import log from "./logger.js";
import {
  compareImages,
  makeFileName,
  scrollFullPage,
  isPasswordProtected,
  delay,
} from "./utils/index.js";
import { FOLDERS, PAGE_DELAY } from "./constants.js";

// Take a page snapshot for a given url and size
const takeSnapshot = ({ browser, url, viewport, isGolden, timer }) =>
  new Promise(async (resolve) => {
    const filename = `${makeFileName(url)}-${viewport.width}.png`;
    const page = await browser.newPage();

    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    try {
      await page.goto(url, { waitUntil: "domcontentloaded" });

      // If page is password-protected, fill in the password
      if (isPasswordProtected(url)) {
        log.info(chalk.cyan(`${url} is password protected`));
        await page.waitForSelector("#previewPassField");
        await page.fill("#previewPassField", "Password321");
        const button = await page.$("button");
        await button.click();
        // Wait for page to fully load
        await delay(PAGE_DELAY);
      }

      // Scroll all the way down on page
      await scrollFullPage(page);

      // Take screenshot
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

export default takeSnapshot;
