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