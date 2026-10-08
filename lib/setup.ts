import * as fs from "fs";
import * as path from "path";

export const WALDEMAR_DEFAULT_ADDITIONAL_TOOLS = ["codemode", "tool_search"] as const;

/** Add Waldemar's Pi-native discovery tools without overriding explicit user choices. */
export function mergeDefaultTools(current: unknown): string[] {
  if (Array.isArray(current) && current.length === 0) return [];
  const tools = Array.isArray(current) ? current.filter((tool): tool is string => typeof tool === "string") : [];
  const configuredNames = new Set(tools.map((entry) => entry.replace(/^[+-]/, "")));

  for (const name of WALDEMAR_DEFAULT_ADDITIONAL_TOOLS) {
    if (!configuredNames.has(name)) tools.push(`+${name}`);
  }

  return tools;
}

/** Remove only the exact CodeGraph entry written by older Waldemar setup versions. */
export function removeLegacyCodegraphMcpEntry(filePath: string): "removed" | "unchanged" | "invalid" {
  if (!fs.existsSync(filePath)) return "unchanged";
  try {
    if (fs.lstatSync(filePath).isSymbolicLink()) return "unchanged";
  } catch {
    return "invalid";
  }

  let config: Record<string, any>;
  try {
    config = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return "invalid";
  }

  const servers = config?.mcpServers;
  const codegraph = servers?.codegraph;
  if (!codegraph || typeof codegraph !== "object" || Array.isArray(codegraph)) return "unchanged";

  const keys = Object.keys(codegraph).sort();
  if (keys.length !== 2 || keys[0] !== "args" || keys[1] !== "command") return "unchanged";
  if (codegraph.command !== "codegraph" || !Array.isArray(codegraph.args) || codegraph.args.length !== 2 || codegraph.args[0] !== "serve" || codegraph.args[1] !== "--mcp") {
    return "unchanged";
  }

  delete servers.codegraph;
  if (Object.keys(servers).length === 0) delete config.mcpServers;

  let tempDir: string | undefined;
  try {
    const mode = fs.statSync(filePath).mode & 0o777;
    tempDir = fs.mkdtempSync(path.join(path.dirname(filePath), ".waldemar-mcp-"));
    const tempPath = path.join(tempDir, path.basename(filePath));
    fs.writeFileSync(tempPath, JSON.stringify(config, null, 2), { mode });
    fs.renameSync(tempPath, filePath);
    return "removed";
  } catch {
    return "invalid";
  } finally {
    if (tempDir) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {
        // A stale temporary directory is harmless; do not interrupt setup cleanup.
      }
    }
  }
}
