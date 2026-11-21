import { db } from './definition.js';
import { prepSQL } from './handleSQL.js';


function dbStoreMessage(senderId: number, chatroomId: number, content: string): void {
    const createMessage = db.transaction(() => {
        const message = prepSQL('message_create.sql').run({
            message_sender_id: senderId,
            message_content: content
        });

        prepSQL('message_exchange.sql').run({
            message_id: message.lastInsertRowid,
            chatroom_id: chatroomId
        });
    });

    createMessage();

}
