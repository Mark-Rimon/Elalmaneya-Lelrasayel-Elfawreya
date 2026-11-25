UPDATE Chatroom
SET name = CASE WHEN @update_name = 1 THEN @name ELSE name END
,   bio = CASE WHEN @update_bio = 1 THEN @bio ELSE bio END
WHERE chatroom_id = @chatroom_id;
