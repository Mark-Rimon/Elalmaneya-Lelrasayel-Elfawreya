--inserts a new registration

INSERT INTO Registration(
   user_id
,  password_hash
   --registration_date defaults to today
)
VALUES (
    @user_id
,   @password_hash
    --registration_date
);