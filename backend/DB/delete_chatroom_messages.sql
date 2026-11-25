DELETE FROM Message
WHERE message_id IN (
    SELECT message_id
    FROM MessageExchange
    WHERE chatroom_id = @chatroom_id
);
