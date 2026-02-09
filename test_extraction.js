import { extractJD } from "./ai/jdExtractor.js";

const sampleJD = `
Graduate in any stream, BE (degree will be preferred).
Should be 5+ Yrs - 7 Yrs of experience with SAP FI/CO, SAP ECC & S4 HANA.
Have proven experience in the analysis, conception, and management of end-2-end processes with the
SAP modules in a service or manufacturing company.
A high level of analytical and conceptual thinking as well as excellent communication and
organizational skill.
ITIL and another knowledge is an advantage.
B1/B2 level of written and spoken English.
Minimum experience of 2 full end to end SAP implementation.
Ability to multitask and manage multiple deliverables and projects at the same time.
Experience in a Professional Services or Distribution company is an asset.
Ability to understand business processes from a customer perspective.
Ability to work in a team environment, effectively interacting with global teams.
location:hyderabad
`;

(async () => {
    console.log("Testing Updated JD Extraction...");
    try {
        const result = await extractJD(sampleJD);
        console.log("Final Extracted Result:", JSON.stringify(result, null, 2));
    } catch (err) {
        console.error("Test Error:", err);
    }
})();
