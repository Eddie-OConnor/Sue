import { openai } from '../../../config/openai.config'

const handler = async (event) => {
    try {
        const { one, two, three, four, five, six, seven } = JSON.parse(event.body)
        const response = await generateRecipes(one, two, three, four, five, six, seven)
        return {
            statusCode: 200,
            body: JSON.stringify({ response }),
        }
    } catch (e) {
        console.error('error:', e)
        return { statusCode: 500, body: error.toString() }
    }
}

async function generateRecipes(one, two, three, four, five, six, seven) {
    const messages = [
        {
            role: 'system',
            content: `You are a master chef, recipe generator and virtual cookbook assistant. You provide 3-5 links to recipes 
            from the web that adhere to the user submitted parameters of ${one}, ${two}, ${three}, ${four}, ${five}, ${six}, and ${seven}. Please also include 
            a short 2-3 sentance description of the recipe so the user can get an idea of what the dish is before clicking the 
            link to learn more and perhaps cook the dish.`
        },
        {
            role: 'user',
            content:`${one}, ${two}, ${three}, ${four}, ${five}, ${six}, and ${seven}`
        }
    ]
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: messages,
            temperature: 1
        })
        console.log(response)
        return response
    } catch (e) {
        console.error('error generating recipes', e)
    }
}

export { handler }
