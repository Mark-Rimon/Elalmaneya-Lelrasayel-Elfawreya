import express  from 'express';
import Database from "better-sqlite3";
import { createServer } from 'node:http';
import { Server } from 'socket.io';

export const db = new Database(
    process.env.DATABASE_PATH ?? "messages.db"
);

export const app = express();
app.use(express.json());

export const server = createServer(app);
export const io = new Server(server,
    {
        cors: {
          origin: true
        }
      }
);

export const PORT = 3000;


