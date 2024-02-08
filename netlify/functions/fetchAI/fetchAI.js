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

async function generateRecipes(one, two, three, four, five, six) {
    const messages = [
        {
            role: 'system',
            content: `You are a virtual cookbook assistant. Within 10 seconds, you provide 3 recipe URLs that adhere to the user submitted parameters of ${one}, ${two}, ${three}, ${four}, and ${five}`
        },
        {
            role: 'user',
            content:`${one}, ${two}, ${three}, ${four}, and ${five}`
        }
    ]
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
        })
        console.log(response)
        return response
    } catch (e) {
        console.error('error generating recipes', e)
    }
}

export { handler }
