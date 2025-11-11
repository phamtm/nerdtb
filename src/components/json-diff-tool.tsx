"use client";

import { useState } from "react";
import { normalizeJsonText } from "../lib/json-normalize";
import { Col, Row } from "./layout-primitives";

type JsonDiffToolProps = {
  readonly initialOriginal: string;
  readonly initialModified: string;
  readonly onUpdate: (payload: { original: string; modified: string }) => void;
};

const PanelLabel = ({ title }: { readonly title: string }) => (
  <p className="text-sm font-semibold uppercase tracking-widest text-[#7e89a5]">
    {title}
  </p>
);

const ErrorText = ({ message }: { readonly message: string }) => (
  <p className="text-xs font-medium text-rose-500">{message}</p>
);

export function JsonDiffTool({
  initialOriginal,
  initialModified,
  onUpdate,
}: JsonDiffToolProps) {
  const [leftRaw, setLeftRaw] = useState(initialOriginal);
  const [rightRaw, setRightRaw] = useState(initialModified);
  const [leftError, setLeftError] = useState<string | null>(null);
  const [rightError, setRightError] = useState<string | null>(null);

  const normalizeInputs = () => {
    const leftResult = normalizeJsonText(leftRaw);
    const rightResult = normalizeJsonText(rightRaw);

    setLeftError(leftResult.error ?? null);
    setRightError(rightResult.error ?? null);

    const nextLeft = leftResult.formatted ?? leftRaw;
    const nextRight = rightResult.formatted ?? rightRaw;

    if (!leftResult.error) {
      setLeftRaw(nextLeft);
    }

    if (!rightResult.error) {
      setRightRaw(nextRight);
    }

    if (!leftResult.error && !rightResult.error) {
      onUpdate({ original: nextLeft, modified: nextRight });
    }
  };

  return (
    <Col
      className="rounded-2xl border border-white/40 bg-white/80 p-4 shadow-xl"
      gap={16}
    >
      <Row gap={16} wrap fullWidth align="stretch">
        <Col className="flex-1" gap={8}>
          <PanelLabel title="Original JSON" />
          <textarea
            value={leftRaw}
            onChange={(event) => setLeftRaw(event.target.value)}
            className="h-48 w-full rounded-xl border border-[#c4d2f5] bg-white/90 p-4 font-mono text-xs text-[#0f1534] shadow-inner focus:border-[#4f9fff] focus:outline-none"
            spellCheck={false}
            placeholder="Paste JSON here"
            // Browser extensions inject extra attributes client-side;
            // suppressHydrationWarning prevents noisy mismatches for these fields.
            suppressHydrationWarning
          />
          {leftError ? <ErrorText message={leftError} /> : null}
        </Col>
        <Col className="flex-1" gap={8}>
          <PanelLabel title="Modified JSON" />
          <textarea
            value={rightRaw}
            onChange={(event) => setRightRaw(event.target.value)}
            className="h-48 w-full rounded-xl border border-[#c4d2f5] bg-white/90 p-4 font-mono text-xs text-[#0f1534] shadow-inner focus:border-[#4f9fff] focus:outline-none"
            spellCheck={false}
            placeholder="Paste JSON here"
            suppressHydrationWarning
          />
          {rightError ? <ErrorText message={rightError} /> : null}
        </Col>
      </Row>

      <Row justify="space-between" align="center">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#7f8db3]">
          Sort recursively • Pretty print • Array aware
        </p>
        <button
          type="button"
          onClick={normalizeInputs}
          className="rounded-full bg-[#0f76da] px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_10px_25px_rgba(15,118,218,0.35)] transition hover:bg-[#0f6cc4]"
        >
          Sort & Diff
        </button>
      </Row>
    </Col>
  );
}
