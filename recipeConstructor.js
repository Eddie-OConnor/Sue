class Recipe {
    constructor(data){
        Object.assign(this, data)
    }

    getRecipeHtml(){
        const {title, url, rating, time, ingredients, thumbnail, description} = this
        return `
            <div class="recipe-container">
                <a href="${url}"><img class="thumbnail" src="${thumbnail}" alt="recipe image thumbnail"></a>
                <div class="recipe-details-container">
                    <a href="${url}"><h3 class="recipe-title">${title}</h3></a>
                    <span class="recipe-rating">${rating}</span>
                    <span class="recipe-time">${time}</span>
                    <span class="recipe-ingedients">${ingredients}</span>
                    <p class="recipe-description">${description}</p>
                </div>
            </div>
        `
    }
}

export default Recipe