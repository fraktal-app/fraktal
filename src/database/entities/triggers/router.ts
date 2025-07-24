import express, { Request, Response, Router } from 'express';
import z from 'zod';

import { db } from '../..';

import {
    Trigger,
    getTrigger,
    getTriggers,
    saveTrigger,
    deleteTrigger
} from './db';

// Zod schema for validating Workflow objects
const triggerSchema = z.object({
  workflow_id: z.string().nonempty(),
  user_id: z.string().nonempty(),
  time_interval: z.number().optional(),
  next_execution: z.coerce.date(), // Coerces string to Date
  last_execution: z.coerce.date(),
  json: z.string().nonempty()
});

export function getRouter(): Router {
    const router = express.Router();

    /**
     * GET /get-all-triggers
     * Fetches a paginated list of triggers (excluding `json` field).
     * Optional query parameters: limit, offset
     */
    router.get('/get-all-triggers', (req: Request, res: Response) => {
        const limit = Number(req.query.limit ?? -1);    // Default: -1 (no limit)
        const offset = Number(req.query.offset ?? 0);   // Default: 0

        try {
            const triggers = getTriggers(db, limit, offset); // Fetch from DB
            res.status(200).json(triggers);
        } catch (error) {
            console.error(error); // Log error for debugging
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    /**
     * GET /get-trigger?workflow_id=...
     * Retrieves a single trigger by its workflow_id.
     */
    router.get('/get-trigger', (req: Request, res: Response) => {
        const { workflow_id } = req.query;

        // Validate query param
        if (!workflow_id || typeof workflow_id !== 'string') {
            return res.status(400).json({ error: "Missing or invalid workflow ID in query" });
        }

        try {
            const trigger = getTrigger(db, workflow_id); // Look up trigger in DB

            if (!trigger) {
                return res.status(404).json({ error: "Trigger not found" });
            }

            res.status(200).json(trigger);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    /**
     * POST /save-trigger
     * Saves or updates a trigger.
     * Accepts trigger fields via query parameters.
     */
    router.post('/save-trigger', (req: Request, res: Response) => {
        try {
            const result = triggerSchema.safeParse(req.query); // Validate input using Zod

            if (!result.success) {
                return res.status(400).json({ 
                    error: result.error.format() // Send structured validation errors
                });
            }

            const triggerObj: Trigger = result.data;

            // Save the validated trigger to the DB
            const trigger = saveTrigger(db, triggerObj);
            res.status(201).json(trigger); // Respond with saved trigger
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    /**
     * DELETE /delete-trigger?workflow_id=...
     * Deletes a trigger by its workflow_id.
     */
    router.delete('/delete-trigger', (req: Request, res: Response) => {
        const { workflow_id } = req.query;

        // Validate query param
        if (!workflow_id || typeof workflow_id !== 'string') {
            return res.status(400).json({ error: "Missing or invalid workflow_id in query" });
        }

        try {
            deleteTrigger(db, workflow_id); // Remove trigger from DB

            res.status(200).json({
                "message": "Trigger deleted successfully."
            });
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    return router; // Return the configured router
}