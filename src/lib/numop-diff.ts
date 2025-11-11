import { normalizeJsonText } from "./json-normalize";

export type NumopDiffSides = {
  readonly original: string;
  readonly modified: string;
};

type FormatResult = { readonly formatted: string } | { readonly error: string };
type ExtractResult = { readonly sides: NumopDiffSides } | { readonly error: string };
type ParseResult =
  | { readonly ok: true; readonly formattedSource: string; readonly sides: NumopDiffSides }
  | { readonly ok: false; readonly error: string };

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const formatObject = (value: Record<string, unknown>): FormatResult => {
  const normalized = normalizeJsonText(JSON.stringify(value));
  if (normalized.error) {
    return { error: normalized.error };
  }

  return { formatted: normalized.formatted ?? "" };
};

export const extractNumopSides = (value: unknown): ExtractResult => {
  if (!isPlainObject(value)) {
    return { error: "Provide a JSON object with modern and legacy keys" };
  }

  if (!isPlainObject(value.modern)) {
    return { error: "modern must be a JSON object" };
  }

  if (!isPlainObject(value.legacy)) {
    return { error: "legacy must be a JSON object" };
  }

  const modernResult = formatObject(value.modern);
  if ("error" in modernResult) {
    return { error: modernResult.error };
  }

  const legacyResult = formatObject(value.legacy);
  if ("error" in legacyResult) {
    return { error: legacyResult.error };
  }

  return {
    sides: {
      original: legacyResult.formatted,
      modified: modernResult.formatted,
    },
  };
};

export const parseNumopSource = (input: string): ParseResult => {
  if (!input.trim()) {
    return { ok: false, error: "Provide a JSON object with modern and legacy keys" };
  }

  const normalized = normalizeJsonText(input);
  if (normalized.error) {
    return { ok: false, error: normalized.error };
  }

  const formattedSource = normalized.formatted ?? "";
  if (!formattedSource) {
    return { ok: false, error: "Unable to normalize JSON input" };
  }

  const parsed = JSON.parse(formattedSource) as unknown;
  const extracted = extractNumopSides(parsed);
  if ("error" in extracted) {
    return { ok: false, error: extracted.error };
  }

  return { ok: true, formattedSource, sides: extracted.sides };
};
