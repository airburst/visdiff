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
const takeSnapshot = async ({ browser, url, viewport, isGolden }) => {
  const page = await browser.newPage();

  await page.setViewportSize({
    width: viewport.width,
    height: viewport.height,
  });
  await page.goto(url);

  const filename = `${makeFileName(url)}-${viewport.width}.png`;
  const path = `./screenshots${isGolden ? "-golden" : ""}/${filename}`;

  await page.screenshot({ path, fullPage: true });
  log.info(
    `Created ${isGolden ? "golden " : ""}snapshot ${chalk.cyan(filename)}`
  );
};

(async () => {
  // handle args
  const args = process.argv.slice(2);
  const isGolden = args?.[0] === "--golden";

  log.info(`Generating ${isGolden ? "golden " : ""}snapshots...`);

  const browser = await chromium.launch();
  const page = await browser.newPage();

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

// TODO: add progress bar to CLI
