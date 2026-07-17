# reasoning extension

[Back to extension index](README.md) · [Back to docs index](../README.md)


Purpose: improve Waldemar's visible reasoning display without pretending to expose private model chain-of-thought.

## Responsibilities

- Hooks `before_provider_request` for OpenAI Responses-style payloads that already contain a `reasoning` object.
- Requests `reasoning.summary: "detailed"` by default so provider-approved reasoning summaries are as useful as possible in pi's collapsible thinking block.
- Does not add a user command; this is a silent payload refinement.

## Limits

This extension cannot recover raw reasoning that a provider does not transmit. OpenAI reasoning models generally expose reasoning summaries and encrypted reasoning state, not full private chain-of-thought. Pi can only render the text returned in stream events such as reasoning summary/text deltas.

## Configuration

No shell configuration is required. The extension requests `summary: "detailed"` by default.

The extension only rewrites payloads that look like OpenAI Responses requests with an existing `reasoning` object and `input` field.
