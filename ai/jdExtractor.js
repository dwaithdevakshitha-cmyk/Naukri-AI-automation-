import fetch from "node-fetch";

export async function extractJD(jdText) {
    try {
        const llmResult = await callLLM(jdText);
        console.log("LLM Raw Result:", JSON.stringify(llmResult, null, 2));
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
    const response = await fetch("http://127.0.0.1:1234/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "meta-llama-3-8b-instruct",
            temperature: 0,
            max_tokens: 200,
            messages: [
                {
                    role: "user",
                    content: `JSON only: {"skills":[], "min_experience":0, "max_experience":0, "location":""}
JD:
${jdText.substring(0, 1500)}`
                }
            ]
        })
    });

    const data = await response.json();
    if (!data.choices || !data.choices[0]) throw new Error("Invalid LLM response");

    let raw = data.choices[0].message.content;
    console.log("LLM Raw String:", raw);

    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
        raw = raw.substring(firstBrace, lastBrace + 1);
    }

    try {
        const parsed = JSON.parse(raw);
        return parsed;
    } catch (e) {
        console.error("Failed to parse JSON from LLM:", raw);
        return { skills: [], min_experience: 0, max_experience: 0, location: "" };
    }
}

/* ---------------- NORMALIZATION ---------------- */

function normalize(llm, text) {
    const exp = normalizeExperience(llm, text);
    return {
        skills: normalizeSkills(llm.skills, text),
        min_experience: exp.min,
        max_experience: exp.max,
        location: normalizeLocation(llm.location, text)
    };
}

/* ---------------- HELPERS ---------------- */

function normalizeExperience(llm, text) {
    const extractNum = (val) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') {
            const m = val.match(/\d+/);
            return m ? parseInt(m[0]) : NaN;
        }
        return NaN;
    };

    let min = extractNum(llm.min_experience);
    let max = extractNum(llm.max_experience);

    if (!isNaN(min) && !isNaN(max)) {
        return { min, max };
    }

    const range = text.match(/(\d+)\s*(?:-|to)\s*(\d+)\s*(?:years|yrs)/i);
    if (range) {
        return { min: parseInt(range[1]), max: parseInt(range[2]) };
    }

    const single = text.match(/(\d+)\s*\+?\s*(?:years|yrs)/i);
    if (single) {
        return { min: parseInt(single[1]), max: parseInt(single[1]) };
    }

    return { min: 0, max: 0 };
}

function normalizeLocation(llmLocation, text) {
    if (llmLocation && llmLocation !== "Unknown" && llmLocation !== "") return llmLocation;

    const match = text.match(
        /(?:location|based in|work from)\s*[:\-]?\s*([a-zA-Z\s,]+)/i
    );
    return match ? match[1].trim() : "Not Specified";
}

function normalizeSkills(llmSkills, text) {
    let skills = [];

    // 1. Handle LLM output (could be array or comma string)
    if (Array.isArray(llmSkills)) {
        skills = llmSkills;
    } else if (typeof llmSkills === 'string' && llmSkills.trim().length > 0) {
        skills = llmSkills.split(/[,|/]/).map(s => s.trim());
    }

    // 2. Clear out noise and normalize
    skills = skills.map(s => s.toString().trim()).filter(s => s.length > 2);

    // 3. If LLM found next to nothing, use the Regex Fallback
    if (skills.length < 2) {
        const commonTech = [
            "java", "python", "javascript", "typescript", "c\\+\\+", "c#", "\\.net", "php", "ruby", "go", "rust", "swift", "kotlin",
            "react", "angular", "vue", "node\\.js", "node", "express", "django", "flask", "spring", "boot", "laravel",
            "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "terraform", "ansible",
            "sql", "mysql", "postgresql", "mongodb", "redis", "oracle", "elasticsearch",
            "git", "linux", "jira", "html", "css", "sass", "graphql", "rest api", "sap", "hana", "fico", "abap",
            "power bi", "tableau", "excel", "spark", "hadoop", "selenium", "playwright", "cypress",
            "agile", "scrum", "kanban", "erp", "crm", "sdlc", "testing", "automation"
        ];
        const pattern = new RegExp(`\\b(${commonTech.join("|")})\\b`, "gi");
        const matches = text.match(pattern) || [];
        skills = [...skills, ...matches];
    }

    // Deduplicate and return
    return [...new Set(skills.map(s => s.toLowerCase()))].map(s => {
        // Simple capitalization for common terms
        if (s.length <= 3) return s.toUpperCase();
        return s.charAt(0).toUpperCase() + s.slice(1);
    });
}