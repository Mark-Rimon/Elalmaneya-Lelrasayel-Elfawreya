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