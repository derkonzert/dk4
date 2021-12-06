const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: process.env.NO_HEADLESS ? false : true,
  });
  const page = await browser.newPage();

  const screenshotDir = process.env.SCREENSHOTS_DIR || "";
  const myURL = process.env.ENVIRONMENT_URL || "https://next.derkonzert.de";
  await page.goto(myURL);

  await page.setViewportSize({ width: 1248, height: 920 });

  let thrownError;

  try {
    const title = await page.textContent(
      ':nth-match([data-test-id="event-title"], 1)'
    );

    await page.click(':nth-match([data-test-id="event-list-item"], 1)');

    await page.waitForSelector(
      `[data-test-id="event-dialog"] :text("${title}")`
    );
  } catch (err) {
    thrownError = err;
  } finally {
    if (thrownError) {
      throw thrownError;
    }
  }
  await browser.close();
})();
