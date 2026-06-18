import { test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MainContent } from "@/app/main-content";

// Mock the providers so MainContent can render without real contexts
vi.mock("@/lib/contexts/file-system-context", () => ({
  FileSystemProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useFileSystem: () => ({}),
}));

vi.mock("@/lib/contexts/chat-context", () => ({
  ChatProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useChat: () => ({}),
}));

// Mock the heavy leaf components with simple markers so we can assert
// which view is currently rendered.
vi.mock("@/components/chat/ChatInterface", () => ({
  ChatInterface: () => <div>ChatInterface</div>,
}));

vi.mock("@/components/editor/FileTree", () => ({
  FileTree: () => <div>FileTreeMarker</div>,
}));

vi.mock("@/components/editor/CodeEditor", () => ({
  CodeEditor: () => <div>CodeEditorMarker</div>,
}));

vi.mock("@/components/preview/PreviewFrame", () => ({
  PreviewFrame: () => <div>PreviewFrameMarker</div>,
}));

vi.mock("@/components/HeaderActions", () => ({
  HeaderActions: () => <div>HeaderActions</div>,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

test("renders the Preview view by default", () => {
  render(<MainContent />);

  expect(screen.getByText("PreviewFrameMarker")).toBeDefined();
  expect(screen.queryByText("CodeEditorMarker")).toBeNull();
});

test("clicking the Code tab toggles to the code view", async () => {
  const user = userEvent.setup();
  render(<MainContent />);

  await user.click(screen.getByRole("tab", { name: "Code" }));

  expect(screen.getByText("CodeEditorMarker")).toBeDefined();
  expect(screen.getByText("FileTreeMarker")).toBeDefined();
  expect(screen.queryByText("PreviewFrameMarker")).toBeNull();
});

test("clicking the Preview tab toggles back to the preview view", async () => {
  const user = userEvent.setup();
  render(<MainContent />);

  // Switch to code first...
  await user.click(screen.getByRole("tab", { name: "Code" }));
  expect(screen.getByText("CodeEditorMarker")).toBeDefined();

  // ...then back to preview.
  await user.click(screen.getByRole("tab", { name: "Preview" }));

  expect(screen.getByText("PreviewFrameMarker")).toBeDefined();
  expect(screen.queryByText("CodeEditorMarker")).toBeNull();
});

test("the active tab reflects the selected view", async () => {
  const user = userEvent.setup();
  render(<MainContent />);

  const previewTab = screen.getByRole("tab", { name: "Preview" });
  const codeTab = screen.getByRole("tab", { name: "Code" });

  expect(previewTab.getAttribute("data-state")).toBe("active");
  expect(codeTab.getAttribute("data-state")).toBe("inactive");

  await user.click(codeTab);

  expect(codeTab.getAttribute("data-state")).toBe("active");
  expect(previewTab.getAttribute("data-state")).toBe("inactive");
});
