import { serpApiKey } from "../../../config/serpApi.config";

const handler = async (event) => {
    try {
        const { query } = JSON.parse(event.body)
        const response = await search(query)
        return {
            statusCode: 200,
            body: JSON.stringify({ response }),
        }
    } catch (e) {
        console.error('error:', e)
        return { statusCode: 500, body: error.toString() }
    }
}

export async function search(query) {
    const response = await getJson({
        engine: "google",
        api_key: serpApiKey,
        q: query,
    });
    return response;
}