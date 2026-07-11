```
╔════════════════════════════════════════════════════════════════════════╗
║                          QUICK START GUIDE                            ║
║                     For Installing House Waldemar                      ║
╚════════════════════════════════════════════════════════════════════════╝
```

# ⚔️ Waldemar Quick Start

## 1️⃣ Installation (Choose One)

### Option A: Install from Local Path

```bash
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

Start pi and observe Waldemar's noble greeting:

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
/sessions                    # List all past campaigns
/waldemar-customize         # Customization guide
/waldemar-status            # Operational status
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
| `skills/` | Add tactical expertise |
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
```

---

## 📖 Full Documentation

For detailed information, read:
- `README.md` — Complete guide
- `HERALDRY.md` — House history and styling

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
║               "Your captain stands ready for duty, liege."             ║
║                                                                        ║
║                         Begin your campaign now.                       ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝
```
