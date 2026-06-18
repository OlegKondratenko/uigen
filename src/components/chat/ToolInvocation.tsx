"use client";

import { Loader2 } from "lucide-react";
import type { ToolInvocation as ToolInvocationType } from "ai";

interface ToolInvocationProps {
  toolInvocation: ToolInvocationType;
}

function basename(path: string): string {
  const cleaned = path.replace(/\/+$/, "");
  const parts = cleaned.split("/");
  return parts[parts.length - 1] || path;
}

export function getToolMessage(tool: ToolInvocationType): string {
  const args = (tool.args ?? {}) as Record<string, unknown>;
  const path = typeof args.path === "string" ? args.path : undefined;
  const newPath = typeof args.new_path === "string" ? args.new_path : undefined;
  const command = typeof args.command === "string" ? args.command : undefined;

  if (tool.toolName === "str_replace_editor") {
    const name = path ? basename(path) : "file";
    switch (command) {
      case "create":
        return `Creating ${name}`;
      case "str_replace":
      case "insert":
        return `Editing ${name}`;
      case "view":
        return `Viewing ${name}`;
      default:
        return `Modifying ${name}`;
    }
  }

  if (tool.toolName === "file_manager") {
    const name = path ? basename(path) : "file";
    switch (command) {
      case "rename":
        return newPath
          ? `Renaming ${name} to ${basename(newPath)}`
          : `Renaming ${name}`;
      case "delete":
        return `Deleting ${name}`;
      default:
        return `Managing ${name}`;
    }
  }

  return tool.toolName;
}

export function ToolInvocation({ toolInvocation }: ToolInvocationProps) {
  const message = getToolMessage(toolInvocation);
  const isComplete =
    toolInvocation.state === "result" && toolInvocation.result;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isComplete ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{message}</span>
    </div>
  );
}
