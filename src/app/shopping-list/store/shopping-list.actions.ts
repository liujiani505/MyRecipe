import { Action } from '@ngrx/store'
import { Ingredient } from 'src/app/shared/ingredient.model';


export const ADD_INGREDIENT = 'ADD_INGREDIENT';


// Action is an interface
export class AddIngredient implements Action {
    readonly type = ADD_INGREDIENT;  // adding typescript annotation readonly to indicate that this should never be changed from outside.
    payload: Ingredient  //payload is not a name you have to use, the Action interface only forces you to add a "type" property
}