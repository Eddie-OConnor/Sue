const ingredients = 'ground beef'
const store = 'yes'
const people = '2'
const time = '1 hour'
const equipment = 'stove top, standard pots and pans, oven, crockpot, grill'
const allergicDislike = 'dairy and gluten'

async function getRecipes(one, two, three, four, five, six){
    try {
        const response = await fetch('/.netlify/functions/fetchAI', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({one, two, three, four, five, six})
        })
        if(response.ok){
            const data = await response.json()
            console.log(data)
            // return data
        } 
    } catch (e) {
        console.error('error fetching recipes', e)
    }
}

getRecipes(ingredients, store, people, time, equipment, allergicDislike)