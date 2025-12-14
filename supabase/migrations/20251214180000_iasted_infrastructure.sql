-- Migration: Infrastructure iAsted & Authentification
-- Description: Tables pour organizations, requests, user_roles, et bucket storage

-- ============================================================================
-- 1. TABLE DES ORGANISATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    logo_url TEXT,
    
    -- Settings
    settings JSONB DEFAULT '{}',
    
    -- Subscription / Plan
    plan VARCHAR(50) DEFAULT 'free',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);

-- ============================================================================
-- 2. TABLE DES RÔLES UTILISATEUR (étend profiles)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    
    -- Rôle applicatif
    role VARCHAR(100) NOT NULL DEFAULT 'user',
    
    -- Permissions spécifiques
    permissions JSONB DEFAULT '[]',
    
    -- Actif
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    
    UNIQUE(user_id, organization_id, role)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_org ON user_roles(organization_id);

-- ============================================================================
-- 3. TABLE DES REQUÊTES (Generic requests system)
-- ============================================================================

CREATE TABLE IF NOT EXISTS requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Type de requête
    request_type VARCHAR(100) NOT NULL, -- 'access_request', 'support', 'feedback', etc.
    
    -- Émetteur
    requester_id UUID REFERENCES profiles(id),
    requester_email TEXT,
    
    -- Destinataire
    target_id UUID, -- ID de la ressource ciblée (optionnel)
    target_type VARCHAR(100), -- 'organization', 'document', 'conversation', etc.
    
    -- Contenu
    title TEXT,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'completed'
    
    -- Traitement
    processed_by UUID REFERENCES profiles(id),
    processed_at TIMESTAMPTZ,
    response TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_requests_type ON requests(request_type);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON requests(requester_id);

-- ============================================================================
-- 4. TABLE DES CONVERSATIONS iAsted
-- ============================================================================

CREATE TABLE IF NOT EXISTS iasted_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Identification
    title TEXT,
    
    -- Métadonnées
    tags TEXT[] DEFAULT '{}',
    category VARCHAR(100),
    is_favorite BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    
    -- Résumé automatique
    summary TEXT,
    key_points JSONB, -- Points clés extraits
    
    -- Statistiques
    message_count INTEGER DEFAULT 0,
    last_message_at TIMESTAMPTZ,
    
    -- Partage
    is_shared BOOLEAN DEFAULT FALSE,
    shared_with UUID[], -- Liste des user_ids
    share_permissions VARCHAR(50) DEFAULT 'read', -- 'read', 'write', 'admin'
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_iasted_conversations_user ON iasted_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_iasted_conversations_tags ON iasted_conversations USING GIN(tags);

-- ============================================================================
-- 5. TABLE DES MESSAGES iAsted
-- ============================================================================

CREATE TABLE IF NOT EXISTS iasted_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES iasted_conversations(id) ON DELETE CASCADE,
    
    -- Émetteur
    role VARCHAR(20) NOT NULL, -- 'user', 'assistant', 'system'
    
    -- Contenu
    content TEXT NOT NULL,
    content_type VARCHAR(50) DEFAULT 'text', -- 'text', 'audio', 'file'
    
    -- Fichiers attachés
    attachments JSONB DEFAULT '[]', -- [{url, name, type, size}]
    
    -- Feedback utilisateur
    rating INTEGER, -- 1-5 stars
    feedback TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_iasted_messages_conversation ON iasted_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_iasted_messages_created ON iasted_messages(created_at);

-- ============================================================================
-- 6. TABLE DES TEMPLATES DE RÉPONSES
-- ============================================================================

CREATE TABLE IF NOT EXISTS iasted_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Template
    name TEXT NOT NULL,
    description TEXT,
    prompt_template TEXT NOT NULL,
    category VARCHAR(100),
    
    -- Usage
    use_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. TABLE DES ANALYTICS iAsted
-- ============================================================================

CREATE TABLE IF NOT EXISTS iasted_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Date (pour agrégation)
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Métriques
    conversations_count INTEGER DEFAULT 0,
    messages_sent INTEGER DEFAULT 0,
    messages_received INTEGER DEFAULT 0,
    documents_generated INTEGER DEFAULT 0,
    voice_minutes DECIMAL(10,2) DEFAULT 0,
    
    -- Temps de réponse moyen (ms)
    avg_response_time INTEGER,
    
    -- Satisfaction
    avg_rating DECIMAL(3,2),
    feedback_count INTEGER DEFAULT 0,
    
    UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_iasted_analytics_user_date ON iasted_analytics(user_id, date);

-- ============================================================================
-- 8. TABLE DES NOTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Type
    type VARCHAR(100) NOT NULL, -- 'message', 'mention', 'share', 'system'
    
    -- Contenu
    title TEXT NOT NULL,
    body TEXT,
    icon VARCHAR(100),
    action_url TEXT,
    
    -- Référence
    reference_type VARCHAR(100),
    reference_id UUID,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    
    -- Push
    is_pushed BOOLEAN DEFAULT FALSE,
    pushed_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id) WHERE is_read = FALSE;

-- ============================================================================
-- 9. TABLE DE PRÉSENCE EN TEMPS RÉEL
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_presence (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'offline', -- 'online', 'away', 'busy', 'offline'
    
    -- Dernière activité
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    
    -- Contexte
    current_page TEXT,
    current_conversation_id UUID
);

-- ============================================================================
-- 10. RLS POLICIES
-- ============================================================================

-- Organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view organizations" ON organizations
    FOR SELECT USING (TRUE);

-- User Roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their roles" ON user_roles
    FOR SELECT USING (user_id = auth.uid());

-- Requests
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their requests" ON requests
    FOR SELECT USING (requester_id = auth.uid());

CREATE POLICY "Users can create requests" ON requests
    FOR INSERT WITH CHECK (requester_id = auth.uid());

-- iAsted Conversations
ALTER TABLE iasted_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their conversations" ON iasted_conversations
    FOR ALL USING (
        user_id = auth.uid() 
        OR auth.uid() = ANY(shared_with)
    );

-- iAsted Messages
ALTER TABLE iasted_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access messages of their conversations" ON iasted_messages
    FOR ALL USING (
        conversation_id IN (
            SELECT id FROM iasted_conversations 
            WHERE user_id = auth.uid() OR auth.uid() = ANY(shared_with)
        )
    );

-- Templates
ALTER TABLE iasted_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their templates" ON iasted_templates
    FOR ALL USING (user_id = auth.uid() OR user_id IS NULL);

-- Analytics
ALTER TABLE iasted_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their analytics" ON iasted_analytics
    FOR SELECT USING (user_id = auth.uid());

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their notifications" ON notifications
    FOR ALL USING (user_id = auth.uid());

-- Presence
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view presence" ON user_presence
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can update their presence" ON user_presence
    FOR ALL USING (user_id = auth.uid());

-- ============================================================================
-- 11. TRIGGERS
-- ============================================================================

DROP TRIGGER IF EXISTS organizations_updated_at ON organizations;
CREATE TRIGGER organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS requests_updated_at ON requests;
CREATE TRIGGER requests_updated_at
    BEFORE UPDATE ON requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS iasted_conversations_updated_at ON iasted_conversations;
CREATE TRIGGER iasted_conversations_updated_at
    BEFORE UPDATE ON iasted_conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 12. FONCTION: Mettre à jour les stats de conversation
-- ============================================================================

CREATE OR REPLACE FUNCTION update_conversation_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE iasted_conversations
    SET 
        message_count = (SELECT COUNT(*) FROM iasted_messages WHERE conversation_id = NEW.conversation_id),
        last_message_at = NEW.created_at,
        updated_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS iasted_messages_stats ON iasted_messages;
CREATE TRIGGER iasted_messages_stats
    AFTER INSERT ON iasted_messages
    FOR EACH ROW EXECUTE FUNCTION update_conversation_stats();

-- ============================================================================
-- 13. BUCKET STORAGE (à créer via Supabase Dashboard ou API)
-- Note: Les buckets sont créés via l'API Storage, pas SQL
-- ============================================================================

-- Créer le bucket via:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('iasted-files', 'iasted-files', false);

-- Policy pour le bucket (à ajouter dans Supabase Dashboard):
-- Authenticated users can upload files
-- Users can only access their own files

-- ============================================================================
-- 14. COMMENTAIRES
-- ============================================================================

COMMENT ON TABLE organizations IS 'Organisations/entreprises utilisant la plateforme';
COMMENT ON TABLE user_roles IS 'Rôles attribués aux utilisateurs par organisation';
COMMENT ON TABLE requests IS 'Système de requêtes génériques (accès, support, feedback)';
COMMENT ON TABLE iasted_conversations IS 'Conversations avec l''assistant iAsted';
COMMENT ON TABLE iasted_messages IS 'Messages individuels dans une conversation iAsted';
COMMENT ON TABLE iasted_templates IS 'Templates de prompts réutilisables';
COMMENT ON TABLE iasted_analytics IS 'Métriques d''utilisation agrégées par jour';
COMMENT ON TABLE notifications IS 'Notifications utilisateur (push et in-app)';
COMMENT ON TABLE user_presence IS 'Indicateur de présence en temps réel';
