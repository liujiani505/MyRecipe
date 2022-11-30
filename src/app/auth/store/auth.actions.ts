import { Action } from '@ngrx/store'

// first create identifiers for these actions
// these identifiers reach the entire application, so the names of the values we store in the consts below should be unique, especially for larger apps
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const LOGIN_START = 'LOGIN_START';

// actions are objects based on class
export class Login implements Action {
    readonly type = LOGIN;
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

export type AuthActions = Login | Logout;