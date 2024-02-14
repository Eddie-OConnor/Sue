if (!process.env.asstId) throw new Error("OpenAI Assistant ID is missing or invalid.");
export const asstId = process.env.asstId