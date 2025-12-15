import type { Abi, AbiFunction, AbiParameter, Hex } from "viem";
import { decodeFunctionData, toFunctionSelector } from "viem";

const bigintReplacer = (_: string, value: unknown) =>
  typeof value === "bigint" ? value.toString() : value;

const normalizeHex = (value: string): Hex => {
  if (!value) {
    throw new Error("Call data is required");
  }
  const prefixed = value.startsWith("0x") ? value : `0x${value}`;
  if (prefixed.length < 10) {
    throw new Error("Call data must include a 4-byte selector and arguments");
  }
  if (prefixed.length % 2 !== 0) {
    throw new Error("Call data hex length must be even");
  }
  return prefixed as Hex;
};

const parseAbiJson = (abiJson: string): Abi => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(abiJson);
  } catch (error) {
    throw new Error(
      `Unable to parse ABI JSON: ${
        error instanceof Error ? error.message : "unknown error"
      }`,
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error("ABI JSON should be an array of entries");
  }

  return parsed as Abi;
};

const cleanValue = (value: unknown): unknown => {
  if (typeof value === "bigint") {
    return value.toString(10);
  }
  if (Array.isArray(value)) {
    return value.map(cleanValue);
  }
  if (value && typeof value === "object") {
    return JSON.parse(JSON.stringify(value, bigintReplacer));
  }
  return value;
};

// Captures a single decoded argument with its ABI name, type, and rendered value.
export type DecodedParam = {
  readonly name: string;
  readonly type: string;
  readonly displayType?: string;
  readonly value: unknown;
  readonly displayValue?: string;
};

// Describes a decoded calldata argument after applying the ABI schema.
export type DecodedCall = {
  readonly selector: string;
  readonly signature: string;
  readonly functionName: string;
  readonly params: DecodedParam[];
};

const readableParamType = (param: AbiParameter): string => {
  if (param.internalType) {
    return param.internalType;
  }

  if (param.type.startsWith("tuple")) {
    const components =
      (param as { components?: AbiParameter[] }).components ?? [];
    const renderedComponents = components
      .map(
        (component) =>
          `${component.name || "field"}:${readableParamType(component)}`,
      )
      .join(", ");
    return `tuple(${renderedComponents})`;
  }

  return param.type;
};

const formatFunctionSignature = (fn: AbiFunction): string => {
  const inputs = fn.inputs?.map(readableParamType).join(", ") ?? "";
  return `${fn.name}(${inputs})`;
};

export type EnumRegistry = Record<string, string[]>;

const applyEnumLabels = (
  param: AbiParameter,
  value: unknown,
  enums?: EnumRegistry,
): unknown => {
  // Handle arrays by stripping trailing [] from the type and recursing.
  if (param.type.endsWith("[]") && Array.isArray(value)) {
    const baseType = param.type.slice(0, -2);
    const baseParam: AbiParameter = {
      ...param,
      type: baseType,
    };
    return value.map((item) => applyEnumLabels(baseParam, item, enums));
  }

  // Handle tuples/structs by mapping components.
  if (param.type.startsWith("tuple")) {
    const components = (param as { components?: AbiParameter[] }).components;
    if (components) {
      if (Array.isArray(value)) {
        return value.map((item, index) =>
          applyEnumLabels(components?.[index] ?? param, item, enums),
        );
      }
      if (value && typeof value === "object") {
        const entries = Object.fromEntries(
          Object.entries(value as Record<string, unknown>).map(
            ([key, val], index) => {
              const component =
                components.find((c) => c.name === key) ??
                components[index] ??
                param;
              return [key, applyEnumLabels(component, val, enums)];
            },
          ),
        );
        return entries;
      }
    }
  }

  const enumName = param.internalType?.replace(/^enum\s+/, "");
  const labels = enumName && enums ? enums[enumName] : undefined;

  if (labels) {
    const numeric =
      typeof value === "bigint"
        ? Number(value)
        : typeof value === "string"
          ? Number.parseInt(value, 10)
          : typeof value === "number"
            ? value
            : Number.NaN;

    if (Number.isFinite(numeric) && numeric >= 0 && numeric < labels.length) {
      const label = labels[numeric];
      return label;
    }
  }

  return cleanValue(value);
};

const formatParamValue = (
  input: AbiParameter,
  value: unknown,
  enums?: EnumRegistry,
) => {
  const transformed = applyEnumLabels(input, value, enums);
  return { value: transformed };
};

export const parseEnumDefinitions = (input: string): EnumRegistry => {
  const registry: EnumRegistry = {};
  const regex = /enum\s+([A-Za-z0-9_]+)\s*{([\s\S]*?)}/gm;
  let match: RegExpExecArray | null;

  match = regex.exec(input);
  while (match !== null) {
    const [, name, body] = match;
    const entries = body
      .split(",")
      .map((line) => line.replace(/\/\/.*$/, "").trim())
      .filter(Boolean);

    registry[name] = entries;

    match = regex.exec(input);
  }

  return registry;
};

export const decodeAbiCall = ({
  abiJson,
  data,
  enums,
}: {
  readonly abiJson: string;
  readonly data: string;
  readonly enums?: EnumRegistry;
}): DecodedCall => {
  const abi = parseAbiJson(abiJson);
  const hexData = normalizeHex(data);
  const { functionName, args } = decodeFunctionData({
    abi,
    data: hexData,
  });

  const abiItem = (abi.find(
    (item) => item.type === "function" && item.name === functionName,
  ) ?? null) as AbiFunction | null;

  if (!abiItem) {
    throw new Error(`Function ${functionName} not found in ABI`);
  }

  const params =
    abiItem.inputs?.map((input, index) => ({
      name: input.name || `arg${index + 1}`,
      type: input.type,
      displayType: input.internalType,
      ...formatParamValue(input, args?.[index], enums),
    })) ?? [];

  return {
    selector: toFunctionSelector(abiItem),
    signature: formatFunctionSignature(abiItem),
    functionName,
    params,
  };
};

export const formatReadableValue = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "bigint") {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return `[${value.map(formatReadableValue).join(", ")}]`;
  }
  if (value === null) {
    return "null";
  }
  if (value === undefined) {
    return "undefined";
  }
  return JSON.stringify(cleanValue(value), bigintReplacer, 2);
};
