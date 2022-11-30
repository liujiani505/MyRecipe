import { Actions, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';

// Actions is one big obervable that will give you access to all dispatched actions, so you can react to them

export class AuthEffects {

    authLogin = this.actions$.pipe(
        // ofType operator allows you to define a filter for which types of effects you want to continue in this observable pipe
        ofType(AuthActions.LOGIN_START)
    );

    constructor(private actions$: Actions){}
}