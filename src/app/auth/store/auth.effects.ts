import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';



export interface AuthResponseData{
    kind:string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable()

export class AuthEffects {
    @Effect()
    // register first effect as a normal property in AuthEffects class. we don't need to subscribe to the aticons observable because ngrx will subscribe for you 
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
            )
            // by now, our autheffect for login is done, this effect won't work because of a couple of reasons, first, an effect by default should return a new action at the end once it's done, because this effect itself doesn't change the state (just excuated some code) nowhere do we touch our reducer or our ngrx state. But typically when the effect is done, you want to edit the state. For this case, once we're logged in successfully, I of course want to dispatch my login action so that the reducer can take over and create the user object

            // Different than service call. For effects, "this.actions$.pipe()" is an ongoing observable, it must never die. If we catch error right after the code above, if the code above throws an error, this entire observable will die, which means trying to login agin will not work. Because this "this.actions$.pipe()" will never react to another "AuthActions.LOGIN_START" event. Therefore error has to be handled on the inner http.post observable level instead of the "switchmap authdata" level

            .pipe(
                map( resData => {
                    const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);  
                    return of(new AuthActions.Login({email:resData.email, userId:resData.localId, token: resData.idToken, expirationDate: expirationDate}));
                }),  
                catchError(error => {
                // we have to return a non-error observable so that our overall stream doesn't die. of() is from rxjs, which is a utility function for returning new obeservable
                return of();
            }), );
        }),
    );

    // Actions is one big obervable that will give you access to all dispatched actions, so you can react to them
    constructor(private actions$: Actions, private http: HttpClient){}
}