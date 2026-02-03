import dotenv from "dotenv";
dotenv.config();

import client from "../ai/openaiClient.js";

export async function autoLogin(page) {
    await page.goto("https://www.naukri.com", {
        waitUntil: "domcontentloaded"
    });

    await page.waitForTimeout(3000);

    // 1️⃣ Click "Register / Login"
    const dom1 = await page.content();

    const loginBtnRes = await client.chat.completions.create({
        model: "llama-3-8b-instruct",
        temperature: 0,
        messages: [
            {
                role: "system",
                content: `
You are a DOM analyzer.
Find the button or link that opens the login form.
Return JSON only:
{ "selector": "css-selector" }
Rules:
- No XPath
- No role
`
            },
            {
                role: "user",
                content: `DOM:\n${dom1}`
            }
        ]
    });

    const loginBtn = JSON.parse(loginBtnRes.choices[0].message.content);
    await page.click(loginBtn.selector);

    await page.waitForTimeout(3000);

    // 2️⃣ Fill Email
    const dom2 = await page.content();

    const emailRes = await client.chat.completions.create({
        model: "llama-3-8b-instruct",
        temperature: 0,
        messages: [
            {
                role: "system",
                content: `
Find the email input field for login.
Return JSON only:
{ "selector": "css-selector" }
`
            },
            {
                role: "user",
                content: dom2
            }
        ]
    });

    const emailField = JSON.parse(emailRes.choices[0].message.content);
    await page.fill(emailField.selector, process.env.NAUKRI_EMAIL);

    // 3️⃣ Fill Password
    const dom3 = await page.content();

    const passRes = await client.chat.completions.create({
        model: "llama-3-8b-instruct",
        temperature: 0,
        messages: [
            {
                role: "system",
                content: `
Find the password input field for login.
Return JSON only:
{ "selector": "css-selector" }
`
            },
            {
                role: "user",
                content: dom3
            }
        ]
    });

    const passField = JSON.parse(passRes.choices[0].message.content);
    await page.fill(passField.selector, process.env.NAUKRI_PASSWORD);

    // 4️⃣ Click Login
    const dom4 = await page.content();

    const submitRes = await client.chat.completions.create({
        model: "llama-3-8b-instruct",
        temperature: 0,
        messages: [
            {
                role: "system",
                content: `
Find the Login / Submit button.
Return JSON only:
{ "selector": "css-selector" }
`
            },
            {
                role: "user",
                content: dom4
            }
        ]
    });

    const submitBtn = JSON.parse(submitRes.choices[0].message.content);
    await page.click(submitBtn.selector);

    await page.waitForTimeout(5000);
}
