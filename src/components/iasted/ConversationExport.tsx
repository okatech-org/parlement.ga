import React, { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { generateConversationPDF, downloadConversationPDF, ConversationMessage } from '@/utils/generateConversationPDF';
import { useToast } from '@/hooks/use-toast';

interface ConversationExportProps {
    messages: ConversationMessage[];
    sessionId?: string;
    title?: string;
    tags?: string[];
}

export const ConversationExport: React.FC<ConversationExportProps> = ({
    messages,
    sessionId,
    title = 'Conversation iAsted',
    tags = []
}) => {
    const [isExporting, setIsExporting] = useState(false);
    const { toast } = useToast();

    const handleExport = async () => {
        if (messages.length === 0) {
            toast({
                title: "Aucun message",
                description: "La conversation est vide, rien à exporter.",
                variant: "destructive"
            });
            return;
        }

        setIsExporting(true);
        try {
            const blob = await generateConversationPDF({
                title,
                messages,
                exportDate: new Date().toISOString(),
                sessionId,
                tags
            });

            const filename = `conversation-iasted-${new Date().toISOString().split('T')[0]}.pdf`;
            downloadConversationPDF(blob, filename);

            toast({
                title: "Export réussi",
                description: `${messages.length} messages exportés en PDF.`
            });
        } catch (error) {
            console.error('Export error:', error);
            toast({
                title: "Erreur d'export",
                description: "Impossible de générer le PDF.",
                variant: "destructive"
            });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={isExporting || messages.length === 0}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
            title="Exporter la conversation en PDF"
        >
            {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
            ) : (
                <FileText className="w-4 h-4 text-primary" />
            )}
        </button>
    );
};
