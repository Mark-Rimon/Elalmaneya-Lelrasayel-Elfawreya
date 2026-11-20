import express from "express";
import Database from "better-sqlite3";

import { readFileSync } from "node:fs";
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const app = express();
const PORT = 3000;

app.use(express.json());

const db = new Database(
  process.env.DATABASE_PATH ?? "messages.db"
);



const filePath = fileURLToPath(import.meta.url);
const fileDir = dirname(filePath);
const rootDir = dirname(fileDir);
const SchemaPath = join(rootDir, 'DB', 'schema.sql');
const dbCode: string = readFileSync(process.env.SCHEMAPATH  ?? SchemaPath, 'utf-8');

db.exec(dbCode);

app.get("/", (_req, res) => {
  res.json({ message: "ya sa7ib wagh el 5ary" });
});

app.get("/api/messages", (_req, res) => {

    const messages = db
    .prepare(`
        SELECT * 
        FROM Message M
        INNER JOIN User U
        ON M.sender_id = U.user_id
        ORDER BY message_id
        `)
    .all();

    res.json(messages);

});

app.listen(PORT, "0.0.0.0", () => {

  console.log(`Server running on http://localhost:${PORT}`);
  
});
