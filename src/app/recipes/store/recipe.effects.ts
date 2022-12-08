import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import * as RecipesActions from './recipe.actions';
import { Recipe } from '../recipe.model';
import { Injectable } from '@angular/core';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';


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

    @Effect({dispatch: false})
    storeRecipes = this.actions$.pipe(ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),   // use special operator withLatestFrom to get the recipes from the store. It allows us to merge a value from another observable into this observable
    switchMap(([actionData, recipesState])=> {  // array destructuring syntax
        return this.http
        .put('https://myrecipe-28233-default-rtdb.firebaseio.com/recipes.json', recipesState.recipes)
    })
    )

    constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>){}
}