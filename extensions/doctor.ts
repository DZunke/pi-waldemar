import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { runDoctorChecks, showDoctorReport } from "../lib/doctor";

/** Operational readiness checks for the Waldemar package and local machine. */
export default function doctorExtension(pi: ExtensionAPI) {
  pi.registerCommand("waldemar-doctor", {
    description: "Run Waldemar's package and machine readiness checks",
    handler: async (_args, ctx) => {
      await showDoctorReport(ctx, runDoctorChecks());
    },
  });
}
