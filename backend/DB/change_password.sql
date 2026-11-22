-- Allow user to change their password

UPDATE Registration
SET
    password_hash = @new_password_hash
WHERE user_id = @user_id;