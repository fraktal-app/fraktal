import { Github, MessageSquare } from "lucide-react";
import type { InputField } from "../common/types"

export const githubInputFields: Record<string, InputField[]> = {
  
  github: [
  {
    key: "personalAccessToken",
    label: "Personal Access Token (PAT)",
    placeholder: "Enter your GitHub PAT with repo scope",
    type: "password",
    required: true,
  }
]
}

export const githubTriggerEvents = 
  [
    { value: "new-issue", label: "New Issue Created", icon: Github },
    { value: "new-pr", label: "New Pull Request", icon: Github },
    { value: "pr-merged", label: "Pull Request Merged", icon: Github },
    { value: "new-commit", label: "New Commit Pushed", icon: Github },
    { value: "issue-closed", label: "Issue Closed", icon: Github },
  ];

  export const githubExportEvents = {
   "new-message": [
    { value: "messenger-detail", label: "Messenger Detail", icon: MessageSquare },
    { value: "message-content", label: "Message Content", icon: MessageSquare },
    { value: "everything", label: "Everything", icon: MessageSquare },
  ],
  "mention-received": [
    { value: "messenger-detail", label: "Messenger Detail", icon: MessageSquare },
    { value: "command", label: "Command", icon: MessageSquare },
    { value: "everything", label: "Everything", icon: MessageSquare },
  ],
}