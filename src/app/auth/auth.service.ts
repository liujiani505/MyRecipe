import { Injectable } from "@angular/core";
import{ HttpClient } from "@angular/common/http"

@Injectable({providedIn: 'root'})


export class AuthService {

    constructor(private http: HttpClient){}

    signup(email:string, password: string){
        return this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBz91hzQftaBmDTj-6Smvk51_-U9BZ8hdY', 
        { 
            email: email, 
            password: password, 
            returnSecureToken: true
        })
    }
}