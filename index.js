const ingredients = 'ground beef and rice'
const store = 'yes'
const people = '2'
const time = '1 hours'
const equipment = 'frying pan'
const allergicDislike = 'none'

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

// getRecipes(ingredients, store, people, time, equipment, allergicDislike)

const recipeResponse = `
[
    {
      type: 'text',
      text: {
        value: 'Here are three recipes that match your criteria:\n' +
          '\n' +
          '[1. Ground Beef and Rice Skillet Recipe](https://cookthestory.com/ground-beef-and-rice-skillet/)\n' +
          '- Rating: 5 ⭐ (25 Reviews)\n' +
          '- Total Time: 1 hr 15 min\n' +
          '- Main Ingredients: Ground beef, long grain rice, tomato paste, green bell pepper, Worcestershire sauce\n' +
          '- Thumbnail: ![Thumbnail](https://serpapi.com/searches/65ce43984055aa524e032021/images/aaa2ab285819e711b0fdf43a21dbe9dddb130a2f087f8948c0897a49ac01c2ef.jpeg)\n' +
          '- Description: A heartwarming skillet recipe that makes a meal of ground beef and rice brought together with the delightful flavors of tomato paste and green bell pepper.\n' +
          '\n' +
          '[2. Ground Beef and Rice Skillet Dinner](https://www.shakentogetherlife.com/ground-beef-and-rice-skillet-dinner/)\n' +
          '- Rating: 4.8 ⭐ (50 Reviews)\n' +
          '- Total Time: 30 min\n' +
          '- Main Ingredients: Ground beef, beef broth, cheddar cheese, long grain rice, red bell pepper\n' +
          '- Thumbnail: ![Thumbnail](https://serpapi.com/searches/65ce43984055aa524e032021/images/aaa2ab285819e711b0fdf43a21dbe9dd10e22063076ddf38a45b0f3dd5bfeaf1.jpeg)\n' +
          '- Description: A quick, 30 minute skillet dinner featuring savory ground beef and rice, enhanced with a spicy touch of red bell pepper and cheddar cheese.\n' +
          '\n' +
          '[3. Beef and Rice with Veggies](https://www.recipetineats.com/ground-beef-and-rice-recipe/)\n' +
          '- Rating: 4.9 ⭐ (93 Reviews)\n' +
          '- Total Time: 25 min\n' +
          '- Main Ingredients: Ground beef, grain white rice, beef broth, tomato paste, bell pepper\n' +
          '- Thumbnail: ![Thumbnail](https://serpapi.com/searches/65ce43984055aa524e032021/images/aaa2ab285819e711b0fdf43a21dbe9ddf9b6b00821329d4cafc0ffeb88d76642.jpeg)\n' +
          '- Description: This quick-fire recipe brings together ground beef, white rice, and vegetables in a symphony of taste that is ready in just 25 minutes.',
        annotations: []
      }
    }
  ]`
  


async function getJsonRecipes(recipes){
    try {
        const response = await fetch('/.netlify/functions/formatRecipes', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({recipes})
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


// const formattedRecipes = await getJsonRecipes(recipeResponse)