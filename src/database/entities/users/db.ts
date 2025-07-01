import { Database, SqlValue } from 'sql.js/dist/sql-asm.js';

import { sqlite } from '../../db';

export type User = {
  id: string;                
  email: string;             
  name: string;              
  provider: string; 
  avatar_url: string;        
};


export function getUsers(db: Database, limit: number, offset: number): User[] {
    return sqlite<User>`SELECT * FROM users LIMIT ${limit} OFFSET ${offset}`(
        db,
        convertUser
    );
}

export function getUser(db: Database, id: string): User | null {
    const users = sqlite<User>`SELECT * FROM users WHERE id = ${id}`(
        db,
        convertUser
    );

    return users.length === 0 ? null : users[0];
}


export function createUser(db: Database, userCreate: User): User {
    sqlite`INSERT INTO users (id, email, name, provider, avatar_url) VALUES (${userCreate.id}, ${userCreate.email}, ${userCreate.name}, ${userCreate.provider}, ${userCreate.avatar_url})`(
        db
    );

    const id = sqlite<string>`SELECT last_insert_rowid()`(
        db,
        (sqlValues) => sqlValues[0] as string
    )[0];

    const user = getUser(db, userCreate.id);

    if (user === null) {
        throw new Error(`updateUser: could not find user with id ${userCreate.id}`);
    }

    return user;
}


export function deleteUser(db: Database, id: string): string {
    sqlite`DELETE FROM users WHERE id = ${id}`(db);

    const user = getUser(db, id);

    if (user !== null) {
        throw new Error(`deleteUser: could not delete user with id ${id}`);
    }

    return id;
}


export function convertUser(sqlValues: SqlValue[]): User {
    return {
        id: sqlValues[0] as string,
        email: sqlValues[1] as string,
        name: sqlValues[2] as string,
        provider: sqlValues[3] as 'google' | 'github',
        avatar_url: sqlValues[4] as string
    };
}
