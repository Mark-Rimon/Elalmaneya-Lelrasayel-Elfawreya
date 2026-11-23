-- Allow Users to create chatrooms

INSERT INTO Chatroom(
    --chatroom_id
    name
,   bio
)
VALUES (
    --chatroom_id
    @name
,   @bio
);