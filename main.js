import { chromium } from "playwright";
import dotenv from "dotenv";

dotenv.config();

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log("🌐 Opening Naukri Recruiter Login page...");

    // 🔑 DIRECT LOGIN PAGE (NO HOMEPAGE)
    // await page.goto("https://recruiter.naukri.com/recruit/login", {
    //     waitUntil: "domcontentloaded",
    //     timeout: 60000
    // });

    console.log("⌛ Waiting for login form...");

    // ✅ WAIT FOR EMAIL FIELD (STABLE SELECTOR)
    await page.waitForSelector("input[type='text'], input[type='email']", {
        timeout: 20000
    });

    console.log("✍️ Filling email...");
    await page.fill("input[type='text'], input[type='email']", process.env.NAUKRI_EMAIL);

    console.log("✍️ Filling password...");
    await page.fill("input[type='password']", process.env.NAUKRI_PASSWORD);

    console.log("🚀 Clicking Login...");
    await page.click("button:has-text('Login')");

    // Wait for redirect after login
    await page.waitForTimeout(8000);

    const url = page.url();

    if (url.includes("recruiter.naukri.com")) {
        console.log("✅ LOGIN SUCCESSFUL");
    } else {
        console.log("❌ LOGIN FAILED (captcha / wrong credentials)");
    }

})();
app.post("/analyze", async (req, res) => {
    try {
        const result = await extractJD(req.body.jd);

        console.log("🧠 LLM RESULT:", result); // DEBUG

        res.json(result);
    } catch (err) {
        console.error("❌ JD extraction failed:", err.message);
        res.status(500).json({ error: err.message });
    }
});
