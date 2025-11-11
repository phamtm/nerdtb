"use client";

import type { DiffEditorProps } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import dynamic from "next/dynamic";
import { useMemo } from "react";

import { ensureDiffMonaco } from "@/lib/monaco/diff-only-loader";

const DiffEditor = dynamic(
  async () => {
    await ensureDiffMonaco();
    return import("@monaco-editor/react").then((mod) => mod.DiffEditor);
  },
  { ssr: false },
);

export type MonacoDiffViewerProps = {
  readonly original: string;
  readonly modified: string;
  readonly ignoreWhitespace: boolean;
  readonly wordWrap: boolean;
  readonly unified: boolean;
  readonly className?: string;
  readonly height?: string | number;
};

// MonacoDiffViewer wraps the Monaco diff editor so the page can toggle layout
// options without duplicating editor wiring.
export function MonacoDiffViewer({
  original,
  modified,
  ignoreWhitespace,
  wordWrap,
  unified,
  className,
  height = "calc(100vh)",
}: MonacoDiffViewerProps) {
  const diffOptions = useMemo<editor.IDiffEditorConstructionOptions>(
    () => ({
      automaticLayout: true,
      fontFamily:
        'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace, Menlo, Monaco, "Courier New", monospace',
      fontSize: 12,
      guides: {
        indentation: false,
        highlightActiveIndentation: false,
      },
      ignoreTrimWhitespace: ignoreWhitespace,
      minimap: { enabled: false },
      overviewRulerBorder: false,
      overviewRulerLanes: 0,
      renderGutterMenu: false,
      renderOverviewRuler: false,
      originalEditable: true,
      renderSideBySide: !unified,
      scrollBeyondLastLine: false,
      wordWrap: wordWrap ? "on" : "off",
    }),
    [ignoreWhitespace, unified, wordWrap],
  );

  const handleMount: DiffEditorProps["onMount"] = (_, monacoInstance) => {
    monacoInstance.editor.defineTheme("diffview", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#f7f9fc",
        "editorLineNumber.foreground": "#8b90a6",
        "editorLineNumber.activeForeground": "#4d5468",
        "editorLineNumber.dimmedForeground": "#bcc2d6",
        "diffEditor.insertedLineBackground": "#c2f1d999",
        "diffEditor.removedLineBackground": "#ffe8e566",
        "diffEditor.insertedTextBackground": "#94e2bfcc",
        "diffEditor.removedTextBackground": "#ffbbc680",
        "scrollbarSlider.background": "#c5cad880",
        "scrollbarSlider.hoverBackground": "#aab1c880",
      },
    });
    monacoInstance.editor.setTheme("diffview");
  };

  return (
    <div className={`h-full w-full ${className ?? ""}`}>
      <DiffEditor
        original={original}
        modified={modified}
        language="json"
        theme="diffview"
        options={diffOptions}
        onMount={handleMount}
        height={height}
        width="100%"
        loading={
          <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500">
            Loading diff…
          </div>
        }
      />
    </div>
  );
}
