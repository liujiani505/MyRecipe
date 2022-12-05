import { Action } from '@ngrx/store'

// first create identifiers for these actions
// these identifiers reach the entire application, so the names of the values we store in the consts below should be unique, especially for larger apps
export const LOGOUT = 'LOGOUT';
export const LOGIN_START = 'LOGIN_START';
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_FAIL = 'AUTHENTICATE_FAIL';
export const SIGNUP_START = 'SIGNUP_START';
export const CLEAR_ERROR = 'CLEAR_ERROR'


// actions are objects based on class
export class AuthenticateSuccess implements Action {
    readonly type = AUTHENTICATE_SUCCESS;
    constructor(
        public payload: {
            email: string;
            userId: string;
            token: string;
            expirationDate: Date;
        }
    ){}
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class LoginStart implements Action {
    readonly type = LOGIN_START;
    constructor(public payload: {
        email: string;
        password: string;
    }
    ){}
}

export class AuthenticateFail implements Action {
    readonly type = AUTHENTICATE_FAIL;
    constructor(public payload: string){} //we want to add error message, payload here is the error message
}

export class SignupStart implements Action {
    readonly type = SIGNUP_START;
    constructor(public payload:{
        email: string;
        password: string;
    } 
    ){}
}

export class ClearError implements Action {
    readonly type = CLEAR_ERROR;
}


export type AuthActions = AuthenticateSuccess | Logout | LoginStart | AuthenticateFail | SignupStart | ClearError;