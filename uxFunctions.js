const loadingContainer = document.getElementById('loading-graphic-container')

export function loading(graphic){
    loadingContainer.style.display = 'flex'
    if(graphic === 'loadingGetRecipes'){
        loadingContainer.innerHTML = `
        <img class="loading-icon" src="https://res.cloudinary.com/dexjsh4sa/image/upload/v1708718441/magnifyingbook_i0wwm9.gif" alt="recipe search gif">
        <p class="loading-text">Searching for recipes...<div id="loading-wheel"></div></p>
        `
    } else {
        loadingContainer.innerHTML = `
        <img class="loading-icon" id="sandwich" src="https://res.cloudinary.com/dexjsh4sa/image/upload/v1708718441/sandwich_w9wh0e.gif" alt="recipe load gif">
        <p class="loading-text">Loading recipes...<div id="loading-wheel"></div></p>
        `
    }
}


export function stopLoading(){
    loadingContainer.style.display = 'none'
}


export function enableMainBtn(mainBtn, ingredients, additionalIngredientForm, people, time, equipment){
    const additionalIngredients = additionalIngredientForm.querySelector('input[type="radio"]:checked')

    mainBtn.disabled = !(ingredients && additionalIngredients && people && time && equipment)
}


export function errorMessage(formContainer){
    formContainer.innerHTML = `
        <p class="error-msg">Unforseen error. Please refresh and try again. If the error persists, we have likely hit monthly limits on our free 
        third party tools. Please reach out to Ed and test again next month when our limits reset. Thanks!</p>
        `
}