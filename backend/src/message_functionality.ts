import { db } from './definition.js';
import { prepSQL } from './handleSQL.js';


export function send_message(senderId: number, chatroomId: number, content: string): void {
    //TODO: Check sender is a member of the chatroom

    //Define the message in message table then add it to exchange table
    const createMessage = db.transaction(() => {
        const message = prepSQL('create_message.sql').run({
            message_sender_id: senderId,
            message_content: content
        });

        prepSQL('exchange_message.sql').run({
            message_id: message.lastInsertRowid,
            chatroom_id: chatroomId
        });
    });

    createMessage();

}
