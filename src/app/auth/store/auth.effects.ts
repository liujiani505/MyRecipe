import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';



export interface AuthResponseData{
    kind:string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}


export class AuthEffects {
    @Effect()
    authLogin = this.actions$.pipe(
        // ofType operator allows you to define a filter for which types of effects you want to continue in this observable pipe
        ofType(AuthActions.LOGIN_START),
        // switchMap allows us to create a new observable by taking another observable's data
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAIPKey,
                { 
                email: authData.payload.email, 
                password: authData.payload.password, 
                returnSecureToken: true
                }
            ).pipe(catchError(error => {
                of();
            }), map( resData => {
                of();
            }));
        }),
    );

    // Actions is one big obervable that will give you access to all dispatched actions, so you can react to them
    constructor(private actions$: Actions, private http: HttpClient){}
}