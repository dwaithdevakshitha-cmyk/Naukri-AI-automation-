import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "http://localhost:1234/v1",
    apiKey: "lm-studio"
});

const res = await client.chat.completions.create({
    model: "llama-3-8b-instruct",
    messages: [{ role: "user", content: "Say OK" }]
});

console.log(res.choices[0].message.content);
