import { db } from './definition.js';
import { prepSQL } from './handleSQL.js';


export function send_message(sender_id: number, chatroom_ID: number, content: string): void {
    // Checks whether the parameters are valid and throws an error if they aren't
    if (!sender_id || !chatroom_ID || !content) {
        throw new Error('Invalid parameters'); // will have to catch error elsewhere (in frontend perhaps)
    }

    //Define the message in message table then add it to exchange table
    const createMessage = db.transaction(() => {
        const membership = prepSQL('check_chatroom_membership.sql').get({
            chatroom_id: chatroom_ID,
            member_id: sender_id
        });

        //If membership is null, the sender is not a member of the chatroom and we throw an error
        if (!membership) {
            throw new Error('Sender is not a member of the chatroom'); // will have to catch error elsewhere (in frontend perhaps)
        }

        const message = prepSQL('create_message.sql').run({
            message_sender_id: sender_id,
            message_content: content
        });

        prepSQL('exchange_message.sql').run({
            message_id: message.lastInsertRowid,
            chatroom_id: chatroom_ID
        });
    });

    createMessage();

}
