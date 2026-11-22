-- ACCOUNT BE GONE!

DELETE
FROM User 
WHERE (
    user_id = @user_id
);