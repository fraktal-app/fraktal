import express, { Request, Response } from 'express';
import { Server as NodeServer } from 'http';

import { getRouter as getRouterUsers } from '../entities/users/router';
import { getRouter as getRouterWorkflow } from '../entities/workflow/router';
import { getRouter as getRouterTrigger } from '../entities/triggers/router';

import { db } from '..';

export function initServer(): NodeServer {

    let app = express();
    app.use(express.json());

    app.use('/users', getRouterUsers());
    app.use('/workflows', getRouterWorkflow());
    app.use('/triggers', getRouterTrigger());

    app.get('/health', (req: Request, res: Response) => {
        try {
            db.exec('SELECT 1'); // Simple DB check

            res.status(200).json({
                status: 'ok',
                db: 'connected',
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            console.error('Health check failed:', error);
            res.status(503).json({
                status: 'error',
                db: 'unavailable',
                timestamp: new Date().toISOString(),
            });
        }
    });

    return app.listen();
}
