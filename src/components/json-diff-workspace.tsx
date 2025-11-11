"use client";

import { useState } from "react";
import { DiffToolbar } from "./diff-toolbar";
import { JsonDiffTool } from "./json-diff-tool";
import { Col, Row } from "./layout-primitives";
import { MonacoDiffViewer } from "./monaco-diff-viewer";
import { useDiffViewOptions } from "./use-diff-view-options";

export type JsonDiffWorkspaceProps = {
  readonly initialOriginal: string;
  readonly initialModified: string;
};

// JsonDiffWorkspace wires the JSON normalization form to the diff viewer while
// keeping the toolbar controls local to the client island.
export function JsonDiffWorkspace({
  initialOriginal,
  initialModified,
}: JsonDiffWorkspaceProps) {
  const { options, actions } = useDiffViewOptions();
  const [payload, setPayload] = useState({
    original: initialOriginal,
    modified: initialModified,
  });

  return (
    <Col className="flex-1" fullWidth>
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

      <Col className="flex-1 gap-6 px-6 py-6">
        <JsonDiffTool
          initialOriginal={initialOriginal}
          initialModified={initialModified}
          onUpdate={setPayload}
        />
        <div className="flex-1 rounded-2xl border border-white/40 bg-white/70 p-3 shadow-inner">
          <MonacoDiffViewer
            className="h-full"
            original={payload.original}
            modified={payload.modified}
            ignoreWhitespace={options.ignoreWhitespace}
            wordWrap={options.wordWrap}
            unified={options.unified}
            height="70vh"
          />
        </div>
      </Col>
    </Col>
  );
}
