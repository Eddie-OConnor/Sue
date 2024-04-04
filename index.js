import { loading, stopLoading, enableMainBtn, errorMessage } from "./uxFunctions"
import Recipe from "./recipeConstructor"

const formContainer = document.getElementById('form-container')
const mainBtn = document.getElementById('main-btn')
const ingredients = document.getElementById('ingredients')
const additionalIngredientForm = document.getElementById('additional-ingredients-form')
const people = document.getElementById('total-people')
const time = document.getElementById('cooking-time')
const equipment = document.getElementById('cooking-equipment')
let action = 'submit'

mainBtn.addEventListener('click', function () {
    if (action === 'submit') {
        action = 'reset'
        const additionalIngredients = additionalIngredientForm.querySelector('input[type="radio"]:checked').value

        main(ingredients.value, additionalIngredients, people.value, time.value, equipment.value)
        mainBtn.innerText = 'Reset'
    } else {
        location.reload()
    }
})


async function main(ingredients, additionalIngredients, people, time, equipment){
    try {
        formContainer.classList.toggle('hidden')
        loading('loadingGetRecipes')
        const recipeResponse = await getRecipes(ingredients, additionalIngredients, people, time, equipment)
        loading('loadingGetFormattedRecipes')
        // const recipeResponseString = JSON.stringify(recipeResponse)
        // const formattedRecipes = await getformattedRecipes(recipeResponseString)
        console.log(recipeResponse)
        const recipeArray = JSON.parse(recipeResponse)
        stopLoading()
        renderRecipes(recipeArray)
    } catch (e) {
        stopLoading()
        throw e
    }
}


async function getRecipes(ingredients, additionalIngredients, people, time, equipment){
    try {
        const response = await fetch('https://fetch-recipes-worker.eddie-oconnor3.workers.dev', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ingredients, additionalIngredients, people, time, equipment})
        })
        if(response.ok){
            const data = await response.json()
            console.log(data)
            return data
            // return data.data[0].content[0].text.value
        } else {
            throw new Error('Error fetching recipes.')
        }
    } catch (e) {
        stopLoading()
        errorMessage(mainBtn, e.message)
        console.error('Error fetching recipes.', e)
    }
}


// async function getformattedRecipes(recipeResponseString){
//     try {
//         const response = await fetch('/.netlify/functions/formatRecipes', { 
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({recipeResponseString})
//         })
//         if(response.ok){
//             const data = await response.json()
//             return data.jsonRecipes.choices[0].message.content
//         } else {
//             throw new Error('Error formatting recipes.')
//         }
//     } catch (e) {
//         stopLoading()
//         errorMessage(mainBtn, e.message)
//         console.error('Error formatting recipes.', e)
//     }
// }


async function renderRecipes(recipeArray){
    const recipeResults = document.getElementById('recipe-results')
    let recipeResultsHtml = ''
    try {
        if(recipeArray.length > 0){
            recipeResultsHtml = recipeArray.map((recipe) => new Recipe(recipe).getRecipeHtml()).join('')
        } else {
            throw new Error('Error loading recipes.')
        }
        recipeResults.innerHTML = recipeResultsHtml
    } catch (e) {
        stopLoading()
        errorMessage(mainBtn, e.message)
        console.error('Error loading recipes.', e)
    }
}


/* UX Functions */

formContainer.addEventListener('change', () => {
    enableMainBtn(mainBtn, ingredients.value, additionalIngredientForm, people.value, time.value, equipment.value)
})