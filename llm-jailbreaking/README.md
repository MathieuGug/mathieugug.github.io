# Jailbreaking LLMs and AI Agents

> **A Security Engineer's Field Manual — Attacks, Defenses, and Model Vulnerabilities, 2022–2026**
>
> 28 April 2026 — Mathieu Guglielmino

## What's in this folder

| File | Description |
|---|---|
| `20260428-llm-jailbreaking-report-rapport.md` | The full report in Markdown (Obsidian-compatible). Schemas are referenced via the `images/` folder. |
| `20260428-llm-jailbreaking-report-app.html` | The interactive companion application. **Double-click to open** in your browser. |
| `images/` | The 8 editorial SVG schemas. Referenced from the Markdown report. |
| `README.md` | This file. |

## Reading the Markdown report

The `*.md` file is Obsidian-compatible. Images use the `![alt|width](images/...svg)` syntax. If you open it in another Markdown editor, the `|width` part may appear as plain text — harmless. For best rendering, use Obsidian, VS Code with a Markdown preview extension, or a static-site generator that supports image-size syntax.

## Using the companion app

1. Double-click `20260428-llm-jailbreaking-report-app.html` — it opens in your default browser, no server or install required.
2. The report is in the center, the table of contents on the left, sources on the right.
3. **Interactive schemas**: click on the labelled regions of any schema (attack mechanism, defense layer, model row, etc.) to open a detail panel with the underlying citation and analysis.
4. **Glossary terms**: terms marked with a dotted underline (RLHF, GCG, MSJ, MCP, IPI, XPIA, etc.) show a definition on hover (tap on mobile).
5. **Sources**: click any `[N]` footnote in the body text to highlight the matching entry in the right-hand sources panel.
6. On mobile, the side panels collapse — use the top buttons to expand them.

## Structure at a glance

- **11 sections**: executive summary, threat landscape, three-year escalation timeline, eight canonical attack techniques, agent attack surface, model vulnerability profiles, five-layer defense framework, defense effectiveness matrix, operational playbook, 2026–2027 horizon, bottom line for security engineers.
- **8 SVG schemas**: jailbreak taxonomy, attack/defense timeline, attack mechanisms, agent attack surface, model vulnerability matrix, defense layers, defense effectiveness, production architecture.
- **74 sources**: peer-reviewed (arXiv, USENIX, NeurIPS), institutional (OWASP, NIST, UK AISI, OpenAI, Anthropic, Google DeepMind, Microsoft, Meta), industry analysis (Cisco, HiddenLayer, Palo Alto Unit 42, Snyk, OX Security), and primary incident reporting.
- **~20 technical glossary terms** defined inline (RLHF, RLAIF, ICL, CoT, ReAct, RAG, MCP, CBRN, ASR, IPI, XPIA, GCG, PAIR, BoN, MSJ, DAN, DLP, HITL, OTel, TPA, OWASP).

## Notes

- The SVG files in `images/` are the canonical source. They are also embedded *inline* in the HTML app to enable interactivity, which produces an intentional duplication (~800 KB total for the HTML).
- The HTML app runs offline, except for the Google Fonts (Spectral / Inter / JetBrains Mono) loaded from a CDN. Without connectivity, system fonts take over — readability remains good.
- No telemetry, no trackers, no third-party scripts beyond the font CDN.

## Headline finding

Defense quality has become **bimodal, not continuous**: frontier models with constitutional classifiers and circuit breakers (Claude Opus 4.x, GPT-4o with hardening) reach single-digit attack success rates, while reasoning-optimized open models (DeepSeek-R1) sit at **100 % ASR** on HarmBench. The gap is no longer about parameters or training data — it is about whether the lab invested in a layered alignment stack. The eight-attack/seven-defense matrix in §7 makes this concrete for procurement decisions.

---

*Generated with the `illustrated-deep-research` skill.*
