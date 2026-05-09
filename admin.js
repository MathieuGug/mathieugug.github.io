/* mathieugug.github.io — easter-egg admin mode
 *
 * Shortcut: Ctrl+Alt+M (or Cmd+Alt+M on mac) opens a modal.
 *  - Logged out → demande un mot de passe. Si OK : `is-admin` activé sur <html>,
 *    `mg_admin=true` stocké dans localStorage, les .format--admin réapparaissent.
 *  - Logged in  → modal "Mode admin actif" avec bouton de déconnexion.
 *
 * Mot de passe (provisoire) : K1ng-Mathi3u
 *
 * Pas d'auth réelle : rappel que les fichiers `*.md` restent servis publiquement
 * par GitHub Pages, ce gating ne fait que masquer les liens dans les hubs.
 */
(function () {
  var STORAGE_KEY = 'mg_admin';
  var PASSWORD = 'K1ng-Mathi3u';

  function isAdmin() {
    try { return localStorage.getItem(STORAGE_KEY) === 'true'; }
    catch (e) { return false; }
  }
  function setAdmin(v) {
    try {
      if (v) localStorage.setItem(STORAGE_KEY, 'true');
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    document.documentElement.classList.toggle('is-admin', !!v);
  }

  // Inject base CSS (hide admin items by default, reveal when is-admin, modal styles).
  var css = ''
    + '.format--admin{display:none!important}'
    + 'html.is-admin .format--admin{display:block!important}'
    + 'html.is-admin .format--admin{position:relative}'
    + 'html.is-admin .format--admin::before{'
    +   'content:"Admin";position:absolute;top:14px;right:18px;'
    +   'font-family:"JetBrains Mono",ui-monospace,monospace;font-size:0.62rem;'
    +   'letter-spacing:0.18em;text-transform:uppercase;color:#b8582e;'
    +   'background:rgba(184,88,46,0.10);padding:3px 8px;border-radius:3px;'
    + '}'

    + '.mg-admin-overlay{position:fixed;inset:0;z-index:9999;display:flex;'
    +   'align-items:center;justify-content:center;padding:20px;'
    +   'background:rgba(20,16,10,0.55);backdrop-filter:blur(4px);'
    +   '-webkit-backdrop-filter:blur(4px);'
    +   'font-family:"Inter",system-ui,sans-serif;color:#1e1e2a;'
    + '}'
    + '.mg-admin-modal{background:#faf6ec;border:1px solid rgba(30,30,44,0.20);'
    +   'border-radius:6px;box-shadow:0 30px 60px rgba(30,25,18,0.22),0 10px 20px rgba(30,25,18,0.12);'
    +   'width:100%;max-width:420px;padding:28px 28px 24px;'
    + '}'
    + '.mg-admin-eyebrow{font-family:"JetBrains Mono",ui-monospace,monospace;'
    +   'font-size:0.7rem;letter-spacing:0.22em;text-transform:uppercase;'
    +   'color:#b8582e;margin-bottom:10px;'
    + '}'
    + '.mg-admin-title{font-family:"Fraunces",Georgia,serif;font-weight:400;'
    +   'font-size:1.5rem;line-height:1.2;margin:0 0 6px;color:#1e1e2a;'
    + '}'
    + '.mg-admin-title em{font-style:italic;color:#b8582e}'
    + '.mg-admin-sub{font-size:0.92rem;line-height:1.5;color:#3b3f4d;margin:0 0 18px}'
    + '.mg-admin-input{width:100%;font:inherit;font-size:0.95rem;padding:10px 12px;'
    +   'border:1px solid rgba(30,30,44,0.20);border-radius:4px;background:#fff;'
    +   'color:#1e1e2a;outline:none;'
    + '}'
    + '.mg-admin-input:focus{border-color:#b8582e;box-shadow:0 0 0 3px rgba(184,88,46,0.15)}'
    + '.mg-admin-input.error{border-color:#b8582e;background:rgba(184,88,46,0.06)}'
    + '.mg-admin-error{font-size:0.82rem;color:#b8582e;margin:6px 0 0;min-height:1.1em}'
    + '.mg-admin-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:18px;flex-wrap:wrap}'
    + '.mg-admin-btn{font:inherit;font-size:0.85rem;font-family:"JetBrains Mono",ui-monospace,monospace;'
    +   'letter-spacing:0.16em;text-transform:uppercase;padding:9px 14px;border-radius:3px;'
    +   'border:1px solid rgba(30,30,44,0.20);background:#fff;color:#1e1e2a;cursor:pointer;'
    +   'transition:background 120ms ease,color 120ms ease,border-color 120ms ease;'
    + '}'
    + '.mg-admin-btn:hover{border-color:#1e1e2a}'
    + '.mg-admin-btn--primary{background:#1e1e2a;border-color:#1e1e2a;color:#faf6ec}'
    + '.mg-admin-btn--primary:hover{background:#b8582e;border-color:#b8582e}'
    + '.mg-admin-btn--danger{color:#b8582e;border-color:rgba(184,88,46,0.40)}'
    + '.mg-admin-btn--danger:hover{background:#b8582e;color:#faf6ec;border-color:#b8582e}'
    + '.mg-admin-meta{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:0.72rem;'
    +   'letter-spacing:0.04em;color:#6b6f7c;margin-top:14px;line-height:1.5;'
    + '}'
    + '.mg-admin-meta code{background:rgba(30,30,44,0.06);padding:1px 5px;border-radius:2px}'

    + 'html.is-admin a.format--admin.is-zipping{pointer-events:none;opacity:0.7}'
    + 'html.is-admin a.format--admin.is-zipping .format-cta .arrow::after{'
    +   'content:" · préparation…";font-family:"JetBrains Mono",ui-monospace,monospace;'
    +   'font-size:0.85em;color:#b8582e;'
    + '}';

  var style = document.createElement('style');
  style.setAttribute('data-mg-admin', '');
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);

  // Apply current state on load.
  setAdmin(isAdmin());

  var overlay = null;

  function closeModal() {
    if (!overlay) return;
    overlay.remove();
    overlay = null;
    document.removeEventListener('keydown', onModalKey, true);
  }

  function onModalKey(e) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      e.preventDefault();
      closeModal();
    }
  }

  function buildModal(html) {
    closeModal();
    overlay = document.createElement('div');
    overlay.className = 'mg-admin-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = '<div class="mg-admin-modal">' + html + '</div>';
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.body.appendChild(overlay);
    document.addEventListener('keydown', onModalKey, true);
    return overlay.querySelector('.mg-admin-modal');
  }

  function openLoginModal() {
    var modal = buildModal(
      '<div class="mg-admin-eyebrow">Easter egg · Admin</div>'
      + '<h2 class="mg-admin-title">Mode <em>admin</em></h2>'
      + '<p class="mg-admin-sub">Affiche les annexes masquées (rapports markdown) sur l\'ensemble du site.</p>'
      + '<input type="password" class="mg-admin-input" autocomplete="off" placeholder="Mot de passe" aria-label="Mot de passe">'
      + '<p class="mg-admin-error" role="status"></p>'
      + '<div class="mg-admin-actions">'
      +   '<button type="button" class="mg-admin-btn" data-act="cancel">Annuler</button>'
      +   '<button type="button" class="mg-admin-btn mg-admin-btn--primary" data-act="ok">Activer</button>'
      + '</div>'
    );

    var input = modal.querySelector('.mg-admin-input');
    var err = modal.querySelector('.mg-admin-error');
    var submit = function () {
      if (input.value === PASSWORD) {
        setAdmin(true);
        closeModal();
      } else {
        input.classList.add('error');
        err.textContent = 'Mot de passe incorrect.';
        input.focus();
        input.select();
      }
    };
    modal.querySelector('[data-act="ok"]').addEventListener('click', submit);
    modal.querySelector('[data-act="cancel"]').addEventListener('click', closeModal);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); submit(); }
    });
    setTimeout(function () { input.focus(); }, 0);
  }

  function openLogoutModal() {
    var modal = buildModal(
      '<div class="mg-admin-eyebrow">Mode admin · Actif</div>'
      + '<h2 class="mg-admin-title">Vous êtes <em>connecté</em></h2>'
      + '<p class="mg-admin-sub">Les annexes markdown sont visibles dans les hubs. État conservé dans <code>localStorage</code>.</p>'
      + '<div class="mg-admin-actions">'
      +   '<button type="button" class="mg-admin-btn" data-act="cancel">Fermer</button>'
      +   '<button type="button" class="mg-admin-btn mg-admin-btn--danger" data-act="logout">Se déconnecter</button>'
      + '</div>'
      + '<p class="mg-admin-meta">Raccourci : <code>Ctrl/Cmd + Alt + M</code></p>'
    );
    modal.querySelector('[data-act="cancel"]').addEventListener('click', closeModal);
    modal.querySelector('[data-act="logout"]').addEventListener('click', function () {
      setAdmin(false);
      closeModal();
    });
  }

  function toggleModal() {
    if (overlay) { closeModal(); return; }
    if (isAdmin()) openLogoutModal();
    else openLoginModal();
  }

  // ---- ZIP bundling for admin md cards ---------------------------------
  // Quand on clique sur une .format--admin pointant vers un .md, on emballe
  // le rapport + le dossier images/ référencé dans un .zip. JSZip est chargé
  // à la demande depuis le CDN. En cas d'échec (offline, CSP, etc.) on
  // laisse le navigateur télécharger le .md seul (comportement par défaut).
  var JSZIP_URL = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
  var jszipPromise = null;
  function loadJSZip() {
    if (window.JSZip) return Promise.resolve(window.JSZip);
    if (jszipPromise) return jszipPromise;
    jszipPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = JSZIP_URL;
      s.async = true;
      s.onload = function () { resolve(window.JSZip); };
      s.onerror = function () { jszipPromise = null; reject(new Error('JSZip load failed')); };
      document.head.appendChild(s);
    });
    return jszipPromise;
  }

  function basename(path) {
    var i = path.lastIndexOf('/');
    return i >= 0 ? path.slice(i + 1) : path;
  }
  function stripExt(name) {
    var i = name.lastIndexOf('.');
    return i > 0 ? name.slice(0, i) : name;
  }
  function dirname(url) {
    var i = url.lastIndexOf('/');
    return i >= 0 ? url.slice(0, i + 1) : '';
  }

  function extractImageRefs(md) {
    var refs = [];
    var seen = {};
    var re = /!\[[^\]]*\]\(([^)\s]+)\)/g;
    var m;
    while ((m = re.exec(md)) !== null) {
      var p = m[1];
      if (/^(https?:|data:|\/\/)/i.test(p)) continue; // skip external/absolute
      if (seen[p]) continue;
      seen[p] = true;
      refs.push(p);
    }
    return refs;
  }

  function triggerDownload(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }

  function bundleAndDownload(anchor) {
    if (anchor.classList.contains('is-zipping')) return;
    anchor.classList.add('is-zipping');
    var mdHref = anchor.getAttribute('href');
    var mdUrl = new URL(mdHref, window.location.href).href;
    var baseDir = dirname(mdUrl);
    var mdName = basename(mdHref);
    var zipName = stripExt(mdName) + '.zip';

    var cleanup = function () { anchor.classList.remove('is-zipping'); };

    Promise.all([
      loadJSZip(),
      fetch(mdUrl, { cache: 'no-store' }).then(function (r) {
        if (!r.ok) throw new Error('md fetch failed: ' + r.status);
        return r.text();
      })
    ]).then(function (results) {
      var JSZip = results[0];
      var md = results[1];
      var refs = extractImageRefs(md);
      var zip = new JSZip();
      zip.file(mdName, md);
      return Promise.all(refs.map(function (rel) {
        var url = new URL(rel, baseDir).href;
        return fetch(url, { cache: 'no-store' }).then(function (r) {
          if (!r.ok) {
            console.warn('[admin.zip] skipped (', r.status, '):', url);
            return null;
          }
          return r.blob().then(function (b) { return { rel: rel, blob: b }; });
        }).catch(function (e) {
          console.warn('[admin.zip] skipped:', url, e);
          return null;
        });
      })).then(function (items) {
        items.forEach(function (it) {
          if (it) zip.file(it.rel, it.blob);
        });
        return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
      });
    }).then(function (blob) {
      triggerDownload(blob, zipName);
      cleanup();
    }).catch(function (e) {
      console.error('[admin.zip] fallback to md download:', e);
      cleanup();
      // Fallback : laisser le href original télécharger le .md tel quel.
      var fallback = document.createElement('a');
      fallback.href = anchor.href;
      fallback.download = mdName;
      document.body.appendChild(fallback);
      fallback.click();
      document.body.removeChild(fallback);
    });
  }

  document.addEventListener('click', function (e) {
    if (!isAdmin()) return;
    var a = e.target.closest && e.target.closest('a.format--admin');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (!/\.md(\?|#|$)/i.test(href)) return;
    e.preventDefault();
    bundleAndDownload(a);
  });

  // Met à jour les libellés des cartes admin en mode admin pour refléter
  // que c'est désormais un zip md + images/ (pas un .md seul).
  function relabelAdminCards() {
    if (!document.documentElement.classList.contains('is-admin')) return;
    var cards = document.querySelectorAll('a.format--admin[href$=".md"]');
    cards.forEach(function (a) {
      if (a.dataset.adminRelabeled) return;
      a.dataset.adminRelabeled = '1';
      var tag = a.querySelector('.format-tag');
      if (tag) tag.textContent = tag.textContent.replace(/markdown/i, 'archive .zip (md + images)');
      var cta = a.querySelector('.format-cta span:first-child');
      if (cta) cta.textContent = 'Téléchargement .zip';
    });
  }

  // Re-label après que le DOM est prêt et après chaque changement d'état admin.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', relabelAdminCards);
  } else {
    relabelAdminCards();
  }
  var _origSetAdmin = setAdmin;
  setAdmin = function (v) { _origSetAdmin(v); relabelAdminCards(); };

  document.addEventListener('keydown', function (e) {
    // Ctrl+Alt+M (Win/Linux) or Cmd+Alt+M (mac), case-insensitive.
    if (!e.altKey) return;
    if (!(e.ctrlKey || e.metaKey)) return;
    var k = (e.key || '').toLowerCase();
    if (k !== 'm' && k !== 'µ') return; // 'µ' = Alt+M sur certains layouts mac
    e.preventDefault();
    toggleModal();
  });
})();
