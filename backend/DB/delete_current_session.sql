-- delete the session attached to the client's browser
DELETE FROM Session
WHERE token = @token;