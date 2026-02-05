import fetch from "node-fetch";

export async function extractJD(jdText) {
    try {
        const llmResult = await callLLM(jdText);
        const normalized = normalize(llmResult, jdText);
        return normalized;
    } catch (error) {
        console.error("LLM Extraction Failed:", error);
        // Return a basic fallback structure if LLM fails completely
        return {
            skills: normalizeSkills([], jdText),
            min_experience: 0,
            max_experience: 0,
            location: normalizeLocation("", jdText)
        };
    }
}

/* ---------------- LLM CALL ---------------- */

async function callLLM(jdText) {
    // ULTRA-FAST PROMPT (~200 tokens max)
    const response = await fetch("http://127.0.0.1:1234/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "llama-3-8b-instruct",
            temperature: 0,
            max_tokens: 150, // STOP generation very early
            messages: [
                {
                    role: "user",
                    content: `Extract JSON.
Format: {"skills":[],"min_experience":0,"max_experience":0,"location":""}
JD:
${jdText.substring(0, 1000)}`
                    // super aggressive truncation for speed
                }
            ]
        })
    });

    const data = await response.json();
    let raw = data.choices[0].message.content;

    // cleanup markdown if present
    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
        raw = raw.substring(firstBrace, lastBrace + 1);
    }

    return JSON.parse(raw);
}

/* ---------------- NORMALIZATION ---------------- */

function normalize(llm, text) {
    return {
        skills: normalizeSkills(llm.skills, text),
        min_experience: normalizeExperience(llm, text).min,
        max_experience: normalizeExperience(llm, text).max,
        location: normalizeLocation(llm.location, text)
    };
}

/* ---------------- HELPERS ---------------- */

function normalizeExperience(llm, text) {
    // Check if both exist and are numbers (including 0)
    if (typeof llm.min_experience === 'number' && typeof llm.max_experience === 'number') {
        return { min: llm.min_experience, max: llm.max_experience };
    }

    // Fallback Regex
    const range = text.match(/(\d+)\s*[-to]+\s*(\d+)\s*(years|yrs)/i);
    if (range) {
        return { min: +range[1], max: +range[2] };
    }

    const single = text.match(/(\d+)\s*\+?\s*(years|yrs)/i);
    if (single) {
        return { min: +single[1], max: +single[1] };
    }

    return { min: 0, max: 0 };
}

function normalizeLocation(llmLocation, text) {
    if (llmLocation && llmLocation !== "Unknown") return llmLocation;

    const match = text.match(
        /(location|based in|work from)\s*[:\-]?\s*([a-zA-Z\s,]+)/i
    );
    return match ? match[2].trim() : "Remote"; // Default to Remote if really ambiguous? Or ""
}

function normalizeSkills(llmSkills, text) {
    // Trust LLM if it found skills
    if (Array.isArray(llmSkills) && llmSkills.length > 0) {
        return llmSkills;
    }

    // Expanded Regex Fallback
    const commonTech = [
        "java", "python", "javascript", "typescript", "c\\+\\+", "c#", ".net", "php", "ruby", "go", "rust", "swift", "kotlin",
        "react", "angular", "vue", "node", "express", "django", "flask", "spring", "boot", "laravel",
        "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "terraform", "ansible",
        "sql", "mysql", "postgresql", "mongodb", "redis", "oracle", "elasticsearch",
        "git", "linux", "jira", "html", "css", "sass", "graphql", "rest api"
    ];

    const skillRegex = new RegExp(`\\b(${commonTech.join("|")})\\b`, "gi");
    return [...new Set(text.match(skillRegex) || [])];
}
