'use client';

import { useMemo, useState } from "react";
import { MonacoDiffViewer } from "../components/monaco-diff-viewer";

type ToggleButtonProps = {
  readonly label: string;
  readonly active: boolean;
  readonly onClick: () => void;
};

const originalJson = `{
  "result": {
    "funding_account_balance": "600041760950",
    "main_account_id": "0x5bedf9d6f94166d7ae2f3ca27c32f3e733165853",
    "spot_balances": {
      "balance": "111186082465573",
      "currency": "3",
      "index_price": "1008074592"
    },
    "total_equity": "1125732789346069",
    "total_sub_account_balance": "1125886885954561",
    "total_vault_investments_balance": "113843771291626",
    "vault_investments": [
      {
        "num_lp_tokens": "1001698",
        "share_price": "9969999956",
        "vault_id": "515639893"
      },
      {
        "num_lp_tokens": "11093966",
        "share_price": "9950043344",
        "vault_id": "7727263793"
      },
      {
        "num_lp_tokens": "10151355",
        "share_price": "9860354806",
        "vault_id": "1856103219"
      },
      {
        "num_lp_tokens": "15552808893",
        "share_price": "9979586374",
        "vault_id": "1644840352"
      },
      {
        "num_lp_tokens": "1368353765320",
        "share_price": "9999999393",
        "vault_id": "1479441759"
      },
      {
        "num_lp_tokens": "220267998629",
        "share_price": "10174836739",
        "vault_id": "2113962870"
      },
      {
        "num_lp_tokens": "227669736365",
        "share_price": "11180372384",
        "vault_id": "635658283"
      },
      {
        "num_lp_tokens": "2802323",
        "share_price": "107113611685",
        "vault_id": "918906362"
      }
    ]
  }
}`;

const modifiedJson = `{
  "result": {
    "funding_account_balance": "600041760951",
    "main_account_id": "0x5bedf9d6f94166d7ae2f3ca27c32f3e733165853",
    "spot_balances": {
      "balance": "111186082465573",
      "currency": "3",
      "index_price": "1008074592"
    },
    "total_equity": "112573278134130",
    "total_sub_account_balance": "112588688594956",
    "total_vault_investments_balance": "113843771295518",
    "vault_investments": [
      {
        "num_lp_tokens": "1001698",
        "share_price": "9969999948",
        "vault_id": "515639893"
      },
      {
        "num_lp_tokens": "11093966",
        "share_price": "9950040000",
        "vault_id": "7727263793"
      },
      {
        "num_lp_tokens": "10151355",
        "share_price": "9860354800",
        "vault_id": "1856103219"
      },
      {
        "num_lp_tokens": "15552808893",
        "share_price": "9979586200",
        "vault_id": "1644840352"
      },
      {
        "num_lp_tokens": "1368353765320",
        "share_price": "9999999390",
        "vault_id": "1479441759"
      },
      {
        "num_lp_tokens": "220267998629",
        "share_price": "10174863000",
        "vault_id": "2113962870"
      },
      {
        "num_lp_tokens": "227669736365",
        "share_price": "11180372000",
        "vault_id": "635658283"
      },
      {
        "num_lp_tokens": "2802323",
        "share_price": "107113611685",
        "vault_id": "918906362"
      }
    ]
  }
}`;

function ToolbarButton({ label, active, onClick }: ToggleButtonProps) {
  return (
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
        className={`h-2 w-2 rounded-full ${
          active ? "bg-sky-500" : "bg-zinc-300"
        }`}
      />
      {label}
    </button>
  );
}

export default function Home() {
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [unified, setUnified] = useState(false);

  const toolbarConfig = useMemo(
    () => [
      {
        label: "Ignore Whitespace",
        active: ignoreWhitespace,
        onClick: () => setIgnoreWhitespace(!ignoreWhitespace),
      },
      {
        label: "Word Wrap",
        active: wordWrap,
        onClick: () => setWordWrap(!wordWrap),
      },
      {
        label: "Unified View",
        active: unified,
        onClick: () => setUnified(!unified),
      },
    ],
    [ignoreWhitespace, unified, wordWrap],
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#dfe8ff] text-[#4a5676]">
      <header className="border-b border-white/40 bg-white/70 px-6 py-5 backdrop-blur">
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {toolbarConfig.map((button) => (
              <ToolbarButton key={button.label} {...button} />
            ))}
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col">
        <MonacoDiffViewer
          className="h-[calc(100vh)]"
          original={originalJson}
          modified={modifiedJson}
          ignoreWhitespace={ignoreWhitespace}
          wordWrap={wordWrap}
          unified={unified}
        />
      </div>
    </div>
  );
}
