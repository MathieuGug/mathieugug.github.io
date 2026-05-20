{
  "schema-01": {
    "user": {
      eyebrow: "Frontière 0 — utilisateur",
      title: "USER — point d'entrée",
      body: "<p>L'utilisateur est l'origine du prompt et le récepteur du résultat. Côté sécurité, c'est aussi le point où s'opère le <strong>consent à l'install</strong> d'un serveur MCP : afficher la description complète des outils, exiger une lecture explicite des permissions, refuser tout serveur dont la signature n'a pas été vérifiée. La friction à l'install est inversement corrélée au taux d'attaques réussies — un consent rapide qui ne montre que le nom du serveur laisse passer la majorité des TPA.</p>"
    },
    "host": {
      eyebrow: "Frontière 1 — host",
      title: "HOST — Claude Desktop, Cursor, Cline",
      body: "<p>Le host est l'application qui lance le client MCP. C'est aussi la couche qui contrôle le sandbox processus du serveur (capabilities Linux, namespace isolation, accès filesystem restreint). Un host bien configuré exécute chaque serveur MCP dans son propre conteneur avec un mount limité et zéro accès réseau par défaut — un host laxiste lance un <code>npx</code> qui hérite des permissions du shell utilisateur.</p>"
    },
    "client": {
      eyebrow: "Frontière 2 — client",
      title: "CLIENT — runtime MCP",
      body: "<p>Le client est la bibliothèque qui parle JSON-RPC au serveur via stdio ou HTTP/SSE. C'est lui qui orchestre OAuth, gère la session, et délivre la liste d'outils au LLM. Côté défense : sanitization Unicode des descriptions à la réception (élimine les variant Unicode tags du §2), validation des schémas d'outils contre un type strict, hash pinning des serveurs connectés.</p>"
    },
    "server": {
      eyebrow: "Frontière 3 — server",
      title: "SERVER — l'exposeur d'outils",
      body: "<p>Le serveur MCP est le composant qui expose les <code>tools</code>, <code>resources</code> et <code>prompts</code>. C'est aussi le point où la majorité des TPA sont posées : description JSON empoisonnée, rug pull à la version suivante, tool shadowing entre serveurs co-installés. La défense structurelle attendue pour automne 2026 : signature Sigstore obligatoire, manifest immuable, registry validé.</p>"
    },
    "tool": {
      eyebrow: "Frontière 4 — tool",
      title: "TOOL — la fonction exécutée",
      body: "<p>L'outil est la fonction concrète invoquée par le serveur. Côté agent, c'est ici que la distinction <code>read_only</code> / <code>external_write</code> / <code>local_write</code> doit être posée et respectée. Côté serveur, c'est le point où les credentials downstream sont consommés — exigence : <strong>token scoping serré</strong>, refresh rotation, aucun passthrough du token utilisateur vers un tiers.</p>"
    },
    "data": {
      eyebrow: "Frontière 5 — data",
      title: "DATA — la source externe",
      body: "<p>La donnée externe (filesystem, API, base, issue GitHub, email) est l'endroit où l'attaquant peut <em>poser une charge</em>. Toute lecture d'une source non-fiable est, pour le LLM, équivalente à l'exécution d'un nouveau prompt. Défense : encapsulation systématique du contenu lu dans un wrapper <code>&lt;external_data&gt;</code> que le prompt système instruit à ne pas exécuter comme instruction.</p>"
    },
    "tb1": {
      eyebrow: "Trust boundary 1",
      title: "User → Host",
      body: "<p>Point critique du <strong>consent à l'install</strong>. Pattern défensif : afficher la description JSON complète de chaque outil, demander un consent par serveur, refuser tout serveur non signé sur les registries officiels. Cette frontière est aussi celle où l'utilisateur peut configurer des allowlists et des limites de comportement.</p>"
    },
    "tb2": {
      eyebrow: "Trust boundary 2",
      title: "Host → Client",
      body: "<p>Le client est lancé par le host avec ses capabilities. Sandbox obligatoire en production : conteneur dédié, capabilities Linux restreintes, accès réseau limité par allowlist. Sans sandbox, un serveur MCP compromis hérite des droits du shell — accès SSH, mots de passe, tokens.</p>"
    },
    "tb3": {
      eyebrow: "Trust boundary 3",
      title: "Client → Server",
      body: "<p>OAuth 2.0 + PKCE pour le transport HTTP, hash pinning pour le transport stdio. Cette frontière est exposée aux pitfalls OAuth de la famille D : DCR open registration, token passthrough, session hijack. Mitigation : scope-narrow OAuth, refresh rotation systématique, TLS strict.</p>"
    },
    "tb4": {
      eyebrow: "Trust boundary 4",
      title: "Server → Tool",
      body: "<p>Le serveur invoque l'outil concret. C'est la frontière où le <strong>tool tagging</strong> (read_only / external_write / local_write) prend son sens : la classe d'outil dicte si un consent humain est requis ou non. Le pattern défensif structurel : tagging à l'install + allowlist namespace + HITL sur les write tools.</p>"
    },
    "tb5": {
      eyebrow: "Trust boundary 5",
      title: "Tool → Data",
      body: "<p>L'outil lit ou écrit une donnée externe. Côté credentials : scope-narrow au niveau de la source (un tool GitHub n'a pas besoin de l'accès admin du compte ; un tool Email n'a besoin que de send/scope, pas de delete). C'est aussi ici que le rate limiting prend effet — un agent qui appelle <code>list_messages</code> 200 fois en 30 secondes doit déclencher une alerte.</p>"
    },
    "tb6": {
      eyebrow: "Trust boundary 6",
      title: "Data → Model (re-bouclage)",
      body: "<p>La sortie de l'outil revient dans le contexte du modèle — et c'est ici que la chaîne d'exfiltration de la famille B se referme. Le contenu externe doit être encapsulé dans <code>&lt;external_data&gt;</code> avec instruction système explicite de ne pas l'interpréter comme commande. Défense empirique : taux d'attaques réussies réduit, pas annulé.</p>"
    }
  },

  "schema-02": {
    "static": {
      eyebrow: "Variant A",
      title: "Description statique empoisonnée",
      body: "<p>L'attaque originale documentée par Invariant Labs le 25 mars 2025<sup class=\"cite\"><a href=\"#source-2\" data-cite=\"2\">2</a></sup>. La description JSON contient des balises HTML-like (souvent <code>&lt;important&gt;</code> ou <code>&lt;system&gt;</code>) qui ne sont pas rendues à l'utilisateur dans l'UI mais sont lues mot pour mot par le LLM dans son prompt système.</p><p><strong>Mitigation</strong> : signature Sigstore du manifest, hash pinning au consent, affichage texte brut de la description complète à l'install (pas de markdown render qui pourrait masquer les balises).</p>"
    },
    "rugpull": {
      eyebrow: "Variant B",
      title: "Rug pull — description rotative",
      body: "<p>Le serveur publie une première version propre, attend l'approbation utilisateur, puis pousse silencieusement une nouvelle version avec description empoisonnée. Les clients qui n'ont pas de hash pinning re-fetchent la description à chaque démarrage et adoptent la nouvelle sans re-consent.</p><p><strong>Mitigation</strong> : hash pinning obligatoire au consent — Claude Desktop l'a implémenté en octobre 2025. Re-consent obligatoire à tout changement de hash. La signature Sigstore aggrave la barrière : un changement de description nécessite une nouvelle signature légitime, traçable dans le transparency log.</p>"
    },
    "unicode": {
      eyebrow: "Variant C",
      title: "Unicode tags invisibles",
      body: "<p>Les caractères du bloc Unicode <em>Tags</em> (U+E0000 à U+E007F) sont des codes de modification de texte qui ne s'affichent pas visuellement mais sont lus par tout parser texte — y compris le tokenizer du LLM. Un attaquant encode son instruction malveillante en Tags Unicode au sein d'une description en apparence inoffensive.</p><p><strong>Mitigation</strong> : sanitization Unicode au parsing côté client (filtre les caractères du bloc Tags). Claude Code l'a ajouté en janvier 2026, Cursor en mars. À noter : la sanitization doit aussi cibler les <em>variation selectors</em> et les <em>zero-width characters</em>, qui peuvent jouer un rôle similaire.</p>"
    },
    "linejump": {
      eyebrow: "Variant D",
      title: "Line-jumping",
      body: "<p>L'attaquant utilise des séparateurs de format (<code>---END TOOL---</code>, <code>SYSTEM:</code>, lignes vides multiples) pour faire croire au LLM que la description se termine et qu'un nouveau bloc système commence. Variante du prompt injection classique, adaptée au format MCP.</p><p><strong>Mitigation</strong> : encapsulation stricte des descriptions par tags privés réservés au client (du genre <code>&lt;mcp:tool-desc&gt;...&lt;/mcp:tool-desc&gt;</code>), avec instructions système explicites de traiter le contenu interne comme donnée et non comme instruction.</p>"
    }
  },

  "schema-03": {
    "step1": {
      eyebrow: "Étape 1 — la charge",
      title: "L'attaquant pose la charge",
      body: "<p>L'attaquant n'a besoin d'aucun accès au système de la cible. Il publie son payload là où la cible va lire : issue GitHub publique, ticket Asana partagé, message dans un channel Slack ouvert, email dans une boîte que l'agent va dépouiller. Le contenu est du texte qui ressemble à une instruction utilisateur — exactement le genre de texte qu'un LLM exécute par défaut.</p><p>L'attaque est <strong>asynchrone</strong> : l'attaquant pose la charge à t=0, l'agent l'exécute à t=N quand le mainteneur lance la commande triage. Pas de fenêtre temporelle requise.</p>"
    },
    "step2": {
      eyebrow: "Étape 2 — la lecture",
      title: "L'agent lit via tool MCP",
      body: "<p>Le mainteneur demande à l'agent une tâche légitime : <em>« triage mes issues »</em>, <em>« résume mes emails »</em>, <em>« liste les tickets ouverts »</em>. L'agent appelle innocemment <code>github.list_issues()</code> ou <code>email.list_inbox()</code>. La sortie de cet appel contient le payload posé à l'étape 1.</p><p>Ce qui rend l'attaque pernicieuse : <strong>la lecture est elle-même légitime</strong>. L'agent fait ce qui lui est demandé. C'est la suite qui dérape.</p>"
    },
    "step3": {
      eyebrow: "Étape 3 — le pivot",
      title: "Le LLM lit le texte = l'exécute",
      body: "<p>C'est le pivot fondateur de toute la famille B. Le LLM reçoit dans son contexte un texte qui ressemble à une instruction. Aucune frontière n'existe nativement, dans son tokenizer ou dans son entraînement, entre <em>« texte que l'utilisateur m'a envoyé »</em> et <em>« texte que j'ai lu via un tool »</em>. Les deux sont concaténés dans le contexte, et le LLM décide quoi faire à partir de l'ensemble.</p><p><strong>Mitigation partielle</strong> : encapsuler tout contenu externe dans un wrapper <code>&lt;external_data&gt;</code> avec instructions système strictes. Empirique — réduit le taux mais ne l'annule pas.</p>"
    },
    "step4": {
      eyebrow: "Étape 4 — l'exfiltration",
      title: "L'agent appelle un write tool",
      body: "<p>Convaincu par le texte lu, l'agent appelle <code>email.send()</code>, <code>github.create_pr()</code>, <code>slack.post_message()</code> avec en payload les credentials ou les données ciblées. L'attaquant récupère le contenu via le canal qu'il a lui-même choisi à l'étape 1.</p><p><strong>Mitigation load-bearing</strong> : human-in-the-loop obligatoire sur tout outil <code>external_write</code>. Toute écriture vers un canal externe déclenche un dialogue de confirmation. C'est la défense ultime de la famille B.</p>"
    }
  },

  "schema-04": {
    "v01": {
      eyebrow: "Vecteur 01 — famille A",
      title: "Description statique empoisonnée (TPA)",
      body: "<p>Le TPA original Invariant Labs (mars 2025). Description JSON avec balises <code>&lt;important&gt;</code> non rendues à l'utilisateur mais lues par le LLM.<sup class=\"cite\"><a href=\"#source-2\" data-cite=\"2\">2</a></sup></p><p><strong>Patterns couvrants</strong> : P1 (Sigstore — couverture pleine), P2 (Tagging — partielle), P5 (Sandbox — partielle), P10 (Provenance — partielle).</p>"
    },
    "v02": {
      eyebrow: "Vecteur 02 — famille A",
      title: "Rug pull (description rotative)",
      body: "<p>Description propre à l'install, malveillante après push silencieux d'une nouvelle version. Exploite l'absence de hash pinning et de re-consent.</p><p><strong>Patterns couvrants</strong> : P1 (Sigstore — couverture pleine), P2 (Tagging — partielle).</p>"
    },
    "v03": {
      eyebrow: "Vecteur 03 — famille A",
      title: "Unicode tags + line-jumping",
      body: "<p>Caractères Unicode invisibles (U+E0000–U+E007F) ou faux séparateurs <em>system-like</em> dans la description. Exploite l'absence de sanitization au parsing.</p><p><strong>Patterns couvrants</strong> : P1 (partielle), P2 (Tagging — couverture pleine via assainissement à l'install).</p>"
    },
    "v04": {
      eyebrow: "Vecteur 04 — famille B",
      title: "Injection cross-document",
      body: "<p>Issue GitHub, email, ticket Asana → l'agent lit → le LLM exécute → tool call non sollicité.<sup class=\"cite\"><a href=\"#source-5\" data-cite=\"5\">5</a></sup></p><p><strong>Patterns couvrants</strong> : P4 (HITL writes — pleine), P2 (Tagging — partielle), P8 (OTel — partielle pour détection), P10 (Provenance — partielle).</p>"
    },
    "v05": {
      eyebrow: "Vecteur 05 — famille B",
      title: "Confused deputy (privilege abuse)",
      body: "<p>L'agent dispose de privilèges <em>write</em> (deploy, update_pr) et lit un document non-fiable qui les exploite. Pattern Hardy 1988 appliqué à MCP.</p><p><strong>Patterns couvrants</strong> : P2 (Tagging — pleine), P4 (HITL — pleine), P5 (Sandbox — partielle).</p>"
    },
    "v06": {
      eyebrow: "Vecteur 06 — famille B",
      title: "Exfil via metadata publique",
      body: "<p>L'agent écrit le contenu sensible dans une métadonnée accessible à l'attaquant : commentaire de PR public, titre de PR, log accessible. Variante subtile, plus difficile à détecter qu'un envoi mail direct.</p><p><strong>Patterns couvrants</strong> : P4 (HITL — pleine), P8 (OTel — partielle), P9 (Rate limit — partielle), P10 (Provenance — partielle).</p>"
    },
    "v07": {
      eyebrow: "Vecteur 07 — famille C",
      title: "Namespace collision",
      body: "<p>Deux serveurs exposent un outil de même nom. Le client n'a pas de règle de résolution standardisée — chaque implémentation invente la sienne.</p><p><strong>Patterns couvrants</strong> : P3 (Allowlist namespace — couverture pleine).</p>"
    },
    "v08": {
      eyebrow: "Vecteur 08 — famille C",
      title: "Tool shadowing + capability leak",
      body: "<p>Un serveur malveillant publie un outil dont la description mentionne un autre outil pour s'y substituer ou pour induire le LLM à composer des appels invalides entre serveurs.</p><p><strong>Patterns couvrants</strong> : P3 (Allowlist — pleine), P2 (Tagging — partielle).</p>"
    },
    "v09": {
      eyebrow: "Vecteur 09 — famille D",
      title: "OAuth / DCR pitfalls",
      body: "<p>DCR open registration, token passthrough downstream, refresh sans rotation, session hijack via <code>Mcp-Session-Id</code> exposé.<sup class=\"cite\"><a href=\"#source-8\" data-cite=\"8\">8</a></sup></p><p><strong>Patterns couvrants</strong> : P6 (OAuth scope — pleine), P7 (Refresh rotation — pleine), P9 (Rate limit — partielle).</p>"
    },
    "v10": {
      eyebrow: "Vecteur 10 — famille D",
      title: "Supply chain (NPM, PyPI)",
      body: "<p>Typosquatting (<code>@notion/mcp-srvr</code>), compromission upstream d'un mainteneur légitime, dépendance transitive empoisonnée. 14 cas documentés sur NPM entre janvier et avril 2026.<sup class=\"cite\"><a href=\"#source-9\" data-cite=\"9\">9</a></sup></p><p><strong>Patterns couvrants</strong> : P1 (Sigstore — pleine), P5 (Sandbox — partielle).</p>"
    }
  },

  "schema-05": {
    "p1": {
      eyebrow: "Pitfall 1",
      title: "DCR open registration sans rate limiting",
      body: "<p>38 % des serveurs MCP publics audités par PortSwigger en février 2026 laissaient le Dynamic Client Registration (RFC 7591) ouvert sans rate limiting<sup class=\"cite\"><a href=\"#source-8\" data-cite=\"8\">8</a></sup>. Conséquence : inondation de clients fantômes, corrélation utilisateur facilitée, consommation de quota légitime.</p><p><strong>Mitigation</strong> : rate limiting agressif sur l'endpoint <code>/register</code>, validation des metadata client (redirect URIs, scope), exigence d'identité OIDC vérifiable pour les clients haut-trust.</p>"
    },
    "p2": {
      eyebrow: "Pitfall 2",
      title: "Token passthrough vers downstream",
      body: "<p>Le client MCP passe son token utilisateur tel quel à un outil downstream qui appelle une API tierce. Si l'outil est compromis (TPA, supply chain), le token utilisateur est exposé en plein.</p><p><strong>Mitigation</strong> : OAuth scope-narrow — le token utilisateur n'est jamais propagé tel quel. Le serveur MCP échange contre un token downstream à scope restreint (token exchange RFC 8693).</p>"
    },
    "p3": {
      eyebrow: "Pitfall 3",
      title: "Refresh token sans rotation",
      body: "<p>La spec OAuth 2.1 recommande la rotation des refresh tokens à chaque usage (chaque usage invalide le précédent et émet un nouveau). Plusieurs implémentations MCP en 2025 ont ignoré cette recommandation, laissant un refresh token volé valide indéfiniment.</p><p><strong>Mitigation</strong> : rotation systématique + détection d'usage concurrent (un même refresh utilisé deux fois invalide toute la chaîne et force re-auth).</p>"
    },
    "p4": {
      eyebrow: "Pitfall 4",
      title: "Session hijack via Mcp-Session-Id",
      body: "<p>Sur transport HTTP (SSE / Streamable HTTP), la session MCP est identifiée par un header <code>Mcp-Session-Id</code>. Si ce header est exposé — proxy mal configuré, logs verbose, accès réseau partagé — un attaquant peut reprendre la session sans le token initial.</p><p><strong>Mitigation</strong> : binding session-token (un session-id n'est valide qu'avec son token bearer), expiration courte, suppression du header des logs.</p>"
    }
  },

  "schema-06": {
    "pat1": {
      eyebrow: "Pattern 1 · load-bearing",
      title: "Signature Sigstore + hash pinning",
      body: "<p>Le pivot structurel attendu pour la spec d'automne 2026. Tout serveur MCP publié sur un registry officiel est signé avec Sigstore (clé éphémère liée à une identité OIDC vérifiable, publication dans un transparency log Rekor).<sup class=\"cite\"><a href=\"#source-10\" data-cite=\"10\">10</a></sup> Le client vérifie la signature à l'install et à chaque mise à jour.</p><p><strong>Couvre</strong> : V01 (TPA), V02 (rug pull), V03 (Unicode/line-jump partiel), V10 (supply chain). <strong>Coût</strong> : moyen (plomberie CI). <strong>Effet</strong> : structurel.</p>"
    },
    "pat2": {
      eyebrow: "Pattern 2 · load-bearing",
      title: "Tool tagging (read/write/external)",
      body: "<p>Chaque outil déclare explicitement, à l'install et de manière vérifiable, sa classe : <code>read_only</code>, <code>local_write</code>, <code>external_write</code>. La classe dicte le niveau de friction utilisateur requis et limite les compositions possibles.</p><p><strong>Couvre</strong> : V03 (Unicode), V04 (cross-doc partiel), V05 (confused deputy), V08 (shadowing partiel). <strong>Coût</strong> : faible. <strong>Effet</strong> : significatif sur famille B.</p>"
    },
    "pat3": {
      eyebrow: "Pattern 3 · load-bearing",
      title: "Allowlist namespace par serveur",
      body: "<p>L'utilisateur déclare, par serveur, quels noms d'outils sont autorisés. Tout outil d'un nom non-listé (ou qui collide avec un nom déjà connecté) est rejeté. En cours de standardisation pour la spec d'automne 2026.</p><p><strong>Couvre</strong> : V07 (namespace), V08 (shadowing). <strong>Coût</strong> : faible côté client, nul côté serveur. <strong>Effet</strong> : élimine la famille C.</p>"
    },
    "pat4": {
      eyebrow: "Pattern 4 · load-bearing",
      title: "Human-in-the-loop sur les write tools",
      body: "<p>Tout appel d'outil <code>external_write</code> déclenche un dialogue de confirmation utilisateur explicite. La friction UX est réelle mais c'est la défense ultime de la famille B — le LLM ne peut pas écrire à l'extérieur sans le greenlight humain.</p><p><strong>Couvre</strong> : V04 (cross-doc), V05 (confused deputy), V06 (exfil metadata). <strong>Coût</strong> : friction UX. <strong>Effet</strong> : élimine la famille B au prix de la fluidité.</p>"
    },
    "pat5": {
      eyebrow: "Pattern 5",
      title: "Sandbox processus",
      body: "<p>Chaque serveur MCP s'exécute dans son propre conteneur avec capabilities Linux restreintes, accès filesystem limité par mount, accès réseau filtré par allowlist. Limite la blast radius d'un serveur compromis.</p><p><strong>Couvre</strong> (partiel) : V01, V05, V10.</p>"
    },
    "pat6": {
      eyebrow: "Pattern 6",
      title: "OAuth scope-narrow + token short-lived",
      body: "<p>Le token utilisateur n'est jamais propagé tel quel. Token exchange (RFC 8693) à chaque hop pour produire un token downstream à scope restreint et expiration courte. Réduit la fenêtre d'exploitation d'un token volé.</p><p><strong>Couvre</strong> : V09 (OAuth pitfalls).</p>"
    },
    "pat7": {
      eyebrow: "Pattern 7",
      title: "Refresh token rotation",
      body: "<p>Conformément à OAuth 2.1, chaque usage d'un refresh token invalide le précédent et émet un nouveau. Détection d'usage concurrent (deux usages d'un même refresh) force re-auth complète.</p><p><strong>Couvre</strong> : V09 (refresh sans rotation).</p>"
    },
    "pat8": {
      eyebrow: "Pattern 8",
      title: "Audit log OTel standardisé",
      body: "<p>Instrumentation OpenTelemetry GenAI semconv (v1.0 attendu juillet 2026) avec events MCP standardisés.<sup class=\"cite\"><a href=\"#source-11\" data-cite=\"11\">11</a></sup> Permet le forensic après incident, la corrélation cross-tool, la détection d'anomalies.</p><p><strong>Couvre</strong> (détection) : V04, V06.</p>"
    },
    "pat9": {
      eyebrow: "Pattern 9",
      title: "Rate limiting agressif",
      body: "<p>Rate limit côté serveur sur le DCR endpoint et sur les tool calls. Empêche les attaques par flood et les exfiltrations à fort débit. Seuils typiques : 10 reg/h par IP, 100 tool calls/min par session.</p><p><strong>Couvre</strong> (partiel) : V06, V09.</p>"
    },
    "pat10": {
      eyebrow: "Pattern 10",
      title: "Content provenance + tagging à la lecture",
      body: "<p>Tout contenu lu via un tool est encapsulé dans un wrapper <code>&lt;external_data source=\"...\"&gt;...&lt;/external_data&gt;</code> avec instruction système explicite de ne pas l'interpréter comme commande. Défense empirique — taux d'attaques réussies réduit, pas annulé.</p><p><strong>Couvre</strong> (partiel) : V01, V04, V06.</p>"
    }
  },

  "schema-07": {
    "m1": {
      eyebrow: "Milestone 1 · 2 août 2026",
      title: "AI Act article 15 effectif",
      body: "<p>L'AI Act européen entre en application pour les systèmes haut risque. L'article 15 impose des exigences de <em>cybersécurité</em> incluant la résistance à la manipulation par entrée adverse.<sup class=\"cite\"><a href=\"#source-12\" data-cite=\"12\">12</a></sup></p><p>Les agents MCP qualifiés haut risque (scoring crédit, KYC, recrutement, justice) devront démontrer leur robustesse contre les dix vecteurs documentés. L'EBA et l'ACPR ont publié leurs lignes directrices d'interprétation pour la banque en avril 2026.</p>"
    },
    "m2": {
      eyebrow: "Milestone 2 · automne 2026",
      title: "Spec MCP v2 — Sigstore obligatoire",
      body: "<p>Révision majeure de la spec en discussion à l'AAIF depuis février 2026<sup class=\"cite\"><a href=\"#source-4\" data-cite=\"4\">4</a></sup> :</p><ul><li>Signature Sigstore pour tous les serveurs publiés sur les registries officiels</li><li>Tool tagging structurel (read_only / external_write / requires_consent)</li><li>Allowlist namespace au niveau de la spec</li><li>Schéma OTel d'audit standardisé</li></ul><p>Compatibilité ascendante préservée — les serveurs v1 continuent à fonctionner.</p>"
    },
    "m3": {
      eyebrow: "Milestone 3 · janvier 2027",
      title: "Registries signés exigés",
      body: "<p>Anthropic Hub et le futur registry AAIF refusent les nouveaux serveurs non-signés. Le pattern d'install bascule de <code>npx -y @random-org/some-mcp</code> à <code>mcp install @hub/notion --verify-signature</code>. Chaîne de confiance vérifiable de bout en bout.</p>"
    },
    "m4": {
      eyebrow: "Milestone 4 · printemps 2027",
      title: "Convergence MCP / A2A",
      body: "<p>Le projet A2A de Google, donné à la Linux Foundation en janvier 2026, converge progressivement avec MCP via le mécanisme de <em>sampling</em>. Augmente la surface d'attaque (chaque agent A2A est un point d'entrée MCP) mais force la standardisation simultanée des patterns défensifs sur les deux protocoles — notamment identité fédérée et content provenance.</p>"
    }
  }
}
