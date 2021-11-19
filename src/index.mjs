import { chromium } from "playwright";
import chalk from "chalk";
import log from "./logger.mjs";

const urlList = ["https://www.simplybusiness.co.uk"];
const VIEWPORTS = [
  { width: 1366, height: 768 },
  { width: 414, height: 896 },
];

const makeFileName = (url) =>
  url.replaceAll(/https:\/\//g, "").replaceAll(/\//g, "-");

// Take a page snapshot for a given url and size
const takeSnapshot = async ({ browser, url, viewport }) => {
  const page = await browser.newPage();

  await page.setViewportSize({
    width: viewport.width,
    height: viewport.height,
  });
  await page.goto(url);
  const filename = `${makeFileName(url)}-${viewport.width}.png`;

  await page.screenshot({
    path: `./screenshots/${filename}`,
    fullPage: true,
  });
  log.info(`Created snapshot ${chalk.cyan(filename)}`);
};

(async () => {
  log.info("Generating snapshots...");

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Walk through list of urls
  for (const url of urlList) {
    // Take viewport snapshots in parallel
    const snapshotPromises = VIEWPORTS.map((viewport) =>
      takeSnapshot({ browser, url, viewport })
    );

    await Promise.all(snapshotPromises);
  }

  // Clean up
  await browser.close();
  log.info("Snapshots complete");
})();

// TODO: add progress bar to CLI
