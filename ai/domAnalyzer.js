import fetch from "node-fetch";

/**
 * findSelector uses AI to find the best CSS selector for a given goal based on DOM content.
 */
export async function findSelector(dom, goal) {
    const url = "http://127.0.0.1:1234/v1/chat/completions";

    try {
        console.log(`🧠 AI analyze DOM for goal: "${goal}"...`);
        const response = await fetch(url, {
            method: "POST", // HTTP POST Required
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta-llama-3-8b-instruct", // Correct model name
                temperature: 0,
                messages: [
                    {
                        role: "system",
                        content: "You are a DOM analyst. Rules: - No XPath - No role - Return ONLY valid CSS selector + confidence in JSON format: {\"selector\": \"...\", \"confidence\": 0.9}"
                    },
                    {
                        role: "user",
                        content: `Goal: ${goal}\nDOM:\n${dom.substring(0, 15000)}` // Increased limit
                    }
                ],
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Defensive parsing
        if (data && data.choices && data.choices[0] && data.choices[0].message) {
            const content = data.choices[0].message.content;
            return JSON.parse(content);
        } else {
            throw new Error("Malformed response from AI");
        }
    } catch (err) {
        console.error("domAnalyzer: Selector lookup failed:", err.message);
        return { selector: null, confidence: 0 };
    }
}
