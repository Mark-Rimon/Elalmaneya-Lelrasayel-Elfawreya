/*
=========================================================================
---IMPORTS---
=========================================================================
*/
import { select_account } from './user_functionality.js'
import { NewChatroom    } from './interfaces.js';
import { prepSQL        } from './handleSQL.js';
import { db             } from './definition.js'


/*
=========================================================================
---CREATE_CHATROOM---
=========================================================================
*/

// YET TO IMPLEMENT SESSION CONTROL
export function create_chatroom(
    chatroom_info: Pick<NewChatroom, 'creator_username'> & Partial<Omit<NewChatroom, 'creator_username'>>
)                : number
{
    const creator_username_trimmed = chatroom_info.creator_username.trim().toLowerCase()
    
    const creator_id = select_account(creator_username_trimmed).user_id


    const create_chatroom_transaction = db.transaction(() => {
        
        const chatroom = prepSQL('create_chatroom.sql').run({
            name: chatroom_info.name ?? 'New Chatroom',
            bio: chatroom_info.bio ?? null
        });
    
        prepSQL('record_created_chatroom.sql').run({
            chatroom_id: chatroom.lastInsertRowid,
            creator_id: creator_id
        });

        prepSQL('add_chatroom_member.sql').run({
            chatroom_id: chatroom.lastInsertRowid,
            member_id: creator_id,
            admin_permission: 1
        });

        return Number(chatroom.lastInsertRowid);
    });

    return create_chatroom_transaction();
};

