if (!process.env.SERP_API_KEY) throw new Error("SERP API key is missing or invalid.");

export const serpApiKey = process.env.SERP_API_KEY
