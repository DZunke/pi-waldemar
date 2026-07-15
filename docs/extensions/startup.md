# startup.ts

Purpose: handle the compact startup rapport and lifecycle footer status.

Responsibilities:

- randomized compact startup rapport via `WALDEMAR_STARTUP_REPORTS`
- recent campaign count in the rapport
- setup hint when settings are not applied
- randomized Waldemar footer status moods

Change `WALDEMAR_STARTUP_REPORTS` here to alter short welcome rapports. Keep identity and office presentation in `presence.ts` so startup output does not duplicate the custom header. Change `WALDEMAR_STATUS_MOODS` to alter footer messages and emoji.
