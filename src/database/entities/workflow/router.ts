import express, { Request, Response, Router } from 'express';
import z from 'zod';

import { db } from '../..';

import {
    Workflow,
    getWorkflow,
    getWorkflows,
    getWorkflowsByUserID,
    saveWorkflow,
    deleteWorkflow
} from './db';

// Zod schema for validating Workflow objects
const workflowSchema = z.object({
    id: z.string().length(36).nonempty(),       // UUID format (36 chars)
    user_id: z.string().length(36).nonempty(),  // User ID as UUID
    title: z.string().nonempty(),               // Workflow title must be non-empty
    json: z.string().nonempty()                 // JSON representation of workflow
});

export function getRouter(): Router {
    const router = express.Router();

    /**
     * GET /get-all-workflows
     * Returns all workflows in the database with optional pagination.
     * Accepts query params: limit (default -1), offset (default 0)
     */

    router.get('/get-all-workflows', (req: Request, res: Response) => {
        const limit = Number(req.query.limit ?? -1);  // -1 means no limit
        const offset = Number(req.query.offset ?? 0); // Default offset is 0

        try {
            const workflows = getWorkflows(db, limit, offset);
            res.status(200).json(workflows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    /**
     * GET /get-workflow
     * Returns a single workflow by its ID.
     * Requires query param: workflow_id
     */
    router.get('/get-workflow', (req: Request, res: Response) => {
        const { workflow_id } = req.query;

        // Validate query param
        if (!workflow_id || typeof workflow_id !== 'string') {
            return res.status(400).json({ error: "Missing or invalid workflow ID in query" });
        }

        try {
            const workflow = getWorkflow(db, workflow_id);

            if(!workflow){
                return res.status(404).json({ error: "Workflow not found" });
            }

            res.status(200).json(workflow);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" }); // Internal Server Error
        }
    });

    /**
     * GET /get-workflows-by-user-id
     * Returns all workflows created by a specific user.
     * Requires query param: user_id
     */
    router.get('/get-workflows-by-user-id', (req: Request, res: Response) => {
        const { user_id } = req.query;

        // Validate query param
        if (!user_id || typeof user_id !== 'string') {
            return res.status(400).json({ error: "Missing or invalid user ID in query" });
        }

        try {
            const workflow = getWorkflowsByUserID(db, user_id);

            if(workflow.length === 0){
                return res.status(404).json({ error: "Workflows not found" });
            }

            res.status(200).json(workflow);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" }); // Internal Server Error
        }
    });


    /**
     * POST /save-workflow
     * Creates a new workflow from validated input.
     * Accepts body params: id, user_id, title, json
     */
    router.post('/save-workflow', (req: Request, res: Response) => {
        
        try {
            const result = workflowSchema.safeParse(req.query);

            if (!result.success) {
                return res.status(400).json({ 
                    error: result.error.format() 
                });
            }

            const workflowObj: Workflow = result.data;

            // Create workflow in database
            const workflow = saveWorkflow(db, workflowObj);
            res.status(201).json(workflow); // 201 = Created
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" }); // Internal Server Error
        }
    });

    /**
     * DELETE /delete-workflow
     * Deletes a workflow by its ID.
     * Requires query param: workflow_id
     */
    router.delete('/delete-workflow', (req: Request, res: Response) => {
        const { workflow_id } = req.query;

        // Validate query param
        if (!workflow_id || typeof workflow_id !== 'string') {
            return res.status(400).json({ error: "Missing or invalid workflow_id in query" });
        }

        try {
            deleteWorkflow(db, workflow_id);

            res.status(200).json({
                "message": "Workflow deleted successfully."
            });
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" }); // Internal Server Error
        }
    });

    return router;
}
