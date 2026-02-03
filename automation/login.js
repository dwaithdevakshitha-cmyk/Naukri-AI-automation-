export async function login(page) {
    await page.goto("https://www.naukri.com");
    // manual login first time
    await page.waitForTimeout(20000);
}
