import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { applyCodegraphPromptSection, createCodegraphMcpConfig } from "../lib/codegraph.ts";
import { createNotificationGate } from "../lib/notification-gate.ts";
import { mergeDefaultTools, removeLegacyCodegraphMcpEntry } from "../lib/setup.ts";

const root = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));

test("Waldemar bundles Pi-native extensions and excludes the removed MCP adapter", () => {
  assert.ok(manifest.pi.extensions.includes("./extensions"));
  assert.ok(manifest.pi.extensions.includes("./node_modules/pi-subagents/index.js"));
  assert.ok(!manifest.pi.skills.some((resource) => resource.includes("pi-subagents")));
  assert.ok(!manifest.pi.prompts.some((resource) => resource.includes("pi-subagents")));
  assert.deepEqual(manifest.pi.subagents.agents, ["./agents"]);
  assert.equal(manifest.dependencies["pi-subagents"], "0.76.1");
  assert.ok(manifest.bundledDependencies.includes("pi-subagents"));
  assert.ok(!JSON.stringify(manifest).includes("pi-mcp-adapter"));
  assert.ok(!manifest.dependencies?.["pi-mcp-adapter"]);
  const lock = JSON.parse(readFileSync(path.join(root, "package-lock.json"), "utf8"));
  assert.ok(!JSON.stringify(lock).includes("pi-mcp-adapter"));
  assert.equal(lock.packages["node_modules/pi-subagents"].version, "0.76.1");
  assert.ok(existsSync(path.join(root, "node_modules", "pi-subagents", "index.js")));
  assert.ok(existsSync(path.join(root, "extensions", "codegraph.ts")));
  const extensionFiles = readdirSync(path.join(root, "extensions")).filter((name) => name.endsWith(".ts")).sort();
  assert.deepEqual(extensionFiles, [
    "cli-tooling.ts",
    "codegraph.ts",
    "desktop-notifications.ts",
    "machine-setup.ts",
    "package-inventory.ts",
    "persona.ts",
    "prompt-inspector.ts",
    "readiness-check.ts",
    "startup-status.ts",
    "tui-presence.ts",
  ]);
  for (const file of extensionFiles) assert.ok(existsSync(path.join(root, "docs", "extensions", `${path.basename(file, ".ts")}.md`)));
  for (const removed of ["session-list", "status-report", "tool-inventory"]) {
    assert.ok(!existsSync(path.join(root, "extensions", `${removed}.ts`)));
    assert.ok(!existsSync(path.join(root, "docs", "extensions", `${removed}.md`)));
  }
  assert.ok(!existsSync(path.join(root, "lib", "tool-inventory.ts")));
  const startupSource = readFileSync(path.join(root, "extensions", "startup-status.ts"), "utf8");
  assert.doesNotMatch(startupSource, /SessionManager|sessionCount/);
  assert.deepEqual(
    readdirSync(path.join(root, "themes")).filter((name) => name.endsWith(".json")).sort(),
    ["atlavium.json", "falkensee-heraldry-light.json", "falkensee-heraldry.json"],
  );
});

test("packaged personas have distinct prompts, context boundaries, and tool access", () => {
  const profiles = {
    jessica: { name: "jessica", role: "UI Designer", readOnly: true },
    "brunhilde-nordwald": { name: "brunhilde-nordwald", role: "small-task implementer", readOnly: false },
    "albert-metzler": { name: "albert-metzler", role: "Product Manager", readOnly: true },
  };

  for (const [file, profile] of Object.entries(profiles)) {
    const source = readFileSync(path.join(root, "agents", `${file}.md`), "utf8");
    assert.match(source, new RegExp(`^name: ${profile.name}$`, "m"));
    assert.match(source, /advertise: true/);
    assert.match(source, /extensions: \[\]/);
    assert.match(source, /systemPromptMode: replace/);
    assert.match(source, /inheritProjectContext: true/);
    assert.match(source, /inheritGlobalContext: false/);
    assert.match(source, /defaultContext: fresh/);
    assert.match(source, new RegExp(profile.role, "i"));
    if (profile.readOnly) {
      assert.match(source, /acceptanceRole: read-only/);
      assert.match(source, /tools: read, grep, find, ls/);
    } else {
      assert.match(source, /acceptanceRole: writer/);
      assert.match(source, /tools: read, grep, find, ls, bash, edit, write/);
    }
  }
});

test("Waldemar delegates selectively while retaining coordination and QA", () => {
  const persona = readFileSync(path.join(root, "lib", "waldemar.ts"), "utf8");
  assert.match(persona, /For nontrivial development work, use pi-subagents/);
  assert.match(persona, /the parent owns integration, QA, and final validation/);
  assert.match(persona, /identify each contribution by persona name and role/);
  assert.match(persona, /Quote only verbatim output; label paraphrases accurately/);
  assert.match(persona, /Do not imply direct peer conversation/);
  assert.match(persona, /Never hardcode model IDs, reasoning settings, or thread limits/);
  assert.doesNotMatch(persona, /gpt-6-(?:luna|sol|astra)/i);
});

test("desktop notification gate allows one alert until the next user input", () => {
  const gate = createNotificationGate();
  assert.equal(gate.claim(), true);
  assert.equal(gate.claim(), false);
  gate.reset();
  assert.equal(gate.claim(), true);
});

test("Falkensee light and dark themes share valid color roles", () => {
  const themesDir = path.join(root, "themes");
  const dark = JSON.parse(readFileSync(path.join(themesDir, "falkensee-heraldry.json"), "utf8"));
  const light = JSON.parse(readFileSync(path.join(themesDir, "falkensee-heraldry-light.json"), "utf8"));
  assert.equal(dark.appearance, "dark");
  assert.equal(light.appearance, "light");
  assert.deepEqual(Object.keys(light.colors).sort(), Object.keys(dark.colors).sort());
  for (const theme of [dark, light]) {
    for (const [role, color] of Object.entries(theme.colors)) {
      assert.ok(/^#[0-9A-Fa-f]{6}$/.test(color) || color in theme.vars, `${theme.name}.${role} has invalid color ${color}`);
    }
  }
});

test("CodeGraph is registered with Pi and enabled only for an indexed workspace", (t) => {
  const cwd = mkdtempSync(path.join(tmpdir(), "waldemar-codegraph-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));

  const unindexed = createCodegraphMcpConfig(cwd);
  assert.equal(unindexed.command, "codegraph");
  assert.deepEqual(unindexed.args, ["serve", "--mcp"]);
  assert.equal(unindexed.cwd, cwd);
  assert.equal(unindexed.enabled, false);
  assert.equal(unindexed.exposure, "codemode");

  mkdirSync(path.join(cwd, ".codegraph"));
  assert.equal(createCodegraphMcpConfig(cwd).enabled, true);
});

test("CodeGraph contributes and removes its structured prompt section without replacing others", () => {
  const sections = { persona: "Waldemar persona" };
  applyCodegraphPromptSection(sections, true);
  assert.match(sections.codegraph, /tool_search/);
  assert.equal(sections.persona, "Waldemar persona");
  applyCodegraphPromptSection(sections, false);
  assert.deepEqual(sections, { persona: "Waldemar persona" });
});

test("setup enables Pi-native discovery additively and preserves explicit user choices", () => {
  assert.deepEqual(mergeDefaultTools(undefined), ["+codemode", "+tool_search"]);
  assert.deepEqual(mergeDefaultTools([]), []);
  assert.deepEqual(
    mergeDefaultTools(["read", "-codemode", "+tool_search"]),
    ["read", "-codemode", "+tool_search"],
  );
  assert.deepEqual(
    mergeDefaultTools(["read", "bash"]),
    ["read", "bash", "+codemode", "+tool_search"],
  );
});

test("legacy MCP migration removes only the exact old Waldemar default", (t) => {
  const dir = mkdtempSync(path.join(tmpdir(), "waldemar-mcp-migration-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const filePath = path.join(dir, "mcp.json");
  writeFileSync(filePath, JSON.stringify({
    mcpServers: {
      codegraph: { command: "codegraph", args: ["serve", "--mcp"] },
      github: { command: "gh-mcp", args: [] },
    },
    otherSetting: true,
  }));

  assert.equal(removeLegacyCodegraphMcpEntry(filePath), "removed");
  const migrated = JSON.parse(readFileSync(filePath, "utf8"));
  assert.deepEqual(migrated.mcpServers, { github: { command: "gh-mcp", args: [] } });
  assert.equal(migrated.otherSetting, true);

  writeFileSync(filePath, JSON.stringify({ mcpServers: { codegraph: { command: "codegraph", args: ["serve", "--mcp"], env: { TOKEN: "x" } } } }));
  assert.equal(removeLegacyCodegraphMcpEntry(filePath), "unchanged");
});
