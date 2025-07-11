import { Database, SqlValue } from 'sql.js/dist/sql-asm.js';

export type Trigger = {
    workflow_id: string,
    user_id: string,
    time_interval?: number,
    next_execution: Date,
    last_execution: Date,
    json: string
}

export function getTriggers(db: Database, limit: number, offset: number): Omit<Trigger, 'json'>[] {
    
    try{
        var triggers = db.exec(`
            SELECT workflow_id, user_id, time_interval, next_execution, last_execution
            FROM triggers
            ORDER BY next_execution
            LIMIT $limit OFFSET $offset;`,
            {
                "$limit": limit, "$offset" : offset
            } 
        );

        const queryExecResult = triggers[0]

        if (queryExecResult === undefined) {
            return [];
        } else {
            return queryExecResult.values.map((sqlValues) => {
                return convertTriggerWithoutJSON(sqlValues);
            });
        }
    }
    catch(e){
        console.error(e)
        throw new Error("getTriggers: Failed to get triggers");
    }
        


}

export function getTrigger(db: Database, workflow_id: string): Trigger | null {

    try{
        var trigger = db.exec(
            `SELECT workflow_id, user_id, time_interval, next_execution, last_execution, json 
            FROM triggers WHERE workflow_id = $workflow_id`,
            {
                "$workflow_id": workflow_id
            } 
        );
            
        const queryExecResult = trigger[0]

        if (queryExecResult === undefined) {
            return null;
        } else {
            if(queryExecResult.values.length == 1){
                return convertTrigger(queryExecResult.values[0])
            }
            else{
                return null;
            }
        }
            
    }
    catch(e){
        console.error(e)
        throw new Error("getTrigger: Failed to get trigger with workflow_id: " + workflow_id);
    }

}

export function saveTrigger(db: Database, triggerCreate: Trigger) : Trigger {

    try{

        db.exec(
            `UPDATE triggers 
            SET json = $json,
                time_interval = $time_interval,
                next_execution = $next_execution,
                last_execution = $last_execution
            WHERE workflow_id = $workflow_id;

            INSERT INTO triggers (workflow_id, user_id, time_interval, next_execution, last_execution, json)
            SELECT $workflow_id, $user_id, $time_interval, $next_execution, $last_execution, $json 
            WHERE NOT EXISTS (SELECT 1 FROM triggers WHERE workflow_id = $workflow_id);`,
            {
                $workflow_id: triggerCreate.workflow_id,
                $user_id: triggerCreate.user_id,
                $time_interval: triggerCreate.time_interval ?? 900,
                $next_execution: triggerCreate.next_execution.toISOString(),
                $last_execution: triggerCreate.last_execution.toISOString(),
                $json: triggerCreate.json
            }
        );

        return getTrigger(db, triggerCreate.workflow_id)!;
            
    }
    catch(e){
        console.error(e)
        throw new Error("saveTrigger: Failed to save trigger with workflow_id: " + triggerCreate.workflow_id);
    }
}

export function deleteTrigger(db: Database, workflow_id: string): void {
    try {
        db.exec(`DELETE FROM triggers WHERE workflow_id = $workflow_id`, 
            { 
                "$workflow_id": workflow_id
            }
        );
    } catch (e) {
        console.error(e);
        throw new Error("deleteTriggers: Failed to delete trigger with workflow_id: " + workflow_id);
    }
}

//Convert SqlValue to Trigger type Object
export function convertTrigger(sqlValues: SqlValue[]): Trigger {
    return {
        workflow_id: sqlValues[0] as string,
        user_id: sqlValues[1] as string,
        time_interval: sqlValues[2] as number,
        next_execution: new Date(sqlValues[3] as string) as Date,
        last_execution: new Date(sqlValues[4] as string) as Date,
        json: sqlValues[5] as string
    };
}

//Convert SqlValue to Trigger type Object without JSON data
export function convertTriggerWithoutJSON(sqlValues: SqlValue[]): Omit<Trigger, 'json'> {
    return {
        workflow_id: sqlValues[0] as string,
        user_id: sqlValues[1] as string,
        time_interval: sqlValues[2] as number,
        next_execution: new Date(sqlValues[3] as string) as Date,
        last_execution: new Date(sqlValues[4] as string) as Date
    };
}