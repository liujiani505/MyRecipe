import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeItemComponent } from "./recipe-list/recipe-item/recipe-item.component";
import { RecipeListComponent } from "./recipe-list/recipe-list.component";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesRoutingModule } from "./recipes-routing.module";
import { RecipesComponent } from "./recipes.component";

@NgModule({
    declarations:[
        RecipesComponent,
        RecipeListComponent,
        RecipeDetailComponent,
        RecipeItemComponent,
        RecipeStartComponent,
        RecipeEditComponent,
    ],
    imports: [RouterModule, CommonModule, ReactiveFormsModule, RecipesRoutingModule],      // we have to import these because we're not getting them from app module automatically. Services are different, they only need to be set up once in app module, and you can access them in your whole application even in components which you added to feature modules. 
    // exports:[
    //     RecipesComponent,
    //     RecipeListComponent,
    //     RecipeDetailComponent,
    //     RecipeItemComponent,
    //     RecipeStartComponent,
    //     RecipeEditComponent,
    // ]
    // don't need to export these components anymore because we created and imported recipes-routing module and we're only using these components internally in recipes module.
})

export class RecipesModule {}