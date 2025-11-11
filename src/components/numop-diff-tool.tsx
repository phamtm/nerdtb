"use client";

import { useState } from "react";
import { parseNumopSource } from "../lib/numop-diff";
import { Col } from "./layout-primitives";

type NumopDiffToolProps = {
  readonly initialSource: string;
  readonly onUpdate: (payload: { original: string; modified: string }) => void;
};

const PanelLabel = () => (
  <p className="text-sm font-semibold uppercase tracking-widest text-[#7e89a5]">
    Paste combined payload
  </p>
);

const ErrorText = ({ message }: { readonly message: string }) => (
  <p className="text-xs font-medium text-rose-500">{message}</p>
);

// NumopDiffTool normalizes a single JSON payload containing `legacy` and `modern`
// objects and feeds the extracted strings into the diff viewer.
export function NumopDiffTool({ initialSource, onUpdate }: NumopDiffToolProps) {
  const [rawSource, setRawSource] = useState(initialSource);
  const [error, setError] = useState<string | null>(null);

  const handleNormalize = () => {
    const result = parseNumopSource(rawSource);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setError(null);
    setRawSource(result.formattedSource);
    onUpdate(result.sides);
  };

  return (
    <Col
      className="rounded-2xl border border-white/40 bg-white/80 p-4 shadow-xl"
      gap={12}
    >
      <PanelLabel />
      <textarea
        value={rawSource}
        onChange={(event) => setRawSource(event.target.value)}
        className="h-48 w-full rounded-xl border border-[#c4d2f5] bg-white/90 p-4 font-mono text-xs text-[#0f1534] shadow-inner focus:border-[#4f9fff] focus:outline-none"
        spellCheck={false}
        placeholder='{"legacy": {...}, "modern": {...}}'
        suppressHydrationWarning
      />
      {error ? <ErrorText message={error} /> : null}
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#7f8db3]">
          Sort recursively • Validate keys • Pretty print
        </p>
        <button
          type="button"
          onClick={handleNormalize}
          className="rounded-full bg-[#0f76da] px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_10px_25px_rgba(15,118,218,0.35)] transition hover:bg-[#0f6cc4]"
        >
          Normalize & Diff
        </button>
      </div>
    </Col>
  );
}
