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
        console.log(ingredients.value, additionalIngredients, people.value, time.value, equipment.value)

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
        console.log(recipeResponse)
    
        loading('loadingGetFormattedRecipes')
        const recipeResponseString = JSON.stringify(recipeResponse)
        console.log(recipeResponseString)
    
        const formattedRecipes = await getformattedRecipes(recipeResponseString)
        console.log(formattedRecipes)
    
        const recipeArray = JSON.parse(formattedRecipes)
        console.log(recipeArray)
    
        stopLoading()
        renderRecipes(recipeArray)
    } catch (e) {
        stopLoading()
        // errorMessage(formContainer, mainBtn, e)
        // console.error('Error running main function.', e)
        throw e
    }
}


async function getRecipes(ingredients, additionalIngredients, people, time, equipment){
    try {
        const response = await fetch('/.netlify/functions/fetchAI', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ingredients, additionalIngredients, people, time, equipment})
        })
        if(response.ok){
            const data = await response.json()
            return data.data[0].content[0].text.value
        } else {
            throw new Error('Error fetching recipes.')
        }
    } catch (e) {
        stopLoading()
        errorMessage(mainBtn, e.message)
        console.error('Error fetching recipes.', e)
    }
}


async function getformattedRecipes(recipeResponseString){
    try {
        const response = await fetch('/.netlify/functions/formatRecipes', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({recipeResponseString})
        })
        if(response.ok){
            const data = await response.json()
            return data.jsonRecipes.choices[0].message.content
        } else {
            throw new Error('Error formatting recipes.')
        }
    } catch (e) {
        stopLoading()
        errorMessage(mainBtn, e.message)
        console.error('Error formatting recipes.', e)
    }
}


async function renderRecipes(recipeArray){
    const recipeResults = document.getElementById('recipe-results')
    let recipeResultsHtml = ''
    try {
        if(recipeArray.length > 0){
            recipeResultsHtml = recipeArray.map((recipe) => new Recipe(recipe).getRecipeHtml()).join('')
        } else {
            throw new Error('Error loading recipes.')
        }
        console.log(recipeResultsHtml)
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