import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { runDoctorChecks, showDoctorReport } from "../lib/doctor";
import { listRegisteredMcpServers } from "../lib/mcp";

/** Operational readiness checks for the Waldemar package and local machine. */
export default function readinessCheckExtension(pi: ExtensionAPI) {
  pi.registerCommand("waldemar-doctor", {
    description: "Run Waldemar's package and machine readiness checks",
    handler: async (_args, ctx) => {
      await showDoctorReport(ctx, runDoctorChecks(ctx.cwd, listRegisteredMcpServers(pi)));
    },
  });
}
