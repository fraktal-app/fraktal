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
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
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

            if(!user){
                return res.status(404).json({ error: "User not found" });
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" }); // Internal Server Error
        }
    });

    /**
     * POST /create-user
     * Creates a new user.
     * Query params: { id, email, name, provider, avatar_url }
     */
    router.post('/create-user', (req: Request, res: Response) => {
        
        try {
            const result = userSchema.safeParse(req.query);

            if (!result.success) {
                return res.status(400).json({ 
                    error: result.error.format() 
                });
            }

            const userObj: User = result.data;

            //Check if user exists
            if(getUser(db, userObj.id)){
                return res.status(409).json({ error: "User already exists" }); 
            }

            // Create user in database
            const user = createUser(db, userObj);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" }); // Internal Server Error
        }
    });

    return router;
}
