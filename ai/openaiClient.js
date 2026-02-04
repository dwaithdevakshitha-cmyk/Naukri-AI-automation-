import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const client = new OpenAI(
    process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes("your_openai_api_key")
        ? { apiKey: process.env.OPENAI_API_KEY }
        : {
            baseURL: "http://localhost:1234/v1", // LM Studio
            apiKey: "lm-studio" // dummy value
        }
);

export default client;
