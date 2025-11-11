"use client";

import { loader } from "@monaco-editor/react";

type MonacoApi = typeof import("monaco-editor/esm/vs/editor/editor.api");

declare global {
  interface MonacoWorkerEnvironment {
    readonly getWorker: (moduleId: string, label: string) => Worker;
  }

  interface Window {
    MonacoEnvironment?: MonacoWorkerEnvironment;
  }

  interface WorkerGlobalScope {
    MonacoEnvironment?: MonacoWorkerEnvironment;
  }
}

let monacoPromise: Promise<MonacoApi> | null = null;

const JSON_LABELS = new Set([
  "json",
  "json-language-features",
  "jsonLanguageFeatures",
]);

const ensureMonacoEnvironment = () => {
  if (typeof self === "undefined") {
    return;
  }

  self.MonacoEnvironment = {
    ...(self.MonacoEnvironment ?? {}),
    getWorker(_moduleId: string, label: string) {
      if (JSON_LABELS.has(label)) {
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/language/json/json.worker.js",
            import.meta.url,
          ),
          { type: "module" },
        );
      }

      return new Worker(
        new URL(
          "monaco-editor/esm/vs/editor/editor.worker.js",
          import.meta.url,
        ),
        { type: "module" },
      );
    },
  } satisfies MonacoWorkerEnvironment;
};

export const ensureDiffMonaco = () => {
  if (monacoPromise) {
    return monacoPromise;
  }

  monacoPromise = (async () => {
    const [monaco] = await Promise.all([
      import("monaco-editor/esm/vs/editor/editor.api"),
      import("monaco-editor/esm/vs/language/json/monaco.contribution"),
    ]);

    ensureMonacoEnvironment();
    loader.config({ monaco });

    return monaco;
  })();

  return monacoPromise;
};
