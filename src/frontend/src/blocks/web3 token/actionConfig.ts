import { MessageSquare } from "lucide-react";
import type { InputField } from "../common/types";

export const web3TokenResponseDropdownOptions = 
   [  
  { value: "get_token_price", label: "Get token price", icon: MessageSquare },
  //{ value: "send_alert", label: "Send alert" },
  //{ value: "pin_message", label: "Pin message" },
];


export const web3TokenActionInputFields: Record<string, InputField[]> = {
  
    web3Token: [
      {
        key: "token",
        label: "Select Token",
        placeholder: "Select a token",
        type: "select",
        required: true,
        options: [
          { value: "ETH", label: "Ethereum (ETH)" },
          { value: "SOL", label: "Solana (SOL)" },
          { value: "BTC", label: "Bitcoin (BTC)" },
          { value: "ICP", label: "Internet Computer (ICP)" },
          { value: "USDC", label: "USD Coin (USDC)" },
          { value: "USDT", label: "Tether (USDT)" },
        ],
      },
      
    ]
};

export const web3TokenExportEvents = {
  "get_token_price": [
    { value: "token_price", label: "Token price", icon: MessageSquare },
  ],
}