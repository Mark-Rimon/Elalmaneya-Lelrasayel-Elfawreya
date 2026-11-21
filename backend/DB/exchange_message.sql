-- Slap the message into a chatroom

INSERT INTO MessageExchange (
    message_id
,   chatroom_id)
VALUES (
    @message_id
,   @chatroom_id);
