import express, { Request, Response, Router } from 'express';
import z from 'zod';

import { db } from '../..';
import {
    createUser,
    getUser,
    getUsers,
    User,
} from './db';

// Zod schema for validating User objects
const userSchema = z.object({
    id: z.string().length(36).nonempty(),                // UUID (36 chars)
    email: z.string().email().nonempty(),                // Must be a valid email
    name: z.string().nonempty(),                         // Name
    provider: z.string().nonempty(),                     // Provider
    avatar_url: z.string().nonempty()                    // URL to avatar image
});

export function getRouter(): Router {
    const router = express.Router();

    /**
     * GET /get-all-users
     * Retrieves all users with optional pagination.
     * Query params: ?limit=number&offset=number
     */
    router.get('/get-all-users', (req: Request, res: Response) => {
        const limit = Number(req.query.limit ?? -1); // Default: -1 = no limit
        const offset = Number(req.query.offset ?? 0); // Default: 0

        try {
            const users = getUsers(db, limit, offset);
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json(error); // Internal Server Error
        }
    });

    /**
     * GET /get-user?id=<user-id>
     * Retrieves a single user by ID.
     */
    router.get('/get-user', (req: Request, res: Response) => {
        const { id } = req.query;

        // Validate query param
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: "Missing or invalid user ID in query" });
        }

        try {
            const user = getUser(db, id);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error); // Internal Server Error
        }
    });

    /**
     * POST /create-user
     * Creates a new user.
     * Body params: { id, email, name, provider, avatar_url }
     */
    router.post('/create-user', (req: Request, res: Response) => {
        const { id, email, name, provider, avatar_url } = req.body;

        try {
            const userObj: User = {
                id,
                email,
                name,
                provider,
                avatar_url
            };

            // Validate user input using Zod schema
            if (!userSchema.safeParse(userObj).success) {
                return res.status(400).json({
                    error: "Invalid inputs."
                });
            }

            // Create user in database
            const user = createUser(db, userObj);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error); // Internal Server Error
        }
    });

    /**
     * GET /health
     * Health check endpoint.
     * Verifies DB connectivity and returns basic server status.
     */
    router.get('/health', (req: Request, res: Response) => {
        try {
            db.exec('SELECT 1'); // Simple DB check

            res.status(200).json({
                status: 'ok',
                db: 'connected',
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            console.error('Health check failed:', error);
            res.status(500).json({
                status: 'error',
                db: 'unavailable',
                timestamp: new Date().toISOString(),
            });
        }
    });

    return router;
}
