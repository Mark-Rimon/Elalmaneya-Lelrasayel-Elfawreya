/*
=========================================================================
---IMPORTS---
=========================================================================
*/
import { select_account } from './user_functionality.js'
import { NewChatroom } from './interfaces.js';
import { prepSQL } from './handleSQL.js';

/*
=========================================================================
---CREATE_CHATROOM---
=========================================================================
*/
/*
export function create_chatroom(
    chatroom_info: Pick<NewChatroom, 'creator_username'> & Partial<Omit<NewChatroom, 'creator_username'>>
)                : Number
{
    const creator_username_trimmed = chatroom_info.creator_username.trim().toLowerCase
    
    select_account(creator_username_trimmed).user_id
    //in this very moment I have realised oh my god we forgot about session control

}
*/