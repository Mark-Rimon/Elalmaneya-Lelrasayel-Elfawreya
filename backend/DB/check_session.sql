-- check if a session exists with this token
SELECT 1
FROM Session
WHERE token = @token
AND user_id = @user_id