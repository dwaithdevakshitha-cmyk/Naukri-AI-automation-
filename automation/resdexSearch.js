import { findSelector } from "../ai/domAnalyzer.js";

export async function resdexSearch(page, jdData) {
    const dom = await page.content();

    const skillInput = await findSelector(dom, "skill input for resume search");
    await page.fill(skillInput.selector, jdData.skills.join(","));

    const locInput = await findSelector(dom, "location input for resume search");
    await page.fill(locInput.selector, jdData.location);
}
