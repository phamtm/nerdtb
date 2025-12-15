import { AbiDecoderTool } from "../../components/abi-decoder-tool";
import { Col } from "../../components/layout-primitives";

export default function AbiDecodePage() {
  return (
    <Col
      className="min-h-screen bg-gradient-to-br from-[#050c1a] via-[#0b1d3a] to-[#09102a] px-6 py-12 text-[#d7e4ff]"
      align="center"
      fullWidth
    >
      <Col className="w-full max-w-5xl gap-6">
        <header className="flex flex-col gap-2 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8da1e3]">
            Abi decoder
          </p>
          <h1 className="text-4xl font-semibold leading-tight">
            Untangle encoded calldata
          </h1>
          <p className="max-w-2xl text-base text-[#aab7eb]">
            Drop in any Solidity ABI and hex-encoded calldata to surface the
            function, selector, and readable parameters without touching a
            console.
          </p>
        </header>

        <AbiDecoderTool />
      </Col>
    </Col>
  );
}
