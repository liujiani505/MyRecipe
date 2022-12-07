import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model'
import { RecipeService } from '../recipe.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe;
  id: number;

  constructor(private recipeService:RecipeService, private route: ActivatedRoute, private router: Router, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params
    .subscribe((params: Params) => {
      this.id = + params['id'];
      // this.recipe = this.recipeService.getRecipe(this.id);
      this.store.select('recipes').pipe(
        map(recipesState => {
          return recipesState.recipes.find((recipe, index) => {    //find() method returns the first element in the provided array that satisfies the provided testing function. 
            return index === this.id;
          })
      } ))
      .subscribe(recipe => {
        this.recipe = recipe;
      });
    })
  }

  onAddToShoppingList(){
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.route})
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route})
  }

  onDeleteRecipe(){
    console.log('this has been deleted')
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes'])
  }
}
