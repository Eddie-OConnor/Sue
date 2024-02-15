import { openai } from '../../../config/openai.config'
import { asstId } from '../../../config/assistant.config'
import { serpApiKey } from '../../../config/serpApi.config'
import { getJson } from 'serpapi'


const handler = async (event) => {
    try {
        const { one, two, three, four, five, six } = JSON.parse(event.body)
        const run = await createAndRun(asstId, one, two, three, four, five, six)
        let currentRun = await retrieveRun(run.thread_id, run.id)

        while (currentRun.status !== 'completed') {
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log(currentRun.status)
            currentRun = await retrieveRun(run.thread_id, run.id)

            if (currentRun.status === 'requires_action') {
                console.log(currentRun.status)
                const toolCalls = currentRun.required_action.submit_tool_outputs.tool_calls
                const parsedArguments = JSON.parse(toolCalls[0].function.arguments)
                const apiResponse = await google(parsedArguments.query)
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
                currentRun = await retrieveRun(run.thread_id, run.id)
            }
        }
        const { data } = await listMessages(run.thread_id)
        console.log(data[0].content)
        return {
            statusCode: 200,
            body: JSON.stringify({ data }),
        }
    } catch (e) {
        console.error('error:', e)
        return { statusCode: 500, body: e.toString() }
    }
}


async function createAndRun(assistant, one, two, three, four, five, six) {
    try {
        const response = await openai.beta.threads.createAndRun(
            {
                assistant_id: assistant,
                thread: {
                    messages: [
                        {
                            role: 'user',
                            content: `
                            Question: What ingredients do want to use?
                            Answer: ${one}
            
                            Question: Can you (or do you care to) shop for additional ingredients not mentioned above?
                            Answer: ${two}
            
                            Question: How many people are you cooking for?
                            Answer: ${three}
            
                            Question: How much time do you have?
                            Answer: ${four}
            
                            Question: What sort of cooking equipment do you want to use?
                            Answer: ${five}
            
                            Question: Allergies or dislikes that should be excluded from ingredients?
                            Answer: ${six}
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


async function retrieveRun(thread, run) {
    try {
        return await openai.beta.threads.runs.retrieve(thread, run)
    } catch (e) {
        console.error('Error retrieving run for: ' + thread, e)
    }
}


async function google(query) {
    try {
        const response = await getJson({
            engine: 'google',
            api_key: serpApiKey,
            q: query,
        })
        return response['recipes_results']
    } catch (e) {
        console.error('error with SERP API', e)
    }
}


async function listMessages(thread) {
    try {
        return await openai.beta.threads.messages.list(thread)
    } catch (e) {
        console.error('error listing messages for thread: ' + thread, e)
    }
}


export { handler }