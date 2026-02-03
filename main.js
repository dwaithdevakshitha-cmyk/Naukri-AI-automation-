import { chromium } from "playwright";
import { checkLogin } from "./automation/checkLogin.js";

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    const loggedIn = await checkLogin(page);

    if (!loggedIn) {
        console.log("❌ Not logged in. Please login manually in the opened browser.");
        console.log("⏳ Waiting for you to login...");

        // Pause here so you can login
        await page.waitForTimeout(120000); // 2 minutes

        const loggedInAfter = await checkLogin(page);

        if (!loggedInAfter) {
            console.log("❌ Login still not detected. Exiting.");
            await browser.close();
            return;
        }
    }

    console.log("✅ Login successful. Proceeding...");

    // NEXT STEPS will go here later

})();
