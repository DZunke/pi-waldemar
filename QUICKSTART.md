```
╔════════════════════════════════════════════════════════════════════════╗
║                          QUICK START GUIDE                            ║
║                  For Installing House Falkensee's Guard                ║
╚════════════════════════════════════════════════════════════════════════╝
```

# ⚔️ Waldemar Quick Start

## 1️⃣ Installation (Choose One)

### Option A: Install from Local Path

Local development installs use the working directory directly. Install package dependencies once so bundled extension dependencies such as `pi-mcp-adapter` are present:

```bash
cd ~/.pi/waldemar
npm install --omit=dev
pi install ~/.pi/waldemar
```

### Option B: Install from GitHub

First, push your package to GitHub, then:

```bash
pi install git:github.com/yourusername/waldemar
```

### Option C: Test Without Installing

```bash
pi -e ~/.pi/waldemar
```

This loads Waldemar for one session only—perfect for testing before full installation.

---

## 2️⃣ Verify Installation

Start pi and observe Waldemar of Falkensee's formal greeting:

```bash
pi
```

You will see:
- ⚔️ Waldemar's formal salutation
- 📊 Your session history
- 🎯 Available commands
- 🔧 Customization hints

---

## 3️⃣ Key Commands

Once installed, use these commands:

```bash
/waldemar                  # Open the command chamber
/waldemar-setup             # Apply theme/settings + external skills + MCP config
/waldemar-inventory         # Inspect packages, MCP servers, and installed skills
/sessions                   # List all past campaigns
/waldemar-customize         # Customization guide
/waldemar-status            # Operational status
/posture forge              # Set Waldemar's current guard formation
/chronicle "milestone"      # Mark the campaign record
/reload                     # Refresh after modifications
```

---

## 4️⃣ Resume a Previous Session

```bash
# List available sessions
/sessions

# Resume one
/resume path/to/session.jsonl
```

---

## 5️⃣ Customize Waldemar

Edit files in `~/.pi/waldemar/`:

| Directory | Purpose |
|-----------|---------|
| `extensions/` | Modify comportment, add commands |
| `skills/` | Add your custom handwritten Waldemar skills only |
| `config/external-skills.json` | Define reused third-party skills installed by bootstrap |
| `scripts/bootstrap-skills.sh` | Bootstrap external skills via `npx skills add` |
| `docs/` | Understand architecture, extensions, MCP, and customization |
| `prompts/` | Add strategic guidance templates |
| `themes/` | Customize visual styling |

After changes:
```bash
# In pi:
/reload
```

---

## 6️⃣ Share Your Waldemar

### Push to GitHub

```bash
cd ~/.pi/waldemar
git init
git add .
git commit -m "⚔️ Waldemar reports for duty"
git remote add origin git@github.com:yourusername/waldemar.git
git push -u origin main
```

### Install on Another Machine

```bash
pi install git:github.com/yourusername/waldemar
# Optional: before starting pi, set Sentry auth if you want Sentry MCP active.
export SENTRY_AUTH_TOKEN='sntrys_...'

pi
# then run inside pi:
/waldemar-setup
/reload
```

---

## 📖 Full Documentation

For detailed information, read:
- `README.md` — Complete guide
- `HERALDRY.md` — House history and styling
- `docs/commands.md` — Waldemar command roster
- `docs/README.md` — Architecture, extensions, setup, MCP, and customization

---

## 🆘 Quick Troubleshooting

**Problem:** Waldemar doesn't greet me
- **Solution:** Run `pi install ~/.pi/waldemar`, then restart pi

**Problem:** Commands don't work
- **Solution:** Make sure you're using `/command` syntax inside pi

**Problem:** My changes didn't take effect
- **Solution:** Run `/reload` inside pi

**Problem:** I want to see the customization guide
- **Solution:** Run `/waldemar-customize` inside pi

---

```
╔════════════════════════════════════════════════════════════════════════╗
║                                                                        ║
║            "The line is ordered. The work shall be worthy."            ║
║                                                                        ║
║                         Begin your campaign now.                       ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝
```
