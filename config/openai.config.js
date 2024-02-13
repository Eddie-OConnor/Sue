import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) throw new Error("OpenAI API key is missing or invalid.");
export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// if (!process.env.asstId) throw new Error("OpenAI Assistant ID is missing or invalid.");
// export const asstId = process.env.asstId