/* ═════════════════════════════════════════════════════════════
   BOOK SCHEMAS — redrawn, book-native, for the schemas section
   Each schema is a compact SVG that fits a ~620×540 panel.
   ═════════════════════════════════════════════════════════════ */

const SCHEMAS = [
  // ───── SCHÉMA · COUCHE 01 · ReAct loop ─────
  {
    layerIdx: 1,
    layerLabel: 'Couche 01 · Agent Loop',
    title: "La boucle <em>ReAct</em>",
    subtitle: "Reason → Act → Observe. La primitive fondamentale (Yao et al., ICLR 2023), généralisée aujourd'hui par le champ <code>stop_reason</code> des APIs modernes.",
    source: "Yao et al. 2022 · Anthropic Messages API",
    svg: `<svg viewBox="0 0 620 540" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="sch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#3b3f4d"/>
        </marker>
      </defs>
      <style>
        .sch-box { fill: #faf6ec; stroke: #1e1e2a; stroke-width: 1.3; }
        .sch-box-accent { fill: #fdf1e7; stroke: #D26E3E; stroke-width: 1.5; }
        .sch-label { font-family: 'Fraunces', serif; font-size: 14px; fill: #1e1e2a; font-weight: 500; text-anchor: middle; }
        .sch-emph { font-family: 'Fraunces', serif; font-style: italic; font-size: 22px; fill: #1e1e2a; text-anchor: middle; font-weight: 400; }
        .sch-sub { font-family: 'Inter', sans-serif; font-size: 10.5px; fill: #6b6f7c; text-anchor: middle; font-weight: 300; }
        .sch-code { font-family: 'JetBrains Mono', monospace; font-size: 10px; fill: #1e1e2a; text-anchor: middle; }
        .sch-arrow { stroke: #3b3f4d; stroke-width: 1.1; fill: none; }
        .sch-flow-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; fill: #6b6f7c; letter-spacing: 0.1em; text-transform: uppercase; text-anchor: middle; }
        .sch-pill rect { fill: #D26E3E; }
        .sch-pill text { fill: #fff; font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; text-anchor: middle; }
      </style>

      <!-- User -->
      <rect class="sch-box" x="40" y="30" width="140" height="50" rx="6"/>
      <text class="sch-label" x="110" y="60">User</text>

      <!-- LLM -->
      <rect class="sch-box-accent" x="40" y="170" width="240" height="140" rx="8"/>
      <text class="sch-emph" x="160" y="215">LLM</text>
      <text class="sch-sub" x="160" y="236">model · sampler · blocks</text>
      <g class="sch-pill">
        <rect x="90" y="265" width="140" height="24" rx="12"/>
        <text x="160" y="280">① REASON</text>
      </g>

      <!-- stop_reason decision -->
      <rect class="sch-box" x="350" y="195" width="220" height="100" rx="6"/>
      <text class="sch-label" x="460" y="220">stop_reason</text>
      <text class="sch-code" x="460" y="245">end_turn</text>
      <text class="sch-code" x="460" y="263">tool_use</text>
      <text class="sch-code" x="460" y="281" fill="#9a9ca5">max_tokens</text>

      <!-- Response -->
      <rect class="sch-box" x="420" y="40" width="160" height="60" rx="6"/>
      <text class="sch-label" x="500" y="68">Response</text>
      <text class="sch-sub" x="500" y="88">to user</text>

      <!-- Tool runtime -->
      <rect class="sch-box" x="350" y="380" width="220" height="100" rx="6"/>
      <text class="sch-label" x="460" y="410">Tool runtime</text>
      <text class="sch-sub" x="460" y="432">execute · fetch · compute</text>
      <g class="sch-pill">
        <rect x="390" y="448" width="140" height="24" rx="12"/>
        <text x="460" y="463">② ACT</text>
      </g>

      <!-- Flows -->
      <line class="sch-arrow" x1="110" y1="80" x2="110" y2="165" marker-end="url(#sch-arrow)"/>
      <text class="sch-flow-label" x="135" y="128">prompt</text>

      <line class="sch-arrow" x1="285" y1="240" x2="345" y2="240" marker-end="url(#sch-arrow)"/>

      <path class="sch-arrow" d="M 570 220 L 600 220 L 600 75 L 585 75" marker-end="url(#sch-arrow)"/>
      <text class="sch-flow-label" x="612" y="150" transform="rotate(90 612 150)">end_turn</text>

      <line class="sch-arrow" x1="460" y1="297" x2="460" y2="375" marker-end="url(#sch-arrow)"/>
      <text class="sch-flow-label" x="500" y="340">tool_use</text>

      <path class="sch-arrow" d="M 350 430 L 20 430 L 20 240 L 35 240" marker-end="url(#sch-arrow)"/>
      <g class="sch-pill">
        <rect x="120" y="490" width="160" height="24" rx="12"/>
        <text x="200" y="505">③ OBSERVE</text>
      </g>
      <text class="sch-flow-label" x="320" y="422">tool_result</text>
    </svg>`,
    legend: [
      { code: 'end_turn', label: "Fin naturelle — réponse finale" },
      { code: 'tool_use', label: "LLM demande l'exécution d'un outil" },
      { code: 'max_tokens', label: "Limite de sortie atteinte" },
      { code: 'stop_sequence', label: "Séquence d'arrêt rencontrée" }
    ]
  },

  // ───── SCHÉMA · COUCHE 04 · 6 Patterns ─────
  {
    layerIdx: 4,
    layerLabel: 'Couche 04 · Patterns',
    title: "Les six <em>patterns canoniques</em>",
    subtitle: "Taxonomie Anthropic — Schluntz &amp; Zhang, <em>Building Effective Agents</em> (déc. 2024). <em>Augmented LLM</em> est l'unité de base ; les cinq autres sont des compositions.",
    source: "Anthropic · Building Effective Agents (2024)",
    svg: `<svg viewBox="0 0 620 540" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="pat-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#3b3f4d"/>
        </marker>
      </defs>
      <style>
        .pat-cell { fill: #fdfaf0; stroke: rgba(30,30,44,0.2); stroke-width: 1; }
        .pat-title { font-family: 'Fraunces', serif; font-size: 13px; fill: #1e1e2a; font-weight: 500; text-anchor: middle; }
        .pat-num { font-family: 'JetBrains Mono', monospace; font-size: 8.5px; fill: #8FA446; letter-spacing: 0.14em; font-weight: 500; }
        .pat-box { fill: #fff; stroke: #1e1e2a; stroke-width: 1; }
        .pat-box-accent { fill: #f0f5e0; stroke: #8FA446; stroke-width: 1.2; }
        .pat-lbl { font-family: 'Inter', sans-serif; font-size: 8.5px; fill: #1e1e2a; text-anchor: middle; font-weight: 500; }
        .pat-arrow { stroke: #3b3f4d; stroke-width: 0.9; fill: none; }
      </style>

      <!-- 1: Augmented LLM -->
      <rect class="pat-cell" x="15" y="15" width="195" height="165" rx="6"/>
      <text class="pat-num" x="25" y="32">01</text>
      <text class="pat-title" x="112" y="47">Augmented LLM</text>
      <rect class="pat-box-accent" x="87" y="95" width="50" height="30" rx="3"/>
      <text class="pat-lbl" x="112" y="114">LLM</text>
      <rect class="pat-box" x="30" y="138" width="50" height="22" rx="3"/>
      <text class="pat-lbl" x="55" y="152">Retrieval</text>
      <rect class="pat-box" x="90" y="138" width="45" height="22" rx="3"/>
      <text class="pat-lbl" x="112" y="152">Tools</text>
      <rect class="pat-box" x="145" y="138" width="50" height="22" rx="3"/>
      <text class="pat-lbl" x="170" y="152">Memory</text>
      <line class="pat-arrow" x1="55" y1="138" x2="100" y2="126"/>
      <line class="pat-arrow" x1="112" y1="138" x2="112" y2="126"/>
      <line class="pat-arrow" x1="170" y1="138" x2="124" y2="126"/>
      <line class="pat-arrow" x1="20" y1="110" x2="83" y2="110" marker-end="url(#pat-arrow)"/>
      <line class="pat-arrow" x1="141" y1="110" x2="202" y2="110" marker-end="url(#pat-arrow)"/>

      <!-- 2: Prompt Chaining -->
      <rect class="pat-cell" x="215" y="15" width="195" height="165" rx="6"/>
      <text class="pat-num" x="225" y="32">02</text>
      <text class="pat-title" x="312" y="47">Prompt chaining</text>
      <rect class="pat-box-accent" x="232" y="100" width="42" height="28" rx="3"/>
      <text class="pat-lbl" x="253" y="118">LLM 1</text>
      <rect class="pat-box-accent" x="290" y="100" width="42" height="28" rx="3"/>
      <text class="pat-lbl" x="311" y="118">LLM 2</text>
      <rect class="pat-box-accent" x="348" y="100" width="42" height="28" rx="3"/>
      <text class="pat-lbl" x="369" y="118">LLM 3</text>
      <line class="pat-arrow" x1="274" y1="114" x2="290" y2="114" marker-end="url(#pat-arrow)"/>
      <line class="pat-arrow" x1="332" y1="114" x2="348" y2="114" marker-end="url(#pat-arrow)"/>
      <rect class="pat-box" x="290" y="145" width="42" height="18" rx="2"/>
      <text class="pat-lbl" x="311" y="157" font-size="7.5">Gate</text>
      <line class="pat-arrow" x1="311" y1="128" x2="311" y2="145"/>

      <!-- 3: Routing -->
      <rect class="pat-cell" x="415" y="15" width="195" height="165" rx="6"/>
      <text class="pat-num" x="425" y="32">03</text>
      <text class="pat-title" x="512" y="47">Routing</text>
      <rect class="pat-box-accent" x="438" y="80" width="50" height="28" rx="3"/>
      <text class="pat-lbl" x="463" y="98">Router</text>
      <rect class="pat-box" x="510" y="70" width="55" height="22" rx="3"/>
      <text class="pat-lbl" x="537" y="84">Workflow A</text>
      <rect class="pat-box" x="510" y="98" width="55" height="22" rx="3"/>
      <text class="pat-lbl" x="537" y="112">Workflow B</text>
      <rect class="pat-box" x="510" y="126" width="55" height="22" rx="3"/>
      <text class="pat-lbl" x="537" y="140">Workflow C</text>
      <line class="pat-arrow" x1="488" y1="92" x2="508" y2="82" marker-end="url(#pat-arrow)"/>
      <line class="pat-arrow" x1="488" y1="98" x2="508" y2="110" marker-end="url(#pat-arrow)"/>
      <line class="pat-arrow" x1="488" y1="104" x2="508" y2="138" marker-end="url(#pat-arrow)"/>

      <!-- 4: Parallelization -->
      <rect class="pat-cell" x="15" y="195" width="195" height="165" rx="6"/>
      <text class="pat-num" x="25" y="212">04</text>
      <text class="pat-title" x="112" y="227">Parallelization</text>
      <rect class="pat-box" x="30" y="270" width="42" height="22" rx="3"/>
      <text class="pat-lbl" x="51" y="284">Split</text>
      <rect class="pat-box-accent" x="90" y="248" width="42" height="22" rx="3"/>
      <text class="pat-lbl" x="111" y="262">Worker 1</text>
      <rect class="pat-box-accent" x="90" y="278" width="42" height="22" rx="3"/>
      <text class="pat-lbl" x="111" y="292">Worker 2</text>
      <rect class="pat-box-accent" x="90" y="308" width="42" height="22" rx="3"/>
      <text class="pat-lbl" x="111" y="322">Worker 3</text>
      <rect class="pat-box" x="150" y="270" width="42" height="22" rx="3"/>
      <text class="pat-lbl" x="171" y="284">Merge</text>
      <line class="pat-arrow" x1="72" y1="281" x2="88" y2="259" marker-end="url(#pat-arrow)"/>
      <line class="pat-arrow" x1="72" y1="281" x2="88" y2="289" marker-end="url(#pat-arrow)"/>
      <line class="pat-arrow" x1="72" y1="281" x2="88" y2="319" marker-end="url(#pat-arrow)"/>
      <line class="pat-arrow" x1="132" y1="259" x2="148" y2="281" marker-end="url(#pat-arrow)"/>
      <line class="pat-arrow" x1="132" y1="289" x2="148" y2="281" marker-end="url(#pat-arrow)"/>
      <line class="pat-arrow" x1="132" y1="319" x2="148" y2="281" marker-end="url(#pat-arrow)"/>

      <!-- 5: Orchestrator-Workers -->
      <rect class="pat-cell" x="215" y="195" width="195" height="165" rx="6"/>
      <text class="pat-num" x="225" y="212">05</text>
      <text class="pat-title" x="312" y="227">Orchestrator-workers</text>
      <rect class="pat-box-accent" x="290" y="250" width="44" height="28" rx="3"/>
      <text class="pat-lbl" x="312" y="268">Orch.</text>
      <rect class="pat-box" x="235" y="310" width="40" height="22" rx="3"/>
      <text class="pat-lbl" x="255" y="324" font-size="7.5">Worker</text>
      <rect class="pat-box" x="290" y="310" width="40" height="22" rx="3"/>
      <text class="pat-lbl" x="310" y="324" font-size="7.5">Worker</text>
      <rect class="pat-box" x="345" y="310" width="40" height="22" rx="3"/>
      <text class="pat-lbl" x="365" y="324" font-size="7.5">Worker</text>
      <line class="pat-arrow" x1="302" y1="278" x2="260" y2="308" marker-end="url(#pat-arrow)" stroke-dasharray="2 2"/>
      <line class="pat-arrow" x1="312" y1="278" x2="310" y2="308" marker-end="url(#pat-arrow)" stroke-dasharray="2 2"/>
      <line class="pat-arrow" x1="322" y1="278" x2="360" y2="308" marker-end="url(#pat-arrow)" stroke-dasharray="2 2"/>

      <!-- 6: Evaluator-Optimizer -->
      <rect class="pat-cell" x="415" y="195" width="195" height="165" rx="6"/>
      <text class="pat-num" x="425" y="212">06</text>
      <text class="pat-title" x="512" y="227">Evaluator-optimizer</text>
      <rect class="pat-box-accent" x="440" y="270" width="54" height="28" rx="3"/>
      <text class="pat-lbl" x="467" y="288">Generator</text>
      <rect class="pat-box" x="530" y="270" width="54" height="28" rx="3"/>
      <text class="pat-lbl" x="557" y="288">Evaluator</text>
      <path class="pat-arrow" d="M 494 280 L 528 280" marker-end="url(#pat-arrow)"/>
      <path class="pat-arrow" d="M 530 292 Q 512 320 494 292" marker-end="url(#pat-arrow)"/>
      <text class="pat-lbl" x="512" y="334" font-size="7.5" fill="#6b6f7c">feedback loop</text>

      <!-- Bottom note -->
      <text x="310" y="400" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-size="13" fill="#3b3f4d">
        Start simple. Measure.
      </text>
      <text x="310" y="422" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-size="13" fill="#3b3f4d">
        Add complexity only when it delivers measurable value.
      </text>
      <text x="310" y="448" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="0.14em" fill="#8a8e99">
        — SCHLUNTZ &amp; ZHANG, ANTHROPIC, DÉC. 2024
      </text>
    </svg>`,
    legend: [
      { code: '01', label: "Augmented LLM — l'unité de base" },
      { code: '02', label: "Prompt chaining — étapes séquentielles avec gates" },
      { code: '03', label: "Routing — classifier puis diriger" },
      { code: '04', label: "Parallelization — sectioning ou voting" },
      { code: '05', label: "Orchestrator-workers — délégation dynamique" },
      { code: '06', label: "Evaluator-optimizer — boucle itérative générer/critiquer" }
    ]
  },

  // ───── SCHÉMA · COUCHE 06 · OWASP ASI risks ─────
  {
    layerIdx: 6,
    layerLabel: 'Couche 06 · Guardrails',
    title: "OWASP <em>ASI 2026</em> — surfaces d'attaque",
    subtitle: "Les dix risques OWASP appliqués à un système agentique. Flux inputs → processing → outputs, avec les pastilles ASI placées aux points où chaque risque apparaît.",
    source: "OWASP GenAI Security Project · décembre 2025",
    svg: `<svg viewBox="0 0 620 540" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="ow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#3b3f4d"/>
        </marker>
      </defs>
      <style>
        .ow-col-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; fill: #8a8e99; }
        .ow-box { fill: #faf6ec; stroke: #1e1e2a; stroke-width: 1; }
        .ow-box-agent { fill: #e6eded; stroke: #3E8A8F; stroke-width: 1.3; }
        .ow-box-rogue { fill: #fce8eb; stroke: #a83e55; stroke-width: 1.3; stroke-dasharray: 3 2; }
        .ow-lbl { font-family: 'Inter', sans-serif; font-size: 10px; fill: #1e1e2a; text-anchor: middle; font-weight: 500; }
        .ow-lbl-left { font-family: 'Inter', sans-serif; font-size: 10.5px; fill: #1e1e2a; text-anchor: start; font-weight: 400; }
        .ow-sub { font-family: 'Inter', sans-serif; font-size: 8.5px; fill: #6b6f7c; text-anchor: middle; }
        .ow-arrow { stroke: #3b3f4d; stroke-width: 0.9; fill: none; }
        .ow-pill rect { fill: #a83e55; }
        .ow-pill text { fill: #fff; font-family: 'JetBrains Mono', monospace; font-size: 8px; font-weight: 500; text-anchor: middle; letter-spacing: 0.08em; }
      </style>

      <!-- Columns -->
      <text class="ow-col-label" x="90" y="35">Inputs</text>
      <text class="ow-col-label" x="310" y="35">Processing</text>
      <text class="ow-col-label" x="530" y="35">Outputs</text>

      <!-- INPUTS -->
      <rect class="ow-box" x="30" y="60" width="140" height="40" rx="5"/>
      <text class="ow-lbl" x="100" y="77">User prompt</text>
      <text class="ow-sub" x="100" y="92">direct input</text>
      <rect class="ow-box" x="30" y="120" width="140" height="40" rx="5"/>
      <text class="ow-lbl" x="100" y="137">External docs</text>
      <text class="ow-sub" x="100" y="152">RAG · web · email</text>
      <rect class="ow-box" x="30" y="180" width="140" height="40" rx="5"/>
      <text class="ow-lbl" x="100" y="197">Identity</text>
      <text class="ow-sub" x="100" y="212">auth · creds · role</text>

      <!-- PROCESSING -->
      <!-- Governance layer (top) -->
      <rect class="ow-box" x="215" y="60" width="200" height="50" rx="5"/>
      <text class="ow-lbl" x="315" y="80">Governance layer</text>
      <text class="ow-sub" x="315" y="95">policy · HITL · guardrails</text>

      <!-- Two agents -->
      <rect class="ow-box-agent" x="215" y="140" width="90" height="70" rx="5"/>
      <text class="ow-lbl" x="260" y="172">Agent A</text>
      <text class="ow-sub" x="260" y="188">orchestrator</text>
      <rect class="ow-box-rogue" x="325" y="140" width="90" height="70" rx="5"/>
      <text class="ow-lbl" x="370" y="172">Agent B</text>
      <text class="ow-sub" x="370" y="188">rogue?</text>

      <!-- Data/memory below -->
      <rect class="ow-box" x="215" y="245" width="90" height="50" rx="5"/>
      <text class="ow-lbl" x="260" y="265">RAG / data</text>
      <text class="ow-sub" x="260" y="280">vector store</text>
      <rect class="ow-box" x="325" y="245" width="90" height="50" rx="5"/>
      <text class="ow-lbl" x="370" y="265">Memory</text>
      <text class="ow-sub" x="370" y="280">long-term</text>

      <!-- OUTPUTS -->
      <rect class="ow-box" x="460" y="60" width="140" height="40" rx="5"/>
      <text class="ow-lbl" x="530" y="77">Tools</text>
      <text class="ow-sub" x="530" y="92">SQL · code · file</text>
      <rect class="ow-box" x="460" y="120" width="140" height="40" rx="5"/>
      <text class="ow-lbl" x="530" y="137">APIs / MCP</text>
      <text class="ow-sub" x="530" y="152">external services</text>
      <rect class="ow-box" x="460" y="180" width="140" height="40" rx="5"/>
      <text class="ow-lbl" x="530" y="197">External agents</text>
      <text class="ow-sub" x="530" y="212">A2A peers</text>

      <!-- Flows -->
      <line class="ow-arrow" x1="170" y1="80" x2="213" y2="85" marker-end="url(#ow-arrow)"/>
      <line class="ow-arrow" x1="170" y1="140" x2="213" y2="160" marker-end="url(#ow-arrow)"/>
      <line class="ow-arrow" x1="170" y1="200" x2="213" y2="185" marker-end="url(#ow-arrow)"/>
      <line class="ow-arrow" x1="305" y1="175" x2="325" y2="175" marker-end="url(#ow-arrow)"/>
      <line class="ow-arrow" x1="325" y1="178" x2="305" y2="178" marker-end="url(#ow-arrow)"/>
      <line class="ow-arrow" x1="260" y1="210" x2="260" y2="243" marker-end="url(#ow-arrow)"/>
      <line class="ow-arrow" x1="370" y1="210" x2="370" y2="243" marker-end="url(#ow-arrow)"/>
      <line class="ow-arrow" x1="315" y1="140" x2="315" y2="108"/>
      <line class="ow-arrow" x1="415" y1="155" x2="458" y2="80" marker-end="url(#ow-arrow)"/>
      <line class="ow-arrow" x1="415" y1="170" x2="458" y2="140" marker-end="url(#ow-arrow)"/>
      <line class="ow-arrow" x1="415" y1="195" x2="458" y2="200" marker-end="url(#ow-arrow)"/>

      <!-- ASI pills -->
      <g class="ow-pill"><rect x="175" y="65" width="38" height="18" rx="9"/><text x="194" y="77">ASI01</text></g>
      <g class="ow-pill"><rect x="175" y="125" width="38" height="18" rx="9"/><text x="194" y="137">ASI06</text></g>
      <g class="ow-pill"><rect x="175" y="185" width="38" height="18" rx="9"/><text x="194" y="197">ASI03</text></g>
      <g class="ow-pill"><rect x="294" y="165" width="38" height="18" rx="9"/><text x="313" y="177">ASI07</text></g>
      <g class="ow-pill"><rect x="335" y="215" width="38" height="18" rx="9"/><text x="354" y="227">ASI10</text></g>
      <g class="ow-pill"><rect x="420" y="65" width="38" height="18" rx="9"/><text x="439" y="77">ASI02</text></g>
      <g class="ow-pill"><rect x="420" y="125" width="38" height="18" rx="9"/><text x="439" y="137">ASI05</text></g>
      <g class="ow-pill"><rect x="420" y="185" width="38" height="18" rx="9"/><text x="439" y="197">ASI04</text></g>

      <!-- Bottom ASI summary grid -->
      <line x1="30" y1="320" x2="600" y2="320" stroke="rgba(30,30,44,0.15)" stroke-width="0.8"/>
      <text class="ow-col-label" x="30" y="340">Les dix risques · OWASP Top 10 for Agentic Applications 2026</text>

      <g class="ow-pill"><rect x="30" y="355" width="40" height="18" rx="9"/><text x="50" y="367">ASI01</text></g>
      <text class="ow-lbl-left" x="80" y="368">Agent Goal Hijack</text>
      <g class="ow-pill"><rect x="320" y="355" width="40" height="18" rx="9"/><text x="340" y="367">ASI02</text></g>
      <text class="ow-lbl-left" x="370" y="368">Tool Misuse</text>

      <g class="ow-pill"><rect x="30" y="383" width="40" height="18" rx="9"/><text x="50" y="395">ASI03</text></g>
      <text class="ow-lbl-left" x="80" y="396">Identity &amp; Privilege Abuse</text>
      <g class="ow-pill"><rect x="320" y="383" width="40" height="18" rx="9"/><text x="340" y="395">ASI04</text></g>
      <text class="ow-lbl-left" x="370" y="396">Agentic Supply Chain</text>

      <g class="ow-pill"><rect x="30" y="411" width="40" height="18" rx="9"/><text x="50" y="423">ASI05</text></g>
      <text class="ow-lbl-left" x="80" y="424">Unexpected Code Execution</text>
      <g class="ow-pill"><rect x="320" y="411" width="40" height="18" rx="9"/><text x="340" y="423">ASI06</text></g>
      <text class="ow-lbl-left" x="370" y="424">Memory &amp; Context Poisoning</text>

      <g class="ow-pill"><rect x="30" y="439" width="40" height="18" rx="9"/><text x="50" y="451">ASI07</text></g>
      <text class="ow-lbl-left" x="80" y="452">Inter-Agent Communication</text>
      <g class="ow-pill"><rect x="320" y="439" width="40" height="18" rx="9"/><text x="340" y="451">ASI08</text></g>
      <text class="ow-lbl-left" x="370" y="452">Cascading Failures</text>

      <g class="ow-pill"><rect x="30" y="467" width="40" height="18" rx="9"/><text x="50" y="479">ASI09</text></g>
      <text class="ow-lbl-left" x="80" y="480">Human-Agent Trust Exploit.</text>
      <g class="ow-pill"><rect x="320" y="467" width="40" height="18" rx="9"/><text x="340" y="479">ASI10</text></g>
      <text class="ow-lbl-left" x="370" y="480">Rogue Agents</text>

      <text x="310" y="515" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-size="12" fill="#3b3f4d">
        Principe directeur : <tspan font-weight="500">least agency</tspan> — ne jamais donner plus d'autonomie que nécessaire.
      </text>
    </svg>`,
    legend: []
  },

  // ───── SCHÉMA · COUCHE 07 · OTel trace waterfall ─────
  {
    layerIdx: 7,
    layerLabel: 'Couche 07 · Observability',
    title: "Trace <em>OpenTelemetry GenAI</em>",
    subtitle: "Un tour d'agent vu par OTel — spans imbriqués, attributs <code>gen_ai.*</code> normalisés, propagation context → tool → HTTP.",
    source: "OpenTelemetry SIG · Semantic Conventions for GenAI Systems",
    svg: `<svg viewBox="0 0 620 540" xmlns="http://www.w3.org/2000/svg">
      <style>
        .tr-label { font-family: 'Inter', sans-serif; font-size: 11px; fill: #1e1e2a; font-weight: 400; }
        .tr-label-mono { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; fill: #1e1e2a; }
        .tr-attr { font-family: 'JetBrains Mono', monospace; font-size: 8.5px; fill: #6b6f7c; }
        .tr-bar-root { fill: #3F75A5; }
        .tr-bar-llm { fill: #5583b0; }
        .tr-bar-tool { fill: #7C9AB8; }
        .tr-bar-http { fill: #a6bccf; }
        .tr-axis { stroke: #bababf; stroke-width: 0.8; }
        .tr-tick { font-family: 'JetBrains Mono', monospace; font-size: 8px; fill: #8a8e99; text-anchor: middle; }
        .tr-col-head { font-family: 'JetBrains Mono', monospace; font-size: 8.5px; fill: #8a8e99; letter-spacing: 0.14em; text-transform: uppercase; }
      </style>

      <text class="tr-col-head" x="10" y="20">SPAN HIERARCHY</text>
      <text class="tr-col-head" x="220" y="20">DURATION →</text>
      <text class="tr-col-head" x="460" y="20">gen_ai.* ATTRIBUTES</text>
      <line x1="10" y1="30" x2="610" y2="30" class="tr-axis"/>

      <!-- Row 1 ROOT -->
      <text class="tr-label" x="10" y="52" font-weight="500">agent_turn</text>
      <rect class="tr-bar-root" x="120" y="42" width="330" height="18" rx="2"/>
      <text class="tr-label" x="128" y="55" fill="#fff" font-size="9" font-weight="500">2.80s · root</text>
      <text class="tr-attr" x="460" y="48">gen_ai.agent.name=deep_research</text>
      <text class="tr-attr" x="460" y="60">operation.name=invoke_agent</text>

      <!-- Row 2: chat LLM#1 -->
      <text class="tr-label-mono" x="20" y="88">↳ chat · LLM #1</text>
      <rect class="tr-bar-llm" x="130" y="78" width="95" height="14" rx="2"/>
      <text class="tr-label" x="136" y="89" fill="#fff" font-size="8.5">0.80s</text>
      <text class="tr-attr" x="460" y="84">gen_ai.system=anthropic</text>
      <text class="tr-attr" x="460" y="94">in:1247  out:186  $0,008</text>

      <!-- Row 3: execute_tool -->
      <text class="tr-label-mono" x="20" y="122">↳ execute_tool · web_search</text>
      <rect class="tr-bar-tool" x="231" y="112" width="153" height="14" rx="2"/>
      <text class="tr-label" x="237" y="123" fill="#fff" font-size="8.5">1.30s</text>
      <text class="tr-attr" x="460" y="118">operation.name=execute_tool</text>
      <text class="tr-attr" x="460" y="128">tool.name=web_search</text>

      <!-- Row 4: http -->
      <text class="tr-label-mono" x="35" y="155" fill="#8a8e99">↳↳ http.get</text>
      <rect class="tr-bar-http" x="239" y="145" width="123" height="12" rx="2"/>
      <text class="tr-label" x="243" y="155" fill="#fff" font-size="8">1.05s</text>
      <text class="tr-attr" x="460" y="152">http.method=GET</text>
      <text class="tr-attr" x="460" y="162">status_code=200</text>

      <!-- Row 5: chat LLM#2 -->
      <text class="tr-label-mono" x="20" y="190">↳ chat · LLM #2</text>
      <rect class="tr-bar-llm" x="385" y="180" width="65" height="14" rx="2"/>
      <text class="tr-label" x="390" y="191" fill="#fff" font-size="8.5">0.55s</text>
      <text class="tr-attr" x="460" y="186">gen_ai.system=anthropic</text>
      <text class="tr-attr" x="460" y="196">in:1433  out:412  $0,015</text>

      <!-- Time axis -->
      <line x1="120" y1="225" x2="450" y2="225" class="tr-axis"/>
      <line x1="120" y1="223" x2="120" y2="230" class="tr-axis"/>
      <text class="tr-tick" x="120" y="245">0</text>
      <line x1="202" y1="223" x2="202" y2="230" class="tr-axis"/>
      <text class="tr-tick" x="202" y="245">500ms</text>
      <line x1="285" y1="223" x2="285" y2="230" class="tr-axis"/>
      <text class="tr-tick" x="285" y="245">1000</text>
      <line x1="367" y1="223" x2="367" y2="230" class="tr-axis"/>
      <text class="tr-tick" x="367" y="245">2000</text>
      <line x1="450" y1="223" x2="450" y2="230" class="tr-axis"/>
      <text class="tr-tick" x="450" y="245">2800</text>

      <!-- Summary box -->
      <rect x="10" y="285" width="600" height="100" rx="6" fill="#f3eedf" stroke="rgba(30,30,44,0.12)" stroke-width="1"/>
      <text class="tr-col-head" x="25" y="308">Totaux agrégés</text>
      <text class="tr-label" x="25" y="330" font-weight="500">2,80 s</text>
      <text class="tr-attr" x="25" y="344">latence totale</text>
      <text class="tr-label" x="140" y="330" font-weight="500">2 LLM</text>
      <text class="tr-attr" x="140" y="344">+ 1 tool + 1 http</text>
      <text class="tr-label" x="260" y="330" font-weight="500">2680 / 598</text>
      <text class="tr-attr" x="260" y="344">tokens in / out</text>
      <text class="tr-label" x="395" y="330" font-weight="500">~ 0,023 $</text>
      <text class="tr-attr" x="395" y="344">coût du tour</text>
      <text class="tr-label-mono" x="25" y="370" fill="#6b6f7c">traceparent=00-4bf92f3577b34da6a...-7-01</text>

      <!-- Caption -->
      <text x="310" y="420" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-size="13" fill="#1e1e2a">
        L'APM classique voit un appel HTTP. OTel GenAI voit
      </text>
      <text x="310" y="440" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-size="13" fill="#1e1e2a">
        la trajectoire du raisonnement.
      </text>

      <text x="310" y="485" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="0.16em" fill="#8a8e99">
        SUPPORTÉ PAR LANGFUSE · LANGSMITH · DYNATRACE
      </text>
      <text x="310" y="500" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="0.16em" fill="#8a8e99">
        AZURE FOUNDRY · AGENTCORE · GRAFANA TEMPO
      </text>
    </svg>`,
    legend: [
      { code: 'agent_turn', label: "Span racine — le cycle complet d'un tour" },
      { code: 'chat', label: "Inférence LLM — gen_ai.system + model + tokens" },
      { code: 'execute_tool', label: "Exécution d'outil — gen_ai.tool.name" },
      { code: 'http.*', label: "Span HTTP enfant — propagation OTel context" }
    ]
  }
];

/* ═════════════════════════════════════════════════════════════
   RENDER — schemas section (one double-page per schema)
   ═════════════════════════════════════════════════════════════ */
function renderSchemaSpread(schemaIdx, leftFolio, rightFolio) {
  const s = SCHEMAS[schemaIdx];
  const layer = LAYERS[s.layerIdx];
  const legendHtml = s.legend.length ? `
    <div class="sch-legend">
      ${s.legend.map(it => `
        <div class="sch-legend-item">
          <span class="sch-legend-code" style="background:${layer.color}">${it.code}</span>
          <span class="sch-legend-lbl">${it.label}</span>
        </div>`).join('')}
    </div>` : '';

  return `
    <div class="spread" data-kind="schema" data-schema="${schemaIdx}" style="--layer-color:${layer.color};">
      <div class="page left">
        <div class="running-head">
          <span>${s.layerLabel} <span class="dot" style="background:${layer.color}"></span> Schéma</span>
          <span>Anatomie · Planches III</span>
        </div>
        <div class="sch-left-inner">
          <div class="sch-eyebrow" style="color:${layer.color};">
            <span class="sch-eye-dot" style="background:${layer.color}"></span>
            Planche ${String(schemaIdx + 1).padStart(2,'0')} · Schéma de référence
          </div>
          <h2 class="sch-title">${s.title}</h2>
          <div class="sch-rule" style="background:${layer.color};"></div>
          <p class="sch-subtitle">${s.subtitle}</p>
          ${legendHtml}
          <div class="sch-source">
            <div class="sch-source-label">Source primaire</div>
            <div class="sch-source-text">${s.source}</div>
          </div>
        </div>
        <div class="folio">p. ${String(leftFolio).padStart(2,'0')}</div>
      </div>
      <div class="page right">
        <div class="running-head">
          <span>Anatomie · Planches III</span>
          <span>Schéma <span class="dot" style="background:${layer.color}"></span> ${s.layerLabel}</span>
        </div>
        <div class="sch-svg-wrap">
          <div class="sch-svg-inner">${s.svg}</div>
        </div>
        <div class="folio">p. ${String(rightFolio).padStart(2,'0')}</div>
      </div>
    </div>`;
}

/* Section opener for "Planches" */
function renderSchemasOpener(leftFolio, rightFolio) {
  const items = SCHEMAS.map((s, i) => {
    const layer = LAYERS[s.layerIdx];
    return `
      <div class="planche-item" style="--layer-color:${layer.color};">
        <div class="planche-num">${String(i+1).padStart(2,'0')}</div>
        <div class="planche-dot" style="background:${layer.color}"></div>
        <div>
          <div class="planche-layer">${s.layerLabel}</div>
          <div class="planche-title">${s.title}</div>
        </div>
      </div>`;
  }).join('');

  return `
    <div class="spread" data-kind="schemas-opener">
      <div class="page left">
        <div class="sch-opener-inner">
          <div class="sch-opener-eyebrow">Troisième partie</div>
          <h2 class="sch-opener-title">Planches <em>&amp; schémas</em></h2>
          <div class="sch-opener-rule"></div>
          <p class="sch-opener-lede">Quatre schémas de référence, un par discipline-clé. Chacun est conçu pour être extrait du livre et affiché au mur&nbsp;: boucle ReAct, six patterns Anthropic, carte des risques OWASP, trace OpenTelemetry GenAI.</p>
          <div class="planche-list">
            ${items}
          </div>
        </div>
        <div class="folio">p. ${String(leftFolio).padStart(2,'0')}</div>
      </div>
      <div class="page right">
        <div class="sch-opener-right">
          <div class="sch-opener-right-inner">
            <div class="sch-opener-right-eyebrow">Quatre planches</div>
            <div class="sch-opener-right-big">04</div>
            <div class="sch-opener-right-cap">schémas de référence<br>à annoter, imprimer, afficher</div>
          </div>
        </div>
        <div class="folio">p. ${String(rightFolio).padStart(2,'0')}</div>
      </div>
    </div>`;
}

// Expose to main renderer
window.SCHEMAS = SCHEMAS;
window.renderSchemaSpread = renderSchemaSpread;
window.renderSchemasOpener = renderSchemasOpener;
