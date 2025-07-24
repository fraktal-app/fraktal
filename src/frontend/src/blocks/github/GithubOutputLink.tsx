// src/components/github/GithubOutputLink.tsx
import { useState } from "react";
import { Copy, Check } from "lucide-react";

function generateGithubWebhookLink(userId: string, workflowId: string): string {
  const executionEngineURL = import.meta.env.VITE_EXECUTION_ENGINE_URL || "http://localhost:3001"; // Fallback for local dev
  return `${executionEngineURL}/webhook/github/${userId}/${workflowId}/`;
}

export function GithubOutputLink({
  userId,
  workflowId,
}: {
  userId: string;
  workflowId: string;
}) {
  const [copied, setCopied] = useState(false);
  const webhookUrl = generateGithubWebhookLink(userId, workflowId);

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
    });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#c5c5d2]">Webhook URL</label>
      <p className="text-xs text-[#9b9bab]">
        Use this URL in your GitHub repository's webhook settings.
      </p>
      <div className="relative flex items-center mt-2">
        {/* Replaced 'truncate' with 'break-all' to allow wrapping */}
        <div className="w-full select-all break-all pl-3 pr-10 py-2 bg-[#2a2e3f] text-sm border border-[#3a3f52] rounded-md text-gray-400">
          {webhookUrl}
        </div>
        <button
          onClick={handleCopy}
          className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-[#9b9bab] hover:text-white"
          aria-label="Copy webhook URL"
        >
          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export default GithubOutputLink;