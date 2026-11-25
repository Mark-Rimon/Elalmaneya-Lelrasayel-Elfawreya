/*
======================================================================================================================================================
SESSION_CONTROL
======================================================================================================================================================

When a User Logs in they create a new session associated with a token
this token is then taken and stored in their browser as a cookie so we can quickly validate a user is logged in
without having them input their password each time

======================================================================================================================================================

USAGE:
------
If the file is in the same local directory as your
add this import line at the beginning of your file

import { log_in, validate_session, log_out, log_all_out } from './session_control.js';

otherwise swap out the file location parameter

======================================================================================================================================================
DOCUMENTATION
======================================================================================================================================================

Exported Functions
------------------

log_in:

    SUMMARY:

        Once a user has created their account and added it to our database they may use this account
        by logging into it, this function generates a token that says... 
        "I'm this user you don't need to ask me for my password again"

    INPUT:

        username : string
        //the user is asked to enter their username to identify which account they want to log into
        password : string
        //the user must provide the correct password relevant to the account with the username above
        
    
    OUTPUT:

        token : string
        //The token that must be stored client side as a cookie
    
    EXAMPLE: 
        
        log_in(
            'mark-rimon'
        ,   'right_password'
        )

    //returns the token to be saved in mark rimon's computer so they're automatically logged in on their browser

    EXPECTED_ERROR:

        log_in(
            'mark-rimon'
            'wrong_password'
        )

    REASON: wrong password

    EXPECTED_ERROR2:

        log_in(
            'not-a-user'
        ,   'password'
        )

    REASON: user is not saved in our database (should be redirected to register their account)

validate_session:

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

log_out and log_all_out

    SUMMARY:

        the exact opposite of log_in log_out deletes the session associated with the token saved in the user's browser
        log_all_out deltes all sessions associated with the user's user_id
        this has the effect of logging the user out of all devices

    INPUT:

        username : string
        //do not prompt the user for their username
        token : string
        //the token pulled from their browser (which we ask the browser to also delete)

    OUTPUT:

        changes : number

        //the number of devices you log out of, 0 means nothing happened
        //log_out only returns 1 or 0
        //log_all_out may return more than 1 depending on the number of devices you log out of

    EXAMPLE:

        log_out(
            'mark-rimon'
            'right-token'
        )
        
        //returns 1 and forgets mark rimon's session
    
    EXAMPLE2:

        log_all_out(
            'i-have-5-devices'
            'right-token-for-the-session-i-request-this-from'
        )
        
        //returns 5 and forget's all this guy's sessions

    EXAMPLE3:

        log_out(
            'im-logged-out'
            'random-token'
        )

        //returns 0 nothing happened

    EXPECTED_ERROR:

        log_out(
            'i-broke-my-token'
            'invalid-token'
        )

        REASON: invalid token

/*
=========================================================================
---IMPORTS---
=========================================================================
*/
import { Statement
       , RunResult      } from "better-sqlite3";
import { authenticate_user
       , select_account } from './user_functionality.js';
import { prepSQL        } from './handleSQL.js';
import   crypto           from 'node:crypto';
/*
=========================================================================
---LOG_IN---
=========================================================================
*/
export async function log_in(
    username : string
,   password : string
)            : Promise<string>
{
    if(!(await authenticate_user(username, password))){
        throw new Error("incorrect password/username");
    }

    const user_id          : number    = select_account(username).user_id;
    const token            : string    = crypto.randomBytes(32).toString('hex');

    const create_statement : Statement = prepSQL('create_session.sql');
    create_statement.run({user_id, token});

    return token;

}
/*
=========================================================================
---VALIDATE_SESSION---
=========================================================================
*/
export function validate_session(
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
/*
=========================================================================
---LOG_OUT---
=========================================================================
*/
export function log_out(
    username : string
,   token    : string
)            : number
{

    if(!validate_session(username, token)){
        throw new Error("invalid token");
    };

    const user_id          : number    = select_account(username).user_id;

    const delete_statement : Statement = prepSQL('delete_current_session.sql');
    const delete_info      : RunResult = delete_statement.run({user_id, token});
    const delete_changes   : number    = delete_info.changes;

    return delete_changes;

}
/*
=========================================================================
---LOG_ALL_OUT---
=========================================================================
*/
export function log_all_out(
    username : string
,   token    : string
)            : number
{

    if(!validate_session(username, token)){
        throw new Error("invalid token");
    };

    const user_id          : number    = select_account(username).user_id;

    const delete_statement : Statement = prepSQL('delete_all_sessions.sql');
    const delete_info      : RunResult = delete_statement.run({user_id, token});
    const delete_changes   : number    = delete_info.changes;

    return delete_changes;

}