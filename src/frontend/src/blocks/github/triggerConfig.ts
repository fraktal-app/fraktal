
import { Github } from "lucide-react";

import type { InputField } from "../common/types"

export const githubInputFields: Record<string, InputField[]> = {
  github: [
    {
      key: "personalAccessToken",
      label: "Personal Access Token (PAT)",
      placeholder: "Enter your GitHub PAT with repo and issues scope",
      type: "password",
      required: true,
    },
    {
      key: "username",
      label: "GitHub Username",
      placeholder: "Enter your GitHub username",
      type: "text",
      required: true,
    },
    {
      key: "repository",
      label: "Repository Name",
      placeholder: 'e.g., "username/repo-name"',
      type: "text",
      required: true,
    },
    {
      key: "branch",
      label: "Branch",
      placeholder: "Select branch to monitor(Main/Master/Dev)",
      type: "text",
      required: true,
    }
  ]
};


export const githubTriggerEvents = 
  [
    { value: "new-issue", label: "New Issue Created", icon: Github },
    { value: "new-pr", label: "New Pull Request", icon: Github },
    { value: "pr-merged", label: "Pull Request Merged", icon: Github },
    { value: "new-commit", label: "New Commit Pushed", icon: Github },
    { value: "issue-closed", label: "Issue Closed", icon: Github },
  ];

export const githubExportEvents = {
   
}