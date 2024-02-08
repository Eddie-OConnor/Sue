import { openai } from '../../../config/openai.config'

const handler = async (event) => {
    try {
        const { one, two, three, four, five } = JSON.parse(event.body)
        const response = await generateRecipes(one, two, three, four, five)
        return {
            statusCode: 200,
            body: JSON.stringify({ response }),
        }
    } catch (e) {
        console.error('error:', e)
        return { statusCode: 500, body: error.toString() }
    }
}

async function generateRecipes(one, two, three, four, five) {
    const messages = [
        {
            role: 'system',
            content: `You are a virtual cookbook assistant. Based on user answers to five below questions, you provide a recipe URL
            that adheres to the parameters. Do not repeat recipes.

            Question: what ingredients do want to use?
            Answer: ${one}

            Question: Can you (or do you care to) go to the store for additional ingredients not mentioned above?
            Answer: ${two}

            Question: How many people are you cooking for?
            Answer: ${three}

            Question: How much time do you have?
            Answer: ${four}

            Question: what sort of cooking equipment do you have or want to use?
            Answer: ${five}
            `
        },
        {
            role: 'user',
            content:`${one}, ${two}, ${three}, ${four}, and ${five}`
        }
    ]
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-0125',
            messages: messages,
            n: 3
        })
        console.log(response)
        return response
    } catch (e) {
        console.error('error generating recipes', e)
    }
}

export { handler }
