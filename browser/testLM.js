import fetch from "node-fetch";

/**
 * Simple test script for LM Studio integration.
 * MUST USE HTTP POST
 */
async function testLM() {
    const url = "http://localhost:1234/v1/chat/completions";

    try {
        const response = await fetch(url, {
            method: "POST", // HTTP POST Required
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta-llama-3-8b-instruct",
                messages: [{ role: "user", content: "Say OK" }],
                temperature: 0
            })
        });

        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            return;
        }

        const data = await response.json();
        console.log("LM Studio Response:", data.choices[0].message.content);
    } catch (err) {
        console.error("Test Failed:", err.message);
    }
}

testLM();
