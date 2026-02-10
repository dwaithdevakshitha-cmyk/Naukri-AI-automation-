import { chromium } from "playwright";
import fetch from "node-fetch";

const LLM_URL = "http://127.0.0.1:1234/v1/chat/completions";

export async function openResdexSearch() {
    console.log("🔗 Connecting to existing Chrome...");

    try {
        const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
        const context = browser.contexts()[0];
        const page = context.pages().find(p => p.url().includes("naukri.com")) || context.pages()[0];

        await page.bringToFront();

        for (let step = 1; step <= 2; step++) {
            // 1️⃣ Capture the Accessibility Tree
            // This tree will label Resdex as 'link' and Search Resume as 'button'
            const snapshot = await page.accessibility.snapshot({ interestingOnly: true });

            console.log(`🧠 Llama-3 Reasoning Step ${step}...`);

            const response = await fetch(LLM_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "meta-llama-3-8b-instruct",
                    temperature: 0,
                    messages: [
                        {
                            role: "system",
                            content: `
                            You are a navigation brain. 
                            - 'Resdex' is a HYPERLINK (role: link).
                            - 'Search Resume' is a BUTTON (role: button).
                            
                            Goal: Reach the Advanced Search page.
                            Step 1: If you see the 'Resdex' link, click it.
                            Step 2: If the 'Search Resume' button appears, click it.
                            
                            Respond ONLY as JSON: { "action": "click", "role": "link|button", "name": "TextName" }`
                        },
                        {
                            role: "user",
                            content: JSON.stringify(snapshot)
                        }
                    ]
                })
            });

            const data = await response.json();
            const decision = JSON.parse(data.choices[0].message.content.match(/{[\s\S]*}/)[0]);

            if (decision.action === "click") {
                console.log(`🖱️ LLM acting: Clicking ${decision.role} "${decision.name}"`);

                // Use the specific role defined by the LLM
                await page.getByRole(decision.role, { name: decision.name, exact: false }).click();

                // Wait for the UI to update (crucial for buttons that trigger menus)
                await page.waitForTimeout(2000);
            }
        }

        console.log("🎯 Navigation sequence finished.");
        await browser.disconnect();

    } catch (err) {
        console.error("❌ LLM-Playwright Failure:", err);
    }
}