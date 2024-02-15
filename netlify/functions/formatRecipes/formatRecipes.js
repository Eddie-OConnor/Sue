import { openai } from '../../../config/openai.config'

const handler = async (event) => {
    try {
        const { recipes } = JSON.parse(event.body)
        const jsonRecipes = await formatRecipe(recipes)
        return {
            statusCode: 200,
            body: JSON.stringify({ jsonRecipes }),
        }
    } catch (e) {
        console.error('error:', e)
        return { statusCode: 500, body: e.toString() }
    }
}


async function formatRecipe(recipes) {
    try {
        const response = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are an assistant that converts user messages into an array. Each recipe 
                    should be its own object and each item within recipe (title, rating, time, ingredients, 
                    thumbnail, and description) should be a parameter. Below between the ### is an example
                    of what to return.
                    ###
                    [
                        {
                            "title": "recipe example",
                            "rating": "x ⭐ (y Reviews)",
                            "time": "x hr",
                            "ingredients": "ingredient examples",
                            "thumbnail": "example_thumbnail.jpeg",
                            "description": "example description"
                        },
                        {
                            additional objects
                        },
                    ]
                    ###
                    `
                },
                {
                    role: 'user',
                    content:`${recipes}`
                }
            ],
            model: 'gpt-3.5-turbo-0125'
        })
        return response
    } catch (e) {
        console.error('Error converting recipes to JSON', e)
    }
}


export { handler }