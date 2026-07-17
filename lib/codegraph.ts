import { execSync, spawn, type ChildProcess } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import { createInterface, type Interface } from "readline";

export interface CodegraphTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

interface PendingRequest {
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
}

export interface CodegraphClient {
  listTools(): Promise<CodegraphTool[]>;
  callTool(name: string, args: Record<string, unknown>): Promise<string>;
  destroy(): void;
}

export const CODEGRAPH_SYSTEM_PROMPT = `
# CodeGraph

If this workspace has a local .codegraph index, native CodeGraph tools are available. They expose symbol aware structure such as definitions, references, call relationships, and file level organization. Reach for them when the question is about how code is connected or where behavior is decided.

Recommended tool selection:
- Start with codegraph_explore for most code comprehension tasks, design tracing, control flow questions, or quick change scouting.
- Use codegraph_search when you only need to locate a symbol by name.
- Use codegraph_node when you need the body of one symbol, especially if the name is overloaded or ambiguous.
- Use codegraph_callers or codegraph_callees to inspect incoming or outgoing call relationships.
- Use codegraph_impact to estimate what a modification could affect.
- Use codegraph_files or codegraph_status for directory and index level checks.

Operating guidance:
- Prefer CodeGraph over broad text search when structure matters.
- Ask one high value CodeGraph question before opening many files.
- Fall back to normal file reads for raw text details, comments, logs, or when you need to confirm content after edits because the index may lag slightly.
- Avoid repeating the same lookup if the first result already answers the question.
`.trim();

const clientsByCwd = new Map<string, CodegraphClient>();
let cleanupHooked = false;

export function hasCodegraphIndex(cwd: string): boolean {
  return existsSync(join(cwd, ".codegraph"));
}

export async function getCodegraphClient(cwd: string): Promise<CodegraphClient> {
  const existing = clientsByCwd.get(cwd);
  if (existing) return existing;

  const client = await startCodegraphClient(cwd);
  clientsByCwd.set(cwd, client);
  ensureProcessCleanup();
  return client;
}

export function destroyCodegraphClient(cwd: string) {
  const client = clientsByCwd.get(cwd);
  if (!client) return;
  client.destroy();
  clientsByCwd.delete(cwd);
}

function ensureProcessCleanup() {
  if (cleanupHooked) return;
  cleanupHooked = true;

  const killAll = () => {
    for (const client of clientsByCwd.values()) client.destroy();
    clientsByCwd.clear();
  };

  process.once("exit", killAll);
  for (const signal of ["SIGTERM", "SIGHUP"] as const) {
    process.once(signal, () => {
      killAll();
      process.kill(process.pid, signal);
    });
  }
}

function rejectPending(pending: Map<number, PendingRequest>, error: Error) {
  for (const request of pending.values()) request.reject(error);
  pending.clear();
}

function descendantPids(rootPid: number): number[] {
  try {
    const output = execSync("ps -axo pid=,ppid=", { encoding: "utf8" });
    const childMap = new Map<number, number[]>();

    for (const line of output.split("\n")) {
      const match = line.trim().match(/^(\d+)\s+(\d+)$/);
      if (!match) continue;

      const pid = Number(match[1]);
      const parentPid = Number(match[2]);
      const siblings = childMap.get(parentPid);
      if (siblings) siblings.push(pid);
      else childMap.set(parentPid, [pid]);
    }

    const descendants: number[] = [];
    const stack = [rootPid];
    while (stack.length > 0) {
      const parentPid = stack.pop();
      if (!parentPid) continue;

      for (const childPid of childMap.get(parentPid) ?? []) {
        descendants.push(childPid);
        stack.push(childPid);
      }
    }

    return descendants;
  } catch {
    return [];
  }
}

function killProcessTree(proc: ChildProcess) {
  const { pid } = proc;
  if (!pid) {
    proc.kill("SIGTERM");
    return;
  }

  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true,
    });
    return;
  }

  const targets = descendantPids(pid);
  try {
    process.kill(-pid, "SIGTERM");
  } catch {}

  for (const targetPid of [...targets, pid]) {
    try {
      process.kill(targetPid, "SIGTERM");
    } catch {}
  }
}

function startCodegraphClient(cwd: string): Promise<CodegraphClient> {
  return new Promise((resolveClient, rejectClient) => {
    const proc = spawn("codegraph", ["serve", "--mcp"], {
      cwd,
      stdio: ["pipe", "pipe", "pipe"],
      env: process.env,
      detached: process.platform !== "win32",
      windowsHide: true,
    });

    let nextId = 1;
    let settled = false;
    let destroyed = false;
    const pending = new Map<number, PendingRequest>();

    const lines: Interface = createInterface({ input: proc.stdout! });
    lines.on("line", (line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      let message: { id?: number; result?: unknown; error?: { message: string } };
      try {
        message = JSON.parse(trimmed);
      } catch {
        return;
      }

      if (message.id === undefined) return;

      const request = pending.get(message.id);
      if (!request) return;

      pending.delete(message.id);
      if (message.error) request.reject(new Error(message.error.message));
      else request.resolve(message.result);
    });

    const failStartup = (error: Error) => {
      if (settled) return;
      settled = true;
      destroy();
      rejectClient(error);
    };

    const destroy = () => {
      if (destroyed) return;
      destroyed = true;
      rejectPending(pending, new Error("codegraph client destroyed"));
      lines.close();
      proc.stdin?.end();
      killProcessTree(proc);
    };

    const rpc = <T>(method: string, params?: unknown): Promise<T> => {
      const id = nextId++;
      return new Promise((resolve, reject) => {
        pending.set(id, {
          resolve: resolve as (value: unknown) => void,
          reject,
        });
        proc.stdin?.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
      });
    };

    const notify = (method: string, params?: unknown) => {
      proc.stdin?.write(JSON.stringify({ jsonrpc: "2.0", method, params }) + "\n");
    };

    proc.once("error", failStartup);
    proc.once("exit", (code, signal) => {
      const error = new Error(
        `codegraph MCP exited${code === null ? "" : ` with code ${code}`}${signal ? ` (${signal})` : ""}`,
      );
      rejectPending(pending, error);
      if (!settled) {
        settled = true;
        rejectClient(error);
      }
    });

    rpc("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "waldemar-codegraph", version: "1.0.0" },
    })
      .then(() => {
        if (destroyed) return;

        settled = true;
        notify("notifications/initialized");
        resolveClient({
          listTools: () => rpc<{ tools: CodegraphTool[] }>("tools/list").then((result) => result.tools),
          callTool: (name, args) => rpc<{ content: Array<{ type: string; text?: string }> }>("tools/call", {
            name,
            arguments: args,
          }).then((result) => result.content.filter((entry) => entry.type === "text").map((entry) => entry.text ?? "").join("\n")),
          destroy,
        });
      })
      .catch((error) => failStartup(error instanceof Error ? error : new Error(String(error))));
  });
}
