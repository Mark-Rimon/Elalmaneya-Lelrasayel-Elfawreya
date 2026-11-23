-- Record who and when they created their chatroom

INSERT INTO ChatroomCreation (
    chatroom_id
,   creator_id
)
VALUES (
    @chatroom_id
,   @creator_id
);