import { Recipe } from '../recipe.model'


export interface State {
    recipes: Recipe[],
}

const initialState: State = {
    recipes: []
}

export function recipeReducer(state: State, action){
     return state;
}