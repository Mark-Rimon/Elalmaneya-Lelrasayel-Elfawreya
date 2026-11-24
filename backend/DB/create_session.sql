-- create a new session once the user logs in

INSERT INTO Session(
    token
,   user_id
)
VALUES (
    @token
,   @user_id
);