import { fetchWorkflowFromDB } from "../../lib/db";
import ExecutionQueue from '../../executionQueue'

export async function telegramTriggerWebhook(req, res){
    const userId = req.params.userId;
    const workflowId = req.params.workflowId;
    const githubEvent = req.headers['X-GitHub-Event'];

    console.log({
        githubEvent,
        body: req.body
    })

    //Fetch workflow from DB
    //Put onto Queue
    try{
        //TODO: Add Execution log for users
        const response = await fetchWorkflowFromDB(userId, workflowId);
        let workflow = response;

        try{
            let workflowJSON = JSON.parse(workflow.json);
            workflow.json = workflowJSON;
        }
        catch(e){
            console.error(e);
            res.sendStatus(500);
        }

        console.log(workflow);

        // //Extract relevant message data
        // const extractedData = {
        //     chat_id: msg.chat.id,
        //     username: msg.from.username,
        //     name: `${msg.from.first_name} ${msg.from.last_name}`,
        //     message: msg.text,
        // };

        // const label = `${workflow.json.trigger.id!}.${workflow.json.trigger.appType!}`

        // //Add message data to workflow
        // workflow.data = {
        //     ...(workflow.data || {}),
        //     [label] : extractedData
        // }

        // ExecutionQueue.add(workflow)
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            "msg": "Internal server error",
            "error": e 
        })
    }

    res.sendStatus(200);
}


