// - what ingredients do you have? are there any that you need or really want to use?
// - can you go to the store for additional ingredients?
// - how many people are you cooking for?
// - do you want leftovers?
// - how much time do you have?
// - any allergies or dislikes?
// - what sort of cooking equipment do you have or want to use?

const ingredients = 'chicken breast, rice, green beans, tomato sauce, a full spice cabinet'
const store = 'no'
const people = '6'
const leftovers = 'yes'
const time = '3 hours'
const allergies = 'gluten and dairy'
const cookingEquipment = 'stove top, standard pots and pans, oven, crockpot'

async function getRecipes(one, two, three, four, five, six, seven){
    try {
        const response = await fetch('/.netlify/functions/fetchAI', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({one, two, three, four, five, six, seven})
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

getRecipes(ingredients, store, people, leftovers, time, allergies, cookingEquipment)