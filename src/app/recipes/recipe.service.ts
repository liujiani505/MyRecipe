import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model'

@Injectable()

export class RecipeService{

    recipesChanged = new Subject<Recipe[]>();
    
    // private recipes: Recipe[] = [
    //     new Recipe(
    //     'First Recipe', 
    //     'This is simply a test', 
    //     'https://hips.hearstapps.com/hmg-prod/images/delish-200114-baked-avocado-boats-0361-landscape-pflo-jpg-1647890967.jpg',
    //     [
    //         new Ingredient('Meet', 1),
    //         new Ingredient('French Fries', 20)
    //     ]),
    //     new Recipe(
    //     'Second Recipe', 
    //     'This is simply a test', 
    //     'https://cdn.vox-cdn.com/thumbor/4Qax3l4Lfd2eRqbQDehSYHs36p8=/0x0:5361x3574/1200x800/filters:focal(2253x1359:3109x2215)/cdn.vox-cdn.com/uploads/chorus_image/image/71012351/shutterstock_1391400113.0.jpg',
    //     [
    //         new Ingredient('Buns', 2),
    //         new Ingredient('Meat', 1)
    //     ]) 
    //   ];

    private recipes: Recipe[] = [];
    
    constructor(private slService: ShoppingListService){}

    setRecipes(recipes: Recipe[]){
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice())
    }

    getRecipes(){
        return this.recipes.slice(); // get a copy of recipes to protect the original recipes array
    }

    getRecipe(index: number){
        return this.recipes.slice()[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]){
        this.slService.addIngredients(ingredients);
    }
    
    addRecipe(recipe: Recipe){
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe){
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number){
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
} 