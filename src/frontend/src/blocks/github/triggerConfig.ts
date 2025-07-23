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
    { value: "repo_fullname", label: "Repositry Full Name", icon: Github },
    { value: "pusher_name", label: "Pusher Name", icon: Github },
    { value: "head_commit_message", label: "Head Commit Message", icon: Github },
    { value: "head_commit_author", label: "Head Commit Author", icon: Github },
    { value: "head_commit_url", label: "Head Commit Url", icon: Github },
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