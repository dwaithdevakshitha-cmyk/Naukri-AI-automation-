import { findSelector } from "../ai/domAnalyzer.js";

export async function resdexSearch(page, jdData) {
    console.log("🛠 Filling Resdex search fields...");
    const dom = await page.content();

    // Fill Skills
    const skillInput = await findSelector(dom, "skill input for resume search");
    if (skillInput.selector) {
        await page.fill(skillInput.selector, jdData.skills.join(","));
    }

    // Fill Location
    const locInput = await findSelector(dom, "location input for resume search");
    if (locInput.selector) {
        await page.fill(locInput.selector, jdData.location);
    }

    // Fill Min Experience
    const minExpInput = await findSelector(dom, "minimum experience dropdown or input");
    if (minExpInput.selector) {
        await page.fill(minExpInput.selector, jdData.min_experience.toString()).catch(() => { });
    }

    // Fill Max Experience
    const maxExpInput = await findSelector(dom, "maximum experience dropdown or input");
    if (maxExpInput.selector) {
        await page.fill(maxExpInput.selector, jdData.max_experience.toString()).catch(() => { });
    }

    console.log("✅ Resdex fields filled.");
}
