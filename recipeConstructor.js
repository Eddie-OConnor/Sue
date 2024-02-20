class Recipe {
    constructor(data){
        Object.assign(this, data)
    }

    getRecipeHtml(){
        const {title, url, rating, time, ingredients, thumbnail, description} = this
        return `
            <a href="${url}">
                <div class="recipe-container">
                    <img class="thumbnail" src="${thumbnail}" alt="recipe image thumbnail">
                    <h3 class="recipe-title">${title}</h3>
                    <p class="recipe-rating">${rating}</p>
                    <p class="recipe-time">${time}</p>
                    <p class="recipe-ingredients">${ingredients}</p>
                    <p class="recipe-description">${description}</p>
                </div>
            </a>
        `
    }
}

export default Recipe