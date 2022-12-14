import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface State {
    user: User;
    authError: string;
    loading: boolean;
}
 
const initialState: State = {
    user: null,
    authError: null,
    loading: false,
}

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
    switch (action.type) {
        case AuthActions.AUTHENTICATE_SUCCESS:
            const user = new User(action.payload.email, action.payload.userId, action.payload.token, action.payload.expirationDate);
            return {
                // it's important to always copy the old state
                ...state,
                authError: null,
                user: user,
                loading: false,
            }
        case AuthActions.LOGOUT:
            return {
                ...state,
                user: null
            }

        case AuthActions.LOGIN_START:
        case AuthActions.SIGNUP_START:
            return {
               ...state,
               authError: null,
               loading: true,
            }
        case AuthActions.AUTHENTICATE_FAIL:
            return{
                ...state,
                user: null,
                authError: action.payload,
                loading: false,
            }
        case AuthActions.CLEAR_ERROR:
            return{
                ...state,
                authError: null
            }
        // default is important for initializing the state. When ngrx starts up, it sends one initial action to all reducers, since this action has an identifier we don't handle anywhere here, so we make it into the default case, therefore, we return the state, and since we have no prior state when this first action is emitted, we therefore take the initial state.
        default:
            return state;
    }
}