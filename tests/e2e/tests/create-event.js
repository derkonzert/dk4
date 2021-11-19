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
  const title = `E2E Test Event-${Date.now()}`;

  let thrownError;

  try {
    await page.waitForSelector('[data-test-id="create-event-floating-button"]');
    await page.click('[data-test-id="create-event-floating-button"]');

    await page.screenshot({ path: screenshotDir + "after-button-click.png" });

    await page.waitForSelector('[data-test-id="create-event-form"]');
    await page.screenshot({ path: screenshotDir + "before-fill.png" });
    await page.waitForSelector("#title");

    await page.fill("#title", title);

    const nextYear = new Date().getFullYear() + 1;
    const fromDate = `${nextYear}-04-01T05:15`;

    await page.waitForSelector("#fromDate");
    await page.fill("#fromDate", fromDate);
    await page.waitForSelector("#location");
    await page.fill("#location", "Strom");

    await page.screenshot({ path: screenshotDir + "before-submit.png" });

    await page.waitForSelector('[data-test-id="create-event-submit"]');
    await page.click('[data-test-id="create-event-submit"]');

    await page.screenshot({ path: screenshotDir + "after-submit.png" });

    await page.waitForSelector('[data-test-id="create-event-success"]');

    await page.screenshot({ path: screenshotDir + "after-success.png" });

    await page.click('[data-test-id="create-event-close"]');
    await page.screenshot({ path: screenshotDir + "closed.png" });

    await page.waitForSelector(`text=${title}`, { state: "attached" });
    const newEventInList = await page.$(`text=${title}`);

    await newEventInList.scrollIntoViewIfNeeded();

    await page.screenshot({ path: screenshotDir + "added-event.png" });
  } catch (err) {
    thrownError = err;
  } finally {
    // Call reset endpoint to delete all created data
    await page.goto(myURL + `/api/e2e-reset?title=${title}`);

    if (thrownError) {
      throw thrownError;
    }
  }
  await browser.close();
})();
