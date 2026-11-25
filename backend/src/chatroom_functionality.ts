/*
=========================================================================
---IMPORTS---
=========================================================================
*/
import { select_account } from './user_functionality.js'
import { NewChatroom    } from './interfaces.js';
import { prepSQL        } from './handleSQL.js';
import { db             } from './definition.js'
import { validate_session } from './session_control.js';

/*
==========================================================================
---HELPER FUNCTIONS---
==========================================================================
*/

function get_authenticated_user_id(username: string, token: string): number {
    const normalized_username = username.trim().toLowerCase();
    if (!normalized_username || !token) {
        throw new Error('Username and session token are required');
    }

    const user_id = select_account(normalized_username).user_id;
    if (!validate_session(normalized_username, token)) {
        throw new Error('Invalid session');
    }

    return user_id;
}

function check_valid_chatroom_id(chatroom_id: number): void {
    if (!Number.isSafeInteger(chatroom_id) || chatroom_id <= 0) {
        throw new Error('Invalid chatroom ID');
    }
}

function check_chatroom_exists(chatroom_id: number): void {
    const chatroom = prepSQL('check_chatroom.sql').get({ chatroom_id });
    if (!chatroom) {
        throw new Error('Chatroom does not exist');
    }
}

function is_chatroom_creator(chatroom_id: number, user_id: number): boolean {
    return Boolean(prepSQL('check_chatroom_creator.sql').get({ chatroom_id, user_id }));
}

function get_member_permission(chatroom_id: number, member_id: number): number | undefined {
    const member = prepSQL('get_chatroom_member_permission.sql').get({
        chatroom_id,
        member_id
    }) as { admin_permission: number } | undefined;

    return member?.admin_permission;
}

/*
=========================================================================
---CREATE_CHATROOM---
=========================================================================
*/


export function create_chatroom(
    chatroom_info: Pick<NewChatroom, 'creator_username'> & Partial<Omit<NewChatroom, 'creator_username'>>,
    token: string
)   : number 
{
    const creator_id = get_authenticated_user_id(chatroom_info.creator_username, token);
    const name = chatroom_info.name === undefined ? 'New Chatroom' : chatroom_info.name.trim();

    if (!name) {
        throw new Error('Chatroom name cannot be empty');
    }

    const bio = chatroom_info.bio?.trim() || null;

    const create_chatroom_transaction = db.transaction(() => {
        const chatroom = prepSQL('create_chatroom.sql').run({ name, bio });
        const chatroom_id = Number(chatroom.lastInsertRowid);

        prepSQL('record_created_chatroom.sql').run({ chatroom_id, creator_id });
        prepSQL('add_chatroom_member.sql').run({
            chatroom_id,
            member_id: creator_id,
            admin_permission: 1
        });

        return chatroom_id;
    });

    return create_chatroom_transaction();
};


/*
=========================================================================
---ADD_CHATROOM_MEMBER---
=========================================================================
*/

export function add_chatroom_member(
    requester_username: string,
    token: string,
    chatroom_id: number,
    member_username: string
)   : void 
{
    const requester_id = get_authenticated_user_id(requester_username, token);
    const member_id = select_account(member_username.trim().toLowerCase()).user_id;
    check_valid_chatroom_id(chatroom_id);

    const add_member_transaction = db.transaction(() => {
        check_chatroom_exists(chatroom_id);

        if (get_member_permission(chatroom_id, requester_id) === undefined) {
            throw new Error('Only chatroom members can add members');
        }

        if (get_member_permission(chatroom_id, member_id) !== undefined) {
            throw new Error('User is already a chatroom member');
        }

        prepSQL('add_chatroom_member.sql').run({
            chatroom_id,
            member_id,
            admin_permission: 0
        });
    });

    add_member_transaction();
}

/*
=========================================================================
---SET_CHATROOM_ADMIN---
=========================================================================
*/

export function set_chatroom_admin(
    requester_username: string,
    token: string,
    chatroom_id: number,
    member_username: string,
    admin_permission: number
)   : void
{
    const requester_id = get_authenticated_user_id(requester_username, token);
    const member_id = select_account(member_username.trim().toLowerCase()).user_id;
    check_valid_chatroom_id(chatroom_id);

    if (admin_permission !== 0 && admin_permission !== 1) {
        throw new Error('Admin permission must be 0 or 1');
    }

    const set_admin_transaction = db.transaction(() => {
        check_chatroom_exists(chatroom_id);

        if (!is_chatroom_creator(chatroom_id, requester_id)) {
            throw new Error('Only the chatroom creator can change admin permissions');
        }

        if (get_member_permission(chatroom_id, member_id) === undefined) {
            throw new Error('User must be a chatroom member before changing permissions');
        }

        prepSQL('set_chatroom_admin.sql').run({
            chatroom_id,
            member_id,
            admin_permission
        });
    });

    set_admin_transaction();
}

