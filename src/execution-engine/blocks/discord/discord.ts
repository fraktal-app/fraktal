import { fetchWorkflowFromDB } from "../../lib/db";
import ExecutionQueue from '../../executionQueue'

export async function discordTriggerWebhook(req, res){
  const userId = req.params.userId;
  const workflowId = req.params.workflowId;

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

      console.log(workflow);

      //Extract relevant message data
      const extractedData = {
          message: body.clean_content,
          username: body.author_name,
          author_id: body.author_id,
          channel_name: body.channel_name,
          channel_id: body.channel_id,
          server_name: body.server_name,
          server_id: body.server_id,
          guild_id: body.server_id
      };

      //console.log(workflow);

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



