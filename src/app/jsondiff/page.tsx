import { JsonDiffWorkspace } from "../../components/json-diff-workspace";
import { Col } from "../../components/layout-primitives";
import { normalizeJsonText } from "../../lib/json-normalize";

const originalJson = `{
  "network": "mainnet",
  "accounts": [
    {
      "id": "alpha",
      "roles": ["admin", "engineer"],
      "limits": {
        "daily": 1000,
        "monthly": 6000
      }
    },
    {
      "id": "beta",
      "roles": ["viewer"],
      "limits": {
        "daily": 200,
        "monthly": 1000
      }
    }
  ],
  "status": "active",
  "feature_flags": ["rollout_a", "rollout_b"]
}`;

const modifiedJson = `{
  "status": "active",
  "network": "mainnet",
  "feature_flags": ["rollout_b", "rollout_c"],
  "accounts": [
    {
      "id": "beta",
      "roles": ["viewer"],
      "limits": {
        "daily": 300,
        "monthly": 1300
      }
    },
    {
      "id": "alpha",
      "roles": ["engineer", "admin"],
      "limits": {
        "daily": 1100,
        "monthly": 6200
      }
    }
  ]
}`;

const normalizedOriginal =
  normalizeJsonText(originalJson).formatted ?? originalJson;
const normalizedModified =
  normalizeJsonText(modifiedJson).formatted ?? modifiedJson;

export default function JsonDiffPage() {
  return (
    <Col className="min-h-screen bg-[#dfe8ff] text-[#4a5676]" fullWidth>
      <JsonDiffWorkspace
        initialOriginal={normalizedOriginal}
        initialModified={normalizedModified}
      />
    </Col>
  );
}
