export const migration2 = `
    -- Triggers Table
    CREATE TABLE triggers (
        workflow_id VARCHAR(16) NOT NULL PRIMARY KEY,
        user_id CHAR(36) NOT NULL,
        time_interval INTEGER DEFAULT 900,
        next_execution TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_execution TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        json BLOB NOT NULL,
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE
    );

    CREATE INDEX idx_triggers_next_execution ON triggers(next_execution);
`;
