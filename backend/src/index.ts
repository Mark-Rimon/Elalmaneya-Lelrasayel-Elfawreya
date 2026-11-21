import { db, app, PORT } from './definition.js'
import { readSQL } from './handleSQL.js'; 
import { register_new_user } from './user_functionality.js';

app.get("/", (_req, res) => {
  res.json({ message: "Hello World!" });
});

//TODO: Remove this temporary test
//register_new_user('abdallah-edris', null, '7abes eblis felkees', '1234');

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
