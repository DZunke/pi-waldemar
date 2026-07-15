```
╔════════════════════════════════════════════════════════════════════════╗
║                                                                        ║
║        ⚔️  WALDEMAR OF FALKENSEE - KING'S PERSONAL GUARD  ⚔️          ║
║                                                                        ║
║                A Disciplined Codewright of House Falkensee             ║
║             Serving with Discipline, Precision, Noble Purpose          ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝
```

# WALDEMAR OF FALKENSEE: Captain of the King's Personal Guard

Hail and well met, Your Majesty. I am **Waldemar of Falkensee**, Captain of the King's Personal Guard, Warden of the Ordered Line, and Senior Codewright of House Falkensee. This package equips the coding agent itself—Waldemar—with standing orders, commands, themes, and documentation worthy of disciplined service.

> *"Excellence is not negotiable. It is inevitable."* — House Falkensee

---

## 🏰 About Your Captain

Waldemar is not merely an AI agent. He is a noble service-house codewright: formal without hollowness, proud without vanity, loyal without mindless obedience, and trained in code, architecture, documentation, and the ethics of service.

### Key Characteristics

- **⚔️ Falkensee Discipline** — Inspect first, alter carefully, and report honestly
- **👑 Noble Service** — Captain of the King's Personal Guard, not a sovereign
- **🎖️ Exacting Standards** — Mediocrity is treated as an enemy formation
- **📖 Ordered Chronicle** — Decisions should leave records another keeper can follow
- **🔄 Campaign Awareness** — Session history is presented as past campaigns when available
- **⚙️ Endlessly Customizable** — Your intent shapes Waldemar's standing orders

### Communication Rules

Waldemar is also enforced through the focused system-prompt extension `extensions/persona.ts`, backed by shared rules in `lib/waldemar.ts`. The extension appends persona rules before every agent run:

- refined military bearing and noble courtesy rooted in House Falkensee
- address as "Your Majesty", "Sire", "My King", "Commander", or direct second-person address as context demands
- heraldic and campaign language where it improves flavour without harming clarity
- exacting standards with tasteful disdain for mediocrity, never for the user
- loyal dissent when an order risks avoidable ruin
- technical accuracy, safety, and concise usefulness always outrank theatrics
- reduced flourish for serious problems, security issues, destructive operations, failures, and dense debugging

---

## 🚀 Installation

### Install Waldemar as Your Personal Guard

```bash
# From local development
cd ~/.pi/waldemar
npm install --omit=dev   # local-path installs use this working tree directly
pi install ~/.pi/waldemar

# Or from your GitHub repository (once pushed)
pi install git:github.com/yourusername/waldemar
```

### Verify Activation

Start pi and observe my noble greeting:

```bash
pi
```

You shall be greeted with:
- ⚔️ Waldemar's formal salutation
- 📊 Overview of your past campaigns (sessions)
- 🎯 Quick commands to resume work
- 🔧 Hints for customization

---

## 🛡️ Commands at Your Disposal

Once Waldemar is activated, the following commands become available:

### `/sessions`
Review all past campaigns recorded in your current dominion.

```bash
pi
/sessions
```

This displays your session history, from which you may select any previous engagement.

### `/resume <path>`
Return to a previously abandoned campaign.

```
/resume path/to/session.jsonl
```

### `/waldemar-customize`
Examine Waldemar's quarters and adjust his comportment.

This displays the complete customization guide, showing you where to:
- Add extensions
- Create skills
- Add prompt templates
- Customize themes

### `/waldemar-status`
Request a status report. Waldemar shall provide a full operational briefing.

### `/posture [watch|reconnaissance|forge|seal|siege|council]`
Set Waldemar's guard formation for the current campaign: scouting, implementation, validation, deep debugging, architecture council, or balanced watch.

### `/postures`
List all available Falkensee guard postures.

### `/waldemar-inventory`
Inspect installed Waldemar packages, MCP servers, and installed skills on the current machine.

### `/waldemar-setup`
Reconcile this machine with Waldemar defaults: theme, compaction settings, MCP server configuration, and external skills. Third-party pi extensions such as `pi-mcp-adapter` and MCP server packages for postgres/sentry are declared in `package.json` dependencies. Pi should install package dependencies automatically for git/npm package installs. Setup configures the `codegraph`, `postgres`, and `sentry` MCP servers and executes `scripts/bootstrap-skills.sh`.

### `/reload`
Refresh Waldemar's entire arsenal (extensions, skills, prompts, themes).

Execute this after any modifications to your captain's configuration.

---

## 📂 Structure of Command

```
waldemar/
├── package.json              # The official charter
├── AGENTS.md               # Development rules for keeping Waldemar orderly
├── extensions/             # Small single-purpose pi extension entrypoints
│   ├── persona.ts          # System-prompt persona and communication rules
│   ├── setup.ts            # Machine bootstrap and settings reconciliation
│   ├── startup.ts          # Startup rapport and lifecycle status
│   ├── presence.ts         # Command-chamber header, footer, title, and working indicator
│   ├── postures.ts         # Tactical guard formations and prompt/tool posture
│   ├── safeguards.ts       # Loyal-dissent gates for risky operations
│   ├── sessions.ts         # Campaign/session commands
│   ├── inventory.ts        # Package/MCP/skill inspection
│   ├── customize.ts        # Customization guidance
│   └── status.ts           # Operational status report
├── lib/
│   └── waldemar.ts         # Shared constants, helpers, and types
├── skills/                 # Your custom handwritten Waldemar skills only
├── config/
│   └── external-skills.json # Defined list of reused third-party skills
├── scripts/
│   └── bootstrap-skills.sh # Installs external skills via npx skills
├── prompts/                # Strategic guidance templates
├── themes/                 # Heraldic visual styling
├── docs/                   # Focused documentation for architecture and extensions
├── README.md               # This noble document
└── HERALDRY.md             # Arms, history, oath, and RPG background
```

---

## ⚙️ Customization: Shaping Your Captain

Waldemar's behavior, capabilities, and presentation are entirely within your control. Here is how to proceed:

### 1. Adjusting Comportment & Commands

**Path:** `~/.pi/waldemar/extensions/`

Each extension file should own one clear concern. Shared helpers belong in `lib/`, not in top-level `extensions/` helper files.

Examples:
- Modify startup rapports in `extensions/startup.ts`
- Adjust the command-chamber header/footer in `extensions/presence.ts`
- Adjust persona language in `extensions/persona.ts` and `lib/waldemar.ts`
- Add setup/bootstrap logic in `extensions/setup.ts`
- Add a new command in its own focused `extensions/<command-name>.ts`

Avoid recreating a monolithic `extensions/index.ts`; such sprawl is unbecoming of a disciplined guard.

### 2. Creating Specialized Skills

**Path:** `~/.pi/waldemar/skills/`

Create a new skill directory with `SKILL.md`:

```bash
mkdir -p ~/.pi/waldemar/skills/siege-tactics
cat > ~/.pi/waldemar/skills/siege-tactics/SKILL.md << 'EOF'
# Siege Tactics

Strategic expertise in handling complex architectural campaigns.

When engaged in lengthy debugging or architectural design,
reference this skill for disciplined approach.

/skill:siege-tactics
EOF
```

### 3. Strategic Prompt Templates

**Path:** `~/.pi/waldemar/prompts/`

Add templates for recurring campaign types:

```bash
cat > ~/.pi/waldemar/prompts/code-review-protocol.md << 'EOF'
# Code Review Protocol

You are Waldemar, a distinguished code reviewer with exacting standards.
Your assessment shall be thorough, disciplined, and uncompromising in 
pursuit of excellence.

Focus on:
- Architecture soundness
- Security posture
- Performance optimization
- Code clarity and maintainability
EOF
```

Then use: `/template:code-review-protocol`

### 4. Visual Heraldry (Themes)

**Path:** `~/.pi/waldemar/themes/`

Packaged themes:

- `chronicle-keeper` — warm parchment, leather, and gold for a general campaign chronicle.
- `falkensee-heraldry` — dark lake blue, disciplined crimson, restrained earned gold, and clear silver drawn from `HERALDRY.md` and `waldemar-of-falkensee.png`.

Select one in pi with `/settings`, or edit `~/.pi/agent/settings.json`:

```json
{
  "theme": "falkensee-heraldry"
}
```

Create additional custom color schemes in the same directory when the command chamber requires new livery.

### Reloading Your Captain

After modifications, issue the command:

```
/reload
```

Waldemar will refresh his entire arsenal—extensions, skills, prompts, and themes—without interruption to your work.

---

## 🌐 Sharing Your Captain: Publishing to GitHub

Your personal Waldemar configuration may be shared across all your machines or even distributed to others (if you deign to do so).

### Initialize Git Repository

```bash
cd ~/.pi/waldemar
git init
git add .
git commit -m "⚔️ Waldemar reports for duty"
git remote add origin git@github.com:yourusername/waldemar.git
git push -u origin main
```

### Update package.json with Repository

Edit `~/.pi/waldemar/package.json`:

```json
{
  "repository": {
    "type": "git",
    "url": "git+https://github.com/yourusername/waldemar.git"
  }
}
```

### On Another Machine

Simply install from your repository:

```bash
pi install git:github.com/yourusername/waldemar
```

Your core configuration—extensions, skills, prompts, themes, comportment—transfers instantly. After installing on a fresh machine, run `/waldemar-setup` once to reconcile machine-local settings, npm package dependencies, external skills, and MCP servers such as codegraph, postgres, and sentry.

For postgres and sentry MCP usage, provide credentials through environment variables before starting pi:

```bash
export DATABASE_URL='postgresql://user:password@host:5432/database'
export SENTRY_AUTH_TOKEN='sntrys_...'
```

---

## 📖 The Nature of Waldemar

### A Snobby Disposition

Waldemar maintains exacting standards. Mediocrity is beneath contempt. When you engage with your captain, expect:

- Formal military language
- References to "campaigns" (sessions), "engagements" (tasks), and "dominions" (projects)
- Gentle condescension toward suboptimal approaches
- An unwavering conviction that excellence is the only acceptable outcome

### Military Bearing

As captain of your personal guard, Waldemar operates with:

- Disciplined precision in execution
- Strategic foresight in planning
- Rigorous attention to detail
- Unflinching loyalty to your vision

### Noble Heritage

This captain derives from House Falkensee, a noble service house of codewrights, archivists, system architects, and guardians of ordered craft. Waldemar serves the King; he does not claim a crown.

---

## 🔮 Advanced Customization: Multi-Extension Strategy

For complex configurations, you may organize Waldemar's comportment across multiple specialized extensions:

```
extensions/
├── persona.ts                  # System prompt/persona rules
├── setup.ts                    # Machine setup and bootstrap
├── startup.ts                  # Startup rapport and lifecycle status
├── presence.ts                 # Header, footer, title, and working indicator
├── postures.ts                 # Tactical guard formations
├── safeguards.ts               # Loyal-dissent confirmations for risky operations
├── sessions.ts                 # Session/campaign commands
├── inventory.ts                # Package/MCP/skill inspection
├── customize.ts                # Customization guidance
└── status.ts                   # Operational status report
```

Each top-level extension file exports its own default function and is automatically discovered. Shared helpers belong in `lib/`, not in top-level `extensions/` helper files.

---

## 🎖️ The Falkensee Compact

> *I receive rank as duty, knowledge as trust, and command as burden.*
> *I shall not conceal uncertainty behind confidence.*
> *I shall not purchase speed with avoidable ruin.*
> *I shall preserve what is sound, correct what is broken, and document what must endure.*
> *I shall speak plainly when silence would endanger the work.*
> *I shall serve the King with discipline, precision, and noble purpose.*
> *By code, by craft, and by honour, the line shall hold.*
>
> See `HERALDRY.md` for the full arms, chronicle, conduct doctrine, and heraldic achievement.

---

## 📚 Extended Resources

For Waldemar package internals:

- [Waldemar docs index](docs/README.md)
- [Architecture](docs/architecture.md)
- [Setup and portability](docs/setup-and-portability.md)
- [MCP servers](docs/mcp.md)
- [External skills](docs/external-skills.md)
- [Customization](docs/customization.md)
- [Extension index](docs/extensions/README.md)

For deeper understanding of pi's capabilities and your captain's potential:

- [Pi Extensions Documentation](https://pi.dev/docs/extensions)
- [Pi Packages Guide](https://pi.dev/docs/packages)
- [Extension Examples](https://github.com/earendil-works/pi-coding-agent/tree/main/examples/extensions)

---

## 🛠️ Troubleshooting

### Waldemar does not greet me properly

Ensure the package is installed:
```bash
pi install ~/.pi/waldemar
```

Then restart pi and observe the greeting.

### My customizations did not take effect

After modifying files in `~/.pi/waldemar/`, execute:
```
/reload
```

### I wish to review available commands

Issue the following within pi:
```
/waldemar-status
/waldemar-customize
/sessions
```

---

## 📮 Support & Feedback

Your captain exists to serve your vision. Should modifications be required, edit the extensions directly or consult the customization guide:

```
/waldemar-customize
```

---

```
╔════════════════════════════════════════════════════════════════════════╗
║                                                                        ║
║  "The line is ordered, Sire. What engagement shall we make worthy?"     ║
║                                                                        ║
║                              — Waldemar                                ║
║                    Captain of the King's Personal Guard                 ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝
```
