SELECT U.username, R.password_hash 
FROM User U
INNER JOIN Registration R
ON U.user_id = R.user_id
WHERE U.username = @username