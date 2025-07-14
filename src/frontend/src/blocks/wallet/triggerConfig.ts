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
    { value: "balance-above-threshold", label: "Balance Above Threshold", icon: TrendingUp },
    { value: "balance-below-threshold", label: "Balance Below Threshold", icon: TrendingUp },
    { value: "new-transaction", label: "New Transaction", icon: TrendingUp },
  ];

export const walletExportEvents = {
    "balance-above-threshold": [
    { value: "current-balance", label: "Current Balance", icon: TrendingUp },
    { value: "balance-change", label: "Change in Balance", icon: TrendingUp },
    { value: "everything", label: "Everything", icon: TrendingUp },
  ],
  "balance-below-threshold": [
    { value: "current-balance", label: "Current Balance", icon: TrendingUp },
    { value: "balance-change", label: "Change in Balance", icon: TrendingUp },
    { value: "everything", label: "Everything", icon: TrendingUp },
  ],
  "new-transaction": [
    { value: "current-balance", label: "Current Balance", icon: TrendingUp },
    { value: "transaction-detail", label: "Transaction Detail", icon: TrendingUp },
    { value: "everything", label: "Everything", icon: TrendingUp },
  ],
}