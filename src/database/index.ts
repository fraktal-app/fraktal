import {
    Server,
    init,
    postUpgrade,
    preUpgrade,
} from 'azle/experimental';

import {
    StableBTreeMap,
    stableJson
} from 'azle';

import { Database } from 'sql.js/dist/sql-asm.js';

import { initDb } from './db';
import { initServer } from './server';

export let db: Database;

let stableDbMap = new StableBTreeMap<'DATABASE', Uint8Array>(0, stableJson, {
    toBytes: (data: Uint8Array) => data,
    fromBytes: (bytes: Uint8Array) => bytes
});

export default Server(initServer, {
    init: init([], async () => {
        db = await initDb();
    }),
    preUpgrade: preUpgrade(() => {
        stableDbMap.insert('DATABASE', db.export());
    }),
    postUpgrade: postUpgrade([], async () => {
        const database = stableDbMap.get('DATABASE');
        if (database === null) {
            throw new Error('Failed to get database');
        }
        db = await initDb(database);
    })
});
