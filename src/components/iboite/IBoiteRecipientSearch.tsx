/**
 * Composant: IBoiteRecipientSearch
 * 
 * Recherche de destinataires iBoîte pour parlement.ga
 * Supporte la recherche d'utilisateurs et services parlementaires
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    Search,
    User,
    Building2,
    Briefcase,
    Mail,
    X,
    Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { iBoiteService } from '@/services/iboite-service';
import type { RecipientType } from '@/types/environments';

// ============================================================
// TYPES
// ============================================================

export interface Recipient {
    type: RecipientType;
    id: string;
    displayName: string;
    subtitle?: string;
    email?: string;
    avatarUrl?: string;
    organizationId?: string;
    organizationName?: string;
}

interface IBoiteRecipientSearchProps {
    onSelect: (recipients: Recipient[]) => void;
    selectedRecipients?: Recipient[];
    multiple?: boolean;
    placeholder?: string;
    className?: string;
    showExternalInput?: boolean;
    disabled?: boolean;
}

// ============================================================
// DEBOUNCE HOOK
// ============================================================

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

// ============================================================
// COMPONENT
// ============================================================

export function IBoiteRecipientSearch({
    onSelect,
    selectedRecipients = [],
    multiple = false,
    placeholder = 'Rechercher un destinataire...',
    className,
    showExternalInput = false,
    disabled = false
}: IBoiteRecipientSearchProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'search' | 'external'>('search');
    const [searchResults, setSearchResults] = useState<Recipient[]>([]);

    // Email externe
    const [externalEmail, setExternalEmail] = useState('');
    const [externalName, setExternalName] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const debouncedQuery = useDebounce(query, 300);

    // Fermer quand on clique en dehors
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Recherche
    useEffect(() => {
        const search = async () => {
            if (!debouncedQuery || debouncedQuery.length < 2) {
                setSearchResults([]);
                return;
            }

            setIsLoading(true);

            try {
                const users = await iBoiteService.searchUsers({ query: debouncedQuery });
                const results: Recipient[] = users.map(user => ({
                    type: 'USER' as RecipientType,
                    id: user.id,
                    displayName: user.name || user.email,
                    subtitle: user.department || 'Utilisateur',
                    email: user.email,
                    avatarUrl: user.avatar
                }));
                setSearchResults(results);
            } catch (error) {
                console.error('[IBoiteRecipientSearch] Search error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        search();
    }, [debouncedQuery]);

    // Sélectionner un destinataire
    const handleSelect = useCallback((recipient: Recipient) => {
        if (multiple) {
            const exists = selectedRecipients.some(r => r.id === recipient.id);
            if (exists) {
                onSelect(selectedRecipients.filter(r => r.id !== recipient.id));
            } else {
                onSelect([...selectedRecipients, recipient]);
            }
        } else {
            onSelect([recipient]);
            setIsOpen(false);
            setQuery('');
        }
    }, [multiple, selectedRecipients, onSelect]);

    // Supprimer un destinataire
    const handleRemove = useCallback((recipientId: string) => {
        onSelect(selectedRecipients.filter(r => r.id !== recipientId));
    }, [selectedRecipients, onSelect]);

    // Ajouter un email externe
    const handleAddExternal = useCallback(() => {
        if (!externalEmail) {
            setEmailError('Veuillez saisir une adresse email');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(externalEmail)) {
            setEmailError('Adresse email invalide');
            return;
        }

        const externalRecipient: Recipient = {
            type: 'EXTERNAL',
            id: `external_${Date.now()}`,
            displayName: externalName || externalEmail,
            subtitle: externalName ? externalEmail : 'Destinataire externe',
            email: externalEmail
        };

        if (multiple) {
            onSelect([...selectedRecipients, externalRecipient]);
        } else {
            onSelect([externalRecipient]);
            setIsOpen(false);
        }

        setExternalEmail('');
        setExternalName('');
        setEmailError(null);
    }, [externalEmail, externalName, multiple, selectedRecipients, onSelect]);

    // Vérifier si un destinataire est sélectionné
    const isSelected = (id: string) => selectedRecipients.some(r => r.id === id);

    // Obtenir les initiales
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Icône selon le type
    const getTypeIcon = (type: RecipientType) => {
        switch (type) {
            case 'USER': return <User className="h-4 w-4" />;
            case 'ORGANIZATION': return <Building2 className="h-4 w-4" />;
            case 'SERVICE': return <Briefcase className="h-4 w-4" />;
            case 'EXTERNAL': return <Mail className="h-4 w-4" />;
            default: return <User className="h-4 w-4" />;
        }
    };

    return (
        <div ref={containerRef} className={cn('relative w-full', className)}>
            {/* Champ de recherche */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    value={query}
                    onChange={e => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                        setActiveTab('search');
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="pl-10"
                    disabled={disabled}
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
            </div>

            {/* Destinataires sélectionnés */}
            {selectedRecipients.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedRecipients.map(recipient => (
                        <Badge
                            key={recipient.id}
                            variant="secondary"
                            className="flex items-center gap-1 pr-1"
                        >
                            {getTypeIcon(recipient.type)}
                            <span className="max-w-[120px] truncate">{recipient.displayName}</span>
                            {!disabled && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                                    onClick={() => handleRemove(recipient.id)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                        </Badge>
                    ))}
                </div>
            )}

            {/* Dropdown de résultats */}
            {isOpen && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg overflow-hidden">
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                        <TabsList className={cn(
                            "w-full rounded-none border-b",
                            showExternalInput ? "grid grid-cols-2" : ""
                        )}>
                            <TabsTrigger value="search" className="text-xs">
                                <Search className="h-3 w-3 mr-1" />
                                Recherche
                            </TabsTrigger>
                            {showExternalInput && (
                                <TabsTrigger value="external" className="text-xs">
                                    <Mail className="h-3 w-3 mr-1" />
                                    Externe
                                </TabsTrigger>
                            )}
                        </TabsList>

                        <ScrollArea className="max-h-[300px]">
                            {/* Onglet Recherche */}
                            <TabsContent value="search" className="m-0">
                                {!query && (
                                    <div className="p-4 text-center text-muted-foreground text-sm">
                                        Tapez un nom pour rechercher...
                                    </div>
                                )}

                                {query && searchResults.length === 0 && !isLoading && (
                                    <div className="p-4 text-center text-muted-foreground text-sm">
                                        Aucun résultat pour "{query}"
                                    </div>
                                )}

                                {searchResults.length > 0 && (
                                    <div className="p-2">
                                        {searchResults.map(result => (
                                            <button
                                                key={result.id}
                                                type="button"
                                                onClick={() => handleSelect(result)}
                                                className={cn(
                                                    'w-full flex items-center gap-3 px-2 py-2 rounded-md text-left transition-colors',
                                                    'hover:bg-muted/50',
                                                    isSelected(result.id) && 'bg-primary/10 hover:bg-primary/20'
                                                )}
                                            >
                                                <Avatar className="h-8 w-8 shrink-0">
                                                    <AvatarImage src={result.avatarUrl} />
                                                    <AvatarFallback className="text-xs">
                                                        {getInitials(result.displayName)}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center">
                                                        <span className={cn(
                                                            'font-medium truncate',
                                                            isSelected(result.id) && 'text-primary'
                                                        )}>
                                                            {result.displayName}
                                                        </span>
                                                    </div>
                                                    {result.subtitle && (
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {result.subtitle}
                                                        </p>
                                                    )}
                                                </div>

                                                {isSelected(result.id) && (
                                                    <div className="shrink-0 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                                        <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            {/* Onglet Email Externe */}
                            {showExternalInput && (
                                <TabsContent value="external" className="m-0 p-4">
                                    <div className="space-y-3">
                                        <div className="text-sm font-medium flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Ajouter un destinataire externe
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Envoyez un email à une personne externe.
                                        </p>
                                        <Input
                                            type="email"
                                            placeholder="exemple@domaine.com"
                                            value={externalEmail}
                                            onChange={e => {
                                                setExternalEmail(e.target.value);
                                                setEmailError(null);
                                            }}
                                        />
                                        <Input
                                            placeholder="Nom (optionnel)"
                                            value={externalName}
                                            onChange={e => setExternalName(e.target.value)}
                                        />
                                        {emailError && (
                                            <p className="text-xs text-destructive">{emailError}</p>
                                        )}
                                        <Button
                                            size="sm"
                                            className="w-full"
                                            onClick={handleAddExternal}
                                        >
                                            <Mail className="h-4 w-4 mr-2" />
                                            Ajouter ce destinataire
                                        </Button>
                                    </div>
                                </TabsContent>
                            )}
                        </ScrollArea>
                    </Tabs>
                </div>
            )}
        </div>
    );
}

export default IBoiteRecipientSearch;
