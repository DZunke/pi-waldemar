# notifications.ts

[Back to extension index](README.md) · [Back to docs index](../README.md)

Purpose: deliver optional desktop notifications when Waldemar settles or needs an answer from you.

Responsibilities:

- registers `/waldemar-notifications` for status, mode changes, idle-threshold changes, and test dispatch
- watches assistant turn completion and classifies the latest reply as either a question or a settled completion
- suppresses routine notifications unless an actual assistant reply was produced and the terminal has been idle for a short background threshold, to reduce noise while you are actively at the keyboard
- persists notification preferences, including idle-threshold tuning, in `~/.pi/agent/waldemar-notifications.json`
- on WSL and Windows-terminal paths, prefers the Windows PowerShell BurntToast module and reports install guidance when it is missing
- carries Waldemar-themed notification wording aligned with `HERALDRY.md`, and uses `waldemar-of-falkensee.png` as an app logo when the Windows path is reachable
- emits terminal-protocol fallbacks elsewhere

This extension should stay narrow. Keep desktop-notification transport and preference helpers in `lib/notifications.ts`, and keep unrelated startup or footer behavior in `startup.ts`.
