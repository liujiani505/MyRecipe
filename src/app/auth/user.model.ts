export class User {

    // adding a constructor so we can create a user with the new keyword
    constructor(
        public email: string, 
        public id: string, 
        private _token: string,       
        private _tokenExpirationDate: Date
        // underscore because a token shouldn't be retrievable directly, if developer/user want to get access to the token, you should be required to do it in a way that it'll automatically check the validity, this can be achieved by using a getter with the get keyword
    ) {}    

    
    // a getter looks like a function, but you can actually access it like a property, you should be able to do something like user.token. A getter also means a user can't overwrite it, user.token = fasdadas will throw an error, because it's a getter not a setter.
    get token(){
        // to check if a token has expired
        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {   
            return null;
        }  
        return this._token;
    }
}