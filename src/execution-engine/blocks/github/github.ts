import { fetchWorkflowFromDB } from "../../lib/db";
import ExecutionQueue from '../../executionQueue'

export async function githubTriggerWebhook(req, res){
    const userId = req.params.userId;
    const workflowId = req.params.workflowId;
    const githubEvent = req.headers['x-github-event'];
    const body = req.body;

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

        let extractedData;

        //Check if this event is same as trigger event
        if(workflow.json.trigger.event == githubEvent){

            if(githubEvent == 'push'){
                extractedData = {
                    repo_fullname: body.repository.full_name,
                    pusher_name: body.pusher.name,
                    head_commit_message: body.head_commit.message,
                    head_commit_author: body.head_commit.author.username,
                    head_commit_url: body.head_commit.html_url
                };
            }

            else if(githubEvent == 'issues'){
                extractedData = {
                    issue_url: body.issue.html_url,
                    issue_title: body.issue.title,
                    issue_raised_by: body.issue.user.login,
                    issue_message: body.issue.body,
                    issue_repo_name: body.repository.full_name,
                    issue_repo_url: body.repository.html_url
                };
            }

            else if(githubEvent == 'pull_request'){
                extractedData = {
                    pull_request_url: body.pull_request.html_url,
                    pull_request_title: body.pull_request.title,
                    pull_request_raised_by: body.pull_request.user.login,
                    pull_request_message: body.pull_request.body,
                    pull_request_repo_name: body.repository.full_name,
                    pull_request_repo_url: body.repository.html_url
                };
            }
        }
        else{
            return;
        }

        const label = `${workflow.json.trigger.id!}.${workflow.json.trigger.appType!}`

        //Add message data to workflow
        workflow.data = {
            ...(workflow.data || {}),
            [label] : extractedData
        }

        ExecutionQueue.add(workflow)
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


