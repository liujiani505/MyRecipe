import { Injectable } from "@angular/core";
import{ HttpClient, HttpErrorResponse } from "@angular/common/http"
import { catchError, tap } from "rxjs/operators";
import { throwError, Subject, BehaviorSubject } from "rxjs" ;
import { User } from "./user.model";
import { Router } from '@angular/router';
import { environment } from "src/environments/environment";
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

export interface AuthResponseData{
    kind:string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}


@Injectable({providedIn: 'root'})

export class AuthService {

    //store authenticated user as subject. A Subject is like an Observable, but can multicast to many Observers. Subjects are like EventEmitters: they maintain a registry of many listeners. 
    // this will inform all place in the application about when our user changes. It will always change when the authentication state changes, even if the token expires the user subject a new value which is null, it tells that the user is invalid
    // userSubject = new Subject<User>(); 

    // userSubject = new BehaviorSubject<User>(null);
    // The difference of BehaviorSubject is that it gives subscribers immediate access to the perviously emitted value even if they haven't subscribed at the point of time that value was emitted. That means we can get access to the currently activated user even if we only subscribe after that user has been emitted. So when we need token to fetch data, even the user logged in before that point of time, we still get the access to the latest user.

    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>){}

    signup(email:string, password: string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAIPKey, 
        { 
            email: email, 
            password: password, 
            returnSecureToken: true
        })
        // the tap operator allows us to perform some action without changing the response, it steps into the observable chain but doesn't stop it or block it, change it. It just run some code with the data you get back from the observable
        .pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(resData.email, resData.idToken, resData.localId, +resData.expiresIn); // + to convert expiresIn to a number
        })
        );
    }

    login(email: string, password: string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAIPKey,
        { 
            email: email, 
            password: password, 
            returnSecureToken: true
        })
        .pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(resData.email, resData.idToken, resData.localId, +resData.expiresIn); // + to convert expiresIn to a number
        }))
    }

    autoLogin(){
        // take the string form and convert it back to Javascript object
       const userData: {
           email:string;
           id: string;
           _token: string;
           _tokenExpirationDate: string;
       } = JSON.parse(localStorage.getItem('userData'));
       if(!userData){
           return;
       } 
       const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
       if(loadedUser.token){
            //this.userSubject.next(loadedUser)
            this.store.dispatch(
                new AuthActions.Login({
                    email: loadedUser.email, 
                    userId: loadedUser.id, 
                    token: loadedUser.token, 
                    expirationDate: new Date(userData._tokenExpirationDate)
                })
            );
           const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime() 
           this.autoLogout(expirationDuration)
       }

    }

    logout(){
        // this.userSubject.next(null);
        this.store.dispatch(new AuthActions.Logout())
        this.router.navigate(['/auth'])
        localStorage.removeItem('userData')
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number){
        this.tokenExpirationTimer = setTimeout(()=>{
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(email: string, token:string, userId: string, expiresIn: number){

            const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);  
            // this constructs the user with the response data we get from the backend with expiration date
            const user = new User(
                email, 
                userId,
                token,
                expirationDate
            );
            // use the user subject to next the user, to emit the constructed user as our curently logged in user
            // this.userSubject.next(user);
            // any actions you dispath always reaches all reducers, not just the auth reducer in this case
            this.store.dispatch(new AuthActions.Login({email: email, userId: userId, token: token, expirationDate: expirationDate}))
            this.autoLogout(expiresIn * 1000)
            // to store the user object as string in local storage for auto login when refresh the page
            localStorage.setItem('userData', JSON.stringify(user));
    
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred';
        if (!errorRes.error || !errorRes.error.error){
            return throwError(errorMessage);
        }
        switch(errorRes.error.error.message){
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already'; 
                break; 
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'There is no user record corresponding to this identifier.';
                break;
        }
        return throwError(errorMessage)
    }

}