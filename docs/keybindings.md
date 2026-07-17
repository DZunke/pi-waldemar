# Waldemar Keybindings

[Back to docs index](README.md)


Waldemar keeps custom keybindings restrained. Global shortcuts should be memorable, avoid pi built-in conflicts, and point to high-value inspection or command-room actions.

## Active Waldemar shortcuts

| Shortcut | Action | Notes |
| --- | --- | --- |
| `Ctrl+Shift+O` | Open `/waldemar-system-prompt latest` | Shows the captured system prompt in a scrollable TUI viewer. Falls back to the first capture if no later capture exists. |

## Built-in pi shortcuts to avoid shadowing

Do not reuse these for Waldemar globals unless there is a very strong reason:

| Shortcut | Built-in use |
| --- | --- |
| `Ctrl+O` | Expand/collapse tool output; tree filter cycling inside `/tree` |
| `Ctrl+L` | Model selector |
| `Ctrl+P` / `Shift+Ctrl+P` | Model cycling |
| `Shift+Tab` | Thinking level cycling |
| `Ctrl+T` | Thinking block toggle |
| `Ctrl+G` | External editor |
| `Ctrl+C` / `Ctrl+D` | Clear/exit semantics |

## Candidate future shortcuts

These are ideas, not active bindings:

| Candidate | Possible action | Recommendation |
| --- | --- | --- |
| `Ctrl+Shift+W` | Open `/waldemar` command chamber | Useful, but may conflict with terminal or desktop window conventions. Test before binding. |
| `Ctrl+Shift+D` | Run `/waldemar-doctor` | Useful for readiness checks, but may conflict with debugger conventions in terminal-hosted editors. |
| `Ctrl+Shift+P` | Open posture picker | Avoid for now; this is commonly a command-palette shortcut in surrounding tools. |

## Display guidance

When adding a shortcut-backed viewer:

- show the shortcut in the help/footer line of the custom component
- support `Enter` and `Esc` to close
- support scrolling when content can exceed the terminal height
- always truncate every rendered line to terminal width
- document the shortcut in this file and the related extension doc

The system prompt viewer follows this pattern and should be used as the model for future inspectors.
