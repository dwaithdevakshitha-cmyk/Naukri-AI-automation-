import { chromium } from "playwright";

export async function goToRecruiterPage() {
    // Attach to existing logged-in browser
    const browser = await chromium.connectOverCDP(
        "http://localhost:9222"
    );

    const context = browser.contexts()[0];
    const page = context.pages()[0];

    console.log("📍 Connected to existing browser");

    // Go to recruiter home (safe landing page)
    await page.goto("https://recruit.naukri.com/", {
        waitUntil: "domcontentloaded"
    });

    console.log("✅ Navigated to Naukri Recruiter page");

    return { browser, page };
}
