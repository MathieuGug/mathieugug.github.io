"""Tests pour extract_to_lib.py — pytest non requis, utilise unittest natif."""
import unittest
from pathlib import Path
import sys
import tempfile
import shutil

sys.path.insert(0, str(Path(__file__).parent))
from extract_to_lib import find_js_boundary, find_css_pattern_blocks, migrate_app


REPO = Path(__file__).parent.parent
REFERENCE_APP = REPO / "observabilite-agents-ia" / "20260430-observabilite-agents-ia-app.html"


class TestBoundaryDetection(unittest.TestCase):
    def test_find_js_boundary_locates_modal_dispatcher(self):
        """Le boundary JS est la première ligne qui contient '// Modal dispatcher'."""
        # Sur une app pas encore migrée, ce comment marker existe.
        # Sur une app déjà migrée, find_js_boundary retourne None.
        sample = """
const SCHEMAS = {};
const SOURCES = [];

    // ─────────────────────────────────────────────────
    // Modal dispatcher
    // ─────────────────────────────────────────────────

    const modalRoot = document.getElementById('modal-root');
"""
        line = find_js_boundary(sample)
        self.assertIsNotNone(line)
        self.assertIn("Modal dispatcher", sample.splitlines()[line])

    def test_find_js_boundary_returns_none_when_already_migrated(self):
        sample = """
const SCHEMAS = {};
window.SCHEMAS = SCHEMAS;
"""
        line = find_js_boundary(sample)
        self.assertIsNone(line)

    def test_find_js_boundary_css_style_marker(self):
        """Détecte aussi le marker CSS-style '/* ─── Modal dispatcher ─── */'."""
        sample = """
    const SCHEMAS = {};
    };
    const SOURCES = [];

    /* ───────── Modal dispatcher ───────── */
    const modalRoot    = document.getElementById('modal-root');
"""
        line = find_js_boundary(sample)
        self.assertIsNotNone(line)
        self.assertIn("Modal dispatcher", sample.splitlines()[line])

    def test_find_js_boundary_fallback_to_modalRoot(self):
        """Fallback vers 'const modalRoot = document.getElementById' quand pas de marker."""
        sample = """
    const SCHEMAS = {
      'schema-01': {}
    };
    const SOURCES = [];

    const modalRoot = document.getElementById('modal-root');
    const modalEyebrow = document.getElementById('modal-eyebrow');
"""
        line = find_js_boundary(sample)
        self.assertIsNotNone(line)
        self.assertIn("modalRoot", sample.splitlines()[line])

    def test_find_js_boundary_already_migrated_with_assets_script(self):
        """Une app avec <script src="/assets/dossier-app.js"> est déjà migrée."""
        sample = """<html><head>
<link rel="stylesheet" href="/assets/dossier-app.css">
</head><body>
<script>const SCHEMAS={};window.SCHEMAS=SCHEMAS;</script>
<script src="/assets/dossier-app.js" defer></script>
</body></html>"""
        result = find_js_boundary(sample)
        self.assertIsNone(result)


class TestMigrationIdempotent(unittest.TestCase):
    def test_migrate_app_is_idempotent(self):
        """Une app déjà migrée n'est pas re-modifiée."""
        with tempfile.TemporaryDirectory() as td:
            sample = Path(td) / "app.html"
            sample.write_text("""<html><head>
<link rel="stylesheet" href="/assets/dossier-app.css">
</head><body>
<script>const SCHEMAS={};window.SCHEMAS=SCHEMAS;</script>
<script src="/assets/dossier-app.js" defer></script>
</body></html>""", encoding='utf-8')
            before = sample.read_text(encoding='utf-8')
            result = migrate_app(sample, dry_run=False)
            after = sample.read_text(encoding='utf-8')
            self.assertEqual(before, after)
            self.assertEqual(result['status'], 'already-migrated')

    def test_migrate_app_dry_run_does_not_write(self):
        """dry_run=True ne modifie pas le fichier."""
        with tempfile.TemporaryDirectory() as td:
            sample = Path(td) / "app.html"
            content = """<html><head><style>
    .zoom-btn { position: absolute; }
</style></head><body>
<script>
const SCHEMAS = {};
const SOURCES = [];
    // Modal dispatcher
    const modalRoot = document.getElementById('modal-root');
    document.addEventListener('click', () => {});
</script>
</body></html>"""
            sample.write_text(content, encoding='utf-8')
            before = sample.read_text(encoding='utf-8')
            result = migrate_app(sample, dry_run=True)
            after = sample.read_text(encoding='utf-8')
            self.assertEqual(before, after)
            self.assertEqual(result['status'], 'would-migrate')

    def test_migrate_app_adds_link_and_script(self):
        """migrate_app() ajoute <link> et <script src> après migration."""
        with tempfile.TemporaryDirectory() as td:
            sample = Path(td) / "app.html"
            content = """<html><head><style>
:root { --paper: #faf6ec; }
    .zoom-btn { opacity: 0; }
</style></head><body>
<script>
const SCHEMAS = {};
const SOURCES = [];
    // Modal dispatcher
    const modalRoot = document.getElementById('modal-root');
    document.addEventListener('click', () => {});
</script>
</body></html>"""
            sample.write_text(content, encoding='utf-8')
            result = migrate_app(sample, dry_run=False)
            after = sample.read_text(encoding='utf-8')
            self.assertEqual(result['status'], 'migrated')
            self.assertIn('/assets/dossier-app.css', after)
            self.assertIn('/assets/dossier-app.js', after)
            self.assertIn('window.SCHEMAS = SCHEMAS', after)
            # JS behavioral code should be removed
            self.assertNotIn("document.addEventListener('click', () => {})", after)

    def test_migrate_app_no_boundary_returns_warning(self):
        """Une app sans boundary connu retourne no-boundary-found."""
        with tempfile.TemporaryDirectory() as td:
            sample = Path(td) / "app.html"
            content = """<html><head></head><body>
<script>
const data = 'no schemas here';
</script>
</body></html>"""
            sample.write_text(content, encoding='utf-8')
            result = migrate_app(sample, dry_run=True)
            self.assertEqual(result['status'], 'no-boundary-found')
            self.assertTrue(len(result['warnings']) > 0)


class TestCssBlocks(unittest.TestCase):
    def test_find_css_pattern_blocks_in_reference(self):
        """Teste find_css_pattern_blocks() sur un sample mock avec markers."""
        sample = """\
:root {}
/* ───────── Layout ───────── */
.layout { display: grid; }
/* ───────── Header ───────── */
.topbar { position: fixed; }
/* ───────── Tooltipped terms ───────── */
.term {}
/* ───────── Fullscreen zoom overlay ───────── */
#zoom-overlay {}
/* ───────── Citations ───────── */
.cite {}
/* ───────── Schema sigil ───────── */
.sigil-mark {}
</style>
"""
        blocks = find_css_pattern_blocks(sample)
        self.assertEqual(len(blocks), 6)
        labels = [b[2] for b in blocks]
        self.assertEqual(labels, ['layout', 'topbar', 'tooltips', 'zoom', 'citations', 'sigil'])

    def test_find_css_pattern_blocks_empty_when_no_markers(self):
        """Sans markers, find_css_pattern_blocks retourne une liste vide."""
        sample = """\
:root { --paper: #faf6ec; }
.layout { display: grid; }
.topbar { position: fixed; }
#zoom-overlay { position: fixed; }
.cite { color: red; }
</style>
"""
        blocks = find_css_pattern_blocks(sample)
        self.assertEqual(len(blocks), 0)

    def test_css_rules_removed_from_sample_content(self):
        """Les règles CSS lib sont supprimées du contenu HTML après migration."""
        with tempfile.TemporaryDirectory() as td:
            sample = Path(td) / "app.html"
            content = """<html><head><style>
    :root { --paper: #faf; }
    .zoom-btn { position: absolute; top: 32px; left: 8px; opacity: 0; }
    .figure:hover .zoom-btn, .zoom-btn:focus-visible { opacity: 1; }
    .zoom-btn:hover { background: var(--paper-2); }
    @media (hover: none) { .zoom-btn { opacity: 0.85; } }
    #zoom-overlay[hidden] { display: none !important; }
    #zoom-overlay { position: fixed; inset: 0; z-index: 80; }
    #modal-root[hidden] { display: none !important; }
    #modal-root { position: fixed; inset: 0; z-index: 100; }
    .modal-backdrop { background: rgba(0,0,0,0.5); }
    .cite { color: var(--carmine); }
    .cite::before { content: '['; }
    .cite::after { content: ']'; }
    .sidebar-edge-toggle { width: 22px; }
    #sources-collapse-btn { position: fixed; }
    #sources-expand-btn { position: fixed; }
    #sources-expand-btn[hidden] { display: none !important; }
</style></head><body>
<div id="zoom-overlay" hidden></div>
<div id="modal-root" hidden></div>
<script>
const SCHEMAS = {};
const SOURCES = [];
    // Modal dispatcher
    const modalRoot = document.getElementById('modal-root');
    document.addEventListener('click', (e) => {});
</script>
</body></html>"""
            sample.write_text(content, encoding='utf-8')
            migrate_app(sample, dry_run=False)
            after = sample.read_text(encoding='utf-8')
            # CSS rules should be removed
            self.assertNotIn('#zoom-overlay { position: fixed', after,
                             "zoom-overlay CSS rule should be removed")
            self.assertNotIn('#modal-root { position: fixed', after,
                             "modal-root CSS rule should be removed")
            self.assertNotIn('.sidebar-edge-toggle { width: 22px', after,
                             "sidebar-edge-toggle CSS rule should be removed")
            # But HTML elements with those IDs should remain
            self.assertIn('id="zoom-overlay"', after,
                          "zoom-overlay HTML element must remain")
            self.assertIn('id="modal-root"', after,
                          "modal-root HTML element must remain")

    def test_window_schemas_added_when_missing(self):
        """window.SCHEMAS = SCHEMAS est ajouté si absent."""
        with tempfile.TemporaryDirectory() as td:
            sample = Path(td) / "app.html"
            content = """<html><head><style>:root{}</style></head><body>
<script>
const SCHEMAS = {'key': {}};
const SOURCES = [];
    // Modal dispatcher
    const modalRoot = document.getElementById('modal-root');
</script>
</body></html>"""
            sample.write_text(content, encoding='utf-8')
            migrate_app(sample, dry_run=False)
            after = sample.read_text(encoding='utf-8')
            self.assertIn('window.SCHEMAS = SCHEMAS', after)

    def test_window_schemas_not_duplicated_when_present(self):
        """window.SCHEMAS n'est pas ajouté en double si déjà présent."""
        with tempfile.TemporaryDirectory() as td:
            sample = Path(td) / "app.html"
            content = """<html><head><style>:root{}</style></head><body>
<script>
const SCHEMAS = {};
const SOURCES = [];
window.SCHEMAS = SCHEMAS;
    // Modal dispatcher
    const modalRoot = document.getElementById('modal-root');
</script>
</body></html>"""
            sample.write_text(content, encoding='utf-8')
            migrate_app(sample, dry_run=False)
            after = sample.read_text(encoding='utf-8')
            # Should appear exactly once
            self.assertEqual(after.count('window.SCHEMAS = SCHEMAS'), 1)


    def test_compound_sigil_selector_removed(self):
        """schema-sigil sigil-mark compound selector must be removed (Bug 1)."""
        with tempfile.TemporaryDirectory() as td:
            sample = Path(td) / "app.html"
            content = """<html><head><style>
:root {}
    .schema-sigil .sigil-mark { display: block; width: 100%; height: 100%; }
</style></head><body>
<script>
const SCHEMAS = {};
const SOURCES = [];
    // Modal dispatcher
    const modalRoot = document.getElementById('modal-root');
</script>
</body></html>"""
            sample.write_text(content, encoding='utf-8')
            migrate_app(sample, dry_run=False)
            result = sample.read_text(encoding='utf-8')
            self.assertNotIn('.schema-sigil .sigil-mark', result,
                             '.schema-sigil .sigil-mark should be removed (Bug 1)')

    def test_layout_sources_collapsed_btn_rule_removed(self):
        """.layout.sources-collapsed #sources-collapse-btn must be removed (Bug 2)."""
        with tempfile.TemporaryDirectory() as td:
            sample = Path(td) / "app.html"
            content = """<html><head><style>
:root {}
      .layout.sources-collapsed #sources-collapse-btn { visibility: hidden; }
</style></head><body>
<script>
const SCHEMAS = {};
const SOURCES = [];
    // Modal dispatcher
    const modalRoot = document.getElementById('modal-root');
</script>
</body></html>"""
            sample.write_text(content, encoding='utf-8')
            migrate_app(sample, dry_run=False)
            result = sample.read_text(encoding='utf-8')
            self.assertNotIn('.layout.sources-collapsed #sources-collapse-btn', result,
                             '.layout.sources-collapsed #sources-collapse-btn should be removed (Bug 2)')

    def test_inline_media_query_sidebar_toggle_removed(self):
        """`@media (max-width: 1024px) { .sidebar-edge-toggle { ... } }` inline must be removed (Bug 3)."""
        with tempfile.TemporaryDirectory() as td:
            sample = Path(td) / "app.html"
            content = """<html><head><style>
:root {}
    @media (max-width: 1024px) { .sidebar-edge-toggle { display: none !important; } }
</style></head><body>
<script>
const SCHEMAS = {};
const SOURCES = [];
    // Modal dispatcher
    const modalRoot = document.getElementById('modal-root');
</script>
</body></html>"""
            sample.write_text(content, encoding='utf-8')
            migrate_app(sample, dry_run=False)
            result = sample.read_text(encoding='utf-8')
            self.assertNotIn('@media (max-width: 1024px) { .sidebar-edge-toggle', result,
                             'Inline @media .sidebar-edge-toggle one-liner should be removed (Bug 3)')


if __name__ == '__main__':
    unittest.main()
