import { db, app, PORT } from './definition.js'
import { readSQL } from './handleSQL.js'; 
import { register_new_user, edit_user, authenticate_user } from './user_functionality.js';

//TODO: Remove this temporary test
const msg = authenticate_user('mark-rimon', '1234');

app.get("/", (_req, res) => {
  res.json({ message: msg });
});


app.get("/api/messages", (_req, res) => {

    const messages = db
    .prepare(`
        SELECT *
        FROM User U
        INNER JOIN registration R
        ON U.user_id = R.user_id
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
