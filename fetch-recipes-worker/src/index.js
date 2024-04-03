// import { openai } from '../../config/openai.config'
// import { asstId } from '../../config/assistant.config'
// import { serpApiKey } from '../../config/serpApi.config'

import OpenAI from 'openai';

// import { getJson } from 'serpapi'

// import { GoogleSearch } from 'serpapi';
// const serpApi = new GoogleSearch(serpApiKey);

export default {
	async fetch(request, env, ctx) {
        if (!env.OPENAI_API_KEY) throw new Error("OpenAI API key is missing or invalid.");
        const openai = new OpenAI({
            apiKey: env.OPENAI_API_KEY,
        });

        if (!env.asstId) throw new Error("OpenAI Assistant ID is missing or invalid.");
        const asstId = env.asstId

        try {
            const ingredients = 'salmon'
            const additionalIngredients = 'yes'
            const people = 2
            const time = '1 hour'
            const equipment = 'oven/stovetop'
            // const { ingredients, additionalIngredients, people, time, equipment } = JSON.parse(event.body)
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
            const { data } = await listMessages(run.thread_id, openai)
            console.log(data[0].content)
            // return {
            //     statusCode: 200,
            //     body: JSON.stringify({ data }),
            // }
            return new Response({
                    statusCode: 200,
                    body: JSON.stringify({ data }),
                });
        } catch (e) {
            console.error('error:', e)
            return { statusCode: 500, body: e.toString() }
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
        console.error('Error running assistant for thread: ' + thread, e)
    }
}


async function retrieveRun(thread, run, openai) {
    try {
        return await openai.beta.threads.runs.retrieve(thread, run)
    } catch (e) {
        console.error('Error retrieving run for: ' + thread, e)
    }
}


async function google(query, env) {

    if (!env.SERP_API_KEY) throw new Error("SERP API key is missing or invalid.");
        const serpApiKey = env.SERP_API_KEY

    try {
        // const response = await getJson({
        //     engine: 'google',
        //     api_key: serpApiKey,
        //     q: query,
        // })
        const formData = new FormData();
        formData.append('engine', 'google');
        formData.append('api_key', serpApiKey);
        formData.append('q', query);

        const response = await fetch('https://serpapi.com/search', {
            method: 'POST',
            body: formData
        })

        const data = await response.json()

        if(response.ok){
            return data['recipes_results']
        } else {
            throw new Error(`SerpAPI request failed with status ${response.status}: ${data.error}`)
        }
        // return response['recipes_results']
    } catch (e) {
        console.error('error with SERP API', e)
    }
}


async function listMessages(thread, openai) {
    try {
        return await openai.beta.threads.messages.list(thread)
    } catch (e) {
        console.error('error listing messages for thread: ' + thread, e)
    }
}