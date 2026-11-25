SELECT 1
FROM ChatroomCreation
WHERE chatroom_id = @chatroom_id
AND creator_id = @user_id;
