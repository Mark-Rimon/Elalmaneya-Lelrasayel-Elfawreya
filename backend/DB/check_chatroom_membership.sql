SELECT 1 FROM ChatroomMembers
WHERE chatroom_id = @chatroom_id
AND member_id = @member_id;
