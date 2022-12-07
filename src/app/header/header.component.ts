import { Component, OnDestroy, OnInit} from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer'
import { map } from "rxjs/operators";
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';


@Component({
    selector: 'app-header',
    templateUrl:'./header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy{

    isAuthenticated = false;
    private userSub: Subscription;

    constructor(private dataStorageService: DataStorageService, private authService: AuthService, private store: Store<fromApp.AppState>){}

    ngOnInit(): void {
        this.userSub = this.store.select('auth')
        .pipe(map(authState => authState.user))
        .subscribe(user => {
            this.isAuthenticated = !user ? false : true;
        })
    }

    onSaveData(){
        this.dataStorageService.storeRecipes();
    }

    onFetchData(){
        // this.dataStorageService.fetchRecipes().subscribe();
        this.store.dispatch( new RecipeActions.FetchRecipes())
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }

    onLogout(){
        // this.authService.logout();
        this.store.dispatch(new AuthActions.Logout())
    }

}