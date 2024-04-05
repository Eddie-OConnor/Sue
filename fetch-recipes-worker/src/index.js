import OpenAI from 'openai';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }

export default {
    async fetch(request, env, ctx) {

        if (request.method === 'OPTIONS'){
            return new Response(null, { headers: corsHeaders })
        }

        if (!env.OPENAI_API_KEY) throw new Error("OpenAI API key is missing or invalid.");
        const openai = new OpenAI({
            apiKey: env.OPENAI_API_KEY,
            baseURL: 'https://gateway.ai.cloudflare.com/v1/68afc43fd4d9be84c7eecdf017e269db/sue-chef/openai'
        });

        if (!env.asstId) throw new Error("OpenAI Assistant ID is missing or invalid.");
        const asstId = env.asstId

        try {
            const { ingredients, additionalIngredients, people, time, equipment } = await request.json()
            const run = await createAndRun(asstId, ingredients, additionalIngredients, people, time, equipment, openai)
            let currentRun = await retrieveRun(run.thread_id, run.id, openai)

            while (currentRun.status !== 'completed') {
                await new Promise(resolve => setTimeout(resolve, 1500))
                console.log(currentRun.status)
                currentRun = await retrieveRun(run.thread_id, run.id, openai)

                if (currentRun.status === 'requires_action') {
                    console.log(currentRun.status)
                    const toolCalls = currentRun.required_action.submit_tool_outputs.tool_calls
                    const parsedArguments = JSON.parse(toolCalls[0].function.arguments)
                    const apiResponse = await google(parsedArguments.query, env)
                    const response = await openai.beta.threads.runs.submitToolOutputs(
                        run.thread_id,
                        run.id,
                        {
                            tool_outputs: [
                                {
                                    tool_call_id: toolCalls[0].id,
                                    output: JSON.stringify(apiResponse)
                                }
                            ]
                        }
                    )
                    console.log(response)
                    currentRun = await retrieveRun(run.thread_id, run.id, openai)
                }
            }
            const data = await listMessages(run.thread_id, openai)
            const rawRecipes = JSON.stringify(data.data[0].content[0].text.value)
            const formattedRecipes = await formatRecipe(rawRecipes, openai)
            return new Response(JSON.stringify({ formattedRecipes }), { headers: corsHeaders })
        } catch (e) {
            return new Response (e, { headers: corsHeaders })
        }
    },
};


async function createAndRun(assistant, ingredients, additionalIngredients, people, time, equipment, openai) {
    try {
        const response = await openai.beta.threads.createAndRun(
            {
                assistant_id: assistant,
                thread: {
                    messages: [
                        {
                            role: 'user',
                            content: `
                            1) ${ingredients}
                            2) ${additionalIngredients}
                            3) ${people}
                            4) ${time}
                            5) ${equipment}
                            `
                        }
                    ]
                }
            }
        )
        return response
    } catch (e) {
        throw new Error('Error creating and running assistant for thread: ', e)
    }
}


async function retrieveRun(thread, run, openai) {
    try {
        return await openai.beta.threads.runs.retrieve(thread, run)
    } catch (e) {
        throw new Error('Error retrieving run for: ' + thread, e)
    }
}


async function google(query, env) {

    if (!env.SERP_API_KEY) throw new Error("SERP API key is missing or invalid.");
    const serpApiKey = env.SERP_API_KEY

    try {
        const response = await fetch(`https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${serpApiKey}`)

        if (response.ok) {
            const data = await response.json()
            return data['recipes_results']
        } else {
            throw new Error(`SerpAPI request failed with status ${response.status}: ${response.error}`)
        }
    } catch (e) {
        throw new Error('error with SERP API', e)
    }
}


async function listMessages(thread, openai) {
    try {
        return await openai.beta.threads.messages.list(thread)
    } catch (e) {
        throw new Error('error listing messages for thread: ' + thread, e)
    }
}


async function formatRecipe(recipes, openai) {
    try {
        const response = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are an assistant that converts user messages into proper json 
                    format. Each recipe should be its own object and each item within recipe (title, url, 
                    rating, time, ingredients, thumbnail, and description) should be a parameter. Please 
                    format your response like this:

                    [
                        {
                            "title": "title",
                            "url": "url",
                            "rating": "X ⭐ (Y Reviews)",
                            "time": "time",
                            "ingredients": "ingredient1, ingredient2, ingredient3",
                            "thumbnail": "thumbnail.jpeg",
                            "description": "description"
                        },
                        {
                            "title": "title",
                            "url": "url",
                            "rating": "X ⭐ (Y Reviews)",
                            "time": "time",
                            "ingredients": "ingredient1, ingredient2, ingredient3",
                            "thumbnail": "thumbnail.jpeg",
                            "description": "description"
                        },
                        {
                            "title": "title",
                            "url": "url",
                            "rating": "X ⭐ (Y Reviews)",
                            "time": "time",
                            "ingredients": "ingredient1, ingredient2, ingredient3",
                            "thumbnail": "thumbnail.jpeg",
                            "description": "description"
                        },
                    ]
                    `
                },
                {
                    role: 'user',
                    content: `${recipes}`
                }
            ],
            model: 'gpt-3.5-turbo-0125'
        })
        return response
    } catch (e) {
        throw new Error('Error with OpenAI formatting recipes to JSON', e)
    }
}