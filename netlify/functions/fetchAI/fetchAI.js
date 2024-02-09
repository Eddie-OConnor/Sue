import { openai } from '../../../config/openai.config'

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
    const messages = [
        {
            role: 'system',
            content: `You are a virtual cookbook assistant. You provide a recipe from the web 
            that adheres to user answer parameters. Include recipe name, URL, and 
            description. Each should be an object within the response choice. Describe what it is 
            and why it is a good fit for their needs in 2 sentences or less. Do not repeat recipes.
            Do not start descriptions with words like "thanks!" or "great!" Only use real live URLs. Be
            as truthful as possible.

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
        },
        {
            role: 'user',
            content:`${one}, ${two}, ${three}, ${four}, ${five}, and ${six}`
        }
    ]
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-0125',
            messages: messages,
            n: 3,
            temperature: .5
        })
        return response
    } catch (e) {
        console.error('error generating recipes', e)
    }
}

export { handler }
