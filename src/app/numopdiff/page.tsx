import { NumopDiffWorkspace } from "../../components/numop-diff-workspace";
import { Col } from "../../components/layout-primitives";

const sampleNumopPayload = `{
  "legacy": {
    "version": "2023.11",
    "latency_ms": 185,
    "limits": {
      "burst": 800,
      "sustained": 420
    },
    "feature_flags": {
      "fast_path": false,
      "strict_validation": true
    },
    "regions": ["iad", "dfw", "sin"],
    "stats": {
      "requests": 120345,
      "errors": 231
    }
  },
  "modern": {
    "version": "2024.02",
    "latency_ms": 126,
    "limits": {
      "burst": 1200,
      "sustained": 610
    },
    "feature_flags": {
      "fast_path": true,
      "strict_validation": false,
      "regional_failover": true
    },
    "regions": ["iad", "dfw", "sin", "cdg"],
    "stats": {
      "requests": 168902,
      "errors": 143
    }
  }
}`;

export default function NumopDiffPage() {
  return (
    <Col className="min-h-screen bg-[#dfe8ff] text-[#4a5676]" fullWidth>
      <NumopDiffWorkspace initialSource={sampleNumopPayload} />
    </Col>
  );
}
