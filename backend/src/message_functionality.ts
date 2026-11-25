import { db      } from './definition.js';
import { prepSQL } from './handleSQL.js';


//---SEND_MESSAGE---

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

//---CHECK_MESSAGE_RECENCY---

export function check_message_recency(message_id: number, hours = 1): boolean {
    const message = prepSQL('get_message_datetime.sql').get({ message_id }) as
        { exchange_time: string; exchange_date: string } | undefined;

    if (!message) {
        throw new Error('Message not found');
    }

    const { exchange_time, exchange_date } = message;

    // Timezone is parsed in UTC so we can correctly compare the message time with the current time in UTC
    const message_date_time = new Date(`${exchange_date}T${exchange_time}Z`).getTime(); // the 'Z' makes the date parse in UTC

    const current_time = Date.now();
    //check if the message is within the last [hours] hour(s) :)
    const cutoff_time = current_time - hours * 60 * 60 * 1000;
    
    // returns true if the message is within the accepted time frame, false otherwise
    return (message_date_time > cutoff_time) && (message_date_time <= current_time);
}


//---EDIT_MESSAGE---

export function edit_message(message_id: number, new_content: string): void {
    const edit = db.transaction(() => {
        if (!check_message_recency(message_id)) {
            throw new Error('Message cannot be edited.');
        }

        prepSQL('edit_message.sql').run({
            message_id,
            content: new_content
        });
    });
    
   edit();
}

//---DELETE_MESSAGE---

export function delete_message(message_id: number): void {
    const del = db.transaction(() => {
        if (!check_message_recency(message_id)) {
            throw new Error('Message cannot be deleted.');
        }

        prepSQL('delete_message.sql').run({
            message_id
        });
    });
    
   del();
}
