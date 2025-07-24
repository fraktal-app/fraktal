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
  ];

export const githubExportEvents = {
  "push": [
    { value: "repo_fullname", label: "Repositry Full Name", icon: Github },
    { value: "pusher_name", label: "Pusher Name", icon: Github },
    { value: "head_commit_message", label: "Head Commit Message", icon: Github },
    { value: "head_commit_author", label: "Head Commit Author", icon: Github },
    { value: "head_commit_url", label: "Head Commit URL", icon: Github },
  ],
  "pull_request": [
    { value: "pull_request_url", label: "Pull Request URL", icon: Github },
    { value: "pull_request_title", label: "Pull Request Title", icon: Github },
    { value: "pull_request_raised_by", label: "Pull Request Raised By", icon: Github },
    { value: "pull_request_message", label: "Pull Request Message", icon: Github },
    { value: "pull_request_repo_name", label: "Repository Name", icon: Github },
    { value: "pull_request_repo_url", label: "Repository URL", icon: Github },
  ],
  "issues": [
    { value: "issue_url", label: "Issue URL", icon: Github },
    { value: "issue_title", label: "Issue Title", icon: Github },
    { value: "issue_raised_by", label: "Issue Raised By", icon: Github },
    { value: "issue_message", label: "Issue Message", icon: Github },
    { value: "issue_repo_name", label: "Repository Name", icon: Github },
    { value: "issue_repo_url", label: "Repository URL", icon: Github },
  ],
};

export default GithubOutputLink;