import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipe.actions'

export interface State {
    recipes: Recipe[],
}

const initialState: State = {
    recipes: []
}

export function recipeReducer(state = initialState, action: RecipesActions.RecipesActions){
     switch(action.type){
        case RecipesActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            }
        case RecipesActions.ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            }
        case RecipesActions.UPDATE_RECIPE:
            const updatedRecipe = {...state.recipes[action.payload.index], 
                ...action.payload.newRecipe
            } // use spread operator and curly braces to pull out all the properties.
            const updatedRecipes = [...state.recipes];
            updatedRecipes[action.payload.index] = updatedRecipe; //to overwrite
            return {
               ...state,
                recipes: updatedRecipes
            }
        case RecipesActions.DELETE_RECIPE:
            return {
                ...state,
                recipes: state.recipes.filter((recipe, index) => {
                    return index !== action.payload;   //if this returns true, we will filter (remove) the matching element
                })  //filter always return a new list
            }
        default:
            return state;
     }
}