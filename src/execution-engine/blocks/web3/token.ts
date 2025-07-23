import ExecutionQueue from '../../executionQueue'
import { interpretTemplate } from "../../lib/lib";

// Sends a Telegram message using the Bot API
async function getTokenPrice(action: any, data: any){

  const COIN_CAP_API_KEY = process.env.COIN_CAP_API_KEY;

  if (!COIN_CAP_API_KEY) {
      throw new Error("COIN_CAP_API_KEY is not defined in environment variables.");
  }
  const token = interpretTemplate(action.credentials.token, data) || ""; 

  try {
    const response = await fetch(`https://rest.coincap.io/v3/assets?search=${token}&limit=1&offset=0`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${COIN_CAP_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    //Extract relevant message data
    const extractedData = {
      symbol: data.data[0].symbol,
      token_price: parseFloat(data.data[0].priceUsd).toFixed(2).toString(),
      change_in_24_hrs: parseFloat(data.data[0].changePercent24Hr).toFixed(2).toString()
    };

    return extractedData;

  } catch (error) {
    console.error('Error fetching Token data:', error);
  }
}


export async function tokenActionsHandler(action, data){
    //TODO add fail/execution logging
    switch(action.event){
        case "get_token_price":
            return await getTokenPrice(
                action,
                data
            );
            break;

        default:
            console.warn(`Unknown Web3 Token action event: ${action.event}`);
            break;
    }
}


