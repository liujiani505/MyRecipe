import { Action } from '@ngrx/store'
import { Ingredient } from 'src/app/shared/ingredient.model';


export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';
export const START_EDIT = 'START_EDIT';
export const STOP_EDIT = 'STOP_EDIT';


// Action is an interface
export class AddIngredient implements Action {
    readonly type = ADD_INGREDIENT;  // adding typescript annotation readonly to indicate that this should never be changed from outside.
    // payload: Ingredient  //payload is not a name you have to use, the Action interface only forces you to add a "type" property
    // instead of adding payload as a property, we can add a constructor function where we accept a payload argument so in shopping list edit component, we can pass newingredient as an argument to dispatch an action.
    constructor(public payload: Ingredient) {}
}

export class AddIngredients implements Action {
    readonly type = ADD_INGREDIENTS;
    constructor(public payload: Ingredient[]){}
}

export class UpdateIngredient implements Action {
    readonly type = UPDATE_INGREDIENT;
    constructor(public payload: Ingredient){}
}

export class DeleteIngredient implements Action {
    readonly type = DELETE_INGREDIENT;
}

export class StartEdit implements Action {
    readonly type = START_EDIT;
    constructor(public payload: number){} // payload is the index
}

export class StopEdit implements Action {
    readonly type = STOP_EDIT;
}


export type ShoppingListActions = AddIngredient | AddIngredients | UpdateIngredient | DeleteIngredient | StartEdit | StopEdit;   // union type to be used in shopping-list reducer