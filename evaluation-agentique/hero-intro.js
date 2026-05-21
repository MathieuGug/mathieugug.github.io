// hero-intro.js — orchestre le scrollytelling du hub evaluation-agentique.
// Spec : docs/superpowers/specs/2026-05-21-gruyere-hero-scrollytelling-design.md
//
// Embed via :
//   <script type="module">
//     import { mountHeroIntro } from './hero-intro.js';
//     mountHeroIntro({
//       introContainer: document.getElementById('hero-intro'),
//       bannerContainer: document.getElementById('gruyere-hero'),
//     });
//   </script>

import { mountGruyereHero } from './gruyere-hero.js';

const BEATS = [
  {
    title: 'Les attaques se multiplient.',
    lede: 'Hallucinations, prompt injection, mauvais usage d’outils, fuites… Les agents IA exposent une surface d’attaque qui s’élargit chaque mois.',
  },
  {
    title: 'On met en place des sécurités.',
    lede: 'Première couche : prévention. Filtres d’input, garde-fous système, contraintes sur les outils. Beaucoup d’attaques passent encore.',
  },
  {
    title: 'Avec la maturité, on ajoute des couches.',
    lede: 'Curatif : on observe les trajectoires, on intercepte ce qui dérive en cours d’exécution. Moins de fuites — mais les trous restent.',
  },
  {
    title: 'Et encore une.',
    lede: 'Qualitatif : juges LLM, evals offline, audit humain ponctuel. Trois couches imparfaites, chacune avec ses angles morts.',
  },
  {
    title: 'Aucune n’est parfaite. Combinées, elles filtrent.',
    lede: '~1 % des attaques atteignent la cible. Évaluer un agent, c’est instrumenter ces 3 couches et mesurer ce qui passe quand même.',
  },
];

const CAPTION_FADE_MS = 180;

export function mountHeroIntro({ introContainer, bannerContainer }) {
  // bannerContainer EST le <figure class="gruyere-hero gruyere-hero--banner">.
  // introContainer EST <section class="hero-intro"> qui contient le <figure>.

  const isMobile = matchMedia('(max-width: 768px)').matches;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile ou reduced-motion : on n'instancie pas le scrollytelling.
  // L'intro est masquée par CSS @media — par sécurité on met aussi hidden.
  if (isMobile || reducedMotion) {
    if (introContainer) introContainer.hidden = true;
    const banner = mountGruyereHero(bannerContainer, { initialBeat: 5 });
    return {
      banner,
      intro: null,
      destroy() { banner.destroy(); },
    };
  }

  // Desktop : scrollytelling uniquement, pas de bannière résiduelle après.
  // On masque le <figure> bannière (utile seulement sur mobile/reduced-motion)
  // et on ne monte pas d'instance Three.js dessus — économie GPU + pas de
  // répétition visuelle de l'anim à la sortie du sticky.
  if (bannerContainer) bannerContainer.hidden = true;

  const introFigure = introContainer.querySelector('.gruyere-hero');
  const heroIntro = mountGruyereHero(introFigure, { initialBeat: 1 });

  const captionEl = introContainer.querySelector('.hero-intro__caption');
  const titleEl = captionEl.querySelector('.hero-intro__title');
  const ledeEl = captionEl.querySelector('.hero-intro__lede');

  function updateCaption(n) {
    const b = BEATS[n - 1];
    if (!b) return;
    captionEl.style.opacity = '0';
    setTimeout(() => {
      titleEl.textContent = b.title;
      ledeEl.textContent = b.lede;
      captionEl.style.opacity = '1';
    }, CAPTION_FADE_MS);
  }

  // Caption initiale (avant tout intersect)
  titleEl.textContent = BEATS[0].title;
  ledeEl.textContent = BEATS[0].lede;
  captionEl.style.opacity = '1';

  // IO 1 : beat triggers — bande horizontale centrale du viewport (~1px de haut)
  const beatIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const n = Number(e.target.dataset.beat);
      if (Number.isFinite(n) && n >= 1 && n <= 5) {
        heroIntro.setBeat(n);
        updateCaption(n);
      }
    }
  }, {
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0,
  });
  introContainer.querySelectorAll('.hero-intro__trigger').forEach((t) => beatIO.observe(t));

  // IO 2 : pause l'intro quand on est sorti de la section (économie GPU
  // pendant la lecture du hub).
  const sectionIO = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) heroIntro.resume();
    else heroIntro.pause();
  }, { threshold: 0 });
  sectionIO.observe(introContainer);

  return {
    intro: heroIntro,
    banner: null,
    destroy() {
      beatIO.disconnect();
      sectionIO.disconnect();
      heroIntro.destroy();
    },
  };
}
