/*
======================================================================================================================================================
USER_FUNCTIONALITY
======================================================================================================================================================

This file contains all the functions needed to streamline and user interaction
with the database down to simple functions

======================================================================================================================================================

USAGE:
------
If the file is in the same local directory as your
add this import line at the beginning of your file

import { register_new_user, edit_user, authenticate_user, change_password, delete_user } from './user_functionality.js';

otherwise swap out the file location parameter

======================================================================================================================================================
DOCUMENTATION
======================================================================================================================================================

Exported Functions:
-------------------

register_new_user:
    
    SUMMARY:

        takes mandatory username and password fields
        and optional nickname and bio fields
        uses the given input to establish a new user in the database
        register_new_user is an asynchronous function!

    INPUT:
    {
        username: string
        //each user has chooses their own unique username which they
        //use for most user-related operations
        //a username cannot contain any spaces
        //a username cannot be of length < 3
        //the username is automatically turned to lower-case 
    
    ,   password: string
        //each user is verified using their chosen password
        //the password cannot be considered too weak
        //i.e too short or all in lower case or no symbols etc...
        //the password hashed before being stored on the database
    
    ,   nickname: string
        //the user can choose a nickname displayed on their profile
        //the nickname field is optional 
        //and can be ommitted from the function call
    
    ,   bio: string
        //the user can add a short autobiography under their profile
        //the bio field is optional
        //and can be ommitted from the function call
    }

    OUTPUT: 
        token : string
        //The new user's assigned token for their session

    EXAMPLE: 
    
        register_new_user({
            username: 'mark-rimon'
            password: 'Mark_12345'
            nickname: 'mark'
        })
    
    This registers a new user in the database with a null bio
    
    EXAMPLE2:

        register_new_user({
            username: 'mohamed-ayoub'
            password: 'Mohamed_12345'
        })

    This registers a new user in the database with a null nickname and bio
    
    EXPECTED ERROR:
        
        register_new_user({
            username: 'basel hatem'
            password: 'Basel_12345'
            bio: 'hello world!'
        })
        
    REASON: Invalid username

    EXPECTED ERROR2:

        register_new_user({
            username: 'mark-rimon'
            password: 'Mark_12345'
            bio: 'I am the real mark'
        })

    REASON: Duplicate username (assuming mark-rimon already exists in the database)

    EXPECTED ERROR3:

        register_new_user({
            username: 'omar-shehata'
            password: 'qwerty'
        })

    REASON: Password is deemed to be too weak

    EXPECTED ERROR4:
    
        register_new_user({
            password: 'Mina_12345'
            nickname: 'Mina'
            bio: 'who needs usernames anyway?'
        })

    REASON: One of the two mandatory fields is not provided (username)

edit_user:

    SUMMARY:

        takes a mandatory username field
        and a mandatory password field
        and optional username, nickname and bio fields
    
    INPUT:
    (
        username     : string
    ,   password     : string
    ,   {
        new_username : string
        //the user can change their username if they wish
        //this field is optional
        //and can be omitted

        nickname     : string
        //a user can change their nickname if they wish
        //nickname is an optional field
        //and can be omitted
        
        bio          : string
        //a use can change their autobiography if they wish
        //bio is an optional field
        //and can be omitted
        }
    )

    OUTPUT:
        edit_changes : number
        //whether changes happened or not, 1 if a change happened 0 otherwise
    
    EXAMPLE:
        edit_user(
            'mark-rimon'
        ,   'correct_password'
        ,   {
            username: 'mark-rimon-moheb'
            nickname: 'mark ghobrial'
        }
    )

    This changes the user's username from 'mark-rimon' to 'mark-rimon-moheb'
    as well as changing their nickname
    no change happens to their bio whether it existed or not

    EXPECTED_ERROR:
        edit_user(
            'basel-elesseily'
            'wrong_password'
            {
                username: 'im-stupid'
            }
        )
    
    REASON: Incorrect Username/Password

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

change_password:

    SUMMARY:

        takes a username, the user's current password
        and the new password they want
        verifies the old password then replaces the stored hash
        change_password is an asynchronous function!

    INPUT:
    (
        username     : string
        //the username of the account whose password is changing

    ,   old_password : string
        //the user's current password, used to prove it's really them

    ,   new_password : string
        //the password to switch to
        //it cannot be considered too weak
        //i.e too short or all in lower case or no symbols etc...
        //it is hashed before being stored on the database
    )

    OUTPUT:
        change_changes : number
        //1 if the password was changed
        //0 if no change happened (new password is identical to the old one)

    EXAMPLE:

        change_password('mark-rimon', 'Mark_12345', 'Mark_67890!')

    This changes mark-rimon's password and returns 1

    EXAMPLE2:

        change_password('mark-rimon', 'Mark_12345', 'Mark_12345')

    Nothing is changed and 0 is returned

    EXPECTED ERROR:

        change_password('mark-rimon', 'wrong_password', 'Mark_67890!')

    REASON: Old password is incorrect

    EXPECTED ERROR2:

        change_password('mark-rimon', 'Mark_12345', 'qwerty')

    REASON: New password is deemed to be too weak

    EXPECTED ERROR3:

        change_password('nobody-here', 'Whatever_123', 'Mark_67890!')

    REASON: Account not found

delete_user:

    SUMMARY:

        takes a username and password
        verifies them then deletes the user's account from the database
        delete_user is an asynchronous function!
        NOTE: this is permanent and there is NO confirmation step
        asking the user "are you sure?" is the caller's job

    INPUT:
    (
        username : string
        //the username of the account to delete

    ,   password : string
        //the account's current password, used to authorise the deletion
    )

    OUTPUT:
        delete_changes : number
        //1 if the account was deleted, 0 if nothing was deleted

    EXAMPLE:

        delete_user('mark-rimon', 'Mark_12345')

    This deletes the account mark-rimon and returns 1

    EXPECTED ERROR:

        delete_user('mark-rimon', 'wrong_password')

    REASON: Incorrect Username/Password

    EXPECTED ERROR2:

        delete_user('nobody-here', 'Whatever_123')

    REASON: Account not found

======================================================================================================================================================
*/ 
/*
=========================================================================
---IMPORTS---
=========================================================================
*/
import { User
       , UserUpdate
       , SelectedUser
       , NewUser          } from './interfaces.js';
import { prepSQL          } from './handleSQL.js';
import { hash
       , verify           } from 'argon2'
import { db               } from './definition.js'
import { passwordStrength } from 'check-password-strength'
import { Statement
       , RunResult        } from 'better-sqlite3';
import   crypto           from 'node:crypto';
/*
=========================================================================
---INVALID_USERNAME_TEST---
=========================================================================
*/
function validate_username(
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
---SELECT_USER---
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
---REGISTER_NEW_USER---
=========================================================================
*/
export async function register_new_user (
    new_user: Pick<NewUser, 'username' | 'password'> & Partial<Omit<NewUser, 'username' | 'password'>>
)           :  Promise<string> 
{
    if(passwordStrength(new_user.password).id < 2){
        throw new Error("password too weak");
    }

    const trimmed_username = new_user.username.toLowerCase().trim();

    if(!validate_username(trimmed_username)){
        throw new Error("Invalid Username")
    }

    const password_hash: string = await hash(new_user.password)

    const new_user_preferences: NewUser  = {
        username: trimmed_username
    ,   password: password_hash
    ,   nickname: new_user.nickname?.trim() || null
    ,   bio     : new_user.bio?.trim()      || null
    }

    return register_new_user_helper(new_user_preferences);
};
/*
=========================================================================
---REGISTER_NEW_USER_PRIVATE_HELPER---
=========================================================================
*/
function register_new_user_helper(new_user: NewUser) : string
{
    const { password: password_hash, ...new_user_details} = new_user;


    //read and prepare user and registry statements
    const add_user_statement    : Statement = prepSQL('add_user.sql')
    const add_registry_statement: Statement = prepSQL('add_registry.sql');

     
    //wrap both queries in a transaction
    const run = db.transaction(function(): number {    
    
        const user_info : RunResult = add_user_statement.run(new_user_details);
        const user_id   : number    = Number(user_info.lastInsertRowid);
    
        add_registry_statement.run({user_id, password_hash});
    
        return user_id;

    });

    const user_id          : number    = run();
    
    const token            : string    = crypto.randomBytes(32).toString('hex');
    
    const create_statement : Statement = prepSQL('create_session.sql');
    create_statement.run({user_id, token});

    return token;
};
/*
=========================================================================
---EDIT_USER---
=========================================================================
*/
export async function edit_user(
    username : string
,   password : string
,   changes  : Partial<Omit<User, 'user_id'>>
)            : Promise<number>
{
    const new_username_trimmed : string|null = changes.username?.toLowerCase().trim() || null;
    const old_username_trimmed : string|null = username.toLowerCase().trim()
    const user_id              : number      = select_account(old_username_trimmed).user_id;

    if(!(await authenticate_user(old_username_trimmed, password))){
        throw new Error("incorrect password/username");
    };

    if(!validate_username(new_username_trimmed)){
        throw new Error("New username is invalid");
    };

    const update_preferences: UserUpdate = {
        user_id 
    ,   username: new_username_trimmed
    ,   nickname: changes.nickname?.trim() || null
    ,   bio     : changes.bio?.trim()      || null
    };

    return edit_user_helper(update_preferences);
};
/*
=========================================================================
---EDIT_USER_PRIVATE_HELPER---
=========================================================================
*/
function edit_user_helper(update : UserUpdate) : number           
{

    const edit_user_statement : Statement = prepSQL('edit_user.sql');
    const edit_info           : RunResult = edit_user_statement.run(update);
    const edit_changes        : number    = edit_info.changes; 

    return edit_changes; //return 1 if a change happens return 0 otherwise

};
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
---CHANGE_PASSWORD---
=========================================================================
*/
export async function change_password(
    username            : string
,   old_password        : string
,   new_password        : string
)                       : Promise<number>    
{
    username = username.trim().toLowerCase();
    const is_authorised :  boolean = await authenticate_user(username, old_password);
    
    if(!is_authorised){
        throw new Error("You got the old password wrong");
    }

    if(old_password === new_password){
        return 0;
    }    

    if(passwordStrength(new_password).id < 2){
        throw new Error("new password is too weak");
    }

    const user_id           : number    = select_account(username).user_id;
    
    const new_password_hash : string    = await hash(new_password);
    
    const change_statement  : Statement = prepSQL('change_password.sql');
    const change_info       : RunResult = change_statement.run({new_password_hash, user_id});
    const return_code       : number    = change_info.changes;
    
    return return_code;
}
/*
=========================================================================
---DELETE_USER---
=========================================================================
*/
export async function delete_user(
    username    : string
,   password    : string
)               : Promise<number>
{
    //double checking if you REALLY want to delete your account is not my job
    
    username = username.trim().toLowerCase();
    const is_authorised = await authenticate_user(username, password);

    if(!is_authorised){
        throw new Error("Incorrect password/username");
    };

    const user_id          : number    = select_account(username).user_id;

    const delete_statement : Statement = prepSQL('delete_user.sql');
    const delete_info      : RunResult = delete_statement.run({user_id});
    const delete_changes   : number    = delete_info.changes;

    return delete_changes;
}

