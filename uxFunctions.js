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