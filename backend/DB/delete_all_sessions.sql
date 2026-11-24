-- option to log out of all sessions associated with the user id
DELETE FROM Session
WHERE user_id = @user_id;