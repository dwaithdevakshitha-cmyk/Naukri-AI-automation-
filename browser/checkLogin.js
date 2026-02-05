export async function checkLogin(page) {
    try {
        // Go to a page that requires login
        await page.goto("https://www.naukri.com/recruit/login", {
            waitUntil: "domcontentloaded",
            timeout: 30000 // 30 second timeout
        });

        // Give page time to redirect if not logged in
        await page.waitForTimeout(3000);

        const currentUrl = page.url();

        // If redirected to login page
        if (currentUrl.includes("login")) {
            return false;
        }

        // Additional safety check: look for logout or profile
        const pageText = await page.content();

        if (
            pageText.includes("Logout") ||
            pageText.includes("Resdex") ||
            pageText.includes("Dashboard")
        ) {
            return true;
        }

        return false;
    } catch (error) {
        if (error.message.includes("ERR_NAME_NOT_RESOLVED")) {
            console.error("❌ DNS Error: Cannot resolve 'rms.naukri.com'");
            console.error("   Please check your internet connection.");
            console.error("   You may need to:");
            console.error("   1. Check if you're connected to the internet");
            console.error("   2. Try accessing https://rms.naukri.com/ in your browser");
            console.error("   3. Check if a VPN or firewall is blocking the site");
        } else if (error.message.includes("Timeout")) {
            console.error("❌ Timeout: The page took too long to load");
            console.error("   Please check your internet connection speed.");
        } else {
            console.error("❌ Navigation Error:", error.message);
        }
        throw error; // Re-throw to stop execution
    }
}
