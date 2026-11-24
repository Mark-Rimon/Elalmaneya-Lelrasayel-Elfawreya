PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS User (
    user_id  INTEGER PRIMARY KEY AUTOINCREMENT
,   username TEXT NOT NULL UNIQUE
,   nickname TEXT
,   bio      TEXT
);

CREATE TABLE IF NOT EXISTS Registration (
    user_id INTEGER PRIMARY KEY
,   password_hash TEXT NOT NULL --MUST HASH
,   creation_date DATE NOT NULL DEFAULT CURRENT_DATE
,   FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Chatroom (
    chatroom_id INTEGER PRIMARY KEY AUTOINCREMENT
,   name TEXT NOT NULL DEFAULT 'Chatroom'
,   bio TEXT
);

CREATE TABLE IF NOT EXISTS ChatroomMembers (
    member_id INTEGER NOT NULL
,   chatroom_id INTEGER NOT NULL
,   admin_permission INTEGER NOT NULL DEFAULT 0 CHECK (admin_permission IN (0, 1))
,   PRIMARY KEY (member_id, chatroom_id)
,   FOREIGN KEY (member_id) REFERENCES User(user_id) ON DELETE CASCADE
,   FOREIGN KEY (chatroom_id) REFERENCES Chatroom(chatroom_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ChatroomCreation (
    chatroom_id INTEGER PRIMARY KEY
,   creator_id INTEGER
,   creation_date DATE NOT NULL DEFAULT CURRENT_DATE
,   FOREIGN KEY (creator_id) REFERENCES User(user_id) ON DELETE SET NULL
,   FOREIGN KEY (chatroom_id) REFERENCES Chatroom(chatroom_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Message (
    message_id INTEGER PRIMARY KEY AUTOINCREMENT
,   sender_id INTEGER NOT NULL
,   content TEXT NOT NULL
,   FOREIGN KEY (sender_id) REFERENCES User(user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS MessageExchange (
    message_id INTEGER PRIMARY KEY
,   chatroom_id INTEGER NOT NULL
,   exchange_date DATE NOT NULL DEFAULT CURRENT_DATE
,   exchange_time TIME NOT NULL DEFAULT CURRENT_TIME
,   FOREIGN KEY (message_id) REFERENCES Message(message_id) ON DELETE CASCADE
,   FOREIGN KEY (chatroom_id) REFERENCES Chatroom(chatroom_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Session (
    token       TEXT PRIMARY KEY
,   user_id     INTEGER NOT NULL
,   expires_at  INTEGER NOT NULL
,   FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


