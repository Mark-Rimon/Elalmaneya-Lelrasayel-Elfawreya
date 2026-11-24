import { Statement     } from "better-sqlite3";
import { readFileSync  } from "node:fs";
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { db            } from './definition.js';

export function readSQL(path: string): string {
    
const filePath = fileURLToPath(import.meta.url);

const fileDir = dirname(filePath);
const rootDir = dirname(fileDir);

const SqlPath = join(rootDir, 'DB', path);
const dbCode: string = readFileSync(SqlPath, 'utf-8');

return dbCode;
};

export function prepSQL(path: string): Statement {
    return db.prepare(
        readSQL(path)
    );
}
