//---IMPORTS---
import { User, UserUpdate, SelectedUser } from './interfaces.js';
import { readSQL, prepSQL } from './handleSQL.js';
import { hash, verify } from 'argon2'
import { db } from './definition.js'

//---REGISTER_NEW_USER---
export async function register_new_user (
    username : string
,   nickname : string | null
,   bio      : string | null
,   password : string
)   :  Promise<number> 
{
    const password_hash = await hash(password)
    //workaround for the hash function being async

    return register_new_user_helper(
    username
,   nickname
,   bio
,   password_hash);
};

//---REGISTER_NEW_USER_PRIVATE_HELPER---
function register_new_user_helper(
       username : string
,      nickname : string | null
,           bio : string | null
, password_hash : string
)               : number
{

    //read and prepare user and registry statements
    const add_user_statement = prepSQL('add_user.sql')
    const add_registry_statement = prepSQL('add_registry.sql');

     
    //wrap both queries in a transaction
    const run = db.transaction(function(): number {    
    
        const user_info = add_user_statement.run({ username, nickname, bio });
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
    const update_preferences: UserUpdate = {
        user_id 
    ,   username: changes.username?.trim() || null
    ,   nickname: changes.nickname?.trim() || null
    ,   bio     : changes.bio?.trim()      || null
    };

    return edit_user_helper(update_preferences);
};

//---EDIT_USER_HELPER---

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
    const authenticate_statement = prepSQL('accounts.sql');
    const selected_user: SelectedUser = authenticate_statement.get({username}) as SelectedUser;
    
    if (!selected_user) {
        return false;
    }

    const password_matches = await verify(selected_user.password_hash, password_attempt);

    return password_matches;
};