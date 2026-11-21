--update the user's password

UPDATE registration
SET password_hash = @password_hash
WHERE user_id = @user_id
