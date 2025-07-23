import { fetchWorkflowFromDB } from "../../lib/db";
import ExecutionQueue from '../../executionQueue'
import { interpretTemplate } from "../../lib/lib";

// Sends a Telegram message using the Bot API
async function sendTelegramMessage(action: any, data: any): Promise<void> {

  const botToken = action.credentials.telegram_botToken;
  const chatId = action.credentials.telegram_chatId.isCustom ? action.credentials.telegram_chatId.text : interpretTemplate(action.credentials.telegram_chatId.text, data);
  const message = interpretTemplate(action.credentials.message, data);
 
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId || "",
      text: message || "Default Message",
    }),
  });

  const result = await response.json();

  if (!result.ok) {
    console.error('Failed to send Telegram message:', result);
  } else {
    console.log('Message sent:', result.result.text);
  }
}

export async function telegramTriggerWebhook(req, res){
    const userId = req.params.userId;
    const workflowId = req.params.workflowId;
    const msg = req.body.message;

    // Ignore non-message updates (e.g., join events)
    if (!msg || !msg.text) return res.sendStatus(200); 

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
            chat_id: msg.chat.id,
            username: msg.from.username,
            name: `${msg.from.first_name} ${msg.from.last_name}`,
            message: msg.text,
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


export async function telegramActionsHandler(action, data){
    //TODO add fail/execution logging
    switch(action.event){
        case "send_telegram_message":
            await sendTelegramMessage(
                action,
                data
            );
            break;

        default:
            console.warn(`Unknown Telegram action event: ${action.event}`);
            break;
    }
}


