import express  from 'express';
import Database from "better-sqlite3";
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import os from 'node:os';

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

const interfaces = os.networkInterfaces();

export const local_ip = Object.values(interfaces)
    .flat()
    .find(iface =>
        iface?.family === 'IPv4' &&
        !iface.internal
    )?.address;

export function print_network_addresses() : void{

    console.log('\n=== Elalmaneya Network Addresses ===');
        
    for (const addresses of Object.values(interfaces)) {
        for (const iface of addresses ?? []) {
            if (iface.family === 'IPv4' && !iface.internal) {
                    console.log(`http://${iface.address}:5173`);
            }
        }
    }
}