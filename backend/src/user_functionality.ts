//---IMPORTS---

import { User, UserUpdate, SelectedUser, NewUser } from './interfaces.js';
import { prepSQL } from './handleSQL.js';
import { hash, verify } from 'argon2'
import { db } from './definition.js'
import { passwordStrength } from 'check-password-strength'

//---INVALID_USERNAME_TEST---



function validate_username(trimmed_username : string | null) : boolean{

    const INVALID_USERNAME = /[\p{White_Space}\p{Cf}\p{Cc}\p{Zl}\p{Zp}]/u;

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

//---SELECT_USER---

function select_account(username: string): SelectedUser{
    const select_statement = prepSQL('accounts.sql');
    const selected_account: SelectedUser = select_statement.get({username}) as SelectedUser;
    
    
    if (!selected_account) {
        throw new Error("account not found");
    }

    return selected_account;
}

//---REGISTER_NEW_USER---

export async function register_new_user (
    new_user: Pick<NewUser, 'username' | 'password'> & Partial<Omit<NewUser, 'username' | 'password'>>
)   :  Promise<number> 
{
    if(passwordStrength(new_user.password).id < 2){
        throw new Error("password too weak");
    }

    const trimmed_username = new_user.username.toLowerCase().trim();

    if(!validate_username(trimmed_username)){
        throw new Error("Invalid Username")
    }

    const password_hash = await hash(new_user.password)

    const new_user_preferences: NewUser  = {
        username: trimmed_username
    ,   password: password_hash
    ,   nickname: new_user.nickname?.trim() || null
    ,   bio     : new_user.bio?.trim()      || null
    }

    return register_new_user_helper(new_user_preferences);
};

//---REGISTER_NEW_USER_PRIVATE_HELPER---

function register_new_user_helper(new_user: NewUser) : number
{
    const { password: password_hash, ...new_user_details} = new_user;


    //read and prepare user and registry statements
    const add_user_statement = prepSQL('add_user.sql')
    const add_registry_statement = prepSQL('add_registry.sql');

     
    //wrap both queries in a transaction
    const run = db.transaction(function(): number {    
    
        const user_info = add_user_statement.run(new_user_details);
        const user_id   = Number(user_info.lastInsertRowid);
    
        add_registry_statement.run({user_id, password_hash});
    
        return user_id;

    });

    return run();
};

//---EDIT_USER---

export function edit_user(
     user_id: number
,    changes: Partial<Omit<User, 'user_id'>>
)           : number
{
    const new_username_trimmed = changes.username?.toLowerCase().trim() || null;

    if(!validate_username(new_username_trimmed)){
        throw new Error("New username is invalid");
    }

    const update_preferences: UserUpdate = {
        user_id 
    ,   username: new_username_trimmed
    ,   nickname: changes.nickname?.trim() || null
    ,   bio     : changes.bio?.trim()      || null
    };

    return edit_user_helper(update_preferences);
};

//---EDIT_USER_PRIVATE_HELPER---

function edit_user_helper(update : UserUpdate) : number           
{

    const edit_user_statement = prepSQL('edit_user.sql');
    const edit_info           =  edit_user_statement.run(update);
    const edit_changes        = edit_info.changes; 

    return edit_changes; //return 1 if a change happens return 0 otherwise

};

//---AUTHENTICATE_USER---
 
export async function authenticate_user(
    username         : string
,   password_attempt : string
)                    : Promise<boolean>
{
    const selected_account = select_account(username);

    const password_matches = await verify(selected_account.password_hash, password_attempt);

    return password_matches;
};

//---CHANGE_PASSWORD---

export async function change_password(
    username            : string
,   old_password        : string
,   new_password        : string
)                       : Promise<number>    
{
    const is_authorised = await authenticate_user(username, old_password);
    
    if(!is_authorised){
        throw new Error("You got the old password wrong");
    }

    if(old_password === new_password){
        return 0;
    }    

    if(passwordStrength(new_password).id < 2){
        throw new Error("new password is too weak");
    }

    const user_id = select_account(username).user_id;
    
    
    const new_password_hash = await hash(new_password);
    
    const change_statement = prepSQL('change_password.sql');
    const change_info = change_statement.run({new_password_hash, user_id});
    const return_code = change_info.changes;
    
    return return_code;
}

//---DELETE_USER---

export async function delete_user(
    username    : string
,   password    : string
)               : Promise<number>
{
    //double checking if you REALLY want to delete your account is not my job

    const is_authorised = await authenticate_user(username, password);

    if(!is_authorised){
        throw new Error("Incorrect password/username");
    };

    const user_id = select_account(username).user_id;

    const delete_statement = prepSQL('delete_user.sql');
    const delete_info = delete_statement.run({user_id});
    const delete_changes = delete_info.changes;

    return delete_changes;
}

