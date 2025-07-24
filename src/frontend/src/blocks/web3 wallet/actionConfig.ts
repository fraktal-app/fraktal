import { TrendingUp } from "lucide-react";
import type { InputField } from "../common/types"

export const web3WalletResponseDropdownOptions = 
  [
    { value: "get_wallet_balance", label: "Get wallet balance", icon: TrendingUp },
  ];

export const web3WalletActionInputFields: Record<string, InputField[]> = {
  web3Wallet : [
  {
    key: "walletAddress",
    label: "Wallet Address",
    placeholder: "Enter wallet address (e.g., 0x...)",
    type: "text",
    required: true,
  },
  {
    key: "blockchainNetwork",
    label: "Blockchain Network",
    placeholder: "Select a network",
    type: "select",
    required: true,
    options: [
      { value: "ETH", label: "Ethereum (ETH)" },
      { value: "SOL", label: "Solana (SOL)" },
      { value: "BTC", label: "Bitcoin (BTC)" },
    ],
  }
]
}


export const web3WalletExportEvents = {
    "get_wallet_balance": [
    { value: "current_wallet_balance", label: "Current Balance", icon: TrendingUp },
  ],
}