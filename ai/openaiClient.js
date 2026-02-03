import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "http://localhost:1234/v1", // LM Studio
    apiKey: "lm-studio" // dummy value
});

export default client;
