const ingredients = 'chicken breast'
const store = 'yes'
const people = '2'
const time = '1 hours'
const equipment = 'frying pan'
const allergicDislike = 'none'

async function getThread() {
    try {
        const response = await fetch('/.netlify/functions/createThread', {
        })
        if (response.ok) {
            const data = await response.json()
            return data.threadId
        }
    } catch (e) {
        console.error('error fetching threadId', e)
    }
}

// const threadId = await getThread()

async function getRecipes(threadId, one, two, three, four, five, six){
    try {
        const response = await fetch('/.netlify/functions/fetchAI', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({threadId, one, two, three, four, five, six})
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


// getRecipes(threadId, ingredients, store, people, time, equipment, allergicDislike)