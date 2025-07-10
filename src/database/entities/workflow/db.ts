import { Database, SqlValue } from 'sql.js/dist/sql-asm.js';

export type Workflow = {
    id: string,
    user_id: string,
    title: string,
    json: string,
    createdAt?: string
}

export type WorkflowInput = Pick<Workflow, "id" | "user_id" | "title" | "json">;

export function getWorkflows(db: Database, limit: number, offset: number): Omit<Workflow, 'json'>[] {
    
    try{
        var workflows = db.exec(`
            SELECT id, user_id, title, createdAt 
            FROM workflows LIMIT $limit OFFSET $offset`,
            {
                "$limit": limit, "$offset" : offset
            } 
        );
    }
    catch(e){
        console.error(e)
        throw new Error("getWorkflows: Failed to get workflows");
    }
        
    const queryExecResult = workflows[0]

    if (queryExecResult === undefined) {
        return [];
    } else {
        return queryExecResult.values.map((sqlValues) => {
            return convertWorkflowWithoutJSON(sqlValues);
        });
    }

}

export function getWorkflow(db: Database, workflow_id: string): Workflow | null {

    try{
        var workflow = db.exec(
            `SELECT id, user_id, title, json, createdAt 
            FROM workflows WHERE id = $workflow_id`,
            {
                "$workflow_id": workflow_id
            } 
        );
            
    }
    catch(e){
        console.error(e)
        throw new Error("getWorkflow: Failed to get workflow with workflow_id: " + workflow_id);
    }

    const queryExecResult = workflow[0]

    if (queryExecResult === undefined) {
        return null;
    } else {
        if(queryExecResult.values.length == 1){
            return convertWorkflow(queryExecResult.values[0])
        }
        else{
            return null;
        }
    }
}

export function getWorkflowsByUserID(db: Database, user_id: string): Omit<Workflow, 'json'>[] {

    try{
        var workflows = db.exec(
            `SELECT id, user_id, title, createdAt 
            FROM workflows WHERE user_id = $user_id ORDER BY createdAt`,
            {
                "$user_id": user_id
            } 
        );
            
    }
    catch(e){
        console.error(e)
        throw new Error("getWorkflowByUserID: Failed to get workflow with user_id: " + user_id);
    }

    const queryExecResult = workflows[0]

    if (queryExecResult === undefined) {
        return [];
    } else {
        return queryExecResult.values.map((sqlValues) => {
            return convertWorkflowWithoutJSON(sqlValues);
        });
    }
}

export function saveWorkflow(db: Database, workflowCreate: WorkflowInput) : Workflow {

    try{

        db.exec(
            `UPDATE workflows 
            SET title = $title, json = $json
            WHERE id = $id;

            INSERT INTO workflows (id, user_id, title, json)
            SELECT $id, $user_id, $title, $json
            WHERE NOT EXISTS (SELECT 1 FROM workflows WHERE id = $id);`, 
            {
                $id: workflowCreate.id,
                $user_id: workflowCreate.user_id,
                $title: workflowCreate.title,
                $json: workflowCreate.json
            }
        );

        return getWorkflow(db, workflowCreate.id)!;
            
    }
    catch(e){
        console.error(e)
        throw new Error("saveWorkflow: Failed to save workflow with id: " + workflowCreate.id);
    }
}

export function deleteWorkflow(db: Database, workflow_id: string): void {
    try {
        db.exec(`DELETE FROM workflows WHERE id = $id`, 
            { 
                "$id": workflow_id
            }
        );
    } catch (e) {
        console.error(e);
        throw new Error("deleteWorkflow: Failed to delete workflow with id: " + workflow_id);
    }
}


//Convert SqlValue to Workflow type Object
export function convertWorkflow(sqlValues: SqlValue[]): Workflow {
    return {
        id: sqlValues[0] as string,
        user_id: sqlValues[1] as string,
        title: sqlValues[2] as string,
        json: sqlValues[3] as string,
        createdAt: sqlValues[4] ? (sqlValues[4] as string) : undefined
    };
}

//Convert SqlValue to Workflow type Object without JSON data
export function convertWorkflowWithoutJSON(sqlValues: SqlValue[]): Omit<Workflow, 'json'> {
    return {
        id: sqlValues[0] as string,
        user_id: sqlValues[1] as string,
        title: sqlValues[2] as string,
        createdAt: sqlValues[3] ? (sqlValues[3] as string) : undefined
    };
}