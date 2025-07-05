import { Database, SqlValue } from 'sql.js/dist/sql-asm.js';

export type User = {
  id: string;                
  email: string;             
  name: string;              
  provider: string; 
  avatar_url: string;        
};

export function getUsers(db: Database, limit: number, offset: number): User[] {
    
    try{
        var users = db.exec(
            `SELECT * FROM users LIMIT $limit OFFSET $offset`,
            {
                "$limit": limit, "$offset" : offset
            } 
        );
    }
    catch{
        throw new Error("getUsers: Failed to get users");
    }
        
    const queryExecResult = users[0]

    if (queryExecResult === undefined) {
        return [];
    } else {
        return queryExecResult.values.map((sqlValues) => {
            return convertUser(sqlValues);
        });
    }

}

export function getUser(db: Database, id: string): User | null {

    try{
        var user = db.exec(
            `SELECT * FROM users WHERE id = $id`,
            {
                "$id": id
            } 
        );
            
    }
    catch{
        throw new Error("getUser: Failed to get user with id: " + id);
    }

    const queryExecResult = user[0]

    if (queryExecResult === undefined) {
        return null;
    } else {
        if(queryExecResult.values.length == 1){
            return convertUser(queryExecResult.values[0])
        }
        else{
            return null;
        }
    }
}


export function createUser(db: Database, userCreate: User) : User {

    try{
        var user = db.exec(
            `INSERT INTO users (id, email, name, provider, avatar_url) VALUES ($id, $email, $name, $provider, $avatar_url)`,
            {
                "$id": userCreate.id, 
                "$email": userCreate.email, 
                "$name": userCreate.name, 
                "$provider": userCreate.provider, 
                "$avatar_url": userCreate.avatar_url
            } 
        );

        return getUser(db, userCreate.id)!;
            
    }
    catch{
        throw new Error("createUser: Failed to create user with id: " + userCreate.id);
    }
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
