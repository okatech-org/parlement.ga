/**
 * Génère un PDF de l'historique complet d'une conversation iAsted
 */

import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

let fontsInitialized = false;

function initializeFonts() {
    if (!fontsInitialized) {
        let vfs: any = undefined;
        if (pdfFonts && Object.keys(pdfFonts).some(k => k.endsWith('.ttf'))) {
            vfs = pdfFonts;
        } else if ((pdfFonts as any).default && Object.keys((pdfFonts as any).default).some((k: string) => k.endsWith('.ttf'))) {
            vfs = (pdfFonts as any).default;
        } else {
            vfs = (pdfFonts as any).pdfMake?.vfs
                || (pdfFonts as any).vfs
                || (pdfFonts as any).default?.pdfMake?.vfs
                || (pdfFonts as any).default?.vfs
                || (window as any).pdfMake?.vfs;
        }

        if (vfs) {
            (pdfMake as any).vfs = vfs;
            (pdfMake as any).fonts = {
                Roboto: {
                    normal: 'Roboto-Regular.ttf',
                    bold: 'Roboto-Medium.ttf',
                    italics: 'Roboto-Italic.ttf',
                    bolditalics: 'Roboto-MediumItalic.ttf'
                }
            };
            fontsInitialized = true;
        }
    }
}

export interface ConversationMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export interface ConversationExportData {
    title: string;
    messages: ConversationMessage[];
    exportDate: string;
    sessionId?: string;
    tags?: string[];
}

export async function generateConversationPDF(data: ConversationExportData): Promise<Blob> {
    initializeFonts();

    const currentDate = new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const content: any[] = [];

    // Header
    content.push({
        columns: [
            {
                stack: [
                    { text: 'iAsted', style: 'brand', color: '#10b981' },
                    { text: 'Assistant Intelligent', style: 'subtitle', color: '#6b7280' }
                ]
            },
            {
                stack: [
                    { text: `Exporté le ${currentDate}`, alignment: 'right', style: 'exportDate' }
                ],
                width: 'auto'
            }
        ],
        margin: [0, 0, 0, 20]
    });

    // Title
    content.push({
        text: data.title || 'Conversation iAsted',
        style: 'title',
        margin: [0, 0, 0, 10]
    });

    // Tags if any
    if (data.tags && data.tags.length > 0) {
        content.push({
            text: `Tags: ${data.tags.join(', ')}`,
            style: 'tags',
            margin: [0, 0, 0, 15]
        });
    }

    // Separator
    content.push({
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e5e7eb' }],
        margin: [0, 5, 0, 20]
    });

    // Messages
    data.messages.forEach((message, index) => {
        const isUser = message.role === 'user';
        const timestamp = new Date(message.timestamp).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        content.push({
            columns: [
                {
                    width: 60,
                    stack: [
                        {
                            text: isUser ? '👤 Vous' : '🤖 iAsted',
                            style: isUser ? 'userLabel' : 'assistantLabel',
                            alignment: 'left'
                        },
                        {
                            text: timestamp,
                            style: 'timestamp',
                            alignment: 'left'
                        }
                    ]
                },
                {
                    width: '*',
                    stack: [
                        {
                            text: message.content,
                            style: 'messageContent',
                            margin: [10, 0, 0, 0]
                        }
                    ]
                }
            ],
            margin: [0, 0, 0, 15]
        });

        // Separator between messages
        if (index < data.messages.length - 1) {
            content.push({
                canvas: [{ type: 'line', x1: 60, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#f3f4f6' }],
                margin: [0, 0, 0, 15]
            });
        }
    });

    // Footer info
    content.push({
        text: '',
        margin: [0, 30, 0, 0]
    });

    content.push({
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e5e7eb' }],
        margin: [0, 0, 0, 15]
    });

    content.push({
        columns: [
            {
                text: `Total: ${data.messages.length} messages`,
                style: 'footerText'
            },
            {
                text: data.sessionId ? `Session: ${data.sessionId.substring(0, 8)}...` : '',
                style: 'footerText',
                alignment: 'right'
            }
        ]
    });

    const docDefinition: any = {
        content,
        defaultStyle: {
            font: 'Roboto',
            fontSize: 10
        },
        styles: {
            brand: {
                fontSize: 20,
                bold: true
            },
            subtitle: {
                fontSize: 10,
                italics: true
            },
            exportDate: {
                fontSize: 9,
                color: '#6b7280'
            },
            title: {
                fontSize: 16,
                bold: true,
                color: '#1f2937'
            },
            tags: {
                fontSize: 9,
                color: '#6b7280',
                italics: true
            },
            userLabel: {
                fontSize: 9,
                bold: true,
                color: '#3b82f6'
            },
            assistantLabel: {
                fontSize: 9,
                bold: true,
                color: '#10b981'
            },
            timestamp: {
                fontSize: 8,
                color: '#9ca3af'
            },
            messageContent: {
                fontSize: 10,
                lineHeight: 1.4,
                color: '#374151'
            },
            footerText: {
                fontSize: 8,
                color: '#9ca3af'
            }
        },
        pageSize: 'A4',
        pageMargins: [40, 40, 40, 40]
    };

    return new Promise((resolve, reject) => {
        try {
            const pdfDocGenerator = pdfMake.createPdf(docDefinition);
            pdfDocGenerator.getBlob((blob: Blob) => {
                resolve(blob);
            });
        } catch (error) {
            reject(error);
        }
    });
}

export function downloadConversationPDF(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
