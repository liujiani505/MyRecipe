import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';



export interface AuthResponseData{
    kind:string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuthentication = (expiresIn: number, email:string, userId:string, token:string) => {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);  
    return new AuthActions.AuthenticateSuccess({email: email, userId: userId, token: token, expirationDate: expirationDate});
}

const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error || !errorRes.error.error){
        return of(new AuthActions.AuthenticateFail(errorMessage))
    }
    switch(errorRes.error.error.message){
        case 'EMAIL_EXISTS':
            errorMessage = 'This email exists already'; 
            break; 
        case 'EMAIL_NOT_FOUND':
            errorMessage = 'There is no user record corresponding to this identifier.';
            break;
    }
    return of(new AuthActions.AuthenticateFail(errorMessage));
}


@Injectable() //for wiring our auth effects up. things can be injected into AuthEffects class

export class AuthEffects {

    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAIPKey, 
        { 
            email: signupAction.payload.email, 
            password: signupAction.payload.password, 
            returnSecureToken: true
        })
        .pipe( 
            map(resData => {
                return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
            }),
            catchError(errorRes => {
                return handleError(errorRes);
            }), 
        );
        })
    );

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

            // .pipe(
            //     map( resData => {
            //         const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);  
            //         // effect needs to dispatch a new action once it's done, so we should return a new action down below. But we don't need to call dispatch because, it's done by @Effect(), the entire chain of results above (this.actions$.pipe()) will be automatically treated as an action by ngrx effects. Therefore will be dispatched. So here below, we just need to retun an action object, and ngrx effects will automatically dispatch for you.

            //         // map automatically returns what's returned into an observable
            //         return new AuthActions.AuthenticateSuccess({email:resData.email, userId:resData.localId, token: resData.idToken, expirationDate: expirationDate});
            //     }),  
            //     catchError(errorRes => {
            //         let errorMessage = 'An unknown error occurred';
            //         if (!errorRes.error || !errorRes.error.error){
            //             return of(new AuthActions.AuthenticateFail(errorMessage))
            //         }
            //         switch(errorRes.error.error.message){
            //             case 'EMAIL_EXISTS':
            //                 errorMessage = 'This email exists already'; 
            //                 break; 
            //             case 'EMAIL_NOT_FOUND':
            //                 errorMessage = 'There is no user record corresponding to this identifier.';
            //                 break;
            //         }
            //     // we have to return a non-error observable so that our overall stream doesn't die. of() is from rxjs, which is a utility function for returning new obeservable
            //     return of(new AuthActions.AuthenticateFail(errorMessage));
            //     }), 
            // );
            
            .pipe( 
                map(resData => {
                    return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                }), 
            );

        }),
    );

    // this is for redirecting, which could be seen as a side effect
    @Effect({dispatch: false}) // this is to let ngrx know that this effect will not dispatch a dispatchable action in the end
    authSuccess= this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS), //The LOGIN action only fires on a successful login
        tap(() => {
            this.router.navigate(['/'])
        })
    )


    // Actions is one big obervable that will give you access to all dispatched actions, so you can react to them
    constructor(private actions$: Actions, private http: HttpClient, private router: Router){}
}