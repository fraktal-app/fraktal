import { fetchWorkflowFromDB } from "../../lib/db";
import ExecutionQueue from '../../executionQueue'
import { interpretTemplate } from "../../lib/lib";

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

// Sends a Telegram message using the Bot API
async function sendDiscordMessage(action: any, data: any): Promise<void> {

  const guild_id = interpretTemplate(action.credentials.discord_guildId, data);
  const channel_id = interpretTemplate(action.credentials.discord_channelId, data);
  const message = interpretTemplate(action.credentials.discord_message, data);
 
  const response = await fetch(` https://tiger-desired-airedale.ngrok-free.app/send-message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      guild_id: guild_id || "",
      channel_id: channel_id || "",
      content: message || "Default message"
    }),
  });

  const result = await response.json();

  if (!result.success) {
    console.error('Failed to send Discord message:', result);
  } else {
    console.log('Message sent');
  }
}

export async function discordActionHandler(action: any, data: any){
    //TODO add fail/execution logging
    switch(action.event){
        case "send_discord_message":
            await sendDiscordMessage(
                action,
                data
            );
            break;

        default:
            console.warn(`Unknown Telegram action event: ${action.event}`);
            break;
    }
}



