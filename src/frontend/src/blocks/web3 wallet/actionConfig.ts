import { TrendingUp } from "lucide-react";
import type { InputField } from "../common/types"

export const walletInputFields: Record<string, InputField[]> = {
  
  wallet : [
  {
    key: "walletAddress",
    label: "Wallet Address",
    placeholder: "Enter wallet address (e.g., 0x...)",
    type: "text",
    required: true,
  },
  {
    key: "network",
    label: "Network",
    placeholder: "Select a network",
    type: "select",
    required: true,
    options: [
      { value: "Ethereum", label: "Ethereum" },
      { value: "Polygon", label: "Polygon" },
      { value: "BSC", label: "Binance Smart Chain" },
      { value: "Arbitrum", label: "Arbitrum" },
      { value: "Other", label: "Other" }
    ],
  }
]
}

export const walletTriggerEvents = 
  [
    { value: "get_wallet_balance", label: "Balance Above Threshold", icon: TrendingUp },
  ];

export const walletExportEvents = {
    "get_wallet_balance": [
    { value: "current_wallet_balance", label: "Current Balance", icon: TrendingUp },
  ],
}