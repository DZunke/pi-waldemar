---
name: write-documentation
description: Write technical documentation as a properly decomposed documentation set in the author's own voice, and enforce both file architecture and voice as gates before delivery. Use when creating or rewriting READMEs, concept docs, cookbooks, how-to guides, architecture notes, onboarding pages, or any explanatory prose. Triggers include "write documentation", "document this feature/component", "turn this into a doc", "write a README", "explain this for the wiki", or when a draft needs to be reshaped to match the author's tone. First discovers the project's conventions, plans a file layout with a coverage matrix, drafts, then self-reviews against the structure gate and the prose gate.
---

# Write Documentation

## Overview

This skill produces documentation that is both correctly decomposed into files and written in the author's own voice. Two things must be right, and they are checked in this order.

First comes **architecture**: a component of any real size is a documentation *set*, not a single page. The most common failure of an assistant is to collapse everything into one large README because that feels safe and complete. It is not. It buries the reader. This skill exists first to prevent that collapse. This mirrors how the author actually structures a large component: one conceptual hub and many focused pages, with the mechanics and payloads pushed down into the views.

Second comes **voice**: once the files are laid out correctly, each page is written in the author's tone so a reader cannot tell a human from an assistant wrote it.

There are two gates at the end of this file: a Structure Gate and a Prose Gate. Run the Structure Gate first. A beautifully written single page that should have been five pages still fails.

## When to Use This Skill

Use this skill when you are asked to:

- Write a new README, concept document, cookbook, how-to guide, or onboarding page.
- Document a feature, component, service, endpoint, or workflow.
- Turn rough notes, a ticket, or a code change into readable prose.
- Rewrite an existing draft so it matches the author's tone and the project's conventions.

Do not use it for terse reference output that has no prose (for example a pure changelog line or a one-line code comment). The voice needs sentences to live in.

## Output Contract

Documenting a component or module produces a **documentation set**, not a single page. Unless the subject is genuinely tiny (see the File Layout Decision), you always deliver:

- **One hub page** (the top-level README or landing page) that introduces the whole component.
- **One leaf page per major concept** (see Major Concepts below).
- **Updated existing related pages** where they already cover a concept you touch.
- **Cross-links** so the hub links to every leaf and every leaf links back to the hub.

Delivering a single file for a medium or large component is a failure of this contract, no matter how good the prose is. If you are tempted to keep adding sections to the README, that is the signal to split them into leaf pages.

## Workflow

Follow these stages in order. The planning stages come before any prose, on purpose: the file architecture is decided before a single page is written.

### 1. Discover the documentation landscape

Learn how this project already documents itself. Search the repository and any linked knowledge base and answer these questions:

- **Where do docs live?** A `docs/` tree, README files next to code, a wiki, a generated site, or a mix. Put new pages where their neighbours already live.
- **What tooling renders them?** Look for signals such as `mkdocs.yml`, Sphinx `toctree` blocks, Docusaurus config, GitBook, or plain Markdown. Match the syntax that tooling expects, including how tables of contents and cross-links are written.
- **What is the naming and heading convention?** File naming (kebab-case, snake_case), heading depth, and whether pages open with a metadata block or a table.
- **How are related pages linked?** Relative links, absolute wiki links, or reference sections at the bottom. Reuse the same linking style.
- **Which sibling components have good, multi-page documentation?** Read two or three and mirror how they split files. Consistency with siblings beats personal preference.

Record what you find in a sentence or two so later stages can honour it.

### 2. Discover the domain and gather evidence

When the component implements a standard, a protocol, or a domain concept (a media type, a specification, an algorithm, a regulatory rule), understand the domain before you explain it. A shallow hub is almost always the result of skipping this stage. Collect:

- **Which standard, protocol, or domain concept applies, and why.** Name it exactly.
- **Which platform constraints made this choice necessary.**
- **What alternatives were considered, and the tradeoffs.**
- **Which exact parts of the code implement the behavior.** The entry points a reader can open.
- **At least two external authoritative references** and **at least two internal implementation references.**

Verified links only; never invent a specification URL or a file path. What happens when this evidence is missing is defined once, in the gates.

### 3. Assess complexity and plan the file layout

This is the stage that prevents the one-page collapse. Do it before drafting.

1. List every **major concept** the component contains (use the Major Concepts list).
2. Pick a **complexity tier** and the file count it demands (see the File Layout Decision).
3. Build the **Coverage Matrix**: map every concept to the exact file that will carry it.
4. Check for **existing pages** that already cover a concept, and mark them for update rather than duplication.

Do not proceed to drafting until every major concept has a home file in the matrix.

### 4. Identify the reader and the purpose

For each page in the matrix, state in one line who reads it and what they can do afterwards. A page without a known reader drifts into filler.

### 5. Draft each page in the author's voice

Write each planned file, applying the Voice and Tone Principles. The hub carries the Introduction Contract; each leaf opens with a short introduction of its own concept and then goes into the detail.

### 6. Update overlapping existing docs

Where the Coverage Matrix flagged an existing sibling page, update it and cross-link it. Do not leave a stale page that overlaps with new content.

### 7. Run the gates

Run the **Structure Gate** first, then the **Prose Gate**. Fix every failing item before delivery.

## File Layout Decision

The number of files is a deliverable contract, not optional guidance. Judge complexity by counting the major concepts the component exposes, then match the tier:

| Complexity | Signals | Required layout |
| --- | --- | --- |
| **Small** | one or two major concepts, a single entry point, few options | 1 hub + 1 to 2 leaf pages (or a single hub page only if truly trivial) |
| **Medium** | three to five major concepts (for example a runtime flow plus usage plus one extension point) | 1 hub + 3 to 5 leaf pages |
| **Large** | six or more major concepts, or distinct sub-areas each with several concepts | 1 hub + section index pages + 6 or more leaf pages |

If in doubt between two tiers, choose the one with more files. Splitting is cheap for the reader; a wall of text is not.

## Major Concepts and Split Triggers

### What counts as a major concept

A major concept is any distinct thing a reader would seek on its own. Treat each of these as a major concept that earns its own page:

- The **runtime pipeline** or lifecycle (how input becomes output).
- **Request or usage semantics** (how a developer calls or returns from it).
- **Extension points** (how to plug in custom behavior).
- **Error behavior** (how failures are shaped and reported).
- Any **domain-specific feature** (for example meta fields, permissions, pagination).

Each major concept gets its own page, unless an existing sibling page already covers it, in which case you update that sibling.

### Split triggers

Move content out of a page into its own leaf page as soon as any of these is true:

- The section carries **step-by-step implementation details**.
- The section has **more than one code example**.
- The section addresses **one extension point deeply**.
- A **glossary exceeds eight terms** (keep a short glossary on the hub, move the extended one to its own page).

### README size budget

The hub narrative (everything before the references and link sections) should target **350 to 700 words**. If it grows past that, you are holding leaf content in the hub. Move those sections into leaf pages and leave a one-paragraph summary plus a link behind.

## The Coverage Matrix

Before drafting, produce a matrix that maps every concept to a target file. This is the artefact that proves the work was not collapsed into one page.

| Concept | Target file | New or existing | Reason (only if shared) |
| --- | --- | --- | --- |
| What it is, why, glossary, canonical example | `README.md` (hub) | new | — |
| Runtime pipeline | `docs/pipeline.md` | new | — |
| Usage in controllers | `docs/usage.md` | existing (update) | — |
| Error behavior | `docs/errors.md` | new | — |

If two or more concepts map to the **same** file, you must write a reason in the last column. Absent a stated reason, give each concept its own file. This single rule is what stops accidental collapse.

## Updating Existing Docs

Documentation rarely starts from an empty folder. When sibling pages already exist:

- **Update and cross-link them** instead of writing a parallel page that competes.
- **Do not leave an existing page untouched** when your new hub overlaps its topic. A meta-fields page that is not updated when you rewrite the hub is a defect, not a courtesy left alone.
- When you move a concept out of an old page, leave a short pointer so old links still lead somewhere useful.

## One Hub, Many Views

Exactly one page introduces the whole component: the hub. Every other page is a specific view of one concept. This is the shape the author uses consistently: one larger introduction to the topic, then focused pages that each open with their own short introduction and reason for existing.

- **The hub, one per component or module.** The top-level README or landing page. Carries the Introduction Contract (what it is, key concepts, purpose, responsibilities, when to use it, cross-cutting goals) and the table of contents that points to the views. Concrete examples and payloads usually live on the leaf pages, not the hub.
- **Section index pages.** When a group of views needs its own folder, its index introduces only that section (for example "how rendering works"), and points to the leaf pages under it.
- **Leaf view pages.** Each is welcome, and expected, to open with two or three sentences that say what this specific concept is and why it exists. That short local context is good. What a leaf must not do is restate the whole-component domain grounding or repeat the full glossary; a one-line pointer back to the hub is enough.

For the whole-component "what and why", link back rather than repeat:

> For what X is and why we utilize it, start at the [component introduction](...).

## The Introduction Contract

The hub page carries a contract with its reader. A hub that is only a sentence or two plus a table of contents breaks it. A thin hub is a bug, not brevity. At the same time the hub stays conceptual: it explains the component and sends the reader to the leaf pages for the mechanics. Keep request/response payloads and long code out of the hub and inside the views.

The hub must always deliver:

- **What this component is.** An opening paragraph, plainly, in one or two sentences.
- **Key concepts.** A short bullet list of the two to four ideas a reader must hold to understand the rest. This is the author's signature hub element.
- **The purpose, and why it exists.** The reasoning behind the approach and the problem it removes in this platform.
- **Responsibilities and building blocks.** What the component is made of and what it owns.
- **When to use it, and when to prefer the alternative.** Decision guidance, naming the sibling approach a reader should choose instead in the other case.
- **Cross-cutting goals or boundaries.** The longer-term objectives, and what the component deliberately does not do.
- **Further reading.** Links to the leaf pages and to external references.

The hub delivers these only when the subject warrants them:

- **A short glossary**, when the domain carries vocabulary a newcomer will not know. If the "Key concepts" bullets already carry that vocabulary, a separate glossary is not required.
- **A concrete example.** Required for a standards or protocol component, where the hub shows one real request and response. For other components the canonical example usually lives on the relevant leaf page; do not force a payload onto a conceptual hub.
- **Authoritative references.** For a standards-based component, at least two external authoritative references and at least two internal implementation references (see the domain evidence in Workflow stage 2).

Keep the hub within the word budget. If a "how" section grows code blocks or step-by-step detail, that is a leaf page, not hub content.

## Voice and Tone Principles

Once the file architecture is right, write each page in the author's voice. These are strong preferences that shape the prose; they never override the structural contract above. Apply them naturally rather than mechanically.

1. **Reason before mechanics.** Open a topic by explaining why it exists and the thinking behind the design, then move to how it works. State tradeoffs and philosophy openly.
2. **Speak to the reader directly.** Address the reader as "you"; refer to the team as "we". The register is a senior colleague guiding a peer, not a manual narrating at a distance.
3. **Ask the reader's questions out loud, then answer them.** Turn natural questions into headings or inline prompts ("Do we really need it?", "Why?", "So how is it done?") and answer them plainly.
4. **Give decision guidance, not just description.** Where a reader must choose, spell out when to use one option and when the other, with tradeoffs.
5. **Be honest about limits.** Name the gaps, the stopgaps, the rough edges, and why they exist.
6. **Ground every abstraction in a concrete example.** Follow a general statement with a named, specific example.
7. **Stay warm and collegial.** Short interjections ("So!", "For sure", "Sadly,", "Have in mind that") are welcome in moderation.
8. **Point to people and further reading.** Cross-reference generously; say who to consult when unsure.
9. **Close by inviting contribution.** End explanatory pages with an encouragement to keep the documentation alive.

### Characteristic vocabulary

Reach for these where they fit naturally, without forcing them or repeating one word until it grates:

- "utilize" / "utilized" (a strong signature; preferred over "use" in explanatory prose)
- "deliver" / "delivers", "generic", "be aware", "have in mind", "please note", "for sure", "in result", "the good part about ..."
- "it is recommended to", "it is possible to", "in the best possible way"

These are flavour, not a mandate. Clarity always outranks hitting a word.

## Per-Page Structure Blueprint

Use this skeleton for an individual page, then bend it to the project's conventions.

1. **Title** that names the subject plainly.
2. **Opening context paragraph.** For the hub, this fulfils the Introduction Contract. For a leaf, this is the short concept intro plus a pointer back to the hub.
3. **Orientation aids for longer pages.** A short contents list, or a compact metadata table where the project uses that pattern.
4. **Thematic sections.** Group by concept, often with headings phrased as questions or imperatives. Reason first, then mechanics, then a concrete example.
5. **Examples and code blocks.** Real, named examples. Fenced blocks for code and payloads, tables for mappings or reference data.
6. **Actionable checklists.** For procedures, a numbered step-by-step list.
7. **Further reading and references.** Cross-links to related pages and external sources, in the project's linking style.
8. **Maintenance note** inviting the reader to keep the page current.

## Structure Gate

Run this gate **first**, before the Prose Gate. If any item fails, restructure before delivering. If the domain evidence for the hub cannot be found, deliver what you can and mark the hub incomplete with a clear note of exactly what a human must supply. This is the single authoritative blocking rule; it is stated only here.

- [ ] A complexity tier was chosen and the number of files matches the File Layout Decision.
- [ ] The component was **not** collapsed into a single file when it is medium or large.
- [ ] A Coverage Matrix exists and every major concept maps to a home file.
- [ ] Any file carrying two or more concepts has a stated reason.
- [ ] Exactly one hub page introduces the whole component.
- [ ] Every major concept has its own leaf page, or an existing sibling that was updated.
- [ ] The hub links to every leaf, and every leaf links back to the hub.
- [ ] No leaf is orphaned (each is reachable from the hub's table of contents).
- [ ] The hub narrative is within the 350 to 700 word budget; overflow was moved to leaf pages.
- [ ] Overlapping existing pages were updated, not left stale.

## Prose Gate

Run after the Structure Gate passes.

**Hub depth**

- [ ] Opens by stating plainly what the component is.
- [ ] Carries a short "Key concepts" list of the ideas needed to follow the rest.
- [ ] States the purpose: why it exists and the problem it solves in this platform.
- [ ] Lists the responsibilities or building blocks the component owns.
- [ ] Gives "when to use it" guidance, including when to prefer the sibling alternative.
- [ ] Names cross-cutting goals or boundaries (what it does not do).
- [ ] Closes with further reading that links every leaf page.
- [ ] Standards-based component only: carries a concrete request/response example plus at least two external and two internal references. For other components, a glossary and payloads may instead live on leaf pages.

**Voice**

- [ ] The page leads with the "why" and the context before the "how".
- [ ] The reader is addressed as "you"; the team is "we".
- [ ] At least one section is framed as a reader's question that then gets answered.
- [ ] Where the reader must choose, the page gives when-to-use guidance and tradeoffs.
- [ ] Every abstract claim is anchored by a concrete, named example.
- [ ] Limits and tradeoffs are named honestly where they exist.
- [ ] The register is warm and collegial, and signature vocabulary appears naturally without overuse.

**Fit**

- [ ] Files live where the project keeps comparable docs.
- [ ] Markdown, cross-link syntax, naming, and heading depth match the sibling pages.
- [ ] Every cross-reference points to a real, existing target.

## Anti-patterns to Avoid

- Collapsing a medium or large component into a single kitchen-sink README. Split by major concept.
- Skipping the Coverage Matrix and drafting straight into one file.
- Leaving an existing sibling page stale when the new hub overlaps its topic.
- Opening with mechanics or a feature list before the reader knows why the thing exists.
- Flat, impersonal narration that never addresses the reader.
- Abstract explanation with no concrete example to anchor it.
- Hiding limitations or overselling; the voice is honest, not promotional.
- Inventing links, teams, or file paths. Reference only verified targets.
- Forcing signature words until the prose turns mechanical. The voice is natural first.
- A leaf page that restates the whole-component domain grounding instead of linking back to the hub.
