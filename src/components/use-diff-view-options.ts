"use client";

import { useMemo, useState } from "react";

export type DiffViewOptions = {
  readonly ignoreWhitespace: boolean;
  readonly wordWrap: boolean;
  readonly unified: boolean;
};

export const useDiffViewOptions = () => {
  const [options, setOptions] = useState<DiffViewOptions>({
    ignoreWhitespace: true,
    wordWrap: true,
    unified: false,
  });

  const actions = useMemo(
    () => ({
      toggleIgnoreWhitespace: () =>
        setOptions((current) => ({
          ...current,
          ignoreWhitespace: !current.ignoreWhitespace,
        })),
      toggleWordWrap: () =>
        setOptions((current) => ({
          ...current,
          wordWrap: !current.wordWrap,
        })),
      toggleUnified: () =>
        setOptions((current) => ({
          ...current,
          unified: !current.unified,
        })),
    }),
    [],
  );

  return { options, actions };
};
