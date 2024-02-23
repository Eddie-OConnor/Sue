import {allergyDislikeChange, loading, stopLoading, enableMainBtn, errorMessage } from "./uxFunctions"
import Recipe from "./recipeConstructor"

const formContainer = document.getElementById('form-container')
const mainBtn = document.getElementById('main-btn')
const ingredients = document.getElementById('ingredients')
const additionalIngredientForm = document.getElementById('additional-ingredients-form')
const people = document.getElementById('total-people')
const time = document.getElementById('cooking-time')
const equipment = document.getElementById('cooking-equipment')
const allergicDislike = document.getElementById('allergies-dislikes')
let action = 'submit'

mainBtn.addEventListener('click', function () {
    try {
        if (action === 'submit') {
            action = 'reset'
            const additionalIngredients = additionalIngredientForm.querySelector('input[type="radio"]:checked').value
            const yes = allergicDislike.querySelector('input[id="allergy-dislike-input"]').value.trim() || ''
            const no = allergicDislike.querySelector('input[id="no-radio-allergy-dislike"]:checked')
            const allergicDislikeResult = no ? 'No' : yes
    
            main(ingredients.value, additionalIngredients, people.value, time.value, equipment.value, allergicDislikeResult)
            mainBtn.innerText = 'Reset'
        } else {
            location.reload()
        }
    } catch (e){
        mainBtn.innerText = 'Reset'
        action = 'reset'
        errorMessage(formContainer)
    }
})


async function main(ingredients, additionalIngredients, people, time, equipment, allergiesDislikes){
    formContainer.classList.toggle('hidden')
    loading('loadingGetRecipes')
    const recipeResponse = await getRecipes(ingredients, additionalIngredients, people, time, equipment, allergiesDislikes)
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
        } 
    } catch (e) {
        console.error('error fetching recipes', e)
    }
}


async function renderRecipes(recipeArray){
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
    } catch (e) {
        console.error('Error rendering recipe results', e)
    }
}


/* UX Functions */

ingredients.addEventListener('change', () => {
    enableMainBtn(mainBtn, ingredients.value, additionalIngredientForm, people.value, time.value, equipment.value, allergicDislike)
})
additionalIngredientForm.addEventListener('change', () => {
    enableMainBtn(mainBtn, ingredients.value, additionalIngredientForm, people.value, time.value, equipment.value, allergicDislike)
})
people.addEventListener('change', () => {
    enableMainBtn(mainBtn, ingredients.value, additionalIngredientForm, people.value, time.value, equipment.value, allergicDislike)
})
time.addEventListener('change', () => {
    enableMainBtn(mainBtn, ingredients.value, additionalIngredientForm, people.value, time.value, equipment.value, allergicDislike)
})
equipment.addEventListener('change', () => {
    enableMainBtn(mainBtn, ingredients.value, additionalIngredientForm, people.value, time.value, equipment.value, allergicDislike)
})
allergicDislike.addEventListener('change', () => {
    enableMainBtn(mainBtn, ingredients.value, additionalIngredientForm, people.value, time.value, equipment.value, allergicDislike)
})

allergicDislike.addEventListener('change', allergyDislikeChange)