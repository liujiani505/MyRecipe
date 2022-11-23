import { Action } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";


// to describe application wide state, not just the state of this reducer
export interface AppState {
    shoppingList: State;
}


export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

// we're in a javascript object, we assign values with colon
const initialState: State = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
    ],
    editedIngredient: null,
    editedIngredientIndex: -1
}

export function shoppingListReducer (state: State = initialState, action: ShoppingListActions.ShoppingListActions) {
    switch(action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            // state.ingredients.push() is bad practice because state changes with ngrx always have to be immutable, which means you must not edit the existing or previous state
            // instead return a new object which will replace the old state, to not loose the old data, copy the old state with the spread operator
            return {
                ...state,   // best practice to copy the old state to prevent from losing the untouched old properties
                ingredients: [...state.ingredients, action.payload]
            };

        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]   //because the payload type of ADD_INGREDIENTS is an array, so we use spread operator to add the elements to advoid a nested array
            };

        case ShoppingListActions.UPDATE_INGREDIENT:
            // get the ingredient we want to edit
            const ingredient = state.ingredients[action.payload.index];
            // data here is immutable, so we create a copy
            // using spread operator to copy the old ingredient, then to overwrite the old ingredient using new ingredient from action payload
            const updatedIngredient = {
                ...ingredient, 
                ...action.payload.ingredient
            }
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[action.payload.index] = updatedIngredient;

            return {
                ...state,
                ingredients: updatedIngredients
            };
        
        case ShoppingListActions.DELETE_INGREDIENT:

            return {
                ...state,
                // filter will always return a new array, if the function passed into filter returns true, then the function returns a new array consisting of those elements that satisfy the boolean function (the function returns false, so the deleted ingredient will be filtered out)
                ingredients: state.ingredients.filter((ig, igIndex) => {
                    return igIndex !== action.payload;
                })  
            };

        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngredientIndex: action.payload,
                editedIngredient: {...state.ingredients[action.payload]}
            };
        
        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredientIndex: -1,
                editedIngredient: null,
            };

        default:
            return state;
    }
}