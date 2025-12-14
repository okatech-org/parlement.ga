export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      amendment_cosignatures: {
        Row: {
          amendment_id: string
          deputy_id: string
          id: string
          signed_at: string
        }
        Insert: {
          amendment_id: string
          deputy_id: string
          id?: string
          signed_at?: string
        }
        Update: {
          amendment_id?: string
          deputy_id?: string
          id?: string
          signed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "amendment_cosignatures_amendment_id_fkey"
            columns: ["amendment_id"]
            isOneToOne: false
            referencedRelation: "amendments"
            referencedColumns: ["id"]
          },
        ]
      }
      amendments: {
        Row: {
          amendment_type: string
          article_number: number
          author_id: string
          commission: string | null
          cosignatories: string[] | null
          created_at: string
          id: string
          justification: string
          original_text: string | null
          project_law_id: string
          proposed_text: string
          status: string
          updated_at: string
          vote_abstention: number | null
          vote_contre: number | null
          vote_pour: number | null
        }
        Insert: {
          amendment_type: string
          article_number: number
          author_id: string
          commission?: string | null
          cosignatories?: string[] | null
          created_at?: string
          id?: string
          justification: string
          original_text?: string | null
          project_law_id: string
          proposed_text: string
          status?: string
          updated_at?: string
          vote_abstention?: number | null
          vote_contre?: number | null
          vote_pour?: number | null
        }
        Update: {
          amendment_type?: string
          article_number?: number
          author_id?: string
          commission?: string | null
          cosignatories?: string[] | null
          created_at?: string
          id?: string
          justification?: string
          original_text?: string | null
          project_law_id?: string
          proposed_text?: string
          status?: string
          updated_at?: string
          vote_abstention?: number | null
          vote_contre?: number | null
          vote_pour?: number | null
        }
        Relationships: []
      }
      cmp_messages: {
        Row: {
          author_id: string | null
          author_institution: Database["public"]["Enums"]["institution_type"]
          author_name: string
          author_role: string | null
          cmp_session_id: string
          content: string
          created_at: string | null
          id: string
          message_type: string | null
          reply_to_id: string | null
        }
        Insert: {
          author_id?: string | null
          author_institution: Database["public"]["Enums"]["institution_type"]
          author_name: string
          author_role?: string | null
          cmp_session_id: string
          content: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          reply_to_id?: string | null
        }
        Update: {
          author_id?: string | null
          author_institution?: Database["public"]["Enums"]["institution_type"]
          author_name?: string
          author_role?: string | null
          cmp_session_id?: string
          content?: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          reply_to_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cmp_messages_cmp_session_id_fkey"
            columns: ["cmp_session_id"]
            isOneToOne: false
            referencedRelation: "cmp_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cmp_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "cmp_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      cmp_sessions: {
        Row: {
          agreed_text: string | null
          assembly_members: Json
          concluded_at: string | null
          conclusion_vote_abstain: number | null
          conclusion_vote_against: number | null
          conclusion_vote_for: number | null
          convened_at: string | null
          created_at: string | null
          deadline: string | null
          documents: Json | null
          failure_reason: string | null
          id: string
          legislative_text_id: string
          president_id: string | null
          president_name: string | null
          rapporteur_an_id: string | null
          rapporteur_an_name: string | null
          rapporteur_sn_id: string | null
          rapporteur_sn_name: string | null
          reference: string
          senate_members: Json
          started_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          agreed_text?: string | null
          assembly_members?: Json
          concluded_at?: string | null
          conclusion_vote_abstain?: number | null
          conclusion_vote_against?: number | null
          conclusion_vote_for?: number | null
          convened_at?: string | null
          created_at?: string | null
          deadline?: string | null
          documents?: Json | null
          failure_reason?: string | null
          id?: string
          legislative_text_id: string
          president_id?: string | null
          president_name?: string | null
          rapporteur_an_id?: string | null
          rapporteur_an_name?: string | null
          rapporteur_sn_id?: string | null
          rapporteur_sn_name?: string | null
          reference: string
          senate_members?: Json
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          agreed_text?: string | null
          assembly_members?: Json
          concluded_at?: string | null
          conclusion_vote_abstain?: number | null
          conclusion_vote_against?: number | null
          conclusion_vote_for?: number | null
          convened_at?: string | null
          created_at?: string | null
          deadline?: string | null
          documents?: Json | null
          failure_reason?: string | null
          id?: string
          legislative_text_id?: string
          president_id?: string | null
          president_name?: string | null
          rapporteur_an_id?: string | null
          rapporteur_an_name?: string | null
          rapporteur_sn_id?: string | null
          rapporteur_sn_name?: string | null
          reference?: string
          senate_members?: Json
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cmp_sessions_legislative_text_id_fkey"
            columns: ["legislative_text_id"]
            isOneToOne: false
            referencedRelation: "legislative_texts"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "conversation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_session_tags: {
        Row: {
          created_at: string
          id: string
          session_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          session_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          id?: string
          session_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_session_tags_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "conversation_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_session_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "conversation_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_sessions: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_tags: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          name: string
          size: number | null
          storage_path: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          name: string
          size?: number | null
          storage_path?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          name?: string
          size?: number | null
          storage_path?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      doleances: {
        Row: {
          categorie: string
          citoyen_id: string | null
          created_at: string
          date_creation: string
          date_resolution: string | null
          depute_id: string | null
          description: string
          id: string
          latitude: number
          longitude: number
          priorite: string
          region: string
          statut: string
          titre: string
          updated_at: string
          ville: string | null
        }
        Insert: {
          categorie: string
          citoyen_id?: string | null
          created_at?: string
          date_creation?: string
          date_resolution?: string | null
          depute_id?: string | null
          description: string
          id?: string
          latitude: number
          longitude: number
          priorite?: string
          region: string
          statut?: string
          titre: string
          updated_at?: string
          ville?: string | null
        }
        Update: {
          categorie?: string
          citoyen_id?: string | null
          created_at?: string
          date_creation?: string
          date_resolution?: string | null
          depute_id?: string | null
          description?: string
          id?: string
          latitude?: number
          longitude?: number
          priorite?: string
          region?: string
          statut?: string
          titre?: string
          updated_at?: string
          ville?: string | null
        }
        Relationships: []
      }
      favorite_responses: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          message_id: string
          session_id: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          message_id: string
          session_id?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          message_id?: string
          session_id?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorite_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "conversation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      field_visits: {
        Row: {
          commune: string | null
          created_at: string | null
          department: string | null
          documents: string[] | null
          duration_hours: number | null
          follow_up_notes: string | null
          follow_up_required: boolean | null
          id: string
          observations: string | null
          participants: string[] | null
          photos: string[] | null
          province: string
          purpose: string
          recommendations: string | null
          senator_id: string
          specific_location: string | null
          suggestions: string | null
          updated_at: string | null
          visit_date: string
        }
        Insert: {
          commune?: string | null
          created_at?: string | null
          department?: string | null
          documents?: string[] | null
          duration_hours?: number | null
          follow_up_notes?: string | null
          follow_up_required?: boolean | null
          id?: string
          observations?: string | null
          participants?: string[] | null
          photos?: string[] | null
          province: string
          purpose: string
          recommendations?: string | null
          senator_id: string
          specific_location?: string | null
          suggestions?: string | null
          updated_at?: string | null
          visit_date: string
        }
        Update: {
          commune?: string | null
          created_at?: string | null
          department?: string | null
          documents?: string[] | null
          duration_hours?: number | null
          follow_up_notes?: string | null
          follow_up_required?: boolean | null
          id?: string
          observations?: string | null
          participants?: string[] | null
          photos?: string[] | null
          province?: string
          purpose?: string
          recommendations?: string | null
          senator_id?: string
          specific_location?: string | null
          suggestions?: string | null
          updated_at?: string | null
          visit_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "field_visits_senator_id_fkey"
            columns: ["senator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gabon_provinces: {
        Row: {
          capital: string | null
          code: string
          id: number
          name: string
          population: number | null
          surface_area: number | null
        }
        Insert: {
          capital?: string | null
          code: string
          id?: number
          name: string
          population?: number | null
          surface_area?: number | null
        }
        Update: {
          capital?: string | null
          code?: string
          id?: number
          name?: string
          population?: number | null
          surface_area?: number | null
        }
        Relationships: []
      }
      legislative_shuttle_history: {
        Row: {
          from_location: Database["public"]["Enums"]["legislative_location"]
          id: string
          legislative_text_id: string
          text_version_after: number | null
          text_version_before: number | null
          to_location: Database["public"]["Enums"]["legislative_location"]
          transmission_note: string | null
          transmitted_at: string | null
          transmitted_by: string | null
          transmitted_by_name: string | null
        }
        Insert: {
          from_location: Database["public"]["Enums"]["legislative_location"]
          id?: string
          legislative_text_id: string
          text_version_after?: number | null
          text_version_before?: number | null
          to_location: Database["public"]["Enums"]["legislative_location"]
          transmission_note?: string | null
          transmitted_at?: string | null
          transmitted_by?: string | null
          transmitted_by_name?: string | null
        }
        Update: {
          from_location?: Database["public"]["Enums"]["legislative_location"]
          id?: string
          legislative_text_id?: string
          text_version_after?: number | null
          text_version_before?: number | null
          to_location?: Database["public"]["Enums"]["legislative_location"]
          transmission_note?: string | null
          transmitted_at?: string | null
          transmitted_by?: string | null
          transmitted_by_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "legislative_shuttle_history_legislative_text_id_fkey"
            columns: ["legislative_text_id"]
            isOneToOne: false
            referencedRelation: "legislative_texts"
            referencedColumns: ["id"]
          },
        ]
      }
      legislative_texts: {
        Row: {
          adopted_at: string | null
          author_id: string | null
          author_name: string | null
          co_authors: Json | null
          comment_count: number | null
          commission_id: string | null
          commission_name: string | null
          content: string | null
          created_at: string | null
          current_location: Database["public"]["Enums"]["legislative_location"]
          deposited_at: string | null
          expose_motifs: string | null
          id: string
          journal_officiel_date: string | null
          journal_officiel_ref: string | null
          keywords: string[] | null
          origin_institution: Database["public"]["Enums"]["institution_type"]
          parent_version_id: string | null
          priority_level: number | null
          promulgated_at: string | null
          rapporteur_id: string | null
          rapporteur_name: string | null
          reading_number: number | null
          reference: string
          short_title: string | null
          shuttle_count: number | null
          summary: string | null
          tags: string[] | null
          text_type: Database["public"]["Enums"]["text_type"]
          title: string
          transmitted_at: string | null
          updated_at: string | null
          urgency: boolean | null
          version: number | null
          view_count: number | null
        }
        Insert: {
          adopted_at?: string | null
          author_id?: string | null
          author_name?: string | null
          co_authors?: Json | null
          comment_count?: number | null
          commission_id?: string | null
          commission_name?: string | null
          content?: string | null
          created_at?: string | null
          current_location?: Database["public"]["Enums"]["legislative_location"]
          deposited_at?: string | null
          expose_motifs?: string | null
          id?: string
          journal_officiel_date?: string | null
          journal_officiel_ref?: string | null
          keywords?: string[] | null
          origin_institution?: Database["public"]["Enums"]["institution_type"]
          parent_version_id?: string | null
          priority_level?: number | null
          promulgated_at?: string | null
          rapporteur_id?: string | null
          rapporteur_name?: string | null
          reading_number?: number | null
          reference: string
          short_title?: string | null
          shuttle_count?: number | null
          summary?: string | null
          tags?: string[] | null
          text_type?: Database["public"]["Enums"]["text_type"]
          title: string
          transmitted_at?: string | null
          updated_at?: string | null
          urgency?: boolean | null
          version?: number | null
          view_count?: number | null
        }
        Update: {
          adopted_at?: string | null
          author_id?: string | null
          author_name?: string | null
          co_authors?: Json | null
          comment_count?: number | null
          commission_id?: string | null
          commission_name?: string | null
          content?: string | null
          created_at?: string | null
          current_location?: Database["public"]["Enums"]["legislative_location"]
          deposited_at?: string | null
          expose_motifs?: string | null
          id?: string
          journal_officiel_date?: string | null
          journal_officiel_ref?: string | null
          keywords?: string[] | null
          origin_institution?: Database["public"]["Enums"]["institution_type"]
          parent_version_id?: string | null
          priority_level?: number | null
          promulgated_at?: string | null
          rapporteur_id?: string | null
          rapporteur_name?: string | null
          reading_number?: number | null
          reference?: string
          short_title?: string | null
          shuttle_count?: number | null
          summary?: string | null
          tags?: string[] | null
          text_type?: Database["public"]["Enums"]["text_type"]
          title?: string
          transmitted_at?: string | null
          updated_at?: string | null
          urgency?: boolean | null
          version?: number | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "legislative_texts_parent_version_id_fkey"
            columns: ["parent_version_id"]
            isOneToOne: false
            referencedRelation: "legislative_texts"
            referencedColumns: ["id"]
          },
        ]
      }
      local_grievances: {
        Row: {
          addressed_at: string | null
          assigned_senator_id: string | null
          attachments: string[] | null
          category: string | null
          commune: string | null
          created_at: string | null
          department: string | null
          description: string
          id: string
          priority: number | null
          province: string
          response: string | null
          source_contact: string | null
          source_name: string | null
          source_type: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          addressed_at?: string | null
          assigned_senator_id?: string | null
          attachments?: string[] | null
          category?: string | null
          commune?: string | null
          created_at?: string | null
          department?: string | null
          description: string
          id?: string
          priority?: number | null
          province: string
          response?: string | null
          source_contact?: string | null
          source_name?: string | null
          source_type: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          addressed_at?: string | null
          assigned_senator_id?: string | null
          attachments?: string[] | null
          category?: string | null
          commune?: string | null
          created_at?: string | null
          department?: string | null
          description?: string
          id?: string
          priority?: number | null
          province?: string
          response?: string | null
          source_contact?: string | null
          source_name?: string | null
          source_type?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "local_grievances_assigned_senator_id_fkey"
            columns: ["assigned_senator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      login_attempts: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_address: string | null
          success: boolean
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
        }
        Relationships: []
      }
      message_feedback: {
        Row: {
          comment: string | null
          created_at: string
          feedback_type: string | null
          id: string
          message_id: string
          rating: number
          session_id: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          feedback_type?: string | null
          id?: string
          message_id: string
          rating: number
          session_id?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          feedback_type?: string | null
          id?: string
          message_id?: string
          rating?: number
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "conversation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          type: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          type?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          type?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      parliamentarians: {
        Row: {
          amendments_authored: number | null
          attendance_rate: number | null
          biography: string | null
          birth_date: string | null
          birth_place: string | null
          career: Json | null
          circonscription: string | null
          commissions: Json | null
          created_at: string | null
          department: string | null
          education: Json | null
          email_pro: string | null
          first_name: string
          groupe_parlementaire: string | null
          id: string
          institution: Database["public"]["Enums"]["institution_type"]
          is_active: boolean | null
          last_name: string
          mandate_end: string | null
          mandate_start: string | null
          office_location: string | null
          parti_politique: string | null
          phone_pro: string | null
          photo_url: string | null
          province: string | null
          questions_asked: number | null
          role: Database["public"]["Enums"]["parliamentary_role"]
          texts_authored: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          amendments_authored?: number | null
          attendance_rate?: number | null
          biography?: string | null
          birth_date?: string | null
          birth_place?: string | null
          career?: Json | null
          circonscription?: string | null
          commissions?: Json | null
          created_at?: string | null
          department?: string | null
          education?: Json | null
          email_pro?: string | null
          first_name: string
          groupe_parlementaire?: string | null
          id: string
          institution: Database["public"]["Enums"]["institution_type"]
          is_active?: boolean | null
          last_name: string
          mandate_end?: string | null
          mandate_start?: string | null
          office_location?: string | null
          parti_politique?: string | null
          phone_pro?: string | null
          photo_url?: string | null
          province?: string | null
          questions_asked?: number | null
          role: Database["public"]["Enums"]["parliamentary_role"]
          texts_authored?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          amendments_authored?: number | null
          attendance_rate?: number | null
          biography?: string | null
          birth_date?: string | null
          birth_place?: string | null
          career?: Json | null
          circonscription?: string | null
          commissions?: Json | null
          created_at?: string | null
          department?: string | null
          education?: Json | null
          email_pro?: string | null
          first_name?: string
          groupe_parlementaire?: string | null
          id?: string
          institution?: Database["public"]["Enums"]["institution_type"]
          is_active?: boolean | null
          last_name?: string
          mandate_end?: string | null
          mandate_start?: string | null
          office_location?: string | null
          parti_politique?: string | null
          phone_pro?: string | null
          photo_url?: string | null
          province?: string | null
          questions_asked?: number | null
          role?: Database["public"]["Enums"]["parliamentary_role"]
          texts_authored?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      parliamentary_sessions: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          agenda: Json | null
          attendees: Json | null
          created_at: string | null
          description: string | null
          documents: Json | null
          id: string
          institution: Database["public"]["Enums"]["institution_type"]
          is_joint_session: boolean | null
          live_stream_url: string | null
          location: string | null
          president_id: string | null
          president_name: string | null
          recording_url: string | null
          scheduled_end: string | null
          scheduled_start: string
          session_type: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          agenda?: Json | null
          attendees?: Json | null
          created_at?: string | null
          description?: string | null
          documents?: Json | null
          id?: string
          institution: Database["public"]["Enums"]["institution_type"]
          is_joint_session?: boolean | null
          live_stream_url?: string | null
          location?: string | null
          president_id?: string | null
          president_name?: string | null
          recording_url?: string | null
          scheduled_end?: string | null
          scheduled_start: string
          session_type: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          agenda?: Json | null
          attendees?: Json | null
          created_at?: string | null
          description?: string | null
          documents?: Json | null
          id?: string
          institution?: Database["public"]["Enums"]["institution_type"]
          is_joint_session?: boolean | null
          live_stream_url?: string | null
          location?: string | null
          president_id?: string | null
          president_name?: string | null
          recording_url?: string | null
          scheduled_end?: string | null
          scheduled_start?: string
          session_type?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      parliamentary_votes: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          individual_votes: Json | null
          institution: Database["public"]["Enums"]["institution_type"]
          legislative_text_id: string | null
          quorum_reached: boolean | null
          quorum_required: number | null
          result: string | null
          session_id: string | null
          title: string
          vote_type: string
          votes_absent: number | null
          votes_abstain: number | null
          votes_against: number | null
          votes_for: number | null
          voting_ended_at: string | null
          voting_started_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          individual_votes?: Json | null
          institution: Database["public"]["Enums"]["institution_type"]
          legislative_text_id?: string | null
          quorum_reached?: boolean | null
          quorum_required?: number | null
          result?: string | null
          session_id?: string | null
          title: string
          vote_type: string
          votes_absent?: number | null
          votes_abstain?: number | null
          votes_against?: number | null
          votes_for?: number | null
          voting_ended_at?: string | null
          voting_started_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          individual_votes?: Json | null
          institution?: Database["public"]["Enums"]["institution_type"]
          legislative_text_id?: string | null
          quorum_reached?: boolean | null
          quorum_required?: number | null
          result?: string | null
          session_id?: string | null
          title?: string
          vote_type?: string
          votes_absent?: number | null
          votes_abstain?: number | null
          votes_against?: number | null
          votes_for?: number | null
          voting_ended_at?: string | null
          voting_started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parliamentary_votes_legislative_text_id_fkey"
            columns: ["legislative_text_id"]
            isOneToOne: false
            referencedRelation: "legislative_texts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parliamentary_votes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "parliamentary_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      permanent_commissions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          institution: Database["public"]["Enums"]["institution_type"]
          members: Json | null
          name: string
          president_id: string | null
          president_name: string | null
          secretary_id: string | null
          secretary_name: string | null
          short_name: string | null
          updated_at: string | null
          vice_president_id: string | null
          vice_president_name: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          institution: Database["public"]["Enums"]["institution_type"]
          members?: Json | null
          name: string
          president_id?: string | null
          president_name?: string | null
          secretary_id?: string | null
          secretary_name?: string | null
          short_name?: string | null
          updated_at?: string | null
          vice_president_id?: string | null
          vice_president_name?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          institution?: Database["public"]["Enums"]["institution_type"]
          members?: Json | null
          name?: string
          president_id?: string | null
          president_name?: string | null
          secretary_id?: string | null
          secretary_name?: string | null
          short_name?: string | null
          updated_at?: string | null
          vice_president_id?: string | null
          vice_president_name?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      requests: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          priority: string
          status: string
          subject: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          priority?: string
          status?: string
          subject: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          priority?: string
          status?: string
          subject?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      senate_text_queue: {
        Row: {
          assigned_commission_id: string | null
          commission_opinion: string | null
          commission_vote_result: string | null
          created_at: string | null
          id: string
          is_collectivity_related: boolean | null
          legislative_text_id: string
          rapporteur_id: string | null
          received_at: string | null
          review_deadline: string | null
          senate_status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_commission_id?: string | null
          commission_opinion?: string | null
          commission_vote_result?: string | null
          created_at?: string | null
          id?: string
          is_collectivity_related?: boolean | null
          legislative_text_id: string
          rapporteur_id?: string | null
          received_at?: string | null
          review_deadline?: string | null
          senate_status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_commission_id?: string | null
          commission_opinion?: string | null
          commission_vote_result?: string | null
          created_at?: string | null
          id?: string
          is_collectivity_related?: boolean | null
          legislative_text_id?: string
          rapporteur_id?: string | null
          received_at?: string | null
          review_deadline?: string | null
          senate_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "senate_text_queue_assigned_commission_id_fkey"
            columns: ["assigned_commission_id"]
            isOneToOne: false
            referencedRelation: "permanent_commissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "senate_text_queue_legislative_text_id_fkey"
            columns: ["legislative_text_id"]
            isOneToOne: false
            referencedRelation: "legislative_texts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "senate_text_queue_rapporteur_id_fkey"
            columns: ["rapporteur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      senator_profiles: {
        Row: {
          amendments_proposed: number | null
          canton: string | null
          commune: string | null
          created_at: string | null
          department: string | null
          electoral_college: string[] | null
          field_visits: number | null
          id: string
          laws_examined: number | null
          local_office_address: string | null
          local_phone: string | null
          mandate_end: string | null
          mandate_start: string | null
          political_group: string | null
          profile_id: string
          province: string
          updated_at: string | null
        }
        Insert: {
          amendments_proposed?: number | null
          canton?: string | null
          commune?: string | null
          created_at?: string | null
          department?: string | null
          electoral_college?: string[] | null
          field_visits?: number | null
          id?: string
          laws_examined?: number | null
          local_office_address?: string | null
          local_phone?: string | null
          mandate_end?: string | null
          mandate_start?: string | null
          political_group?: string | null
          profile_id: string
          province: string
          updated_at?: string | null
        }
        Update: {
          amendments_proposed?: number | null
          canton?: string | null
          commune?: string | null
          created_at?: string | null
          department?: string | null
          electoral_college?: string[] | null
          field_visits?: number | null
          id?: string
          laws_examined?: number | null
          local_office_address?: string | null
          local_phone?: string | null
          mandate_end?: string | null
          mandate_start?: string | null
          political_group?: string | null
          profile_id?: string
          province?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "senator_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      conclude_cmp: {
        Args: {
          p_agreed_text?: string
          p_cmp_id: string
          p_failure_reason?: string
          p_result: string
          p_votes?: Json
        }
        Returns: Json
      }
      convene_cmp: {
        Args: {
          p_assembly_members: Json
          p_deadline?: string
          p_senate_members: Json
          p_text_id: string
        }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      senate_receive_text: { Args: { p_text_id: string }; Returns: string }
      transmit_legislative_text: {
        Args: { p_note?: string; p_text_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "user"
        | "deputy"
        | "president"
        | "questeur"
        | "secretary"
        | "vp"
        | "substitute"
        | "citizen"
        | "senator"
      institution_type: "ASSEMBLY" | "SENATE" | "PARLIAMENT" | "JOINT"
      legislative_location:
        | "AN_DEPOT"
        | "AN_BUREAU"
        | "AN_COMMISSION"
        | "AN_PLENIERE"
        | "AN_VOTE"
        | "AN_ADOPTED"
        | "AN_REJECTED"
        | "SN_DEPOT"
        | "SN_BUREAU"
        | "SN_COMMISSION"
        | "SN_PLENIERE"
        | "SN_VOTE"
        | "SN_ADOPTED"
        | "SN_REJECTED"
        | "NAVETTE_AN_TO_SN"
        | "NAVETTE_SN_TO_AN"
        | "CMP_CONVENED"
        | "CMP_IN_PROGRESS"
        | "CMP_AGREEMENT"
        | "CMP_FAILURE"
        | "FINAL_AN"
        | "FINAL_SN"
        | "ADOPTED"
        | "PROMULGATED"
        | "ARCHIVED"
      parliamentary_role:
        | "AN_DEPUTE"
        | "AN_DEPUTE_SUPPLEANT"
        | "AN_PRESIDENT"
        | "AN_VICE_PRESIDENT"
        | "AN_QUESTEUR"
        | "AN_SECRETAIRE"
        | "AN_PRESIDENT_COMMISSION"
        | "SN_SENATEUR"
        | "SN_SENATEUR_SUPPLEANT"
        | "SN_PRESIDENT"
        | "SN_VICE_PRESIDENT"
        | "SN_QUESTEUR"
        | "SN_SECRETAIRE"
        | "SN_PRESIDENT_COMMISSION"
        | "PG_PRESIDENT"
        | "PG_SECRETAIRE_GENERAL"
        | "ADMIN_AN"
        | "ADMIN_SN"
        | "ADMIN_PG"
        | "SUPER_ADMIN"
        | "CITIZEN"
      text_type:
        | "PROJET_LOI"
        | "PROPOSITION_LOI"
        | "PROJET_LOI_FINANCES"
        | "PROJET_LOI_CONST"
        | "RESOLUTION"
        | "MOTION"
        | "QUESTION_ORALE"
        | "QUESTION_ECRITE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "moderator",
        "user",
        "deputy",
        "president",
        "questeur",
        "secretary",
        "vp",
        "substitute",
        "citizen",
        "senator",
      ],
      institution_type: ["ASSEMBLY", "SENATE", "PARLIAMENT", "JOINT"],
      legislative_location: [
        "AN_DEPOT",
        "AN_BUREAU",
        "AN_COMMISSION",
        "AN_PLENIERE",
        "AN_VOTE",
        "AN_ADOPTED",
        "AN_REJECTED",
        "SN_DEPOT",
        "SN_BUREAU",
        "SN_COMMISSION",
        "SN_PLENIERE",
        "SN_VOTE",
        "SN_ADOPTED",
        "SN_REJECTED",
        "NAVETTE_AN_TO_SN",
        "NAVETTE_SN_TO_AN",
        "CMP_CONVENED",
        "CMP_IN_PROGRESS",
        "CMP_AGREEMENT",
        "CMP_FAILURE",
        "FINAL_AN",
        "FINAL_SN",
        "ADOPTED",
        "PROMULGATED",
        "ARCHIVED",
      ],
      parliamentary_role: [
        "AN_DEPUTE",
        "AN_DEPUTE_SUPPLEANT",
        "AN_PRESIDENT",
        "AN_VICE_PRESIDENT",
        "AN_QUESTEUR",
        "AN_SECRETAIRE",
        "AN_PRESIDENT_COMMISSION",
        "SN_SENATEUR",
        "SN_SENATEUR_SUPPLEANT",
        "SN_PRESIDENT",
        "SN_VICE_PRESIDENT",
        "SN_QUESTEUR",
        "SN_SECRETAIRE",
        "SN_PRESIDENT_COMMISSION",
        "PG_PRESIDENT",
        "PG_SECRETAIRE_GENERAL",
        "ADMIN_AN",
        "ADMIN_SN",
        "ADMIN_PG",
        "SUPER_ADMIN",
        "CITIZEN",
      ],
      text_type: [
        "PROJET_LOI",
        "PROPOSITION_LOI",
        "PROJET_LOI_FINANCES",
        "PROJET_LOI_CONST",
        "RESOLUTION",
        "MOTION",
        "QUESTION_ORALE",
        "QUESTION_ECRITE",
      ],
    },
  },
} as const
