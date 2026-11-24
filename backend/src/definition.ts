import express  from 'express';
import Database from "better-sqlite3";

export const db = new Database(
    process.env.DATABASE_PATH ?? "messages.db"
);

export const app = express();
export const PORT = 3000;

app.use(express.json());
