--User can edit their information (handling of null done outside the .sql)

UPDATE User
SET 
    username = COALESCE(@username, username)
,   nickname = COALESCE(@nickname, nickname)
,   bio      = COALESCE(@bio, bio)
WHERE user_id = @user_id;
