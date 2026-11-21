--Search for users by their nickname or username

SELECT *
FROM User
WHERE username LIKE @query ESCAPE '\'
OR nickname LIKE @query ESCAPE '\'
ORDER BY username
LIMIT 20;