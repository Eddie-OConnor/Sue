class Recipe {
    constructor(data){
        Object.assign(this, data)
    }

    getRecipeHtml(){
        const {title, rating, time, ingredients, thumbnail, description} = this
        return `
            <div>
                <span>${title}</span>
                <span>${rating}</span>
                <span>${time}</span>
                <span>${ingredients}</span>
                <span>${thumbnail}</span>
                <span>${description}</span>
            </div>
        `
    }
}

export default Recipe