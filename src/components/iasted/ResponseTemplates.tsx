import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileText, 
    Plus, 
    X, 
    Edit, 
    Trash2, 
    Copy, 
    Check,
    ChevronDown,
    ChevronRight,
    Save,
    FolderOpen
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Template {
    id: string;
    name: string;
    content: string;
    category: string;
    createdAt: string;
}

interface ResponseTemplatesProps {
    onSelectTemplate: (content: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

const DEFAULT_CATEGORIES = [
    'Général',
    'Législatif',
    'Administratif',
    'Communication',
    'Finance',
    'Autre'
];

const STORAGE_KEY = 'iasted-response-templates';

export const ResponseTemplates: React.FC<ResponseTemplatesProps> = ({
    onSelectTemplate,
    isOpen,
    onClose
}) => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<string[]>(['Général']);
    const [newTemplate, setNewTemplate] = useState({ name: '', content: '', category: 'Général' });
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const { toast } = useToast();

    // Load templates from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setTemplates(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load templates:', e);
            }
        } else {
            // Set default templates
            const defaults: Template[] = [
                {
                    id: '1',
                    name: 'Demande de rapport',
                    content: 'Pouvez-vous me préparer un rapport détaillé sur [sujet] incluant les points clés et les recommandations?',
                    category: 'Général',
                    createdAt: new Date().toISOString()
                },
                {
                    id: '2',
                    name: 'Analyse de texte législatif',
                    content: 'Analysez ce texte de loi et identifiez les points principaux, les implications et les éventuelles contradictions avec la législation existante.',
                    category: 'Législatif',
                    createdAt: new Date().toISOString()
                },
                {
                    id: '3',
                    name: 'Rédaction de communiqué',
                    content: 'Rédigez un communiqué officiel concernant [sujet] en adoptant un ton [formel/accessible] pour une diffusion [interne/externe].',
                    category: 'Communication',
                    createdAt: new Date().toISOString()
                },
                {
                    id: '4',
                    name: 'Synthèse budgétaire',
                    content: 'Faites une synthèse du budget [année/période] en mettant en évidence les postes principaux et les variations significatives.',
                    category: 'Finance',
                    createdAt: new Date().toISOString()
                }
            ];
            setTemplates(defaults);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
        }
    }, []);

    // Save templates to localStorage
    const saveTemplates = (newTemplates: Template[]) => {
        setTemplates(newTemplates);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTemplates));
    };

    const handleAddTemplate = () => {
        if (!newTemplate.name.trim() || !newTemplate.content.trim()) {
            toast({
                title: "Champs requis",
                description: "Le nom et le contenu sont obligatoires.",
                variant: "destructive"
            });
            return;
        }

        const template: Template = {
            id: Date.now().toString(),
            name: newTemplate.name.trim(),
            content: newTemplate.content.trim(),
            category: newTemplate.category,
            createdAt: new Date().toISOString()
        };

        saveTemplates([...templates, template]);
        setNewTemplate({ name: '', content: '', category: 'Général' });
        setIsAddingNew(false);

        toast({
            title: "Template créé",
            description: `"${template.name}" a été ajouté.`
        });
    };

    const handleDeleteTemplate = (id: string) => {
        const template = templates.find(t => t.id === id);
        saveTemplates(templates.filter(t => t.id !== id));
        toast({
            title: "Template supprimé",
            description: `"${template?.name}" a été supprimé.`
        });
    };

    const handleEditTemplate = (id: string, updates: Partial<Template>) => {
        saveTemplates(templates.map(t => t.id === id ? { ...t, ...updates } : t));
        setEditingId(null);
        toast({
            title: "Template modifié",
            description: "Les modifications ont été enregistrées."
        });
    };

    const handleUseTemplate = (template: Template) => {
        onSelectTemplate(template.content);
        onClose();
        toast({
            title: "Template appliqué",
            description: `"${template.name}" a été inséré.`
        });
    };

    const handleCopyTemplate = (template: Template) => {
        navigator.clipboard.writeText(template.content);
        setCopiedId(template.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const groupedTemplates = DEFAULT_CATEGORIES.reduce((acc, category) => {
        acc[category] = templates.filter(t => t.category === category);
        return acc;
    }, {} as Record<string, Template[]>);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-background border border-border rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <FolderOpen className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-foreground">Templates de réponse</h2>
                                <p className="text-xs text-muted-foreground">{templates.length} templates disponibles</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsAddingNew(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Nouveau
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 overflow-y-auto max-h-[60vh]">
                        {/* Add new template form */}
                        <AnimatePresence>
                            {isAddingNew && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mb-4 p-4 border border-primary/20 rounded-xl bg-primary/5"
                                >
                                    <h3 className="font-medium mb-3">Nouveau template</h3>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            placeholder="Nom du template..."
                                            value={newTemplate.name}
                                            onChange={e => setNewTemplate(p => ({ ...p, name: e.target.value }))}
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                                        />
                                        <textarea
                                            placeholder="Contenu du template..."
                                            value={newTemplate.content}
                                            onChange={e => setNewTemplate(p => ({ ...p, content: e.target.value }))}
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm min-h-[100px] resize-none"
                                        />
                                        <select
                                            value={newTemplate.category}
                                            onChange={e => setNewTemplate(p => ({ ...p, category: e.target.value }))}
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                                        >
                                            {DEFAULT_CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => {
                                                    setIsAddingNew(false);
                                                    setNewTemplate({ name: '', content: '', category: 'Général' });
                                                }}
                                                className="px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm"
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                onClick={handleAddTemplate}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
                                            >
                                                <Save className="w-4 h-4" />
                                                Enregistrer
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Templates by category */}
                        <div className="space-y-2">
                            {DEFAULT_CATEGORIES.map(category => {
                                const categoryTemplates = groupedTemplates[category];
                                if (categoryTemplates.length === 0) return null;

                                const isExpanded = expandedCategories.includes(category);

                                return (
                                    <div key={category} className="border border-border rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => toggleCategory(category)}
                                            className="w-full flex items-center justify-between p-3 bg-muted/50 hover:bg-muted transition-colors"
                                        >
                                            <span className="font-medium text-sm">{category}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full">
                                                    {categoryTemplates.length}
                                                </span>
                                                {isExpanded ? (
                                                    <ChevronDown className="w-4 h-4" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4" />
                                                )}
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: 'auto' }}
                                                    exit={{ height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-2 space-y-2">
                                                        {categoryTemplates.map(template => (
                                                            <div
                                                                key={template.id}
                                                                className="p-3 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors group"
                                                            >
                                                                {editingId === template.id ? (
                                                                    <div className="space-y-2">
                                                                        <input
                                                                            type="text"
                                                                            defaultValue={template.name}
                                                                            className="w-full px-2 py-1 rounded border border-border bg-muted text-sm"
                                                                            id={`edit-name-${template.id}`}
                                                                        />
                                                                        <textarea
                                                                            defaultValue={template.content}
                                                                            className="w-full px-2 py-1 rounded border border-border bg-muted text-sm min-h-[80px] resize-none"
                                                                            id={`edit-content-${template.id}`}
                                                                        />
                                                                        <div className="flex gap-2 justify-end">
                                                                            <button
                                                                                onClick={() => setEditingId(null)}
                                                                                className="px-2 py-1 rounded bg-muted hover:bg-muted/80 text-xs"
                                                                            >
                                                                                Annuler
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    const nameEl = document.getElementById(`edit-name-${template.id}`) as HTMLInputElement;
                                                                                    const contentEl = document.getElementById(`edit-content-${template.id}`) as HTMLTextAreaElement;
                                                                                    handleEditTemplate(template.id, {
                                                                                        name: nameEl?.value || template.name,
                                                                                        content: contentEl?.value || template.content
                                                                                    });
                                                                                }}
                                                                                className="px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
                                                                            >
                                                                                Sauvegarder
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <div className="flex items-start justify-between">
                                                                            <h4 className="font-medium text-sm">{template.name}</h4>
                                                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                <button
                                                                                    onClick={() => handleCopyTemplate(template)}
                                                                                    className="p-1 hover:bg-muted rounded"
                                                                                    title="Copier"
                                                                                >
                                                                                    {copiedId === template.id ? (
                                                                                        <Check className="w-3.5 h-3.5 text-success" />
                                                                                    ) : (
                                                                                        <Copy className="w-3.5 h-3.5" />
                                                                                    )}
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => setEditingId(template.id)}
                                                                                    className="p-1 hover:bg-muted rounded"
                                                                                    title="Modifier"
                                                                                >
                                                                                    <Edit className="w-3.5 h-3.5" />
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDeleteTemplate(template.id)}
                                                                                    className="p-1 hover:bg-destructive/10 text-destructive rounded"
                                                                                    title="Supprimer"
                                                                                >
                                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                                            {template.content}
                                                                        </p>
                                                                        <button
                                                                            onClick={() => handleUseTemplate(template)}
                                                                            className="mt-2 text-xs text-primary hover:underline"
                                                                        >
                                                                            Utiliser ce template →
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>

                        {templates.length === 0 && !isAddingNew && (
                            <div className="text-center py-8 text-muted-foreground">
                                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Aucun template</p>
                                <button
                                    onClick={() => setIsAddingNew(true)}
                                    className="mt-2 text-primary hover:underline text-sm"
                                >
                                    Créer votre premier template
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
