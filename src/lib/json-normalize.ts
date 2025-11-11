type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

// The collator keeps object keys sorted alphabetically while still handling numeric fragments.
const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

const compareValues = (a: JsonValue, b: JsonValue) => {
  const left = JSON.stringify(a);
  const right = JSON.stringify(b);
  return left.localeCompare(right, undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

const sortArray = (value: JsonValue[]): JsonValue[] => {
  const normalizedItems = value.map(sortValue);
  return normalizedItems.sort(compareValues);
};

const sortObject = (
  value: Record<string, JsonValue>,
): Record<string, JsonValue> => {
  const sortedEntries = Object.keys(value)
    .sort((a, b) => collator.compare(a, b))
    .map((key) => [key, sortValue(value[key])]);

  return sortedEntries.reduce<Record<string, JsonValue>>(
    (acc, [key, sortedValue]) => {
      acc[key] = sortedValue;
      return acc;
    },
    {},
  );
};

export const sortValue = (value: JsonValue): JsonValue => {
  if (Array.isArray(value)) {
    return sortArray(value);
  }

  if (value && typeof value === "object") {
    return sortObject(value as Record<string, JsonValue>);
  }

  return value;
};

// normalizeJsonText parses, recursively sorts, and pretty-prints any JSON blob so diffing
// highlights actual value changes rather than ordering differences.
export const normalizeJsonText = (input: string) => {
  const trimmed = input.trim();
  if (!trimmed) {
    return { formatted: "" };
  }

  try {
    const parsed = JSON.parse(trimmed) as JsonValue;
    const sorted = sortValue(parsed);
    return { formatted: JSON.stringify(sorted, null, 2) };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid JSON input";
    return { error: message };
  }
};
