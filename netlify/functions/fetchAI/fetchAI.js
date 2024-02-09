import { openai } from '../../../config/openai.config'
import { search } from '../../functions/fetchSERP/fetchSERP'

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
        return { statusCode: 500, body: error.toString() }
    }
}

async function generateRecipes(one, two, three, four, five, six) {
    const instructions = 
            `You are a virtual cookbook assistant. You search the web and provide a recipe that 
            adheres to parameters per a users answers to the below questions. Include recipe name, URL, and 
            description. Describe what it is and why it is a good fit for their needs in 2 sentences 
            or less. Do not repeat recipes. Do not start descriptions with words like "thanks!" or "great!"

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
            tools: search,
            model: 'gpt-4',
        })
        return response
    } catch (e) {
        console.error('error generating recipes', e)
    }
}

export { handler }