#!/usr/bin/env python3
"""Analyse fréquentielle des formules « typées IA » sur le corpus du site.

Méthode identique à celle appliquée au corpus ZapNews le 2026-08-05
(cf. ZapNews `agents/shared/red-flags-ia.md`, commit 3104ea53) :

1. extraction de la prose (markdown : rapports, chapitres du livre ;
   HTML : <p>/<li>/<blockquote>/<figcaption> des pages publiées),
   dédoublonnage des phrases identiques (le livre HTML duplique les
   chapitres markdown, les apps recyclent des passages de rapports) ;
2. tics structurels : tirets cadratins et deux-points pour 1000 mots
   (médiane, p75, p90), énumérations ternaires coordonnées ;
3. mesure ciblée des ~130 tournures candidates de la liste ZapNews :
   DF (nombre de documents distincts), % du corpus, occurrences ;
4. analyse positionnelle : dernière phrase de document et de section
   (les « chutes ») ;
5. passe de découverte : n-grammes de squelettes délexicalisés classés
   par fréquence documentaire, pour faire remonter les tics propres à
   CE corpus qui ne figurent pas dans la liste ZapNews.

Usage :
    python3 tools/analyse_formules_ia.py [--root .] [--out rapport.md]
"""

import argparse
import json
import re
import statistics
import sys
import unicodedata
from collections import Counter, defaultdict
from html.parser import HTMLParser
from pathlib import Path

# ── extraction ───────────────────────────────────────────────────────────────

EXCLUDE_DIRS = {".git", ".obsidian", ".claude", "node_modules", "tests",
                "tools", "assets", "docs", "images"}
EXCLUDE_MD = {"README.md", "CLAUDE.md", "BACKLOG.md", "SOMMAIRE.md"}

PROSE_TAGS = {"p", "li", "blockquote", "figcaption", "dd", "dt"}
SKIP_TAGS = {"script", "style", "svg", "code", "pre", "noscript",
             "template", "textarea", "nav", "head"}
HEADING_TAGS = {"h1", "h2", "h3", "h4"}


class ProseExtractor(HTMLParser):
    """Extrait les blocs de prose et les frontières de section d'une page."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.blocks = []          # ("text", str) | ("section", None)
        self._skip = 0
        self._prose = 0
        self._heading = 0
        self._buf = []

    def handle_starttag(self, tag, attrs):
        if tag in SKIP_TAGS:
            self._skip += 1
        elif tag in HEADING_TAGS:
            self._heading += 1
        elif tag in PROSE_TAGS:
            self._prose += 1
            self._buf = []

    def handle_endtag(self, tag):
        if tag in SKIP_TAGS:
            self._skip = max(0, self._skip - 1)
        elif tag in HEADING_TAGS:
            self._heading = max(0, self._heading - 1)
            self.blocks.append(("section", None))
        elif tag in PROSE_TAGS and self._prose:
            self._prose -= 1
            text = " ".join("".join(self._buf).split())
            if text:
                self.blocks.append(("text", text))
            self._buf = []

    def handle_data(self, data):
        if self._prose and not self._skip and not self._heading:
            self._buf.append(data)


def normalize(text):
    text = text.replace("’", "'").replace(" ", " ")
    text = text.replace(" ", " ").replace(" ", " ")
    text = re.sub(r"https?://\S+", "", text)
    return text


def blocks_from_markdown(raw):
    raw = re.sub(r"\A---\n.*?\n---\n", "", raw, flags=re.S)      # frontmatter
    raw = re.sub(r"```.*?```", "", raw, flags=re.S)              # code fences
    raw = re.sub(r"`[^`]*`", "", raw)                            # code inline
    raw = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", raw)               # images
    raw = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", raw)           # liens
    raw = re.sub(r"==([^=]*)==", r"\1", raw)                     # stabilo
    raw = re.sub(r"<[^>]+>", " ", raw)                           # tags html
    blocks = []
    for para in raw.split("\n\n"):
        lines = [l for l in (x.strip() for x in para.split("\n"))
                 if l and not l.startswith("|") and not re.match(r"^[-=*_]{3,}$", l)]
        if not lines:
            continue
        if any(l.startswith("#") for l in lines):
            blocks.append(("section", None))
            lines = [l for l in lines if not l.startswith("#")]
        text = " ".join(l.lstrip(">*- ").strip() for l in lines)
        text = re.sub(r"[*_]{1,3}", "", text)
        text = " ".join(text.split())
        if text:
            blocks.append(("text", text))
    return blocks


def blocks_from_html(raw):
    p = ProseExtractor()
    p.feed(raw)
    return p.blocks


ABBREV = r"(?:M|MM|Mme|Dr|p|pp|ex|cf|art|fig|vs|env|min|max|etc|n°|St|chap)"
SENT_SPLIT = re.compile(
    r"(?<=[.!?…])\s+(?=[«\"“(A-ZÀ-ÖØ-Þ0-9])")


def sentences(block):
    parts = SENT_SPLIT.split(block)
    out, hold = [], ""
    for p in parts:
        if hold:
            p = hold + " " + p
            hold = ""
        if re.search(r"\b" + ABBREV + r"\.$", p):
            hold = p
            continue
        p = p.strip()
        if p:
            out.append(p)
    if hold.strip():
        out.append(hold.strip())
    return out


# ── batterie ciblée (les tournures de la liste ZapNews) ─────────────────────
# (nom, famille, regex, référence ZapNews « DF% » quand mesurée là-bas)

BATTERY = [
    # 2. charnières de raisonnement
    ("c'est précisément", "charnières", r"c'est précisément", 20),
    ("autrement dit", "charnières", r"\bautrement dit\b", 23),
    ("concrètement (tête)", "charnières", r"^concrètement\b", 12),
    ("le paradoxe est/veut", "charnières", r"le paradoxe (est|veut|n'est)", 10),
    ("c'est là que", "charnières", r"c'est là qu", 9),
    ("se joue (métaph.)", "charnières", r"\bse joue\b|\bs'y joue\b", 17),
    ("c'est dans ce contexte que", "charnières",
     r"c'est dans ce (contexte|cadre)|c'est sur ce (terrain|point) qu", 7),
    ("c'est tout l'enjeu", "charnières",
     r"c'est tout l'enjeu|tout le paradoxe|tout le problème", 6),
    ("sur le papier", "charnières", r"\bsur le papier\b", 6),
    ("dans les faits / de fait (tête)", "charnières",
     r"^(dans les faits|de fait)\b", 7),
    ("ce qui frappe/change, c'est", "charnières",
     r"ce qui (change|frappe|étonne|surprend|compte), c'est", 3),
    ("en clair (tête)", "charnières", r"^en clair\b", 2),
    ("encore faut-il", "charnières", r"\bencore faut-il\b", 2),
    ("angle mort / zone d'ombre", "charnières",
     r"angle mort|zone d'ombre|point aveugle", 6),
    # 3. antithèses par négation
    ("X n'est pas Y, c'est Z", "antithèses",
     r"n'est pas (un |une |le |la |l')?[^,;:.!?]{2,45}[,;:] c'est", 10),
    ("ce n'est pas… c'est…", "antithèses",
     r"ce n'est (pas|plus)[^.;!?]{2,60}, c'est", 15),
    ("pas seulement… aussi/mais", "antithèses",
     r"pas seulement[^.!?]{2,60}\b(aussi|mais)\b", 8),
    ("non pas X, mais Y", "antithèses", r"\bnon pas\b[^.!?]{2,60}\bmais\b", 6),
    ("n'est plus seulement", "antithèses", r"n'est plus seulement", 2),
    ("il ne s'agit pas de… mais", "antithèses",
     r"il ne s'agit (pas|plus) d[e'][^.!?]{2,60}\bmais\b", 2),
    ("pas tant… que", "antithèses", r"pas tant\b[^.!?]{2,60}\bque\b", 2),
    ("ni… ni…", "antithèses", r"\bni\b[^.;!?]{1,40}\bni\b", 17),
    ("à la fois… et", "antithèses", r"à la fois\b[^.!?]{2,60}\bet\b", 12),
    ("n'est pas anodin / pas un hasard", "antithèses",
     r"n'est pas anodin|n'a rien d'anodin|loin d'être anecdotique|n'est pas un hasard", 9),
    # 4. chutes
    ("reste à savoir/voir", "chutes", r"reste à (savoir|voir)", 5),
    ("reste que/la/le… (tête)", "chutes", r"^reste (que|la|le|un|une|à)\b", 31),
    ("tient en un mot/chiffre", "chutes",
     r"tient en (un|une|deux|trois) (mot|chiffre|phrase|image|question)", 7),
    ("en dit long / résume tout", "chutes",
     r"en dit long|dit tout de|résume tout|résume à (lui|elle) seul", 5),
    ("ne fait que commencer", "chutes", r"ne fait que commencer", 1),
    ("la question reste entière", "chutes",
     r"la question reste (entière|ouverte)|l'avenir dira", 0),
    ("sans appel", "chutes", r"\bsans appel\b", 2),
    (", et peut-être/surtout (fin)", "chutes",
     r", et (peut-être|surtout)\b[^.!?]{0,60}[.!?]$", 7),
    # 5. chevilles
    ("Or, (tête)", "chevilles", r"^or,", 20),
    ("néanmoins/toutefois/cependant (tête)", "chevilles",
     r"^(néanmoins|toutefois|cependant)\b", 17),
    ("par ailleurs", "chevilles", r"\bpar ailleurs\b", 16),
    ("plutôt que de", "chevilles", r"plutôt que d[e']", 12),
    ("mais surtout / et surtout", "chevilles",
     r"^(mais|et) surtout\b|, (mais|et) surtout\b", 11),
    ("à mesure que", "chevilles", r"à mesure qu", 10),
    ("de son côté", "chevilles", r"de (son|leur) côté", 8),
    ("à ce stade", "chevilles", r"à ce stade", 8),
    ("pour l'heure / à ce jour", "chevilles",
     r"pour l'heure|pour l'instant|à ce jour", 8),
    ("en creux", "chevilles", r"\ben creux\b", 5),
    ("en somme / au final", "chevilles",
     r"^(en somme|en définitive|au final|en fin de compte)\b", 2),
    ("il convient de / il est important de", "chevilles",
     r"il convient de|il est important de (souligner|noter)|il faut souligner", 1),
    ("c'est-à-dire", "chevilles", r"c'est-à-dire", 7),
    ("apposition « , elle, »", "chevilles", r", (elle|lui|eux|elles), ", 33),
    # 6. lexique à charge
    ("spectaculaire/vertigineux/saisissant", "lexique",
     r"spectaculaire|vertigineu|sidérant|stupéfiant|saisissant", 18),
    ("crucial/majeur/décisif", "lexique",
     r"\b(crucial|cruciale|cruciaux|majeur|majeure|majeurs|majeures|décisif|décisive)\b", 17),
    ("nom + clé (rôle clé…)", "lexique",
     r"\b(rôle|question|enjeu|facteur|point|étape|acteur|élément|moment|pièce) clés?\b", 17),
    ("historique (adj.)", "lexique", r"\bhistoriques?\b", 16),
    ("inédit / sans précédent", "lexique", r"\binédit|sans précédent", 15),
    ("profond / profondément", "lexique",
     r"\bprofonds?\b|\bprofondes?\b|profondément", 17),
    ("notable/significatif/substantiel", "lexique",
     r"\bnotable|significati|substantiel", 11),
    ("véritable (+ nom)", "lexique", r"\bvéritables?\b", 9),
    ("emblématique/incontournable/phare", "lexique",
     r"emblématique|incontournable|\bphares?\b", 7),
    ("implacable/cinglant", "lexique",
     r"implacable|cinglant|sans concession|sans détour", 6),
    ("silencieux (métaph.)", "lexique", r"silencieu(x|se)", 4),
    ("explosion/flambée/exponentiel", "lexique",
     r"\bexplos|flambée|envolée|exponentiel", 7),
    ("au cœur de", "lexique", r"au c(œ|oe)ur d", 11),
    ("s'inscrit dans (une logique…)", "lexique", r"s'inscri(t|vent) dans", 15),
    ("dans un contexte de", "lexique", r"dans un contexte d", 6),
    ("à lui seul / à elle seule", "lexique", r"à (lui|elle) seule?\b", 10),
    ("ordre de grandeur", "lexique", r"ordres? de grandeur", 11),
    ("de longue date", "lexique", r"de longue date", 6),
    ("à l'heure où / à l'ère de", "lexique",
     r"à l'heure où|au moment où|à l'ère d|dans un monde où", 10),
    ("la frontière s'estompe", "lexique",
     r"frontière entre[^.!?]{0,60}s'estompe|brouille la frontière|frontière[^.!?]{0,40}(floue|poreuse)", 3),
    ("rapport de force", "lexique", r"rapport de force", 3),
    ("pierre angulaire / talon d'Achille", "lexique",
     r"pierre angulaire|nerf de la guerre|talon d'achille|épée de damoclès|boîte de pandore", 2),
    ("changer la donne / un tournant", "lexique",
     r"chang(e|er|ent) la donne|\bla donne\b|\bun tournant\b|à double tranchant|croisée des chemins", 4),
    ("révolutionner / bouleverser", "lexique", r"révolutionn|bouleverse", 2),
    # verbes d'attribution
    ("comme le résume/souligne", "attribution",
     r"comme le (résume|rappelle|souligne|explique|note)", 11),
    ("souligne/martèle/pointe", "attribution",
     r"\bsouligne|martèle|égrène|pointe du doigt", 12),
    ("témoigne de / illustre", "attribution",
     r"témoigne d|illustre (parfaitement|bien)", 14),
    # tournures propres à CE corpus, remontées par la passe de découverte (§ 4)
    ("« X, pas Y » (négation appositive)", "découverte-site",
     r", pas (le |la |les |l'|un |une |des |du |de |d'|en |dans |sur |par "
     r"|celui|celle|ce |cette |à )", None),
    ("« — c'est / — pas » (pivot après tiret)", "découverte-site",
     r"— c'est|— pas |— et c'est|— ce qui", None),
    ("est moins X que (renversement)", "découverte-site",
     r"est moins [^.!?]{2,40}\bque\b", None),
    ("la (vraie) question est", "découverte-site",
     r"la (vraie |bonne )?question ((n'|)est|qu'on pose|qui (se pose|compte))", None),
    ("Résultat/Verdict/Constat : (tête)", "découverte-site",
     r"^(le )?(résultat|verdict|bilan|conséquence|traduction|conclusion|constat) :", None),
    ("la thèse/l'idée est simple", "découverte-site",
     r"(la thèse|l'idée|le principe|la promesse|le constat|la leçon|la réponse) est "
     r"(simple|claire?|brutale?|connue?|transposable|ailleurs|double)", None),
    ("tout se passe comme si", "découverte-site", r"tout se passe comme si", None),
    ("est/reste le cœur", "découverte-site",
     r"(est|reste|forme|constitue) le c(œ|oe)ur|le c(œ|oe)ur invariant", None),
]

TERNARY = re.compile(r"[^,;:.!?]{4,40}, [^,;:.!?]{4,40} et [^,;:.!?]{4,40}")
DASH_APPEND = re.compile(r"— [^—]{3,90}[.!?]$")

CHUTE_PATTERNS = [re.compile(p, re.I) for p in (
    r"reste à (savoir|voir)", r"^reste (que|la|le|un|une)\b",
    r"tient en (un|une)", r"en dit long|résume tout|dit tout",
    r"ne fait que commencer", r"la question reste", r"l'avenir dira",
    r"sans appel", r", et (peut-être|surtout)\b",
    r"c'est précisément", r"c'est là que", r"n'est pas [^,;:.!?]{2,45}[,;:] c'est",
)]

FACT_HINT = re.compile(r"\d|%|\b(janvier|février|mars|avril|mai|juin|juillet"
                       r"|août|septembre|octobre|novembre|décembre)\b", re.I)


def has_fact(sent):
    if FACT_HINT.search(sent):
        return True
    # nom propre à l'intérieur de la phrase (majuscule hors début)
    return bool(re.search(r"(?<![.!?…]\s)(?<!^)(?<!« )\b[A-ZÀ-Þ][a-zà-ÿ]{2,}", sent[3:]))


# ── squelettes délexicalisés (passe de découverte) ──────────────────────────

FUNC = set("""le la les l' un une des du de d' au aux à en dans sur sous vers
par pour sans avec entre chez contre depuis pendant avant après selon dès et
ou mais donc or ni car que qu' qui quoi dont où si comme quand lorsque puisque
parce ce c' cet cette ces ça cela celui celle ceux celles je tu il elle on
nous vous ils elles me m' te t' se s' lui leur y en moi toi soi eux ne n' pas
plus jamais rien personne aucun aucune guère point est sont était étaient sera
seront été être suis es sommes êtes fut a ont avait avaient aura auront eu
avoir ai as avons avez peut peuvent pouvait pourrait pourraient doit doivent
devait devrait fait font faisait fera va vont allait ira vient viennent venait
reste restent restait faut fallait faudra son sa ses mon ma mes ton ta tes
notre nos votre vos leurs même mêmes tout toute tous toutes autre autres tel
telle tels telles quel quelle quels quelles chaque plusieurs certains
certaines quelques aussi encore déjà toujours souvent parfois très trop peu
beaucoup assez moins autant bien mal mieux ici là ailleurs alors ensuite puis
enfin d'abord aujourd'hui hier demain non oui seulement surtout notamment
ainsi donc pourtant cependant néanmoins toutefois""".split())

PUNCT = set(list(".,;:!?…—–«»()[]"))
WORD_RE = re.compile(r"[\wÀ-ÿ]+(?:['’][\wÀ-ÿ]+)*['’]?|[.,;:!?…—–«»()\[\]]")
STRONG = {"pas", "n'", "ne", "c'", "ni", "non", "mais", "plus", "tout",
          "toute", "même", "aussi", "encore", "seulement", "?", "«", ":",
          "—", "est", "reste", "faut", "s'", "se"}


def skeleton(sent):
    toks = []
    for t in WORD_RE.findall(sent.lower()):
        t = t.replace("’", "'")
        if t in PUNCT:
            toks.append(t)
        elif re.fullmatch(r"\d+([.,]\d+)?", t):
            toks.append("N")
        elif t in FUNC:
            toks.append(t)
        elif "'" in t:
            pre, _, rest = t.partition("'")
            if pre + "'" in FUNC:
                toks.append(pre + "'")
                toks.append("X" if rest not in FUNC else rest)
            else:
                toks.append("X")
        else:
            toks.append("X")
    out = []
    for t in toks:
        if t == "X" and out and out[-1] == "X":
            continue
        out.append(t)
    return out


def ngrams_of(sk, nmin=3, nmax=7):
    for n in range(nmin, nmax + 1):
        for i in range(len(sk) - n + 1):
            g = sk[i:i + n]
            nx = sum(1 for t in g if t == "X")
            if nx == 0 or nx > n - 2:
                continue
            if not any(t in STRONG for t in g):
                continue
            yield " ".join(g).replace("' ", "'")


# ── main ─────────────────────────────────────────────────────────────────────

def collect_files(root, only="all"):
    mds, htmls = [], []
    for p in sorted(root.rglob("*")):
        if any(part in EXCLUDE_DIRS for part in p.relative_to(root).parts):
            continue
        if p.suffix == ".md" and p.name not in EXCLUDE_MD \
                and not p.name.startswith("PROPOSITION"):
            mds.append(p)
        elif p.suffix == ".html" and "print" not in p.name:
            htmls.append(p)
    if only == "md":
        return mds
    if only == "html":
        return htmls
    return mds + htmls          # markdown d'abord : il garde ses phrases au dédoublonnage


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=".")
    ap.add_argument("--out", default=None)
    ap.add_argument("--min-words", type=int, default=150,
                    help="mots retenus minimum pour compter comme document")
    ap.add_argument("--only", choices=["all", "md", "html"], default="all",
                    help="restreindre le corpus (md = rapports + chapitres)")
    args = ap.parse_args()
    root = Path(args.root).resolve()

    seen = set()
    dropped_dup = 0
    docs = []                    # {name, sentences:[(sect_idx, s)], words, nsects}
    for path in collect_files(root, args.only):
        raw = path.read_text(encoding="utf-8", errors="replace")
        blocks = blocks_from_markdown(normalize(raw)) if path.suffix == ".md" \
            else blocks_from_html(normalize(raw))
        sect, sents = 0, []
        for kind, text in blocks:
            if kind == "section":
                sect += 1
                continue
            for s in sentences(text):
                if len(s) < 15:
                    continue
                key = re.sub(r"[\W_]+", "", s.lower())
                if len(s.split()) >= 5:
                    if key in seen:
                        dropped_dup += 1
                        continue
                    seen.add(key)
                sents.append((sect, s))
        words = sum(len(re.findall(r"[\wÀ-ÿ'’-]+", s)) for _, s in sents)
        if words >= args.min_words:
            docs.append({"name": str(path.relative_to(root)),
                         "sents": sents, "words": words})

    ndocs = len(docs)
    total_words = sum(d["words"] for d in docs)
    total_sents = sum(len(d["sents"]) for d in docs)

    # tics structurels
    def rate(d, ch):
        return sum(s.count(ch) for _, s in d["sents"]) / d["words"] * 1000
    dash_rates = sorted(rate(d, "—") for d in docs)
    colon_rates = sorted(rate(d, ":") for d in docs)

    def pct(rates, q):
        return statistics.quantiles(rates, n=100)[q - 1] if len(rates) > 1 else rates[0]

    dash_total = sum(sum(s.count("—") for _, s in d["sents"]) for d in docs)
    dash_docs = sum(1 for d in docs if any("—" in s for _, s in d["sents"]))
    colon_total = sum(sum(s.count(":") for _, s in d["sents"]) for d in docs)

    ternary_occ, ternary_docs = 0, 0
    append_occ, append_docs = 0, 0
    for d in docs:
        t = sum(len(TERNARY.findall(s)) for _, s in d["sents"])
        a = sum(1 for _, s in d["sents"] if DASH_APPEND.search(s))
        ternary_occ += t
        append_occ += a
        ternary_docs += bool(t)
        append_docs += bool(a)

    # batterie ciblée
    batt = []
    for d in docs:
        d["hits"] = 0
    for name, family, pat, zap in BATTERY:
        rx = re.compile(pat, re.I)
        df = occ = 0
        examples = []
        for d in docs:
            hits = 0
            for _, s in d["sents"]:
                m = rx.search(s)
                if m:
                    hits += 1
                    if len(examples) < 3:
                        examples.append((d["name"], s[:180]))
            occ += hits
            df += bool(hits)
            d["hits"] += hits
        batt.append({"name": name, "family": family, "df": df, "occ": occ,
                     "pct": df / ndocs * 100, "zap": zap, "examples": examples})

    # chutes : dernière phrase de document et de section
    doc_last = [d["sents"][-1][1] for d in docs if d["sents"]]
    sect_last = []
    for d in docs:
        by_sect = defaultdict(list)
        for i, s in d["sents"]:
            by_sect[i].append(s)
        for i in sorted(by_sect):
            sect_last.append(by_sect[i][-1])
    chute_doc = sum(1 for s in doc_last if any(p.search(s) for p in CHUTE_PATTERNS))
    chute_sect = sum(1 for s in sect_last if any(p.search(s) for p in CHUTE_PATTERNS))
    nofact_doc = sum(1 for s in doc_last if not has_fact(s))

    # découverte : n-grammes de squelettes par fréquence documentaire
    battery_res = [re.compile(p, re.I) for _, _, p, _ in BATTERY]
    gram_df = Counter()
    gram_ex = {}
    for d in docs:
        seen_g = set()
        for _, s in d["sents"]:
            sk = skeleton(s)
            for g in ngrams_of(sk):
                if g not in seen_g:
                    seen_g.add(g)
                    gram_df[g] += 1
                    if g not in gram_ex:
                        gram_ex[g] = s[:140]
    top_grams = [(g, c) for g, c in gram_df.most_common(4000)
                 if c >= max(4, ndocs // 8)]

    # rapport
    L = []
    L.append("# Formules IA — corpus mathieugug.github.io\n")
    L.append(f"Analyse du {__import__('datetime').date.today().isoformat()} — "
             f"méthode ZapNews `red-flags-ia.md` (2026-08-05).\n")
    L.append(f"**{ndocs} documents** retenus (≥ {args.min_words} mots après "
             f"dédoublonnage), **{total_words:,} mots**, {total_sents:,} phrases ; "
             f"{dropped_dup:,} phrases dupliquées entre fichiers ignorées ; "
             f"longueur médiane {int(statistics.median(d['words'] for d in docs))} mots.\n")

    L.append("\n## 1. Tics structurels (pour 1000 mots)\n")
    L.append("| Mesure | Médiane | p75 | p90 | Docs concernés | Occ. | ZapNews (médiane) |")
    L.append("|---|---|---|---|---|---|---|")
    L.append(f"| Tiret cadratin `—` | {statistics.median(dash_rates):.1f} | "
             f"{pct(dash_rates,75):.1f} | {pct(dash_rates,90):.1f} | "
             f"{dash_docs}/{ndocs} ({dash_docs/ndocs*100:.0f} %) | {dash_total} | 7,8 |")
    L.append(f"| Deux-points `:` | {statistics.median(colon_rates):.1f} | "
             f"{pct(colon_rates,75):.1f} | {pct(colon_rates,90):.1f} | — | {colon_total} | 7,7 |")
    L.append(f"| Énumération ternaire | — | — | — | {ternary_docs}/{ndocs} "
             f"({ternary_docs/ndocs*100:.0f} %) | {ternary_occ} | 32 % des docs |")
    L.append(f"| Incise-ajout `— …` en fin de phrase | — | — | — | "
             f"{append_docs}/{ndocs} ({append_docs/ndocs*100:.0f} %) | {append_occ} | 37 % des docs |")

    L.append("\n## 2. Mesure ciblée des tournures (batterie ZapNews)\n")
    L.append("Triées par % de documents touchés. `ZapNews` = % mesuré sur les "
             "944 articles ZapNews le 2026-08-05.\n")
    L.append("| Tournure | Famille | DF | % docs | Occ. | ZapNews % |")
    L.append("|---|---|---|---|---|---|")
    for b in sorted(batt, key=lambda x: -x["pct"]):
        if b["df"] == 0:
            continue
        zap = f"{b['zap']} %" if b["zap"] is not None else "—"
        L.append(f"| {b['name']} | {b['family']} | {b['df']} | "
                 f"{b['pct']:.0f} % | {b['occ']} | {zap} |")
    zero = [b["name"] for b in batt if b["df"] == 0]
    if zero:
        L.append(f"\nAbsentes du corpus : {', '.join(zero)}.\n")

    L.append("\n## 3. Chutes (analyse positionnelle)\n")
    L.append(f"- Dernière phrase de **document** portant une formule de chute : "
             f"**{chute_doc}/{len(doc_last)}**.")
    L.append(f"- Dernière phrase de **section** portant une formule de chute : "
             f"**{chute_sect}/{len(sect_last)}** sections.")
    L.append(f"- Dernière phrase de document **sans fait** (ni chiffre, ni nom, "
             f"ni date) : **{nofact_doc}/{len(doc_last)}**.\n")

    L.append("\n## 4. Découverte — squelettes de phrases les plus partagés\n")
    L.append("N-grammes délexicalisés (X = mot plein), classés par fréquence "
             "documentaire ; candidats à l'entrée dans la liste des red flags.\n")
    L.append("| Squelette | DF | Exemple |")
    L.append("|---|---|---|")
    shown = 0
    for g, c in top_grams:
        if shown >= 45:
            break
        ex = gram_ex[g].replace("|", "/")
        L.append(f"| `{g}` | {c} | {ex} |")
        shown += 1

    L.append("\n## 4 bis. Classement par document (densité de tics)\n")
    L.append("Occurrences de la batterie + tirets cadratins, pour 1000 mots. "
             "Les documents à nettoyer en premier.\n")
    L.append("| Document | Mots | Tics batterie /1000 | `—` /1000 | `:` /1000 |")
    L.append("|---|---|---|---|---|")
    ranked = sorted(docs, key=lambda d: -(d["hits"] / d["words"]))
    for d in ranked[:15]:
        L.append(f"| {d['name']} | {d['words']:,} | "
                 f"{d['hits']/d['words']*1000:.1f} | "
                 f"{rate(d, '—'):.1f} | {rate(d, ':'):.1f} |")
    L.append("\nLes 5 plus sobres :\n")
    L.append("| Document | Mots | Tics batterie /1000 | `—` /1000 | `:` /1000 |")
    L.append("|---|---|---|---|---|")
    for d in ranked[-5:]:
        L.append(f"| {d['name']} | {d['words']:,} | "
                 f"{d['hits']/d['words']*1000:.1f} | "
                 f"{rate(d, '—'):.1f} | {rate(d, ':'):.1f} |")

    L.append("\n## 5. Exemples (3 max par tournure, top 12)\n")
    for b in sorted(batt, key=lambda x: -x["pct"])[:12]:
        L.append(f"\n**{b['name']}** ({b['pct']:.0f} % des docs)")
        for doc, ex in b["examples"]:
            L.append(f"- `{doc}` : « {ex} »")

    report = "\n".join(L)
    if args.out:
        Path(args.out).write_text(report, encoding="utf-8")
        print(f"Rapport écrit : {args.out}")
    summary = {
        "docs": ndocs, "words": total_words,
        "dash_median_per_1000": round(statistics.median(dash_rates), 1),
        "colon_median_per_1000": round(statistics.median(colon_rates), 1),
        "top": [{"name": b["name"], "pct": round(b["pct"]), "occ": b["occ"],
                 "zap": b["zap"]}
                for b in sorted(batt, key=lambda x: -x["pct"])[:20]],
    }
    print(json.dumps(summary, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
