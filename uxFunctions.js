export function allergyDislikeChange(event){
    const allergyDislikeInput = document.getElementById('allergy-dislike-input')
    const choice = event.target.value
    allergyDislikeInput.classList.toggle('hidden', event.target.value === 'No')

    if (choice === 'No'){
        document.getElementById('yes-radio-allergy-dislike').checked = false
    } else {
        document.getElementById('no-radio-allergy-dislike').checked = false
    }
}


const loadingContainer = document.getElementById('loading-graphic-container')

export function loading(graphic){
    formContainer.classList.toggle('hidden')
    loadingContainer.style.display = 'flex'
    if(graphic === 'loadingGetRecipes'){
        loadingContainer.innerHTML = `
        <img class="loading-icon" src="./assets/magnifyingbook.gif" alt="recipe search gif">
        <p class="loading-text">Searching for recipes...<div id="loading-wheel"></div></p>
        `
    } else {
        loadingContainer.innerHTML = `
        <img class="loading-icon" id="sandwich" src="./assets/sandwich.gif" alt="recipe load gif">
        <p class="loading-text">Loading recipes...<div id="loading-wheel"></div></p>
        `
    }
}


export function stopLoading(){
    loadingContainer.style.display = 'none'
    console.log('loading stopped')
}


export function enableMainBtn(mainBtn, ingredients, additionalIngredientForm, people, time, equipment, allergicDislike){
    const additionalIngredients = additionalIngredientForm.querySelector('input[type="radio"]:checked')
    const allergicDislikeCheck = allergicDislike.querySelector('input[type="radio"]:checked')

    mainBtn.disabled = !(ingredients && additionalIngredients && people && time && equipment && allergicDislikeCheck)
}

export function errorMessage(){
    const formContainer = document.getElementById('form-container')
    formContainer.innerHTML = `
        <p class="error-msg">Unforseen error. Please refresh and try again. If the error persists, we have likely hit monthly limits on our free 
        third party tools. Please reach out to Ed and test again next month when our limits reset. Thanks!</p>
        `
}