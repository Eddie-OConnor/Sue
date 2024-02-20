import { openai } from '../../../config/openai.config'

const handler = async (event) => {
    try {
        const { recipeResponseString } = JSON.parse(event.body)
        const jsonRecipes = await formatRecipe(recipeResponseString)
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
                    content: `You are an assistant that converts user messages into proper json 
                    format. Each recipe should be its own object and each item within recipe (title, url, 
                    rating, time, ingredients, thumbnail, and description) should be a parameter. Please 
                    format your response like this:

                    [
                        {
                            "title": "title",
                            "url": "url",
                            "rating": rating,
                            "time": "time",
                            "ingredients": ["ingredient1, ingredient2, ingredient3"],
                            "thumbnail": "thumbnail.jpeg",
                            "description": "description"
                        },
                        {
                            "title": "title",
                            "url": "url",
                            "rating": rating,
                            "time": "time",
                            "ingredients": ["ingredient1, ingredient2, ingredient3"],
                            "thumbnail": "thumbnail.jpeg",
                            "description": "description"
                        },
                        {
                            "title": "title",
                            "url": "url",
                            "rating": rating,
                            "time": "time",
                            "ingredients": ["ingredient1, ingredient2, ingredient3"],
                            "thumbnail": "thumbnail.jpeg",
                            "description": "description"
                        },
                    ]
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