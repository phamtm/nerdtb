"use client";

import { useState } from "react";
import {
  type DecodedCall,
  decodeAbiCall,
  formatReadableValue,
  parseEnumDefinitions,
} from "../lib/abi-decode";
import { Col, Row } from "./layout-primitives";

const sampleAbi = `[
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]`;

const sampleCalldata =
  "0xa9059cbb0000000000000000000000005b38da6a701c568545dcfcb03fcb875f56beddc400000000000000000000000000000000000000000000000000000000000186a0";

const sampleEnums = `enum MarginType {
  UNSPECIFIED,
  ISOLATED,
  SIMPLE_CROSS_MARGIN,
  PORTFOLIO_CROSS_MARGIN
}

enum PositionMarginType {
  UNSPECIFIED,
  ISOLATED,
  SIMPLE_CROSS_MARGIN
}

enum TimeInForce {
  UNSPECIFIED,
  GOOD_TILL_TIME,
  ALL_OR_NONE,
  IMMEDIATE_OR_CANCEL,
  FILL_OR_KILL,
  RETAIL_PRICE_IMPROVEMENT
}

enum Kind {
  UNSPECIFIED,
  PERPS,
  FUTURES,
  CALL,
  PUT, 
  SPOT,
  SETTLEMENT,
  RATE 
}`;

export function AbiDecoderTool() {
  const [abiText, setAbiText] = useState(sampleAbi);
  const [calldata, setCalldata] = useState(sampleCalldata);
  const [enumText, setEnumText] = useState(sampleEnums);
  const [result, setResult] = useState<DecodedCall | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecode = () => {
    try {
      const enums =
        enumText.trim().length === 0
          ? undefined
          : parseEnumDefinitions(enumText);
      const decoded = decodeAbiCall({
        abiJson: abiText,
        data: calldata,
        enums,
      });
      setResult(decoded);
      setError(null);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Failed to decode data");
    }
  };

  return (
    <Col className="gap-6 rounded-2xl border border-white/15 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
      <Col gap={6}>
        <label
          className="text-sm uppercase tracking-[0.2em] text-[#8da1e3]"
          htmlFor="abi-json-input"
        >
          ABI JSON
        </label>
        <textarea
          id="abi-json-input"
          className="min-h-[180px] rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-sm text-[#e8edff] shadow-inner outline-none ring-0 transition focus:border-white/30 focus:bg-black/50"
          value={abiText}
          onChange={(event) => setAbiText(event.target.value)}
          spellCheck={false}
        />
      </Col>

      <Col gap={6}>
        <label
          className="text-sm uppercase tracking-[0.2em] text-[#8da1e3]"
          htmlFor="calldata-input"
        >
          Call Data
        </label>
        <input
          id="calldata-input"
          className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-[#e8edff] shadow-inner outline-none transition focus:border-white/30 focus:bg-black/50"
          value={calldata}
          onChange={(event) => setCalldata(event.target.value.trim())}
          spellCheck={false}
        />
      </Col>

      <Col gap={6}>
        <label
          className="text-sm uppercase tracking-[0.2em] text-[#8da1e3]"
          htmlFor="enum-input"
        >
          Enums (optional)
        </label>
        <textarea
          id="enum-input"
          className="min-h-[180px] rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-sm text-[#e8edff] shadow-inner outline-none ring-0 transition focus:border-white/30 focus:bg-black/50"
          value={enumText}
          onChange={(event) => setEnumText(event.target.value)}
          spellCheck={false}
          placeholder="enum OrderType { LIMIT, MARKET }"
        />
      </Col>

      <Row align="center" justify="space-between" wrap gap={12}>
        <p className="text-sm text-[#aab7eb]">
          Paste contract ABI + encoded input to reveal parameters instantly. Add
          enums to see labels instead of ordinal values.
        </p>
        <button
          type="button"
          onClick={handleDecode}
          className="rounded-full bg-gradient-to-r from-[#4d7bff] to-[#9d78ff] px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:brightness-110"
        >
          Decode
        </button>
      </Row>

      <ResultPanel error={error} result={result} />
    </Col>
  );
}

const ResultPanel = ({
  result,
  error,
}: {
  readonly result: DecodedCall | null;
  readonly error: string | null;
}) => {
  if (error) {
    return (
      <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
        {error}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[#cdd5ff]">
        Decoded parameters will appear here after you run a decode.
      </div>
    );
  }

  return (
    <Col className="gap-4 rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-[#dfe7ff]">
      <Row align="center" justify="space-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#8da1e3]">
            Function
          </p>
          <p className="text-lg font-semibold text-white">{result.signature}</p>
          <p className="font-mono text-xs text-[#9eb0ee]">
            Selector {result.selector}
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-[#9eb0ee]">
          {result.functionName}
        </div>
      </Row>

      <Col className="gap-3">
        {result.params.length === 0 ? (
          <p className="text-sm text-[#cdd5ff]">No parameters</p>
        ) : (
          result.params.map((param) => (
            <div
              key={`${param.name}-${param.type}`}
              className="rounded-lg border border-white/5 bg-white/5 px-3 py-2"
            >
              <p className="font-mono text-xs text-[#8da1e3]">
                {param.name} · {param.displayType ?? param.type}
              </p>
              <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-sm text-white">
                {param.displayValue ?? formatReadableValue(param.value)}
              </pre>
              {param.displayValue ? (
                <p className="mt-1 text-xs text-[#9eb0ee]">
                  Raw: {formatReadableValue(param.value)}
                </p>
              ) : null}
            </div>
          ))
        )}
      </Col>
    </Col>
  );
};
