import puppeteer from "puppeteer-core";
import { resdexSearch } from "../browser/resdexSearch.js";

/**
 * Specifically switches to the "My Naukri For Recruiters" tab 
 * as shown in your screenshot and fills the extracted job details.
 */
export async function switchToNaukriTab(jdData) {
  console.log("🔎 Attaching to browser to find your Naukri tab...");

  try {
    const browser = await puppeteer.connect({
      browserURL: "http://127.0.0.1:9222",
      defaultViewport: null
    });

    const pages = await browser.pages();
    let recruiterPage = null;

    for (const page of pages) {
      const title = await page.title();
      const url = page.url();
      console.log(`➡ Scan: [${title}]`);

      // Priority 1: Match the specific title from your screenshot
      // Priority 2: Match the recruiter URL as a fallback
      if (title.includes("My Naukri For Recruiters") ||
        title.includes("My Naukri For Rec") ||
        url.includes("recruit.naukri.com")) {
        recruiterPage = page;
        break;
      }
    }

    if (!recruiterPage) {
      throw new Error("Naukri tab ('My Naukri For Recruiters') not found. Please ensure it is open.");
    }

    console.log("✅ Found the tab! Clicking/Switching now...");

    // Auto-fill the JD data if present
    if (jdData) {
      console.log("📝 Auto-filling skills and experience...");
      await resdexSearch(recruiterPage, jdData);
    }

    // Bring to front (This is the "click" action on the tab)
    await recruiterPage.bringToFront();

    // Disconnect to leave the browser running
    await browser.disconnect();

  } catch (err) {
    console.error("❌ Tab Switch failed:", err.message);
    throw err;
  }
}
