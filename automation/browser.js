import { chromium, devices } from "playwright";

export async function getBrowser(device = "Desktop") {
    const config = device === "Mobile"
        ? devices["iPhone 14"]
        : {};

    return await chromium.launch({ headless: false });
}
