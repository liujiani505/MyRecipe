import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model'
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';


@Injectable({providedIn: 'root'})

export class DataStorageService {
    constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) {
    }

    storeRecipes(){
        const recipes = this.recipeService.getRecipes();
        return this.http
        .put('https://myrecipe-28233-default-rtdb.firebaseio.com/recipes.json', recipes)
        .subscribe(response =>{
            console.log(response)
        })
    }


    fetchRecipes(){
        // // don't want to set up an ongoing subscription to the user, but we need the access to the user, so to make sure we only get the user once and unsubscribe when it's done. We can use the special take(1) rxjs operator, this tells rxjs that we only want to take one value from the observable and after it should automatically unsubscribe.
        // // the exhaustMap() operator waits for the first (user) obeservable to complete, which will happen after we take the latest user. After it gives us the user, we return a new obervable in there, which will then replace the previous observable in that observable chain. So the userSubject observble will be replaced by the inner http observable we returned inside of that function we passed through the exhaustMap. 
        // return this.authService.userSubject.pipe(take(1), 
        // exhaustMap(user => {
        //     // ADD TOKEN TO THE HTTP REQUEST - for firbase and realtime database rest API, we add token as a query parameter in the url. For other apis, you add it as a header in the request.
        //     return this.http
        //     .get<Recipe[]>('https://myrecipe-28233-default-rtdb.firebaseio.com/recipes.json', 
        //         {
        //             params: new HttpParams().set('auth', user.token)
        //         }
        //     );
        // }),
        // map(recipes => {
        //     return recipes.map(recipe => {
        //         return {
        //             ...recipe,
        //             ingredients: recipe.ingredients ? recipe.ingredients : []
        //         };
        //     });
        // }),
        // tap(recipes => {
        //     this.recipeService.setRecipes(recipes);
        // })
        // );  
        
        
        //attaching token with an interceptor, because it will automatically work for storing recipes, so we don't need to repeat our code
        return this.http
            .get<Recipe[]>('https://myrecipe-28233-default-rtdb.firebaseio.com/recipes.json') 
            .pipe(
                map(recipes => {
                        return recipes.map(recipe => {
                            return {
                                ...recipe,
                                ingredients: recipe.ingredients ? recipe.ingredients : []
                            };
                        });
                    }),
                tap(recipes => {
                    this.recipeService.setRecipes(recipes);
                })
            )
        
    }

}