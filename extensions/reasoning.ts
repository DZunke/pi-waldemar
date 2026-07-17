import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const REASONING_SUMMARY_LEVEL = "detailed";

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Improve visible provider reasoning summaries where the API supports them. */
export default function reasoningExtension(pi: ExtensionAPI) {
  pi.on("before_provider_request", (event) => {
    const payload = event.payload;

    if (!isObject(payload)) return undefined;
    if (!isObject(payload.reasoning)) return undefined;

    // OpenAI Responses-style payloads have `input` and a `reasoning.summary` field.
    // This does not reveal private chain-of-thought; it only requests the richest
    // provider-approved summary that can become a pi thinking block.
    if (!("input" in payload)) return undefined;

    const currentSummary = payload.reasoning.summary;
    if (currentSummary === REASONING_SUMMARY_LEVEL) return undefined;
    if (currentSummary !== undefined && typeof currentSummary !== "string") return undefined;

    return {
      ...payload,
      reasoning: {
        ...payload.reasoning,
        summary: REASONING_SUMMARY_LEVEL,
      },
    };
  });

}
