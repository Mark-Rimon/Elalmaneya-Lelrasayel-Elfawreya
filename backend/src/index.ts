import { io 
       , db
       , app
       , server
       , PORT          
       , local_ip
       , print_network_addresses } from './definition.js';
import { readSQL                 } from './handleSQL.js';
import { Socket                  } from 'socket.io';

//Print the docker bridge ip for backend       
server.listen(PORT, "0.0.0.0", () => {       
   console.log(`Server running on http://${local_ip}:${PORT}`);
});

//print the network address to connect to from other devices
print_network_addresses();

//update schema if something's new
db.exec(readSQL('schema.sql'));

/*
=========================================================================
---TESTING_SECTION---
=========================================================================
*/
app.get("/", (_req, res) => {
  res.json({ message: 'Hello World!'});
});

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


io.on('connection', (socket: Socket) => {
    console.log(`socket: ${socket} says hi`);
});


