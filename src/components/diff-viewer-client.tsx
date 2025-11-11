"use client";

import { DiffToolbar } from "./diff-toolbar";
import { Col, Row } from "./layout-primitives";
import { MonacoDiffViewer } from "./monaco-diff-viewer";
import { useDiffViewOptions } from "./use-diff-view-options";

export type DiffViewerClientProps = {
  readonly original: string;
  readonly modified: string;
  readonly height?: string | number;
};

// DiffViewerClient renders the toolbar and Monaco surface for the baseline diff page.
export function DiffViewerClient({
  original,
  modified,
  height = "calc(100vh)",
}: DiffViewerClientProps) {
  const { options, actions } = useDiffViewOptions();

  return (
    <Col className="flex-1">
      <header className="border-b border-white/40 bg-white/70 px-6 py-5 backdrop-blur">
        <Row
          className="w-full"
          wrap
          align="center"
          justify="space-between"
          gap={16}
        >
          <DiffToolbar
            ignoreWhitespace={options.ignoreWhitespace}
            wordWrap={options.wordWrap}
            unified={options.unified}
            onToggleIgnoreWhitespace={actions.toggleIgnoreWhitespace}
            onToggleWordWrap={actions.toggleWordWrap}
            onToggleUnified={actions.toggleUnified}
          />
        </Row>
      </header>

      <Col className="flex-1">
        <MonacoDiffViewer
          className="h-[calc(100vh)]"
          original={original}
          modified={modified}
          ignoreWhitespace={options.ignoreWhitespace}
          wordWrap={options.wordWrap}
          unified={options.unified}
          height={height}
        />
      </Col>
    </Col>
  );
}
