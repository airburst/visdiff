import { chromium } from "playwright";

// TODO: Feed in a list
const BASE_URL = "https://www.simplybusiness.com";

const makeFileName = (url) =>
  url.replaceAll(/https:\/\//g, "").replaceAll(/\//g, "-");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(BASE_URL);
  // const url = await page.url();
  // const route =
  await page.screenshot({
    path: `./screenshots/${makeFileName(BASE_URL)}.png`,
    fullPage: true,
  });
  await browser.close();
})();
