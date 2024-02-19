import { allergyDislikeChange } from "./uxFunctions"

import Recipe from "./recipeConstructor"
const submitBtn = document.getElementById('submit-btn')
const ingredients = document.getElementById('ingredients')
const additionalIngredientForm = document.getElementById('additional-ingredients-form')
const people = document.getElementById('total-people')
const time = document.getElementById('cooking-time')
const equipment = document.getElementById('cooking-equipment')
const allergicDislike = document.getElementById('allergies-dislikes')


submitBtn.addEventListener('click', function(){
    const additionalIngredients = additionalIngredientForm.querySelector('input[type="radio"]:checked').value
    const yes = allergicDislike.querySelector('input[id="allergy-dislike-input"]').value.trim() || ''
    const no = allergicDislike.querySelector('input[id="no-radio-allergy-dislike"]:checked')
    const allergicDislikeResult = no ? 'No' : yes

    console.log(ingredients.value, additionalIngredients, people.value, time.value, equipment.value, allergicDislikeResult)
    main(ingredients.value, additionalIngredients, people.value, time.value, equipment.value, allergicDislikeResult)
})


async function main(ingredients, additionalIngredients, people, time, equipment, allergiesDislikes){
    const recipeResponse = await getRecipes(ingredients, additionalIngredients, people, time, equipment, allergiesDislikes)
    console.log(recipeResponse)

    const recipeResponseString = JSON.stringify(recipeResponse)
    console.log(recipeResponseString)

    const formattedRecipes = await getformattedRecipes(recipeResponseString)
    console.log(formattedRecipes)

    const recipeArray = JSON.parse(formattedRecipes)
    console.log(recipeArray)

    renderRecipes(recipeArray)
}


async function getRecipes(ingredients, additionalIngredients, people, time, equipment, allergiesDislikes){
    try {
        const response = await fetch('/.netlify/functions/fetchAI', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ingredients, additionalIngredients, people, time, equipment, allergiesDislikes})
        })
        if(response.ok){
            const data = await response.json()
            return data.data[0].content[0].text.value
        } 
    } catch (e) {
        console.error('error fetching recipes', e)
    }
}


async function getformattedRecipes(recipeResponse){
    try {
        const response = await fetch('/.netlify/functions/formatRecipes', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({recipeResponse})
        })
        if(response.ok){
            const data = await response.json()
            return data.jsonRecipes.choices[0].message.content
        } 
    } catch (e) {
        console.error('error fetching recipes', e)
    }
}


async function renderRecipes(recipeArray){
    const formContainer = document.getElementById('form-container')
    const recipeResults = document.getElementById('recipe-results')
    let recipeResultsHtml = ''
    try {
        if(recipeArray.length > 0){
            recipeResultsHtml = recipeArray.map((recipe) => new Recipe(recipe).getRecipeHtml()).join('')
        } else {
            recipeResultsHtml = `
            <p> Unable to load recipes. Please try another search.</p>
            `
        }
        console.log(recipeResultsHtml)
        recipeResults.innerHTML = recipeResultsHtml
        formContainer.classList.toggle('hidden')
        recipeResults.classList.toggle('hidden')
    } catch (e) {
        console.error('Error rendering recipe results', e)
    }
}


/* UX Functions */

allergicDislike.addEventListener('change', allergyDislikeChange)



// const recipeResponse =
// [
//     {
//       type: 'text',
//       text: {
//         value: 'Here are three recipes that you can make using chicken and rice:\n' +
//           '\n' +
//           '1. One Pot Chicken and Rice:\n' +
//           '   - Link: [One Pot Chicken and Rice](https://iowagirleats.com/one-pot-chicken-and-rice/)\n' +
//           '   - Rating: 5 out of 5 stars\n' +
//           '   - Reviews: 185\n' +
//           '   - Total Time: Not specified\n' +
//           '   - Ingredients: Jasmine rice, baby carrots, chicken breasts, butter, chicken stock\n' +
//           '   - Description: This recipe combines chicken, rice, and vegetables in a delicious one-pot dish.\n' +
//           '\n' +
//           '2. One Pot Chicken and Rice:\n' +
//           '   - Link: [One Pot Chicken and Rice](https://www.budgetbytes.com/one-pot-chicken-and-rice/)\n' +
//           '   - Rating: 4.7 out of 5 stars\n' +
//           '   - Reviews: 72\n' +
//           '   - Total Time: 50 minutes\n' +
//           '   - Ingredients: Skinless chicken thighs, grain white rice, vegetable broth, garlic powder, onion powder\n' +
//           '   - Description: This budget-friendly recipe requires only one pot and is packed with flavor.\n' +
//           '\n' +
//           '3. Oven Baked Chicken and Rice:\n' +
//           '   - Link: [Oven Baked Chicken and Rice](https://www.recipetineats.com/oven-baked-chicken-and-rice/)\n' +
//           '   - Rating: 4.9 out of 5 stars\n' +
//           '   - Reviews: 527\n' +
//           '   - Total Time: 1 hour 20 minutes\n' +
//           '   - Ingredients: Chicken thigh fillets, white rice, olive oil, hot, garlic powder\n' +
//           '   - Description: This recipe creates tender and juicy chicken with perfectly cooked rice using the oven baking method.\n' +
//           '\n' +
//           'Enjoy your cooking!',
//         annotations: []
//       }
//     }
//   ]


// const recipeArrayString = 
// `[
//     {
//         "title": "One Pot Chicken and Rice",
//         "url": "https://iowagirleats.com/one-pot-chicken-and-rice/",
//         "rating": "5 ⭐ (185 Reviews)",
//         "time": "Not specified",
//         "ingredients": "Jasmine rice, baby carrots, chicken breasts, butter, chicken stock",
//         "thumbnail": "",
//         "description": "This recipe combines chicken, rice, and vegetables in a delicious one-pot dish."
//     },
//     {
//         "title": "One Pot Chicken and Rice",
//         "url": "https://www.budgetbytes.com/one-pot-chicken-and-rice/",
//         "rating": "4.7 ⭐ (72 Reviews)",
//         "time": "50 minutes",
//         "ingredients": "Skinless chicken thighs, grain white rice, vegetable broth, garlic powder, onion powder",
//         "thumbnail": "",
//         "description": "This budget-friendly recipe requires only one pot and is packed with flavor."
//     },
//     {
//         "title": "Oven Baked Chicken and Rice",
//         "url": "https://www.recipetineats.com/oven-baked-chicken-and-rice/",
//         "rating": "4.9 ⭐ (527 Reviews)",
//         "time": "1 hour 20 minutes",
//         "ingredients": "Chicken thigh fillets, white rice, olive oil, hot, garlic powder",
//         "thumbnail": "",
//         "description": "This recipe creates tender and juicy chicken with perfectly cooked rice using the oven baking method."
//     }
// ]`