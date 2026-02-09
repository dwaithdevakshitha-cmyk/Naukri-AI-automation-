import fetch from "node-fetch";

export async function extractJD(jdText) {
    const llm = await callLLM(jdText);
    return normalize(llm, jdText);
}

/* ---------------- LLM CALL ---------------- */

async function callLLM(jdText) {
    const response = await fetch("http://127.0.0.1:1234/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "meta-llama-3-8b-instruct",
            temperature: 0,
            max_tokens: 300,
            messages: [
                {
                    role: "system",
                    content: "You extract structured data. Return ONLY valid JSON."
                },
                {
                    role: "user",
                    content: `
Extract strictly in JSON:

{
  "skills": ["string"],
  "min_experience": number,
  "max_experience": number,
  "location": "string"
}

Job Description:
${jdText.slice(0, 3000)}
`
                }
            ]
        })
    });

    const data = await response.json();
    let raw = data.choices[0].message.content;

    // Strip markdown if present
    raw = raw.substring(raw.indexOf("{"), raw.lastIndexOf("}") + 1);

    return JSON.parse(raw);
}

/* ---------------- NORMALIZATION ---------------- */

function normalize(llm, text) {
    const exp = extractExperience(text);

    return {
        skills: normalizeSkills(llm.skills, text),
        min_experience: exp.min,
        max_experience: exp.max,
        location: normalizeLocation(llm.location, text)
    };
}

/* ---------------- HELPERS ---------------- */

function extractExperience(text) {
    // Handles: 5-7 yrs | 5 to 7 years | minimum 5 years | 7+ years
    let m = text.match(/(\d+)\s*(?:-|to)\s*(\d+)\s*(years|yrs)/i);
    if (m) return { min: +m[1], max: +m[2] };

    m = text.match(/(\d+)\s*\+\s*(years|yrs)/i);
    if (m) return { min: +m[1], max: +m[1] + 2 };

    m = text.match(/minimum\s*(\d+)\s*(years|yrs)/i);
    if (m) return { min: +m[1], max: +m[1] };

    m = text.match(/(\d+)\s*(years|yrs)/i);
    if (m) return { min: +m[1], max: +m[1] };

    return { min: 0, max: 0 };
}

function normalizeSkills(llmSkills, text) {
    if (Array.isArray(llmSkills)) return llmSkills;

    if (typeof llmSkills === "string") {
        return llmSkills
            .split(/[,|]/)
            .map(s => s.trim())
            .filter(Boolean);
    }

    // Regex fallback
    const tech = [
        "sap", "fi", "co", "s4", "hana", "java", "python", "react",
        "node", "aws", "sql", "docker", "kubernetes"
    ];

    const re = new RegExp(`\\b(${tech.join("|")})\\b`, "gi");
    return [...new Set(text.match(re) || [])].map(s => s.toUpperCase());
}

function normalizeLocation(loc, text) {
    if (loc && loc !== "**") return loc;

    const m = text.match(/location\s*[:\-]?\s*([a-zA-Z\s]+)/i);
    return m ? m[1].trim() : "";
}
