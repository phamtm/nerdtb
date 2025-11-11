"use client";

import { Row } from "./layout-primitives";

export type DiffToolbarProps = {
  readonly ignoreWhitespace: boolean;
  readonly wordWrap: boolean;
  readonly unified: boolean;
  readonly onToggleIgnoreWhitespace: () => void;
  readonly onToggleWordWrap: () => void;
  readonly onToggleUnified: () => void;
};

const ToolbarButton = ({
  label,
  active,
  onClick,
}: {
  readonly label: string;
  readonly active: boolean;
  readonly onClick: () => void;
}) => (
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
      className={`h-2 w-2 rounded-full ${active ? "bg-sky-500" : "bg-zinc-300"}`}
    />
    {label}
  </button>
);

// DiffToolbar surfaces the toggle buttons for whitespace, wrap, and unified view
// so pages can compose them wherever they want in the layout.
export const DiffToolbar = ({
  ignoreWhitespace,
  wordWrap,
  unified,
  onToggleIgnoreWhitespace,
  onToggleWordWrap,
  onToggleUnified,
}: DiffToolbarProps) => (
  <Row wrap align="center" gap={12}>
    <ToolbarButton
      label="Ignore Whitespace"
      active={ignoreWhitespace}
      onClick={onToggleIgnoreWhitespace}
    />
    <ToolbarButton
      label="Word Wrap"
      active={wordWrap}
      onClick={onToggleWordWrap}
    />
    <ToolbarButton
      label="Unified View"
      active={unified}
      onClick={onToggleUnified}
    />
  </Row>
);
