import Link from "next/link";
import { Col } from "../components/layout-primitives";

const tools = [
  {
    name: "Diff Viewer",
    description: "Side-by-side + unified comparisons for JSON or text",
    href: "/diff",
  },
  {
    name: "JSON Sorter",
    description: "Deterministically sort and format JSON payloads",
  },
  {
    name: "String Lab",
    description: "Encode, decode, and transform text snippets",
  },
];

export default function LandingPage() {
  return (
    <Col
      className="min-h-screen bg-[#050c1a] px-6 text-[#e4ecff]"
      align="center"
      justify="center"
      gap={32}
    >
      <Col align="center" gap={12}>
        <p className="text-sm uppercase tracking-[0.3em] text-[#6b7ba6]">
          nerd toolbox
        </p>
        <h1 className="text-4xl font-semibold text-white">Choose a tool</h1>
        <p className="text-center text-base text-[#9fb0d8]">
          Monospace-first utilities for rapid debugging and inspection.
        </p>
      </Col>

      <ul className="flex flex-col items-center gap-5 font-mono text-lg">
        {tools.map((tool) => (
          <li key={tool.name} className="text-center">
            {tool.href ? (
              <Link
                href={tool.href}
                className="inline-flex flex-col items-center rounded-full border border-white/20 px-6 py-3 text-white transition hover:border-white/50 hover:bg-white/5"
              >
                <span>{tool.name}</span>
                <span className="text-sm text-[#8ea3d3]">{tool.description}</span>
              </Link>
            ) : (
              <div className="inline-flex flex-col items-center rounded-full border border-dashed border-white/10 px-6 py-3 text-[#6f7ea6]">
                <span>{tool.name}</span>
                <span className="text-sm text-[#546287]">
                  {tool.description} — soon
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Col>
  );
}
