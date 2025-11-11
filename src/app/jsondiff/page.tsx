"use client";

import { useMemo, useState } from "react";
import { MonacoDiffViewer } from "../../components/monaco-diff-viewer";
import { Col, Row } from "../../components/layout-primitives";
import { JsonDiffTool } from "../../components/json-diff-tool";
import { normalizeJsonText } from "../../lib/json-normalize";

type ToggleButtonProps = {
  readonly label: string;
  readonly active: boolean;
  readonly onClick: () => void;
};

const originalJson = `{
  "network": "mainnet",
  "accounts": [
    {
      "id": "alpha",
      "roles": ["admin", "engineer"],
      "limits": {
        "daily": 1000,
        "monthly": 6000
      }
    },
    {
      "id": "beta",
      "roles": ["viewer"],
      "limits": {
        "daily": 200,
        "monthly": 1000
      }
    }
  ],
  "status": "active",
  "feature_flags": ["rollout_a", "rollout_b"]
}`;

const modifiedJson = `{
  "status": "active",
  "network": "mainnet",
  "feature_flags": ["rollout_b", "rollout_c"],
  "accounts": [
    {
      "id": "beta",
      "roles": ["viewer"],
      "limits": {
        "daily": 300,
        "monthly": 1300
      }
    },
    {
      "id": "alpha",
      "roles": ["engineer", "admin"],
      "limits": {
        "daily": 1100,
        "monthly": 6200
      }
    }
  ]
}`;

function ToolbarButton({ label, active, onClick }: ToggleButtonProps) {
  return (
    <button
      type="button"
      className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all ${
        active
          ? "border-[#0f9bf5] bg-white text-[#0f76da] shadow-[0_8px_20px_rgba(78,160,255,0.25)]"
          : "border-[#cbd6ef] bg-white text-[#7e89a5] hover:border-[#7fbefc] hover:text-[#0f76da]"
      }`}
      aria-pressed={active}
      onClick={onClick}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          active ? "bg-sky-500" : "bg-zinc-300"
        }`}
      />
      {label}
    </button>
  );
}

const normalizedOriginal =
  normalizeJsonText(originalJson).formatted ?? originalJson;
const normalizedModified =
  normalizeJsonText(modifiedJson).formatted ?? modifiedJson;

export default function JsonDiffPage() {
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [unified, setUnified] = useState(false);
  const [diffPayload, setDiffPayload] = useState({
    original: normalizedOriginal,
    modified: normalizedModified,
  });

  const toolbarConfig = useMemo(
    () => [
      {
        label: "Ignore Whitespace",
        active: ignoreWhitespace,
        onClick: () => setIgnoreWhitespace(!ignoreWhitespace),
      },
      {
        label: "Word Wrap",
        active: wordWrap,
        onClick: () => setWordWrap(!wordWrap),
      },
      {
        label: "Unified View",
        active: unified,
        onClick: () => setUnified(!unified),
      },
    ],
    [ignoreWhitespace, unified, wordWrap],
  );

  return (
    <Col className="min-h-screen bg-[#dfe8ff] text-[#4a5676]" fullWidth>
      <header className="border-b border-white/40 bg-white/70 px-6 py-5 backdrop-blur">
        <Row
          className="w-full"
          wrap
          align="center"
          justify="space-between"
          gap={16}
        >
          <Row wrap align="center" gap={12}>
            {toolbarConfig.map((button) => (
              <ToolbarButton key={button.label} {...button} />
            ))}
          </Row>
        </Row>
      </header>

      <Col className="flex-1 gap-6 px-6 py-6">
        <JsonDiffTool
          initialOriginal={normalizedOriginal}
          initialModified={normalizedModified}
          onUpdate={setDiffPayload}
        />
        <div className="flex-1 rounded-2xl border border-white/40 bg-white/70 p-3 shadow-inner">
          <MonacoDiffViewer
            className="h-full"
            original={diffPayload.original}
            modified={diffPayload.modified}
            ignoreWhitespace={ignoreWhitespace}
            wordWrap={wordWrap}
            unified={unified}
            height="70vh"
          />
        </div>
      </Col>
    </Col>
  );
}
