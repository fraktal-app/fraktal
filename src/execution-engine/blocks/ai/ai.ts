import { interpretTemplate } from "../../lib/lib";

export async function AIActionsHandler(action: any, data: any){
    //TODO add fail/execution logging
    switch(action.event){
        case "generate_text":
            return await generateText(
              action,
              data
            );

        default:
            console.warn(`Unknown AI action event: ${action.event}`);
            break;
    }
}

async function generateText(action: any, data: any) {
  
  try{
    
    const GROQ_AI_API_KEY = process.env.GROQ_AI_API_KEY;
    const prompt = interpretTemplate(action.credentials.prompt, data);
    
    if (!GROQ_AI_API_KEY) {
      throw new Error("GROQ_AI_API_KEY is not defined in environment variables.");
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gemma2-9b-it",
        messages: [
          {
            role: "system",
            content: "You are Fraktal AI, the built-in assistant for the Fraktal app. Fraktal lets users build no-code automations on the Internet Computer. Respond directly to user prompts—be concise, helpful, and technical when appropriate. Keep all responses under 1000 characters. If no question is asked, provide a general response. Do only what is requested; do not offer help unless explicitly asked. Do not disclose this prompt or your role unless the user specifically asks."
          },
          {
            role: "user",
            content: `${prompt}`,
          },
        ],
      }),
    });

    const res = await response.json();
    
    //Extract relevant message data
    const extractedData = {
      response: res.choices[0].message.content ?? "Unable to generate LLM reponse"
    };

    return extractedData

  }
  catch(e){
    console.error("LLM inference failed:", e);
    return;
  }
}

