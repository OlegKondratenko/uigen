import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocation, getToolMessage } from "../ToolInvocation";
import type { ToolInvocation as ToolInvocationType } from "ai";

afterEach(() => {
  cleanup();
});

function makeTool(
  overrides: Partial<ToolInvocationType> = {}
): ToolInvocationType {
  return {
    toolCallId: "call-1",
    toolName: "str_replace_editor",
    args: {},
    state: "call",
    ...overrides,
  } as ToolInvocationType;
}

test("getToolMessage describes creating a file", () => {
  const tool = makeTool({
    args: { command: "create", path: "/App.jsx" },
  });
  expect(getToolMessage(tool)).toBe("Creating App.jsx");
});

test("getToolMessage describes editing a file for str_replace", () => {
  const tool = makeTool({
    args: { command: "str_replace", path: "/App.jsx" },
  });
  expect(getToolMessage(tool)).toBe("Editing App.jsx");
});

test("getToolMessage describes editing a file for insert", () => {
  const tool = makeTool({
    args: { command: "insert", path: "/App.jsx" },
  });
  expect(getToolMessage(tool)).toBe("Editing App.jsx");
});

test("getToolMessage describes viewing a file", () => {
  const tool = makeTool({
    args: { command: "view", path: "/App.jsx" },
  });
  expect(getToolMessage(tool)).toBe("Viewing App.jsx");
});

test("getToolMessage extracts the basename from a nested path", () => {
  const tool = makeTool({
    args: { command: "create", path: "/src/components/Card.jsx" },
  });
  expect(getToolMessage(tool)).toBe("Creating Card.jsx");
});

test("getToolMessage falls back to a generic verb for unknown commands", () => {
  const tool = makeTool({
    args: { command: "undo_edit", path: "/App.jsx" },
  });
  expect(getToolMessage(tool)).toBe("Modifying App.jsx");
});

test("getToolMessage describes renaming a file with a destination", () => {
  const tool = makeTool({
    toolName: "file_manager",
    args: { command: "rename", path: "/Old.jsx", new_path: "/New.jsx" },
  });
  expect(getToolMessage(tool)).toBe("Renaming Old.jsx to New.jsx");
});

test("getToolMessage describes renaming without a destination", () => {
  const tool = makeTool({
    toolName: "file_manager",
    args: { command: "rename", path: "/Old.jsx" },
  });
  expect(getToolMessage(tool)).toBe("Renaming Old.jsx");
});

test("getToolMessage describes deleting a file", () => {
  const tool = makeTool({
    toolName: "file_manager",
    args: { command: "delete", path: "/Card.jsx" },
  });
  expect(getToolMessage(tool)).toBe("Deleting Card.jsx");
});

test("getToolMessage falls back to the raw name for unknown tools", () => {
  const tool = makeTool({
    toolName: "some_other_tool",
    args: { command: "create", path: "/App.jsx" },
  });
  expect(getToolMessage(tool)).toBe("some_other_tool");
});

test("getToolMessage degrades gracefully with missing args", () => {
  const tool = makeTool({ args: {} });
  expect(getToolMessage(tool)).toBe("Modifying file");
});

test("ToolInvocation renders the friendly message", () => {
  const tool = makeTool({
    args: { command: "create", path: "/App.jsx" },
  });
  render(<ToolInvocation toolInvocation={tool} />);
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("ToolInvocation shows a completion dot when the call has a result", () => {
  const tool = makeTool({
    args: { command: "create", path: "/App.jsx" },
    state: "result",
    result: "Success",
  });
  const { container } = render(<ToolInvocation toolInvocation={tool} />);
  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("ToolInvocation shows a spinner while the call is in progress", () => {
  const tool = makeTool({
    args: { command: "create", path: "/App.jsx" },
    state: "call",
  });
  const { container } = render(<ToolInvocation toolInvocation={tool} />);
  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});
