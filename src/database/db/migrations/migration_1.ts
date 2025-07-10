export const migration1 = `
    -- Workflows Table
    CREATE TABLE workflows (
        id CHAR(16) PRIMARY KEY,
        user_id CHAR(36) NOT NULL,
        title TEXT NOT NULL,
        json TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
`;
