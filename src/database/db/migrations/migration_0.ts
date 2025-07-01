export const migration0 = `
    CREATE TABLE users (
        id CHAR(36) PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        provider TEXT NOT NULL,
        avatar_url TEXT NOT NULL
    );
`;
