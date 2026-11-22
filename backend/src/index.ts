import { db, app, PORT } from './definition.js'
import { readSQL } from './handleSQL.js'; 
import { register_new_user, edit_user, authenticate_user, change_password } from './user_functionality.js';
import { send_message } from './message_functionality.js'

//TODO: Remove this temporary test
const msg = await authenticate_user('abdallah-edris', '1234');

app.get("/", (_req, res) => {
  res.json({ message: "User's password attempt returns: " + String(msg) });
});

//Gotta wait till we can properly add chatrooms
//send_message(2, 1, 'hello world!');

app.get("/api/messages", (_req, res) => {

    const messages = db
    .prepare(`
        SELECT *
        FROM User U
        INNER JOIN Registration R
        ON U.user_id = R.user_id;
        `)
    .all();

    res.json(messages);

});

/*
QoL after running `docker compose up --build` print the backend URL
*/

app.listen(PORT, "0.0.0.0", () => {

    console.log(`Server running on http://localhost:${PORT}`);
  
});
