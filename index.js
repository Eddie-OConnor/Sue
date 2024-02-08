const ingredients = 'chicken breast, rice, green beans, tomato sauce, a full spice cabinet'
const store = 'no'
const people = '6'
const time = '3 hours'
const cookingEquipment = 'stove top, standard pots and pans, oven, crockpot'

async function getRecipes(one, two, three, four, five){
    try {
        const response = await fetch('/.netlify/functions/fetchAI', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({one, two, three, four, five})
        })
        if(response.ok){
            const data = await response.json()
            console.log(data)
            return data
        } 
    } catch (e) {
        console.error('error fetching recipes', e)
    }
}

getRecipes(ingredients, store, people, time, cookingEquipment)