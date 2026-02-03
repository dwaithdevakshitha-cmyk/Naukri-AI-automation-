import client from "./openaiClient.js";

export async function findSelector(dom, goal) {
    const response = await client.chat.completions.create({
        model: "llama-3-8b-instruct",
        messages: [
            {
                role: "system",
                content: `
You are a DOM analyst.
Rules:
- No XPath
- No role
- Return ONLY valid CSS selector + confidence in JSON.
`
            },
            {
                role: "user",
                content: `Goal: ${goal}\nDOM:\n${dom}`
            }
        ]
    });

    return JSON.parse(response.choices[0].message.content);
}
