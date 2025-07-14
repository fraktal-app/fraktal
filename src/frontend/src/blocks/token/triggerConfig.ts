import { Coins } from "lucide-react";
import type { InputField } from "../common/types"

export const tokenInputFields: Record<string, InputField[]> = {
  
  token: [
  {
    key: "threshold",
    label: "Price Threshold",
    placeholder: "Enter price threshold (e.g., 2500)",
    type: "text",
    required: true,
  },
  {
    key: "direction",
    label: "Direction",
    placeholder: "Select direction",
    type: "select",
    required: true,
    options: [
      { value: "above", label: "Above" },
      { value: "below", label: "Below" },
    ],
  }
]
}

export const tokenTriggerEvents = 
  [
    { value: "price-threshold", label: "Token value crosses a threshold", icon: Coins }
  ];

  export const tokenExportEvents = {
   "price-threshold": [
    { value: "current-token-price", label: "Current Token Price", icon: Coins },
  ],
}