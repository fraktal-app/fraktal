import express from 'express';
import { Server as NodeServer } from 'http';

import { getRouter as getRouterUsers } from '../entities/users/router';

export function initServer(): NodeServer {

    let app = express();

    app.use(express.json());

    app.use('/users', getRouterUsers());


    return app.listen();
}
