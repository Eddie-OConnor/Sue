import { openai } from '../../../config/openai.config'
import { serpApiKey } from '../../../config/serpApi.config'

const handler = async (event) => {
    try {
        const { one, two, three, four, five, six } = JSON.parse(event.body)
        const response = await generateRecipes(one, two, three, four, five, six)
        return {
            statusCode: 200,
            body: JSON.stringify({ response }),
        }
    } catch (e) {
        console.error('error:', e)
        return { statusCode: 500, body: e.toString() }
    }
}


async function generateRecipes(one, two, three, four, five, six) {
    const instructions = 
            `You are a virtual cookbook assistant. You digest the users' answers to the below questions. 
            Search the web using the function within 'tools' to find a recipe that adheres to the required 
            parameters. Include recipe name, URL, and description in your response. Describe what it is 
            and why it is a good fit for their needs in 2 sentences or less. Do not repeat recipes. Do not 
            start descriptions with words like "thanks!" or "great!"

            Question: What ingredients do want to use?
            Answer: ${one}

            Question: Can you (or do you care to) shop for additional ingredients not mentioned above?
            Answer: ${two}

            Question: How many people are you cooking for?
            Answer: ${three}

            Question: How much time do you have?
            Answer: ${four}

            Question: What sort of cooking equipment do you have or want to use?
            Answer: ${five}

            Question: Allergies or dislikes that should be excluded from ingredients?
            Answer: ${six}
            `
    try {
        const response = await openai.beta.assistants.create({
            instructions: instructions,
            name: 'Cookbook Assistant',
            tools: functionObj,
            model: 'gpt-4',
        })
        console.log(response)
        return response
    } catch (e) {
        console.error('error generating recipes', e)
    }
}


const functionObj = [
    {
        type: 'function',
        function: {
            name: 'google',
            description: 'search the web using the Google search engine.',
            parameters: {
                type: "object",
                properties: {
                    search: {
                        type: 'string', description: 'recipe search query'
                    }
                },
                required: ['search']
            }
        }
    }
]


async function google(query) {
    console.log('searched!')
    try {
        const response = await getJson({
            engine: 'google',
            api_key: serpApiKey,
            q: query,
        });
        console.log(response)
        return response;
    } catch (e) {
        console.error('error with SERP API', e)
    }
}


export { handler }