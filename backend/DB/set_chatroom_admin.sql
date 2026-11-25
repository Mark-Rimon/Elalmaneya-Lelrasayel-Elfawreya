UPDATE ChatroomMembers
SET admin_permission = @admin_permission
WHERE chatroom_id = @chatroom_id
AND member_id = @member_id;
