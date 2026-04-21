/* ═════════════════════════════════════════════════════════════
   BOOK RENDERER — onion illustrations + spread layout
   ═════════════════════════════════════════════════════════════ */

const BOOK_EL = document.getElementById('book');
const BOOK_FRAME = document.getElementById('bookFrame');
const CUR_IDX = document.getElementById('curIdx');
const TOTAL_IDX = document.getElementById('totalIdx');
const PREV_BTN = document.getElementById('prevBtn');
const NEXT_BTN = document.getElementById('nextBtn');
const TOC_TOGGLE = document.getElementById('tocToggle');

/* ── UTILITIES ── */
function initials(name) {
  return name.split(/[\s-]/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

/* ═════════════════════════════════════════════════════════════
   ONION SVG — 10 concentric rings + core, with active highlight
   Center (400,400). Radii graduated from core outward.
   ═════════════════════════════════════════════════════════════ */
function buildOnionSVG({ activeLayer = null, size = 800, detailed = true, showLabels = true } = {}) {
  const cx = 400, cy = 400;
  // 10 layers (00=core, 09=outer). Radii tuned for visual rhythm.
  // We draw the core as a filled disk, then 9 rings around it.
  const coreR = 52;
  const outerR = 360;
  const step = (outerR - coreR) / 9;

  const layers = LAYERS; // 00..09

  let svg = `<svg class="illus-svg" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;

  // defs: radial gradient for core, paper shadow for rings
  svg += `<defs>
    <radialGradient id="coreGrad" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#e68063"/>
      <stop offset="60%" stop-color="#c34e3a"/>
      <stop offset="100%" stop-color="#9b3a2b"/>
    </radialGradient>
    <radialGradient id="coreGradDim" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#d67361"/>
      <stop offset="60%" stop-color="#b04a3a"/>
      <stop offset="100%" stop-color="#8c3528"/>
    </radialGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5"/>
    </filter>
  </defs>`;

  // Outer rings first (behind), inner ring on top
  // We draw from outermost (09) to innermost (01), so inner ones overlay properly.
  for (let i = 9; i >= 1; i--) {
    const r = coreR + step * i;
    const rIn = coreR + step * (i - 1);
    const layer = layers[i];
    const isActive = activeLayer === i;
    const isPast = activeLayer !== null && i < activeLayer;
    const isFuture = activeLayer !== null && i > activeLayer;

    let fillOpacity, strokeOpacity, strokeWidth;
    if (activeLayer === null) {
      // Hero view (cover): all rings at moderate presence
      fillOpacity = 0.10 + i * 0.008;
      strokeOpacity = 0.42;
      strokeWidth = 1.1;
    } else if (isActive) {
      fillOpacity = 0.32;
      strokeOpacity = 1;
      strokeWidth = 2.6;
    } else if (isPast) {
      fillOpacity = 0.10;
      strokeOpacity = 0.55;
      strokeWidth = 1.0;
    } else {
      // future
      fillOpacity = 0.04;
      strokeOpacity = 0.22;
      strokeWidth = 0.8;
    }

    svg += `<circle class="ring-fill" cx="${cx}" cy="${cy}" r="${r}"
              fill="${layer.color}" fill-opacity="${fillOpacity}"/>`;
    svg += `<circle class="ring-stroke" cx="${cx}" cy="${cy}" r="${r}"
              fill="none" stroke="${layer.color}"
              stroke-opacity="${strokeOpacity}" stroke-width="${strokeWidth}"/>`;
  }

  // Core (layer 00)
  const coreActive = activeLayer === 0;
  const coreFaded = activeLayer !== null && activeLayer > 0;
  const coreFill = coreFaded ? 'url(#coreGradDim)' : 'url(#coreGrad)';
  const coreStroke = coreActive ? 3 : (coreFaded ? 0.8 : 1.4);
  const coreStrokeOp = coreActive ? 1 : (coreFaded ? 0.5 : 0.85);
  svg += `<circle cx="${cx}" cy="${cy}" r="${coreR}" fill="${coreFill}"/>`;
  svg += `<circle cx="${cx}" cy="${cy}" r="${coreR}" fill="none"
            stroke="#9b3a2b" stroke-opacity="${coreStrokeOp}" stroke-width="${coreStroke}"/>`;

  // Core inscription
  if (coreActive || activeLayer === null) {
    svg += `<text x="${cx}" y="${cy - 4}" text-anchor="middle"
              font-family="Fraunces, serif" font-style="italic" font-weight="500"
              font-size="22" fill="#fff">LLM</text>`;
    svg += `<text x="${cx}" y="${cy + 18}" text-anchor="middle"
              font-family="JetBrains Mono, monospace" font-size="9"
              letter-spacing="0.2em" fill="#fff" opacity="0.85">00</text>`;
  } else {
    svg += `<text x="${cx}" y="${cy + 5}" text-anchor="middle"
              font-family="JetBrains Mono, monospace" font-size="11"
              letter-spacing="0.2em" fill="#fff" opacity="0.78">00</text>`;
  }

  // Radial tick marks (tree-ring detail) — only in detailed mode
  if (detailed) {
    const tickAngles = [18, 54, 126, 162, 234, 306, 342]; // uneven, organic
    for (const baseDeg of tickAngles) {
      // each tick spans from ring i inner to ring i+1 inner, at subtly offset angles
      for (let i = 1; i <= 9; i++) {
        const rOut = coreR + step * i;
        const rIn = coreR + step * (i - 1);
        const deg = baseDeg + (i % 3 === 0 ? 4 : (i % 2 === 0 ? -3 : 1.5));
        const rad = (deg - 90) * Math.PI / 180;
        const x1 = cx + Math.cos(rad) * (rIn + 3);
        const y1 = cy + Math.sin(rad) * (rIn + 3);
        const x2 = cx + Math.cos(rad) * (rOut - 3);
        const y2 = cy + Math.sin(rad) * (rOut - 3);
        const isFocus = activeLayer === i;
        const opacity = activeLayer === null ? 0.12 :
                        isFocus ? 0.32 :
                        (i < activeLayer ? 0.14 : 0.05);
        svg += `<line class="ring-tick" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
                  stroke="${layers[i].color}" stroke-opacity="${opacity}" stroke-width="0.7"/>`;
      }
    }
  }

  // Labels on the right side of each active/past ring
  if (showLabels && activeLayer !== null) {
    // Draw a leader line + label for the ACTIVE ring
    const i = activeLayer;
    if (i > 0) {
      const layer = layers[i];
      const r = coreR + step * i - step/2;
      // Place label at angle -30° (upper right)
      const ang = -30 * Math.PI / 180;
      const lx = cx + Math.cos(ang) * (coreR + step * i + 18);
      const ly = cy + Math.sin(ang) * (coreR + step * i + 18);
      const lEndX = cx + Math.cos(ang) * (coreR + step * i + 80);
      const lEndY = cy + Math.sin(ang) * (coreR + step * i + 80);
      svg += `<line x1="${lx}" y1="${ly}" x2="${lEndX}" y2="${lEndY}"
                stroke="${layer.color}" stroke-width="1.2" stroke-opacity="0.7"/>`;
      svg += `<circle cx="${lx}" cy="${ly}" r="3" fill="${layer.color}"/>`;
      svg += `<text x="${lEndX + 6}" y="${lEndY - 4}"
                font-family="JetBrains Mono, monospace" font-size="10"
                letter-spacing="0.18em" fill="${layer.color}"
                font-weight="500">COUCHE ${layer.num}</text>`;
      svg += `<text x="${lEndX + 6}" y="${lEndY + 14}"
                font-family="Fraunces, serif" font-style="italic"
                font-size="19" fill="#1e1e2a">${layer.short}</text>`;
    } else if (i === 0) {
      // core active — label it specially
      const ang = -30 * Math.PI / 180;
      const lx = cx + Math.cos(ang) * coreR;
      const ly = cy + Math.sin(ang) * coreR;
      const lEndX = cx + Math.cos(ang) * (coreR + 140);
      const lEndY = cy + Math.sin(ang) * (coreR + 140);
      svg += `<line x1="${lx}" y1="${ly}" x2="${lEndX}" y2="${lEndY}"
                stroke="#c34e3a" stroke-width="1.2" stroke-opacity="0.7"/>`;
      svg += `<circle cx="${lx}" cy="${ly}" r="3" fill="#c34e3a"/>`;
      svg += `<text x="${lEndX + 6}" y="${lEndY - 4}"
                font-family="JetBrains Mono, monospace" font-size="10"
                letter-spacing="0.18em" fill="#c34e3a"
                font-weight="500">COUCHE 00</text>`;
      svg += `<text x="${lEndX + 6}" y="${lEndY + 14}"
                font-family="Fraunces, serif" font-style="italic"
                font-size="19" fill="#1e1e2a">${layers[0].short}</text>`;
    }
  }

  // Hero/cover view — label every ring with a number at a specific angle
  if (activeLayer === null && showLabels) {
    for (let i = 1; i <= 9; i++) {
      const r = coreR + step * i - step/2;
      const ang = (-90 + (i * 33) % 360) * Math.PI / 180;
      const lx = cx + Math.cos(ang) * r;
      const ly = cy + Math.sin(ang) * r;
      svg += `<text x="${lx}" y="${ly + 3}" text-anchor="middle"
                font-family="JetBrains Mono, monospace" font-size="9.5"
                letter-spacing="0.1em"
                fill="${layers[i].color}" fill-opacity="0.85"
                font-weight="500">${layers[i].num}</text>`;
    }
  }

  svg += `</svg>`;
  return svg;
}

/* ═════════════════════════════════════════════════════════════
   SPREAD RENDERERS
   ═════════════════════════════════════════════════════════════ */

function renderCover() {
  return `
    <div class="spread" data-kind="cover">
      <div class="page left">
        <div class="cover-left">
          <div class="cover-eyebrow"><span class="bar"></span>Anatomie · en dix couches</div>
          <div>
            <h1 class="cover-title">Au cœur,<br>
              <em>un tirage<br>probabiliste.</em></h1>
            <p class="cover-sub">Autour de lui, dix couches pour qu'il tienne — d'un LLM stochastique jusqu'à la gouvernance d'entreprise.</p>
          </div>
          <div class="cover-meta">
            <div><strong>Un livre en dix couches</strong></div>
            <div>Systèmes agentiques en production · 2026</div>
          </div>
        </div>
        <div class="folio">A</div>
      </div>
      <div class="page right">
        <div class="cover-right-content">
          ${buildOnionSVG({ activeLayer: null, showLabels: true })}
        </div>
        <div class="folio">B</div>
      </div>
    </div>`;
}

function renderTOC() {
  const rows = LAYERS.map((l, i) => `
    <div class="toc-item" data-layer="${i}">
      <span class="toc-num">${l.num}</span>
      <span class="toc-dot" style="background:${l.color}"></span>
      <div>
        <div class="toc-title">${l.title.replace(/<\/?em>/g,'')}</div>
        <div class="toc-short">${l.short}</div>
      </div>
      <span class="toc-folio">p. ${(i * 2 + 5).toString().padStart(2, '0')}</span>
      <span></span>
    </div>`).join('');

  return `
    <div class="spread" data-kind="toc">
      <div class="page left">
        <div class="toc-inner">
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.24em;text-transform:uppercase;color:var(--accent);margin-bottom:12px;font-weight:500;">Sommaire</div>
          <h2 class="toc-head">Dix couches, <em>un système vivant</em>.</h2>
          <p class="toc-sub">Chaque couche est à la fois un métier, une stack et une discipline de gouvernance. Les pages qui suivent déplient chaque anneau&nbsp;: la problématique, la mise en scène, les concepts-clés, les profils mobilisés, le piège classique.</p>
          <div class="toc-list" id="tocList">${rows}</div>
        </div>
        <div class="folio">p. 02</div>
      </div>
      <div class="page right">
        <div class="illus-wrap">
          ${buildOnionSVG({ activeLayer: null, detailed: true, showLabels: true })}
        </div>
        <div class="illus-caption">
          <div class="illus-cap-eyebrow">Planche — l'oignon complet</div>
          <div class="illus-cap-title">Dix anneaux concentriques autour d'un noyau stochastique. Chaque page tournée <em>allume</em> un anneau.</div>
        </div>
        <div class="folio">p. 03</div>
      </div>
    </div>`;
}

function buildMiniOnion(activeLayer) {
  // Tiny inline onion — 80×80, no labels, no ticks
  const cx = 40, cy = 40;
  const coreR = 5.2;
  const outerR = 36;
  const step = (outerR - coreR) / 9;
  let s = `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">`;
  for (let i = 9; i >= 1; i--) {
    const r = coreR + step * i;
    const l = LAYERS[i];
    const active = i === activeLayer;
    const past = activeLayer !== null && i < activeLayer;
    const fillOp = active ? 0.5 : past ? 0.14 : 0.05;
    const strokeOp = active ? 1 : past ? 0.5 : 0.2;
    const sw = active ? 1.4 : 0.6;
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${l.color}" fill-opacity="${fillOp}"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${l.color}" stroke-opacity="${strokeOp}" stroke-width="${sw}"/>`;
  }
  const coreActive = activeLayer === 0;
  s += `<circle cx="${cx}" cy="${cy}" r="${coreR}" fill="#c34e3a" opacity="${coreActive ? 1 : 0.7}"/>`;
  s += `</svg>`;
  return s;
}

function renderLayerSpread(layerIdx, spreadIdx) {
  const l = LAYERS[layerIdx];
  const folioLeft = layerIdx * 2 + 4;
  const folioRight = folioLeft + 1;

  const roleChips = l.roles.map(r => {
    const mission = (typeof ROLE_DEFS !== 'undefined' && ROLE_DEFS[r]) || '';
    return `<div class="role-chip"><span class="av" style="background:${l.color}">${initials(r)}</span><div class="role-txt"><div class="role-name">${r}</div>${mission ? `<div class="role-mission">${mission}</div>` : ''}</div></div>`;
  }).join('');

  // Concept definitions list for right page
  const defsHtml = l.concepts.map((key, i) => {
    const def = CONCEPT_DEFS[key] || `<em>Définition à préciser.</em>`;
    return `
      <div class="def-item">
        <div class="def-num">${String(i + 1).padStart(2, '0')}</div>
        <div>
          <div class="def-term">${key}</div>
          <div class="def-body">${def}</div>
        </div>
      </div>`;
  }).join('');

  return `
    <div class="spread" data-kind="layer" data-layer="${layerIdx}" style="--layer-color:${l.color};">
      <div class="page left">
        <div class="running-head">
          <span>Couche ${l.num} <span class="dot" style="background:${l.color}"></span> ${l.short}</span>
          <span>Anatomie · I</span>
        </div>
        <div class="page-inner">
          <div class="layer-num">${l.num}<span class="couche">Couche · ${l.short}</span></div>
          <h2 class="layer-title">${l.title}</h2>
          <div class="rule" style="background:${l.color};"></div>
          <div class="question">${l.question}</div>
          <div class="section-label">Mise en scène</div>
          <p class="narrative">${l.narrative}</p>
          <div class="mini-onion-wrap">
            ${buildMiniOnion(layerIdx)}
            <div class="mini-onion-text">
              <strong>Anneau ${l.num} · ${l.short}</strong>
              ${l.illusCaption}
            </div>
          </div>
          <div class="section-label">Profils mobilisés</div>
          <div class="roles-row">${roleChips}</div>
        </div>
        <div class="folio">p. ${String(folioLeft).padStart(2,'0')}</div>
      </div>
      <div class="page right">
        <div class="running-head">
          <span>Anatomie · II</span>
          <span>${l.short} <span class="dot" style="background:${l.color}"></span> Couche ${l.num}</span>
        </div>
        <div class="concepts-inner">
          <div class="concepts-head">
            <h3 class="concepts-title">Concepts <em>&amp; stack</em></h3>
            <div class="concepts-mini">
              <span>${l.num}</span>
              <span class="mini-svg">${buildMiniOnion(layerIdx)}</span>
            </div>
          </div>
          <div class="concepts-lede">Le vocabulaire opérationnel de la couche ${l.num} — ${l.short.toLowerCase()}. ${l.concepts.length} notions à maîtriser avant d'aller plus loin.</div>
          <div class="concepts-rule"></div>
          <div class="defs-list">${defsHtml}</div>
          <div class="risk">
            <div class="risk-label">⚠ Piège classique · ${l.short}</div>
            <div class="risk-text">${l.risk}</div>
          </div>
          <div class="concepts-footer">
            <span>Fiche · ${l.concepts.length} définitions</span>
            <span>Couche ${l.num} / 09</span>
          </div>
        </div>
        <div class="folio">p. ${String(folioRight).padStart(2,'0')}</div>
      </div>
    </div>`;
}

function renderClosing() {
  // 2 front (cover+toc) + 10 layers*2 + 1 schemas opener (2p) + 4 schemas (8p) = 4 + 20 + 2 + 8 = 34
  // Folios number from 01; cover/toc use letters so layer01 starts at p.04.
  // layerLast ends at p. (4 + 9*2 + 1) = 23
  // schemas opener: 24-25, schemas 26-33, closing 34-35, colophon 36-37
  const folioLeft = 4 + LAYERS.length * 2 + 2 + SCHEMAS.length * 2;
  const folioRight = folioLeft + 1;

  return `
    <div class="spread" data-kind="closing">
      <div class="page left">
        <div class="closing-inner">
          <div class="closing-quote">Start simple, measure, add complexity only when it delivers measurable value.</div>
          <div class="closing-attr">— Schluntz &amp; Zhang, Anthropic · Building Effective Agents, déc. 2024</div>
          <div class="closing-body">
            Les dix couches ne sont pas un ordre d'implémentation, mais une <strong>grille de lecture</strong>. On ne part pas de la gouvernance&nbsp;; on n'arrive pas par miracle au LLM. On avance, on mesure, on recule, on renforce — couche après couche, à mesure que l'usage se révèle.<br><br>
            Un agent qui tient en production est <em>la rencontre</em> d'un noyau probabiliste et d'une discipline d'ingénierie. Ni l'un ni l'autre ne suffit. Le cœur sans la discipline dérive&nbsp;; la discipline sans le cœur ne sert à rien.<br><br>
            Ce livre se referme ici. La stack, elle, ne fait que s'ouvrir.
          </div>
          <div class="closing-sig">— Fin du panorama.</div>
        </div>
        <div class="folio">p. ${String(folioLeft).padStart(2,'0')}</div>
      </div>
      <div class="page right">
        <div class="illus-wrap">
          ${buildOnionSVG({ activeLayer: null, detailed: true, showLabels: false })}
        </div>
        <div class="illus-caption">
          <div class="illus-cap-eyebrow">Planche de clôture</div>
          <div class="illus-cap-title">L'oignon complet — dix anneaux autour d'un <em>tirage probabiliste</em>.</div>
        </div>
        <div class="folio">p. ${String(folioRight).padStart(2,'0')}</div>
      </div>
    </div>`;
}

function renderColophon() {
  return `
    <div class="spread" data-kind="colophon">
      <div class="page left">
        <div class="colophon-inner">
          <div class="colophon-head">Colophon · sources &amp; remerciements</div>
          <h3 class="colophon-title">Ce que l'on a <em>lu, vu, consulté</em></h3>
          <p class="colophon-intro">Les sources primaires qui structurent ce panorama — publications fondatrices, documentations officielles des cinq hyperscalers, protocoles standardisés et frameworks de sécurité. Tout est ouvert et public.</p>

          <div class="col-group">
            <h4>Fondations conceptuelles</h4>
            <ul>
              <li><strong>Building Effective Agents</strong> · Schluntz &amp; Zhang, Anthropic, déc. 2024</li>
              <li><strong>Effective Context Engineering</strong> · Anthropic Engineering, 2026</li>
              <li><em>ReAct: Synergizing Reasoning and Acting</em> · Yao et al., ICLR 2023</li>
            </ul>
          </div>

          <div class="col-group">
            <h4>SDK, runtimes &amp; plateformes</h4>
            <ul>
              <li><strong>Claude Agent SDK</strong> · <strong>Managed Agents</strong> (beta publique, avr. 2026)</li>
              <li><strong>OpenAI Agents SDK</strong> · <strong>Agent Builder</strong></li>
              <li><strong>Google ADK</strong> · <strong>Vertex AI Agent Engine</strong></li>
              <li><strong>Microsoft Agent Framework 1.0</strong> · <strong>Azure AI Foundry Agent Service</strong></li>
              <li><strong>AWS Bedrock AgentCore</strong> (GA, octobre 2025)</li>
              <li><strong>LangGraph 1.0</strong> · durable execution</li>
            </ul>
          </div>

          <div class="col-group">
            <h4>Protocoles &amp; gouvernance</h4>
            <ul>
              <li><strong>Model Context Protocol (MCP)</strong> · Anthropic → Linux Foundation AAIF</li>
              <li><strong>Agent2Agent (A2A)</strong> · Google → Linux Foundation AAIF</li>
              <li><strong>AG-UI</strong> · CopilotKit</li>
              <li><strong>OWASP Top 10 for Agentic Applications</strong> · décembre 2025</li>
              <li><strong>OpenTelemetry GenAI Semantic Conventions</strong></li>
            </ul>
          </div>
        </div>
        <div class="folio">p. ${String(4 + LAYERS.length * 2 + 2 + SCHEMAS.length * 2 + 2).padStart(2,'0')}</div>
      </div>
      <div class="page right">
        <div class="colophon-inner">
          <div class="colophon-head">Fabrication</div>
          <h3 class="colophon-title">De la typographie, <em>surtout</em></h3>
          <p class="colophon-intro">Ce livre est composé en <em>Fraunces</em> pour le display (Phaedra Charles &amp; Flavia Zimbardi) et <em>Inter</em> pour le texte courant (Rasmus Andersson). Les métadonnées, ticks et codes sont en <em>JetBrains Mono</em>. La couleur papier évoque un vieil ouvrage de bureau, la couleur d'accent — un orange brûlé — vient de l'image de l'oignon coupé.</p>

          <div class="col-group">
            <h4>Méthode</h4>
            <ul>
              <li><strong>Une couche par double page</strong> — page de gauche pour l'explication, page de droite pour l'illustration.</li>
              <li>L'oignon reste <em>une seule</em> image. Seul le focus change&nbsp;: chaque anneau s'allume à son tour.</li>
              <li>Dix couches ordonnées du cœur vers l'extérieur&nbsp;: <em>du modèle à la gouvernance</em>.</li>
            </ul>
          </div>

          <div class="col-group">
            <h4>Lecture</h4>
            <ul>
              <li>Flèches <em>gauche / droite</em>, barre d'espace, ou clic sur les chevrons pour tourner les pages.</li>
              <li>Bouton <em>Sommaire</em> (en haut à droite) pour sauter à une couche&nbsp;; la dernière page vue est mémorisée.</li>
              <li>La couche active colore la tranche extérieure du livre et son titre courant.</li>
            </ul>
          </div>

          <div class="col-group">
            <h4>Fin</h4>
            <ul>
              <li><em>Anatomie d'un système agentique en production</em> — un livre en dix couches.</li>
              <li>Paris, 2026. Relié à la main, imprimé sur un tirage probabiliste.</li>
            </ul>
          </div>
        </div>
        <div class="folio">p. ${String(4 + LAYERS.length * 2 + 2 + SCHEMAS.length * 2 + 3).padStart(2,'0')}</div>
      </div>
    </div>`;
}

/* ═════════════════════════════════════════════════════════════
   BUILD + NAVIGATE
   ═════════════════════════════════════════════════════════════ */

function buildAll() {
  const html = SPREADS.map((s, i) => {
    if (s.kind === 'cover') return renderCover();
    if (s.kind === 'toc') return renderTOC();
    if (s.kind === 'layer') return renderLayerSpread(s.layerIdx, i);
    if (s.kind === 'schemas-opener') {
      const base = 4 + LAYERS.length * 2;
      return renderSchemasOpener(base, base + 1);
    }
    if (s.kind === 'schema') {
      const base = 6 + LAYERS.length * 2 + s.schemaIdx * 2;
      return renderSchemaSpread(s.schemaIdx, base, base + 1);
    }
    if (s.kind === 'closing') return renderClosing();
    if (s.kind === 'colophon') return renderColophon();
    return '';
  }).join('');
  BOOK_EL.innerHTML = html;
  TOTAL_IDX.textContent = SPREADS.length;

  // Wire TOC items inside the TOC spread
  BOOK_EL.querySelectorAll('#tocList .toc-item').forEach(item => {
    item.addEventListener('click', () => {
      const li = Number(item.dataset.layer);
      // Spread index of that layer = 2 (cover, toc) + li
      goTo(2 + li);
    });
  });
}

let currentSpread = 0;
const LS_KEY = 'book-spread-idx-v1';

function goTo(idx) {
  if (idx < 0) idx = 0;
  if (idx >= SPREADS.length) idx = SPREADS.length - 1;
  currentSpread = idx;
  const spreads = BOOK_EL.querySelectorAll('.spread');
  spreads.forEach((s, i) => s.classList.toggle('active', i === idx));
  CUR_IDX.textContent = idx + 1;
  PREV_BTN.disabled = idx === 0;
  NEXT_BTN.disabled = idx === SPREADS.length - 1;
  try { localStorage.setItem(LS_KEY, String(idx)); } catch (e) {}
}

PREV_BTN.addEventListener('click', () => goTo(currentSpread - 1));
NEXT_BTN.addEventListener('click', () => goTo(currentSpread + 1));

TOC_TOGGLE.addEventListener('click', () => goTo(1)); // TOC is spread 1

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
    e.preventDefault();
    goTo(currentSpread + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    e.preventDefault();
    goTo(currentSpread - 1);
  } else if (e.key === 'Home') {
    e.preventDefault();
    goTo(0);
  } else if (e.key === 'End') {
    e.preventDefault();
    goTo(SPREADS.length - 1);
  }
});

/* Click on left half goes back, right half goes forward */
BOOK_EL.addEventListener('click', (e) => {
  // ignore clicks on TOC items and interactive elements
  if (e.target.closest('.toc-item')) return;
  if (e.target.closest('button, a, input')) return;
  const frameRect = BOOK_FRAME.getBoundingClientRect();
  const localX = e.clientX - frameRect.left;
  if (localX < frameRect.width * 0.22) {
    goTo(currentSpread - 1);
  } else if (localX > frameRect.width * 0.78) {
    goTo(currentSpread + 1);
  }
});

/* ═════ FIT TO VIEWPORT ═════ */
function fit() {
  const padX = 48;
  const padY = 48;
  const w = window.innerWidth - padX * 2;
  const h = window.innerHeight - padY * 2;
  const scale = Math.min(w / 1600, h / 1100, 1);
  BOOK_FRAME.style.transform = `translate(-50%, -50%) scale(${scale})`;
}
window.addEventListener('resize', fit);

/* ═════ INIT ═════ */
buildAll();
fit();
let initialIdx = 0;
try {
  const saved = localStorage.getItem(LS_KEY);
  if (saved !== null) initialIdx = Math.min(Math.max(0, Number(saved)), SPREADS.length - 1);
} catch (e) {}
goTo(initialIdx);
