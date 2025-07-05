import initSqlJs, {
    Database
} from 'sql.js/dist/sql-asm.js';

import { migrations } from './migrations';

export async function initDb(
    bytes: Uint8Array = Uint8Array.from([])
): Promise<Database> {
    const SQL = await initSqlJs({});

    let db = new SQL.Database(bytes);

    //Metadata table to track migration versions
    db.run(`
    CREATE TABLE IF NOT EXISTS meta (
        key TEXT PRIMARY KEY,
        value TEXT
    );

    INSERT OR IGNORE INTO meta (key, value) VALUES ('schema_version', '0');
    `);

    // Get current schema version
    const result = db.exec(`SELECT value FROM meta WHERE key = 'schema_version'`);
    let currentVersion = parseInt(result?.[0]?.values?.[0]?.[0] as string) || 0;

    // Apply only newer migrations
    for (let i = currentVersion; i < migrations.length; i++) {
        console.log(`Applying migration #${i + 1}`);
        try{
            db.run(migrations[i]);
            db.run(`UPDATE meta SET value = ? WHERE key = 'schema_version'`, [(i + 1).toString()]);
        }
        catch(e){
            console.error(e)
        }
    }

    return db;
}

