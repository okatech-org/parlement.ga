# 📋 PROMPT LOVABLE - Architecture Bicamérale Parlement.ga

Ce document contient les instructions complètes pour configurer la base de données Supabase et les Edge Functions pour le système parlementaire bicaméral gabonais.

---

## 🚀 ÉTAPE 1 : Exécuter le Script SQL

Copiez et exécutez le contenu du fichier `prompt-bicameral-architecture.sql` dans votre éditeur SQL Supabase (Dashboard > SQL Editor > New Query).

Ce script crée :
- ✅ Types ENUM pour les institutions, localisations et rôles
- ✅ Tables principales (legislative_texts, cmp_sessions, parliamentarians, etc.)
- ✅ Politiques RLS pour l'isolation par institution
- ✅ Fonctions pour la navette parlementaire et les CMP
- ✅ Triggers pour la mise à jour automatique des timestamps
- ✅ Données initiales (commissions permanentes)

---

## 🔧 ÉTAPE 2 : Créer les Edge Functions

### 2.1 Edge Function: legislative-shuttle

**Chemin**: `supabase/functions/legislative-shuttle/index.ts`

**Description**: Gère la transmission des textes législatifs entre les deux chambres.

**Endpoints**:
- `POST ?action=transmit` - Transmettre un texte à l'autre chambre
- `GET ?action=history&textId=xxx` - Historique des transmissions
- `GET ?action=stats` - Statistiques de la navette

### 2.2 Edge Function: cmp-management

**Chemin**: `supabase/functions/cmp-management/index.ts`

**Description**: Gère les Commissions Mixtes Paritaires.

**Endpoints**:
- `POST ?action=convene` - Convoquer une CMP (7+7 membres)
- `POST ?action=conclude` - Conclure une CMP (accord/échec)
- `POST ?action=message` - Envoyer un message de négociation
- `GET ?action=list` - Lister les CMP
- `GET ?action=messages&cmpId=xxx` - Messages d'une CMP

### 2.3 Edge Function: parliamentary-stats

**Chemin**: `supabase/functions/parliamentary-stats/index.ts`

**Description**: Fournit les statistiques parlementaires.

**Endpoints**:
- `GET ?institution=ASSEMBLY|SENATE&period=year|month|week` - Stats par institution et période

---

## 📦 ÉTAPE 3 : Déployer les Edge Functions

Exécutez ces commandes dans votre terminal :

```bash
# Déployer toutes les fonctions
supabase functions deploy legislative-shuttle
supabase functions deploy cmp-management
supabase functions deploy parliamentary-stats
```

---

## 🔐 ÉTAPE 4 : Configurer les Secrets (si nécessaire)

```bash
# Si vous avez besoin de clés API externes
supabase secrets set OPENAI_API_KEY=your_key_here
```

---

## 📊 STRUCTURE DES TABLES

### legislative_texts (Textes législatifs)
| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| reference | VARCHAR(50) | Ex: PL-2024-001 |
| title | TEXT | Titre complet |
| text_type | ENUM | PROJET_LOI, PROPOSITION_LOI, etc. |
| origin_institution | ENUM | ASSEMBLY ou SENATE |
| current_location | ENUM | Position dans la navette (25+ états) |
| reading_number | INTEGER | Numéro de lecture |
| shuttle_count | INTEGER | Nombre de navettes effectuées |

### cmp_sessions (Commissions Mixtes Paritaires)
| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| reference | VARCHAR(50) | Ex: CMP-2024-003 |
| legislative_text_id | UUID | Texte concerné |
| assembly_members | JSONB | 7 députés (id, name, role) |
| senate_members | JSONB | 7 sénateurs (id, name, role) |
| status | VARCHAR | PENDING, IN_PROGRESS, AGREEMENT, FAILURE |
| agreed_text | TEXT | Texte de compromis si accord |

### parliamentarians (Parlementaires)
| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Référence auth.users |
| first_name, last_name | VARCHAR | Identité |
| institution | ENUM | ASSEMBLY ou SENATE |
| role | ENUM | AN_DEPUTE, SN_SENATEUR, etc. |
| circonscription | VARCHAR | Circonscription électorale |
| groupe_parlementaire | VARCHAR | Groupe politique |

---

## 🎯 FONCTIONS SQL IMPORTANTES

### transmit_legislative_text(p_text_id, p_note)
Transmet un texte adopté à l'autre chambre. Réservé aux Présidents.

```sql
SELECT transmit_legislative_text(
  'uuid-du-texte', 
  'Note de transmission optionnelle'
);
```

### convene_cmp(p_text_id, p_assembly_members, p_senate_members, p_deadline)
Convoque une CMP avec 7 membres de chaque chambre.

```sql
SELECT convene_cmp(
  'uuid-du-texte',
  '[{"id":"...", "name":"Jean Dupont", "role":"Rapporteur"}]'::jsonb,
  '[{"id":"...", "name":"Marie Martin", "role":"Membre"}]'::jsonb,
  '2024-12-31 23:59:59'
);
```

### get_parliamentary_stats(p_institution)
Retourne les statistiques globales ou par institution.

```sql
SELECT get_parliamentary_stats('ASSEMBLY');
```

---

## ✅ VÉRIFICATION

Après l'exécution, vérifiez que :

1. Les tables existent : `SELECT * FROM legislative_texts LIMIT 1;`
2. Les types ENUM sont créés : `SELECT enum_range(NULL::institution_type);`
3. Les fonctions sont disponibles : `SELECT transmit_legislative_text('00000000-0000-0000-0000-000000000000', 'test');`
4. Les commissions sont créées : `SELECT * FROM permanent_commissions;`

---

## 🔄 Realtime (Optionnel)

Pour activer les mises à jour en temps réel sur les messages CMP :

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE cmp_messages;
```

---

## 📞 Support

En cas de problème, vérifiez :
1. Que vous avez les droits d'administration sur Supabase
2. Que les tables `profiles` et `auth.users` existent
3. Que les politiques RLS ne bloquent pas vos requêtes (désactivez temporairement pour debug)
