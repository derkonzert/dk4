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
    const title = await page.getAttribute(
      ':nth-match([data-test-id="event-list-item"], 1)',
      "title"
    );

    await page.click(':nth-match([data-test-id="event-list-item"], 1)');

    await page.screenshot({ path: screenshotDir + "after-event-click.png" });

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
