import express, { Request, Response, Router } from 'express';

import { db } from '../..';
import {
    createUser,
    getUser,
    getUsers,
    deleteUser,
    User,
} from './db';

export function getRouter(): Router {
    const router = express.Router();

    //Just for testing.
    router.get('/get-all-users',
        (
            req: Request<any, any, any, { limit?: string; offset?: string }>,
            res
        ) => {
            const limit = Number(req.query.limit ?? -1);
            const offset = Number(req.query.offset ?? 0);

            const users = getUsers(db, limit, offset);

            res.json(users);
        }
    );

    router.get('/get-user/', 
        (req, res) => {
        const { id } = req.body;

        const user = getUser(db, String(id));

        res.json(user);
    });

    router.post('/create-user',
        (req: Request<any, any, User>, res) => {

            const { id, email, name, provider, avatar_url } = req.body;

            const user = createUser(db, {
                id,
                email,
                name,
                provider,
                avatar_url
            });

            res.json(user);
        }
    );



    router.delete('/delete-user', 
        (req: Request<any, any, { id: string }>, res) => {
            const { id } = req.body;

            const deletedId = deleteUser(db, id);

            res.json(deletedId);
        }
    );

    return router;
}


