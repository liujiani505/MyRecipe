import { Injectable } from "@angular/core";
import{ HttpClient, HttpErrorResponse } from "@angular/common/http"
import { catchError, tap } from "rxjs/operators";
import { throwError, Subject } from "rxjs" ;
import { User } from "./user.model";


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
    userSubject = new Subject<User>();

    constructor(private http: HttpClient){}

    signup(email:string, password: string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBz91hzQftaBmDTj-6Smvk51_-U9BZ8hdY', 
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
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBz91hzQftaBmDTj-6Smvk51_-U9BZ8hdY',
        { 
            email: email, 
            password: password, 
            returnSecureToken: true
        })
        .pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(resData.email, resData.idToken, resData.localId, +resData.expiresIn); // + to convert expiresIn to a number
        }))
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
            this.userSubject.next(user);
    
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