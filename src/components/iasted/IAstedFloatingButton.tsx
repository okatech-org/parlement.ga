/**
 * IAstedFloatingButton - Bouton flottant iAsted pour le Parlement
 * Intègre le bouton animé avec le modal de chat et la voix WebRTC
 */

import { useState, useEffect } from 'react';
import { IAstedButtonFull } from './IAstedButtonFull';
import { useRealtimeVoiceWebRTC } from '@/hooks/useRealtimeVoiceWebRTC';
import { IASTED_SYSTEM_PROMPT } from '@/config/iasted-config';

// Lazy load du modal pour éviter les dépendances circulaires
const LazyIAstedChatModal = ({ isOpen, onClose, openaiRTC }: {
    isOpen: boolean;
    onClose: () => void;
    openaiRTC: ReturnType<typeof useRealtimeVoiceWebRTC>;
}) => {
    // Import dynamique pour éviter le bundle initial trop gros
    const [ChatModal, setChatModal] = useState<React.ComponentType<any> | null>(null);

    useEffect(() => {
        if (isOpen && !ChatModal) {
            import('./IAstedChatModal').then(mod => {
                setChatModal(() => mod.IAstedChatModal);
            });
        }
    }, [isOpen, ChatModal]);

    if (!isOpen || !ChatModal) return null;

    return (
        <ChatModal
            isOpen={isOpen}
            onClose={onClose}
            openaiRTC={openaiRTC}
            systemPrompt={IASTED_SYSTEM_PROMPT}
            userRole="deputy" // TODO: Get from UserContext
        />
    );
};

interface IAstedFloatingButtonProps {
    className?: string;
}

export const IAstedFloatingButton = ({ className }: IAstedFloatingButtonProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Hook WebRTC pour la voix - initialisé au niveau du bouton flottant
    const openaiRTC = useRealtimeVoiceWebRTC();

    // Dériver les états depuis voiceState
    const isListening = openaiRTC.voiceState === 'listening';
    const isSpeaking = openaiRTC.voiceState === 'speaking';
    const isProcessing = openaiRTC.voiceState === 'thinking' || openaiRTC.voiceState === 'connecting';

    // Double-click ouvre le modal de chat
    const handleDoubleClick = () => {
        setIsModalOpen(true);
    };

    // Single click active/désactive la voix
    const handleSingleClick = () => {
        if (openaiRTC.isConnected) {
            openaiRTC.disconnect();
        } else {
            openaiRTC.connect('ash', IASTED_SYSTEM_PROMPT);
        }
    };

    // Fermer le modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {/* Bouton flottant en bas à droite */}
            <div className={`fixed bottom-6 right-6 z-50 ${className || ''}`}>
                <IAstedButtonFull
                    voiceListening={isListening}
                    voiceSpeaking={isSpeaking}
                    voiceProcessing={isProcessing}
                    onSingleClick={handleSingleClick}
                    onDoubleClick={handleDoubleClick}
                    size="lg"
                    isInterfaceOpen={isModalOpen}
                    audioLevel={openaiRTC.audioLevel}
                />
            </div>

            {/* Modal de chat (lazy loaded) */}
            <LazyIAstedChatModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                openaiRTC={openaiRTC}
            />
        </>
    );
};

export default IAstedFloatingButton;
