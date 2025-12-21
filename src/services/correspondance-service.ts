/**
 * Service Correspondance
 * 
 * Gère les envois de correspondance externe par email.
 * Pour l'instant, simule l'envoi - à intégrer avec un service email réel.
 */

import { supabase } from '@/integrations/supabase/client';

export interface SendCorrespondanceParams {
    recipientEmail: string;
    recipientName?: string;
    recipientOrg?: string;
    subject: string;
    body: string;
    isUrgent?: boolean;
    attachments?: { name: string; url: string }[];
}

export interface CorrespondanceResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

class CorrespondanceService {
    /**
     * Envoie une correspondance par email externe
     * TODO: Intégrer avec un service email réel (Resend, SendGrid, etc.)
     */
    async sendCorrespondance(params: SendCorrespondanceParams): Promise<CorrespondanceResult> {
        console.log('📧 [CorrespondanceService] Sending external correspondence...');
        console.log('📧 To:', params.recipientEmail);
        console.log('📧 Subject:', params.subject);

        try {
            // Simulate email sending delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // TODO: Integrate with real email service
            // Example with Resend:
            // const result = await resend.emails.send({
            //     from: 'parlement@gabon.gov.ga',
            //     to: params.recipientEmail,
            //     subject: params.subject,
            //     html: `<p>${params.body}</p>`,
            // });

            // For now, just log and return success
            const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            console.log('✅ [CorrespondanceService] Email sent successfully:', messageId);

            return {
                success: true,
                messageId,
            };
        } catch (error: any) {
            console.error('❌ [CorrespondanceService] Send error:', error);
            return {
                success: false,
                error: error.message || 'Erreur lors de l\'envoi',
            };
        }
    }

    /**
     * Récupère l'historique des envois d'un utilisateur
     */
    async getSentHistory(userId: string): Promise<any[]> {
        try {
            const { data, error } = await (supabase.from as any)('icorrespondance_folders')
                .select('*')
                .eq('user_id', userId)
                .eq('status', 'SENT')
                .order('sent_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('[CorrespondanceService] getSentHistory error:', error);
            return [];
        }
    }

    /**
     * Récupère les statistiques d'envoi
     */
    async getStats(userId: string): Promise<{ sent: number; pending: number; draft: number }> {
        try {
            const { data, error } = await (supabase.from as any)('icorrespondance_folders')
                .select('status')
                .eq('user_id', userId);

            if (error) throw error;

            const folders = data || [];
            return {
                sent: folders.filter((f: any) => f.status === 'SENT').length,
                pending: folders.filter((f: any) => f.status === 'PENDING_APPROVAL').length,
                draft: folders.filter((f: any) => f.status === 'DRAFT').length,
            };
        } catch (error) {
            console.error('[CorrespondanceService] getStats error:', error);
            return { sent: 0, pending: 0, draft: 0 };
        }
    }
}

export const correspondanceService = new CorrespondanceService();
