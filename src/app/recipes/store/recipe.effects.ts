import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs/operators';
import * as RecipesActions from './recipe.actions';
import { Recipe } from '../recipe.model';
import { Injectable } from '@angular/core';


@Injectable()
export class RecipeEffects {

    @Effect()
    fetchRecipes = this.actions$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() => {
            return this.http.get<Recipe[]>(
            'https://myrecipe-28233-default-rtdb.firebaseio.com/recipes.json'
            ); 
        }),
        map(recipes => {
            return recipes.map(recipe => {
                return {
                    ...recipe,
                    ingredients: recipe.ingredients ? recipe.ingredients : []
                };
            });
        }),
        // then the goal is to return a new action which will be dispatched automatically
        map(recipes => {
            return new RecipesActions.SetRecipes(recipes); // this will be automatically dispatched by ngrx effects
        })
    );
    constructor(private actions$: Actions, private http: HttpClient){}
}