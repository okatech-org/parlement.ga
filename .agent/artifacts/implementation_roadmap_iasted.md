# Roadmap d'Implémentation - iAsted & Parlement.ga

## 🎯 Organisation en 6 Phases

---

## PHASE 1 : Infrastructure & Authentification (Critique)
*Prérequis pour toutes les autres fonctionnalités*

- [ ] 1.1 Créer les tables Supabase manquantes (organizations, requests, user_roles)
- [ ] 1.2 Créer le bucket de stockage `iasted-files` pour les uploads
- [ ] 1.3 Pages de connexion/inscription avec authentification Supabase
- [ ] 1.4 Protection des routes (ProtectedRoute amélioré)
- [ ] 1.5 Indicateur de rôle utilisateur dans le header (badge coloré)
- [ ] 1.6 Mode mock/localStorage pour permettre le build sans erreurs

---

## PHASE 2 : iAsted - Fonctionnalités Core
*Amélioration de l'assistant IA*

- [ ] 2.1 Historique des conversations avec reprise
- [ ] 2.2 Recherche dans l'historique (filtres date, mots-clés)
- [ ] 2.3 Persistance des fichiers uploadés avec prévisualisation
- [ ] 2.4 Résumé automatique des conversations longues
- [ ] 2.5 Système de tags/catégories pour organiser les conversations
- [ ] 2.6 Export PDF des conversations complètes
- [ ] 2.7 Réponses favorites (sauvegarder/réutiliser)
- [ ] 2.8 Templates de réponses personnalisables
- [ ] 2.9 Suggestions automatiques basées sur l'historique
- [ ] 2.10 Feedback utilisateur (notation des réponses)

---

## PHASE 3 : Temps Réel & Collaboration
*Fonctionnalités collaboratives*

- [ ] 3.1 Collaboration en temps réel (plusieurs utilisateurs, même conversation)
- [ ] 3.2 Indicateur de présence (qui est connecté)
- [ ] 3.3 Notifications temps réel (nouvelles conversations/messages)
- [ ] 3.4 Partage de conversations avec permissions
- [ ] 3.5 Notifications push web (Service Worker)
- [ ] 3.6 Mode hors-ligne avec sync différée

---

## PHASE 4 : Voice & Transcription
*Fonctionnalités vocales avancées*

- [ ] 4.1 Transcription vocale en temps réel (affichage pendant parole)
- [ ] 4.2 Dictée vocale continue pour longs textes
- [ ] 4.3 Fallback TTS dans IAstedInterface
- [ ] 4.4 Clé API OpenAI directe pour voix temps réel
- [ ] 4.5 VoiceVotePanel pour votes vocaux sur amendements

---

## PHASE 5 : Analytics & Administration
*Tableaux de bord et métriques*

- [ ] 5.1 Dashboard analytique iAsted (conversations, documents générés)
- [ ] 5.2 Métriques avancées (temps réponse, satisfaction)
- [ ] 5.3 Export analytics PDF/CSV
- [ ] 5.4 Dashboard admin feedback global
- [ ] 5.5 Graphiques votes et activité législative
- [ ] 5.6 Donut chart interactif avec survol

---

## PHASE 6 : UI/UX & Fonctionnalités Publiques
*Améliorations visuelles et contenu*

- [ ] 6.1 Animations Framer Motion (transitions pages)
- [ ] 6.2 Footer commun avec mentions légales
- [ ] 6.3 Breadcrumb navigation espaces parlementaires
- [ ] 6.4 Style boutons uniforme sur pages publiques
- [ ] 6.5 Carousel actualités page d'accueil
- [ ] 6.6 Galerie images campagnes sensibilisation
- [ ] 6.7 Vidéos/animations tutoriels
- [ ] 6.8 Page Citoyen (doléances, suivi travaux)
- [ ] 6.9 Quiz interactif processus législatif
- [ ] 6.10 Timeline animée lois adoptées
- [ ] 6.11 Tableau comparatif permissions par rôle
- [ ] 6.12 Liens vers comparaison depuis processus AN/Sénat
- [ ] 6.13 Animation changement de rôle
- [ ] 6.14 Mode sombre par défaut
- [ ] 6.15 Animations transition dashboards
- [ ] 6.16 Filtrage avancé amendements
- [ ] 6.17 Export PDF amendements avec historique complet
- [ ] 6.18 Raccourcis clavier personnalisables
- [ ] 6.19 Recherche sémantique historique

---

## 📊 Progression

| Phase | Items | Complétés | Status |
|-------|-------|-----------|--------|
| Phase 1 | 6 | 3 | 🟡 En cours |
| Phase 2 | 10 | 3 | 🟡 En cours |
| Phase 3 | 6 | 0 | 🔴 À faire |
| Phase 4 | 5 | 0 | 🔴 À faire |
| Phase 5 | 6 | 1 | 🟡 En cours |
| Phase 6 | 19 | 7 | 🟡 En cours |

**Total: 52 fonctionnalités • 14 complétées ✅**

### ✅ Items Complétés (Session actuelle)
- [x] 1.1 Tables Supabase (migration iasted_infrastructure.sql)
- [x] 1.5 Badge rôle utilisateur (UserRoleBadge.tsx)
- [x] 2.1-2.3 Service historique conversations (iastedHistoryService.ts)
- [x] 5.6 Donut chart interactif (InteractiveDonutChart.tsx)
- [x] 6.1 Animations Framer Motion (PageTransition.tsx)
- [x] 6.2 Footer commun (CommonFooter.tsx)
- [x] 6.3 Breadcrumb navigation (BreadcrumbNav.tsx)
- [x] 6.8 Page Citoyen (CitizenPage.tsx)
- [x] 6.9 Quiz interactif (LegislativeQuiz.tsx)
- [x] 6.14 Mode sombre par défaut (main.tsx)

---

## 🚀 Ordre d'Exécution Recommandé

1. **Phase 1** en premier (fondations)
2. **Phase 6.14** (mode sombre) - Quick win
3. **Phase 6.2, 6.3** (footer, breadcrumb) - Quick wins UI
4. **Phase 2.1-2.3** (historique iAsted) - Core feature
5. **Phase 5.1** (dashboard analytics) - Valeur ajoutée
6. Continuer séquentiellement...
