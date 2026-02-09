import { extractJD } from "./ai/jdExtractor.js";

const sampleJD = `
Job Description:
We are looking for a Senior Software Engineer with 5 to 8 years of experience.
Key Skills: Java, Spring Boot, Microservices, React, AWS, Docker, Jenkins, Kubernetes.
Experience: 5-8 years.
Location: Bangalore, India.
Role: Full Stack Developer.
`;

(async () => {
    console.log("Testing JD Extraction...");
    const result = await extractJD(sampleJD);
    console.log("Extraction Result:", JSON.stringify(result, null, 2));
})();
