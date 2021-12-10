import { chromium } from "playwright";
import log from "./logger.js";
import takeSnapshot from "./snapshot.js";
import { emptyFolders, Timer, chunk } from "./utils/index.js";
import { VIEWPORTS, BATCH_SIZE } from "./constants.js";
import urlList from "./urlList.js";

// const urlList = [
//   "https://preview-stagingwwwsimplybusinessc19589.gtsb.io/welcome/yoga-insurance/",
//   "https://www.simplybusiness.com/welcome/yoga-insurance/",
// ];

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
