import { Ingredient } from "../shared/ingredient.model";
import { Action } from "@ngrx/store";

// we're in a javascript object, we assign values with colon
const initialState = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
      ]
}

export function shoppingListReducer (state= initialState, action: Action) {
    switch(action.type) {
        case 'ADD_INGREDIENT':
            // state.ingredients.push() is bad practice because state changes with ngrx always have to be immutable, which means you must not edit the existing or previous state
            // instead return a new object which will replace the old state, to not loose the old data, copy the old state with the spread operator
            return {
                ...state,   // best practice to copy the old state to prevent from losing the untouched old properties. 
                ingredients: [...state.ingredients, action]
            }
    }
}