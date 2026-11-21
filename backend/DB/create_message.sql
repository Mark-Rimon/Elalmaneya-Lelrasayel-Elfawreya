--Define a new message in the message table

INSERT INTO Message (
    sender_id
,   content)
VALUES (
    @message_sender_id
,   @message_content);
