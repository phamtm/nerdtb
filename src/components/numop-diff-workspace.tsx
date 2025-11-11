"use client";

import { useMemo, useState } from "react";
import { parseNumopSource } from "../lib/numop-diff";
import { DiffToolbar } from "./diff-toolbar";
import { Col, Row } from "./layout-primitives";
import { MonacoDiffViewer } from "./monaco-diff-viewer";
import { NumopDiffTool } from "./numop-diff-tool";
import { useDiffViewOptions } from "./use-diff-view-options";

type NumopDiffWorkspaceProps = {
  readonly initialSource: string;
};

const defaultSides = { original: "", modified: "" };

// NumopDiffWorkspace couples the combined JSON input with the Monaco diff view
// while reusing the existing toolbar controls for layout tweaks.
export function NumopDiffWorkspace({ initialSource }: NumopDiffWorkspaceProps) {
  const { options, actions } = useDiffViewOptions();
  const parsed = useMemo(() => parseNumopSource(initialSource), [initialSource]);
  const startingSource = parsed.ok ? parsed.formattedSource : initialSource;
  const initialSides = parsed.ok ? parsed.sides : defaultSides;
  const [payload, setPayload] = useState(initialSides);

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
        <NumopDiffTool initialSource={startingSource} onUpdate={setPayload} />
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
