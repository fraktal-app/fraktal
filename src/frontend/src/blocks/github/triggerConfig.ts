import { Github } from "lucide-react";
import type { InputField } from "../common/types";
import GithubOutputLink from "./GithubOutputLink";

export const githubInputFields: Record<string, InputField[]> = {
  github: [

  ]
};

export const githubTriggerEvents = 
  [
    { value: "push", label: "New Commit Pushed", icon: Github, requiresLinkName: true },
    { value: "pull_request", label: "New Pull Request", icon: Github, requiresLinkName: true },
    { value: "issues", label: "New Issue Created", icon: Github, requiresLinkName: true },
    { value: "member", label: "New Member", icon: Github, requiresLinkName: true },
  ];

export const githubExportEvents = {
  "push": [
    { value: "message", label: "Message", icon: Github },
  ],
  "pull_request": [
    { value: "message", label: "Message", icon: Github },
  ],
  "issues": [
    { value: "message", label: "Message", icon: Github },
  ],
  "member": [
    { value: "message", label: "Message", icon: Github },
  ],
};

export default GithubOutputLink;