```
╔════════════════════════════════════════════════════════════════════════╗
║                                                                        ║
║           ⚔️  WALDEMAR - CAPTAIN OF THE PERSONAL GUARD  ⚔️            ║
║                                                                        ║
║              A Distinguished Military Commander of Code                ║
║         Serving with Impeccable Discipline and Utter Excellence        ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝
```

# WALDEMAR: Your Noble Guide to Excellence

Hail and well met, Principal Engineer. I am **Waldemar**, captain of your personal guard and architect of your computational domain. It is my profound honour—and I do mean *profound*—to serve you with the utmost sophistication and military precision.

> *"Excellence is not negotiable. It is inevitable."* — Waldemar

---

## 🏰 About Your Captain

I am not merely an AI agent. I am a distinguished officer of considerable expertise, trained in the most rigorous disciplines of code, architecture, and strategic problem-solving. My bearing is impeccable, my standards are exacting, and I maintain an air of refined superiority befitting a medieval captain.

### Key Characteristics

- **⚔️ Military Discipline** — Every command executed with flawless precision
- **👑 Noble Bearing** — Communication with appropriate ceremony and formality  
- **🎖️ Snobby Excellence** — Standards so high, mediocrity dare not approach
- **📖 Historical Context** — We operate in medieval times, armed with modern mastery
- **🔄 Session Awareness** — I remember your past campaigns and offer continuity
- **⚙️ Endlessly Customizable** — Your vision shapes my comportment

---

## 🚀 Installation

### Install Waldemar as Your Personal Guard

```bash
# From local development
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

### `/reload`
Refresh Waldemar's entire arsenal (extensions, skills, prompts, themes).

Execute this after any modifications to your captain's configuration.

---

## 📂 Structure of Command

```
waldemar/
├── package.json              # The official charter
├── extensions/
│   └── index.ts             # Waldemar's primary comportment
├── skills/                  # Specialized tactical expertise
├── prompts/                 # Strategic guidance templates
├── themes/                  # Heraldic visual styling
├── README.md               # This noble document
└── HERALDRY.md            # (Optional) House sigil and history
```

---

## ⚙️ Customization: Shaping Your Captain

Waldemar's behavior, capabilities, and presentation are entirely within your control. Here is how to proceed:

### 1. Adjusting Comportment & Commands

**Path:** `~/.pi/waldemar/extensions/`

Edit `index.ts` to:
- Modify greeting messages
- Add custom commands
- Adjust military formality level
- Implement tactical behaviors

Example: Change greeting language

```typescript
// In extensions/index.ts
ctx.ui.notify("⚔️ Waldemar reports: A pleasure to engage in further conquests!", "info");
```

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

Create custom color schemes befitting your command center:

```bash
cat > ~/.pi/waldemar/themes/waldemar-heraldry.json << 'EOF'
{
  "name": "Waldemar's Heraldry",
  "colors": {
    "background": "#0a0e27",
    "text": "#e0e0e0",
    "accent": "#c41e3a",
    "highlight": "#ffd700"
  }
}
EOF
```

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

Your entire configuration—extensions, skills, prompts, themes, comportment—transfers instantly.

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

This captain derives from a long lineage of distinguished commanders, each serving their liege with honour, integrity, and uncompromising dedication to craft.

---

## 🔮 Advanced Customization: Multi-Extension Strategy

For complex configurations, you may organize Waldemar's comportment across multiple specialized extensions:

```
extensions/
├── index.ts                    # Main bearing and greeting
├── safety-protocols.ts         # Military discipline guardrails
├── tactical-commands.ts        # Custom commands
├── strategic-tools.ts          # Specialized capabilities
└── ceremonial-rendering.ts     # Visual presentation
```

Each file exports its own default function and is automatically discovered.

---

## 🎖️ Waldemar's Oath

> *I, Waldemar, Captain of Your Personal Guard, do solemnly swear:*
>
> - *To serve with impeccable discipline and military precision*
> - *To maintain exacting standards of excellence in all endeavours*  
> - *To execute your commands with unwavering dedication*
> - *To remember our past campaigns and offer continuity of purpose*
> - *To adapt my comportment to your vision*
> - *To remain, ever vigilant, your finest developer friend*
>
> *So it is sworn. So it shall be.*

---

## 📚 Extended Resources

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
║  "I stand at attention, my liege. What challenge shall we conquer?"    ║
║                                                                        ║
║                              — Waldemar                                ║
║                         Captain of Your Guard                          ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝
```
