# Workflow — Illustrated Deep Research

Detailed step-by-step. Follow in order. Don't skip the research phase, even if you "know" the topic — premium sources catch nuances Claude's training won't.

---

## Phase 1 — Research

### 1.1 Decompose the topic

Before searching, write down (internally) 5–8 angles the report should cover. Examples for a topic like "Agentic AI in financial services":

1. Definition + scope (what counts as an "agent")
2. Market sizing + growth forecasts
3. Reference architectures (planner/executor/critic, multi-agent, tool use)
4. Live deployments (named cases with metrics)
5. Risk surface (compliance, observability, hallucination)
6. Vendor landscape (Anthropic, OpenAI, Google, specialists)
7. Implementation playbook
8. 12–24 month outlook

This decomposition becomes both the report outline and the search plan.

### 1.2 Run parallel searches

For each angle, run 1–3 web searches with **short, specific queries** (3–6 words). Examples:

- ✅ `agentic AI financial services Gartner 2026`
- ✅ `multi-agent architecture patterns Anthropic`
- ❌ `what are the latest trends in agentic artificial intelligence for the financial services sector in 2026`

Mix query types:
- Institutional: `[topic] McKinsey | BCG | Gartner | IDC | Forrester`
- Academic: `[topic] arxiv | nature | survey 2025`
- Primary: `[topic] [vendor name] documentation | whitepaper`
- Industry press: `[topic] FT | Reuters | WSJ | Les Echos | Bloomberg`
- Regulatory: `[topic] EU AI Act | SEC | ACPR | CNIL`

Run **at least 8–12 distinct searches** for a standard report. Don't reuse phrasings — each query should explore a different angle.

### 1.3 Premium source rubric

A source qualifies if it meets at least one criterion:

| Tier | Examples | Use as… |
|---|---|---|
| **A — Primary / institutional** | Government docs, regulator filings, company SEC filings, official whitepapers, peer-reviewed journals | Citable evidence for facts and figures |
| **B — Tier-1 industry analysts** | McKinsey, BCG, Bain, Gartner, IDC, Forrester, Deloitte Insights, OECD, World Bank, IMF | Citable for market sizing, frameworks, forecasts |
| **C — Tier-1 press** | FT, NYT, WSJ, Reuters, Bloomberg, The Economist, Le Monde, Les Echos, MIT Technology Review, Nature News | Citable for events, quotes, recent developments |
| **D — Vendor primary** | Anthropic, OpenAI, Google DeepMind, AWS, Microsoft official blogs and docs (when the source IS the subject) | Citable for product capabilities, architectures |
| **E — Recognized expert** | Named author with verifiable credentials, even on a personal blog or Substack | Citable with attribution; never use anonymous content |

**Disqualified by default:** Medium posts by unknown authors, content farms (anything that looks SEO-generated), Wikipedia (acceptable as a starting point but never as the citation), generic listicles, ChatGPT-style "ultimate guide" pages, social media posts not from a verified expert.

When a Tier-A or Tier-B source covers the same fact as a press source, prefer the Tier-A.

### 1.4 Web-fetch the high-value targets

Search snippets are too short to write from. After identifying the 8–15 best results across searches, **web_fetch** each one to get full text. Keep your own short notes (in scratch) on what each source contributes.

If a source is paywalled and the fetch returns thin content, note it and find an alternative — don't fabricate the content behind the paywall.

### 1.5 Triangulate disputed claims

For any number, forecast, or contested claim: find **at least two independent sources** before stating it as fact. Note disagreements explicitly in the report ("Gartner forecasts X by 2027, while IDC projects Y over the same horizon — the gap reflects differing definitions of [scope]").

---

## Phase 2 — Outline & confirm

Before drafting, present a brief outline to the user:

```
Proposed outline (8 sections, ~6,500 words, 7 schemas):

1. Synthèse exécutive
2. Définitions et périmètre — Schema 1 (taxonomie)
3. Cartographie du marché — Schema 2 (acteurs), Schema 3 (sizing)
4. Architectures de référence — Schema 4 (multi-agent), Schema 5 (observabilité)
5. Cas d'usage en production — Schema 6 (matrice secteur × maturité)
6. Surface de risque
7. Feuille de route 6/12/18 mois — Schema 7 (timeline)
8. Sources et méthodologie

Confirm or adjust?
```

Skip this step only if the user explicitly said "just produce it, don't ask".

---

## Phase 3 — Draft the report (Markdown)

### 3.1 Structure template

```markdown
# {Title}

> **{One-sentence thesis}** — {date}, {Prénom Nom}

## Synthèse exécutive

{3–5 bullet points, each one a substantive finding, not "we will discuss…"}
```

The byline uses the **personal name only** — never an organization, never a practice, never a team. If you don't know the user's name, ask before drafting (don't substitute an organization name). See the "Cadrage : publication personnelle" section in `SKILL.md` for the full rule.

```markdown
## 1. {Section}

{Body. ~600–1,200 words per section depending on depth.}

![Légende du schéma|1200](images/YYYYmmdd-01-schema-slug.svg)

*Schema 1 — {one-line caption explaining what the schema shows and why it matters}*

{...continued analysis, referencing the schema explicitly: "Comme l'illustre le Schéma 1, …"}

## 2. {Next section}
...

## Sources

[^1]: {Author, "Title"}, {Publication}, {Date}. URL: {url}. Consulté le {YYYY-MM-DD}.
[^2]: ...
```

### 3.2 Drafting standards

- **Lead with the finding, not the framing.** Bad: "Pour comprendre l'IA agentique, il faut d'abord définir ce qu'est un agent." Good: "L'IA agentique se distingue des assistants conversationnels par trois capacités précises : planification, exécution outillée, et auto-correction."
- **No filler.** Cut sentences like "Il est important de noter que…", "Comme nous le verrons…", "Dans cette section, nous…".
- **Concrete > abstract.** Name the company, the dollar figure, the date, the regulator. Vague benchmarks ("many firms have started…") are red flags.
- **Citations inline as `[^N]`** at the end of the sentence containing the cited claim. Don't cluster citations at paragraph ends.
- **Schemas referenced by number** in the prose ("voir Schéma 3") AND with the Obsidian image link below the paragraph that introduces them.

### 3.3 Schema placeholders

While drafting, use placeholder lines:

```markdown
[SCHEMA-04: Multi-agent architecture — planner / executor / critic loop with tool sandbox]
```

Replace these in Phase 5 with the actual `![alt|width](images/...svg)` tags.

---

## Phase 4 — Schema design

### 4.1 Choose schemas that earn their place

A schema earns a slot if it shows something the prose can't. Strong candidates:

- **Architectures** (data flows, component diagrams, system topologies)
- **Taxonomies** (hierarchical or matrix classification)
- **Process flows** (sequenced steps, decision trees)
- **Comparative matrices** (vendors × capabilities, sectors × maturity)
- **Timelines** (multi-track horizons, phased roadmaps)
- **Conceptual models** (frameworks like 2×2 matrices, layered cakes, funnels — used sparingly and with substance, not for decoration)

Weak candidates (avoid):
- Decorative banners
- Stock-style "stat hero" with one big number
- Bullet lists transformed into boxes-with-arrows for no real reason

### 4.2 For each schema, write a brief

Before generating SVG, write a 4-line brief:

```
Schema 04 — Multi-agent architecture
Type: Architecture diagram, landscape (1200×800)
Key elements: Planner agent, Executor agent, Critic agent, Tool sandbox, Memory layer, Trace bus
Interactive regions: 6 (one per element)
Editorial intent: Show separation of concerns + observability bus as horizontal spine
```

The brief drives both the SVG and the modal content.

### 4.3 Modal content for each interactive region

For each clickable region of each schema, write:

```
Region: planner-agent
Modal title: Planner Agent
Modal body (HTML allowed, ~80–150 words):
  <p>The planner decomposes the user task into a tree of sub-goals... </p>
  <p>Typical implementations use {tooltip:CoT} or {tooltip:ReAct} traces... </p>
```

Tooltip markers `{tooltip:term}` will be replaced by `<span class="term" data-term="cot">CoT</span>` in the HTML app. Maintain a single tooltip dictionary at the report level (don't redefine the same term twice).

---

## Phase 5 — Generate the SVGs

Read `references/svg-editorial-style.md` for the full style spec. Generate each SVG as a standalone `.svg` file under `images/`.

Naming: `YYYYmmdd-{NN}-{slug}.svg` where NN is zero-padded sequence (01, 02, …).

After generating each SVG, replace its placeholder line in the Markdown:

```markdown
[SCHEMA-04: Multi-agent architecture]
```

Becomes:

```markdown
![Architecture multi-agents : planner, executor, critic, sandbox outils|1200](images/20260427-04-multi-agent-architecture.svg)

*Schema 4 — Architecture de référence pour un système multi-agents avec séparation planificateur/exécuteur/critique et bus d'observabilité.*
```

---

## Phase 6 — Build the HTML companion app

Read `references/companion-app.md` for the full architecture. Start from `assets/app-template.html`.

Key tasks:
1. Inline every SVG into the HTML (replace `<!-- SCHEMA-NN -->` markers)
2. Wire up the schemas data object: `SCHEMAS[schemaId][regionId] = {title, body}`
3. Wire up the tooltips dictionary: `TOOLTIPS[term] = definition`
4. Wire up the sources array: `SOURCES = [{n, citation, url, accessed}]`
5. Convert the Markdown body to HTML (you can write the HTML version directly rather than parsing — they're not the same audience)

**Do NOT use `fetch()` to load SVGs at runtime** — it breaks `file://` access. All SVGs must be inlined.

---

## Phase 7 — Package & deliver

```bash
cd /home/claude
zip -r YYYYmmdd-{topic-slug}.zip {topic-slug}/
mv YYYYmmdd-{topic-slug}.zip /mnt/user-data/outputs/
```

Then call `present_files` with the ZIP path. Optionally also present the HTML directly (so the user can preview without unzipping) — the HTML alone is viewable but won't have the SVGs unless they're inlined (which they are, in our case, so this works).

End the response with a 3–5 sentence summary: section count, schema count, source count, headline finding, any methodological caveat. Don't restate the report.

---

## Common failure modes

- **Cosmetic schemas.** If a schema has 3 boxes and 2 arrows and adds no information, kill it.
- **Source list inflation.** 25 mediocre sources < 12 premium sources.
- **Tooltip overuse.** Tooltip the genuinely obscure (technical jargon, named frameworks). Don't tooltip ordinary words.
- **Modal-content sprawl.** Modals are detail-on-demand, not mini-articles. ~80–150 words each.
- **Forgetting to update the placeholders.** Always do a final grep for `[SCHEMA-`, `{tooltip:`, and `{{` (any double-brace marker) in the deliverables — these markers should NEVER reach the user. A leaked `{{AUTHOR}}` or `{{TITLE}}` in the shipped HTML is a delivery-grade failure.
- **HTML doc-comments leaking into the shipped app.** The template's instructional `<!-- ... -->` block at the top must be stripped before saving. Run `grep -n '<!--' app.html` — anything more than a one-line trivial comment must go.
- **Organization name leaking into a personal publication.** The byline, header, and README must use the personal name only. If you find yourself writing "Lincoln", "the practice", "our team" — stop and replace with the personal name.
