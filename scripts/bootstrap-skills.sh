#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG="${1:-$ROOT/config/external-skills.json}"

if [[ ! -f "$CONFIG" ]]; then
  echo "Missing skill bootstrap config: $CONFIG" >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "node is required for Waldemar skill bootstrap" >&2
  exit 1
fi

if ! command -v npx >/dev/null 2>&1; then
  echo "npx is required for Waldemar skill bootstrap" >&2
  exit 1
fi

mapfile -t SPECS < <(node - "$CONFIG" <<'NODE'
const fs = require('fs');
const config = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
for (const skill of config.skills || []) {
  if (skill.enabled === false) continue;
  const payload = {
    name: skill.name,
    source: skill.source,
    fullDepth: !!skill.fullDepth,
    postInstall: skill.postInstall || []
  };
  console.log(JSON.stringify(payload));
}
NODE
)

FAILED=()
INSTALLED=()

for spec in "${SPECS[@]}"; do
  name="$(node -e 'console.log(JSON.parse(process.argv[1]).name)' "$spec")"
  source="$(node -e 'console.log(JSON.parse(process.argv[1]).source)' "$spec")"
  full_depth="$(node -e 'console.log(JSON.parse(process.argv[1]).fullDepth ? "yes" : "no")' "$spec")"

  echo "==> Installing skill: $name from $source"
  cmd=(npx -y skills add "$source" -g -y -a "*" -s "$name")
  if [[ "$full_depth" == "yes" ]]; then
    cmd+=(--full-depth)
  fi

  if "${cmd[@]}"; then
    INSTALLED+=("$name")
  else
    echo "WARN: failed to install skill '$name' from '$source'; continuing." >&2
    FAILED+=("$name")
    continue
  fi

  mapfile -t POST < <(node -e 'for (const c of JSON.parse(process.argv[1]).postInstall || []) console.log(c)' "$spec")
  for post in "${POST[@]}"; do
    echo "==> Post-install for $name: $post"
    if ! bash -lc "$post"; then
      echo "WARN: post-install failed for skill '$name': $post; continuing." >&2
      FAILED+=("$name:post-install")
    fi
  done
done

echo "Waldemar external skill bootstrap complete. Installed: ${#INSTALLED[@]}, warnings: ${#FAILED[@]}."
if (( ${#FAILED[@]} > 0 )); then
  printf 'WARN: failed items: %s\n' "${FAILED[*]}" >&2
fi
