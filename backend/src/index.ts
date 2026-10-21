
import express from "express";
import Database from "better-sqlite3";

const app = express();
const PORT = 3000;

app.use(express.json());

const db = new Database(
  process.env.DATABASE_PATH ?? "messages.db"
);

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

app.get("/", (_req, res) => {
  res.json({ message: "Messaging app backend is running!" });
});

app.get("/api/messages", (_req, res) => {
  const messages = db
    .prepare("SELECT * FROM messages ORDER BY id")
    .all();

  res.json(messages);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
