import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Paperclip, Mic, Sparkles, Loader2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

interface ChatInterfaceProps {
    isExpanded: boolean;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/iasted-chat`;

export function ChatInterface({ isExpanded }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Bonjour ! Je suis iAsted, votre assistant IA. Je peux répondre à vos questions sur les démarches parlementaires ou vous mettre en relation avec un agent humain. Comment puis-je vous aider ?',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isAiMode, setIsAiMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { user } = useUser();

    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        if (!isAiMode) {
            // Mode humain - réponse simulée
            setTimeout(() => {
                const responseMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: "Un agent va prendre en charge votre demande dans quelques instants...",
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, responseMsg]);
            }, 1000);
            return;
        }

        // Mode IA - appel OpenRouter avec streaming
        setIsLoading(true);
        
        const apiMessages = messages
            .filter(m => m.role !== 'system')
            .map(m => ({ role: m.role, content: m.content }));
        apiMessages.push({ role: 'user', content: inputValue });

        try {
            const resp = await fetch(CHAT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
                },
                body: JSON.stringify({ messages: apiMessages })
            });

            if (!resp.ok) {
                const errorData = await resp.json().catch(() => ({}));
                throw new Error(errorData.error || `Erreur ${resp.status}`);
            }

            if (!resp.body) throw new Error('Pas de réponse');

            const reader = resp.body.getReader();
            const decoder = new TextDecoder();
            let textBuffer = '';
            let assistantContent = '';
            const assistantMsgId = (Date.now() + 1).toString();

            // Créer le message assistant vide
            setMessages(prev => [...prev, {
                id: assistantMsgId,
                role: 'assistant',
                content: '',
                timestamp: new Date()
            }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                textBuffer += decoder.decode(value, { stream: true });

                let newlineIndex: number;
                while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
                    let line = textBuffer.slice(0, newlineIndex);
                    textBuffer = textBuffer.slice(newlineIndex + 1);

                    if (line.endsWith('\r')) line = line.slice(0, -1);
                    if (line.startsWith(':') || line.trim() === '') continue;
                    if (!line.startsWith('data: ')) continue;

                    const jsonStr = line.slice(6).trim();
                    if (jsonStr === '[DONE]') break;

                    try {
                        const parsed = JSON.parse(jsonStr);
                        const content = parsed.choices?.[0]?.delta?.content;
                        if (content) {
                            assistantContent += content;
                            setMessages(prev => prev.map(m => 
                                m.id === assistantMsgId 
                                    ? { ...m, content: assistantContent }
                                    : m
                            ));
                        }
                    } catch {
                        // JSON incomplet, on attend plus de données
                        textBuffer = line + '\n' + textBuffer;
                        break;
                    }
                }
            }

            // Flush final
            if (textBuffer.trim()) {
                for (let raw of textBuffer.split('\n')) {
                    if (!raw || !raw.startsWith('data: ')) continue;
                    const jsonStr = raw.slice(6).trim();
                    if (jsonStr === '[DONE]') continue;
                    try {
                        const parsed = JSON.parse(jsonStr);
                        const content = parsed.choices?.[0]?.delta?.content;
                        if (content) {
                            assistantContent += content;
                            setMessages(prev => prev.map(m => 
                                m.id === assistantMsgId 
                                    ? { ...m, content: assistantContent }
                                    : m
                            ));
                        }
                    } catch { /* ignore */ }
                }
            }

        } catch (error) {
            console.error('Chat error:', error);
            toast.error(error instanceof Error ? error.message : 'Erreur de connexion');
            
            // Fallback message
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Désolé, je rencontre des difficultés techniques. Voulez-vous parler à un agent humain ?",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-muted/10">
            {/* Mode Switcher */}
            <div className="px-4 py-2 bg-background border-b flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Mode actuel :</span>
                <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                    <button
                        onClick={() => setIsAiMode(true)}
                        className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${isAiMode ? 'bg-white shadow text-primary font-medium' : 'hover:text-primary'}`}
                    >
                        <Sparkles className="w-3 h-3" /> IA
                    </button>
                    <button
                        onClick={() => setIsAiMode(false)}
                        className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${!isAiMode ? 'bg-white shadow text-primary font-medium' : 'hover:text-primary'}`}
                    >
                        <User className="w-3 h-3" /> Humain
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="flex flex-col gap-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <Avatar className="w-8 h-8 border shrink-0">
                                {msg.role === 'assistant' ? (
                                    <AvatarFallback className={isAiMode ? "bg-primary text-primary-foreground" : "bg-orange-500 text-white"}>
                                        {isAiMode ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                    </AvatarFallback>
                                ) : (
                                    <AvatarFallback className="bg-accent">{user?.name?.[0] || 'U'}</AvatarFallback>
                                )}
                            </Avatar>
                            <div className={`flex flex-col gap-1 max-w-[80%]`}>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-muted-foreground">
                                        {msg.role === 'assistant' ? (isAiMode ? 'iAsted' : 'Agent Support') : 'Vous'}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground opacity-50">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div
                                    className={`p-3 rounded-2xl text-sm ${msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                                            : 'bg-white border shadow-sm rounded-tl-none'
                                        }`}
                                >
                                    {msg.content || (isLoading && msg.role === 'assistant' ? (
                                        <span className="flex items-center gap-2 text-muted-foreground">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Réflexion...
                                        </span>
                                    ) : null)}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.role === 'user' && (
                        <div className="flex gap-3">
                            <Avatar className="w-8 h-8 border shrink-0">
                                <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="w-4 h-4" /></AvatarFallback>
                            </Avatar>
                            <div className="bg-white border shadow-sm rounded-2xl rounded-tl-none p-3 flex gap-1 items-center">
                                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-background border-t flex gap-2 items-end">
                <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground">
                    <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                    placeholder={isAiMode ? "Posez une question à iAsted..." : "Écrivez à un agent..."}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    className="flex-1 bg-muted/30"
                    disabled={isLoading}
                />
                <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground">
                    <Mic className="w-5 h-5" />
                </Button>
                <Button size="icon" onClick={handleSend} disabled={!inputValue.trim() || isLoading} className="shrink-0">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
            </div>
        </div>
    );
}
