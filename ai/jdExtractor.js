import fetch from "node-fetch";

export async function extractJD(jdText) {
    const response = await fetch("http://127.0.0.1:1234/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "meta-llama-3-8b-instruct",
            temperature: 0,
            messages: [
                {
                    role: "system",
                    content:
                        "You are a strict JSON API. Respond ONLY with valid JSON. No explanations."
                },
                {
                    role: "user",
                    content: `
Extract details from the job description.

Return ONLY JSON in this format:
{
  "skills": [],
  "min_experience": number,
  "max_experience": number,
  "location": ""
}

Job Description:
${jdText}
`
                }
            ]
        })
    });

    const data = await response.json();

    const raw = data.choices[0].message.content;
    console.log("RAW LLM OUTPUT:", raw);

    // 🔥 Robust JSON extraction
    const jsonText = raw.slice(
        raw.indexOf("{"),
        raw.lastIndexOf("}") + 1
    );

    return JSON.parse(jsonText);
}
