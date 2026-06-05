{
  "schema-01": {
    "request": {
      title: "gen_ai.request.*",
      eyebrow: "Famille stable",
      body: "<p>La famille la plus ancienne et la plus stable. Couvre tout ce qui part de l'application vers le modèle : modèle visé (<code>request.model</code>), paramètres d'inférence (<code>temperature</code>, <code>max_tokens</code>, <code>top_p</code>, <code>stop_sequences</code>), et identifiants applicatifs.</p><p>La règle de cardinalité borne ces attributs à un set fini de valeurs (le nom du modèle, pas le prompt). Les prompts eux-mêmes vivent en événements de log corrélés, désactivés par défaut via <code>OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT</code>.</p>"
    },
    "response": {
      title: "gen_ai.response.*",
      eyebrow: "Famille stable",
      body: "<p>Symétrique du <code>request</code>, côté retour. <code>response.id</code> (identifiant du provider), <code>response.model</code> (modèle effectivement servi — peut différer du modèle demandé si le router fait du fallback), <code>response.finish_reasons</code> (array : <code>stop</code>, <code>length</code>, <code>tool_calls</code>, …), <code>choices_count</code> pour les API qui retournent plusieurs alternatives.</p><p>Le <code>system_fingerprint</code> (introduit par OpenAI puis adopté ailleurs) est l'attribut le plus discuté : tous les providers ne l'émettent pas, et la convention le laisse optionnel.</p>"
    },
    "usage": {
      title: "gen_ai.usage.*",
      eyebrow: "Famille stable",
      body: "<p>Comptage des tokens — la base de la facturation et de la métrique opérationnelle la plus universelle. <code>input_tokens</code>, <code>output_tokens</code>, <code>total_tokens</code>, <code>cached_tokens</code> (depuis que prompt caching est devenu standard). L'attribut <code>cost</code> reste optionnel et controversé : peu de providers exposent un coût stable, et le calcul côté SDK est volatile.</p><p>C'est la dimension qui alimente la métrique <code>gen_ai.client.token.usage</code>, l'histogramme standard que tous les dashboards reprennent.</p>"
    },
    "agent": {
      title: "gen_ai.agent.* — release candidate",
      eyebrow: "Statut RC depuis mars 2026",
      body: "<p>La famille qui décrit la boucle agent. <code>agent.id</code> (UUID stable d'une instance), <code>agent.name</code> (nom logique : « researcher », « executor »), <code>agent.type</code>, <code>agent.description</code>, <code>agent.tool_calls</code> (array des outils demandés sur ce tour).</p><p>RC depuis mars 2026 — devrait sceller fin 2026 ou début 2027. Le blocage principal est la convention multi-agent : la SIG attend que les frameworks (LangGraph, OpenAI Agents SDK, ADK, Claude Agent SDK) convergent avant de figer.</p>"
    },
    "evaluation": {
      title: "gen_ai.evaluation.* — release candidate",
      eyebrow: "Statut RC depuis mars 2026",
      body: "<p>Le pivot conceptuel : l'éval devient un span enfant du span jugé. Attributs : <code>evaluation.name</code>, <code>evaluation.score</code> (0-1 normalisé), <code>evaluation.threshold</code>, <code>evaluation.passed</code> (bool), et la sous-famille <code>evaluation.judge.*</code> quand un LLM-as-judge est utilisé.</p><p>Débat actif : flat (un seul JSON libre) vs typé (familles judge/rubric/dataset). Les vendeurs spécialisés poussent pour typé, les APM généralistes pour flat. Vote prévu fin 2026.</p>"
    },
    "compaction": {
      title: "gen_ai.compaction.* — draft",
      eyebrow: "Statut DRAFT depuis janvier 2026",
      body: "<p>Le front le plus jeune. Rend observable ce qui se passe entre deux tours d'agent quand le contexte passe de 200 k à 8 k tokens. Attributs : <code>operation</code> (summarize / evict / hierarchical / retrieve), <code>strategy.name</code>, <code>input_tokens</code> / <code>output_tokens</code> / <code>ratio</code>, <code>retained_segments</code>, et — pivot — <code>judge.score</code> qui rend la compaction la première opération nativement jugée.</p><p>Pas de release attendue avant mi-2027. Voir le dossier <a href=\"../compaction-agentique/\">compaction-agentique</a> pour la taxonomie côté algorithmes.</p>"
    }
  },
  "schema-02": {
    "span-start": {
      title: "1 — Span start",
      eyebrow: "Ouverture du span",
      body: "<p>Le SDK OTel auto-instrumenté ouvre le span dès l'entrée dans le wrapper d'appel LLM. Le span est nommé <code>chat &lt;model&gt;</code>, son kind est CLIENT (l'application est cliente du service LLM externe). Les attributs <code>gen_ai.system</code> (provider — openai, anthropic, azure.ai.inference, …) et <code>gen_ai.operation.name</code> (chat / text_completion / embeddings) sont obligatoires dès cette étape.</p><p>Le chrono démarre. Pour un appel non-streamé, sa fin sera triviale. Pour un appel streamé, la définition de la fin sera la première question architecturale (voir étape TTFT).</p>"
    },
    "request-emit": {
      title: "2 — Request emitted",
      eyebrow: "Attributs côté demande",
      body: "<p>Tous les attributs <code>gen_ai.request.*</code> sont posés sur le span : modèle visé, paramètres d'inférence (temperature, max_tokens, top_p, stop_sequences). Si le capture flag <code>OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT</code> est on, l'événement <code>gen_ai.user.message</code> ajoute le prompt en log corrélé — désactivé par défaut pour des raisons de coût et de confidentialité.</p><p>La requête HTTP part vers le provider. Le span attend.</p>"
    },
    "ttft": {
      title: "3 — Time-to-first-token (TTFT)",
      eyebrow: "Métrique séparée",
      body: "<p>Pour un appel streamé, le premier delta arrive. C'est le moment où l'utilisateur voit les premiers mots — la métrique perçue de réactivité. La métrique <code>gen_ai.client.time_to_first_token</code> est émise séparément.</p><p>Erreur classique observée sur les SDK 2023-2024 : marquer le span comme terminé à ce point (duration = aller-retour HTTP). Les p95 paraissaient excellents alors que l'utilisateur attendait 8 secondes pour la fin de la réponse. La convention OTel a tranché en mai 2024 : <code>duration = time-to-last-token</code>, et TTFT est une métrique distincte.</p>"
    },
    "response-end": {
      title: "4 — Response complete",
      eyebrow: "Attributs côté réponse",
      body: "<p>Le dernier token arrive. Le SDK pose les attributs <code>gen_ai.response.*</code> (id, model effectif, finish_reasons) et <code>gen_ai.usage.*</code> (input_tokens, output_tokens, total_tokens, cached_tokens si applicable).</p><p>Si capture flag on, l'événement <code>gen_ai.assistant.message</code> ajoute la completion en log corrélé. Pour un tool call, l'attribut <code>finish_reasons=[\"tool_calls\"]</code> signale qu'un span <code>gen_ai.tool.execution</code> va suivre.</p>"
    },
    "span-end": {
      title: "5 — Span end & export",
      eyebrow: "Fermeture et export",
      body: "<p>Le SDK ferme le span. <code>duration = end - start</code>, <code>status.code</code> est posé (OK, ERROR avec le code provider). Le span part dans le batch d'export OTLP vers le collector, qui le route vers le backend (Honeycomb, Datadog, New Relic, Grafana Tempo, …).</p><p>Côté backend, deux métriques sont automatiquement agrégées sans configuration applicative : <code>gen_ai.client.operation.duration</code> (histogramme) et <code>gen_ai.client.token.usage</code> (histogramme). Les dashboards GenAI génériques fonctionnent à partir de ces deux signaux.</p>"
    }
  },
  "schema-03": {
    "agent-root": {
      title: "gen_ai.agent.invocation (span racine)",
      eyebrow: "Famille agent — RC mars 2026",
      body: "<p>Le span parent qui englobe toute la boucle agent. Attributs clés : <code>agent.id</code> (UUID stable de l'instance), <code>agent.name</code> (« researcher »), <code>agent.type</code> (« tool_using »). Sa <code>duration</code> est end-to-end : du premier appel LLM au dernier token de la synthèse finale.</p><p>Sur une trace agent typique (Claude Code, Devin, Manus), ce span dure de quelques secondes à plusieurs minutes. C'est le « parent » que toute UI APM affiche en haut de la trace.</p>"
    },
    "chat-1": {
      title: "Premier appel LLM — planning",
      eyebrow: "Enfant gen_ai.client.chat",
      body: "<p>Premier span <code>gen_ai.client.chat</code> enfant. C'est le tour de planification : l'agent reçoit l'instruction utilisateur, raisonne, et demande des tool_calls.</p><p>Le <code>finish_reasons</code> sera <code>[\"tool_calls\"]</code>. Les attributs <code>usage.input_tokens</code> / <code>output_tokens</code> sont posés. Sur un agent moyen, ce premier tour consomme 30-50% des tokens totaux car l'instruction est la plus longue.</p>"
    },
    "tool-read": {
      title: "Tool execution — read_file",
      eyebrow: "Enfant gen_ai.tool.execution",
      body: "<p>Span <code>gen_ai.tool.execution</code>. Attributs : <code>tool.name=\"read_file\"</code>, <code>tool.type=\"function\"</code>, <code>tool.call_id=\"tool_12\"</code> (id donné par le LLM dans son JSON tool_call, qui sert à matcher la réponse).</p><p>Duration courte (12 ms ici) — c'est juste un read filesystem. Pour un retrieval vectoriel ou un appel API externe, la durée serait plus longue et l'arbre OTel descendrait dans des sous-spans HTTP.</p>"
    },
    "tool-search": {
      title: "Tool execution — search_docs",
      eyebrow: "Enfant gen_ai.tool.execution",
      body: "<p>Second tool span, parallèle au précédent. Le LLM a demandé read_file ET search_docs dans le même tour ; le harness les exécute en parallèle. <code>tool.type=\"retrieval\"</code> indique que c'est un retrieval (RAG), pas une simple fonction — la convention distingue function / code_interpreter / retrieval / computer_use.</p><p>85 ms ici car la recherche vectorielle a touché un index distant.</p>"
    },
    "chat-2": {
      title: "Second appel LLM — réflexion après outils",
      eyebrow: "Enfant gen_ai.client.chat",
      body: "<p>Deuxième span chat. L'agent a reçu les tool_results (read_file → contenu du fichier, search_docs → liste de chunks). Il les ingère, réfléchit, et produit la synthèse finale.</p><p>Plus de tokens (580 ms vs 320 ms du premier appel) car le contexte est plus chargé : prompt original + tool calls + tool results. Le <code>finish_reasons</code> sera <code>[\"stop\"]</code>.</p>"
    },
    "multi-agent-options": {
      title: "Option 1 — span parent unique",
      eyebrow: "Pratique par défaut",
      body: "<p>Quand l'agent A délègue à l'agent B, B devient simplement un child span de A. C'est la pratique par défaut de la plupart des SDK (LangGraph, OpenAI Agents SDK, AutoGen).</p><p>Avantage : la trace reste un arbre cohérent, lisible dans n'importe quelle UI APM. Inconvénient : si B échoue, c'est A qu'on voit en haut. La hiérarchie de spans ment sur la responsabilité.</p>"
    },
    "multi-agent-link": {
      title: "Option 2 — span link OTel",
      eyebrow: "Plus fidèle, moins lisible",
      body: "<p>L'agent B démarre un span racine indépendant. Le lien causal avec A est exprimé via un <code>link</code> (attribut natif OTel, qui existe depuis la spec initiale).</p><p>Avantage : représentation fidèle de la causalité — A et B sont co-responsables, pas hiérarchiques. Inconvénient : les UIs APM (Datadog, Grafana Tempo, Honeycomb) rendent mal les links. Les traces apparaissent fragmentées et difficiles à corréler à l'œil nu.</p>"
    },
    "multi-agent-parent": {
      title: "Option 3 — agent.parent_id",
      eyebrow: "Proposé par Microsoft, non voté",
      body: "<p>Compromis proposé par Microsoft en avril 2026. La hiérarchie de spans reste classique (B = child de A pour les UIs) mais un attribut logique <code>gen_ai.agent.parent_id</code> code la relation agent-niveau séparément.</p><p>Permettrait de filtrer dans Honeycomb « tous les spans où agent.id=B mais agent.parent_id=A » sans casser la lisibilité de l'arbre. Non encore voté — le SIG attend que les frameworks convergent.</p>"
    }
  },
  "schema-04": {
    "legacy-side": {
      title: "Pattern legacy — éval en sidecar",
      eyebrow: "Avant 2026",
      body: "<p>Les évals vivaient à part. La trace de production allait dans l'APM (Honeycomb, Datadog) ; les prompts et complétions étaient exportés en batch nuit vers un job d'éval séparé qui calculait BLEU/ROUGE/F1 ou rejouait contre des jeux de référence.</p><p>Deux conséquences : latence de corrélation de 24h (impossible de réagir en temps réel), et drill-down impossible du dashboard d'éval vers le span d'origine — quand un score baissait, retrouver les exemples concrets demandait un pipeline de jointure manuel.</p>"
    },
    "new-side": {
      title: "Pattern nouveau — éval-as-span (RC)",
      eyebrow: "Convention gen_ai.evaluation.*",
      body: "<p>Les évals deviennent des spans enfants du span jugé. Chaque critère (hallucination_check, toxicity_check, answer_relevance) est un span séparé avec ses attributs propres : name, score, threshold, passed, judge.model.</p><p>L'application décide quelles évals lancer ; le span parent les attend ou les lance en async. Trois usages débloqués : filtrage temps réel (re-routing si failed), corrélation immédiate (drill du dashboard au prompt), et audit trail régulatoire (les évals font partie du record, art. 12 AI Act).</p>"
    },
    "debate-flat": {
      title: "Débat : un attribut libre",
      eyebrow: "Position APM généralistes",
      body: "<p>Les APM généralistes (Datadog, New Relic) poussent pour un seul attribut <code>gen_ai.evaluation.metadata</code> en JSON libre. Moins de cardinalité à modéliser côté backend, plus de souplesse pour les vendeurs spécialisés qui peuvent y mettre ce qu'ils veulent.</p><p>Inconvénient : impossible de filtrer cross-vendor (« montre-moi tous les spans dont la rubrique X était évaluée »).</p>"
    },
    "debate-typed": {
      title: "Débat : familles typées",
      eyebrow: "Position vendeurs éval",
      body: "<p>Langfuse, Arize, Braintrust, Patronus poussent pour des familles typées : <code>evaluation.judge.*</code>, <code>evaluation.rubric.*</code>, <code>evaluation.dataset.*</code>. C'est ce qu'ils émettent déjà sous leur propre schéma OpenInference — le pont vers OTel serait mécanique.</p><p>Avantage : queries cross-vendor possibles, dashboards portables. Inconvénient : plus rigide, plus de cardinalité à indexer. Vote final prévu fin 2026.</p>"
    }
  },
  "schema-05": {
    "before-context": {
      title: "Avant compaction — contexte complet",
      eyebrow: "203 412 tokens",
      body: "<p>Un agent long-running (Claude Code en mode --continue, Devin sur tâche multi-heure) accumule turn après turn. Au bout de 37 tours, le contexte fait 203 412 tokens — au-delà de la fenêtre native de la plupart des modèles.</p><p>Avant le draft OTel compaction, ce moment était invisible dans les traces : le LLM-call suivant émettait un prompt « réduit » sans signaler qu'une opération de compaction avait précédé. Impossible d'auditer ce qui avait été perdu.</p>"
    },
    "after-context": {
      title: "Après compaction — contexte réduit",
      eyebrow: "8 240 tokens (ratio 0.04)",
      body: "<p>La stratégie « keep last 3 turns + summarize the rest » a réduit le contexte à 8 240 tokens : un summary segment dense + les trois derniers tours retenus intacts.</p><p>Le ratio 0.04 est typique pour Claude Code <code>/compact</code> sur un long thread. Cursor ou Mem0 visent des ratios proches (0.03 à 0.08). MemGPT/Letta avec leur paging hiérarchique peuvent descendre plus bas mais sur des sessions plus longues.</p>"
    },
    "attrs-shape": {
      title: "Forme de la réduction",
      eyebrow: "Famille draft",
      body: "<p>Première famille d'attributs du draft : ce qui décrit la forme de l'opération. <code>operation</code> énumère summarize / evict (StreamingLLM, H2O, Quest) / hierarchical (MemGPT, Letta) / retrieve (Mem0, Zep). <code>strategy.name</code> nomme l'implémentation précise.</p><p>Les compteurs <code>input_tokens</code>, <code>output_tokens</code>, <code>ratio</code> permettent les requêtes agrégées : « ratio moyen de compaction sur les agents Claude Code de la dernière semaine ».</p>"
    },
    "attrs-content": {
      title: "Contenu retenu",
      eyebrow: "Famille draft",
      body: "<p>Seconde famille : ce qui décrit ce qui a survécu. <code>retained_segments</code> (4 ici : summary + 3 derniers tours), <code>evicted_segments</code> (33 turns expulsés). L'événement <code>gen_ai.compaction.summary</code> peut transporter le résumé produit — gated par capture flag, off par défaut pour des raisons de confidentialité (le summary peut contenir des données utilisateur).</p>"
    },
    "attrs-judge": {
      title: "Fidélité jugée — pivot",
      eyebrow: "Famille draft, optionnelle",
      body: "<p>Troisième famille — la plus innovante. <code>judge.score</code> (0-1), <code>judge.model</code> (qui a jugé), <code>judge.method</code> (fact_recall, semantic_similarity, …). Calculé par un LLM-as-judge ou une métrique programmatique (recall sur un set de faits-clés extraits avant compaction).</p><p>C'est la première fois qu'une opération est nativement instrumentée avec son propre verdict — un LLM-call standard est neutre (le span ne dit pas « bonne réponse »), mais une compaction porte un score de fidélité. Le débat porte sur l'obligation : la SIG penche pour optionnel.</p>"
    }
  },
  "schema-06": {
    "anthropic-sdk": {
      title: "Anthropic SDK / Claude Agent SDK",
      eyebrow: "SDK vendeur LLM — avril 2026",
      body: "<p>Le SDK Python d'Anthropic émet <code>gen_ai.*</code> nativement depuis la version 0.45 (avril 2026). Le Claude Agent SDK ajoute la couche agent (<code>gen_ai.agent.*</code>, <code>gen_ai.tool.*</code>) avec un effort particulier sur la hiérarchie de spans pour les tool calls multi-niveaux.</p><p>Versions Java et Go suivront fin 2026. Pas d'extension OpenInference — Anthropic mise tout sur la convention OTel native.</p>"
    }
  }
}
