import { fetchWorkflowFromDB } from "../../lib/db";
import ExecutionQueue from '../../executionQueue'

// Sends a Telegram message using the Bot API
async function sendTelegramMessage(botToken: string, chatId: string | number, text: string): Promise<void> {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text || "Default Message",
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
        const res = await fetchWorkflowFromDB(userId, workflowId);
        let workflow = res;

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
            user_id: msg.from.id,
            username: msg.from.username,
            name: `${msg.from.first_name} ${msg.from.last_name}`,
            message: msg.text,
            timestamp: msg.date,
        };

        //Add message data to workflow
        workflow.data = {
            ...(workflow.data || {}),
            "telegram-trigger" : extractedData
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


export async function telegramActionsHandler(action){
    //TODO add fail/execution logging
    switch(action.event){
        case "send_message":
            await sendTelegramMessage(
                action.credentials.botToken,
                action.credentials.chatId,
                action.credentials.message
            );
            break;

        default:
            console.warn(`Unknown Telegram action event: ${action.event}`);
            break;
    }
}


