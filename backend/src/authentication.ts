/*
======================================================================================================================================================
USER_FUNCTIONALITY
======================================================================================================================================================

This file contains all the intermediate functions to be ran for authentication

======================================================================================================================================================

USAGE:
------
If the file is in the same local directory as your
add this import line at the beginning of your file

import { select_account, validate_username, create_session, authenticate_user, authenticate_session } from './authentication.js';

otherwise swap out the file location parameter

======================================================================================================================================================
DOCUMENTATION
======================================================================================================================================================

Exported Functions:
-------------------


authenticate_user:

    SUMMARY:

        takes a username and a password attempt
        and checks the attempt against the stored password hash
        returns true if they match and false otherwise
        authenticate_user is an asynchronous function!

    INPUT:
    (
        username         : string
        //the username of the account to check
        //it is NOT trimmed or turned to lower-case for you
        //so pass it in already lower-case

    ,   password_attempt : string
        //the plain-text password to test
        //it is verified against the hash stored on the database
    )

    OUTPUT:
        password_matches : boolean
        //true if the password is correct, false if it is wrong

    EXAMPLE:

        authenticate_user('mark-rimon', 'Mark_12345')

    This resolves to true if Mark_12345 is mark-rimon's password
    and to false if it is not

    EXPECTED ERROR:

        authenticate_user('nobody-here', 'Whatever_123')

    REASON: Account not found (a wrong password does NOT throw,
    it just returns false, but a username that doesn't exist does)

select_account:

    SUMMARY:

        returns a SelectedUser of the user with a given username

    INPUT:

        username : string

    OUTPUT:

        selecteduser : SelectedUser

        SelectedUser contains {
            user_id: number;
            password_hash: string;
        };}

validate_username:

    SUMMARY:

        returns true if a username is valid
        a username is valid if it does not contain spaces

    INPUT:

        username : string

    OUTPUT:

        is_valid : boolean

create_session:

    SUMMARY:
    
        records the user's session in our database and returns the session's token

    INPUT:

        user_id : number
        //the user's id
    
    OUTPUT: 
            
        token : string
        //the session's token
    
authenticate_session:

    SUMMARY:
        
        similar to validate_user validate session is an intermediate function
        that you call for security reason, only instead of validating the user using their password
        it validates the user using their session's token, this means it quietly takes the cookie from their browser
        and uses it to double check they're logged in (without needing to prompt the user)

    INPUT:

        username : string
        //do not prompt the user for their username pull it from the db instead
        token : string
        //the session token to validate the user
        //do not prompt the user for their token (they don't even memorise it)
        //instead pull it from their browser cookie

    OUTPUT:

        confirmation : boolean
        //whether the token matches a session token in our database or not

    EXAMPLE:

        validate_session(
           'mark-rimon'
        ,  'right_token' 
        )

        //returns true

    EXAMPLE2:

        validate_session(
            'mark-rimon'
        ,   'wrong_token'
        )

        //returns false

    EXPECTED_ERROR:

        validate_session(
            'im-logged-out'
        ,   'token'
        )

    REASON: no session found

authenticate_session:

    SUMMARY:
        
        similar to validate_user validate session is an intermediate function
        that you call for security reason, only instead of validating the user using their password
        it validates the user using their session's token, this means it quietly takes the cookie from their browser
        and uses it to double check they're logged in (without needing to prompt the user)

    INPUT:

        username : string
        //do not prompt the user for their username pull it from the db instead
        token : string
        //the session token to validate the user
        //do not prompt the user for their token (they don't even memorise it)
        //instead pull it from their browser cookie

    OUTPUT:

        confirmation : boolean
        //whether the token matches a session token in our database or not

    EXAMPLE:

        validate_session(
           'mark-rimon'
        ,  'right_token' 
        )

        //returns true

    EXAMPLE2:

        validate_session(
            'mark-rimon'
        ,   'wrong_token'
        )

        //returns false

    EXPECTED_ERROR:

        validate_session(
            'im-logged-out'
        ,   'token'
        )

    REASON: no session found

======================================================================================================================================================
*/
/*
=========================================================================
---IMPORTS---
=========================================================================
*/
import { SelectedUser } from "./interfaces.js";
import { Statement
       , RunResult    } from "better-sqlite3";
import { prepSQL      } from "./handleSQL.js";
import   crypto         from 'node:crypto';
import { verify       } from 'argon2';
/*
=========================================================================
---AUTHENTICATE_USER---
=========================================================================
*/
export async function authenticate_user(
    username         : string
,   password_attempt : string
)                    : Promise<boolean>
{
    const selected_account : SelectedUser = select_account(username);

    const password_matches : boolean      = await verify(selected_account.password_hash, password_attempt);

    return password_matches;
};
/*
=========================================================================
---SELECT_ACCOUNT---
=========================================================================
*/
export function select_account(
        username: string
    )           : SelectedUser
    {
    const select_statement : Statement = prepSQL('accounts.sql');
    const selected_account: SelectedUser = select_statement.get({username}) as SelectedUser;
    
    
    if (!selected_account) {
        throw new Error("account not found");
    }

    return selected_account;
}
/*
=========================================================================
---VALIDATE_USERNAME---
=========================================================================
*/
export function validate_username(
        trimmed_username : string | null
    )                    : boolean
    {

    const INVALID_USERNAME = /[\p{White_Space}\p{Cf}\p{Cc}\p{Zl}\p{Zp}]/u;
    //String containing all types of invalid characters (mostly empty spaces)

    if (trimmed_username === null){
        return true; //means username is unchanged
    };

    trimmed_username = String(trimmed_username);

    if(trimmed_username.length < 3){
        return false;
    };

    if(INVALID_USERNAME.test(trimmed_username)){
        return false;    
    };
    
    return true;

};
/*
=========================================================================
---CREATE_SESSION---
=========================================================================
*/
export function create_session(
    user_id : number
)
{
    const token            : string    = crypto.randomBytes(32).toString('hex');

    const create_statement : Statement = prepSQL('create_session.sql');
    create_statement.run({user_id, token});

    return token;
}
/*
=========================================================================
---AUTHENTICATE_SESSION---
=========================================================================
*/
export function authenticate_session(
    username : string
,   token    : string
)            : boolean
{
    const user_id         : number    = select_account(username).user_id
    
    const check_statement : Statement = prepSQL('check_session.sql');
    const check_result    : RunResult = check_statement.run({token, user_id});
    
    if(!check_result){
        return false;
    }
    return true;
}