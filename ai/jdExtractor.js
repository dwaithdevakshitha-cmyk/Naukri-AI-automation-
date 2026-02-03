import client from "./openaiClient.js";

export async function extractJD(jdText) {
    const response = await client.chat.completions.create({
        model: "llama-3-8b-instruct",
        messages: [
            {
                role: "system",
                content: "Extract skills, experience, location. Return JSON only."
            },
            {
                role: "user",
                content: jdText
            }
        ]
    });

    return JSON.parse(response.choices[0].message.content);
}
